import React, { useState, useEffect, useRef, Component } from "react";
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, Dimensions, FlatList, ScrollView, ActivityIndicator } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from "@react-navigation/native";
import Setting from "../setting/Setting";
import DichVu from "../DichVu";
import Tintuc from "../Tintuc";
import QrScanner from "../QrScanner";
import xml2js from 'react-native-xml2js';
import Carousel from 'react-native-reanimated-carousel'

import group from '../../../assets/photo/group.png'
import miniLogo from '../../../assets/photo/FIS.png'
import notification from '../../../assets/photo/notification.png'
import homeIcon from "../../../assets/photo/home.png";
import personalIcon from '../../../assets/photo/user.png'
import tintuc from "../../../assets/photo/tintuc.png"
import dichvu from "../../../assets/photo/dichvu.png"
import qrScanner from '../../../assets/photo/CTA.png'
import vector1 from '../../../assets/photo/Vector1Homescreen.png'
import vector2 from '../../../assets/photo/Vector2Homescreen.png'
import { TouchEventType } from "react-native-gesture-handler/lib/typescript/TouchEventType";

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const navigation = useNavigation()

  const RSS_URL = 'https://cdn.24h.com.vn/upload/rss/trangchu24h.rss'

  const caNhan = () => {
    navigation.navigate('personal')
  }

  const allNews = () => {
    navigation.navigate('allNews')
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <View style={styles.itemContainer}>
          <Image
            style={{ width: deviceWidth, height: 250 }}
            source={{ uri: item.image }}
          />
          <Text style={styles.itemTitle}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const deviceWidth = Dimensions.get('window').width - 30;
  const [rssItems, setRssItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRSS = async () => {
    setLoading(true);
    try {
      const response = await fetch(RSS_URL);
      const responseData = await response.text();
      xml2js.parseString(responseData, (err, result) => {
        if (err) {
          console.error('Error parsing RSS feed:', err);
          return;
        }
        const items = result.rss.channel[0].item.map((item) => ({
          // Store item information into an array for easier reference
          title: item.title[0],
          link: item.link[0],
          // typeof: check if the description is of type string
          // JSON.stringify: if the description is not a string (an object or array), then convert into a JSON formatted string
          description: typeof item.description[0] === 'string' ? JSON.parse(item.description[0]) : (item.description[0]),
          image: typeof item?.description[0] === 'string' ? JSON.parse(JSON.parse(JSON.parse(item?.description[0])?.img)[0]?.$)?.src : item.description[0]?.img[0].$.src,
        }));
        setRssItems(items);
      });
    } catch (error) {
      console.error('Error fetching or parsing RSS feed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRSS();
  }, []);

  const handlePress = (item) => {
    if (item.link) {
      navigation.navigate('webview', { link: item.link })
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
          <TouchableOpacity onPress={caNhan}>
            <Image
              source={group}
              style={styles.group}
              resizeMode='contain'
            />
          </TouchableOpacity>
          <Image
            source={miniLogo}
            style={styles.logo}
            resizeMode='contain'
          />
          <TouchableOpacity>
            <Image
              source={notification}
              style={styles.notification}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView scrollEnabled={true} contentContainerStyle={{ flexGrow: 1, padding: 10, backgroundColor: 'red' }} scrollEventThrottle={16} >
          <View style={{ flex: 1, top: 300 }}>
            <View style={styles.viewAll}>
              <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>Tin Tức</Text>
              <TouchableOpacity onPress={allNews}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'blue' }}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <Carousel
              loop
              data={rssItems.slice(0, 6)}
              renderItem={renderItem}
              width={deviceWidth}
              height={deviceWidth}
              autoPlay={true}
              autoPlayInterval={3000}
            />
          </View>
        </ScrollView>
      </View>

    </View>
  )
}

function MyTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Trang chủ"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              style={{ width: size, height: size }}
              source={homeIcon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Dịch vụ"
        component={DichVu}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              style={{ width: size, height: size }}
              source={dichvu}
            />
          )
        }}
      />
      <Tab.Screen
        name="QR Scanner"
        component={QrScanner}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              style={{ width: size * 3, height: size * 3 }}
              source={qrScanner}
            />
          ),
          tabBarLabel: ""
        }}
      />
      <Tab.Screen
        name="Tin tức"
        component={Tintuc}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              style={{ width: size, height: size }}
              source={tintuc}
            />
          )
        }}
      />
      <Tab.Screen
        name="Cá nhân"
        component={Setting}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              style={{ width: size, height: size }}
              source={personalIcon}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'space-between'
  },
  logo: {
    height: 100,
    width: 150,
    resizeMode: 'contain',
    marginLeft: 20
  },
  itemContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black'
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollViewContainer: {
    flex: 1,
    width: '100%',
    marginTop: 300,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 10
  },
  loading: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold'
  },
  description: {
    color: 'black',
    fontSize: 13
  },
  headerScroll: {
    fontWeight: 'bold',
    fontSize: 30,
    marginLeft: 15,
    color: 'black'
  },
  webViewContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  viewAll: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
})

export default MyTabs