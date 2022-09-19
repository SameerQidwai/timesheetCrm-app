import React, {useEffect} from 'react';
import moment from 'moment';
import { View , StyleSheet } from 'react-native';
import {Card, Text, Title, Subheading, Caption, TouchableRipple, IconButton } from 'react-native-paper';
import { formatFloat, status_background, status_color } from '../../services/constant';
import { ColView } from '../Common/ConstantComponent';
import StatusTag from '../Common/StatusTag';

const TimeCard = ({timeEntry, selected, onLongPress, onPress}) => {
  const statusColor = status_color[timeEntry.status]?.['color'] ?? '#476ba6'
  const overlay = timeEntry.leaveRequest ? (timeEntry['status'] === 'AP') : (['AP', 'SB'].includes(timeEntry['status']))

  useEffect(() => {
      // console.log(selected)
  }, [{...selected}]);

  const getBreakTime = (hours) =>{
    let breakHours = moment.duration(hours,'hours')
    return breakHours ? moment(moment().hours(breakHours.hours()).minutes(breakHours.minutes())).format("HH:mm"): '00:00'
  }

  return (
    <Card style={styles.card(overlay)} elevation={5} mode="elevated">
      {!timeEntry.leaveRequest ? (
        <TouchableRipple
          onPress={!isNaN(timeEntry['entryId']) && onPress}
          rippleColor={"rgba(0, 0, 0, .12)"}>
          <Card.Content style={{paddingRight: 0}}>
            <ColView justify={'space-between'}>
              <View style={styles.detailView}>
                <Text style={styles.headline(overlay)} numberOfLines={1}>
                  {timeEntry.project}
                </Text>
                <Caption style={styles.subheading}>
                  {timeEntry.projectType === 1
                    ? `${timeEntry.milestone}`
                    : '\n'}
                </Caption>
                {timeEntry['startTime'] ? (
                  <Text style={styles.timeText(overlay)}>
                    {moment(timeEntry['startTime'], ['HH:mm']).format('h:mm A')}{' '}
                    To{' '}
                    {moment(timeEntry['endTime'], ['HH:mm']).format('h:mm A')}
                    {'\n'}
                    {timeEntry.breakHours
                      ? `${getBreakTime(timeEntry.breakHours)} hours of break`
                      : ' '}
                  </Text>
                ) : (
                  <Text style={styles.timeText(overlay, isNaN(timeEntry['entryId']))}>Press To Add Time Entry {'\n'} </Text>
                )}
                {/* <Caption >{timeEntry.notes}</Caption> */}
              </View>
              <View style={[styles.hourView, status_background[timeEntry.status]]}>
                {isNaN(timeEntry['entryId']) ?  (
                  <IconButton icon={overlay? 'minus': 'plus'} color={statusColor} size={40} />
                ): (
                  <View>
                    <Title style={[{fontWeight: '900', textAlign: 'center'}, status_color[timeEntry.status]]}>
                      {formatFloat(timeEntry.actualHours)}
                    </Title>
                    <Subheading style={[{textAlign: 'center'},status_color[timeEntry.status]]}>hours</Subheading>
                    <StatusTag status={timeEntry.status}/>
                  </View>
                )}
              </View>
            </ColView>
          </Card.Content>
        </TouchableRipple>
      ) : (
        <TouchableRipple>
          <Card.Content style={{paddingRight: 0}}>
            <ColView justify={'space-between'}>
              <View style={styles.detailView}>
                <View>
                  <Text style={styles.headline(overlay)}>{timeEntry.leaveType}</Text>
                  <Caption style={styles.subheading}>
                    {timeEntry.project ? `${timeEntry.project}\n` : '\n'}
                  </Caption>
                  <Text>{'\n'}</Text>
                </View>
              </View>
              <View style={[styles.hourView, status_background[timeEntry.status]]}>
                <Title style={[{fontWeight: '900'}, status_color[timeEntry.status]]}>
                  {formatFloat(timeEntry.hours)}
                </Title>
                <Subheading style={status_color[timeEntry.status]}>hours</Subheading>
                <StatusTag status={timeEntry.status} />
              </View>
            </ColView>
          </Card.Content>
        </TouchableRipple>
      )}
    </Card>
  );
};
export default TimeCard

const styles = StyleSheet.create({
  cardView: {
    paddingVertical: 5,
  },
  card:(selectColor)=>({
    borderRadius: 2,
    margin: 10,
    marginTop: 0,
    backgroundColor: selectColor ? '#f5f5f5' : 'white',
  }),
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
  headline:(selectColor)=>( {
    lineHeight: 22, 
    marginVertical: 0,
    fontWeight: 'bold',
    color: selectColor ? '#747474' : '#000',
  }),
  timeText:(selectColor, emptyOverlay)=>( {
    color: emptyOverlay ? '#f5f5f5' :selectColor ? '#747474' : '#000',
  }),
  hourView: {
    width: '25%',
    // height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

