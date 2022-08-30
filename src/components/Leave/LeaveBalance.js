import React from 'react'
import { FlatList, ScrollView, StyleSheet, View } from 'react-native'
import { Card, Subheading, Text } from 'react-native-paper'
import { leave_request_balance } from '../../../assets/constant'
import { formatFloat } from '../../services/constant'


export default LeaveBalance= ({leave_balnce})=> {
    const Leave_Balance = leave_balnce
    /** SUMMARY  */
    // const renderItem = ({item}) =>{ 
    //     return <Card
    //         elevation={10} 
    //         mode="elevated"
    //     >
    //         <View style={{
    //             flexDirection: 'column',
    //             justifyContent: 'space-between'
    //         }}>
    //             <Card.Title title={item.balanceHours}/>
    //             <Card.Title title={item.name} subtitle={`${item.balanceHours + item.used} Leaves`}/>
    //         </View>
    //     </Card>

    // }
    /** Details */
    const renderItem = ({item}) =>{ 
        return <Card
            style={styles.card}
            elevation={10} 
            mode="elevated"
        >
            {/* <View > */}
                <Card.Title title={formatFloat(item.balanceHours)}/>
                <View>
                    {/* <Card.Title subtitle={item.name} /> */}
                    <Subheading style={{paddingLeft:10, fontWeight: '700'}}>{item.name}</Subheading>
                    <Text>Accured is {formatFloat(item.carryForward)}</Text>
                    <Text>Earned YTD is {formatFloat(item.balanceHours - item.carryForward + item.used)}</Text>
                    <Text>Used YTD is {formatFloat(item.used)}</Text>
                </View>
            {/* </View> */}
        </Card>

    }

    return (
        <View>
            <Subheading style={{paddingLeft:10, color: 'grey'}}>Leave Balance</Subheading>
            <FlatList
                horizontal
                data={Leave_Balance}
                renderItem={renderItem}
                keyExtractor={(item, index)=> index}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    space: {
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    card: {
        borderRadius: 10,  
        margin:10,
        padding:10
    }
})