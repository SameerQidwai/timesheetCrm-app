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
import { deleteTimeEntryApi, getTimesheetApi } from '../services/timesheet-api';
import { AppContext } from '../context/AppContext';
import { formatDate, formatFloat, newFormatDate } from '../services/constant';


const WeeklyTimesheet = ({route, navigation}) => {
  // console.log('param',formatDate(route?.params?.sDate))
  // console.log('new',formatDate(new Date()))
  const {appStorage,setAppStorage} = useContext(AppContext)
  const [timesheet, setTimesheet] = useState({timesheet_data: timesheet_data, total: 0, dailyHour: {}});
  const [openModal, setOpenModal] = useState({visible: false});
  const [dateTime, setdateTime] = useState(false);
  const [sDate, setDate] = useState(formatDate(route?.params?.sDate) ??formatDate(new Date()));
  const [items, setItems] = useState({title: '', data: []});
  const [selected, setSelected] = useState({});
  const [longPressed, setLongPress] = useState(false);
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    getData()
  }, [])


  const getData = async() =>{
    const {id: userId, accessToken} = appStorage
    setFetching(true)
    let keys = {startDate: formatDate(sDate).startOf('month').format('DD-MM-YYYY'),
        endDate: formatDate(sDate).endOf('month').format('DD-MM-YYYY'),
        userId: userId
    }
    try {
        let {success, data, setToken} = await getTimesheetApi(keys, accessToken)
        if(success){
          const {daily_totalHour, grandTotal, newData, currItem} = restructure(data, sDate)
          setTimesheet({timesheet_data: [...newData], total: grandTotal, dailyHour: {...daily_totalHour}})
          setItems({title: currItem.title, data: [...currItem.data]})
          setAppStorage(prev=> ({...prev, accessToken: setToken}))
        }
        setFetching(false)
    }catch (e){
        console.log(e)
    }
  }

  const onDateChanged = day => {
    let start = moment(sDate).utcOffset(0, true).startOf('month')
    let end = moment(sDate).utcOffset(0, true).endOf('month')
    // if (moment(day,'yyyy-M-DD').isBetween(start, end, 'day', '[]')){
      setFetching(true)
      const {timesheet_data} = timesheet
      let entries = timesheet_data.find(el => el.title === day )?? {title: day, data: []}
      setDate(formatDate(day, 'YYYY-MM-DD'));
      setItems({title: entries.title, data: [...entries.data]})

      setTimeout(() => {
        setFetching(false)
      }, 500);
    // }
    // console.log(timesheet_data[index])
  };

  const onMonthChange = useCallback(month => {
    // console.warn('ExpandableCalendarScreen onMonthChange: ', month, updateSource);
    // setDate(moment(month));
  }, []);

  const onPressItem = (key, long, item, index) => {
    let newSelected = selected;
    let selectedItems = Object.keys(selected).length;
    if (longPressed && selectedItems > 0) {
      if (newSelected[key]) {
        delete newSelected[key];
        if (selectedItems === 1) {
          setLongPress(false);
        }
      } else {
        newSelected= {[key]: true}
      }
      setSelected({...newSelected});
    }
    if (!long && selectedItems === 0) {
      let duration = moment.duration(item['breakHours'], 'hours')
      setOpenModal({
        visible: true, 
        index,
        entryData: {
          ...item,
          date: sDate,
          startTime: moment(item['startTime'], ["HH:mm"]), 
          endTime: moment(item['endTime'], ["HH:mm"]), 
          breakHours: duration ? moment().hours(duration.hours()).minutes(duration.minutes()): new Date ().setHours(0, 0, 0, 0)
        }, 
      });
    }
    if (long && selectedItems === 0) {
      setSelected({[key]: true});
      setLongPress(true);
    }
  };

  const renderItem = ({item, index}) => {
    return (
        <TimeCard2 
          timeEntry={item} selected={selected[item.entryId]} 
          onLongPress={() => onPressItem(item.entryId, true)}
          onPress={() => onPressItem(item.entryId, false, item, index)}
        />
    );
  }

  const fabAction = () =>{
    if (longPressed) {
      setFetching(true)
      let entryId = Object.keys(selected)[0]
      let { accessToken } = appStorage
      deleteTimeEntryApi(entryId, accessToken)
      .then(res=>{
        console.log(res)
        if(res?.success){
          getData()
          setLongPress(false);
          setSelected({});
          // setAppStorage(prev=> ({...prev, accessToken: res.setToken}))
        }
      })
      
    } else {
      setOpenModal({
        visible: !openModal['visible'], 
        entryData: {
          date: moment(sDate).utcOffset(0, true), 
          startTime: moment('9:00', ["HH:mm"]), 
          endTime: moment('18:00', ["HH:mm"]),
          breakHours: new Date ().setHours(0, 0, 0, 0)
        }
      });
    }
  }

  const onSuccess = (data) =>{
    // getData()
    setDate(formatDate(data.date, 'DD-MM-YYYY'))
    setOpenModal({visible: false})
    const {currItem, ...rest} = timesheet_update(data, timesheet, openModal)
    setTimesheet({...rest})
    setItems({title: currItem.title, data: [...currItem.data]})
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
                style={{ width: 28, height: 20, }}
              />
            </Title>
          </Pressable>
        </View>
        <View>
          <View>
            <Caption>Total Hours</Caption>
          </View>
          <View>
            <Title style={{lineHeight: 20}}>{formatFloat(timesheet['total'])}</Title>
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
        /** Extra testing */
        allowShadow={true}
        displayLoadingIndicator={true}
        enableSwipeMonths={false}
        // minDate={formatDate(sDate).startOf('month').format('yyyy-MM-DD')}
        // maxDate={formatDate(sDate).endOf('month').format('yyyy-MM-DD')}
        pastScrollRange={0}
        futureScrollRange={0}
        // hideExtraDays={true}
        /** Extra testing */
        >
        <WeekCalendar
          current={sDate.format('yyyy-MM-DD')}
          // style={{backgroundColor: 'purple', height: 1000}}
          theme={{ todayTextColor: 'blue', }}
          // pastScrollRange={1}
          // futureScrollRange={1}
          /** Extra testing */
          allowShadow={true}
          // minDate={formatDate(sDate).startOf('month').format('yyyy-MM-DD')}
          // maxDate={formatDate(sDate).endOf('month').format('yyyy-MM-DD')}
          pastScrollRange={0}
          futureScrollRange={0}
          disableMonthChange
          // hideExtraDays={true}
          /** Extra testing */

          // onMonthChange={onMonthChange}
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
        icon={longPressed ? 'delete' : 'plus'}
        disabled={fetching}
        size="large"
        onPress={fabAction}
        // color={longPressed ? 'red' : 'green'}
      />
      {openModal['visible'] && (
        <TimeEntryModal
          visible={openModal['visible']}
          selectedDate={sDate}
          onSuccess={onSuccess}
          data={openModal['entryData']}
          edit={openModal['index']} //checking if oPress on existing entry
          onClose={() => setOpenModal({visible: false})}
        />
      )}
      {dateTime && (
        <DateTimePicker
          mode={'date'}
          value={formatDate(sDate).toDate()}
          onChange={(event, dateValue) => {
            setdateTime(false)
            if (event?.type === 'set' && dateValue){
              setDate(formatDate(dateValue));
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
  let year = moment(date).format('YYYY')
  let date_index = {}
  let daily_totalHour ={}
  let grandTotal = 0
  let newData = []
  let leaveData = []
  let currItem = {data: []}
  let count = 0
  data['milestones'].forEach((el, p_index)=>{
    Object.entries(el).forEach(([key, value], e_index) => {
        if (useRegex(key)){
            let keySplit = key.split('/')
            let newKey = formatDate(`${year}-${keySplit[1]}-${keySplit[0]}`, 'YYYY-M-D').format('YYYY-MM-DD')
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

  if (date_index[formatDate(date).format('YYYY-MM-DD')]){
    currItem = newData[date_index[formatDate(date).format('YYYY-MM-DD')]] ?? {}
  } 

  return {daily_totalHour, grandTotal, newData, currItem}
}

function timesheet_update (data, timesheet, openModal){
  
  let {timesheet_data, dailyHour: updateHours, total: updateTotal} = timesheet
  let addDate = formatDate(data.date, 'DD-MM-YYYY').format('YYYY-MM-DD')
  let added = false
  let currItem = {} //set current Item to set new data
  let updateTimesheet = timesheet_data.map((el, tIndex)=>{
    if(el.title === addDate){ 
      if(openModal['index'] >= 0){  //checking if the request is for edit

         el.data = el.data.map((dataEl,index)=>{
          if (index == openModal['index']){ // if edit is found
            let hours = dataEl['actualHours'] - data['actualHours']
            dataEl = data
            updateHours[addDate] += hours // updating updateHourss
            updateTotal += hours // updating monthly hours
            added = true
            return dataEl
          }else{
            return dataEl
          }
        })
        if (added){ 
          currItem = el
        }

        return el
      }else{ // if open['index'] is undefined the request is for ad
        el.data.push(data)
        updateHours[addDate] += data['actualHours'] // per day hour
        updateTotal += data['actualHours'] // updateTotal hours of the month
        added = true // test if key was found and has been added into app
        currItem = el
        return el
      }
    }else{
      if (!added && tIndex === timesheet_data.length -1){ // if day is not found

        el.push({title: addDate, data:[data]})
        updateHours[addDate] = data['actualHours'] // per day hour
        updateTotal += data['actualHours'] // updateTotal hours of the month
        added =true
        currItem = el
        return el

      }else{
        return el
      }
    }
  })
  console.log(updateTimesheet)
  if (!added){ // if timesheet is not found
    currItem = {title: addDate, data:[data]}
    updateTimesheet = [currItem]
    updateHours[addDate] = data['actualHours'] // per day hour
    updateTotal += data['actualHours'] // updateTotal hours of the month
    added =true
  }

  return {timesheet_data: updateTimesheet, dailyHour: updateHours, total: updateTotal, currItem}
}