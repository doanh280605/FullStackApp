import {View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity} from 'react-native'
import React, {useState, useEffect} from 'react'
import { Avatar } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Divider } from 'react-native-elements';

import backward from '../../../assets/photo/backward.png'
import edit from '../../../assets/photo/edit.png'
import avatar from '../../../assets/photo/Avatar.png'
import vector1 from '../../../assets/photo/Vector1Homescreen.png'
import vector2 from '../../../assets/photo/Vector2Homescreen.png'
import pass from '../../../assets/photo/pas.png'

const Setting = ({route}) => {
    const navigation = useNavigation();

    const goBack = () => {
        navigation.goBack()
    }

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null)
    const token = route.params;

    useEffect(() => {
        const fetchData = async () => {
            const storedToken = await AsyncStorage.getItem('userToken');
            onLoggedIn(storedToken)
          };
          fetchData();      
    }, []);

    const onLoggedIn = async (token) => {
        try {
            const response = await fetch(`http://10.86.156.122:5000/private`, {
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
            }
        } catch (error) {
            console.log('Error fetching user data: ', error);
        }
    }

    return (
        <View style={styles.container}>
            {/* Overlay for images */}
            <View style={styles.overlay}>
                {/* Bottom layer image */}
                <ImageBackground
                    source={vector1}
                    style={[styles.layer1, styles.imageBackground]}
                    resizeMode='contain'
                />
                {/* Middle layer image */}
                <ImageBackground
                    source={vector2}
                    style={[styles.layer2, styles.imageBackground]}
                    resizeMode='contain'
                />
                <View style={styles.layer3}>
                    <TouchableOpacity onPress={goBack}>
                        <Image 
                            source={backward}
                            style={styles.group}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Image 
                            source={edit}
                            style={styles.notification}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>                        
                </View>
            </View>
            <View style={styles.avatarContainer}>
                <Avatar 
                    rounded
                    source={avatar}
                    style={styles.avatar}
                />
                <Text style={styles.name}>{username}</Text>
            </View>
            <View style={styles.information}>
                <View style={styles.section}>
                    <Text style={styles.thongtin}>Tên đại lý</Text>
                    <Text style={styles.value}>Vincom</Text>
                </View>
                <Divider orientation='horizontal' style={{marginTop: 10, marginBottom: 20}}/>
                <View style={styles.section}>
                    <Text style={styles.thongtin}>Địa chỉ</Text>
                    <Text style={styles.value}>sample</Text>
                </View>
                <Divider orientation='horizontal' style={{marginTop: 10, marginBottom: 20}}/>
                <View style={styles.section}>
                    <Text style={styles.thongtin}>Điện thoại</Text>
                    <Text style={styles.value}>0983818387</Text>
                </View>
            </View>
            <View style={styles.doiPass}>
                <Text style={styles.pass}>Đối mật khẩu</Text>
                <TouchableOpacity onPress={() => navigation.navigate('changePass')}>
                    <Image 
                        source={pass}
                        style={styles.changePass}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        top: -350
    },
    layer1: {
        position: 'absolute',
        width: '110%',
        height: '100%', // Adjust dimensions as needed
        resizeMode: 'contain'
    },
    layer2: {
        position: 'absolute',
        width: '110%',
        height: '100%', // Adjust dimensions as needed
        resizeMode: 'contain'
    },
    layer3: {
        position: 'relative',
        top: -60,
        width: '90%',
        height: '80%', // Adjust dimensions as needed
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    avatar: {
        width: 130,
        height: 130,
    }, 
    avatarContainer: {
        flex: 1, 
        top: 120,
        alignItems: 'center',
    }, 
    name: {
        fontSize: 25, 
        fontWeight: 'bold', 
        color: 'black',
        textTransform: 'uppercase',
        marginTop: 20
    },
    information: {
        flex: 1, 
        width: '100%', 
        top: -110, 
        padding: 10
    }, 
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    thongtin: {
        fontSize: 20, 
        color: 'black'
    }, 
    value: {
        fontSize: 20, 
        color: 'black',
        textTransform: 'uppercase',
        fontWeight: 'bold'
    }, 
    doiPass: {
        flexShrink: 1,
        width: '100%',
        top: -350,
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 10
    }, 
    pass: {
        color: 'black',
        fontSize: 20
    }, 
    changePass: {
        marginRight: 10
    }
})

export default Setting