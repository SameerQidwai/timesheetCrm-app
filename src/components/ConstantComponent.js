import React from 'react';
import { View, StyleSheet } from 'react-native';

export const ColView = ({children, flex,justify, padding, style,}) =>{
    return <View style={{...styles.main(flex, justify, padding, style)}}>
        {children}
    </View>
}

const styles = StyleSheet.create({
    main : (flex, justify, padding, style) =>({
        flex: flex, 
        flexDirection: 'row',
        justifyContent: justify,
        padding: padding,
        ...(style??{})
    }),
})