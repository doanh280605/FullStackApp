import React, { useEffect, useState, useRef, useMemo } from "react";
import {View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl} from 'react-native'
import { useNavigation, useRoute } from "@react-navigation/native";

import backward from '../../../assets/photo/backward.png'
import vector1 from '../../../assets/photo/Vector1Homescreen.png'
import vector2 from '../../../assets/photo/Vector2Homescreen.png'
import user from '../../../assets/photo/usericon.png'
import contact from '../../../assets/photo/smartphone.png'

const DanhSachTK = ({}) => {
    const navigation = useNavigation();

    const route = useRoute()

    const {username} = route.params;
    const {email} = route.params;

    const goBack = () => {
        navigation.goBack()
    }

    const register = () => {
        navigation.replace('register');
    }
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // newOffset: indicated the starting point for fetching the next batch of users
    const fetchUsers = async (newOffset) => {
        // setLoading(true): indicate that a loading process is ongoing.
        setLoading(true);
        try {
            // used for pagination (fetching 10 users at a time starting from 'newOffset')
            // await fetch pauses the execution until the fetch request is complete and the response is available
            const response = await fetch(`http://192.168.31.147:5000/users?limit=10&offset=${newOffset}`);
            const data = await response.json();
            if (response.ok) {
                if (data.length < 10) {
                    // if the number of users returned less than 10, set hasMore to false, indicating there are no more users to fetch
                    setHasMore(false);
                }
                setUsers((prevUsers) => [...prevUsers, ...data]);
                // update offset to newOffset + 10 to prepare for the next batch of users to be fetched
                setOffset(newOffset + 10);
            } else {
                setError(data.message || 'Error fetching users');
            }
        } catch (err) {
          setError(err.message || 'Error fetching users');
        } finally {
          setLoading(false);
        }
    };
    
      useEffect(() => {
        fetchUsers(0); // Fetch the first 10 users initially
      }, []);    
      
    const loadMore = () => {
        if (hasMore && !loading) {
            fetchUsers(offset);
        }
    };
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
                              style={styles.backward}
                              resizeMode='contain'                              
                          />
                      </TouchableOpacity>
                      <Text style={styles.headerText}>DANH SÁCH TÀI KHOẢN</Text>                      
                  </View>

          </View>
          <View style={styles.taikhoan}>
            <Text style={{
                fontWeight: 'bold', 
                textAlign: 'left', 
                fontSize: 16, 
                color: 'black'
                }}>Tài khoản đã tồn tại</Text>
          </View>
          <View style={styles.orangeBox}>
            <View style={styles.miniContainer}>
                <Image 
                    source={user}
                    style={styles.image}
                />
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 17, 
                    color: 'black', 
                    padding: 5,
                    marginLeft: 20
                }}>{username}</Text>
            </View>
            <View style={styles.emailContainer}>
                <Image
                    source={contact}
                    styles={styles.image} 
                />
                <Text style={{
                    fontSize: 17, 
                    color: 'black',
                    padding: 5,
                    marginLeft: 20
                }}>{email}</Text>
            </View>
          </View>
          <View style={styles.flatContainer}>
            <FlatList 
                data={users}
                renderItem={({item}) => (
                    <View style={styles.flatListItem}> 
                        <View style={styles.miniItemContainer}>
                            <Image 
                                source={user}
                                style={styles.image}
                            />
                            <Text style={styles.item}>{item.name}</Text>
                        </View>
                        <View style={styles.emailFlatContainer}>
                            <Image
                                source={contact}
                                style={styles.image} 
                            />
                            <Text style={styles.itemMail}>{item.email}</Text>
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                onEndReachedThreshold={0.3}
                onEndReached={loadMore}
                refreshControl={
                    <RefreshControl 
                      refreshing={loading}
                      onRefresh={() => { setUsers([]); setHasMore(true); fetchUsers(0); }}
                    />
                }
                contentContainerStyle={styles.flatListContainer}
            />           
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={register} style={styles.button}>
                    <Text style={styles.buttonText}>ĐĂNG KÝ TÀI KHOẢN MỚI</Text>
                </TouchableOpacity> 
            </View>
        </View>   
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlay: { 
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 270
    },
    layer1: {
        position: 'absolute',
        top: -180,
        width: '110%',
        height: '100%', // Adjust dimensions as needed
        resizeMode: 'contain',
        zIndex: 1
    },
    layer2: {
        position: 'absolute',
        top: -180,
        width: '110%',
        height: '100%', // Adjust dimensions as needed
        resizeMode: 'contain',
        zIndex: 2
    },
    layer3: {
      position: 'relative',
      top: -165,
      width: '70%',
      height: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginRight: 100,
      zIndex: 3
    },
    headerText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 20,
    },
    taikhoan: {
        position: 'absolute',
        top: '20%',
        left: '3%',
        width: '50%',
        padding: 10        
    },
    orangeBox: {
        position: 'absolute',
        top: '25%',
        width: '90%',
        height: 100,
        backgroundColor: '#FF6800',
        borderRadius: 15,
        opacity: 0.5, 
        justifyContent: 'center',
    },
    item:{
        fontWeight: 'bold',
        fontSize: 17, 
        color: 'black',
        padding: 5,
        marginLeft: 20
    },
    flatListContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 20, 
    }, 
    flatListItem: {
        padding: 10,
        width: '90%',
        height: 100,
        backgroundColor: '#FFFFFF',
        marginVertical: 5,
        borderRadius: 15,
        justifyContent: 'center',
        borderWidth: 1,
    },
    flatContainer: {
        flexShrink: 1,
        top: '38%',
        color: 'red', 
        width: '109%', 
        left: 25
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    miniContainer: {
        flexDirection: 'row',
        width: '100%',
        marginLeft: 28,
        alignItems: 'center',
    },
    emailContainer: {
        flexDirection: 'row',
        width: '100%',
        marginLeft: 28,
        alignItems: 'center',
        marginTop: 10
    },
    emailFlatContainer: {
        flexDirection: 'row',
        marginLeft: 15,
        alignItems: 'center',
        flex: 1,
        width: '100%',
    },
    itemMail: {
        fontSize: 17,
        color: 'black',
        padding: 5,
        marginLeft: 20
    },
    miniItemContainer: {
        flexDirection: 'row',
        width: '30%',
        marginLeft: 15,
        alignItems: 'center',
        flex: 1,
        width: '100%',
    },
    button: {
        borderWidth: 1,
        width: '85%',

        padding: 10,
        marginVertical: 5,

        alignItems: 'center',
        borderRadius: 15,
        borderWidth: 2, 
        borderColor: 'transparent',
        backgroundColor: '#FF6800',
        justifyContent: 'center'
    }, 
    buttonText: {
        fontWeight: 'bold',
        color: 'white', 
        alignItems: 'center',
        fontSize: 20
    },
    buttonContainer:{
        backgroundColor: '#FFFFFF',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadMore: {
        fontSize: 20, 
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        padding: 10
    }, 
    loadingContainer: {
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    loadingText: {
        fontSize: 20, 
        color: 'black',
        fontWeight: 'bold'
    }
})

export default DanhSachTK