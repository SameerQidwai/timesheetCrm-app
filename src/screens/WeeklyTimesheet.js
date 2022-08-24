/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import {
  Button,
  Caption,
  Divider,
  FAB,
  Headline,
  IconButton,
  Subheading,
  Text,
  Title,
} from 'react-native-paper';

import {
  ExpandableCalendar,
  CalendarProvider,
  WeekCalendar,
} from 'react-native-calendars';
import {getTheme, lightThemeColor, themeColor} from '../theme';
import moment from 'moment';
import TimeCard2 from '../components/Timesheet/TimeCard2';
import TimeCard from '../components/Timesheet/TimeCard';
import TimeEntryModal from '../components/Modals/TimeEntryModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RenderDay } from '../components/ConstantComponent';

const data = [
  {
    title: '2022-08-10',
    data: [
      {
        id: 1,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        notes: 'As a cross platform UI Toolkit,',
        type: 1,
        milestoneName: 'Milesone 1',
        projectName: 'First Yoga',
      },
    ],
  },
  {
    title: '2022-08-11',
    data: [
      {
        id: 2,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        notes: 'As a cross platform UI Toolkit,',
        type: 1,
        milestoneName: 'Milesone 1',
        projectName: 'Pilates ABC',
      },
      {
        id: 3,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        notes: 'As a cross platform UI Toolkit,',
        type: 1,
        milestoneName: 'Milesone 1',
        projectName: 'Vinyasa Yoga',
      },
    ],
  },
  {
    title: '2022-08-12',
    data: [
      {
        id: 4,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        notes: 'As a cross platform UI Toolkit,',
        type: 1,
        milestoneName: 'Milesone 1',
        projectName: 'Ashtanga Yoga',
      },
      {
        id: 5,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        type: 2,
        projectName: 'Deep Stretches',
      },
      {
        id: 6,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        type: 1,
        milestoneName: 'Milesone 1',
        projectName: 'Private Yoga',
      },
    ],
  },
  {
    title: '2022-08-13',
    data: [
      {
        id: 7,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        notes: 'As a cross platform UI Toolkit,',
        type: 1,
        milestoneName: 'Milesone 1',
        projectName: 'Ashtanga Yoga',
      },
    ],
  },
  {
    title: '2022-08-15',
    data: [
      {
        id: 8,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        notes: 'As a cross platform UI Toolkit,',
        type: 1,
        milestoneName: 'Milesone 1',
        projectName: 'Middle Yoga',
      },
      {
        id: 9,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        notes: 'As a cross platform UI Toolkit,',
        type: 1,
        milestoneName: 'Milesone 1',
        projectName: 'Ashtanga',
      },
      {
        id: 10,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        notes: 'As a cross platform UI Toolkit,',
        type: 2,
        projectName: 'TRX',
      },
      {
        id: 11,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        notes: 'As a cross platform UI Toolkit,',
        type: 1,
        milestoneName: 'Milesone 1',
        projectName: 'Running Group',
      },
      {
        id: 12,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        notes: 'As a cross platform UI Toolkit,',
        type: 1,
        milestoneName: 'Milesone 1',
        projectName: 'Running Group',
      },
    ],
  },
  {
    title: '2022-08-17',
    data: [
      {
        id: 1,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        notes: 'As a cross platform UI Toolkit,',
        type: 2,
        projectName: 'Ashtanga Yoga',
      },
    ],
  },
  {
    title: '2022-08-18',
    data: [
      {
        id: 13,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        notes: 'As a cross platform UI Toolkit,',
        type: 1,
        milestoneName: 'Milesone 1',
        projectName: 'Pilates Reformer',
      },
      {
        id: 14,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        notes: 'As a cross platform UI Toolkit,',
        type: 1,
        milestoneName: 'Milesone 1',
        projectName: 'Ashtanga',
      },
      {
        id: 15,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        type: 2,
        projectName: 'TRX',
      },
      {
        id: 16,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        notes: 'As a cross platform UI Toolkit,',
        type: 1,
        milestoneName: 'Milesone 1',
        projectName: 'Running Group',
      },
      {
        id: 17,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        notes: 'As a cross platform UI Toolkit,',
        type: 1,
        milestoneName: 'Milesone 1',
        projectName: 'Running Group',
      },
    ],
  },
  {
    title: '2022-08-19',
    data: [
      {
        id: 18,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        notes: 'As a cross platform UI Toolkit,',
        type: 1,
        milestoneName: 'Milesone 1',
        projectName: 'Ashtanga Yoga',
      },
      {
        id: 19,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        type: 1,
        milestoneName: 'Milesone 1',
        projectName: 'Deep Stretches',
      },
      {
        id: 20,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        notes: 'As a cross platform UI Toolkit,',
        type: 1,
        milestoneName: 'Milesone 1',
        projectName: 'Private Yoga',
      },
    ],
  },
  {
    title: '2022-08-20',
    data: [
      {
        id: 21,
        startTime: '12:00 PM',
        endTime: '9:00 PM',
        hour: 9,
        duration: '1h',
        notes: 'As a cross platform UI Toolkit,',
        type: 1,
        milestoneName: 'Milesone 1',
        projectName: 'Last Yoga',
      },
    ],
  },
];

