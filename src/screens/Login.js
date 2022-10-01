import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Image, ImageBackground, StyleSheet, View, Platform, StatusBar, KeyboardAvoidingView  } from 'react-native'
import { Button, Card, Headline, Snackbar, TextInput } from 'react-native-paper'
import { colors } from '../components/Common/theme'
import { AppContext } from '../context/AppContext'
import { storage } from '../services/constant'
import { loginApi } from '../services/login-api'

function Login() {
  // mustafa.syed@1lm.com.au
  const [formData, setFormData] = useState({email: '', password: ''})
    const [snack, setSnack] = useState({
        visible: false,
        duration: 3000,
        label: 'Wrong Usernam or Password.',
        wrapperStyle:{backgroundColor: colors['danger']}
    })
    const [eye, setEye]= useState(true)
    const {setAppStorage} = useContext(AppContext)

    const signIn = async() =>{
        let {success, data} = await loginApi(formData)
        if (success){
            setAppStorage(data)
            storage.set('data', JSON.stringify(data))
        }else{
            setSnack(prev =>({...prev, visible: true}))
        }
    }

  return (
    <Fragment>
        <StatusBar barStyle="light-content" />
      <View style={styles.loginView}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View>
          <Card elevation={10} mode="elevated" style={styles.loginCard}>
            <View>
              <Image
                style={styles.logo}
                source={require('../../assets/images/Z-logo.png')}
              />
            </View>
            <Card.Content style={{paddingVertical: 15}}>
              <TextInput
                mode="outlined"
                label={'Username'}
                value={formData['email']}
                placeholder={'Enter Your Username'}
                onChangeText={text =>
                  setFormData(prev => ({...prev, email: text}))
                }
                activeOutlineColor={colors['light']}
              />
              <TextInput
                mode="outlined"
                label={'Password'}
                value={formData['password']}
                placeholder={'Enter Your Passwrod'}
                style={{marginVertical: 15}}
                // keyboardType='visible-password'
                secureTextEntry={eye}
                activeOutlineColor={colors['light']}
                right={
                  <TextInput.Icon
                    name={eye ? 'eye-off' : 'eye'}
                    onPress={() => setEye(!eye)}
                  />
                }
                onChangeText={text =>
                  setFormData(prev => ({...prev, password: text}))
                }
              />
            </Card.Content>
            <Card.Actions
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <Button 
                mode="contained" 
                onPress={signIn}
                color={colors['primary']}
                style={{width: '50%'}}
              >
                Sign In
              </Button>
            </Card.Actions>
          </Card>
        </View>
        </KeyboardAvoidingView>
        <Snackbar
          visible={snack['visible']}
          duration={snack['duration']}
          style={snack['wrapperStyle']}
          onDismiss={() => setSnack(prev => ({...prev, visible: false}))}>
          {snack['label']}
        </Snackbar>
      </View>
    </Fragment>
  );
}

export default Login

const styles = StyleSheet.create({
    loginView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: colors['display'],
    },
    loginCard: {
        width: 300, 
        height: 300
    },
    logo: {
        width:200, 
        height: 50,
        alignSelf: 'center'
    }
});