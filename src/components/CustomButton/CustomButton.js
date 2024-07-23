import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'

const CustomButton = ({onPress, text, type='PRIMARY', bgColor, fgColor}) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, styles[`container_${type}`]]}>
            <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        width: '85%',

        padding: 10,
        marginVertical: 5,

        alignItems: 'center',
        borderRadius: 30,
        borderWidth: 2, 
        borderColor: 'transparent'
    },
    container_PRIMARY: {
        backgroundColor: '#FF6800',
        justifyContent: 'center'
    },

    container_GOOGLE: {
        marginTop: 50,
    },

    container_FACEBOOK: {
        marginTop: 10
    },

    text_PRIMARY:{
        color: 'white',
        fontSize: 20
    },  

    text: {
        fontWeight: 'bold',
        color: 'white', 
        alignItems: 'center'
    }, 
    container_VERIFY: {
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 30,
        backgroundColor: '#3B71F3',
    },

    text_VERIFY: {
    color: 'white',
    },
})

export default CustomButton