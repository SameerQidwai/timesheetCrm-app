/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useRef, useCallback, useEffect} from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Pressable, } from 'react-native';
import { Button, Caption, Divider, FAB, Headline, IconButton, Subheading, Text, Title, } from 'react-native-paper';
import { ExpandableCalendar, CalendarProvider, WeekCalendar, } from 'react-native-calendars';
import {getTheme, lightThemeColor, themeColor} from '../theme';
import moment from 'moment';
import TimeCard2 from '../components/Timesheet/TimeCard2';
import TimeCard from '../components/Timesheet/TimeCard';
import TimeEntryModal from '../components/Modals/TimeEntryModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RenderDay } from '../components/ConstantComponent';
import { timesheet_dailyhours, timesheet_data } from '../../assets/constant';





const WeeklyTimesheet = () => {
  const dailyhours = timesheet_dailyhours
  const [timesheet, setTimesheet] = useState(timesheet_data);
  const [openModal, setOpenModal] = useState(false);
  const [dateTime, setdateTime] = useState(false);
  const [sDate, setDate] = useState(moment(new Date()));
  const [items, setItems] = useState({});
  const [selected, setSelected] = useState({});
  const [longPressed, setLongPress] = useState(false);

  const onDateChanged = day => {
    let index = timesheet.findIndex(el => el.title === day);
    setDate(moment(day));
    setItems(timesheet[index]);
  };

  const onMonthChange = useCallback(month => {
    // console.warn('ExpandableCalendarScreen onMonthChange: ', month, updateSource);
    // setDate(moment(month));
  }, []);

  const onPressItem = (key, long) => {
    let newSelected = selected;
    let selectedItems = Object.keys(selected).length;
    if (longPressed && selectedItems > 0) {
      if (newSelected[key]) {
        delete newSelected[key];
        if (selectedItems === 1) {
          setLongPress(false);
        }
      } else {
        newSelected[key] = true;
      }
      setSelected({...newSelected});
    }
    if (!long && selectedItems === 0) {
      setOpenModal(true);
    }
    if (long && selectedItems === 0) {
      setSelected({[key]: true});
      setLongPress(true);
    }
  };

  const renderItem = ({item}) => {
    return (
      // <TouchableOpacity
      //   onLongPress={() => onPressItem(item.id, true)}
      //   onPress={() => onPressItem(item.id)}
      //   >
        <TimeCard2 
          timeEntry={item} selected={selected[item.id]} 
          onLongPress={() => onPressItem(item.id, true)}
          onPress={() => onPressItem(item.id)}
        />
      // </TouchableOpacity>
    );
  };

  const fabAction = () =>{
    if (longPressed) {
      let dateIndex = null;
      let copyTimesheet = timesheet.map((el, index) => {
        if (el.title === items.title) {
          dateIndex = index;
          el.data = el.data.filter(fel => {
            if (!Object.keys(selected).includes(`${fel.id}`)) {
              return fel;
            }
          });
        }
        return el;
      });
      setTimesheet(copyTimesheet);
      setItems(copyTimesheet[dateIndex]);
      setLongPress(false);
      setSelected({});
    } else {
      setOpenModal(!openModal);
    }
  }

  const onSuccess = (data) =>{
    console.log(data)
    let addDate = moment(data.date).format('yyyy-MM-DD')
    let index = timesheet.findIndex(el => el.title === addDate)
    let newTimesheet = timesheet
    if (index > -1){
      newTimesheet[index].data.push(data)
    }else{
      newTimesheet.push({title: addDate, data:[data]})
    }
    console.log(newTimesheet[newTimesheet.length -1])
    setTimesheet([...newTimesheet])
    setOpenModal(false)
  }

  return (
    <View style={styles.pageView}>
      <View style={styles.containerView}>
        <View>
          <IconButton icon="arrow-left" color="black" />
        </View>
        <View>
          <Pressable 
            android_ripple={{color: '#f8a587', borderless: true}}
            onPressOut={() => setdateTime(true)}>
            <Title>
              {sDate.format('MMM YYYY')}
              <IconButton
                icon="chevron-down"
                color="black"
                size={24}
                style={{
                  width: 28,
                  height: 20,
                }}
              />
            </Title>
          </Pressable>
        </View>
        <View>
          <View>
            <Caption>Total Hours</Caption>
          </View>
          <View>
            <Title style={{lineHeight: 20}}>{'120.66'}</Title>
          </View>
        </View>
      </View>
      <CalendarProvider
        date={sDate.format('yyyy-MM-DD')}
        // date={'2022-08-25'}
        onDateChanged={onDateChanged}
        onMonthChange={onMonthChange}
        // showTodayButton
        disabledOpacity={0.6}
        //  theme={todayBtnTheme.current}
        // todayBottomMargin={16}
        // pastScrollRange={1}
        // futureScrollRange={1}
        displayLoadingIndicator={true}>
        <WeekCalendar
          initialDate={sDate.format('yyyy-MM-DD')}
          // style={{backgroundColor: 'purple', height: 1000}}
          theme={{ todayTextColor: 'blue', }}
          // pastScrollRange={1}
          // futureScrollRange={1}
          displayLoadingIndicator={true}
          // customHeader
          enableSwipeMonths={false}
          // minDate={'2022-08-01'}
          // maxDate={'2022-08-31'}
          onMonthChange={onMonthChange}
          disableMonthChange
          // hideArrows
          rowHasChanged={(r1, r2) => {
            return r1.title !== r2.title;
          }}
          firstDay={1}
          animateScroll
          markingType={'custom'}
          markedDates={{ [sDate.format('yyyy-MM-DD')]: styles.calendarMarked, }}
          dayComponent={({date, state, marking, theme}) => (
            <RenderDay 
              date={date} 
              state={state} 
              marking={marking} 
              theme={theme} 
              onDateChanged={onDateChanged} 
              dailyhours={dailyhours} 
              sDate={sDate}
            />
          )}
        />
        <FlatList
          data={items?.data ?? []}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selected}
        />
      </CalendarProvider>
        <FAB
          style={styles.fab(longPressed)}
          placement="right"
          // icon={longPressed ? 'delete' : 'add'}
          icon={longPressed ? 'delete' : 'plus'}
          size="large"
          onPress={fabAction}
          // color={longPressed ? 'red' : 'green'}
        />
      {openModal && (
        <TimeEntryModal
          visible={openModal}
          selectedDate={sDate}
          onSuccess={onSuccess}
          //  data=
          onClose={() => setOpenModal(false)}
        />
      )}
      {dateTime && (
        <DateTimePicker
          mode={'date'}
          value={moment(sDate).toDate()}
          onChange={(event, dateValue) => {
            setdateTime(false)
            if (event?.type === 'set' && dateValue){
              dateValue&&setDate(moment(dateValue));
            }
          }}
        />
      )}
    </View>
  );
};

export default WeeklyTimesheet;

const styles = StyleSheet.create({
  pageView: {
    flex: 1, 
    backgroundColor: 'white'
  },
  containerView:{
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
  theme: {
    weekContainer: {
      height: 1000,
    },
  },
  calendarMarked: {
    customStyles: {
      container: {
        borderRadius: 5,
        paddingVertical:2,
        backgroundColor: '#2e44fc',
      },
      text: {
        color: 'white',
        fontWeight: 'bold',
      },
    },
  },
  calendar: {
    paddingHorizontal: 5,
  },
  section: {
    backgroundColor: lightThemeColor,
    color: 'grey',
    textTransform: 'capitalize',
  },
  fab: pressed => ({
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: pressed ? 'red' : '#f8a587',
  }),
});
