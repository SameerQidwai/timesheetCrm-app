/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useRef, useCallback} from 'react';
import { SafeAreaView, ScrollView, StatusBar, useColorScheme, View, StyleSheet, TouchableOpacity } from 'react-native';
import {Text, Card} from '@rneui/themed'

import {ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar} from 'react-native-calendars';
import { getTheme, lightThemeColor, themeColor } from './src/theme';
import ProjectCards from './src/components/Timesheet/ProjectCards';

const timesheet = [{
  title: '2022-08-05',
  data:
  [{
    id: 1,
    projectName: 'One LM',
    type:  1,
    milestoneName: 'Milestone 1',
    hours: 27,
    status: 'Submit',
    notes:  'As a cross platform UI Toolkit,'
  },
  {
    id: 2,
    projectName: 'One LM',
    type:  1,
    milestoneName: 'Milestone 1',
    hours: 27,
    status: 'Submit',
    notes:  'As a cross platform UI Toolkit,'
  },]
},
{
  title: '2022-08-04',
  data: [
    {
      id: 1,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      id: 2,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    }
  ]
},
{
  title: '2022-08-06',
  data: [
    {
      id: 1,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      id: 2,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    }
  ]
},
{
  title: '2022-08-08',
  data: [{
    id: 1,
    projectName: 'One LM',
    type:  1,
    milestoneName: 'Milestone 1',
    hours: 27,
    status: 'Submit',
    notes:  'As a cross platform UI Toolkit,'
  },
  ]
},
{
  title: '2022-08-11',
  data: [
    {
      id: 1,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      id: 2,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      id: 3,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      id: 4,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    }
  ]
},
{
  title: '2022-08-13', 
  data: [
    {
      id: 1,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      id: 2,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    }
  ]
},
{
  title: '2022-08-20',
  data: [
    {
      id: 1,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      id: 2,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      id: 3,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      id: 4,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      id: 5,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      id: 6,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    }
  ]
},
{
  title: '2022-08-21',
  data: [
    {
      id: 1,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      id: 2,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    }
  ]
},
{
  title: '2022-08-22', 
  data: [
    {
      id: 1,
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    },
  ]
}]
const App= () => {
  const [items, setItems] = useState({})

  const weekView =  false
  const marked = useRef(()=>{
    let markedDate = {}
    for (let obj of timesheet){
      markedDate[obj.title] = {marked:true}
    }
    return markedDate
  });
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor
  });
  const isDarkMode = useColorScheme() === 'dark';


  const onDateChanged = (day) =>{
    // console.log(day)
    let index = timesheet.findIndex(el =>  el.title === day)
    // console.log(index)
    // console.log(timesheet)
    setItems(timesheet[index])
  };

  const onMonthChange = useCallback((/* month, updateSource */) => {
    // console.warn('ExpandableCalendarScreen onMonthChange: ', month, updateSource);
  }, []);

  const renderItem = ({item}) => {
    if (item === {}) {
      return (
        <View style={styles.emptyItem}>
          <Text style={styles.emptyItemText}>No Events Planned Today</Text>
        </View>
      );
    }
  
    return (
      <TouchableOpacity style={styles.item} >
        <View>
          <Text style={styles.itemHourText}>{item.hour}</Text>
          <Text style={styles.itemDurationText}>{item.duration}</Text>
        </View>
        <Text style={styles.itemTitleText}>{item.title}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>

         <CalendarProvider
            date={timesheet[1].title}
            onDateChanged={onDateChanged}
            onMonthChange={onMonthChange}
            // showTodayButton
            disabledOpacity={0.6} 
            theme={todayBtnTheme.current}
            // todayBottomMargin={16}
          >
            <ExpandableCalendar
              // horizontal={false}
              hideArrows
              // disablePan
              // hideKnob
              // initialPosition={ExpandableCalendar.positions.OPEN}
              
              calendarStyle={styles.calendar}
              headerStyle={styles.calendar} // for horizontal only
              // disableWeekScroll
              theme={theme.current}
              // disableAllTouchEventsForDisabledDays
              firstDay={1}
              markedDates={marked.current}
              // leftArrowImageSource={leftArrowIcon}rea
              // rightArrowImageSource={rightArrowIcon}
              // animateScroll
              renderHeader={date => (
                <View style={{paddingVertical:10,flex: 3, flexDirection: 'row', justifyContent: 'space-between'}}>
                   <Text Text>{'<'}</Text> 
                  <Text>{date.toISOString().split('T')[0]}</Text>
                   <Text>{278.3}</Text>
                </View>
              )}
            />
            <ProjectCards timesheets={items?.data ?? []}/>
          </CalendarProvider>
    </View>
  )
};

export default App;

const styles = StyleSheet.create({
  calendar: {
    // paddingLeft: 20,
    // paddingRight: 20
  },
  section: {
    backgroundColor: lightThemeColor,
    color: 'grey',
    textTransform: 'capitalize'
  }
});