import React from 'react'
import { View, Dimensions } from 'react-native'
import { Button, Portal, Modal } from 'react-native-paper'
import { colors } from './theme';
const height = Dimensions.get('screen').height

function Actions({visible, onDismiss, select, onOption1, onOption2}) {

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: 'white',
          marginTop: height - 235,
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
            View
          </Button>
          <Button
            mode="contained"
            color={colors['danger']}
            disabled={['SB', 'AP'].includes(select.status)}
            labelStyle={{color: '#fff'}}
            onPress={()=>onOption2(select.entryId)}
            style={{marginVertical: 10}}>
            Delete
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

export default Actions


  /**
   * <Modal
            animated
            animationType="fade"
            visible={visible}
            transparent
        >
            <TouchableWithoutFeedback onPress={onDismiss}>
                <View style={styles.overlay}/>
            </TouchableWithoutFeedback>

                 <Dialog.Actions> 
                <View style={[styles.container]}>
                    <Button onPress={onDismiss} color='#1890ff'>View</Button>
                    <Button  color="#ff4d4f">Delete</Button>
                </View>
                 </Dialog.Actions>
            </Modal>
   */