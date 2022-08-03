import React, {useState} from 'react';
import { View, ScrollView, StyleSheet} from 'react-native';
import { Card, Text, Badge, Tooltip } from '@rneui/themed'
import { ColView } from '../ConstantComponent';

export default ProjectCards = ({timesheets}) =>{
    const [selected, setSelected] = useState({})
    const [longPressed, setLongPress] = useState(false)
    return <View>
        <ScrollView>
            {timesheets.map((item, index) =>(
                <View 
                    key={index} 
                >
                    <Card 
                        containerStyle={styles.card(selected[index])}
                        onLongPress={()=> {
                            console.log('hold')
                            setSelected(prev => ({[index]: !!prev[index], ...prev}))
                            setLongPress(true)
                        }}
                        onPress={()=>{
                            console.log('press')
                            if (longPressed){
                                setSelected(prev => ({[index]: !!prev[index], ...prev}))
                            }
                        }}
                    >
                        <ColView style={styles.cardView}>
                            <Text>Project Name: </Text>
                            <Text>{item.projectName}</Text>
                        </ColView>
                        {item.type===1 && <ColView style={styles.cardView}>
                            <Text>Milestone Name: </Text>
                            <Text>{item.milestoneName}</Text>
                        </ColView> }
                        <ColView style={styles.cardView} justify={"space-between"}>
                            <ColView>
                                <Text>Total Hours: </Text>
                                <Text>{item.hours}</Text>
                            </ColView>
                            <ColView>
                                <Text>Status: </Text>
                                <Badge value={item.status} status={item.status === 'Submit' ? 'success': 'error'} />
                            </ColView>
                        </ColView>
                        <ColView style={styles.cardView}>
                            <Text>Notes: </Text>
                            <Tooltip
                                popover={<Text>Tooltip info goes here</Text>}
                                width={200}
                            >
                                <Text>{item.notes}</Text>
                            </Tooltip>
                        </ColView>
                    </Card>
                </View>
            ))}
        </ScrollView>
    </View>
}


const styles = StyleSheet.create({
    cardView: {
        paddingVertical:  5,
    },
    card: (select) =>({
        borderRadius: 30,
        backgroundColor: select && 'green'
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
    