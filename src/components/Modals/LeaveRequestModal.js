import moment from 'moment';
import React, { useCallback, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker';

export default  LeaveRequestModal =({modalVisible, onClose, onSuccess, })=> {
  const [visible, setVisble] = useState(modalVisible)
  const [dateTime, setDateTime] = useState({ open: false, key: '', mode: 'date', });
  const [formData, setFormData] = useState({startDate: moment(), endDate: moment()})
  const [days, setDays] = useState([])

  const openDateTime = (open, key, mode) => {
      setDateTime({open, key, mode});
  };
  
  const setFieldValue = (key, value) => {
      if (dateTime['open']) {
        setDateTime(prev => ({...prev, open: false}));
        value = moment(value);
      }
      setFormData(prev => ({...prev, [key]: value}));
      if (key === 'startDate' || key === 'endDate'){
        setTimeout(() => {
          setNumberOfDays()
          
        }, 500);
      }
    };

  const hideDialog = () => {
    setVisble(false);
      onClose();
  };

  const setNumberOfDays = () => { 
    let dayArray= []
    let {startDate, endDate} = formData
    console.log(moment(startDate).toDate, moment(endDate).toDate)
    if (startDate && endDate) {
      startDate = moment(startDate)
      while(startDate.isSameOrBefore(endDate)){
        let day = moment(startDate).format('dddd - DD MMM YYYY')
        dayArray.push({label: day, key: day})
        startDate.add(1, 'days')
      }
      // }
    }else if(startDate){
      let day = moment(startDate).format('dddd - DD MMM YYYY')
      dayArray.push({label: day, key: day})
    }
    // setDays([dayArray])
    return dayArray
  }
    
  return (
    <Portal>
      <Dialog visible={visible} style={styles.modalView} onDismiss={hideDialog}>
        <Dialog.Title style={[styles.modalHeader, styles.headerText]}>
          {'Leave Request'}
        </Dialog.Title>
        <Dialog.Content>
          <Dialog.ScrollArea>
            <ScrollView>
              <TextInput
                mode="outlined"
                label="Leave Type"
                placeholder="Select Leave Type"
                returnKeyType="next"
                value={formData['leaveType']}
                onChangeText={text => setFieldValue('leaveType', text)}
              />
              <TextInput
                mode="outlined"
                label="Project Name"
                placeholder="Set Project"
                returnKeyType="next"
                value={formData['projectName']}
                onChangeText={text => setFieldValue('projectName', text)}
              />
              <TextInput
                mode="outlined"
                label="start Date"
                placeholder="Set Date"
                onFocus={() => {
                  openDateTime(true, 'startDate', 'date');
                }}
                onPressOut={() => {
                  openDateTime(true, 'startDate', 'date');
                }}
                showSoftInputOnFocus={false}
                value={formData['startDate'].format('dddd - DD MMM YYYY')}
              />
              <TextInput
                mode="outlined"
                label="End Date"
                placeholder="Set Date"
                onFocus={() => {
                  openDateTime(true, 'endDate', 'date');
                }}
                onPressOut={() => {
                  openDateTime(true, 'endDate', 'date');
                }}
                showSoftInputOnFocus={false}
                value={formData['endDate'].format('dddd - DD MMM YYYY')}
              />
              <View
                style={{
                  height: 150,
                  borderLeftWidth: 2,
                  padding: 5,
                  margin: 5,
                }}>
                <ScrollView>
                  {setNumberOfDays().map(el=>(
                    <TextInput
                      key={el.key}
                      dense
                      mode="outlined"
                      label={el.label}
                      placeholder="set hours"
                      keyboardType="decimal-pad"
                      onChangeText={text => setFieldValue(el.key, text)}
                    />))
                  }
                </ScrollView>
              </View>
              <TextInput
                mode="outlined"
                label="Notes"
                placeholder="Add Somre Reason.."
                multiline
                numberOfLines={4}
                onChangeText={text => setFieldValue('notes', text)}
                returnKeyType="next"
              />
            </ScrollView>
          </Dialog.ScrollArea>
        </Dialog.Content>
        <Dialog.Actions style={styles.actionView}>
          <Button
            mode="contained"
            color="#f47b4e"
            compact
            labelStyle={styles.bText}
            onPress={hideDialog}>
            Cancel
          </Button>
          <Button
            mode="contained"
            color="#4356fa"
            compact
            labelStyle={styles.bText}
            onPress={() => {
              const {startTime, endTime} = formData;
              onSuccess({
                ...formData,
                startTime: startTime.format('LT'),
                endTime: endTime.format('LT'),
              });
            }}>
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
      {dateTime.open && (
        <DateTimePicker
          mode={dateTime['mode']}
          value={
            formData[dateTime['key']]
              ? moment(formData[dateTime['key']]).toDate()
              : new Date()
          }
          onChange={(event, dateValue) => {
            setFieldValue(dateTime.key, dateValue);
          }}
        />
      )}
    </Portal>
  );
}

const styles = StyleSheet.create({
    centeredView: {
      // flex: 1,
      // justifyContent: 'center',
      // alignItems: 'center',
      // marginTop: 22,
    },
    modalView: {
      // backgroundColor: 'white',
      borderRadius: 20,
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
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      width: 90,
    },
    fieldView: {
      paddingHorizontal: 0,
      paddingVertical: 10,
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
