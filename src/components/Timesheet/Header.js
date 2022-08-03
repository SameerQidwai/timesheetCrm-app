import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@rneui/themed'
import { ColView } from '../ConstantComponent';

export default Header = ({month, total, color}) => {
    return (
        // <View style={styles.main}>
    <ColView flex={2} justify={"space-between"} padding={20} style={{backgroundColor: color}}> 
        <View>
            <Text >Month:</Text>
            <Text h3 h3Style={styles.h3Style}>{month}</Text>
        </View>
        <View>
            <Text >Total:</Text>
            <Text h3 h3Style={styles.h3Style} >{total}</Text>
        </View>
     </ColView> 
    )
}

const styles = StyleSheet.create({
    h3Style: {
        fontWeight: '500',
    }
})