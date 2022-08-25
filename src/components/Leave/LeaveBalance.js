import React from 'react'
import { FlatList, ScrollView, StyleSheet, View } from 'react-native'
import { Card, Subheading, Text } from 'react-native-paper'
import { leave_request_balance } from '../../../assets/constant'


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
                <Card.Title title={item.balanceHours}/>
                <View>
                    {/* <Card.Title subtitle={item.name} /> */}
                    <Subheading style={{paddingLeft:10}}>Total</Subheading>
                    <Text>Accured is {item.carryForward}</Text>
                    <Text>Earned YTD is {item.balanceHours - item.carryForward + item.used}</Text>
                    <Text>Used YTD is {item.used}</Text>
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