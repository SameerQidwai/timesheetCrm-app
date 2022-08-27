import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Text } from 'react-native-paper';

export const ColView = ({children, flex,justify, padding, style,}) =>{
    return <View style={{...styles.main(flex, justify, padding, style)}}>
        {children}
    </View>
}

export const RenderDay = ({sDate, date, state, marking, theme, onDateChanged, dailyhours}) =>{
    // const [selectedDate, setSelectedDate] = useState( date.dateString ||new Date())
    // console.log(dailyhours)
    const getDate = () => {
        return moment(date.dateString).format('yyyy-M-D')
    }
    // const getDate = useCallback(
    //     (date) => {
    //       return date.dateString;
    //     },
    //     [selectedDate]
    //   );
    
    return (
        <View>
            <View
                style={[
                     styles.renderDayView,
                    marking?.['customStyles']?.container,
                ]}
            >
                <Pressable
                    android_ripple={{
                        color: state === 'selected' ? 'white' : '#707cf4',
                        borderless: true,
                        // foreground:  true
                    }}
                    onPress={() => onDateChanged(getDate())}
                    style={{
                        flex:1,
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: 65
                    }}
                >
                    <View>
                        <Text style={[marking?.['customStyles']?.text,styles.renderDayText]}>
                        {date.day}
                        </Text>
                    </View>
                    <View>
                        <Text style={[marking?.['customStyles']?.text,styles.renderDayText]}>
                        {dailyhours[getDate()]??'0.00'}
                        </Text>
                    </View>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main : (flex, justify, padding, style) =>({
        flex: flex, 
        flexDirection: 'row',
        justifyContent: justify,
        padding: padding,
        ...(style??{})
    }),
    renderDayView: {
        flex: 2,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        width: 38,
    },
    renderDayText: {
        textAlign: 'center'
    }
})