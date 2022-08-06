import React, {useEffect, useState} from 'react';
import { View , StyleSheet, TouchableOpacity , FlatList} from 'react-native';
import { Card, Text, Badge, Tooltip } from '@rneui/themed'
import { ColView } from '../ConstantComponent';

const projects = [
    {
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Rejected',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Rejected',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Submit',
      notes:  'As a cross platform UI Toolkit,'
    },
    {
      projectName: 'One LM',
      type:  1,
      milestoneName: 'Milestone 1',
      hours: 27,
      status: 'Rejected',
      notes:  'As a cross platform UI Toolkit,'
    },
]
  

export default ProjectCards = ({timesheets}) =>{
    const [selected, setSelected] = useState({})
    const [longPressed, setLongPress] = useState(false)

    useEffect(() => {
      console.log(timesheets)
    
    }, [])
    

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
        if (long && selectedItems === 0){
            setSelected({[key]: true})
            setLongPress(true)
        }
    }

    const renderItem = ({item}) =>{
        return (
            <TouchableOpacity 
                onLongPress={()=>onPressItem(item.id, true)}
                onPress={()=>onPressItem(item.id)}
            >
                <Card 
                    containerStyle={styles.card(selected[item.id])}
                >
                    <ColView  style={styles.cardView}>
                        <Text>Project Name: </Text>
                        <Text>{item.projectName}</Text>
                    </ColView>
                    {item.type===1 && <ColView  style={styles.cardView}>
                        <Text>Milestone Name: </Text>
                        <Text>{item.milestoneName}</Text>
                    </ColView> }
                    <ColView  style={styles.cardView} justify={"space-between"}>
                        <ColView flex={2}>
                            <Text>Total Hours: </Text>
                            <Text>{item.hours}</Text>
                        </ColView>
                        <ColView flex={2}>
                            <Text>Status: </Text>
                            <Badge value={item.status} status={item.status === 'Submit' ? 'success': 'error'} />
                        </ColView>
                    </ColView>
                    <ColView  style={styles.cardView}>
                        <Text>Notes: </Text>
                        <Tooltip
                            popover={<Text>Tooltip info goes here</Text>}
                            width={200}
                        >
                            <Text>{item.notes}</Text>
                        </Tooltip>
                    </ColView>
                </Card>
            </TouchableOpacity>
        )
    }

    return <View  >
        <FlatList
            data={timesheets}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            extraData={selected}
        />
    </View >
}


const styles = StyleSheet.create({
    cardView: {
        paddingVertical:  5,
    },
    card: (selectColor)=> ({
        borderRadius: 30,  
        backgroundColor: selectColor ? "#6e3b6e" : "white"
    })
})


    // export default ProjectCards = ({timesheets}) =>{
    //     const keyExtractor = (item, index) => index.toString()
    //     const renderItem = ({ item }) => (
    //         <ListItem 
    //         style={{marginLeft: 0, paddingLeft: 0}}
    //         >
    //            {/* <View> */}
    //                 <Card containerStyle={styles.card}>
    //                     <ColView style={styles.cardView}>
    //                         <Text>Project Name: </Text>
    //                         <Text>{item.projectName}</Text>
    //                     </ColView>
    //                     {item.type===1 && <ColView style={styles.cardView}>
    //                         <Text>Milestone Name: </Text>
    //                         <Text>{item.milestoneName}</Text>
    //                     </ColView> }
    //                     <ColView style={styles.cardView} justify={"space-between"}>
    //                         <ColView>
    //                             <Text>Total Hours: </Text>
    //                             <Text>{item.hours}</Text>
    //                         </ColView>
    //                         <ColView>
    //                             <Text>Status: </Text>
    //                             <Badge value={item.status} status={item.status === 'Submit' ? 'success': 'error'} />
    //                         </ColView>
    //                     </ColView>
    //                     <ColView style={styles.cardView}>
    //                         <Text>Notes: </Text>
    //                         <Tooltip
    //                             popover={<Text>Tooltip info goes here</Text>}
    //                             width={200}
    //                         >
    //                             <Text>{item.notes}</Text>
    //                         </Tooltip>
    //                     </ColView>
    //                 </Card>
    //            {/* </View> */}
    //         </ListItem>
    //         )
    //     return <FlatList
    //     style={{marginLeft: 0, paddingLeft: 0}}
    //     keyExtractor={keyExtractor}
    //     data={timesheets}
    //     renderItem={renderItem}
    //   />
    // }
    