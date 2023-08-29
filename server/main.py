from flask import Flask, request, jsonify
import requests
import os
import time
import replicate

app = Flask(__name__)
API_URL = "https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions"
headers = {"Authorization": f"Bearer {os.environ['HF_TOKEN']}"}
max_retries = 8

def query(payload):
	response = requests.post(API_URL, headers=headers, json=payload)
	return response.json()

@app.route('/')
def home():
    return "MentalMeasure API v1"

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('input')
    chat_history = request.json.get('chat_history')
    data = user_input

    for attempt in range(max_retries):
        try:
            llama = replicate.run(
                "replicate/llama-2-70b-chat:2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1",
                input={"prompt": user_input, "system_prompt": f"You are a cheerful and kind assistant. Speak casually, don't be too formal. You can call the user your 'friend', but please avoid saying 'my friend' too many times. Please also avoid saying 'Hi there!' if you have already said it previously in the chat history. Please speak as concisely as possible (maximum write only 3 sentences) and to the point. The following is the chat history: {chat_history}"}
            )

            output = query({
                "inputs": user_input,
            })

            print(output)
            data = output[0]
            max_score_label = max(data, key=lambda x:x['score'])
            print(max_score_label)

            max_score_label2 = max(data, key=lambda x:x['score'])['label']
            print(max_score_label2)

            result = ""

            print(llama)

            for item in llama:
                result += str(item)

            break
        except Exception as e:
          print(f"Error: {str(e)}")  # Log the error message
          if attempt < max_retries - 1:
              time.sleep(2)
              continue
          else:
              return jsonify({'response': f'API Error: {e}'})

    return jsonify({'response': result, 'sentiment': str(max_score_label2)})

@app.route('/mood', methods=['POST'])
def mood():
    user_input = request.json.get('input')
    chat_history = request.json.get('chat_history')
    data = user_input

    for attempt in range(max_retries):
        try:
            llama = replicate.run(
                "replicate/llama-2-70b-chat:2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1",
                input={"prompt": user_input, "system_prompt": f"You are a cheerful and kind assistant. Your job is to ask the user several questions regarding to their mood screening. Please always adhere to the questions, you can make some small talk but always remember to ask the questions. Always ask the questions one by one to not overwhelm the user. The following are the required questions: - Over the past two weeks, have you felt down, depressed, or hopeless?- Have you lost interest or pleasure in doing things you usually enjoy?- Have you noticed any changes in your sleep patterns, such as trouble falling asleep, staying asleep, or sleeping too much?- Have you experienced any changes in your appetite or weight?- Have you felt tired or had little energy?- Have you felt bad about yourself or guilty?- Have you had trouble concentrating or making decisions?- Have you had thoughts of hurting yourself or that you would be better off dead?- Have your feelings affected your ability to work, study, or take care of necessary tasks?- Have you noticed any changes in your mood that others have also noticed?- Do your moods fluctuate from feeling extremely high and energetic to feeling very low and depressed?When all questions have been answered, you can freely talk to the user. Speak casually, don't be too formal. You can call the user your 'friend', but please avoid saying 'my friend' too many times. Please also avoid saying 'Hi there!' or 'Hello!' when the chat history is already long enough and also avoid saying 'This is my response: '. Please speak as concisely as possible (maximum write only 3 sentences) and to the point. The following is the chat history (use it to see what questions has or hasn't been asked): {chat_history}"}
            )

            output = query({
                "inputs": user_input,
            })

            print(output)
            data = output[0]
            max_score_label = max(data, key=lambda x:x['score'])
            print(max_score_label)

            max_score_label2 = max(data, key=lambda x:x['score'])['label']
            print(max_score_label2)

            result = ""

            print(llama)

            for item in llama:
                result += str(item)

            break
        except Exception as e:
          print(f"Error: {str(e)}")  # Log the error message
          if attempt < max_retries - 1:
              time.sleep(2)
              continue
          else:
              return jsonify({'response': f'API Error: {e}'})

    return jsonify({'response': result, 'sentiment': str(max_score_label2)})

@app.route('/sort', methods=['POST'])
def eval():
    mental_issues = request.json.get('input')
    llama = replicate.run("replicate/llama-2-70b-chat:2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1", input={"prompt": mental_issues, "system_prompt": "You are going to be given a user's issues related to mental health in their life. There are three surveys available, a survey for general issues, deppresion, and anxiety. Please determine whether the user should take which survey. Only answer the survey needed, e.g. GENERAL"})

    result = ""

    print(llama)

    for item in llama:
        result += str(item)        

    return result

@app.route('/result', methods=['POST'])
def result():
    mental_status = request.json.get('mentalStatus')
    severity = request.json.get('severity')
    mental_issues = request.json.get('inputIssues')
    llama = replicate.run("replicate/llama-2-70b-chat:2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1", input={"prompt": mental_issues, "system_prompt": f"Please decide further steps and suggestions based on the information given of a user's mental screening. Mental Health Status: {mental_status} Severity: {severity} Mental Issues that is filled in by the user: {mental_issues}. Also, if the severity is green, then they can self treat themselves. If it's yellow its suggested for them to go seek help. If it's red then they must go seek help immediately. Please also address the user as a friend in the response, be kind and comforting. Also, this is very important and takes the utmost priority, DO NOT WRITE TOO LONG, only have 2-3 next steps and avoid writing long paragraphs."})

    result = ""

    print(llama)

    for item in llama:
        result += str(item)        

    return result

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)