const dailyhours = {
  '2022-08-10': '1',
  '2022-08-11': '2.3',
  '2022-08-12': '3.45',
  '2022-08-13': '4',
  '2022-08-15': '5.2',
  '2022-08-18': '6.4',
  '2022-08-19': '7',
  '2022-08-20': '8.24',
  '2022-08-21': '6.4',
  '2022-08-22': '7',
  '2022-08-23': '16.99',
  '2022-08-24': '10.4',
  '2022-08-25': '18.3',
  '2022-08-26': '24.24',
      
}

const WeeklyTimesheet = () => {
//   const dailyhours = data.reduce((acc, post) => {
//     let {title, data} = post;
//     return { [title]: data.reduce((a,b)=> a.duration+b.duration, 0) };
// }, {});
  const [timesheet, setTimesheet] = useState(data);
  const [openModal, setOpenModal] = useState(false);
  const [dateTime, setdateTime] = useState(false);
  const [month, setMonth] = useState(moment(new Date()));
  const [sDate, setDate] = useState(moment(new Date()));
  const [items, setItems] = useState({});
  const [selected, setSelected] = useState({});
  const [longPressed, setLongPress] = useState(false);

  useEffect(() => {
    // onDateChanged('2022-08-18');
  }, []);

  const theme = useRef(getTheme());

  const onDateChanged = day => {
    // console.log(day)
    let index = timesheet.findIndex(el => el.title === day);
    // console.log(index)
    // console.log(timesheet)
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

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingRight: 10,
        }}>
        <View>
          <IconButton icon="arrow-left" color="black" />
        </View>
        <View>
          <Pressable 
            android_ripple={{color: '#747474', borderless: true}}
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
          theme={{
            todayTextColor: 'red',
            // calendarBackground: 'yellow',
          }}
          // style={{backgroundColor: 'red'}}

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
          markedDates={{
            [sDate.format('yyyy-MM-DD')]: {
              customStyles: {
                container: {
                  borderRadius: 5,
                  paddingVertical:2
                },
                text: {
                  color: 'white',
                  fontWeight: 'bold'
                },
              },
            },
          }}
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
          onPress={() => {
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
          }}
          // color={longPressed ? 'red' : 'green'}
        />
      {openModal && (
        <TimeEntryModal
          visible={openModal}
          selectedDate={sDate}
          //  data=
          onClose={() => setOpenModal(false)}
        />
      )}
      {dateTime && (
        <DateTimePicker
          mode={'date'}
          value={moment(sDate).toDate()}
          // value={formData[dateTime['key']] ? moment(formData[dateTime['key']]).toDate(): new Date()}
          // onChange={(event, dateValue)=>{setFieldValue(dateTime.key, dateValue)}}
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
  theme: {
    weekContainer: {
      height: 1000,
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
    backgroundColor: pressed ? 'red' : 'green',
  }),
});
