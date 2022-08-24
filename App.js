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
import AgendaTimesheet from './src/screens/AgendaTimesheet';
import WeeklyTimesheet from './src/screens/WeeklyTimesheet';
import Test from './src/screens/Test';
import ExpandablesTimesheet from './src/screens/ExpandablesTimesheet';

const App= () => {

  return (
    
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {/* <Test/> */}
        {/* <AgendaTimesheet/> */}
        <WeeklyTimesheet/>
        {/* <ExpandablesTimesheet/> */}
        {/* <Header/>
        <ProjectCards/> */}
      </View>
  )
};

export default App;

