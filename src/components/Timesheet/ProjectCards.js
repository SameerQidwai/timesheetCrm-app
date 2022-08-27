import React from 'react';
import { View , StyleSheet, Pressable} from 'react-native';
import {Card, Headline, Subheading, Title, Caption, Text } from 'react-native-paper';
import { status_color } from '../../services/constant';
import { ColView } from '../ConstantComponent';


  

const ProjectCards = ({timesheet, selected, onLongPress, onPress}) =>{
    const statusColor = status_color[timesheet.status]?.['color'] ?? '#476ba6'
    return( 
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
                <Card.Content >
                    <ColView justify={'space-between'} >
                        <View style={styles.detailView}>
                            <View >
                                <Text style={styles.headline}>{timesheet.project}</Text>
                                <Subheading style={styles.subheading}>{timesheet.projectType === 1 ? timesheet.milestone: ''}</Subheading>
                            </View>
                            <View>
                                <Caption>{timesheet.status}</Caption>
                            </View>
                        </View>
                        <View style={[styles.hourView, status_color[timesheet.status]]}
                        >
                            <Title style={{fontWeight: '900', color:statusColor}}>{timesheet.totalHours}</Title>
                            <Subheading style={{color:statusColor}}>hours</Subheading>
                        </View>
                    </ColView>
                </Card.Content>
            </Pressable>
        </Card>
    )
}
export default ProjectCards

const styles = StyleSheet.create({
    cardView: {
        paddingVertical:  5,
    },
    card: (selectColor)=> ({
        borderRadius: 10,  
        margin:10,
        backgroundColor: selectColor ? "#727ef6b3" : "white"
    }),
    detailView: {
        width: '75%', 
        paddingTop: 15, 
        justifyContent: 'space-between'
    },
    headline: {
        lineHeight: 26, 
        marginVertical: 0
    },
    subheading:{
        color: '#747474', 
        lineHeight: 18, 
        marginVertical: 0, 
        marginBottom: 5
    },
    hourView:{
        width: '25%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        backgroundColor :'#edf5ff', 
        borderColor: '#8fb2eb', 
        borderWidth: 1, 
        color: '#476ba6'
    } 
})
 