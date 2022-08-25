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
import ExpandablesTimesheet from './src/screens/ExpandablesTimesheet';
import LeaveRequest from './src/screens/LeaveRequest';

const App= () => {

  return (
    
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {/* <Test/> */}
        {/* <AgendaTimesheet/> */}
        {/* <WeeklyTimesheet/> */}
        <LeaveRequest/>
        {/* <ExpandablesTimesheet/> */}
        {/* <Header/>
        <ProjectCards/> */}
      </View>
  )
};

export default App;

