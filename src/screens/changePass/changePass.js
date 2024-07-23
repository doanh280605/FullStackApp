import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {View, Text, StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import CustomButton from "../../components/CustomButton";
import LoginStyle from "../../components/LoginScreen/LoginStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChangePass = () => {
    const navigation = useNavigation();

    const [newPassword, setNewPassword] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [token, setToken] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            const storeToken = await AsyncStorage.getItem('userToken');
            setToken(storeToken);
        }

        fetchToken();
    }, [])

    const onSubmitHandler = async () => {
        if (newPassword !== password) {
            setIsError(true);
            setMessage('New passwords do not match');
            return;
        }

        const payload = {
            newPassword, 
            confirmNewPassword: newPassword,
        };
        // If true: login - false: signup
        fetch(`http://10.86.156.122:5000/changePassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
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
                    setIsError(false);
                    setMessage(jsonRes.message);
                    navigation.replace('signIn')
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
            setIsError(true);
            setMessage('Không thể đổi mật khẩu, vui lòng thử lại')
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
                    onChangeText={setNewPassword}
                    placeholder="Nhập mật khẩu mới"
                    style={styles.input}
                    secureTextEntry={true}
                />
                <TextInput
                    onChangeText={setPassword}
                    placeholder='Xác nhận mật khẩu mới'
                    style={styles.input}
                    secureTextEntry={true}
                />

                <Text style={[styles.message, { color: isError ? 'red' : 'green' }]}>
                    {message ? getMessage() : null}
                </Text>
                
                <CustomButton
                    text="Đổi mật khẩu"
                    onPress={onSubmitHandler}
                />
            </View>
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
})

export default ChangePass