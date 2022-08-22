import RNDateTimePicker from '@react-native-community/datetimepicker';
import {Dialog, Divider, TextInput, Text } from 'react-native-paper';
import moment from 'moment';
import React, {useState} from 'react';
// import Autocomplete from 'react-native-autocomplete-input';
import {Modal, Pressable, ScrollView, StyleSheet, View} from 'react-native';

export default TimeEntryModal = ({visible, selectedDate, onClose}) => {
  const [formData, setFormData]= useState({date:selectedDate, startTime: moment(), endTime: moment(), notes: '', breakHour: ''})
  const [modalVisible, setModalVisible] = useState(visible);
  const [dateTime, setdateTime] = useState({open:false, key: '', mode: 'date'})

  const openDateTime = (open, key, mode) =>{
    setdateTime({ open, key, mode})
  }

  const setFieldValue = (key, value) => {
    if (dateTime['open']){
      setdateTime(prev=>({...prev, open:false}))
      value = moment(value)
    }
    setFormData(prev=>({...prev, [key]: value}));
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text h4 style={styles.headerText}>{'Add Entry'}</Text>
            </View>
            <View style={styles.modalBody}>
              <Pressable
                onPressOut={()=>{openDateTime(true, 'date', 'date')}}
              >
                <Text h4>{formData['date'].format('dddd - DD MM YYYY')}</Text>
              </Pressable>
              <Divider style={styles.divider}/>
              <ScrollView>
              {/* <Autocomplete
                autoCorrect={false}
                // value={query}
                // onChangeText={(text) => this.setState({ query: text })}
                data={[
                  { id: '1', title: 'Alpha' },
                  { id: '2', title: 'Beta' },
                  { id: '3', title: 'Gamma' },
                ]}
              /> */}
                <TextInput 
                  label="Project Name"
                  placeholder='Set Project'
                  returnKeyType='next'
                  value={formData['projectName']}
                />
                <TextInput 
                  label="Start Time"
                  placeholder='Set Time'
                  keyboardType='decimal-pad'
                  onFocus={()=>{openDateTime(true, 'startTime', 'time')}}
                  onPressOut={()=>{openDateTime(true, 'startTime', 'time')}}
                  showSoftInputOnFocus={false}
                  value={formData['startTime'].format('LT')}
                />
                <TextInput 
                  label="End Time"
                  placeholder='Set Time'
                  onFocus={()=>{openDateTime(true, 'endTime', 'time')}}
                  onPressOut={()=>{openDateTime(true, 'endTime', 'time')}}
                  showSoftInputOnFocus={false}
                  value={formData['endTime'].format('LT')}
                />
                <TextInput 
                  label="Break Hours"
                  placeholder='set hours'
                  keyboardType='decimal-pad'
                  onChange={(eventCount, target, text)=>setFieldValue('breakHours', text)}
                  />
                <TextInput 
                  label="Notes"
                  placeholder='Enter Note..'
                  multiline
                  numberOfLines={4}
                  onChange={(eventCount, target, text)=>setFieldValue('notes', text)}
                  returnKeyType='next'
                />
                <Divider style={styles.divider}/>
                <View style={styles.actionView}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {setModalVisible(!modalVisible); onClose()}}>
                    <Text style={styles.textStyle}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>Save</Text>
                  </Pressable>  
                </View>
              </ScrollView>
            </View>
            {dateTime.open&& <RNDateTimePicker 
              mode={dateTime['mode']} 
              value={formData[dateTime['key']] ? moment(formData[dateTime['key']]).toDate(): new Date()} 
              onChange={(event, dateValue)=>{setFieldValue(dateTime.key, dateValue)}}
            />}
          </View>
        </View>
      </Modal>
    </View>
  );
};

// export default TimeEntryModal

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: 325,
    // paddingVertical: 20,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalBody:{
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 90
  },
  actionView:{
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  divider:{
    marginVertical: 10
  },
  buttonOpen: {
    backgroundColor: '#4356fa',
  },
  buttonClose: {
    backgroundColor: '#f47b4e',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalHeader:{
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor:'#4356fa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerText: {
    color: '#fff'
  },
  select:{
    // appearance: 'none',
    // backgroundColor: '#fff',
    // borderRadius: 0,
    // border: '0px solid black',
    // boxSizing: 'border-box',
    // font: 14,
    // margin: 0,
    // padding: 0,
    // resize: 'none',
  }
});
