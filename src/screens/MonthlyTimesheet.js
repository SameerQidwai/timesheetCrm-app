

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
 
 import {Text, Card} from '@rneui/themed'
 
 import { Colors, } from 'react-native/Libraries/NewAppScreen';
 import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
 
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
 const MonthlyTimeSheet= () => {
   const isDarkMode = useColorScheme() === 'dark';
   const [items, setItems] = useState({})
   const [marked, setMarked] = useState({})
 
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
   const timeToString= (time) => {
     const date = new Date(time);
     return date.toISOString().split('T')[0];
   }
 
   const renderItem = (item) => {
     return (
       <TouchableOpacity style={styles.item} >
        <View>
          <Text style={styles.itemHourText}>{item.hour}</Text>
          <Text style={styles.itemDurationText}>{item.duration}</Text>
        </View>
        <Text style={styles.itemTitleText}>{item.title}</Text>
      </TouchableOpacity>
     );
   };
 
   const renderEmptyDate = () => {
     return (
       <View style={styles.emptyDate}>
         <Text>This is empty date!</Text>
       </View>
     );
   }
 
 
   return (
     <View style={{flex: 1}}>
          <Agenda
             selected={new Date()}
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
       />
     </View>
   )
 };
 
 export default MonthlyTimeSheet;
 
 
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
   }
 });