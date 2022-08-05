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

const timesheet = [{
  title: '2022-08-05',
  data: [{hour: '12am', duration: '1h', title: 'First Yoga'}]
},
{
  title: '2022-08-04',
  data: [
    {hour: '4pm', duration: '1h', title: 'Pilates ABC'},
    {hour: '5pm', duration: '1h', title: 'Vinyasa Yoga'}
  ]
},
{
  title: '2022-08-06',
  data: [
    {hour: '1pm', duration: '1h', title: 'Ashtanga Yoga'},
    {hour: '2pm', duration: '1h', title: 'Deep Stretches'},
    {hour: '3pm', duration: '1h', title: 'Private Yoga'}
  ]
},
{
  title: '2022-08-08',
  data: [{hour: '12am', duration: '1h', title: 'Ashtanga Yoga'}]
},
{
  title: '2022-08-10',
  data: [{}]
},
{
  title: '2022-08-11',
  data: [
    {hour: '9pm', duration: '1h', title: 'Middle Yoga'},
    {hour: '10pm', duration: '1h', title: 'Ashtanga'},
    {hour: '11pm', duration: '1h', title: 'TRX'},
    {hour: '12pm', duration: '1h', title: 'Running Group'}
  ]
},
{
  title: '2022-08-13', 
  data: [
    {hour: '12am', duration: '1h', title: 'Ashtanga Yoga'}
  ]
},
{
  title: '2022-08-15', 
  data: [{}]
},
{
  title: '2022-08-20',
  data: [
    {hour: '9pm', duration: '1h', title: 'Pilates Reformer'},
    {hour: '10pm', duration: '1h', title: 'Ashtanga'},
    {hour: '11pm', duration: '1h', title: 'TRX'},
    {hour: '12pm', duration: '1h', title: 'Running Group'}
  ]
},
{
  title: '2022-08-21',
  data: [
    {hour: '1pm', duration: '1h', title: 'Ashtanga Yoga'},
    {hour: '2pm', duration: '1h', title: 'Deep Stretches'},
    {hour: '3pm', duration: '1h', title: 'Private Yoga'}
  ]
},
{
  title: '2022-08-22', 
  data: [
    {hour: '12am', duration: '1h', title: 'Last Yoga'}
  ]
}]
const App= () => {
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
    console.log(day)
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
    <View style={{flex: 1}}>
         <CalendarProvider
            date={timesheet[1].title}
            onDateChanged={onDateChanged}
            onMonthChange={onMonthChange}
            showTodayButton
            disabledOpacity={0.6} 
            theme={todayBtnTheme.current}
            // todayBottomMargin={16}
          >
            {weekView ? (
              <WeekCalendar  firstDay={1} markedDates={marked.current}/>
            ) : (
              <ExpandableCalendar
                // horizontal={false}
                hideArrows
                // disablePan
                // hideKnob
                // initialPosition={ExpandableCalendar.positions.OPEN}
                calendarStyle={styles.calendar}
                // headerStyle={styles.calendar} // for horizontal only
                // disableWeekScroll
                theme={theme.current}
                // disableAllTouchEventsForDisabledDays
                firstDay={1}
                markedDates={marked.current}
                // leftArrowImageSource={leftArrowIcon}
                // rightArrowImageSource={rightArrowIcon}
                // animateScroll
              />
            )}
            <AgendaList
              sections={timesheet}
              renderItem={renderItem}
              // scrollToNextEvent
              sectionStyle={styles.section}
              // dayFormat={'YYYY-MM-d'}
            />
          </CalendarProvider>
    </View>
  )
};

export default App;

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20
  },
  section: {
    backgroundColor: lightThemeColor,
    color: 'grey',
    textTransform: 'capitalize'
  }
});