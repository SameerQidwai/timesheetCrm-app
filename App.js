/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { StatusBar, View } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import { NavigationContainer } from '@react-navigation/native';
import Stacks from './src/components/Navigation/Stacks';
import { colors } from './src/components/Common/theme';



const App= () => {
  return (
    <AppProvider>
      <View style={{flex: 1, backgroundColor: colors['display']}}>
      <NavigationContainer>
        <Stacks/>
      </NavigationContainer>
      </View>
    </AppProvider>
  )
};

export default App;

