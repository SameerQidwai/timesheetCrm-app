/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useCallback, useEffect, useContext} from 'react';
import { View, StyleSheet, FlatList, Pressable, } from 'react-native';
import { Caption, FAB, IconButton, Title, } from 'react-native-paper';
import {  CalendarProvider, WeekCalendar, } from 'react-native-calendars';
import { lightThemeColor} from '../theme';
import moment from 'moment';
import TimeCard2 from '../components/Timesheet/TimeCard2';
import TimeEntryModal from '../components/Modals/TimeEntryModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RenderDay } from '../components/ConstantComponent';
import { timesheet_dailyhours, timesheet_data } from '../../assets/constant';
import { getTimesheetApi } from '../services/timesheet-api';
import { AppContext } from '../context/AppContext';


const WeeklyTimesheet = ({route, navigation}) => {
  const {appStorage} = useContext(AppContext)
  const [timesheet, setTimesheet] = useState({timesheet_data: timesheet_data, total: "0.00", dailyHour: {}});
  const [openModal, setOpenModal] = useState(false);
  const [dateTime, setdateTime] = useState(false);
  const [sDate, setDate] = useState(moment(route?.params?.sDate) ??moment(new Date()));
  const [items, setItems] = useState({});
  const [selected, setSelected] = useState({});
  const [longPressed, setLongPress] = useState(false);
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    getData()
  }, [])


  const getData = async() =>{
    setFetching(true)
    let keys = {startDate: '01-11-2021'?? moment(sDate).startOf('month').format('DD-MM-YYYY'),
        endDate: '30-11-2021'??moment(sDate).endOf('month').format('DD-MM-YYYY'),
        userId: 12??appStorage['id']
    }
    try {
        let {success, data} = await getTimesheetApi(keys, appStorage['accessToken'])
        if(success){
          const {daily_totalHour, grandTotal, newData} = restructure(data, sDate)
          // console.log(newData)
          setTimesheet({timesheet_data: newData, total: grandTotal, dailyHour: daily_totalHour})
          setFetching(false)
        }
    }catch (e){
        console.log(e)
    }
  }

  const onDateChanged = day => {
    const {timesheet_data} = timesheet
    let index = timesheet_data.findIndex(el => el.title === moment(day).format('yyyy-M-D'));
    setDate(moment(day));
    setItems(timesheet_data[index]);
    // console.log(timesheet_data[index])
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
        <TimeCard2 
          timeEntry={item} selected={selected[item.entryId]} 
          onLongPress={() => onPressItem(item.entryId, true)}
          onPress={() => onPressItem(item.entryId)}
        />
    );
  };

  const fabAction = () =>{
    const {timesheet_data} = timesheet
    if (longPressed) {
      let dateIndex = null;
      let copyTimesheet = timesheet_data.map((el, index) => {
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
      setTimesheet(prev => ({...prev, timesheet_data: copyTimesheet}));
      setItems(copyTimesheet[dateIndex]);
      setLongPress(false);
      setSelected({});
    } else {
      setOpenModal(!openModal);
    }
  }

  const onSuccess = (data) =>{
    const {timesheet_data} = timesheet
    let addDate = moment(data.date).format('yyyy-MM-DD')
    let index = timesheet_data.findIndex(el => el.title === addDate)
    let newTimesheet = timesheet_data
    if (index > -1){
      newTimesheet[index].data.push(data)
    }else{
      newTimesheet.push({title: addDate, data:[data]})
    }
    setTimesheet([...newTimesheet])
    setOpenModal(false)
  }
  
  return (
    <View style={styles.pageView}>
      <View style={styles.containerView}>
        <View>
          <IconButton 
            icon="arrow-left" 
            color="black"
            onPress={()=>navigation.navigate('Timesheet')} 
          />
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
            <Title style={{lineHeight: 20}}>{timesheet['total']}</Title>
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
          minDate={moment(sDate).startOf('month').format('yyyy-MM-DD')}
          maxDate={moment(sDate).endOf('month').format('yyyy-MM-DD')}
          // onMonthChange={onMonthChange}
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
              dailyhours={timesheet['dailyHour']} 
              sDate={sDate}
            />
          )}
        />
        <FlatList
          data={items?.data ?? []}
          renderItem={renderItem}
          keyExtractor={item => item.entryId}
          extraData={selected}
          onRefresh={getData}
          refreshing={fetching}
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


//--------Helping Function --------//

function useRegex(input) {
  let regex = /(0?[1-9]|[12][0-9]|3[01])\/[0-9]+/i;
  return regex.test(input);
}

function restructure (data, date) {
  let year = '2021'??moment(date).format('YYYY')
  let date_index = {}
  let daily_totalHour ={}
  let grandTotal = 0
  let newData = []
  let leaveData = []
  let count = 0
  data['milestones'].forEach((el, p_index)=>{
    Object.entries(el).forEach(([key, value], e_index) => {
        if (useRegex(key)){
            let keySplit = key.split('/')
            let newKey = `${year}-${keySplit[1]}-${keySplit[0]}`
            value = {
                ...value,
                milestone: el['milestone'],
                project: el['project'],
                projectType: el['projectType'],
                status: el['status'],
                milestoneId: el['milestoneId'],
                projectId: el['projectId'],
                milestoneEntryId: el['milestoneEntryId'],
            }
            if (date_index[newKey]){
              if(!el.leaveRequest){
                newData[date_index[newKey]]['data'].push(value)
                daily_totalHour[newKey] += value['actualHours']
                grandTotal += el['totalHours']
              }
            }else{
              if(!el.leaveRequest){
                date_index[newKey] = count
                newData.push({title: newKey, data: [value]})
                daily_totalHour[newKey] = value['actualHours']
                grandTotal = el['totalHours']
                count++
              }
            }
        }
    })
  })
  // console.log('________________________________________________>')
  // console.log(newData[0])
  // console.log('<________________________________________________')
  return {daily_totalHour, grandTotal, newData}
}


