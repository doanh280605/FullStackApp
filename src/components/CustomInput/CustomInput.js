import React from 'react'
import {View, Text, TextInput, StyleSheet} from 'react-native'

const CustomInput = ({value, setValue, placeholder, secureTextEntry }) => {
    return (
        <View style={styles.container}>
            <TextInput 
                onChangeText={setValue}
                placeholder={placeholder}
                style={styles.input}
                secureTextEntry={secureTextEntry}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        width: '85%',
        paddingHorizontal: 10,
        marginVertical: 5,
    },

    input: {
        borderBottomWidth: 1,
        marginBottom: 20,
        fontWeight: 'bold',
        fontSize: 17
    }
})

export default CustomInput