import React from 'react'
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper'

function Confirm({visible, action, entity, onDismiss, onConfirm}) {
  return (
    <Portal >
        <Dialog visible={visible} onDismiss={onDismiss}>
            <Dialog.Title>Confirmation</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Are You Sure You want to {action} this {entity}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={onDismiss} color='#1890ff'>Cancel</Button>
              <Button onPress={onConfirm} color='#1890ff'>Yes</Button>
            </Dialog.Actions>
        </Dialog>
    </Portal>
  )
}

export default Confirm