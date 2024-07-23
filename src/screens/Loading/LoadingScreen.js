import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet, ImageBackground, ActivityIndicator} from 'react-native'
import { useNavigation } from "@react-navigation/native";
import Logo from '../../../assets/photo/logo-FIS.png'
import vector1 from '../../../assets/photo/loadingVector1.png';
import vector2 from '../../../assets/photo/loadingVector2.png'
import { Image } from "react-native-elements";

function LoadingScreen({navigation}){
    const navigate = useNavigation();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            navigation.replace('signIn')
        }, 3000)

        return () => clearTimeout(timer);
    }, [])

    return  isLoading ? (
        <View style={styles.container}>
            <ImageBackground 
                source={vector1}
                style={[styles.layer1, styles.imageBackground]}
                resizeMode='contain'
            />
            <ImageBackground 
                source={vector2}
                style={[styles.layer2, styles.imageBackground]}
                resizeMode='contain'
            />
            <ImageBackground 
                source={Logo}
                style={[styles.layer3, styles.logo]}
                resizeMode='contain'
            />
            <ActivityIndicator size="large" color="#FF6800" />
            
        </View>
    ) : null
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    layer1: {
        position: 'absolute',
        top: -140,
        width: '110%',
        height: '100%', // Adjust dimensions as needed
    },
    layer2: {
        position: 'absolute',
        top: -130,
        width: '110%',
        height: '100%', // Adjust dimensions as needed
    },
    layer3: {
        position: 'relative',
        top: -150,
        width: '100%',
        height: '100%', // Adjust dimensions as needed
        alignItems: 'center'
    },
    logo: {
        height: 120, // Adjust height as needed
        resizeMode: 'contain'
    },
})

export default LoadingScreen 