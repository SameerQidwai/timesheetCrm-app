import React, {useContext, useEffect, useState} from 'react';
import { Dialog, TextInput, Portal, Button, Title, } from 'react-native-paper';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {Pressable, ScrollView, StyleSheet} from 'react-native';
import { addTimeEntryApi, editTimeEntryApi } from '../../services/timesheet-api';
import { userMilestonesApi } from '../../services/constant-api';
import { AppContext } from '../../context/AppContext';
import MDropDown from '../MUI-dropdown';
import { formatDate } from '../../services/constant';

export default TimeEntryModal = ({ visible, data, onClose, onSuccess, edit}) => {
  const { appStorage, setAppStorage } = useContext( AppContext )
  const [modalVisible, setModalVisible] = useState(visible);
  const [dateTime, setdateTime] = useState({ open: false, key: '', mode: 'date', });
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    
    const {id: userId, accessToken} = appStorage
    userMilestonesApi(userId, 0, accessToken)
    .then(res=>{
      const {success, data, setToken} = res
      if(success){
        setAppStorage(prev=> ({...prev, accessToken: setToken}))
        setFetching(false)
      }
    })
  }, [])

  const openDateTime = (open, key, mode, is24Hour) => {
    setdateTime({open, key, mode, is24Hour});
  };

  const setFieldValue = (key, value) => {
    if (dateTime['open']) {
      setdateTime(prev => ({...prev, open: false}));
      if (key !== 'breakHours'){
        if (key !== 'date'){
          value = moment(value); //this should be change to utc
        }else{
          value = formatDate(value)
        }
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
    // editTimeEntryApi(editEntry, token)
    // .then(res =>{
    //   if(res?.success){
    //     setLoading(false)
    //     // setAppStorage(prev=> ({...prev, accessToken: res.setToken}))
    //     onSuccess(res.data)
    //   }
    // })
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
        <Dialog.Title style={[styles.modalHeader, styles.headerText]}>
          {'Add Entry'}
        </Dialog.Title>
        <Dialog.Content style={styles.modalBody}>
          <Pressable
            onPressOut={() => {
              openDateTime(true, 'date', 'date');
            }}
          >
            <Title style={styles.subheading}>
              {formData['date'].format('dddd - DD MMM YYYY')}
            </Title>
          </Pressable>
          <Dialog.ScrollArea style={styles.fieldView}>
            <ScrollView>
              <MDropDown
                placeholder={'Select Project...'}
                label="Projects"
                value={formData['milestoneId']}
                data={[{"label": "Non-Project Hours", "value": 15}]}
                onSelect={(item) => {setFieldValue('milestoneId', item.value)}}
              />
              <TextInput
                value={formData['startTime'].format('LT')}
                mode="outlined"
                label="Start Time"
                placeholder="Set Time"
                keyboardType="decimal-pad"
                onFocus={() => {
                  openDateTime(true, 'startTime', 'time');
                }}
                onPressOut={() => {
                  openDateTime(true, 'startTime', 'time');
                }}
                showSoftInputOnFocus={false}
              />
              <TextInput
                value={formData['endTime'].format('LT')}
                mode="outlined"
                label="End Time"
                placeholder="Set Time"
                onFocus={() => {
                  openDateTime(true, 'endTime', 'time');
                }}
                onPressOut={() => {
                  openDateTime(true, 'endTime', 'time');
                }}
                showSoftInputOnFocus={false}
              />
              {/* <TextInput
                value={formData['breakHours']}
                // value={'01:08'}
                mode="outlined"
                label="Break Hours"
                placeholder="set hours"
                keyboardType="decimal-pad"
                onChangeText={(text) =>
                  setFieldValue('breakHours', text)
                }
              /> */}
              <TextInput
                value={getBreakTime(formData['breakHours'])}
                mode="outlined"
                label="Break Hours"
                placeholder="set hours"
                onFocus={() => {
                  openDateTime(true, 'breakHours', 'time', true);
                }}
                onPressOut={() => {
                  openDateTime(true, 'breakHours', 'time', true);
                }}
                showSoftInputOnFocus={false}
              />
              <TextInput
                value={formData['notes']}
                mode="outlined"
                label="Notes"
                placeholder="Enter Note.."
                multiline
                numberOfLines={4}
                onChangeText={(text) =>
                  setFieldValue('notes', text)
                }
                returnKeyType="next"
              />
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions style={styles.actionView}>
            <Button
              mode={"contained"}
              color="#f47b4e"
              compact
              loading={loading}
              disabled={(fetching || loading)}
              labelStyle={{color: '#fff'}}
              onPress={hideDialog}
            >
              Cancel
            </Button>
            <Button
              mode={"contained"}
              color="#4356fa"
              compact
              loading={loading}
              disabled={(fetching || loading)}
              labelStyle={{color: '#fff'}}
              onPress={onSubmit}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
      {dateTime.open && (
        <RNDateTimePicker
          mode={dateTime['mode']}
          is24Hour={dateTime['is24Hour']}
          // display={dateTime['is24Hour']? 'spinner':'default'}
          display={dateTime['key'] !== 'date' ? 'spinner' :'default'}
          themeVariant="dark"
          value={
            formData[dateTime['key']] ? 
              dateTime['key'] !== 'date'?
              moment(formData[dateTime['key']]).toDate()
              :
              formatDate(formData['date']).toDate()
              : new Date()
          }
          onChange={(event, dateValue) => {
            if (event?.type === 'set' && dateValue){
              setFieldValue(dateTime.key, dateValue);
            }
          }}
        />
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
    justifyContent: 'space-evenly',
  },
  divider: {
    marginVertical: 10,
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
  modalHeader: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#4356fa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
});

//======================HELPER=================

