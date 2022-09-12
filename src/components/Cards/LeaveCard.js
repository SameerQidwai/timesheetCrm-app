import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Caption, Card, Headline, Paragraph, Subheading, Text, Title, TouchableRipple } from 'react-native-paper'
import { formatDate, formatFloat, status_background, status_color } from '../../services/constant'
import { ColView } from '../Common/ConstantComponent'
import StatusTag from '../Common/StatusTag'

const LeaveCard = ({item, index, onPress}) => {
  return (
    <Card elevation={5} mode="elevated" style={styles.card}>
        <TouchableRipple
          onPress={onPress}
          rippleColor="rgba(0, 0, 0, .32)"
        >
          <Card.Content style={{paddingHorizontal: 0}}>
            <ColView justify={'space-between'}>
              <View style={styles.detailView}>
                <View style={styles.nameView}>
                    <Text 
                      style={styles.headline}
                      numberOfLines={1}
                    >
                        {item.leaveRequestName}
                    </Text>
                </View>
                <Caption style={styles.projectText} numberOfLines={1}>{item.project}</Caption>
                <Caption style={{color: '#000'}}>
                    {formatDate(item.startDate, false, 'ddd DD MMM YYYY') + ' to ' + formatDate(item.endDate, false, 'ddd DD MMM YYYY')}
                </Caption>
                <Caption style={{color: '#000'}}>
                    {formatFloat(item.totalHours)}hr {' '}
                </Caption>
                
                {/* <Paragraph style={styles.notesText}>{item.notes}</Paragraph> */}
              </View>
              <View style={[styles.dateView, status_background[item.status]]}>
                <Title style={[styles.dateText, status_color[item.status]]}>
                  {formatDate(item.endDate).diff( formatDate(item.startDate), 'days', )+1}
                </Title>
                <Subheading style={[styles.monthText, status_color[item.status]]}>
                  Days
                </Subheading>
                <StatusTag status={item.status}/>
              </View>
            </ColView>
          </Card.Content>
        </TouchableRipple>
    </Card>
  )
}

export default LeaveCard


const styles = StyleSheet.create({
  card: {
    borderRadius: 2,
    margin: 10,
    marginTop: 0,
  },
  detailView: {
    width: '75%',
    paddingLeft: 10,
    paddingVertical: 5,
  },
  dateView: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCard: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 2,
    padding: 5,
    borderColor: 'black',
  },
  dateText: {
    // lineHeight: 22,
    marginVertical: 0,
    fontWeight: '900',
    // color: 'grey',
    // textTransform: 'uppercase',
  },
  monthText: {
    // lineHeight: 21,
    // color: 'grey',
    // textTransform: 'uppercase',
  },

  projectText: {
    color: '#747474', 
    lineHeight: 14, 
    marginVertical: 0,
    // color: 'grey'
  },
  notesText: {color: '#bfbfbf'},
  headline: {
    lineHeight: 22,
    marginVertical: 0,
    fontWeight: 'bold',
  },
  statusCaption: {
    borderWidth: 1,
    borderRadius: 2,
    marginLeft: 10,
    paddingHorizontal: 2,
    // color: 'grey',
  },
  nameView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: 5,
  },
});