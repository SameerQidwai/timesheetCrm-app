import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { formatDate, formatFloat } from '../../services/constant';
import { colors } from './theme';

export const ColView = ({children, flex,justify, padding, style,}) =>{
    return <View style={{...styles.main(flex, justify, padding, style)}}>
        {children}
    </View>
}

export const RenderDay = ({sDate, date, state, marking, theme, onDateChanged, dailyhours}) =>{

    const [reload, setReload] = useState(false)
    useEffect(() => {
        setReload(!reload)
    }, [dailyhours])
    
    const getDate = () => {
        return date.dateString
    }

    const getDayHour = () =>{
        if (formatDate(getDate()).isSame(sDate, 'month')){
            return formatFloat(dailyhours?.[getDate(state)])
        }else{
            return '--'
        }
    }
    
    return (
        <View>
            <View
                style={[
                     styles.renderDayView,
                    marking?.['customStyles']?.container,
                ]}
            >
                <TouchableRipple
                    rippleColor={colors.primaryCondition(state, 'selected')}
                    borderless
                    onPress={() => {
                        // if (state !== 'disabled'){
                            onDateChanged(getDate())
                        // }
                    }}
                    style={{
                        flex:1,
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: 65
                    }}
                >
                    <View style={{flexDirection: 'column', justifyContent: 'space-between', flex:2}}>
                        <View>
                            <Text style={[styles.renderDayText(state), styles.todayDayText(date),marking?.['customStyles']?.text]}>
                            {date.day}
                            </Text>
                        </View>
                        <View>
                            <Text style={[styles.renderDayText(state), styles.todayDayText(date), marking?.['customStyles']?.text, {fontSize: 12}]}>
                                {getDayHour()}
                            </Text>
                        </View>
                    </View>
                </TouchableRipple>
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
    renderDayText: (state)=>({
        textAlign: 'center',
        color: state === 'today'? '#1890ff' : state === 'disabled' ? 'gray' : 'black'
    }),
    todayDayText:(date)=>{
        if (moment().isSame(formatDate(date.dateString, 'YYYY-MM-DD'), 'day')){
            return {color: '#1890ff'}
        }
    }
})