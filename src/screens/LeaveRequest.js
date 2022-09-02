import React, { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, View, VirtualizedList } from "react-native";
import { Caption, Card, FAB, Headline, Paragraph, Subheading, Text, Title } from "react-native-paper";
import { leave_request, leave_request_balance } from "../../assets/constant";
import { ColView } from "../components/ConstantComponent";
import LeaveBalance from "../components/Leave/LeaveBalance";
import LeaveRequestModal from "../components/Modals/LeaveRequestModal";
import { AppContext } from "../context/AppContext";
import { formatDate, status_color } from "../services/constant";
import { deleteLeaveApi, getBalanceApi, getLeavesApi } from "../services/leaveRequest-api";

const LeaveRequest = () =>{
  const { appStorage, setAppStorage } = useContext(AppContext)
  const [longPressed, setLongPress] = useState(false);
  const [selected, setSelected] = useState({})
  const [data, setData] = useState({leaves: [], balances: [{}]})
  const [fetching, setFetching] = useState(false)
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getData()
  }, [])
    

  const getData = async() =>{
    const { accessToken: token} =appStorage
    setFetching(true)
    Promise.all([ getLeavesApi(token), getBalanceApi(undefined, token)])
    .then(res=>{
      const {success: leaveSuccess, data: leaveData, setToken} = res[0]
      const {success: balanceSuccess, data: balanceData} = res[1]
      setData({leaves: leaveSuccess? leaveData: [], balances: balanceSuccess? balanceData: []})
      setFetching(false)
      setAppStorage(prev=> ({...prev, accessToken: setToken}))
    })
    .catch(e => {
      console.log(e);
    })
  }

  const onSuccess = ()=>{
    setOpenModal({visible: false})
    setFetching(true)
    setLongPress(false)
    getData()
  }

  const renderItem = ({item, index}) => {
    return (
      <Card elevation={3} style={styles.card(selected[item.id])}>
        <Pressable
          android_ripple={{color: '#747474', borderless: true}}
          onLongPress={() => onPressItem(item.id, true)}
          onPress={() => { onPressItem(item.id) }}
        >
          <Card.Content>
            <ColView>
              <View style={styles.dateView}>
                {/* <Card mode='outlined'  style={styles.dateCard}> */}
                <View style={styles.dateCard}>
                  <Headline style={styles.dateText}>
                    {formatDate(item.startDate, false, 'DD MMM')}
                  </Headline>
                </View>
                {/* </Card> */}
              </View>
              <View>
                <Card.Content>
                  <ColView style={{alignItems: 'center'}}>
                    <Title>{item.leaveRequestName}</Title>
                    <Caption
                      style={[styles.statusCaption, status_color[item.status]]}>
                      {item.totalHours}hr -{' '}
                      {formatDate(item.startDate).diff(
                        formatDate(item.endDate),
                        'days',
                      )}{' '}
                      days
                    </Caption>
                  </ColView>
                  <Text style={styles.projectText}>{item.projectName}</Text>
                  <Paragraph style={styles.notesText}>{item.notes}</Paragraph>
                </Card.Content>
              </View>
            </ColView>
          </Card.Content>
        </Pressable>
      </Card>
    );
  };

  const fabAction = () =>{
      // console.log(true)
      if (longPressed) {
        setFetching(true)
        let id = Object.keys(selected)[0]
        let { accessToken } = appStorage
        deleteLeaveApi(id, accessToken).then(res=>{
          if(res.success){
            onSuccess()
            setAppStorage(prev=> ({...prev, accessToken: res.setToken}))
          }
        })
      } else {
        setOpenModal({visible: !openModal['visible']});
      }
  }

  const onPressItem = (key, long)=>{
    let newSelected = selected
    let selectedItems = Object.keys(selected).length
    if (longPressed && selectedItems > 0){
        if (newSelected[key]){
          delete newSelected[key]
          if (selectedItems === 1){
              setLongPress(false)
          }
        }else{
          newSelected= {[key]: true}
        }
        setSelected({...newSelected})
    }
    if (!long && selectedItems === 0) {
      setOpenModal({
        visible: true, 
        edit: key 
      });
    }
    
    if (long && selectedItems === 0){
        setSelected({[key]: true})
        setLongPress(true)
    }
}

  return (
    <View style={{flex: 1}}>
      <ColView style={styles.header}>
        <Title style={styles.headerTitle}>Leave</Title>
      </ColView>
      <LeaveBalance leave_balnce={data['balances']}/>
      <View style={{flex: 1}}>
        <Subheading style={{paddingLeft:10, color: 'grey'}}>Leave Request</Subheading>
        <VirtualizedList
          data={data['leaves']}
          renderItem={renderItem}
          initialNumToRender={4}
          getItemCount={()=>data['leaves']?.length}
          keyExtractor={(item, index)=> item.id}
          getItem={(data, index)=> (data[index])}
          onRefresh={getData}
          refreshing={fetching}
        />
      </View>
      {openModal['visible'] && (
          <LeaveRequestModal
          modalVisible={openModal['visible']}
          edit={openModal['edit']}
          onSuccess={onSuccess}
          onClose={() => setOpenModal({visible: false})}
          />
      )}
      <FAB
          style={styles.fab(longPressed)}
          icon={longPressed ? 'delete' : 'plus'}
          disabled={fetching}
          size="large"
          onPress={fabAction}
      />
    </View>
  )
}

export default LeaveRequest

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    backgroundColor: '#2e44fc',
    alignItems: 'baseline',
    height: 48
  },
  headerTitle: {
    color: '#fff'
  },
  card: (selectColor)=>({
    borderRadius: 2,
    margin: 10,
    backgroundColor: selectColor ? "#727ef6b3" : "white"
    // padding: 10,
    // height: 120
  }),
  dateView: {width: 75, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  dateCard: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 2,
    padding: 5,
    borderColor: 'black',
  },
  dateText: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: 'bold',
    color: 'grey',
    textTransform: 'uppercase',
  },
  projectText: {lineHeight: 22, marginVertical: 0, color: 'grey'},
  notesText: {color: '#bfbfbf'},
  statusCaption: {
    borderWidth: 1,
    borderRadius: 2,
    marginLeft: 10,
    paddingHorizontal: 2,
    // color: 'grey',
  },
  fab: (pressed)=> ({
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: pressed ? 'red' : '#f8a587'
  }),
});