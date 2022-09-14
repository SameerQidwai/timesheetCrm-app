import React, { useContext, useEffect, useState } from 'react'
import { Alert, FlatList, Image, StatusBar, StyleSheet, View } from 'react-native'
import { Appbar, Button, Caption, Dialog, IconButton, Modal, Text, TextInput, Title, TouchableRipple } from 'react-native-paper'
import ProjectCards from '../../components/Cards/ProjectCards'
import { AppContext } from '../../context/AppContext'
import { getTimesheetApi, reviewTimeSheet } from '../../services/timesheet-api'
import { formatDate, formatFloat, thumbUrl } from '../../services/constant';
import { ColView } from '../../components/Common/ConstantComponent'
import DatePicker from '../../components/Common/DatePicker'
import NoRecords from '../../components/Common/NoRecords'
import Confirm from '../../components/Common/Confirm'
import { colors } from '../../components/Common/theme'
import { TextField } from '../../components/Common/InputFields'
import TimesheetAttachment from '../../components/Modals/TimesheetAttachment'
// const imagePick = ImagePicker;

const MonthlyTimesheet =({navigation}) =>{
    const { appStorage, setAppStorage } = useContext(AppContext)
    const [dateTime, setDateTime] = useState(false)
    const [sDate, setDate] = useState(formatDate(new Date()))
    const [selected, setSelected] = useState({})
    const [longPressed, setLongPress] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [timesheets, setTimesheets] = useState({})
    const [disableAction, setDisableAction] = useState(true)
    const [confirming, setConfirming] = useState(false)
    //edited by shahbaz
  const [fileModelEvent, setFileModelEvent] = useState(false);
  
  // end 
    useEffect(() => {
        getData()
    }, [sDate])

    const getData = async() =>{
        setFetching(true)
        let keys = {startDate: formatDate(sDate).startOf('month').format('DD-MM-YYYY'),
            endDate: formatDate(sDate).endOf('month').format('DD-MM-YYYY'),
            userId: appStorage['id']
        }
        try {
            let {success, data, setToken} = await getTimesheetApi(keys, appStorage['accessToken'])
            if(success){
                const { grandtotal, newData } = restructure(data)
                setAppStorage(prev=> ({...prev, accessToken: setToken}))
                setTimesheets({data: newData, total: grandtotal})
                // setFetching(false)
            }else{
                setTimesheets({data: [], total: 0})
                // setFetching(false)
          }
          setFetching(false);
          setFileModelEvent(false);
        }catch (e){
            console.log(e)
        }
    
    }

    const onPressItem = (key, item)=>{
      let newSelected = selected
      let selectedItems = Object.keys(selected).length
      if (longPressed){
          if (newSelected[key]){
              delete newSelected[key]
              if (selectedItems === 1){
                  setLongPress(false)
                  setDisableAction(true)
              }
          }else{
            if (['SV', 'RJ'].includes(item.status)){
              newSelected[key] = true
              setDisableAction(false)
            }
          }
        setSelected({ ...newSelected })
        
      } else {
        setFileModelEvent(item);
      }

      // if (!long && selectedItems === 0) {
      //     // setOpenModal(true);
      // }
      
      // if (long && selectedItems === 0){
      //     setSelected({[key]: true})
      //     setLongPress(true)
      // }
  }  
  
  // edited by shahbaz

  
    // end
    const onSelectAll = () =>{
        if (timesheets?.['data']?.['milestones'].length > 0){
        // if (projects_timesheet.length > 0){
            let select= {}
            let disable = true
            timesheets?.['data']?.['milestones'].forEach(el=>{
                // projects_timesheet.forEach(el=>{
                if(['SV', 'RJ'].includes(el.status)){
                    select[el.milestoneEntryId] = true
                    disable = false
                }
            })
            setSelected(select)
            setDisableAction(disable)
        }
    }

    const onUnselectAll = () =>{
        setLongPress(false)
        setSelected({})
        setDisableAction(true)
    }

    const renderItem = ({item, index}) => {
        return (
            <ProjectCards 
              timesheet={item} 
              selected={selected[item.milestoneEntryId]}
            //   onLongPress={() => onPressItem(index, true)}
              onPress={() => onPressItem(item.milestoneEntryId, item)}
            />
        );
    };

    const actionTimeSheet = (stage) => {
        if (stage === 'Add'){
            navigation.navigate('Timesheet-Details', {sDate: formatDate(sDate).format('YYYY-MM-DD')})
        }else{
            const { id: userId, accessToken}= appStorage
            const  keys  = Object.keys(selected).map(el => parseInt(el))
            const query= {
                userId, startDate: 
                formatDate(sDate).startOf('month').format('DD-MM-YYYY'), 
                endDate: formatDate(sDate).endOf('month').format('DD-MM-YYYY') 
            }
            const data = {milestoneEntries: keys}
            reviewTimeSheet(query, stage, data, accessToken).then(res=>{
                if(res.success){
                    getData()
                    setLongPress(false);
                    setSelected({});
                    setConfirming(false)
                    setAppStorage(prev=> ({...prev, accessToken: res.setToken}))
                }
            })
        }
    };

  const onSuccess = () => {
    getData();
  }
  
    return (
      <View style={styles.pageView}>
        <StatusBar  backgroundColor={colors['primary']} />
        <Appbar.Header style={styles.header}>
          <Appbar.Content
            title={
              <TouchableRipple onPress={() => setDateTime(!dateTime)}>
                <Title
                  style={{
                    textTransform: 'uppercase',
                    color: '#fff',
                  }}>
                  {sDate.format('MMM YYYY')}
                  <IconButton
                    icon="chevron-down"
                    color="#fff"
                    size={24}
                    style={{width: 28, height: 20}}
                  />
                </Title>
              </TouchableRipple>
            }
          />
          <Appbar.Content
            title={
              <View style={{justifyContent: 'center'}}>
                <View>
                  <Caption style={{color: '#fff'}}>Total Hours</Caption>
                </View>
                <View>
                  <Title
                    style={{
                      lineHeight: 22,
                      textAlign: 'center',
                      color: '#fff',
                    }}>
                    {formatFloat(timesheets?.['total'])}
                  </Title>
                </View>
              </View>
            }
            titleStyle={{marginLeft: 'auto'}}
          />
          {longPressed && <View style={[styles.overlay]} />}
        </Appbar.Header>
        {/* {projects_timesheet?.length >0 ?  */}
        {timesheets?.['data']?.['milestones']?.length > 0 ? (
          <View style={styles.pageView}>
            {
              <View
                style={{
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  marginHorizontal: 10,
                  marginTop: 7,
                }}>
                {!longPressed ? (
                  <Button
                    mode="outlined"
                    compact
                    uppercase={false}
                    color={colors['primary']}
                    labelStyle={{
                      marginVertical: 2,
                      marginHorizontal: 5,
                      fontWeight: 'normal',
                    }}
                    onPress={() => setLongPress(true)}>
                    Select
                  </Button>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}>
                    <Button
                      mode="outlined"
                      compact
                      uppercase={false}
                      color={colors['primary']}
                      labelStyle={{
                        marginVertical: 2,
                        marginHorizontal: 5,
                        fontWeight: 'normal',
                      }}
                      onPress={onSelectAll}>
                      Select All
                    </Button>
                    <Button
                      mode="outlined"
                      compact
                      uppercase={false}
                      color={colors['primary']}
                      labelStyle={{
                        marginVertical: 2,
                        marginHorizontal: 5,
                        fontWeight: 'normal',
                      }}
                      onPress={onUnselectAll}>
                      Cancel
                    </Button>
                  </View>
                )}
              </View>
            }
            <FlatList
              data={timesheets?.['data']?.['milestones'] ?? []}
              // data={projects_timesheet?? []}
              renderItem={renderItem}
              keyExtractor={(item, index) => index}
              extraData={selected}
              onRefresh={getData}
              refreshing={fetching}
              style={{paddingBottom: 10}}
            />
          </View>
        ) : (
          <NoRecords waiting={fetching} />
        )}
        {longPressed ? (
          <ColView justify="space-between">
            <Button
              mode="contained"
              uppercase={false}
              raised
              color={colors['success']}
              style={{
                marginLeft: '5%',
                marginBottom: 15,
                marginVertical: 8,
                width: '42%',
                borderRadius: 2,
              }}
              size="large"
              disabled={fetching || disableAction}
              labelStyle={{color: '#fff'}}
              onPress={() => setConfirming('Submit')}>
              Submit
            </Button>
            <Button
              mode="contained"
              uppercase={false}
              raised
              style={{
                marginRight: '5%',
                marginBottom: 15,
                marginVertical: 8,
                width: '42%',
                borderRadius: 2,
              }}
              color={colors['danger']}
              // color="red"
              labelStyle={{color: '#fff'}}
              disabled={fetching || disableAction}
              size="large"
              onPress={() => setConfirming('Delete')}>
              Delete
            </Button>
          </ColView>
        ) : (
          <Button
            mode="contained"
            uppercase={false}
            raised
            color={colors['primary']}
            style={styles.bottomButton}
            size="large"
            disabled={fetching}
            onPress={() => actionTimeSheet('Add')}>
              View Timesheet
          </Button>
        )}
        {dateTime && (
          <DatePicker
            visible={dateTime}
            selected={formatDate(sDate, false, true)}
            mode="monthYear"
            onDismiss={() => setDateTime(false)}
            onMonthChage={selectedDate => {
              setDate(formatDate(selectedDate, 'YYYY MM'));
              setDateTime(false);
            }}
          />
        )}
        {confirming && (
          <Confirm
            visible={confirming}
            onDismiss={() => setConfirming(false)}
            action={confirming}
            entity={'Timesheet'}
            onConfirm={() => actionTimeSheet(confirming)}
          />
        )}
        
        
        {fileModelEvent && <TimesheetAttachment fileModelEvent={fileModelEvent} setFileModelEvent={setFileModelEvent} onSuccess={onSuccess} />}
        
        </View>
    );
}

export default MonthlyTimesheet

const styles =  StyleSheet.create({
    pageView: {
        flex: 1, 
        backgroundColor: colors['display']
    },
    header:{
        flexDirection: 'row',
        backgroundColor: colors['primary'],
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    fab: pressed => ({
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: pressed ? 'red' : '#2e44fc',
    }),
    fabsubmit: {
        position: 'absolute',
        margin: 16,
        right: 70,
        bottom: 0,
        backgroundColor: '#4caf50',
    },
    bottomButton: {
        marginHorizontal: 15, 
        marginVertical: 8,
        borderRadius: 2,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'black',
        opacity: 0.5
  },
    
})

//------------helping Number ---------//
function restructure (data){
    let grandtotal  = 0
    let timeEntries = []
    data['milestones'].forEach((el, p_index)=>{
      //removing Leave Request
      if (!el.leaveRequest){
        timeEntries.push(el)
        grandtotal += el['totalHours']
      }
    })
    let newData = {
      ...data,
      milestones: timeEntries
    }
    return { grandtotal, newData }
}