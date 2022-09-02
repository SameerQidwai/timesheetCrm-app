  
import React, {useEffect, useState} from 'react';
import { StyleSheet } from 'react-native';
import {Card, Text, Badge, Divider } from 'react-native-paper';
import { ColView } from '../ConstantComponent';

export default TimeCard = ({timeEntry, selected}) =>{
    

    useEffect(() => {
      console.log({selected})
    }, [])
    return (
        <Card 
            style={styles.card(selected)} 
            elevation={10} mode="elevated"
        >
            <Card.Content>
                <ColView  style={styles.cardView}>
                    <Text>Project Name: </Text>
                    <Text>{timeEntry.projectName}</Text>
                </ColView>
                {timeEntry.type===1 && <ColView  style={styles.cardView}>
                    <Text>Milestone Name: </Text>
                    <Text>{timeEntry.milestoneName}</Text>
                </ColView> }
                <ColView  style={styles.cardView} justify={"space-between"}>
                    <ColView flex={2}>
                        <Text>Start Time: </Text>
                        <Text>{timeEntry.startTime}</Text>
                    </ColView>
                    <ColView flex={2}>
                        <Text>End Time: </Text>
                        <Text>{timeEntry.endTime}</Text>
                    </ColView>
                </ColView>
                <ColView  style={styles.cardView}>
                    <Text>Notes: </Text>
                    {/* <Tooltip
                        popover={<Text>Tooltip info goes here</Text>}
                        width={200}
                    > */}
                        <Text>{timeEntry.notes}</Text>
                    {/* </Tooltip> */}
                </ColView>
                <Divider  />
                <ColView justify="center">
                    <Text>Total Hours:{timeEntry.duration}</Text>
                </ColView>
            </Card.Content>
        </Card>
    )
}


const styles = StyleSheet.create({
    cardView: {
        paddingVertical:  5,
    },
    style :{margin: 10,  borderRadius: 10 },
    card: (selectColor)=> ({
        borderRadius: 2,  
        margin: 10,
        backgroundColor: selectColor ? "#727ef6b3" : "white"
    })
})

