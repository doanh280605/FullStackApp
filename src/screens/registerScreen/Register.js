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

    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null)

    const [selectedCityCode, setSelectedCityCode] = useState(null);
    const [selectedDistrictCode, setSelectedDistrictCode] = useState(null);
    const [selectedWardCode, setSelectedWardCode] = useState(null)

    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null)

    const [wards, setWards] = useState([])
    const [selectedWards, setSelectedWards] = useState(null)

    const bottomSheetCityRef = useRef(null);
    const bottomSheetDistrictRef = useRef(null);
    const bottomSheetWardRef = useRef(null);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
    }, [])

    const snapPoints = ['25%', '50%', '90%'];

    const handlePresentModalCityPress = useCallback(() => {
        bottomSheetCityRef.current?.present();
    }, [])

    const handlePresentModalDistrictPress = useCallback(() => {
        bottomSheetDistrictRef.current?.present();
    }, [])

    const handlePresentModalWardPress = useCallback(() => {
        bottomSheetWardRef.current?.present();
    }, [])

    const onLoggedIn = token => {
        fetch('http://10.86.157.162:5000/private', {
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
            city: selectedCityCode, 
            district: selectedDistrictCode, 
            ward: selectedWardCode, 
            sex: gender
        };
        console.log(payload);
        // If true: login - false: signup
        fetch('http://10.86.157.162:5000/signup', {
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
                const response = await fetch('http://10.86.157.162:5000/city', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (response.status === 200) {
                    const jsonRes = await response.json();


                    setCities(jsonRes)
                } else {
                    console.log('Không thể tìm thấy thành phố')
                }
            } catch (e) {
                console.log('Error fetching cities: ', e)
            }
        }
        fetchCities();
    }, []);

    const fetchDistricts = async (id) => {
        try {
            const response = await fetch(`http://10.86.157.162:5000/districts?parentID=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.status === 200) {
                const jsonRes = await response.json();
                setDistricts(jsonRes);
            } else {
                console.log('Không thể tìm thấy quận/huyện');
            }
        } catch (e) {
            console.log('Error fetching districts: ', e);
        }
    }
    const fetchWards = async (id) => {
        try {
            const res = await fetch(`http://10.86.157.162:5000/wards?parentID=${id}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if(res.status === 200) {
                const jsonRes = await res.json();
                setWards(jsonRes)
            } else {
                console.log('Không thể tìm thấy phường/xã');
            }
        } catch (e) {
            console.log('Error fetching wards: ', e)
        }
    }

    const handleCitySelect = (city) => {
        const parentid = parseInt(city.code, 10)
        setSelectedCity(city.name);
        setSelectedCityCode(parentid)
        fetchDistricts(parentid);
        bottomSheetCityRef.current?.close();
        setSelectedDistrict('');
        setSelectedWards('');
    }

    const renderCity = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleCitySelect(item)} style={styles.itemContainer}>
                <Text style={styles.cityName}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    const handleDistrict = (district) => {
        const districtCode = parseInt(district.code, 10)
        setSelectedDistrictCode(districtCode)
        setSelectedDistrict(district.name);
        fetchWards(districtCode)
        bottomSheetDistrictRef.current?.close();
        setSelectedWards('');
    }

    const renderDistrict = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleDistrict(item)} style={styles.itemContainer}>
                <Text style={styles.cityName}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    const handleWard = (ward) => {
        setSelectedWards(ward.name);
        bottomSheetWardRef.current?.close()
        const wardCode = parseInt(ward.code, 10)
        setSelectedWardCode(wardCode)
    }

    const renderWard = ({item}) => {
        return (
            <TouchableOpacity onPress={() => handleWard(item)} style={styles.itemContainer}>
                <Text style={styles.cityName}>{item.name}</Text>
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
        <BottomSheetModalProvider>
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
                    <TouchableOpacity onPress={handlePresentModalCityPress} style={{ width: '100%', }} >
                        <TextInput
                            style={styles.input}
                            value={selectedCity}
                            placeholder="Tỉnh/TP"
                            editable={false}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePresentModalDistrictPress} style={{ width: '100%' }}>
                        <TextInput
                            style={styles.input}
                            value={selectedDistrict}
                            placeholder='Quận/Huyện'
                            editable={false}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePresentModalWardPress} style={{width: '100%'}}>
                        <TextInput 
                            style={styles.input}
                            value={selectedWards}
                            placeholder='Phường/Xã'
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
                <BottomSheetModal
                    ref={bottomSheetCityRef}
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
                <BottomSheetModal
                    ref={bottomSheetDistrictRef}
                    onChange={handleSheetChanges}
                    snapPoints={snapPoints}
                    index={0}
                >
                    <BottomSheetView style={styles.contentContainer}>
                        <FlatList
                            data={districts}
                            renderItem={renderDistrict}
                        />
                    </BottomSheetView>
                </BottomSheetModal>
                <BottomSheetModal 
                    ref={bottomSheetWardRef}
                    onChange={handleSheetChanges}
                    snapPoints={snapPoints}
                    index={0}
                >
                    <BottomSheetView style={styles.contentContainer}>
                        <FlatList 
                            data={wards}
                            renderItem={renderWard}
                        />
                    </BottomSheetView>
                </BottomSheetModal>
            </View>
        </BottomSheetModalProvider>
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