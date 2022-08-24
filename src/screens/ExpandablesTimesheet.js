/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {useState, useRef, useCallback, useEffect} from 'react';
 import {  View, StyleSheet, TouchableOpacity, FlatList, Pressable,   } from 'react-native';
 import { FAB } from 'react-native-paper';
 
 import {ExpandableCalendar, CalendarProvider, WeekCalendar} from 'react-native-calendars';
 import { getTheme, lightThemeColor, themeColor } from '../theme';
 import moment from 'moment';
 import TimeCard2 from '../components/Timesheet/TimeCard2';
 import TimeCard from '../components/Timesheet/TimeCard';
 import TimeEntryModal from '../components/Modals/TimeEntryModal';
 
 const data = [{
 title: '2022-08-10',
 data: [{ id:1, startTime:'12:00 PM', endTime: '9:00 PM', hour: '12am', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:1, milestoneName: 'Milesone 1', projectName: 'First Yoga' }]
 },
 {
 title: '2022-08-11',
 data: [
   {id:2,startTime:'12:00 PM', endTime: '9:00 PM', hour: '4pm', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:1, milestoneName: 'Milesone 1', projectName: 'Pilates ABC'},
   {id:3,startTime:'12:00 PM', endTime: '9:00 PM', hour: '5pm', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:1, milestoneName: 'Milesone 1', projectName: 'Vinyasa Yoga'}
 ]
 },
 {
 title: '2022-08-12',
 data: [
   {id:4,startTime:'12:00 PM', endTime: '9:00 PM', hour: '1pm', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:1, milestoneName: 'Milesone 1', projectName: 'Ashtanga Yoga'},
   {id:5,startTime:'12:00 PM', endTime: '9:00 PM', hour: '2pm', duration: '1h',  type:2, projectName: 'Deep Stretches'},
   {id:6,startTime:'12:00 PM', endTime: '9:00 PM', hour: '3pm', duration: '1h',  type:1, milestoneName: 'Milesone 1', projectName: 'Private Yoga'}
 ]
 },
 {
 title: '2022-08-13',
 data: [{id:7,startTime:'12:00 PM', endTime: '9:00 PM', hour: '12am', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:1, milestoneName: 'Milesone 1', projectName: 'Ashtanga Yoga'}]
 },
 {
 title: '2022-08-15',
 data: [
   {id:8,startTime:'12:00 PM', endTime: '9:00 PM', hour: '9pm', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:1, milestoneName: 'Milesone 1', projectName: 'Middle Yoga'},
   {id:9,startTime:'12:00 PM', endTime: '9:00 PM', hour: '10pm', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:1, milestoneName: 'Milesone 1', projectName: 'Ashtanga'},
   {id:10,startTime:'12:00 PM', endTime: '9:00 PM', hour: '11pm', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:2, projectName: 'TRX'},
   {id:11,startTime:'12:00 PM', endTime: '9:00 PM', hour: '12pm', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:1, milestoneName: 'Milesone 1', projectName: 'Running Group'},
   {id:12,startTime:'12:00 PM', endTime: '9:00 PM', hour: '12pm', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:1, milestoneName: 'Milesone 1', projectName: 'Running Group'}
 ]
 },
 {
 title: '2022-08-17', 
 data: [
   {id:1,startTime:'12:00 PM', endTime: '9:00 PM', hour: '12am', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:2, projectName: 'Ashtanga Yoga'}
 ]
 },
 {
 title: '2022-08-18',
 data: [
   {id:13,startTime:'12:00 PM', endTime: '9:00 PM', hour: '9pm', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:1, milestoneName: 'Milesone 1', projectName: 'Pilates Reformer'},
   {id:14,startTime:'12:00 PM', endTime: '9:00 PM', hour: '10pm', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:1, milestoneName: 'Milesone 1', projectName: 'Ashtanga'},
   {id:15,startTime:'12:00 PM', endTime: '9:00 PM', hour: '11pm', duration: '1h',  type:2, projectName: 'TRX'},
   {id:16,startTime:'12:00 PM', endTime: '9:00 PM', hour: '12pm', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:1, milestoneName: 'Milesone 1', projectName: 'Running Group'},
   {id:17,startTime:'12:00 PM', endTime: '9:00 PM', hour: '12pm', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:1, milestoneName: 'Milesone 1', projectName: 'Running Group'}
 ]
 },
 {
 title: '2022-08-19',
 data: [
   {id:18,startTime:'12:00 PM', endTime: '9:00 PM', hour: '1pm', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:1, milestoneName: 'Milesone 1', projectName: 'Ashtanga Yoga'},
   {id:19,startTime:'12:00 PM', endTime: '9:00 PM', hour: '2pm', duration: '1h',  type:1, milestoneName: 'Milesone 1', projectName: 'Deep Stretches'},
   {id:20,startTime:'12:00 PM', endTime: '9:00 PM', hour: '3pm', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:1, milestoneName: 'Milesone 1', projectName: 'Private Yoga'}
 ]
 },
 {
 title: '2022-08-20', 
 data: [
   {id:21,startTime:'12:00 PM', endTime: '9:00 PM', hour: '12am', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:1, milestoneName: 'Milesone 1', projectName: 'Last Yoga'}
 ]
 }]
 
 const ExpandablesTimesheet= () => {
 const [timesheet, setTimesheet] = useState(data)
 const [openModal, setOpenModal] = useState(false)
 const [month, setMonth] = useState(moment(new Date()))
 const [date, setDate] = useState(moment(new Date()))
 const [items, setItems] = useState({})
 const [selected, setSelected] = useState({})
 const [longPressed, setLongPress] = useState(false)
 
 useEffect(() => {
   onDateChanged('2022-08-18')
 
 }, [])
 
 
 //  const weekView =  false
 //  const marked = useRef(()=>{
 //    let markedDate = {}
 //    for (let obj of timesheet){
 //      markedDate[obj.title] = {marked:true}
 //    }
 //    return markedDate
 //  });
   const theme = useRef(getTheme());
 
   const onDateChanged = (day) =>{
     // console.log(day)
     let index = timesheet.findIndex(el =>  el.title === day)
     // console.log(index)
     // console.log(timesheet)
     setDate(moment(day))
     setItems(timesheet[index])
   };
 
   const onMonthChange = useCallback((month) => {
   console.log(month)
     // console.warn('ExpandableCalendarScreen onMonthChange: ', month, updateSource);
     setMonth(moment(month))
   }, []);
 
   const onPressItem = (key, long)=>{
   let newSelected = selected
   let selectedItems = Object.keys(selected).length
   if (longPressed && selectedItems > 0){
       if (newSelected[key]){
           delete newSelected[key]
           if (selectedItems === 1){
               setLongPress(false)
           }
       }else{
           newSelected[key] = true
       }
       setSelected({...newSelected})
   }
   if (!long && selectedItems === 0){
     setOpenModal(true)
   }
   if (long && selectedItems === 0){
       setSelected({[key]: true})
       setLongPress(true)
   }
 }
 
   const renderItem = ({item}) =>{
     return (
     <TouchableOpacity
       onLongPress={()=>onPressItem(item.id, true)}
       onPress={()=>onPressItem(item.id)}
     >
       <TimeCard2 timeEntry={item} selected={selected[item.id]} />
     </TouchableOpacity>
     )
   }
 
   return (
     <View style={{flex: 1, backgroundColor: 'white'}}>
       <CalendarProvider
         date={date.format('yyyy-MM-DD')}
         //  date={'2022-08-19'}
         onDateChanged={onDateChanged}
         onMonthChange={onMonthChange}
         // showTodayButton
         disabledOpacity={0.6}
         //  theme={todayBtnTheme.current}
         // todayBottomMargin={16}
       >
         
         <WeekCalendar
         hideArrows
         rowHasChanged={(r1, r2) => {
         return r1.title !== r2.title;
        }}
       calendarStyle={styles.calendar}
         firstDay={1} 
         animateScroll
         />
         <ExpandableCalendar/>
         <FlatList
           data={items?.data ?? []}
           renderItem={renderItem}
           keyExtractor={item => item.id}
           extraData={selected}
         />
       </CalendarProvider>

       <Pressable
         onPressOut={() => {
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
       >
 
         <FAB
           style={styles.fab(longPressed)}
           placement="right"
           // icon={longPressed ? 'delete' : 'add'}
           icon={longPressed ? 'delete' : 'plus'}
           size="large"
           // color={longPressed ? 'red' : 'green'}
           
           />
       </Pressable>
       {openModal && (
         <TimeEntryModal
           visible={openModal}
           selectedDate={date}
         //  data=
           onClose={() => setOpenModal(false)}
         />
       )}
     </View>
   );
 };
 
 export default ExpandablesTimesheet;
 
 const styles = StyleSheet.create({
   calendar: {
   paddingHorizontal: 5
   },
   section: {
     backgroundColor: lightThemeColor,
     color: 'grey',
     textTransform: 'capitalize'
   },
   fab: (pressed)=> ({
     position: 'absolute',
     margin: 16,
     right: 0,
     bottom: 0,
     backgroundColor: pressed ? 'red' : 'green'
   }),
 });
 
 
