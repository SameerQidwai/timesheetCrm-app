/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import { useColorScheme, View, } from 'react-native';
 
 
 import {
   Colors,
 } from 'react-native/Libraries/NewAppScreen';
import Header from '../components/Timesheet/Header';
import ProjectCards from '../components/Timesheet/ProjectCards';
 
 
 const projects = [
   {
     id:1,
     projectName: 'One LM',
     type:  1,
     milestoneName: 'Milestone 1',
     hours: 27,
     status: 'Submit',
     notes:  'As a cross platform UI Toolkit,'
   },
   {
     id:12,
     projectName: 'One LM',
     type:  1,
     milestoneName: 'Milestone 1',
     hours: 27,
     status: 'Submit',
     notes:  'As a cross platform UI Toolkit,'
   },
   {
     id:123,
     projectName: 'One LM',
     type:  1,
     milestoneName: 'Milestone 1',
     hours: 27,
     status: 'Rejected',
     notes:  'As a cross platform UI Toolkit,'
   },
   {
     id:1234,
     projectName: 'One LM',
     type:  1,
     milestoneName: 'Milestone 1',
     hours: 27,
     status: 'Rejected',
     notes:  'As a cross platform UI Toolkit,'
   },
   {
     id:1235,
     projectName: 'One LM',
     type:  1,
     milestoneName: 'Milestone 1',
     hours: 27,
     status: 'Submit',
     notes:  'As a cross platform UI Toolkit,'
   },
   {
     id:1236,
     projectName: 'One LM',
     type:  1,
     milestoneName: 'Milestone 1',
     hours: 27,
     status: 'Submit',
     notes:  'As a cross platform UI Toolkit,'
   },
   {
     id:1237,
     projectName: 'One LM',
     type:  1,
     milestoneName: 'Milestone 1',
     hours: 27,
     status: 'Submit',
     notes:  'As a cross platform UI Toolkit,'
   },
   {
     id:123,
     projectName: 'One LM',
     type:  1,
     milestoneName: 'Milestone 1',
     hours: 27,
     status: 'Rejected',
     notes:  'As a cross platform UI Toolkit,'
   },
 ]
 
 const MonthlyTimesheet= () => {
   const isDarkMode = useColorScheme() === 'dark';
 
   const backgroundStyle = {
     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
   };
 
   return (
     <View>
         <Header month={'JAN 2023'} total={27}  color ={isDarkMode ? Colors.black : Colors.white} />
         <ProjectCards timesheets={projects}/>
     </View>
   )
 };
 
 export default MonthlyTimesheet;
 
 