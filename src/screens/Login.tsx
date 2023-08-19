import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

function LoginScreen({ navigation }) {
    const [countryCode, setCountryCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [confirm, setConfirm] = useState(null);
    const [code, setCode] = useState('');
    const [resendEnabled, setResendEnabled] = useState(true);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(user => {
            if (user) {
                navigation.navigate('Home');
            }
        });

        return unsubscribe;
    }, [navigation]);

    const signInWithPhoneNumber = async (phoneNumber) => {
        try {
            const fullPhoneNumber = `${countryCode}${phoneNumber}`;
            const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);
            setConfirm(confirmation);
            setResendEnabled(false);
            setTimeout(() => {
                setResendEnabled(true);
            }, 10000);
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    const confirmCode = async () => {
        try {
            await confirm.confirm(code);
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    if (!confirm) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Phone Verification</Text>
                <View style={styles.phoneInputContainer}>
                    <TextInput
                        style={styles.countryCodeInput}
                        placeholder="+62"
                        value={countryCode}
                        onChangeText={setCountryCode}
                        placeholderTextColor="#999"
                        maxLength={4}
                    />
                    <TextInput
                        style={styles.phoneInput}
                        placeholder="1234567890"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholderTextColor="#999"
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={() => signInWithPhoneNumber(phoneNumber)} disabled={!resendEnabled}>
                    <Text style={styles.buttonText}>Send Verification Code</Text>
                </TouchableOpacity>
                {!resendEnabled && <Text style={styles.resendText}>You can resend the code in 10 seconds...</Text>}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter Verification Code</Text>
            <TextInput
                style={styles.verificationCodeInput}
                placeholder="Verification code"
                value={code}
                onChangeText={setCode}
                placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.button} onPress={confirmCode}>
                <Text style={styles.buttonText}>Confirm Verification Code</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'black',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 48,
        color: 'white',
    },
    phoneInputContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    countryCodeInput: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
        color: 'white',
    },
    phoneInput: {
        flex: 3,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: 'white',
    },
    verificationCodeInput: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: 'white',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#1e90ff',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    resendText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default LoginScreen;
