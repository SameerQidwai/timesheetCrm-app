  
import React, {useEffect} from 'react';
import { View , StyleSheet, Pressable } from 'react-native';
import {Card, Text, Badge, Title, Subheading, Paragraph, Caption, Headline } from 'react-native-paper';
import { status_color } from '../../services/constant';
import { ColView } from '../ConstantComponent';

export default TimeCard2 = ({timeEntry, selected, onLongPress, onPress}) => {
  const statusColor = status_color[timeEntry.status]?.['color'] ?? '#476ba6'
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
          <View style={styles.detailView}>
              <Text style={styles.headline}>{timeEntry.project}</Text>
              <Subheading style={styles.subheading}>{timeEntry.projectType === 1 ? timeEntry.milestone: ''}</Subheading>
              <Paragraph >{timeEntry.startTime} To {timeEntry.endTime} With {timeEntry.breakHours} Hour Break</Paragraph>
              <Caption >{timeEntry.notes}</Caption>
          </View>
          <View style={[styles.hourView, status_color[timeEntry.status]]
          }
          >
              <Title style={{fontWeight: '900', color: statusColor,}}>{timeEntry.actualHours}</Title>
              <Subheading style={{color: statusColor}}>hours</Subheading>
          </View>
        </ColView>
      </Card.Content>
      </Pressable>
    </Card>
  );
};


const styles = StyleSheet.create({
  cardView: {
    paddingVertical: 5,
  },
  card: selectColor => ({
    borderRadius: 10,
    margin: 10,
    backgroundColor: selectColor ? '#727ef6b3' : 'white',
  }),
  detailView: {width: '75%', paddingTop: 10},
  subheading: {
    color: '#747474',
    lineHeight: 18,
    marginVertical: 0,
    marginBottom: 5,
  },
  headline: {
    lineHeight: 22, 
    marginVertical: 0
  },
  hourView: {
    width: '25%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor :'#edf5ff', 
    borderColor: '#8fb2eb', 
    borderWidth: 1, 
    color: '#476ba6'
  }
});

