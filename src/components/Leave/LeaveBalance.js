import React, { useState } from 'react'
import { FlatList, ScrollView, StyleSheet, View } from 'react-native'
import { Caption, Card, Headline, Subheading, Text, Title, TouchableRipple } from 'react-native-paper'
import { leave_request_balance } from '../../../assets/constant'
import { formatFloat } from '../../services/constant'
import { ColView } from '../Common/ConstantComponent'
import { colors } from '../Common/theme'
import LeaveBalanceModal from '../Modals/LeaveBalanceModal'


export default LeaveBalance= ({leave_balnce})=> {
    const [select, setSelect] = useState(false)
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
    // const renderItem = ({item}) =>{ 
    //     return <Card
    //         style={styles.card}
    //         elevation={10} 
    //         mode="elevated"
    //     >
    //         {/* <View > */}
    //             <Card.Title title={formatFloat(item.balanceHours)}/>
    //             <View>
    //                 {/* <Card.Title subtitle={item.name} /> */}
    //                 <Subheading style={{paddingLeft:10, fontWeight: '700'}}>{item.name}</Subheading>
    //                 <Text>Accured is {formatFloat(item.carryForward)}</Text>
    //                 <Text>Earned YTD is {formatFloat(item.balanceHours - item.carryForward + item.used)}</Text>
    //                 <Text>Used YTD is {formatFloat(item.used)}</Text>
    //             </View>
    //         {/* </View> */}
    //     </Card>

    // }
    // const onPressItem = (item) =>{
    //     setS
    // }

     const renderItem = ({item}) =>{ 
        return (
        <Card
            style={styles.card}
            elevation={10} 
            mode="elevated"
        >
            <TouchableRipple
                onPress={()=>{setSelect(item)}}
                rippleColor={"rgba(0, 0, 0, .12)"}
            >
            <Card.Content style={styles.content}>
                <Subheading numberOfLines={1} >{item.name}</Subheading>
                    <View>
                        <Headline style={{fontWeight: '700'}}>{formatFloat(item.balanceHours)}</Headline>
                        <Text style={styles.caption}>hours</Text>
                    </View>
            </Card.Content>
            </TouchableRipple>
        </Card>
        )
    }

    // const renderItem = ({item}) =>{ 
    //     return <Card
    //         style={styles.card}
    //         elevation={10} 
    //         mode="elevated"
    //     >
    //         <Card.Content>
    //             <Title numberOfLines={1} >{item.name}</Title>
    //             <ColView justify={'space-between'}>
    //                 <View>
    //                     <Caption style={{fontWeight: '700'}}>Balance</Caption>
    //                     <Text>{formatFloat(item.balanceHours)}</Text>
    //                 </View>
    //                 <View>
    //                     <Caption style={{fontWeight: '700'}}>Used YTD</Caption>
    //                     <Text>{formatFloat(item.used)}</Text>
    //                 </View>
    //             </ColView>
    //             <ColView justify={'space-between'}>
    //                 <View>
    //                     <Caption style={{fontWeight: '700'}}>Accured</Caption>
    //                     <Text>{formatFloat(item.carryForward)}</Text>
    //                 </View>
    //                 <View>
    //                     <Caption style={{fontWeight: '700'}}>Earned YTD</Caption>
    //                     <Text>{formatFloat(item.balanceHours - item.carryForward + item.used)}</Text>
    //                 </View>
    //             </ColView>
    //         </Card.Content>
    //     </Card>
    // }

    return (
        <View>
            <Subheading style={{paddingLeft:10, color: colors['light']}}>Leave Balance</Subheading>
            <FlatList
                horizontal
                data={Leave_Balance}
                renderItem={renderItem}
                keyExtractor={(item, index)=> index}
            />
            {select && <LeaveBalanceModal visible={select} item={select} onClose={()=>setSelect(false)}/>}
        </View>
    )
}

const styles = StyleSheet.create({
    space: {
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    card: {
        borderRadius: 2,  
        margin:10,
        width: 200,
        paddingVertical: 0,
        
    },
    content: {
        paddingVertical: 15,
    },
    caption: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.54)',
        marginVertical: 2,
        letterSpacing: 0.45
    }
})