/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Header from './src/components/Timesheet/Header';
import ProjectCards from './src/components/Timesheet/ProjectCards';


const projects = [
  {
    projectName: 'One LM',
    type:  1,
    milestoneName: 'Milestone 1',
    hours: 27,
    status: 'Submit',
    notes:  'As a cross platform UI Toolkit,'
  },
  {
    projectName: 'One LM',
    type:  1,
    milestoneName: 'Milestone 1',
    hours: 27,
    status: 'Submit',
    notes:  'As a cross platform UI Toolkit,'
  },
  {
    projectName: 'One LM',
    type:  1,
    milestoneName: 'Milestone 1',
    hours: 27,
    status: 'Rejected',
    notes:  'As a cross platform UI Toolkit,'
  },
  {
    projectName: 'One LM',
    type:  1,
    milestoneName: 'Milestone 1',
    hours: 27,
    status: 'Rejected',
    notes:  'As a cross platform UI Toolkit,'
  },
  {
    projectName: 'One LM',
    type:  1,
    milestoneName: 'Milestone 1',
    hours: 27,
    status: 'Submit',
    notes:  'As a cross platform UI Toolkit,'
  },
  {
    projectName: 'One LM',
    type:  1,
    milestoneName: 'Milestone 1',
    hours: 27,
    status: 'Submit',
    notes:  'As a cross platform UI Toolkit,'
  },
  {
    projectName: 'One LM',
    type:  1,
    milestoneName: 'Milestone 1',
    hours: 27,
    status: 'Submit',
    notes:  'As a cross platform UI Toolkit,'
  },
  {
    projectName: 'One LM',
    type:  1,
    milestoneName: 'Milestone 1',
    hours: 27,
    status: 'Rejected',
    notes:  'As a cross platform UI Toolkit,'
  },
]

const App= () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={backgroundStyle}
      >
        <View
          // style={{
          //   backgroundColor: isDarkMode ? Colors.black : Colors.white,
          // }}
          >
             <Header month={'JAN 2023'} total={27}  color ={isDarkMode ? Colors.black : Colors.white} />
            <ProjectCards timesheets={projects}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

