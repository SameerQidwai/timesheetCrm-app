import React, {useContext, useEffect, useState} from 'react';
import { Dialog, TextInput, Portal, Button, Title, IconButton, Text, Subheading, } from 'react-native-paper';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import { addTimeEntryApi, editTimeEntryApi } from '../../services/timesheet-api';
import { userMilestonesApi } from '../../services/constant-api';
import { AppContext } from '../../context/AppContext';
import MDropDown from '../Common/MUI-dropdown';
import { formatDate } from '../../services/constant';

export default TimeEntryModal = ({ visible, data, onClose, onSuccess, edit, disabledKeys}) => {
  const { appStorage, setAppStorage } = useContext( AppContext )
  const [modalVisible, setModalVisible] = useState(visible);
  const [dateTime, setdateTime] = useState({ open: false, key: '', mode: 'date', });
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState(data);
  const [MILESTONES, setMILESTONES] = useState([])
  
  //defualt Value
  let disable = edit && data['status'] !== 'SV'

  useEffect(() => {
    
    const {id: userId, accessToken} = appStorage
    userMilestonesApi(userId, 0, accessToken)
    .then(res=>{
      const {success, data, setToken} = res
      if(success){
        setAppStorage(prev=> ({...prev, accessToken: setToken}))
        setMILESTONES(enableMilestones(data))
        setFetching(false)
      }
    })
  }, [])

  const enableMilestones = (data) =>{
    if(disabledKeys?.length >0){
      return data.map(el => {
        if (disabledKeys.includes(el.value)){
          el['disabled'] = true   
        }
        return el
      })
    }
    return data
  }

  const openDateTime = (open, key, mode, is24Hour) => {
    setdateTime({open, key, mode, is24Hour});
  };

  const setFieldValue = (key, value) => {
    if (dateTime['open']) {
      setdateTime(prev => ({...prev, open: false}));
      if (key !== 'breakHours'){
        value = moment(value, ["HH:mm"]); //this should be change to utc
      }
    }
    setFormData(prev => ({...prev, [key]: value}));
  };

  const hideDialog = () => {
    setModalVisible(false);
    onClose();
  };


  const onSubmit = () =>{
    setLoading(true)
    const {id: userId, accessToken} = appStorage
    const { startTime, endTime, date, breakHours} = formData
    let entry= {
      ...formData, 
      startTime: startTime.format('HH:mm'), 
      endTime: endTime.format('HH:mm'), 
      date: date.format('D/M/YYYY'),
      breakHours: breakHours ? moment.duration(moment(breakHours).format('HH:mm')).asHours(): 0
    }
    if (edit >= 0){
      editing(entry, accessToken)
    }else{
      adding(entry, userId, accessToken)
    }
  }

  const adding = (newEntry, userId, token) =>{
    let {date} = formData
    let query = {
      startDate: formatDate(date).startOf('month').format('DD-MM-YYYY'),
      endDate: formatDate(date).endOf('month').format('DD-MM-YYYY'),
      userId: userId
    }
    
    addTimeEntryApi(query, newEntry, token)
    .then(res =>{
      if(res?.success){
        setLoading(false)
        // setAppStorage(prev=> ({...prev, accessToken: res.setToken}))
        onSuccess(res.data)
      }
    })
  }

  const editing = (editEntry, token) =>{
    onSuccess(editEntry)
    editTimeEntryApi(editEntry, token)
    .then(res =>{
      if(res?.success){
        setLoading(false)
        // setAppStorage(prev=> ({...prev, accessToken: res.setToken}))
        onSuccess(res.data)
      }
    })
  }

  const getBreakTime = (date) =>{
    let hours = ("0" + new Date(date).getHours()).slice(-2);
    let minutes = ("0" + new Date(date).getMinutes()).slice(-2);
    return `${hours}:${minutes}`
  }

  return (
    <Portal>
      <Dialog
          visible={modalVisible}
          style={styles.modalView}
          onDismiss={hideDialog}>
        <View
          style={styles.modalHeader}
        >
          <View>
            <Title style={styles.headerText}>{`${formData['entryId']? 'Edit': 'Add' } Entry`}</Title>
          </View>
          <View >
            <IconButton 
              color='#fff' 
              icon="close" 
              size={20} 
              onPress={onClose}
            />
          </View>
        </View>
        <Dialog.Content style={styles.modalBody}>
          <Subheading style={styles.subheading}>
            {formatDate( formData['date'], false, 'dddd - DD MMM YYYY')}
          </Subheading>
          <Dialog.ScrollArea style={styles.fieldView}>
            <ScrollView>
              <MDropDown
                placeholder={'Select Project...'}
                dense
                label="Projects"
                value={formData['milestoneId']}
                disabled={disable}
                data={MILESTONES}
                onSelect={item => {
                  setFieldValue('milestoneId', item.value);
                }}
              />
              <TextInput
                value={formData['startTime'].format('LT')}
                mode="outlined"
                activeOutlineColor="#909090"
                disabled={disable}
                label="Start Time"
                placeholder="Set Time"
                keyboardType="decimal-pad"
                dense
                onFocus={() => {
                  openDateTime(true, 'startTime', 'time');
                }}
                onPressOut={() => {
                  openDateTime(true, 'startTime', 'time');
                }}
                showSoftInputOnFocus={false}
                style={styles.textInput}
              />
              <TextInput
                value={formData['endTime'].format('LT')}
                disabled={disable}
                mode="outlined"
                dense
                activeOutlineColor="#909090"
                label="End Time"
                placeholder="Set Time"
                onFocus={() => {
                  openDateTime(true, 'endTime', 'time');
                }}
                onPressOut={() => {
                  openDateTime(true, 'endTime', 'time');
                }}
                showSoftInputOnFocus={false}
                style={styles.textInput}
              />
              <TextInput
                value={getBreakTime(formData['breakHours'])}
                disabled={disable}
                mode="outlined"
                dense
                activeOutlineColor="#909090"
                label="Break Hours"
                placeholder="set hours"
                onFocus={() => {
                  openDateTime(true, 'breakHours', 'time', true);
                }}
                onPressOut={() => {
                  openDateTime(true, 'breakHours', 'time', true);
                }}
                showSoftInputOnFocus={false}
                style={styles.textInput}
              />
              <TextInput
                value={formData['notes']}
                disabled={disable}
                dense
                activeOutlineColor="#909090"
                mode="outlined"
                label="Notes"
                placeholder="Enter Note.."
                multiline
                numberOfLines={4}
                onChangeText={text => setFieldValue('notes', text)}
                returnKeyType="next"
                style={styles.textInput}
              />
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions style={styles.actionView}>
            <Button
              mode={'contained'}
              color="#909090"
              compact
              loading={loading}
              disabled={fetching || loading }
              style={{width: '45%', borderRadius: 2}}
              labelStyle={{color: '#fff'}}
              onPress={hideDialog}>
              Cancel
            </Button>
            <Button
              mode={'contained'}
              color="#1890ff"
              compact
              loading={loading}
              disabled={fetching || loading || disable}
              labelStyle={{color: '#fff'}}
              style={{width: '45%', borderRadius: 2}}
              onPress={onSubmit}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
      {dateTime.open && (
        <RNDateTimePicker
          mode={dateTime['mode']}
          is24Hour={dateTime['is24Hour']}
          minuteInterval={15}
          // display={dateTime['is24Hour']? 'spinner':'default'}
          display={dateTime['key'] !== 'date' ? 'spinner' : 'default'}
          themeVariant="dark"
          value={
            formData[dateTime['key']]
              ? dateTime['key'] !== 'date'
                ? moment(formData[dateTime['key']]).toDate()
                : formatDate(formData['date']).toDate()
              : new Date()
          }
          onChange={(event, dateValue) => {
            if (event?.type === 'set' && dateValue) {
              setFieldValue(dateTime.key, dateValue);
            }
          }}
        />
        // <DatePicker
        //   visible={dateTime.open}
        //   // selected={formData[dateTime['key']] ?
        //   //   moment(formData[dateTime['key']]).toDate()
        //   //   : new Date()
        //   // }
        //   mode={dateTime['mode']}
        //   interval={15}
        //   onDismiss={() => setdateTime(prev => ({...prev, open: false}))}
        //   onTimeChange={selectedTime => {
        //     console.log(selectedTime)
        //     setFieldValue(dateTime.key, selectedTime)
        //     // setdateTime(false);
        //   }}
        // />
      )}
    </Portal>
  );
};

