/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import { NavigationContainer } from '@react-navigation/native';
import Stacks from './src/components/Navigation/Stacks';



const App= () => {
  return (
    <AppProvider>
      <View style={{flex: 1, backgroundColor: '#f6f4f1'}}>
      <NavigationContainer>
        <Stacks/>
      </NavigationContainer>
      </View>
    </AppProvider>
  )
};

export default App;

