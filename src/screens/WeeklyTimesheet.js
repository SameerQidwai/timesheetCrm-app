/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useCallback, useEffect, useContext} from 'react';
import { View, StyleSheet, FlatList, Pressable, } from 'react-native';
import { Appbar, Button, Caption, FAB, Headline, IconButton, List, Text, Title, TouchableRipple, } from 'react-native-paper';
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
import DatePicker from '../components/DatePicker';
// import DatePicker from 'react-native-modern-datepicker';

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
    getData(sDate)
  }, [])


  const getData = async(date) =>{
    const {id: userId, accessToken} = appStorage
    setFetching(true)
    let keys = {startDate: formatDate(date).startOf('month').format('DD-MM-YYYY'),
        endDate: formatDate(date).endOf('month').format('DD-MM-YYYY'),
        userId: userId
    }
    try {
        let {success, data, setToken} = await getTimesheetApi(keys, accessToken)
        if(success){
          const {daily_totalHour, grandTotal, newData, currItem} = restructure(data, date)
          setTimesheet({timesheet_data: [...newData], total: grandTotal, dailyHour: {...daily_totalHour}})
          setItems({title: currItem.title, data: [...currItem.data]})
          setAppStorage(prev=> ({...prev, accessToken: setToken}))
        }else{
          setTimesheet({timesheet_data: [], total: 0, dailyHour: {}})
          setItems({title: '', data: []})
        }
        setFetching(false)
    }catch (e){
        console.log(e)
    }
  }

  const onDateChanged = (day, onDayChange) => {
    // console.log(day, onDayChange)
    day = formatDate(day, ['YYYY-MM-DD','YYYY/MM/DD'])
    if (day.isSame(sDate, 'month')){
        setFetching(true)
        const {timesheet_data} = timesheet
        let entries = timesheet_data.find(el => el.title === formatDate(day, false, true) )?? {title: day, data: []}
        setDate(day);
        setItems({title: entries.title, data: [...entries.data]})
  
        setTimeout(() => {
          setFetching(false)
        }, 500);
      
    }else{
      // if(onDayChange === 'update'){
        setFetching(true)
        getData(day)
        setDate(day);
      // }
    }
    
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
    // if (long && selectedItems === 0) {
    //   setSelected({[key]: true});
    //   setLongPress(true);
    // }
  };

  const renderItem = ({item, index}) => {
    return (
        <TimeCard2 
          timeEntry={item} selected={selected[item.entryId]} 
          // onLongPress={() => onPressItem(item.entryId, true)}
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
      <Appbar.Header style={styles.containerView}>
        <IconButton
          icon="arrow-left"
          color="#fff"
          size={30}
          style={{width: 20, marginLeft: 0, paddingVertical:10}}
          onPress={() => navigation.navigate('Timesheet')}
        />

        <Appbar.Content
          titleStyle={{paddingHorizontal: 0, margin: 0}}
          style={{paddingHorizontal: 0, marginLeft: 0}}
          title={
            // <View style={{flex: 1}}>
            <TouchableRipple
              onPress={() => setdateTime(!dateTime)}
              rippleColor="rgba(0, 0, 0, .32)">
              <Title
                style={{
                  textTransform: 'uppercase',
                  color: '#fff',
                }}>
                {sDate.format('MMM YYYY')}
                <IconButton
                  icon="chevron-down"
                  color="#fff"
                  size={24}
                  style={{width: 28, height: 20}}
                />
              </Title>
            </TouchableRipple>
            // </View>
          }
        />
        <Appbar.Content
          title={
            <View style={{justifyContent: 'center'}}>
              <View>
                <Caption style={{color: '#fff'}}>Total Hours</Caption>
              </View>
              <View>
                <Title
                  style={{lineHeight: 22, textAlign: 'center', color: '#fff'}}>
                  {formatFloat(timesheet?.['total'])}
                </Title>
              </View>
            </View>
          }
          titleStyle={{marginLeft: 'auto'}}
        />
      </Appbar.Header>
      <CalendarProvider
        date={sDate.format('yyyy-MM-DD')}
        // date={'2022-08-25'}
        onDateChanged={onDateChanged}
        // onMonthChange={onMonthChange}
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
          theme={{todayTextColor: 'blue'}}
          // pastScrollRange={1}
          // futureScrollRange={1}
          /** Extra testing */
          allowShadow={true}
          // minDate={formatDate(sDate).startOf('month').format('yyyy-MM-DD')}
          // maxDate={formatDate(sDate).endOf('month').format('yyyy-MM-DD')}
          pastScrollRange={0}
          futureScrollRange={0}
          disableMonthChange={true}
          enableSwipeMonths={true}
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
          markedDates={{[sDate.format('yyyy-MM-DD')]: styles.calendarMarked}}
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
        {items?.data.length >0 ?
          <FlatList
            data={items?.data ?? []}
            renderItem={renderItem}
            keyExtractor={item => item.entryId}
            extraData={selected}
            onRefresh={getData}
            refreshing={fetching}
          />
          :
          <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <IconButton icon="archive-cancel-outline" size={40}/>
            <Headline>No Record Found</Headline>
            <Text></Text>
          </View>
        }
      </CalendarProvider>
      {/* <FAB
        style={styles.fab(longPressed)}
        icon={longPressed ? 'delete' : 'plus'}
        disabled={fetching}
        size="large"
        onPress={fabAction}
        // color={longPressed ? 'red' : 'green'}
      /> */}
      {!longPressed ? <Button        
        mode="contained"
        uppercase={false}
        raised 
        color='#1890ff'
        style={{
            marginHorizontal: 15, 
            // marginBottom:15,
            marginVertical: 8,
            borderRadius: 2,
        }}
        size="large"
        disabled={fetching}
        onPress={fabAction}
      >
        Add Timesheet Entry
      </Button>
      :
        <Button        
          mode="contained"
          uppercase={false}
          raised 
          color="#ff4d4f"
          labelStyle={{color: '#fff'}}
          style={{
              marginHorizontal: 15, 
              // marginBottom:15,
              marginVertical: 10,
              borderRadius: 2,
          }}
          size="large"
          disabled={fetching}
          // onPress={()=>actionTimeSheet('Add')}
        >
          Delete Timesheet Entry
        </Button>
        }
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
        <DatePicker
          visible={dateTime}
          selected={formatDate(sDate, false, true)}
          mode="calendar"
          onDismiss={() => setdateTime(false)}
          onDateChange={selectedDate => {
            onDateChanged(selectedDate)
            setdateTime(false);
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
    backgroundColor: '#f6f4f1'
  },
  containerView:{
    flexDirection: 'row',
    backgroundColor: '#1890ff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingLeft: 0
  },
  theme: {
    weekContainer: {
      height: 1000,
    },
  },
  calendarMarked: {
    customStyles: {
      container: {
        borderRadius: 2,
        paddingVertical:2,
        backgroundColor: '#1890ff'
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
  console.log(data)
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
            let newKey = formatDate(`${year}-${keySplit[1]}-${keySplit[0]}`, 'YYYY-M-D', true)
            console.log(newKey)
            if (el.leaveRequest){
              value = {
                ...value,
                entryId: 'l'+ e_index,
                project: el['project'],
                projectType: el['projectType'],
                leaveRequest: el['leaveRequest'],
                leaveType: el['leaveType'],
                typeId: el['typeId'],
                projectId: el['workId'],
                totalHours: el['totalHours']
            }
            }else{
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
            }
            
            if (date_index[newKey] >= 0){
              console.log(date_index[newKey], newKey)
              if(!el.leaveRequest){
                newData[date_index[newKey]]['data'].push(value)
                daily_totalHour[newKey] += value['actualHours']
                grandTotal += el['totalHours']
              }else{
                newData[date_index[newKey]]['data'].push(value)
              }
            }else{
              console.log(date_index[newKey], newKey, 'NotFound')
              if(!el.leaveRequest){
                date_index[newKey] = count
                newData.push({title: newKey, data: [value]})
                daily_totalHour[newKey] = value['actualHours']
                grandTotal = el['totalHours']
                count++
              }else{
                date_index[newKey] = count
                newData.push({title: newKey, data: [value]})
                count++
              }
            }
        }
    })
  })
  console.log(newData)
  if (date_index[formatDate(date, false, true)] >=0){
    currItem = newData[date_index[formatDate(date, false, true)]] ?? {}
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