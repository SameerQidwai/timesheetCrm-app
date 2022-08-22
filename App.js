/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View } from 'react-native';
import Header from './src/components/Timesheet/Header';
import ProjectCards from './src/components/Timesheet/ProjectCards';
import MonthlyAgenda from './src/screens/MonthlyAgenda';
import MonthlyExpandable from './src/screens/MontlyExpandable';
import Test from './src/screens/Test';

const App= () => {

  return (
    
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {/* <Test/> */}
        {/* <MonthlyAgenda/> */}
        <MonthlyExpandable/>
        {/* <Header/>
        <ProjectCards/> */}
      </View>
  )
};

export default App;

