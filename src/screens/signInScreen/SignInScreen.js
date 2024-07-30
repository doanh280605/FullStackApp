import React, { useState } from 'react';
import LoginStyle from '../../components/LoginScreen/LoginStyle';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, useWindowDimensions, Keyboard, KeyboardAvoidingView, Linking } from 'react-native';
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
// const API_URL = Platform.OS === 'ios' ? 'http://localhost:5000' : 'http://.0.2.2:5000';
const API_URL = 'http://10.86.157.221:5000'
const SignInScreen = () => {

    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');

    const register = () => {
        navigation.navigate('register')
    }
    // const [isLogin, setIsLogin] = useState(true);

    // const onChangeHandler = () => {
    //     setIsLogin(!isLogin);
    //     setMessage('');
    // };

    const onLoggedIn = async (token) => {
        fetch(`${API_URL}/private`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(async res => {
                try {
                    await AsyncStorage.setItem('userToken', token)
                    const jsonRes = await res.json();
                    if (res.status === 200) {
                        setMessage(jsonRes.message);
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    }

    const onSubmitHandler = () => {
        const payload = {
            email,
            name,
            password,
        };
        // If true: login - false: signup
        fetch(`http://192.168.1.13:5000/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(async res => {
                try {
                    const jsonRes = await res.json();
                    if (res.status !== 200) {
                        setIsError(true);
                        setMessage(jsonRes.message);
                    } else {
                        onLoggedIn(jsonRes.token);
                        setIsError(false);
                        setMessage(jsonRes.message);
                        await AsyncStorage.setItem('userToken', jsonRes.token)
                        navigation.replace('home', { token: jsonRes.token });
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    };

    const getMessage = () => {
        const status = isError ? `Error: ` : `Success: `;
        return status + message;
    }


    return (

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >

            <LoginStyle />

            <View style={styles.textinput}>
                {/* Input fields */}
                <TextInput
                    onChangeText={setEmail}
                    placeholder="Email"
                    style={styles.input}
                    autoCapitalize='none'
                />
                <TextInput
                    onChangeText={setPassword}
                    placeholder='Mật khẩu'
                    style={styles.input}
                    secureTextEntry={true}
                />

                <Text style={[styles.message, { color: isError ? 'red' : 'green' }]}>
                    {message ? getMessage() : null}
                </Text>

                <CustomButton
                    text="ĐĂNG NHẬP"
                    onPress={onSubmitHandler}
                />
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    <View style={styles.footerContainer}>
                        <Text style={{ fontSize: 16 }}>Bạn chưa có tài khoản? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('register')}>
                            <Text style={styles.signup}>Đăng kí</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Display message */}


        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    message: {
        fontSize: 16,
        marginTop: 10,
        textDecorationLine: 'underline'
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 20,
        fontWeight: 'bold',
        fontSize: 17,
        width: '85%',
        paddingHorizontal: 10,
    },
    textinput: {
        flex: 1,
        width: '85%',
        alignItems: 'center',
        top: -10
    },
    footerContainer: {
        flexDirection: 'row',
        marginBottom: -170
    },
    signup: {
        color: 'orange',
        fontSize: 16,
        textDecorationLine: 'underline'
    },
});

export default SignInScreen;