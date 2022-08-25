import moment from 'moment';
import React, { useCallback, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper'

export default  LeaveRequestModal =({modalVisible, onClose, onSuccess, })=> {
    console.log('is this working or not?')
    const [visible, setVisble] = useState(modalVisible)
    const [dateTime, setDateTime] = useState({ open: false, key: '', mode: 'date', });
    const [formData, setFormData] = useState({startDate: moment(), endDate: moment()})
    const [days, setDays] = useState(0)

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
      setVisble(false);
        onClose();
    };

    // const setNumberOfDays = useCallback(() => { 
    //   const {startDate, endDate} = formData
    //   if (startDate && endDate) {
    //     setDay(startDate.diff(endDate, 'days'))
    //   }else if(startDate){
    //     setDay(1)
    //   }else{
    //     setDay(0)
    //   }
    // },
    //   [formData],
    // )
    

    // const rednerDateHour = () =>{
    //     const {startDate, endDate} = formData
    //     let dates = []
    //     for (var day = moment(startDate); day.isSameOrBefore(endDate); day.add(1, 'days')){
    //         dates.push({
                
    //         })
    //     }
    // }
    
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
                            onChangeText={(text) =>
                            setFieldValue('leaveType', text)
                            }
                        />
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
                            label="start Date"
                            placeholder="Set Date"
                            onFocus={() => {
                            openDateTime(true, 'startDate', 'time');
                            }}
                            onPressOut={() => {
                            openDateTime(true, 'startDate', 'time');
                            }}
                            showSoftInputOnFocus={false}
                            value={formData['startDate'].format('dddd - DD MMM YYYY')}
                        />
                        <TextInput
                            mode="outlined"
                            label="End Date"
                            placeholder="Set Date"
                            onFocus={() => {
                            openDateTime(true, 'endDate', 'time');
                            }}
                            onPressOut={() => {
                            openDateTime(true, 'endDate', 'time');
                            }}
                            showSoftInputOnFocus={false}
                            value={formData['endDate'].format('dddd - DD MMM YYYY')}
                        />
                        <View style={{height: 150, borderLeftWidth: 2, padding: 5, margin: 5}}> 
                          <ScrollView> 
                          <TextInput
                            dense 
                            mode="outlined"
                            label="Break Hours"
                            placeholder="set hours"
                            keyboardType="decimal-pad"
                            onChangeText={(text) =>
                              setFieldValue('duration', text)
                            }
                          />
                          <TextInput
                            dense 
                            mode="outlined"
                            label="Break Hours"
                            placeholder="set hours"
                            keyboardType="decimal-pad"
                            onChangeText={(text) =>
                              setFieldValue('duration', text)
                            }
                          />
                          <TextInput
                            dense 
                            mode="outlined"
                            label="Break Hours"
                            placeholder="set hours"
                            keyboardType="decimal-pad"
                            onChangeText={(text) =>
                              setFieldValue('duration', text)
                            }
                          />
                          </ScrollView>
                        </View>
                        <TextInput
                            mode="outlined"
                            label="Notes"
                            placeholder="Add Somre Reason.."
                            multiline
                            numberOfLines={4}
                            onChangeText={(text) =>
                            setFieldValue('notes', text)
                            }
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
                            onPress={hideDialog}
                        >
                            Cancel
                        </Button>
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
            </Dialog>
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
