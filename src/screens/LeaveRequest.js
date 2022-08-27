import moment from "moment";
import React, { useState } from "react";
import { FlatList, StyleSheet, View, VirtualizedList } from "react-native";
import { Caption, Card, FAB, Headline, IconButton, Paragraph, Subheading, Text, Title } from "react-native-paper";
import { leave_request, leave_request_balance } from "../../assets/constant";
import { ColView } from "../components/ConstantComponent";
import LeaveBalance from "../components/Leave/LeaveBalance";
import LeaveRequestModal from "../components/Modals/LeaveRequestModal";
import { status_color } from "../services/constant";

const LeaveRequest = () =>{
    
    const [longPressed, setLongPress] = useState(false);
    const [Leave_Request, setLeave] = useState(leave_request)
    const [fetching, setFetching] = useState(false)
    const [openModal, setOpenModal] = useState(false);


    const onRefresh = () =>{
        setFetching(true)
        setTimeout(() => {
            setLeave(leave_request)
            setFetching(false)
        }, 3000);
    }

    const renderItem = ({item})=>{
        return( 
            <Card
                elevation={3}
                style={styles.card}
            >
                <ColView >
                    <View style={styles.dateView}>
                        <Card mode='outlined'  style={styles.dateCard}>
                            <Headline style={styles.dateText}> {moment('2022-04-04').format('DD MMM')} </Headline>
                        </Card>
                    </View>
                    <View>
                        <Card.Content >
                            <ColView style={{alignItems: 'center'}}>
                                <Title >
                                    {item.leaveRequestName}
                                </Title>
                                <Caption style={[styles.statusCaption, status_color['RJ']] } >
                                    {item.totalHours}hr - {moment(item.startDate).diff(moment(item.endDate), 'days')} days
                                </Caption>
                            </ColView>
                            <Title style={styles.projectText}>{item.projectName}</Title>
                            <Paragraph style={styles.notesText}>{item.notes}</Paragraph>
                        </Card.Content>
                    </View>
                </ColView>
            </Card>
        )
    }

    const fabAction = () =>{
        // console.log(true)
        if (longPressed) {
          let dateIndex = null;
          let copyTimesheet = longPressed.map((el, index) => {
            if (el.title === items.title) {
              dateIndex = index;
              el.data = el.data.filter(fel => {
                if (!Object.keys(selected).includes(`${fel.id}`)) {
                  return fel;
                }
              });
            }
            return el;
          });
        //   setTimesheet(copyTimesheet);
        //   setItems(copyTimesheet[dateIndex]);
        //   setLongPress(false);
        //   setSelected({});
        } else {
          setOpenModal(!openModal);
        }
      }
    return (
        <View style={{flex: 1}}>
            <ColView style={styles.header}>
                <Title style={styles.headerTitle}>Leave</Title>
            </ColView>
            <LeaveBalance leave_balnce={leave_request_balance}/>
            <View style={{flex: 1}}>
                <Subheading style={{paddingLeft:10, color: 'grey'}}>Leave Request</Subheading>
                <VirtualizedList
                  data={Leave_Request}
                  renderItem={renderItem}
                  initialNumToRender={4}
                  getItemCount={()=>Leave_Request.length}
                  keyExtractor={(item, index)=> index}
                  getItem={(data, index)=>(Leave_Request[index])}
                  onRefresh={onRefresh}
                  refreshing={fetching}
                />
            </View>
            {openModal && (
                <LeaveRequestModal
                modalVisible={openModal}
                // selectedDate={sDate}
                // onSuccess={onSuccess}
                //  data=
                onClose={() => setOpenModal(false)}
                />
            )}
            <FAB
                style={styles.fab(longPressed)}
                placement="right"
                // icon={longPressed ? 'delete' : 'add'}
                icon={longPressed ? 'delete' : 'plus'}
                size="large"
                onPress={fabAction}
                // color={longPressed ? 'red' : 'green'}
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
  card: {
    borderRadius: 10,
    margin: 10,
    padding: 10,
    // height: 120
  },
  dateView: {width: 75, alignItems: 'center', justifyContent: 'center'},
  dateCard: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 15,
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
    borderRadius: 5,
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