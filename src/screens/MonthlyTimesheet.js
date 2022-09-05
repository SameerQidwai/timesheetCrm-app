import React, { useContext, useEffect, useState } from 'react'
import { FlatList,  Dimensions, StyleSheet, View } from 'react-native'
import { Appbar, Button, Caption, Card, Dialog, FAB, IconButton, Modal, Portal, Surface, Title, TouchableRipple } from 'react-native-paper'
import ProjectCards from '../components/Timesheet/ProjectCards'
import { AppContext } from '../context/AppContext'
import { getTimesheetApi, reviewTimeSheet } from '../services/timesheet-api'
import { formatDate, formatFloat } from '../services/constant';
import { ColView } from '../components/ConstantComponent'
import DatePicker from '../components/DatePicker'
const deviceHeight = Dimensions.get('window').height

const MonthlyTimesheet =({navigation}) =>{
    const { appStorage, setAppStorage } = useContext(AppContext)
    const [dateTime, setDateTime] = useState(false)
    const [sDate, setDate] = useState(formatDate(new Date()))
    const [selected, setSelected] = useState({})
    const [longPressed, setLongPress] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [timesheets, setTimesheets] = useState({})

    useEffect(() => {
        getData()
    }, [sDate])

    const getData = async() =>{
        setFetching(true)
        let keys = {startDate: formatDate(sDate).startOf('month').format('DD-MM-YYYY'),
            endDate: formatDate(sDate).endOf('month').format('DD-MM-YYYY'),
            userId: appStorage['id']
        }
        console.log(keys)
        try {
            let {success, data, setToken} = await getTimesheetApi(keys, appStorage['accessToken'])
            if(success){
                const { grandtotal } = calculate_total(data)
                setAppStorage(prev=> ({...prev, accessToken: setToken}))
                setTimesheets({data: data, total: grandtotal})
                setFetching(false)
                console.log('if condition')
            }else{
                console.log('else condition')
                setTimesheets({data: [], total: 0})
                setFetching(false)
            }
        }catch (e){
            console.log(e)
        }
    
    }

    const onPressItem = (key, long)=>{
        let newSelected = selected
        let selectedItems = Object.keys(selected).length
        if (longPressed && selectedItems > 0){
            if (newSelected[key]){
                delete newSelected[key]
                if (selectedItems === 1){
                    setLongPress(false)
                }
            }else{
                newSelected[key] = true
            }
            setSelected({...newSelected})
        }
        if (!long && selectedItems === 0) {
            // setOpenModal(true);
        }
        
        if (long && selectedItems === 0){
            setSelected({[key]: true})
            setLongPress(true)
        }
    }

    const renderItem = ({item, index}) => {
        return (
            <ProjectCards 
              timesheet={item} 
              selected={selected[index]} 
            //   onLongPress={() => onPressItem(index, true)}
              onPress={() => onPressItem(index)}
            />
        );
    };

    const actionTimeSheet = (stage) => {
        if (stage === 'Add'){
            navigation.navigate('Timesheet-Details', {sDate: formatDate(sDate).format('YYYY-MM-DD')})
        }else{
            const { id: userId, accessToken}= appStorage
            const  keys  = Object.keys(selected)
            const query= {
                userId, startDate: 
                formatDate(sDate).startOf('month').format('DD-MM-YYYY'), 
                endDate: formatDate(sDate).endOf('month').format('DD-MM-YYYY') 
            }
            const data = {milestoneEntries: keys}
            reviewTimeSheet(query, 'Submit', data, accessToken).then(res=>{
                getData()
                setAppStorage(prev=> ({...prev, accessToken: setToken}))
                setLongPress(false);
                setSelected({});
            })
        }
    };

    return(
        <View style={styles.pageView}>
            <Appbar.Header style={styles.containerView}>
                <Appbar.Content 
                    title={
                     <TouchableRipple
                            onPress={() => setDateTime(!dateTime)}
                            rippleColor="rgba(0, 0, 0, .32)"
                        >
                        <Title
                            style={{
                                textTransform: 'uppercase',
                                color: '#fff'
                            }}
                        >
                            {sDate.format('MMM YYYY')}
                        <IconButton
                            icon="chevron-down"
                            color="#fff"
                            size={24}
                            style={{ width: 28, height: 20, }}
                        />
                        </Title>
                    </TouchableRipple>}  
                />
                <Appbar.Content title={
                        <View style={{justifyContent: 'center'}}>
                        <View>
                            <Caption style={{color: '#fff'}}>Total Hours</Caption>
                        </View>
                        <View>
                            <Title style={{lineHeight: 22, textAlign: 'center', color: '#fff'}}>{formatFloat(timesheets?.['total'])}</Title>
                        </View>
                    </View>}
                    titleStyle={{marginLeft: 'auto'}} 
                />
            </Appbar.Header>
            <View style={styles.pageView}>
                <FlatList
                    data={timesheets?.['data']?.['milestones']?? []}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index}
                    extraData={selected}
                    onRefresh={getData}
                    refreshing={fetching}
                />
            </View>
            {longPressed ? <ColView  justify='space-between'>
                    <Button
                        mode="contained"
                        uppercase={false}
                        raised 
                        color='green'
                        style={{
                            marginLeft: '5%',
                            marginBottom:15,
                            width: '42%',
                            borderRadius: 2
                        }}
                        size="large"
                        disabled={fetching}
                        labelStyle={{color: '#fff'}}
                        onPress={()=>actionTimeSheet('Delete')}
                    >
                        Submit
                    </Button>
                    <Button
                        mode="contained"
                        uppercase={false}
                        raised 
                        style={{
                            marginRight: '5%',
                            marginBottom:15,
                            width: '42%',
                            borderRadius: 2
                        }}
                        color="#ff4d4f"
                        // color="red"
                        labelStyle={{color: '#fff'}}
                        disabled={fetching}
                        size="large"
                        onPress={()=> actionTimeSheet('Submit') }
                    >
                        Delete
                    </Button>
                </ColView> 
            :
                <Button 
                
                    mode="contained"
                    uppercase={false}
                    raised 
                    color='#1890ff'
                    style={{
                        marginHorizontal: 15, 
                        marginBottom:15,
                        borderRadius: 2,
                    }}
                    size="large"
                    disabled={fetching}
                    onPress={()=>actionTimeSheet('Add')}
                >
                    Add Timesheet
                </Button>
            }
            {dateTime && 
                <DatePicker
                    visible={dateTime}
                    selected={formatDate(sDate,false, true)}
                    mode="monthYear"
                    onDismiss={()=>setDateTime(false)}
                    onMonthChage={selectedDate => {
                        setDate(formatDate(selectedDate, 'YYYY MM'))
                        setDateTime(false)
                    }}
                />
            }
        </View>
    )
}

export default MonthlyTimesheet

const styles =  StyleSheet.create({
    pageView: {
        flex: 1, 
        backgroundColor: '#f6f4f1'
    },
    containerView:{
        flexDirection: 'row',
        backgroundColor: '#1890ff',
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
        backgroundColor: 'green',
    }
})

//------------helping Number ---------//
function calculate_total (data){
    let grandtotal  = 0
    data['milestones'].forEach((el, p_index)=>{
        grandtotal += el['totalHours']
    })
    return { grandtotal }
}