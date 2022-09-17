import { View, StyleSheet } from 'react-native'
import React from 'react'
import { Caption, Dialog, Portal, Title, Text, Card, Button } from 'react-native-paper'
import { ColView } from '../Common/ConstantComponent'
import { formatFloat } from '../../services/constant'
import { colors } from '../Common/theme'

const LeaveBalanceModal = ({visible, item, onClose}) => {
  return (
    <Portal>
        <Dialog visible={visible} style={styles.modalView} onDismiss={onClose}>
            <Dialog.Content>
                <Title >{item.name}</Title>
                <Card mode="outlined" style={styles.card} >
                    <ColView justify={'space-between'}>
                        <View>
                            <Caption style={styles.label}>Accured</Caption>
                        </View>
                        <View>
                            <Text>{formatFloat(item.carryForward)}</Text>
                        </View>
                    </ColView>
                </Card>
                <Card mode="outlined" style={styles.card} >
                    <ColView justify={'space-between'}>
                        <View>
                            <Caption style={styles.label}>Earned YTD</Caption>
                        </View>
                        <View>
                            <Text>{formatFloat(item.balanceHours - item.carryForward + item.used)}</Text>
                        </View>
                    </ColView>
                </Card>
                <Card mode="outlined" style={styles.card} >
                    <ColView justify={'space-between'}>
                        <View>
                            <Caption style={styles.label}>Used YTD</Caption>
                        </View>
                        <View>
                            <Text>{formatFloat(item.used)}</Text>
                        </View>
                    </ColView>
                </Card>
                <Card mode="outlined" style={styles.card} >
                    <ColView justify={'space-between'}>
                        <View>
                            <Caption style={styles.label}>Balance</Caption>
                        </View>
                        <View>
                            <Text>{formatFloat(item.balanceHours)}</Text>
                        </View>
                    </ColView>
                </Card>
                <Card mode="outlined" style={styles.card} >
                    <ColView justify={'space-between'}>
                        <View>
                            <Caption style={styles.label}>Required Balance</Caption>
                        </View>
                        <View>
                            <Text>{formatFloat(item?.type?.minimumBalanceRequired)}</Text>
                        </View>
                    </ColView>
                </Card>
                <Card mode="outlined" style={styles.card} >
                    <ColView justify={'space-between'}>
                        <View>
                            <Caption style={styles.label}>Overdraw Allowances</Caption>
                        </View>
                        <View>
                            <Text>{formatFloat(item?.type?.minimumBalance)}</Text>
                        </View>
                    </ColView>
                </Card>
            {/* <Dialog.Actions> */}
                <Button
                    labelStyle={styles.button}
                    compact
                    onPress={onClose}
                    color={colors['light']}
                >
                    Close
                </Button>
            {/* </Dialog.Actions> */}
            </Dialog.Content>
        </Dialog>
    </Portal>
  )
}

export default LeaveBalanceModal

const styles = StyleSheet.create ({
    modalView: {
        // backgroundColor: 'white',
        borderRadius: 2,
        // width: 325,
        paddingVertical: 0,
        marginVertical: 0,
        margin: 0,
        marginTop: 0,
        // alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    card: {
        padding: 2, 
        margin: 3
    },
    button: {
        marginHorizontal: 0,
        marginVertical: 0,
        marginTop: 5
    },
    label: {
        fontWeight: '700'
    }
})