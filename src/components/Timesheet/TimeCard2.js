  
import React, {useEffect} from 'react';
import { View , StyleSheet, Pressable } from 'react-native';
import {Card, Text, Badge, Title, Subheading, Paragraph, Caption, Headline } from 'react-native-paper';
import { ColView } from '../ConstantComponent';

export default TimeCard2 = ({timeEntry, selected, onLongPress, onPress}) => {
  useEffect(() => {
      // console.log(selected)
  }, [{...selected}]);

  return (
    <Card 
        style={styles.card(selected)} 
        elevation={10} 
        mode="elevated"
    >
      <Pressable
        android_ripple={{color: '#747474', borderless: true}}
        onLongPress={onLongPress}
        onPress={onPress}
      >
        {/* style={{paddingVertical: 10}} */}
      <Card.Content >
        <ColView justify={'space-between'} >
          <View style={{width: '75%', paddingTop: 10}}>
              <Headline style={{lineHeight: 22, marginVertical: 0}}>{timeEntry.projectName}</Headline>
              <Subheading style={{color: '#747474', lineHeight: 18, marginVertical: 0, marginBottom: 5}}>{timeEntry.type === 1 ? timeEntry.milestoneName: ''}</Subheading>
              <Paragraph >{timeEntry.startTime} To {timeEntry.endTime} With {timeEntry.duration} Hour Break</Paragraph>
              <Caption >{timeEntry.notes}</Caption>
          </View>
          <View style={{
              width: '25%',
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'grey'
            }}
          >
              <Title style={{fontWeight: '900', color: '#fff',}}>{timeEntry.duration}</Title>
              <Subheading style={{color: '#fff'}}>hours</Subheading>
          </View>
        </ColView>
      </Card.Content>
      </Pressable>
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
        backgroundColor: selectColor ? "#727ef6b3" : "white"
    })
})

