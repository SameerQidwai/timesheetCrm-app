import React, { useContext, useEffect, useState } from 'react'
import { Alert, Image, StyleSheet, View, Dimensions, Pressable} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker, { types } from 'react-native-document-picker';
import { TextField } from '../Common/InputFields';
import { Button, Caption, Dialog, IconButton, Modal, Portal, Text, TouchableRipple } from 'react-native-paper';
import { Api, thumbUrl } from '../../services/constant';
import { colors } from '../Common/theme';
import { addAttachment } from '../../services/attachment-api';
import { AppContext } from '../../context/AppContext';
import { addTimesheetNote } from '../../services/timesheet-api';
import { checkPermission } from '../Common/DownloadFile';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const TimesheetAttachment = ({ fileModelEvent, setFileModelEvent, onSuccess }) => {
  let disable = ['SB', 'AP'].includes(fileModelEvent['status'])
  const { appStorage, setAppStrorage } = useContext(AppContext);
    const [formState, setFormState] = useState({
        values: {
          file: '',
          note: '',
          isDocType: false
        }
    });
  
  // for check attachment already attach or not
  useEffect(() => {
    const {id,originalName,type, uniqueName} = fileModelEvent?.attachment?.file ?? {};
    
    let newObj = id ? {
      fileId: id,
      name: originalName,
      type: type,
      uri: `${Api}/files/${uniqueName}`
    } : false;
    
    setFormState(formState => ({
      ...formState,
      values: {
        file: newObj,
        note: fileModelEvent?.notes,
        isDocType: fileModelEvent?.attachment?.type === 'jpg' ? false : true
      },
    }));
  }, [fileModelEvent]);

  
  
    const [showFullSize, setShowFullSize] = useState(false);
    
    const selectDocument = async () => {
        const response = await DocumentPicker.pickSingle({
          presentationStyle: 'fullScreen',
          type: [types.allFiles],
        });
      handleUplaod("document", response);
        
    };
    
    const askFromWhereToPickImage = () => {
        Alert.alert(
          'Select image from',
          '',
          [
            { text: 'Gallery', onPress: () => pickImage('GALLERY') },
            { text: 'Camera', onPress: () => pickImage('CAMERA') },
          ],
          { cancelable: true },
        );
    };

    const pickImage = async location => {
      console.log("location-->", location);
     
      if (location === 'GALLERY') {
        ImagePicker.openPicker({
          multiple: false,
          mediaType: 'photo',
          // cropping: true
        })
          .then(image => {
            handleUplaod("image", image);  
            })
            .catch(e => console.log('error->', e.message));
      } else if (location === 'CAMERA') {
        ImagePicker.openCamera({
          multiple: false,
          mediaType: 'photo',
          // cropping: true
        })
          .then(image => {
            handleUplaod("image", image);
          }) 
          .catch(e => console.log('error->', e.message));
      }
    };

  const handleUplaod = (name, file) => {
    
    let newObj = {};
    if (name === "document") {
      newObj = file;
    } else if (name === "image") {
      let name = file.path.split('/');
      newObj = { name: name[name.length - 1], type: file.mime, uri: file.path, size: file.size };
    }

    let imageData = new FormData();
    imageData.append('files', newObj);
    
    addAttachment(imageData, appStorage.accessToken).then((res) => {
      if (res.success) {
        setFormState(formState => ({
          ...formState,
          values: {
            ...formState.values,
              fileId: res.file.fileId,
              ["file"]: res.file,
              isDocType: name === "document"
          },
        }));        
      }
    })

  
  };

  const onSubmit = () => {
    
    let data = {
      note: formState.values.note,
      attachments: formState.values.fileId ? [formState.values.fileId] : [],
      milestoneEntryIds: [fileModelEvent.milestoneEntryId],
    };
    addTimesheetNote(fileModelEvent, data, appStorage.accessToken).then((res) =>{
      if (res.success) {
        onSuccess();
      }
    }  
    )
  }
  
    const changeInputHandler = (name, val) => {
        setFormState(formState => ({
          ...formState,
          values: {
            ...formState.values,
            [name]: val,
          },
        }));
    };
   
  const deleteFileEvent = () => {
      // Linking.openURL(url);  
      setFormState(formState => ({
            ...formState,
            values: {
              ...formState.values,
                ['fileId']: false,
                ['file']: false,
              isDocType: false
            },
          }));
    };
    
    const iconRenderer = (file) => {
    let url = thumbUrl(file.type);
      return <>
          <View style={{display:"flex", justifyContent:"space-between", flexDirection:"row", alignItems:"center",borderWidth:1, borderColor:"#909090", borderStyle:"dotted", backgroundColor:"#fafafa", height:74}}>
          <Pressable onPress={()=> checkPermission(file.uri)}>
          <View style={{ justifyContent: "flex-start", flexDirection: "row", alignItems: "center" }} >
            {console.log("file",file.uri)}    
            <Image source={url} style={{ width: 34, height: 34, marginLeft: 5 }} />
                <Text style={{marginLeft:5}}>{file.name}</Text>
          </View>
          </Pressable>    
          <View>
                <IconButton
                        icon={"delete-outline"}
                        disabled={disable}
                        color={colors.danger}
                        size={25}
                        onPress={deleteFileEvent} >
                            delete
                </IconButton>
              </View>
          </View>
      </>
    };
    
  const onDismiss = () => {
    setFileModelEvent(false); setFormState({
      values: {
        file: '',
        note: '',
        isDocType: false
      }
    })
  };
  
  return (
      <>
        <Dialog visible={fileModelEvent} style={styles.modalView} onDismiss={onDismiss}>
          <Dialog.Content style={{ paddingVertical: 10, paddingHorizontal: 20}}>
                <Text style={{ fontSize: 18, color: "black" }}>Add Attachment & Notes</Text>
            {!formState.values.file ?
              <>
                <View style={{ display: "flex", justifyContent:"space-evenly", alignItems:"center", flexDirection: "row", marginTop:10, borderWidth:1, borderColor:"#909090", borderStyle:"dotted", backgroundColor:"#fafafa"}}>
                <View >
                  <IconButton icon={"file-outline"}
                      color={colors.primary}
                      size={25}
                    onPress={selectDocument} />
                  <Text style={{fontSize: 12, color: 'rgba(0,0,0,0.54)', marginVertical: 2, letterSpacing: 0.45}}>Document</Text>
                </View>  
                <View >
                  <IconButton icon={"image-outline"}
                    color={colors.primary}
                    size={25}
                    onPress={askFromWhereToPickImage}/>
                  <Text style={{fontSize: 12, color: 'rgba(0,0,0,0.54)', marginVertical: 2, letterSpacing: 0.45}}>Image</Text>
                </View>
                                      
              </View>
              
              </>
            : <>
                {!formState.values.isDocType ?
                    <>     
                        <View style={{display:"flex", justifyContent:"space-between", flexDirection:"row", alignItems:"center",borderWidth:1, borderColor:"#909090", borderStyle:"dotted", backgroundColor:"#fafafa", height:74}}>
                          <TouchableRipple onPress={() => setShowFullSize(true)} >
                            <View style={{justifyContent:"flex-start", flexDirection:"row", alignItems:"center", paddingLeft:5}}>  
                          <Image source={{ uri: formState.values?.file?.uri, width:54, height:54}} />              
                        <Text style={{ marginLeft: 5 }}>hello</Text>
                            </View>
                          </TouchableRipple>
                            <View>
                                <IconButton
                                    icon={"delete-outline"}
                                    disabled={disable}
                                    color={colors.danger}
                                    size={25}
                                    onPress={deleteFileEvent} >
                                        delete
                                </IconButton>
                            </View>
                        </View>
                    </>          
                    :    
                      iconRenderer(formState.values?.file)
                }
              </>
              }
            <View style={{marginTop:20}}>
            <TextField textarea placeholder={"Enter Some Notes"} label={"Notes"} onChangeText={(text) => { changeInputHandler('note', text) }} value={formState.values?.note || ''} />
            </View>
            <Dialog.Actions style={styles.actionView}>
            <Button
              mode={'contained'}
              color={colors['light']}
              compact
              style={{width: '45%', borderRadius: 2}}
              labelStyle={{color: '#fff'}}
              onPress={onDismiss}>
                Cancel
            </Button>
            <Button
              mode={'contained'}
              color={colors['primary']}
              disabled={disable}
              compact
              labelStyle={{color: '#fff'}}
              style={{ width: '45%', borderRadius: 2 }}
            onPress={onSubmit}>
              Save
            </Button>
            </Dialog.Actions>
          </Dialog.Content>
          
      </Dialog>
      <Portal>
        <Modal visible={showFullSize} style={styles.modalView} onDismiss={() => { setShowFullSize(false) }}>
        <TouchableRipple
          style={styles.downloadIcon}
          >
            <IconButton icon={"download-outline"}
              color={"white"}
              size={30}
              onPress={() => { checkPermission(formState.values?.file?.uri) }} />      
        </TouchableRipple>
        <TouchableRipple
          style={styles.closeButton}>
          <IconButton icon={"close"}
            color={"white"}
            size={25}
            onPress={()=> setShowFullSize(false)}/>      
        </TouchableRipple>
          <View style={{ borderRadius: 10, width: windowWidth, height: windowHeight }}>
                <Image source={{uri: formState.values?.file?.uri, width: windowWidth, height: windowHeight}} />              
            </View>
        </Modal>
      </Portal>
      </>
  )
}

export default TimesheetAttachment

const styles = StyleSheet.create({
    // css added by shahbaz 
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
  actionView: {
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  downloadIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 1,
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "red",
    width: 30,
    height: 30,
    borderRadius: 50,
    position: 'absolute',
    top: 20,
    right: 10,
    zIndex: 1,
  },
})