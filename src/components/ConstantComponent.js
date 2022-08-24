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

    const getDate = () => {
        return date.dateString
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
                     styles.renderDayView(state),
                    marking?.['customStyles']?.container,
                ]}
            >
                <Pressable
                    android_ripple={{
                        color: state === 'selected' ? 'white' : 'grey',
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
    renderDayView: (state) =>({
        flex: 2,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: state === 'selected' ? 'blue' : 'white',
        width: 38,
    }),
    renderDayText: {
        textAlign: 'center'
    }
})