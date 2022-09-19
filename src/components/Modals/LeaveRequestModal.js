import React, { useContext, useEffect, useState } from 'react'
import { Alert, Dimensions, Image, KeyboardAvoidingView, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { Button, Dialog, IconButton, List, Modal, Portal, Subheading, Text, Title, TouchableRipple } from 'react-native-paper'
// import DateTimePicker from '@react-native-community/datetimepicker';
import { AppContext } from '../../context/AppContext';
import { getUserProjects } from '../../services/constant-api';
import { addLeaveApi, editLeaveApi, getLeaveApi, getUserLeaveType } from '../../services/leaveRequest-api';
import { formatDate, formatFloat, thumbUrl } from '../../services/constant';
import { colors } from '../Common/theme';
import { MDropDown, TextField } from '../Common/InputFields';
import DatePicker from '../Common/DatePicker';
import { ColView } from '../Common/ConstantComponent';
import DocumentPicker, { types } from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {addAttachment} from '../../services/attachment-api'
import { checkPermission } from '../Common/DownloadFile';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


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
  const [expanded, setExpanded] = useState(false)
  const [documentModal, setDocumentModal] = useState(false);
  const [showFullSize, setShowFullSize] = useState(false);
  
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
            attachments: data.attachments
          })
          setDays(entries)
          setDaysHours(entriesHours)
          setTimeout(() => {
            setOtherData({
              leavetype: selectedLeaveType,
              startDate: formatDate(entries[0].date),
              endDate: formatDate(entries[entries.length-1].date)
            })
          }, 300);
        }
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
        value = formatDate(value, 'YYYY/MM/DD');
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
      while(startDate.isSameOrBefore((endDate?? startDate), 'day')){
        let day = formatDate(startDate, true, 'ddd, DD MMM')
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
  
  const getFormValues = async () => {
    console.log("press hua");
    setLoading(true)
    const { description, workId,typeId, attachments } = formData;
    const {accessToken} = appStorage  
    const newVal = {
            description: description ?? '',
            typeId: typeId ?? 0,
            workId,
            entries: days,
            //this is for if I need a seperate variable for daysHours to stop reRendring
            // entries: days.map(el=> {
            //   el['hours'] = daysHours[el['date']]
            //   return el
            // }),
            // attachments: fileIds ?? []
            attachments: await attachments.map((ele) => {
              return ele.fileId;
            })
    }
    if(edit){
      editLeaveApi(edit, newVal, accessToken).then((res) => {
          setLoading(false)
        if (res.success) {
            console.log("res.success-->", res);
            onSuccess()
          }
      });
    }else{
      addLeaveApi(newVal, accessToken).then((res) => {
          setLoading(false)
        if (res.success) {
          console.log(" add res.success-->", res);
            onSuccess()
          }
      });
    }
  }

  // edited by shahbaz 
  const selectDocument = async () => {
    const response = await DocumentPicker.pickSingle({
      presentationStyle: 'fullScreen',
      type: [types.allFiles],
    });
  handleUplaod("document", response);
  };
  
  const handleUplaod = (name, file) => {
    // console.log("attached file->", file);
    let newObj = {};
    if (name === "document") {
      newObj = file;
    } else if (name === "image") {
      let name = file.path.split('/');
      newObj = { name: name[name.length - 1], type: file.mime, uri: file.path, size: file.size };
    }

    let imageData = new FormData();
    imageData.append('files', newObj);
    
    addAttachment(imageData, appStorage.accessToken).then((res) => {
      if (res.success) {
        console.log("res file->", res.file);
        setDocumentModal(false);
        const {attachments = [] } = formData;
        setFormData(prev => ({
          ...prev,
          attachments: [...attachments ,res.file]
        }));
      }
    })
  };
  
      
  const askFromWhereToPickImage = () => {
    Alert.alert(
      'Select image from',
      '',
      [
        { text: 'Gallery', onPress: () => pickImage('GALLERY') },
        { text: 'Camera', onPress: () => pickImage('CAMERA') },
      ],
      { cancelable: true },
    );
};

const pickImage = async location => {
  // console.log("location-->", location);
 
  if (location === 'GALLERY') {
    ImagePicker.openPicker({
      multiple: false,
      mediaType: 'photo',
      // cropping: true
    })
      .then(image => {
        handleUplaod("image", image);  
        setDocumentModal(false);
        })
        .catch(e => console.log('error->', e.message));
  } else if (location === 'CAMERA') {
    ImagePicker.openCamera({
      multiple: false,
      mediaType: 'photo',
      // cropping: true
    })
      .then(image => {
        handleUplaod("image", image);
        setDocumentModal(false);
      }) 
      .catch(e => console.log('error->', e.message));
  }
};

  const iconRenderer = (file, index) => {
  let url = thumbUrl(file.type);
    return (
      <View
        key={index}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#909090',
          borderStyle: 'dotted',
          backgroundColor: '#fafafa',
          height: 54,
          marginBottom: 5,
        }}
      >
        <TouchableRipple onPress={() => checkPermission(file.uri)}>
          <View
            style={{
              justifyContent: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {/* {console.log("file",file.uri)}     */}
            <Image
              source={url}
              style={{width: 34, height: 34, marginLeft: 5}}
            />
            <Text style={{marginLeft: 5, maxWidth: 150}} numberOfLines={1}>
              {file.name}
            </Text>
          </View>
        </TouchableRipple>
        <View>
          <IconButton
            icon={'delete-outline'}
            disabled={fetching || loading || formData['approvedBy']}
            color={colors.danger}
            size={25}
            onPress={() => deleteFileEvent(file.fileId)}>
            delete
          </IconButton>
        </View>
      </View>
    );
  };

  const deleteFileEvent = (fileId) => {
    // Linking.openURL(url);
    var id = formData.attachments.findIndex(ele => {
      return ele.fileId == fileId;
    })
    formData.attachments.splice(id, 1);
    setFormData(formData => ({
      ...formData,
    }));
  };

  // console.log("form data attachments->",formData.attachments)
  return (
    <Portal>
      <Dialog visible={visible} style={styles.modalView} onDismiss={hideDialog}>
        <View style={styles.modalHeader}>
          <View>
            <Title style={styles.headerText}>{`${
              formData['id'] ? 'Edit' : 'Add'
            } Leave Request`}</Title>
          </View>
          <View>
            <IconButton color="#fff" icon="close" size={20} onPress={onClose} />
          </View>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Dialog.Content style={styles.modalBody}>
            <View style={styles.subHeader}>
              <Subheading style={styles.subheading}>
                {getTotalHours(days)}
                {' Hours'}
              </Subheading>
              <Subheading style={styles.subheading}>
                {getTotalDays(otherData)}
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
                  onSelect={item => {
                    setFieldValue('typeId', item.id);
                    setOtherData(prev => ({...prev, leavetype: item}));
                  }}
                  zIndex={3000}
                  zIndexInverse={1000}
                  schema={{
                    label: 'name',
                    value: 'id',
                  }}
                />
                <MDropDown
                  placeholder="Select Project"
                  label="Projects"
                  value={formData['workId']}
                  data={OPTIONS['projects']}
                  disabled={edit}
                  onSelect={item => setFieldValue('workId', item.value)}
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
                {/* <List.Accordion
                    title={expanded? 'Collapse': 'Expand'}
                    style={{padding: 0}}
                    titleStyle={{padding: 0, paddingVertical: 0, marginVertical: 0, fontSize:12, lineHeight: 14, color: '#000'}}
                    expanded={expanded}
                    onPress={()=> setExpanded(!expanded)}>
                    <ScrollView style={styles.timeFieldsView}>
                      {days.map((el, index)=>(
                  <List.Item 
                    key={el.key}
                    style={{padding: 0}}
                    titleStyle={{width:'100%'}}
                    title={<View style={{width: '100%'}}>
                      <View  style={{flexDirection: 'row' ,alignItems: 'center',  justifyContent: 'space-between' }}>
                        <View>
                          <Text>{el.label}</Text>
                        </View>
                        <View >
                          <TextField
                            value={el.hours}
                            disabled={el.disabled}
                            placeholder="set hours"
                            keyboardType="decimal-pad"
                            onChangeText={text => setFieldValue(el.key, text, false, index)}
                            />
                        </View>
                      </View>
                </View>} />
                ))}
                  </ScrollView>
      </List.Accordion> */}
                <TouchableRipple
                  onPress={() => setExpanded(!expanded)}
                  rippleColor={'rgba(0, 0, 0, .12)'}
                  style={styles.expandTouch}>
                  <ColView style={styles.colViewCenter}>
                    <View>
                      <Text>{expanded ? 'Collapse' : 'Expand'}</Text>
                    </View>
                    <View>
                      <IconButton
                        style={styles.expandIcon}
                        icon={expanded ? 'chevron-up' : 'chevron-down'}
                      />
                    </View>
                  </ColView>
                </TouchableRipple>
                {expanded && (
                  <View style={styles.timeFieldsView}>
                    <ScrollView>
                      {days.map((el, index) => (
                        <ColView key={el.key} style={styles.colViewCenter}>
                          <View>
                            <Text>{el.label}</Text>
                          </View>
                          <View>
                            <TextField
                              style={styles.hoursField}
                              value={el.hours}
                              disabled={el.disabled}
                              keyboardType="decimal-pad"
                              onChangeText={text =>
                                setFieldValue(el.key, text, false, index)
                              }
                            />
                          </View>
                        </ColView>
                      ))}
                    </ScrollView>
                  </View>
                )}
                <TextField
                  value={formData['description']}
                  label="Notes"
                  placeholder="Add Some Reason.."
                  textarea
                  onChangeText={text => setFieldValue('description', text)}
                  returnKeyType="next"
                />
                <View style={{marginTop: 10}}>
                  <ScrollView style={{maxHeight: 114}}>
                    {(formData?.attachments?? []).map((ele, index) => {
                          return ele.type === 'jpg' ? (
                            <View
                              key={index}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#909090',
                                borderStyle: 'dotted',
                                backgroundColor: '#fafafa',
                                height: 54,
                                marginBottom: 5,
                              }}>
                              <TouchableRipple
                                onPress={() => setShowFullSize(ele?.uri)}>
                                <View
                                  style={{
                                    justifyContent: 'flex-start',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingLeft: 5,
                                  }}>
                                  <Image
                                    source={{
                                      uri: ele?.uri,
                                      width: 54,
                                      height: 54,
                                    }}
                                  />
                                  <Text
                                    style={{marginLeft: 5, maxWidth: 150}}
                                    numberOfLines={1}>
                                    {ele?.name}
                                  </Text>
                                </View>
                              </TouchableRipple>
                              <View>
                                <IconButton
                                  icon={'delete-outline'}
                                  disabled={fetching || loading || formData['approvedBy']}
                                  color={colors.danger}
                                  size={25}
                                  onPress={() => deleteFileEvent(ele.fileId)}>
                                  delete
                                </IconButton>
                              </View>
                            </View>
                          ) : (
                            iconRenderer(ele, index)
                          );
                        })}
                  </ScrollView>
                </View>

                <View
                  style={{
                    width: 50,
                    borderRadius: 10,
                    borderColor: '#909090',
                    borderStyle: 'dotted',
                    borderWidth: 1,
                    marginTop: 10,
                    padding: 2,
                  }}>
                  <View
                    style={{
                      with: '100%',
                      borderRadius: 10,
                      borderColor: '#909090',
                      borderStyle: 'dotted',
                      borderWidth: 1,
                      alignItems: 'center',
                    }}>
                    <IconButton
                      icon={'plus-outline'}
                      disabled={fetching || loading || formData['approvedBy']}
                      color={colors.primary}
                      // size={25}
                      onPress={() => setDocumentModal(true)}
                    />
                  </View>
                </View>

                {/* end    */}
              </ScrollView>
            </Dialog.ScrollArea>
          </Dialog.Content>
        </KeyboardAvoidingView>
        <Dialog.Actions style={styles.actionView}>
          <Button
            mode={'contained'}
            loading={loading}
            color={colors['light']}
            disabled={fetching || loading}
            compact
            style={{width: '45%', borderRadius: 2}}
            labelStyle={{color: '#fff'}}
            onPress={hideDialog}>
            Cancel
          </Button>
          <Button
            mode={'contained'}
            loading={loading}
            color={colors['primary']}
            disabled={fetching || loading || formData['approvedBy']}
            compact
            style={{width: '45%', borderRadius: 2}}
            labelStyle={{color: '#fff'}}
            onPress={getFormValues}>
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
      <Dialog visible={documentModal} onDismiss={() => setDocumentModal(false)}>
        <View style={styles.modalHeader}>
          <View>
            <Title style={styles.headerText}>Add Attachment & Notes</Title>
          </View>
          <View>
            <IconButton
              color="#fff"
              icon="close"
              size={20}
              onPress={() => setDocumentModal(false)}
            />
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: 10,
            backgroundColor: '#fafafa',
          }}>
          <View>
            <IconButton
              icon={'file-outline'}
              color={colors.primary}
              size={25}
              onPress={selectDocument}
            />
            <Text
              style={{
                fontSize: 12,
                color: 'rgba(0,0,0,0.54)',
                marginVertical: 2,
                letterSpacing: 0.45,
              }}>
              Document
            </Text>
          </View>
          <View>
            <IconButton
              icon={'image-outline'}
              color={colors.primary}
              size={25}
              onPress={askFromWhereToPickImage}
            />
            <Text
              style={{
                fontSize: 12,
                color: 'rgba(0,0,0,0.54)',
                marginVertical: 2,
                letterSpacing: 0.45,
              }}>
              Image
            </Text>
          </View>
        </View>
      </Dialog>

      {/* {dateTime.open && (
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
      )} */}
      <Modal
        visible={showFullSize}
        style={styles.modalView}
        onDismiss={() => {
          setShowFullSize(false);
        }}>
        <TouchableRipple style={styles.downloadIcon}>
          <IconButton
            icon={'download-outline'}
            color={'white'}
            size={30}
            onPress={() => {
              checkPermission(showFullSize);
            }}
          />
        </TouchableRipple>
        <TouchableRipple style={styles.closeButton}>
          <IconButton
            icon={'close'}
            color={'white'}
            size={25}
            onPress={() => setShowFullSize(false)}
          />
        </TouchableRipple>
        <View
          style={{borderRadius: 10, width: windowWidth, height: windowHeight}}>
          <Image
            source={{
              uri: showFullSize,
              width: windowWidth,
              height: windowHeight,
            }}
          />
        </View>
      </Modal>

      {dateTime.open && (
        <DatePicker
          visible={dateTime.open}
          mode="calendar"
          selected={formatDate(
            otherData[dateTime['key']] ?? new Date(),
            false,
            true,
          )}
          onDismiss={() => setDateTime(prev => ({...prev, open: false}))}
          onDateChange={selectedDate => {
            setFieldValue(dateTime['key'], selectedDate, 'set');
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
      paddingVertical: 10,
      fontWeight: '700'
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
      // borderLeftWidth: 2,
      paddingHorizontal: 5,
      marginHorizontal: 5,
    },
    hoursField: {
      width: 100
    },
    expandIcon: {
      margin: 0
    },
    colViewCenter: {
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    expandTouch:{
      paddingHorizontal: 5,
  },
  downloadIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 1,
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "red",
    width: 30,
    height: 30,
    borderRadius: 50,
    position: 'absolute',
    top: 20,
    right: 10,
    zIndex: 1,
  },
  });


//----------------------Helper function------------//
function getTotalHours (days){
  return formatFloat((days ?? []).reduce((previous, current) => previous + parseFloat(current['hours']??0) , 0))
}

function getTotalDays ({startDate, endDate}){
  let numberOfDays = formatDate(endDate??startDate).diff( formatDate(startDate), 'days', )+1

  return `${numberOfDays} ${numberOfDays >1 ? 'Days' : 'Day'}`
}