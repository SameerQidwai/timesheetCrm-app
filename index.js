/**
 * @format
 */

import { Provider as PaperProvider } from 'react-native-paper';
import React, { useEffect } from 'react'
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { theme } from './theme';
import SplashScreen from 'react-native-splash-screen'

export default function Index() {

  useEffect(() => {
    SplashScreen.hide();
  
  }, [])
  

    return (
    <PaperProvider theme={theme}>
        <App />
    </PaperProvider>
    );
  }

AppRegistry.registerComponent(appName, () => Index);
