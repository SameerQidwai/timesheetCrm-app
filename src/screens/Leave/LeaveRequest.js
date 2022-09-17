import React, { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, View, VirtualizedList } from "react-native";
import { Appbar, Button, Caption, Card, FAB, Headline, Paragraph, Subheading, Text, Title } from "react-native-paper";
import { leave_request, leave_request_balance } from "../../../assets/constant";
import LeaveCard from "../../components/Cards/LeaveCard";
import Actions from "../../components/Common/Actions";
import Confirm from "../../components/Common/Confirm";
import { ColView } from "../../components/Common/ConstantComponent";
import { colors } from "../../components/Common/theme";
import LeaveBalance from "../../components/Leave/LeaveBalance";
import LeaveRequestModal from "../../components/Modals/LeaveRequestModal";
import { AppContext } from "../../context/AppContext";
import { formatDate, status_color } from "../../services/constant";
import { deleteLeaveApi, getBalanceApi, getLeavesApi } from "../../services/leaveRequest-api";

const LeaveRequest = () =>{
  const { appStorage, setAppStorage } = useContext(AppContext)
  const [longPressed, setLongPress] = useState(false);
  const [selected, setSelected] = useState(false)
  const [data, setData] = useState({leaves: [], balances: [{}]})
  const [fetching, setFetching] = useState(false)
  const [openModal, setOpenModal] = useState(false);
  const [confirming, setConfirming] = useState(false);

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
    getData()
  }

  const renderItem = ({item, index}) => {
    return (
      <LeaveCard
        item={item}
        index={index}
        onPress={()=> onPressItem(item, index)}
      />
    );
  };
  
  const onDelete = () => {
    let { id } = selected
    setFetching(true);
    setConfirming(false)
    setSelected(false);
    let {accessToken} = appStorage;
    deleteLeaveApi(id, accessToken).then(res=>{
      if(res?.success){
        setOpenModal({visible: false})
        getData()
      }
    })
  };

  const onPressItem = (item, index) => {
    setSelected(item);
  };

  const onView = (item, index) =>{
    setSelected(false);
    setOpenModal({
      visible: true, 
      // index,
      edit: item.id
    });
  };

  return (
    <View style={styles.pageView}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title={'Leaves'} />
      </Appbar.Header>
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
        <Button
          mode="contained"
          uppercase={false}
          raised
          color={colors['primary']}
          style={styles.bottomButton}
          size="large"
          disabled={fetching}
          onPress={() => setOpenModal({visible: !openModal['visible']})}
          >
            Add Request
        </Button>
      {openModal['visible'] && (
          <LeaveRequestModal
            modalVisible={openModal['visible']}
            edit={openModal['edit']}
            onSuccess={onSuccess}
            onClose={() => setOpenModal({visible: false})}
          />
      )}
      {selected && (
        <Actions
          visible={selected}
          onDismiss={() => setSelected(false)}
          onOption1={onView}
          onOption2={() => setConfirming('Delete')}
          select={selected}
          disableOption2={['AP']}
        />
      )}
      {confirming && (
          <Confirm
            visible={confirming}
            onDismiss={() => setConfirming(false)}
            action={confirming}
            entity={'Leave Request'}
            onConfirm={onDelete}
          />
        )}
    </View>
  )
}

export default LeaveRequest

const styles = StyleSheet.create({
  pageView: {
    flex: 1, 
    backgroundColor: colors['display']
  },
  header:{
    flexDirection: 'row',
    backgroundColor: colors['primary'],
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  // header: {
  //   justifyContent: 'center',
  //   backgroundColor: '#2e44fc',
  //   alignItems: 'baseline',
  //   height: 48
  // },
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
  buttonView: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginHorizontal: 10,
    marginTop: 7,
  },
  fab: (pressed)=> ({
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: pressed ? 'red' : '#f8a587'
  }),
  bottomButton: {
    marginHorizontal: 15, 
    marginVertical: 8,
    borderRadius: 2,
},
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'black',
    opacity: 0.5
},
});