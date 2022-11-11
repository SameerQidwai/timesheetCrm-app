import React, { useContext, useState,useEffect } from 'react'
import { ImageBackground, StyleSheet, View } from 'react-native'
import { Appbar, Button, HelperText, IconButton, Text, Title } from 'react-native-paper'
import { TextField } from '../components/Common/InputFields'
import { colors } from '../components/Common/theme'
import { AppContext } from '../context/AppContext'
import { DomainName, getLocalStorage, storage } from '../services/constant'

const AfterSplashScreen = () => {

    const {appStorage, setAppStorage} = useContext(AppContext)

    useEffect(() => {
      console.log(getLocalStorage())
    
    }, [])
    

    const [formState, setFormState] = useState({
          domain: '',
          isPress: false
        });
    
    // console.log("formState", formState.domain)

    const onInputText = (name, val) => {
        formState.isPress = true
        setFormState(formState => ({
            ...formState,
            [name]: val
        }))
    }
    
    const hasError = () => {
        // console.log("formState.isPress", formState.isPress);
        if (formState.isPress) {
            return !formState.domain ?? true  
        } else {
            return false
        }
    }

    const onsubmit = () => {
        if (DomainName[formState?.domain]) {
            let stored = { domain: formState?.domain }
            console.log(formState?.domain)
            setAppStorage(stored)
            storage.set('data', JSON.stringify(stored))
        } else {
            console.error("domain not found");
        }
    }

    return (
        <View style={styles.pageView}>
            {/* <ImageBackground source={require('../../assets/images/Z-avatar.png')} resizeMode="stretch" style={styles.backgroundImage}/> */}
            <View style={styles.centerView}>
                {/* <View style={{ flex: 4, justifyContent: "flex-end" }}> */}
                <View style={{ flex: 4, justifyContent: "space-between" }}>
                    {/* <View style={{flex:4, justifyContent: "center"}}>
                    <ImageBackground source={require('../../assets/images/Z-avatar.png')} resizeMode="center" style={styles.backgroundImage} />
                    </View> */}
                    <View style={{flex:2, justifyContent: "flex-end"}}>
                    <Title>Enter Your Domain</Title>
                    <TextField
                    value={formState?.domain}
                    disabled={false}
                    label="Domain"
                    placeholder="Enter Note.."
                    onChangeText={text=>onInputText('domain',text)}
                    returnKeyType="next"
                    />
                        {
                        hasError() ? <HelperText type="error" visible={console.log(hasError())}>
                        Domain is Required
                    </HelperText> : null
                    }  
                    </View>
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>    
                {/* <Button
                    mode="contained"
                    icon="arrow-right-box"     
                    uppercase={false}
                    raised
                    color={colors['primary']}
                    style={{width:140}}
                    contentStyle={{flexDirection: 'row-reverse'}}
                    onPress={() => console.log("dc")}>
                    Next
                </Button> */}
                {/* <Button
                    mode="contained"
                    icon="arrow-right-circle"     
                    uppercase={false}
                    raised
                    color={colors['primary']}
                    style={{width:140}}
                    contentStyle={{flexDirection: 'row-reverse'}}
                    onPress={() => console.log("dc")}>
                    Next
                </Button> */}
                {/* <Button
                    mode="contained"
                    icon="chevron-triple-right"     
                    uppercase={false}
                    raised
                    color={colors['primary']}
                    style={{width:140}}
                    contentStyle={{flexDirection: 'row-reverse'}}
                    onPress={() => console.log("dc")}>
                    Next
                </Button> */}
                <Button
                    mode="contained"
                    // icon="arrow-right-thin"
                    icon="arrow-right-thin-circle-outline"
                    uppercase={false}
                    raised
                    color={colors['primary']}
                        style={{ width: 140 }}
                        labelStyle={{fontSize:18}}
                        // labelStyle={{fontSize:18}}
                    contentStyle={{flexDirection: 'row-reverse'}}
                    onPress={onsubmit}>
                    Next
                </Button>
                {/* <IconButton
                    icon={'arrow-right-thin-circle-outline'}
                    color={colors.primary}
                    size={45}
                    onPress={{}}>
                    Next
                 </IconButton>     */}
                {/* <IconButton
                    icon={'arrow-right-thick'}
                    color={colors.primary}
                    size={45}
                    onPress={{}}>
                    Next
                 </IconButton>     */}
                </View>
                <View style={{ flex: 3, justifyContent:"flex-end" }}>
                    <ImageBackground source={require('../../assets/images/Z-logo.png')} resizeMode="center" style={styles.backgroundImage} />
                </View>
            </View>
        </View>
    )
}

export default AfterSplashScreen

const styles = StyleSheet.create({
    pageView: {
        flex: 1,
        backgroundColor: colors['display'],
    },

    centerView: {
        flex: 1,
        width: "80%",
        alignSelf:"center"
        // justifyContent: "center",
        // flexDirection:"row",
        // alignItems: "center",
        // alignSelf:"center"

    },

    inputField: {
        width:"100%"
    },

    backgroundImage:{
        width: 200,
        height: 150,
        // position: "absolute",
        position: "relative",
        alignSelf:"center"
      }
})