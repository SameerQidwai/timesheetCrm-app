import React from 'react';
import { View , StyleSheet, Pressable} from 'react-native';
import {Card, Headline, Subheading, Title, Caption, Text, TouchableRipple, IconButton } from 'react-native-paper';
import { formatFloat, status_color, status_name } from '../../services/constant';
import { ColView } from '../Common/ConstantComponent';

const ProjectCards = ({timesheet, selected, onLongPress, onPress}) =>{
    const statusColor = status_color[timesheet.status]?.['color'] ?? '#476ba6'
    return( 
        <Card 
            style={styles.card(selected)} 
            elevation={10} 
            mode="elevated"
        >
            <TouchableRipple
                // onLongPress={onLongPress}
                onPress={()=>!timesheet['leaveRequest'] && onPress()}
                rippleColor={!timesheet['leaveRequest'] ?"rgba(0, 0, 0, .32)": ''}
            >
            {/* <Pressable
                android_ripple={!timesheet['leaveRequest']?{color: '#747474', borderless: true} : {}}
                // onLongPress={()=>!timesheet['leaveRequest'] && onLongPress() } //only be pressed if it is not Leave
                onPress={()=>!timesheet['leaveRequest'] && onPress()} //only be pressed if it is not Leave
            > */}
                <Card.Content style={{ paddingRight: 0}}>
                    {!timesheet['leaveRequest']&&
                        // <ColView justify={'space-between'} >
                        //     <View style={styles.detailView}>
                        //         <View >
                        //             <Text style={styles.headline}>{timesheet.project}</Text>
                        //             <Subheading style={styles.subheading}>{timesheet.projectType === 1 ? timesheet.milestone: ''}</Subheading>
                        //         </View>
                        //         <View>
                        //             <Caption>{status_name[timesheet.status]}</Caption>
                        //         </View>
                        //     </View>
                        //     <View style={[styles.hourView, status_color[timesheet.status]]}
                        //     >
                        //         <Title style={{fontWeight: '900', color:statusColor}}>{formatFloat(timesheet.totalHours)}</Title>
                        //         <Subheading style={{color:statusColor}}>hours</Subheading>
                        //     </View>
                        // </ColView>
                        <ColView justify={'space-between'} >
                        <View style={styles.detailView}>
                            <Text style={styles.headline} numberOfLines={1} >{timesheet.project}</Text>
                            <Caption style={styles.subheading}>{timesheet.projectType === 1 ? `${timesheet.milestone}` : '\n'}</Caption>
                            <Text >{'\n' + status_name[timesheet.status?? 'SV']}</Text>
                            {/* <Caption >{timeEntry.notes}</Caption> */}
                        </View>
                        <View style={[styles.hourView, status_color[timesheet.status]] }
                        >
                            <Title style={{fontWeight: '900', color: statusColor, }}>{formatFloat(timesheet.totalHours)}</Title>
                            <Subheading style={{color: statusColor}}>hours</Subheading>
                            {selected&&<View style={[styles.overlay]} />}                               
                            {selected&& <IconButton
                                icon="check"
                                size={30}
                                color="white"
                                style={[styles.iconOverlay]}
                            />}
                        </View>
                      </ColView>
                    //     :
                    //     <ColView justify={'space-between'} >
                    //         <View style={styles.detailView}>
                    //             <View >
                    //                 <Text style={styles.headline}>{timesheet.leaveType}</Text>
                    //                 <Subheading style={styles.subheading}>{timesheet.project}</Subheading>
                    //             </View>
                    //             <View>
                    //                 <Caption>{status_name[timesheet.status]}</Caption>
                    //             </View>
                    //         </View>
                    //         <View style={[styles.hourView, status_color[timesheet.status]]}
                    //         >
                    //             <Title style={{fontWeight: '900', color:statusColor}}>{timesheet.totalHours}</Title>
                    //             <Subheading style={{color:statusColor}}>hours</Subheading>
                    //         </View>
                    //     </ColView>
                    }
                </Card.Content>
            </TouchableRipple>
        </Card>
    )
}
export default ProjectCards

const styles = StyleSheet.create({
    cardView: {
        paddingVertical:  5,
    },
    card: (selectColor)=> ({
        borderRadius: 2,
        marginHorizontal: 10,
        marginVertical: 5,
    }),
    detailView: {
        width: '75%', 
        // paddingTop: 15, 
        justifyContent: 'space-between',
        paddingRight: 5, 
    paddingVertical: 5
    },
    headline: {
        lineHeight: 22, 
        marginVertical: 0,
        fontWeight: 'bold'
    },
    subheading:{
        color: '#747474', 
        lineHeight: 14, 
        marginVertical: 0, 
        // marginBottom: 5
    },
    hourView:{
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor :'#edf5ff', 
        borderColor: '#8fb2eb', 
    },
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'black',
        opacity: 0.5
    },
    iconOverlay: {
        position: 'absolute',
        // top: 0,
        right: 0,
        bottom: 0,
        // left: 0,
        margin: 0,
    }  
})