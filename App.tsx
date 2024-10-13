import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from './src/front-end/HomeScreen';
import { SearchGameCommunity } from './src/front-end/SearchGameCommunity';
import { Provider, useDispatch } from 'react-redux';
import { gameBoardStore, store } from './src/core/store';
import { TBoardGameData } from './src/types/boardGames';
import { useEffect, useState } from 'react';
import { Signin } from './src/front-end/Sign-in';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Profile from './src/front-end/Profile';
import EventsPage from './src/front-end/Events';
import Maps from './src/front-end/Map';
import Chat from './src/front-end/Chat'

const Tab = createBottomTabNavigator();

export const PORT= 5050

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
    border: 'transparent',
    card: 'transparent'
  }
}

const Tabs = (props:{tabName: string}) => {
  return (
        <View style={{alignItems:'center'
        }}>
          <Text style={{color:'black', marginVertical:'auto'}}>{props.tabName}</Text>
        </View>
  )
}

export default function App() {

  return (
    <GestureHandlerRootView>
      
    <Provider store={store}>
      
    <NavigationContainer 
    theme={theme}
    >
      <Tab.Navigator 
      screenOptions={
      
        {tabBarShowLabel: false,
          tabBarStyle:{
          marginHorizontal:20,
        },
        tabBarItemStyle:{
          backgroundColor:'rgba(255,255,255,0.7)',
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize : 15
        }
      }
      }
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{
          tabBarIcon: () => <Tabs tabName='Home'/>
          }}/>
        <Tab.Screen name="Games" component={Maps}  options={{
          tabBarIcon: () => <Tabs tabName='Map'/>
          }}/>
          <Tab.Screen name="Events" component={EventsPage}  options={{
            tabBarIcon: () => <Tabs tabName='Events'/>
            }}/>
        <Tab.Screen name="Profile" component={Profile}  options={{
          tabBarIcon: () => <Tabs tabName='Profile'/>
          }}/>
          <Tab.Screen name="Chat" component={Chat}  options={{
            tabBarIcon: () => <Tabs tabName='Chat'/>
            }}/>
      </Tab.Navigator>
    </NavigationContainer>
    </Provider>
    </GestureHandlerRootView>
  );
}