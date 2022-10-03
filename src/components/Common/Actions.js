import React from 'react'
import { View, Dimensions, Platform } from 'react-native'
import { Button, Portal, Modal } from 'react-native-paper'
import { colors } from './theme';
const height = Dimensions.get('screen').height

function Actions({visible, onDismiss, select, onOption1, onOption2, disableOption2}) {

  const option1Name =  disableOption2.includes(select['status']) ? 'View' : 'Edit'

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: 'white',
          marginTop: height -  (Platform.OS === 'ios' ? 150 : 235),
          height: (Platform.OS === 'ios' ? 150 : 235)
        }}
        style={{flex: 1}}>
        <View
          style={{
            padding: 20,
            paddingHorizontal: 50,
            justifyContent: 'space-evenly',
          }}>
          <Button
            mode="contained"
            onPress={()=>onOption1(select)}
            color={colors['primary']}
            style={{marginVertical: 10}}>
            {option1Name}
          </Button>
          <Button
            mode="contained"
            color={colors['danger']}
            disabled={disableOption2.includes(select.status)}
            labelStyle={{color: '#fff'}}
            onPress={()=>onOption2(select)}
            style={{marginVertical: 10}}>
            Delete
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

export default Actions