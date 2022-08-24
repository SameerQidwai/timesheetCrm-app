import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Dialog, Divider, TextInput, Text, Portal, Button, Subheading, Title, } from 'react-native-paper';
import moment from 'moment';
import React, {useState} from 'react';
import {Modal, Pressable, ScrollView, StyleSheet, View} from 'react-native';

export default TimeEntryModal = ({ visible, selectedDate, onClose, onSuccess, }) => {
  const data = [
    {id: '1', title: 'Alpha'},
    {id: '2', title: 'Beta'},
    {id: '3', title: 'Gamma'},
  ];
  const [formData, setFormData] = useState({ projectName: '', date: selectedDate, startTime: moment(), endTime: moment(), notes: '', duration: '',
  });
  const [modalVisible, setModalVisible] = useState(visible);
  const [dateTime, setdateTime] = useState({
    open: false,
    key: '',
    mode: 'date',
  });

  const openDateTime = (open, key, mode) => {
    setdateTime({open, key, mode});
  };

  const setFieldValue = (key, value) => {
    console.log({[key]:value})
    if (dateTime['open']) {
      setdateTime(prev => ({...prev, open: false}));
      value = moment(value);
    }
    setFormData(prev => ({...prev, [key]: value}));
  };

  const hideDialog = () => {
    setModalVisible(false);
    onClose();
  };

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
            }}>
            <Title style={styles.subheading}>
              {formData['date'].format('dddd - DD MMM YYYY')}
            </Title>
          </Pressable>
          <Dialog.ScrollArea style={styles.fieldView}>
            <ScrollView>
              {/* <Divider style={styles.divider}/  > */}
              <TextInput
                mode="outlined"
                label="Project Name"
                placeholder="Set Project"
                returnKeyType="next"
                value={formData['projectName']}
                onChangeText={(text) =>
                  setFieldValue('projectName', text)
                }
              />
              <TextInput
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
                value={formData['startTime'].format('LT')}
              />
              <TextInput
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
                value={formData['endTime'].format('LT')}
              />
              <TextInput
                mode="outlined"
                label="Break Hours"
                placeholder="set hours"
                keyboardType="decimal-pad"
                onChangeText={(text) =>
                  setFieldValue('duration', text)
                }
              />
              <TextInput
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
            <Pressable onPressOut={hideDialog}>
              <Button
                mode="contained"
                color="#f47b4e"
                compact
                labelStyle={styles.bText}>
                Cancel
              </Button>
            </Pressable>
            <Button
              mode="contained"
              color="#4356fa"
              compact
              labelStyle={styles.bText}
              onPress={()=>{
                const {startTime, endTime} = formData
                onSuccess({...formData, startTime: startTime.format('LT'), endTime: endTime.format('LT')})
              }}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
      {dateTime.open && (
        <RNDateTimePicker
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
