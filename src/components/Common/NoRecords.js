import React from 'react'
import { View } from 'react-native'
import { Headline, IconButton, Text } from 'react-native-paper'

function NoRecords() {
  return (
    <View style={{flex:1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <IconButton icon="archive-cancel-outline" size={40}/>
            <Headline>No Record Found</Headline>
            <Text></Text>
        </View>

    </View>
  )
}

export default NoRecords