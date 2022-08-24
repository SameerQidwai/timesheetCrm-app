

 import React, {useState} from 'react';
 import {
   SafeAreaView,
   ScrollView,
   StatusBar,
   useColorScheme,
   View,
   StyleSheet,
   TouchableOpacity
 } from 'react-native';
 
 import {Text, FAB } from 'react-native-paper';
 
 import { Colors, } from 'react-native/Libraries/NewAppScreen';
 import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import TimeCard from '../components/Timesheet/TimeCard';
import TimeCard2 from '../components/Timesheet/TimeCard2';
import moment from 'moment';
 
 const timesheet = [{
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
    {id:23,startTime:'12:00 PM', endTime: '9:00 PM', hour: '12am', duration: '1h', notes:  'As a cross platform UI Toolkit,', type:2, projectName: 'Ashtanga Yoga'}
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
 const AgendaTimesheet= () => {
   const isDarkMode = useColorScheme() === 'dark';
   const [items, setItems] = useState({})
   const [marked, setMarked] = useState({})
   const [selected, setSelected] = useState({})
    const [longPressed, setLongPress] = useState(false)

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
      if (long && selectedItems === 0){
          setSelected({[key]: true})
          setLongPress(true)
      }
  }
 
   const backgroundStyle = {
     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
   };
 
   const loadItems= (day) => {
     console.log(day)
     // setTimeout(() => {
       let newItems = {}
       let markedDate = {}
       for (let obj of timesheet){
         newItems[obj.title] = obj.data
         markedDate[obj.title] = {marked:true}
       }
       //console.log(items);
       setItems({[day.dateString]: newItems[day.dateString]?? {}})
       setMarked(markedDate)
     // }, 1000);
   }
   const renderItem = (item) => {
    if(item.projectName){
      return (
        <TouchableOpacity
          onLongPress={()=>onPressItem(item.id, true)}
          onPress={()=>onPressItem(item.id)}
        >
          <TimeCard
            timeEntry={item}
            selected={selected[item.id]}
            />
        </TouchableOpacity>
      );
    }
   };
 
   const renderEmptyDate = () => {
     return (
       <View style={styles.emptyDate}>
         <Text h4>No Time Sheet..!</Text>
       </View>
     );
   }
 
 
   return (
     <View style={{flex: 1}}>
          <Agenda
             selected={new Date(moment())}
             items={items}
             loadItemsForMonth={loadItems}
             renderItem={renderItem}
             renderEmptyDate={renderEmptyDate}
             markedDates={marked}
             // rowHasChanged={rowHasChanged}
             // markingType={'period'}
             // monthFormat={'yyyy'}
             showClosingKnob={true}
             rowHasChanged={(r1, r2) => {
               return r1.title !== r2.title;
             }}
             // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
             renderDay={(day, item) => (<View/>)}
             extraData={selected}
       />
       <FAB
            placement="right"
            icon={{ name: 'add', color: 'white' }}
            size="large"
            color={longPressed? "red" :"green"}
          />
     </View>
   )
 };
 
 export default AgendaTimesheet;
 
 
 const styles = StyleSheet.create({
   item: {
     padding: 20,
     backgroundColor: 'white',
     borderBottomWidth: 1,
     borderBottomColor: 'lightgrey',
     flexDirection: 'row',
     margin: 20,
     borderRadius: 20
   },
   itemHourText: {
     color: 'black'
   },
   itemDurationText: {
     color: 'grey',
     fontSize: 12,
     marginTop: 4,
     marginLeft: 4
   },
   itemTitleText: {
     color: 'black',
     marginLeft: 16,
     fontWeight: 'bold',
     fontSize: 16
   },
   itemButtonContainer: {
     flex: 1,
     alignItems: 'flex-end'
   },
   emptyItem: {
     paddingLeft: 20,
     height: 52,
     justifyContent: 'center',
     borderBottomWidth: 1,
     borderBottomColor: 'lightgrey'
   },
   emptyItemText: {
     color: 'lightgrey',
     fontSize: 14
   },
 });