// export default TimeEntryModal

const styles = StyleSheet.create({
  centeredView: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    // backgroundColor: 'white',
    borderRadius: 2,
    // width: 325,
    paddingVertical: 0,
    marginVertical: 0,
    margin: 0,
    marginTop: 0,
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
  modalBody: {
    // paddingVertical: 10,
    paddingBottom: 10,
    paddingTop: 0,
    paddingHorizontal: 20,
  },
  button: {
    borderRadius: 2,
    padding: 10,
    elevation: 2,
    width: 90,
  },
  fieldView: {
    paddingHorizontal: 0,
    paddingVertical: 15,
  },
  actionView: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  subheading:{
    paddingVertical: 10
  },
  divider: {
    marginVertical: 10,
  },
  buttonOpen: {
    backgroundColor: '#1890ff',
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
  modalHeader: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#1890ff',
    justifyContent: 'space-between', 
    flexDirection: 'row',
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    marginHorizontal: 0,
    marginTop: 0,
    marginVertical: 0,
  },
  headerText: {
    color: '#fff',
    fontWeight: '700',
  },
  bText: {
    color: '#fff',
  },
  select: {
    // appearance: 'none',
    // backgroundColor: '#fff',
    // borderRadius: 0,
    // border: '0px solid black',
    // boxSizing: 'border-box',
    // font: 14,
    // margin: 0,
    // padding: 0,
    // resize: 'none',
  },
  textInput: {marginVertical: 2}
});

//======================HELPER=================

