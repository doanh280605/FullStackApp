import React from 'react'
import Logo from '../../../assets/photo/logo-FIS.png'
import vector1 from '../../../assets/photo/Vector.png';
import vector2 from '../../../assets/photo/Vector2.png'
import { View, Text, StyleSheet, useWindowDimensions, ImageBackground, TextInput } from 'react-native';

const LoginStyle = () => {
    return (
        <View style={styles.container}>
            <View style={styles.root}>
                <View style={styles.overlay}>
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
                    {/* Top layer logo */}
                    <ImageBackground
                        source={Logo}
                        style={[styles.layer3, styles.logo]}
                        resizeMode='contain'
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    root: {
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center',
        paddingBottom: 1,
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 1,
    },
    layer1: {
        position: 'absolute',
        top: -80,
        width: '110%',
        height: '100%', // Adjust dimensions as needed
    },
    layer2: {
        position: 'absolute',
        top: -60,
        width: '110%',
        height: '100%', // Adjust dimensions as needed
    },
    layer3: {
        position: 'relative',
        top: -40,
        width: '100%',
        height: '100%', // Adjust dimensions as needed
        alignItems: 'center'
    },
    logo: {
        height: 100, // Adjust height as needed
        resizeMode: 'contain'
    },
})

export default LoginStyle