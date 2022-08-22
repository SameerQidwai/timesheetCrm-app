  
import React, {useEffect, useState} from 'react';
import { View , StyleSheet, TouchableOpacity } from 'react-native';
import {Card, Text, Badge } from 'react-native-paper';
import { ColView } from '../ConstantComponent';

export default TimeCard2 = ({timeEntry, selected}) => {
  useEffect(() => {
    //   console.log(timeEntry)
  }, []);

  return (
    <Card 
        style={styles.card(selected)} 
        elevation={10} mode="elevated"
    >
      <Card.Content>
        <ColView justify={'space-between'}>
          <View>
            <ColView style={styles.cardView}>
              <Text>Project Name: </Text>
              <Text>{timeEntry.projectName}</Text>
            </ColView>
            {timeEntry.type === 1 && (
              <ColView style={styles.cardView}>
                <Text>Milestone Name: </Text>
                <Text>{timeEntry.milestoneName}</Text>
              </ColView>
            )}
            {/* <ColView  style={styles.cardView} justify={"space-between"}> */}
            <ColView flex={2}>
              <Text>Start Time: </Text>
              <Text>{timeEntry.startTime}</Text>
            </ColView>
            <ColView flex={2}>
              <Text>End Time: </Text>
              <Text>{timeEntry.endTime}</Text>
            </ColView>
            {/* </ColView> */}
            <ColView style={styles.cardView}>
              <Text>Notes: </Text>
              {/* <Tooltip
                            popover={<Text>Tooltip info goes here</Text>}
                            width={200}
                        > */}
              <Text>{timeEntry.notes}</Text>
              {/* </Tooltip> */}
            </ColView>
          </View>
          <View>
            {/* <Divider orientation="vertical" /> */}
            <ColView
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text h2>{timeEntry.duration}r</Text>
            </ColView>
          </View>
        </ColView>
      </Card.Content>
    </Card>
  );
};


const styles = StyleSheet.create({
    cardView: {
        paddingVertical:  5,
    },
    card: (selectColor)=> ({
        borderRadius: 10,  
        margin:10,
        backgroundColor: selectColor ? "#c3f7ff9e" : "white"
    })
})
