import React from 'react'
import { StyleSheet } from 'react-native'
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper'
import { colors } from './theme'

function Confirm({visible, action, entity, onDismiss, onConfirm}) {
  return (
    <Portal >
        <Dialog visible={visible} onDismiss={onDismiss}>
            <Dialog.Title>Confirmation</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Are You Sure You want to {action} this {entity}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={onDismiss} color={colors['light']} style={styles.buttonLeft}>Cancel</Button>
              <Button onPress={onConfirm} color={colors['primary']} style={styles.buttonRight}>Yes</Button>
            </Dialog.Actions>
        </Dialog>
    </Portal>
    // need edit 
  )
}

export default Confirm

const styles =  StyleSheet.create({
  buttonLeft: {
    paddingHorizontal: 5,
    marginHorizontal:5
  },
  buttonRight:{
    paddingHorizontal: 5,
  }
})