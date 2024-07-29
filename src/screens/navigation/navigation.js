import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Register from "../registerScreen/Register";
import SignInScreen from "../signInScreen/SignInScreen";
import LoadingScreen from "../Loading";
import MyTabs from "../HomeScreen";
import Personal from "../personal/Personal";
import DanhSachTK from "../DanhSachTK";
import WebViewScreen from "../WebView/WebView";
import ChangePass from "../changePass/changePass";
import AllNews from "../allNews/allNews";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { all } from "axios";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function Navigation() {

    return (
        <GestureHandlerRootView>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='register' screenOptions={{ headerShown: false }}>
                    <Stack.Screen name='loading' component={LoadingScreen} />
                    <Stack.Screen name="signIn" component={SignInScreen} />
                    <Stack.Screen
                        name="register"
                        component={Register}
                        options={{
                            title: 'Đăng ký tài khoản',
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: '#ff6800',
                            },
                            headerTintColor: '#fff', // Set the color of the header text
                            headerTitleStyle: {
                                fontWeight: 'bold', // Set the font weight of the header title
                                fontSize: 20,       // Set the font size of the header title
                            },
                            headerTitleAlign: 'center',
                        }}
                    />
                    <Stack.Screen name='home' component={MyTabs} />
                    <Stack.Screen name='personal' component={Personal} />
                    <Stack.Screen name='list' component={DanhSachTK} />
                    <Stack.Screen
                        name='webview'
                        component={WebViewScreen}
                        options={{
                            title: 'Chi tiết tin tức',
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: '#ff6800'
                            },
                            headerTintColor: '#fff', // Set the color of the header text
                            headerTitleStyle: {
                                fontWeight: 'bold', // Set the font weight of the header title
                                fontSize: 20,       // Set the font size of the header title
                            },
                            headerTitleAlign: 'center',
                        }}
                    />
                    <Stack.Screen
                        name='changePass'
                        component={ChangePass}
                        options={{
                            title: 'Đổi mật khẩu',
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: '#ff6800'
                            },
                            headerTintColor: '#fff', // Set the color of the header text
                            headerTitleStyle: {
                                fontSize: 20,       // Set the font size of the header title
                            },
                            headerTitleAlign: 'center',
                        }}
                    />
                    <Stack.Screen
                        name="allNews"
                        component={AllNews}
                        options={{
                            title: 'Tất cả tin tức',
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: '#ff6800'
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                                fontSize: 20,
                            },
                            headerTitleAlign: 'center'
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    )
}