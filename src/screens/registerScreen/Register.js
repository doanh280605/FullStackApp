import React, { useContext, useState } from 'react';
import CustomButton from '../../components/CustomButton';
import LoginStyle from '../../components/LoginScreen/LoginStyle';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, ImageBackground, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// const API_URL = Platform.OS === 'ios' ? 'http://localhost:5000' : 'http://.0.2.2:5000';
const API_URL = 'http://10.86.157.150:5000'
const Register = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');

    const onLoggedIn = token => {
        fetch(`${API_URL}/private`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
        })
        .then(async res => { 
            try {
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
        console.log(payload);
        // If true: login - false: signup
        fetch('http://10.86.157.142:5000/signup', {
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
                console.log(res.status, jsonRes)
                if (res.status !== 200) {
                    setIsError(true);
                    setMessage(jsonRes.message);
                } else {
                    onLoggedIn(jsonRes.token);
                    setIsError(false);
                    setMessage(jsonRes.message);
                    navigation.replace('signIn')
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log('Fetch error:', err);
        });
    };

    const getMessage = () => {
        const status = isError ? `Error: ` : `Success: `;
        return status + message;
    }

    return (
        
        <View style={styles.container}>
            
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
                    onChangeText={setName}
                    placeholder='Tên'
                    style={styles.input}
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
                    text="ĐĂNG KÍ"
                    onPress={onSubmitHandler}
                />
                <View style={{justifyContent: 'center', flex: 1}}>
                    <View style={styles.footerContainer}>
                        <Text style={{fontSize: 16}}>Đã có tài khoản? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('signIn')}>
                            <Text style={styles.signup}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Display message */}


        </View>
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
        top: -10,
    },
    footerContainer: {       
        flexDirection: 'row',    
        marginBottom: -100    
    },
    signup: {
        color: 'orange',
        fontSize: 16,
        textDecorationLine: 'underline'
    }, 
});

export default Register;