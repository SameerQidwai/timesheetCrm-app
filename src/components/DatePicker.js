import React, { useEffect, useState } from 'react'
import ReactNativeModernDatepicker from 'react-native-modern-datepicker'
import { Dialog, Portal } from 'react-native-paper'

function DatePicker({visible, mode, current, selected,  minDate, maxDate, interval, onDismiss, onDateChange, onMonthChage, onSelectedChange, onTimeChange, dateStyle, dialogContainertyle, dialogStyle}) {
    const [date, setDate] = useState(selected);
    useEffect(() => {
        setDate(selected)
    }, [selected])
    
    return (
    <Portal >
        <Dialog  
            visible={visible} 
            onDismiss={onDismiss}   
            contentContainerStyle={dialogContainertyle}
            style={dialogStyle}
        >
            <ReactNativeModernDatepicker
                mode={mode}
                current={date??current}
                selected={date}
                selectorStartingYear={2000}
                selectorEndingYear={3000}
                minimumDate={minDate}
                maximumDate={maxDate}
                minuteInterval={interval}
                onMonthYearChange={selectedDate => {onMonthChage && onMonthChage(selectedDate)}}
                onDateChange={selectedDate => {onDateChange&& onDateChange(selectedDate)}}
                onSelectedChange={select=>{onSelectedChange &&onSelectedChange(select)}}
                onTimeChange={selectedTime=>{onTimeChange && onTimeChange(selectedTime)}}
                style={[{borderRadius: 5},dateStyle]}
                options={{
                    mainColor: '#1890ff',
                  }}
            />
        </Dialog>
    </Portal>
  )
}

export default DatePicker