import React, { useCallback, useEffect, useRef, useState } from 'react';
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomSheet, { BottomSheetModal, BottomSheetView, BottomSheetModalProvider, BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { FlatList } from 'react-native-gesture-handler';
import { BottomTabView } from '@react-navigation/bottom-tabs';

const Register = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [gender, setGender] = useState();

    const [selectedCityCode, setSelectedCityCode] = useState(null)
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null)

    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null)

    const bottomSheetRef = useRef(null);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
    }, [])

    const snapPoints = ['25%', '50%', '90%'];

    const handlePresentModalPress = useCallback(() => {
        bottomSheetRef.current?.present();
    }, [])

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

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch('http://192.168.31.134:5000/city', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (response.status === 200) {
                    const jsonRes = await response.json();
                    const cityNames = jsonRes.map(city => city.name)

                    setCities(cityNames)
                } else {
                    console.log('Không thể tìm thấy thành phố')
                }
            } catch (e) {
                console.log('Error fetching cities: ', e)
            }
        }
        fetchCities();
    }, []);

    const fetchDistricts = async (selectedCityCode) => {
        try {
            const response = await fetch(`http://192.168.31.134:5000/district?parentID=${selectedCityCode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.status === 200) {
                const jsonRes = await response.json();
                console.log("parentID: ", selectedCityCode)
                setDistricts(jsonRes);
            } else {
                console.log('Không thể tìm thấy quận/huyện');
            }
        } catch (e) {
            console.log('Error fetching districts: ', e);
        }
    }

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setSelectedCityCode(city.code);
        fetchDistricts(city.code);
        bottomSheetRef.current?.close();
    }

    const renderCity = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleCitySelect(item)} style={styles.itemContainer}>
                <Text style={styles.cityName}>{item}</Text>
            </TouchableOpacity>
        )
    }

    const handleDistrict = (district) => {
        setSelectedDistrict(district.name);
        bottomSheetRef.current?.close()
    }

    const renderDistrict = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleDistrict(item)}>
                <Text style={styles.cityName}>{item}</Text>
            </TouchableOpacity>
        )
    }

    const [modalVisible, setModalVisible] = useState(false)
    const genderOptions = [
        { label: 'Nam', value: 'Nam' },
        { label: 'Nữ', value: 'Nữ' }
    ]

    const handleSelect = (value) => {
        setGender(value),
            setModalVisible(false)
    }

    const getMessage = () => {
        const status = isError ? `Error: ` : `Success: `;
        return status + message;
    }

    return (
        <View style={styles.container}>
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

                <View style={styles.modalView}>
                    <Modal
                        transparent={true}
                        animationType='slide'
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(!modalVisible)}
                    >
                        <View style={styles.modalBackGround}>
                            <View style={[styles.modalContainer]}>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Text style={styles.exit}>Đóng</Text>
                                </TouchableOpacity>
                                <FlatList
                                    data={genderOptions}
                                    keyExtractor={(item) => item.value}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.option}
                                            onPress={() => handleSelect(item.label)}
                                        >
                                            <Text style={styles.optionText}>{item.label}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </View>
                    </Modal>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                    >
                        <TextInput style={styles.input} editable={false} placeholder='Giới tính' value={gender}></TextInput>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handlePresentModalPress} style={{ width: '100%', }} >
                    <TextInput
                        style={styles.input}
                        value={selectedCity}
                        placeholder="Tỉnh/TP"
                        editable={false}
                    />
                </TouchableOpacity>


                <TouchableOpacity onPress={handlePresentModalPress} style={{ width: '100%' }}>
                    <TextInput 
                        style={styles.input}
                        value={selectedDistrict}
                        placeholder='Quận/Huyện'
                        editable={false}
                    />
                </TouchableOpacity>

                <Text style={[styles.message, { color: isError ? 'red' : 'green' }]}>
                    {message ? getMessage() : null}
                </Text>
                <CustomButton
                    text="ĐĂNG KÍ"
                    onPress={onSubmitHandler}
                />
                <View style={styles.footerContainer}>
                    <Text style={{ fontSize: 16 }}>Đã có tài khoản? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('signIn')}>
                        <Text style={styles.signup}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <BottomSheetModalProvider snapPoints={snapPoints}>
                <BottomSheetModal
                    ref={bottomSheetRef}
                    onChange={handleSheetChanges}
                    snapPoints={snapPoints}
                    index={0}
                >
                    <BottomSheetView style={styles.contentContainer}>
                        <FlatList
                            data={cities}
                            renderItem={renderCity}
                        />
                    </BottomSheetView>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        flex: 1,
    },
    bottomSheet: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        fontSize: 16,
        marginTop: 10,
        textDecorationLine: 'underline'
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 20,
        fontSize: 17,
        width: '100%',
        height: 60,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 10,
        color: 'black', 
    },
    textinput: {
        flex: 1,
        width: '85%',
        alignItems: 'center',
        position: 'absolute'
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
    modalBackGround: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',

    },
    modalContainer: {
        width: '100%',
        height: '30%',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16
    },
    option: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    optionText: {
        fontSize: 16
    },
    modalView: {
        width: '100%'
    },
    exit: {
        textAlign: 'right',
        fontSize: 16,
        color: 'red',
        right: 20
    },
    flatContainer: {
        flex: 1,
    }, 
    cityName: {
        fontSize: 17, 
        color: 'black', 
        
    }, 
    itemContainer: {
        padding: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray'
    }
});

export default Register;