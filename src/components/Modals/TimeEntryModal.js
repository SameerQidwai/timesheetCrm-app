import React, {useContext, useEffect, useState} from 'react';
import { Dialog, Portal, Button, Title, IconButton, Text, Subheading, } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import { addTimeEntryApi, editTimeEntryApi } from '../../services/timesheet-api';
import { userMilestonesApi } from '../../services/constant-api';
import { AppContext } from '../../context/AppContext';
import { formatDate } from '../../services/constant';
import { TextField, MDropDown } from '../Common/InputFields';
import { colors } from '../Common/theme';

const windowHeight = Dimensions.get('window').height;

export default TimeEntryModal = ({ modalVisible, data, onClose, onSuccess, disabledKeys}) => {
  const { appStorage, setAppStorage } = useContext( AppContext )
  const [visible, setVisible] = useState(modalVisible);
  const [dateTime, setdateTime] = useState({ open: false, key: '', mode: 'date', });
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState(data);
  const [MILESTONES, setMILESTONES] = useState([])
  
  //defualt Value
  let disable = (data['entryId'] && ['SB', 'AP'].includes(data['status']))
  let disableDropdown = (!data['entryId'] && data['milestoneId'])

  useEffect(() => {
    const {id: userId, accessToken} = appStorage
    userMilestonesApi(userId, 0, accessToken)
    .then(res=>{
      const {success, data, setToken} = res
      if(success){
        setMILESTONES(enableMilestones(data))
        setFetching(false)
      }
      setAppStorage(prev=> ({...prev, accessToken: setToken}))
    })
  }, [modalVisible])

  const enableMilestones = (data) =>{
    if(disabledKeys?.length >0){
      return data.map(el => {
        if (el.value !== formData?.['milestoneId'] && disabledKeys.includes(el.value)){
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
    // setModalVisible(false);
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

    if (entry['entryId'] > 0){
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
      <Dialog visible={visible} style={styles.modalView} onDismiss={hideDialog} dismissable={false}>
        <View style={styles.modalHeader} >
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
                label="Projects"
                value={formData['milestoneId']}
                disabled={disable || disableDropdown}
                data={MILESTONES}
                onSelect={item => {
                  setFieldValue('milestoneId', item.value);
                }}
              />
              <TextField
                value={formData['startTime'].format('LT')}
                disabled={disable}
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
              <TextField
                value={formData['endTime'].format('LT')}
                disabled={disable}
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
              <TextField
                value={getBreakTime(formData['breakHours'])}
                disabled={disable}
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
              <TextField
                value={formData['notes']}
                disabled={disable}
                label="Notes"
                placeholder="Enter Note.."
                textarea
                onChangeText={text => setFieldValue('notes', text)}
                returnKeyType="next"
              />
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions style={styles.actionView}>
            <Button
              mode={'contained'}
              color={colors['light']}
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
              color={colors['primary']}
              compact
              loading={loading}
              disabled={fetching || loading || disable || !formData?.['milestoneId']}
              labelStyle={{color: '#fff'}}
              style={{width: '45%', borderRadius: 2}}
              onPress={onSubmit}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
      {dateTime.open && (
        <DateTimePickerModal
          textColor={'#000'}
          isVisible={dateTime.open }
          mode={dateTime['mode']}
          is24Hour={dateTime['is24Hour']}
          minuteInterval={15}
          display={dateTime['key'] !== 'date' ? 'spinner' : 'default'}
          themeVariant="dark"
          date={
            formData[dateTime['key']]
              ? dateTime['key'] !== 'date'
                ? moment(formData[dateTime['key']]).toDate()
                : formatDate(formData['date']).toDate()
              : new Date()
          }
          onConfirm={(dateValue) => {
            if (dateValue) {
              setFieldValue(dateTime.key, dateValue);
            }
          }}
          onCancel={()=> setdateTime(prev => ({...prev, open: false}))}
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
  modalHeader: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: colors['primary'],
    justifyContent: 'space-between', 
    flexDirection: 'row',
    marginHorizontal: 0,
    marginTop: 0,
    marginVertical: 0,
  },
  headerText: {
    color: '#fff',
    fontWeight: '700',
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
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  bText: {
    color: '#fff',
  },
});

//======================HELPER=================

