import React, { useState, useEffect } from "react";
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import { useNavigation, useRoute } from "@react-navigation/native";
import { Avatar } from "react-native-elements";
import axios from "axios";

import backward from '../../../assets/photo/backwardButton.png'
import { Image } from "react-native-elements";
import avatar from '../../../assets/photo/Avatar.png'
import exit from '../../../assets/photo/exit.png'
import { UserContext } from "../../../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Personal = ({route}) => {
    const navigation = useNavigation();
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [city, setCity] = useState(null);
    const [district, setDistrict] = useState(null);
    const [ward, setWard] = useState(null)
    const token = route.params;

    useEffect(() => {
        const fetchData = async () => {
            const storedToken = await AsyncStorage.getItem('userToken');
            onLoggedIn(storedToken)
          };
          fetchData();      
    }, []);

    const goBack = () => {
        navigation.goBack()
    }

    const list = () => {
        navigation.navigate('list', {username, email})
    }

    const signOut = async () => {
        await AsyncStorage.removeItem('userToken')
        navigation.replace('signIn');
    }

    const onLoggedIn = async (token) => {
        try {
            const response = await fetch(`http://192.168.1.13:5000/private`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                const jsonRes = await response.json();

                const name = jsonRes.name;
                const email = jsonRes.email;
                setUsername(name)
                setEmail(email);
                
                setCity(jsonRes.city);
                setDistrict(jsonRes.district);
                setWard(jsonRes.ward)
            }
        } catch (error) {
            console.log('Error fetching user data: ', error);
        }
    }

    return (
        <View style={[styles.root]}>
            <TouchableOpacity onPress={goBack} style={styles.button}>
                <Image style={styles.photo} source={backward} resizeMode='contain' />    
            </TouchableOpacity>
            <View style={styles.avatarContainer}>
                <Avatar 
                    rounded
                    source={avatar}
                    style={styles.avatar}
                />
            </View>
            <View style={{flex: 3, backgroundColor: '#FFFFFF', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.name}>{username}</Text>
                <TouchableOpacity onPress={signOut} style={styles.exit}>
                    <Image 
                        style={styles.exitButton}
                        source={exit}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
                <Text style={styles.city}>{city}, {district}</Text>
                <View style={{flex: 3, backgroundColor: '#FFFFFF', width: '100%'}}>
                    <Text style={styles.chinhSach}>Chính sách</Text>
                    <Text style={styles.chinhSachCon}>Chính sách bán hàng</Text>
                    <Text style={styles.chinhSachCon}>Tiến độ tích lũy</Text>
                </View>
                <View style={{flex: 1, backgroundColor: '#FFFFFF', width: '100%'}}>
                    <Text style={styles.chinhSach}>Tin tức</Text>
                </View>
                <TouchableOpacity onPress={list} style={{flex: 7, backgroundColor: '#FFFFFF', width: '100%'}}>
                    <Text style={styles.chinhSach}>Danh sách tài khoản</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1, 
        padding: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center', // Center the content vertically
        alignItems: 'center', // Center the content horizontally
    },
    button : {
        position: 'absolute',
        top: 5, 
        left: 5, 
        padding: 10,
    },
    photo: {
        width: 30, 
        height: 30,
        marginTop: 10
    },
    avatarContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 150, // Set a fixed width for the avatar
        height: 150, // Set a fixed height for the avatar
        borderRadius: 75, // Make it circular if needed
    },
    avatar: {
        width: 130,
        height: 130,
        marginBottom: 30
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        textTransform: 'uppercase'
    }, 
    city: {
        color: 'black',
        fontSize: 16, 
        marginBottom: 25
    },
    chinhSach: {
        fontWeight: 'bold', 
        color: 'black', 
        fontSize: 20,
        marginTop: 10,
        textAlign: 'left'
    },
    chinhSachCon : {
        fontSize: 19,
        color: 'black',
        marginLeft: 50,
        marginTop: 20
    },
    exit: {
        position: 'absolute',
        top: 15, 
        right: 20,
        padding: 10,
        color: 'black',
        backgroundColor: 'black'
    }
})

export default Personal