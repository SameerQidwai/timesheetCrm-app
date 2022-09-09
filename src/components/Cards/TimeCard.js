import React, {useEffect} from 'react';
import moment from 'moment';
import { View , StyleSheet } from 'react-native';
import {Card, Text, Title, Subheading, Caption, TouchableRipple } from 'react-native-paper';
import { formatFloat, status_color } from '../../services/constant';
import { ColView } from '../Common/ConstantComponent';

const TimeCard = ({timeEntry, selected, onLongPress, onPress}) => {
  const statusColor = status_color[timeEntry.status]?.['color'] ?? '#476ba6'
  useEffect(() => {
      // console.log(selected)
  }, [{...selected}]);

  const getBreakTime = (hours) =>{
    let breakHours = moment.duration(hours,'hours')
    return breakHours ? moment(moment().hours(breakHours.hours()).minutes(breakHours.minutes())).format("HH:mm"): '00:00'
  }

  return (
    <Card style={styles.card} elevation={5} mode="elevated">
      <TouchableRipple
        // onLongPress={!timeEntry.leaveRequest && onLongPress}
        onPress={!timeEntry.leaveRequest && onPress}
        rippleColor="rgba(0, 0, 0, .32)">
        <Card.Content style={{paddingRight: 0}}>
          {!timeEntry.leaveRequest ? (
            <ColView justify={'space-between'}>
              <View style={styles.detailView}>
                <Text style={styles.headline} numberOfLines={1}>{timeEntry.project}</Text>
                <Caption style={styles.subheading}>
                  {timeEntry.projectType === 1
                    ? `${timeEntry.milestone}`
                    : '\n'}
                </Caption>
                <Text>
                  {moment(timeEntry['startTime'], ['HH:mm']).format('h:mm A')}{' '}
                  To {moment(timeEntry['endTime'], ['HH:mm']).format('h:mm A')}
                  {timeEntry.breakHours
                    ? ` With ${getBreakTime(timeEntry.breakHours)} Hour Break`
                    : '\n'}{' '}
                </Text>
                {/* <Caption >{timeEntry.notes}</Caption> */}
              </View>
              <View style={[styles.hourView, status_color[timeEntry.status]]}>
                <Title style={{fontWeight: '900', color: statusColor}}>
                  {formatFloat(timeEntry.actualHours)}
                </Title>
                <Subheading style={{color: statusColor}}>hours</Subheading>
              </View>
            </ColView>
          ) : (
            <ColView justify={'space-between'}>
              <View style={styles.detailView}>
                <View>
                  <Text style={styles.headline}>{timeEntry.leaveType}</Text>
                  <Caption style={styles.subheading}>
                  {timeEntry.project 
                    ? `${timeEntry.project}\n`
                    : '\n'}
                  </Caption>
                  <Text >{'\n' }</Text>
                </View>
                {/* <View>
                  <Caption>{status_name[timeEntry.status]}</Caption>
                </View> */}
              </View>
              <View style={[styles.hourView, status_color[timeEntry.status]]}>
                <Title style={{fontWeight: '900', color: statusColor}}>
                  {formatFloat(timeEntry.hours)}
                </Title>
                <Subheading style={{color: statusColor}}>hours</Subheading>
              </View>
            </ColView>
          )}
        </Card.Content>
      </TouchableRipple>
    </Card>
  );
};
export default TimeCard

const styles = StyleSheet.create({
  cardView: {
    paddingVertical: 5,
  },
  card:{
    borderRadius: 2,
    margin: 10,
    marginTop: 0,
    // backgroundColor: selectColor ? '#727ef6b3' : 'white',
  },
  detailView: {
    width: '75%', 
    paddingRight: 5, 
    paddingVertical: 5
  },
  subheading: {
    color: '#747474',
    lineHeight: 14,
    marginVertical: 0,
    // marginBottom: 5,
  },
  headline: {
    lineHeight: 22, 
    marginVertical: 0,
    fontWeight: 'bold'
  },
  hourView: {
    width: '25%',
    // height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

