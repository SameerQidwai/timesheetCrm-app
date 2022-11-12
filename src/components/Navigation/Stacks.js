import React, { useContext, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconButton } from 'react-native-paper';
import { View } from 'react-native';
import Login from '../../screens/SignIn/Login';
import WeeklyTimesheet from '../../screens/Timesheet/WeeklyTimesheet';
import Profile from '../../screens/Profile';
import LeaveRequest from '../../screens/Leave/LeaveRequest';
import MonthlyTimesheet from '../../screens/Timesheet/MonthlyTimesheet';
import { AppContext } from '../../context/AppContext';
import { colors } from '../Common/theme';
import { DomainName, getLocalStorage, storage } from '../../services/constant';
import CompanyDomain from '../../screens/SignIn/CompanyDomain';

const Stack = createNativeStackNavigator();

function TimesheetScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Timesheet" component={MonthlyTimesheet} />
      <Stack.Screen name="Timesheet-Details" component={WeeklyTimesheet} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function TabScreen () {
  return (
    <Tab.Navigator 
      screenOptions={({ route, navigation }) => ({
        headerShown: false, 
        tabBarShowLabel:false,
       
        tabBarActiveTintColor: '#fff',
        tabBarActiveBackgroundColor: colors['primary'],
       
        // tabBarInactiveBackgroundColor
        tabBarInactiveTintColor: 'gray',
       
        // tabBarItemStyle: { borderColor: colors['light'], borderWidth: 1},
        // tabBarStyle: {}
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            TimesheetStack: 'clock-time-four-outline',
            Leave: 'calendar-blank-outline',
            Profile: 'cog',
          };
    
          return (
            <View>
              <IconButton
                icon={icons[route.name]}
                color={color}
                size={size}
                onPress={()=> navigation.navigate(route.name)}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="TimesheetStack" component={TimesheetScreen} />
      <Tab.Screen name="Leave" component={LeaveRequest} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  )
}

const SignInStack = createNativeStackNavigator();

function SignInScreen({domain}) {
  return (
    <SignInStack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      
      {
      DomainName[domain] ? 
        <SignInStack.Screen  name="Login" component={Login} /> :
        <SignInStack.Screen  name="Company" component={CompanyDomain} />
      }
    </SignInStack.Navigator>
  );
}


function Stacks() {
    const {appStorage, setAppStorage} = useContext(AppContext)
    const [localStorage, setLocalStorage ] = useState(getLocalStorage())
    
    useEffect(() => {
      setAppStorage(localStorage)    
      console.log(localStorage)
    }, [localStorage])

    
  return (
    <View style={{flex:1}}>
    {
      appStorage?.['accessToken'] ? 
        <TabScreen /> :
        <SignInScreen setLocalStorage={setLocalStorage} domain={appStorage?.['domain']} /> 
    }
    </View>
  )
}

export default Stacks