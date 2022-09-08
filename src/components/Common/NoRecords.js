import React from 'react'
import { View } from 'react-native'
import { ActivityIndicator, Button, Headline, IconButton, Text } from 'react-native-paper'

function NoRecords({waiting}) {
  return (
    <View style={{flex:1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
        {waiting?
            // <Button style={{width: 100, height:100}} disabled loading />
            <ActivityIndicator size="large" color="#969696" />
            :
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <IconButton icon="archive-cancel-outline" size={40}/>
                <Headline>No Record Found</Headline>
                <Text></Text>
            </View>
        }
    </View>
  )
}

export default NoRecords