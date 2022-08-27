import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Pressable, StyleSheet, View } from 'react-native'
import { Caption, FAB, IconButton, Title } from 'react-native-paper'
import { projects_timesheet } from '../../assets/constant'
import DateTimePicker from '@react-native-community/datetimepicker';
import ProjectCards from '../components/Timesheet/ProjectCards'
import { AppContext } from '../context/AppContext'
import { getTimesheetApi } from '../services/timesheet-api'

const MonthlyTimesheet =({navigation}) =>{
    const { appStorage } = useContext(AppContext)
    const [dateTime, setDateTime] = useState(false)
    const [sDate, setDate] = useState(moment())
    const [selected, setSelected] = useState({})
    const [longPressed, setLongPress] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [timesheets, setTimesheets] = useState({})

    // useEffect(() => {
    //     getData()
    // }, [sDate])

    const getData = async() =>{
        setFetching(true)
        let keys = {startDate: '01-11-2021'?? moment(sDate).startOf('month').format('DD-MM-YYYY'),
            endDate: '30-11-2021'??moment(sDate).endOf('month').format('DD-MM-YYYY'),
            userId: 12??appStorage['id']
        }
        try {
            let {success, data} = await getTimesheetApi(keys, appStorage['accessToken'])
            if(success){
                setTimesheets(data)
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

    const fabAction = () =>{
        if (longPressed) {
          let dateIndex = null;
          let copyTimesheet = timesheet.map((el, index) => {
            if (el.title === items.title) {
              dateIndex = index;
              el.data = el.data.filter(fel => {
                if (!Object.keys(selected).includes(`${fel.id}`)) {
                  return fel;
                }
              });
            }
            return el;
          });
          setTimesheet(copyTimesheet);
          setItems(copyTimesheet[dateIndex]);
          setLongPress(false);
          setSelected({});
        } else {
            navigation.navigate('Timesheet-Details', {sDate: moment(sDate).toString() })
        }
    }


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
                        <Title style={{lineHeight: 20}}>{'120.66'}</Title>
                    </View>
                </View>
            </View>
            <View style={styles.pageView}>
                <FlatList
                    data={timesheets['milestones']}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item.milestoneId}
                    extraData={selected}
                    onRefresh={getData}
                    refreshing={fetching}
                />
            </View>
            <FAB
                style={styles.fab(longPressed)}
                color="white"
                placement="right"
                icon={longPressed ? 'delete' : 'plus'}
                size="large"
                onPress={fabAction}
            />
            {dateTime && (
                <DateTimePicker
                mode={'date'}
                value={moment(sDate).toDate()}
                onChange={(event, dateValue) => {
                    setDateTime(false)
                    if (event?.type === 'set' && dateValue){
                        dateValue && setDate(moment(dateValue));
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
})