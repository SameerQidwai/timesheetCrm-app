import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconButton } from 'react-native-paper';
import { View } from 'react-native';
import Login from '../../screens/Login';
import WeeklyTimesheet from '../../screens/WeeklyTimesheet';
import Profile from '../../screens/Profile';
import LeaveRequest from '../../screens/LeaveRequest';
import MonthlyTimesheet from '../../screens/MonthlyTimesheet';
import { AppContext } from '../../context/AppContext';

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
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarShowLabel:false,
        // tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          const icons = {
            TimesheetStack: 'clock-time-four-outline',
            Leave: 'calendar-blank-outline',
            Profile: 'cog',
          };
    
          return (
            <IconButton
              icon={icons[route.name]}
              color={color}
              size={size}
            />
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

function SignInScreen() {
  return (
    <SignInStack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <SignInStack.Screen name="Login" component={Login} />
      {/* <SignInStack.Screen name="Details" component={WeeklyTimesheet} /> */}
    </SignInStack.Navigator>
  );
}


function Stacks() {
    const {appStorage} = useContext(AppContext)
  return (
    <View style={{flex:1}}>
        {appStorage['accessToken'] ? <TabScreen/>: <SignInScreen/>}
    </View>
  )
}

export default Stacks