import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Pressable, StyleSheet, View } from 'react-native'
import { Caption, FAB, IconButton, Portal, Title } from 'react-native-paper'
// import { projects_timesheet, timesheet_data } from '../../assets/constant'
import DateTimePicker from '@react-native-community/datetimepicker';
import ProjectCards from '../components/Timesheet/ProjectCards'
import { AppContext } from '../context/AppContext'
import { getTimesheetApi, reviewTimeSheet } from '../services/timesheet-api'
import { formatDate, formatFloat } from '../services/constant';

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
        try {
            let {success, data, setToken} = await getTimesheetApi(keys, appStorage['accessToken'])
            if(success){
                const { grandtotal } = calculate_total(data)
                setTimesheets({data: data, total: grandtotal})
                setAppStorage(prev=> ({...prev, accessToken: setToken}))
                setFetching(false)
            }else{
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
              onLongPress={() => onPressItem(index, true)}
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
            <View style={styles.containerView}>
                <View>
                    <Pressable 
                        android_ripple={{color: '#f47749', borderless: true}}
                        onPressOut={() => setDateTime(true)}>
                        <Title>
                            {sDate.format('MMM YYYY')}
                        <IconButton
                            icon="chevron-down"
                            color="black"
                            size={24}
                            style={{ width: 28, height: 20, }}
                        />
                        </Title>
                    </Pressable>
                </View>
                <View>
                    <View>
                        <Caption>Total Hours</Caption>
                    </View>
                    <View>
                        <Title style={{lineHeight: 20}}>{formatFloat(timesheets?.['total'])}</Title>
                    </View>
                </View>
            </View>
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
            <FAB
                style={styles.fab(longPressed)}
                color="white"
                icon={longPressed ? 'delete' : 'plus'}
                disabled={fetching}
                size="large"
                animated
                onPress={()=>actionTimeSheet(longPressed? 'Delete': 'Add')}
            />
            {longPressed && <FAB
                style={[styles.fabsubmit]}
                color="white"
                icon={'check-decagram'}
                disabled={fetching}
                size="large"
                animated
                onPress={()=> actionTimeSheet('Submit') }
            />}
            {dateTime && (
                <DateTimePicker
                mode={'date'}
                value={formatDate(sDate).toDate()}
                onChange={(event, dateValue) => {
                    setDateTime(false)
                    if (event?.type === 'set' && dateValue){
                        dateValue && setDate(formatDate(dateValue));
                    }
                }}
                />
            )}
        </View>
    )
}

export default MonthlyTimesheet

const styles =  StyleSheet.create({
    pageView: {
        flex: 1, 
        backgroundColor: 'white'
    },
    containerView:{
        flexDirection: 'row',
        backgroundColor: '#f8a587',
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