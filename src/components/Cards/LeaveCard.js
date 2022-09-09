import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Caption, Card, Headline, Paragraph, Subheading, Text, Title, TouchableRipple } from 'react-native-paper'
import { formatDate, formatFloat, status_color } from '../../services/constant'
import { ColView } from '../Common/ConstantComponent'

const LeaveCard = ({item, index, onPress}) => {
  return (
    <Card elevation={5} mode="elevated" style={styles.card}>
        <TouchableRipple
          onPress={onPress}
          rippleColor="rgba(0, 0, 0, .32)"
        >
          <Card.Content style={{paddingHorizontal: 0}}>
            <ColView justify={'space-between'}>
              {/* <View style={styles.dateView}>
                <View style={styles.dateCard}>
                  <Headline style={styles.dateText}>
                    {formatDate(item.startDate, false, 'DD MMM')}
                  </Headline>
                </View>
              </View> */}
              <View style={[styles.dateView, status_color[item.status]]}>
                <Headline style={[styles.dateText, status_color[item.status]]}>
                    {formatDate(item.startDate, false, 'DD')}
                </Headline>
                <Subheading style={[styles.monthText, status_color[item.status]]}>
                    {formatDate(item.startDate, false, 'MMM')}
                </Subheading>
              </View>
              <View style={styles.detailView}>
                <View style={styles.nameView}>
                    <Text 
                        style={styles.headline}
                        numberOfLines={1}
                    >
                        {item.leaveRequestName}
                    </Text>
                    <Caption
                        style={[styles.statusCaption, status_color[item.status]]}>
                        {formatFloat(item.totalHours)}hr -{' '}
                        {formatDate(item.endDate).diff(
                        formatDate(item.startDate),
                        'days',
                        )+1} {' '}days
                    </Caption>
                </View>
                <Text style={styles.projectText}>{item.projectName}</Text>
                <Paragraph style={styles.notesText}>{item.notes}</Paragraph>
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
    width: '80%',
    paddingRight: 5,
    paddingVertical: 5,
  },
  dateView: {
    width: '20%',
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
    textTransform: 'uppercase',
  },
  monthText: {
    // lineHeight: 21,
    // color: 'grey',
    textTransform: 'uppercase',
  },

  projectText: {lineHeight: 22, marginVertical: 0, color: 'grey'},
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
    paddingHorizontal: 5,
  },
});