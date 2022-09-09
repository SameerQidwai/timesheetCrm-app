import React, { useContext, useEffect, useState } from 'react'
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, IconButton, Portal, Subheading, Title } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppContext } from '../../context/AppContext';
import { getUserProjects } from '../../services/constant-api';
import { addLeaveApi, editLeaveApi, getLeaveApi, getUserLeaveType } from '../../services/leaveRequest-api';
import { formatDate } from '../../services/constant';
import { colors } from '../Common/theme';
import { MDropDown, TextField } from '../Common/InputFields';

export default  LeaveRequestModal =({modalVisible, onClose, onSuccess, edit })=> {
  const {appStorage, setAppStorage} = useContext(AppContext)
  const [visible, setVisble] = useState(modalVisible)
  const [dateTime, setDateTime] = useState({ open: false, key: '', mode: 'date', });
  const [formData, setFormData] = useState({})
  const [otherData, setOtherData] = useState({startDate: formatDate(new Date ()), endDate: formatDate(new Date ())})
  const [OPTIONS, setOptions] = useState({projects: [], leaves: [], mounted: false})
  const [days, setDays] = useState([])
  const [daysHours, setDaysHours] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const { mounted } =OPTIONS
    if (!mounted){
      getData()
    }else{
      setNumberOfDays()
    }

  }, [otherData, OPTIONS])
  

  const getData = () =>{
    const {id: userId, accessToken} = appStorage
    Promise.all([getUserProjects(userId, 'O', 0, accessToken), getUserLeaveType(accessToken), edit &&getLeaveApi(edit, accessToken)])
      .then((res) => {
        const { success: pSuccess, data: pData, setToken} =res[0]
        const { success: lSuccess, LeaveRequestTypes, contractDetails, holidays} =res[1]
        setOptions({
          projects: pSuccess? pData :[],
          leaves: lSuccess? LeaveRequestTypes: [],
          contractDetails: lSuccess ? contractDetails?? {} :{}, //holidays to cross of dates if type is not include holidays
          holidays: lSuccess ? holidays ?? {} :{},  //cotract details
          mounted: true
        })
        if (edit && res[2]?.success){ // run if modal is opened for editing
          const { success: rSuccess, data, entries, entriesHours} =res[2]
          //find holiday type to find if holidays are included or not
          let selectedLeaveType = LeaveRequestTypes.find(x=> x.id === (data.typeId ?? 0))
          setFormData({
            ...data,
            typeId: selectedLeaveType?.id,
            description: data.desc,
          })
          setDays(entries)
          setDaysHours(entriesHours)
          setTimeout(() => {
            setOtherData({
              leavetype: selectedLeaveType,
              startDate: formatDate(entries[0].date),
              endDate: formatDate(entries[entries.length-1].date)
            })
          }, 600);
        }
        setAppStorage(prev=> ({...prev, accessToken: setToken}))
        setFetching(false)
      })
  }

  const openDateTime = (open, key, mode) => {
      setDateTime({open, key, mode});
  };
  
  const setFieldValue = (key, value, event, dayIndex) => {
    if (dayIndex>=0){ //setting Hours in differnt array
      let cloneDays =  days
      cloneDays[dayIndex] = {...cloneDays[dayIndex], hours: value}
      setDays([...cloneDays])
    }else if (dateTime['open']) { //setting date fields

      setDateTime(prev => ({...prev, open: false}));
      if(event === 'set'){
        value = formatDate(value);
        setOtherData(prev => ({...prev, [key]: value}))
      }

    }else if (!event){ //setting text fields
      setFormData(prev => ({...prev, [key]: value}));
    }
  };

  const hideDialog = () => {
    setVisble(false);
      onClose();
  };

  const setNumberOfDays = () => { 
    let dayArray= []
    let hoursEntry = {}
    let {startDate, endDate, leavetype} = otherData
    let { contractDetails, holidays } = OPTIONS;
        // const { readOnly } = this.props
        let { include_off_days } = leavetype??{}
        var deFaulthours = contractDetails?.hoursPerDay ?? 0
    if (startDate) {
      //cloning date
      startDate = formatDate(startDate)  // if we are not selecting endDate it will be startDate
      while(startDate.isSameOrBefore((endDate?? startDate))){
        let day = formatDate(startDate, true, 'dddd - DD MMM YYYY')
         // need key to push in the table
        const disabled = !include_off_days && ( (startDate.format('ddd') === 'Sun' || startDate.format('ddd') === 'Sat') && 'Weekend' || holidays[startDate.format('M/D/YYYY')] )                                              
        //hours are getting update on each call
        let newDate = formatDate(startDate, true, 'YYYY-MM-DD')  // newDate  = date for the new row
        const hours = disabled? 0: daysHours[newDate] ? `${daysHours[newDate]}` : deFaulthours
        hoursEntry[newDate] = hours // will work on this later...
          // to set it in form for date
        dayArray.push({label: day, key: newDate, date:newDate, hours, disabled })
        startDate.add(1, 'days')
      }
      // }
    }
    setDays([...dayArray])
    // setDaysHours({...hoursEntry})
    // return dayArray
  }

  const getFormValues = () => {
    setLoading(true)
    const { description, workId,typeId } = formData;
    const {accessToken} = appStorage    
    const newVal = {
            description: description ?? '',
            typeId: typeId || 0,
            workId,
            entries: days,
            //this is for if I need a seperate variable for daysHours to stop reRendring
            // entries: days.map(el=> {
            //   el['hours'] = daysHours[el['date']]
            //   return el
            // }),
            // attachments: fileIds ?? []
            attachments: []
    }
    if(edit){
      editLeaveApi(edit, newVal, accessToken).then((res) => {
          setLoading(false)
          if (res.success) {
            setAppStorage(prev=> ({...prev, accessToken: res.setToken}))
            onSuccess()
          }
      });
    }else{
      addLeaveApi(newVal, accessToken).then((res) => {
          setLoading(false)
          if (res.success) {
            setAppStorage(prev=> ({...prev, accessToken: res.setToken}))
            onSuccess()
          }
      });
    }
  }
    
  return (
    <Portal>
      <Dialog visible={visible} style={styles.modalView} onDismiss={hideDialog}>
        <View style={styles.modalHeader} >
          <View>
            <Title style={styles.headerText}>{`${formData['entryId']? 'Edit': 'Add' } Leave Request`}</Title>
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Dialog.Content style={styles.modalBody}>
            <View style={styles.subHeader}>
              <Subheading style={styles.subheading}>
                {'Total Hours'}
              </Subheading>
              <Subheading style={styles.subheading}>
                {'Number of Days'}
              </Subheading>
            </View>
            <Dialog.ScrollArea style={styles.fieldView}>
              <ScrollView>
                <MDropDown
                  placeholder="Select Leave Types"
                  label="Leave Type"
                  value={formData['typeId']}
                  disabled={edit}
                  data={OPTIONS['leaves']}
                  onSelect={(item)=>{ 
                    setFieldValue('typeId', item.value)
                    setOtherData(prev => ({...prev, leavetype: item}))
                  }}
                  zIndex={3000}
                  zIndexInverse={1000}
                  schema={{
                    label: 'name',
                    value: 'id'
                  }}
                />
                <MDropDown
                  placeholder="Select Project"
                  label="Projects"
                  value={formData['workId']}
                  data={OPTIONS['projects']}
                  disabled={edit}
                  onSelect={(item)=> setFieldValue('workId', item.value)}
                  zIndex={1000}
                  zIndexInverse={3000}
                />
                <TextField
                  value={otherData['startDate'].format('dddd - DD MMM YYYY')}
                  label="start Date"
                  placeholder="Set Date"
                  onFocus={() => {
                    openDateTime(true, 'startDate', 'date');
                  }}
                  onPressOut={() => {
                    openDateTime(true, 'startDate', 'date');
                  }}
                  showSoftInputOnFocus={false}
                />
                <TextField
                  value={otherData['endDate'].format('dddd - DD MMM YYYY')}
                  label="End Date"
                  placeholder="Set Date"
                  onFocus={() => {
                    openDateTime(true, 'endDate', 'date');
                  }}
                  onPressOut={() => {
                    openDateTime(true, 'endDate', 'date');
                  }}
                  showSoftInputOnFocus={false}
                />
                <View
                  style={styles.timeFieldsView}>
                  <ScrollView>
                    {days.map((el, index)=>(
                      <TextField
                        key={el.key}
                        value={el.hours}
                        disabled={el.disabled}
                        label={el.label}
                        placeholder="set hours"
                        keyboardType="decimal-pad"
                        onChangeText={text => setFieldValue(el.key, text, false, index)}
                      />))
                    }
                  </ScrollView>
                </View>
                <TextField
                  value={formData['description']}
                  label="Notes"
                  placeholder="Add Some Reason.."
                  textarea
                  onChangeText={text => setFieldValue('description', text)}
                  returnKeyType="next"
                />
              </ScrollView>
            </Dialog.ScrollArea>
          </Dialog.Content>
        </KeyboardAvoidingView>
        <Dialog.Actions style={styles.actionView}>
          <Button
            mode={"contained"}
            loading={loading}
            color={colors['light']}
            disabled={(fetching|| loading)}
            compact
            style={{width: '45%', borderRadius: 2}}
            labelStyle={{color: '#fff'}}
            onPress={hideDialog}>
            Cancel
          </Button>
          <Button
            mode={ "contained"}
            loading={loading}
            color={colors['primary']}
            disabled={(fetching|| loading)}
            compact
            style={{width: '45%', borderRadius: 2}}
            labelStyle={{color: '#fff'}}
            onPress={ getFormValues}
          >
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
      {dateTime.open && (
        <DateTimePicker
          mode={dateTime['mode']}
          value={
            otherData[dateTime['key']]
              ? formatDate(otherData[dateTime['key']]).toDate()
              : new Date()
          }
          onChange={({type}, dateValue) => {
            setFieldValue(dateTime['key'], dateValue, type);
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
    subHeader:{
      justifyContent: 'space-between', 
      flexDirection: 'row',
    },
    modalBody: {
      // paddingVertical: 10,
      paddingBottom: 10,
      paddingTop: 0,
      paddingHorizontal: 20,
    },
    subheading:{
      paddingVertical: 10
    },
    button: {
      borderRadius: 2,
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
    
    bText: {
      color: '#fff',
    },
    timeFieldsView: {
      height: 150,
      borderLeftWidth: 2,
      padding: 5,
      margin: 5,
    }
  });
