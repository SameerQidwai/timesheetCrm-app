import React, { useContext, useState } from 'react'
import { Image, ImageBackground, View } from 'react-native'
import { Button, Card, Headline, Snackbar, TextInput } from 'react-native-paper'
import { AppContext } from '../context/AppContext'
import { loginApi } from '../services/login-api'

function Login() {
    const [formData, setFormData] = useState({email: 'mustafa.syed@1lm.com.au', password: 'Rauf20'})
    const [snack, setSnack] = useState({
        visible: false,
        duration: 3000,
        label: 'Wrong Usernam or Password.',
        wrapperStyle:{backgroundColor: 'red'}
    })
    const [eye, setEye]= useState(true)
    const {setAppStorage} = useContext(AppContext)

    const signIn = async() =>{
        let {success, data} = await loginApi(formData)
        if (success){
            setAppStorage(data)
        }else{
            setSnack(prev =>({...prev, visible: true}))
        }
    }

  return (
    <View style={{flex:1,justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <ImageBackground 
            source={require('../../assets/images/Z-avatar.png')} 
            resizeMode="contain" 
            style={ {
                flex: 1,
                justifyContent: "center"
            }}
        >
    <View>
        <Card
            elevation={10} 
            mode="elevated"
            style={{width: 300}}
        >
            <View>
            <Image
                style={{width:200, height: 50}}
                source={require('../../assets/images/Z-logo.png')} 
            />
            </View>
            <Card.Content>
                <TextInput
                    mode="outlined"
                    label={'Username'}
                    value={formData['email']}
                    placeholder={'Enter Your Username'}
                    onChangeText={(text)=>setFormData(prev=> ({...prev, email:text}))}
                />
                <TextInput
                    mode="outlined"
                    label={'Password'}
                    value={formData['password']}
                    placeholder={'Enter Your Passwrod'}
                    // keyboardType='visible-password'
                    secureTextEntry={eye}
                    right={<TextInput.Icon name={eye? 'eye-off': 'eye'} onPress={()=>setEye(!eye)}/>}
                    onChangeText={(text)=>setFormData(prev=> ({...prev, password:text}))}
                />
            </Card.Content>
            <Card.Actions style={{justifyContent: 'center', alignItems: 'center'}}>
                <Button mode='contained' onPress={signIn}>Sign In</Button>
            </Card.Actions>
        </Card>
      </View>
      </ImageBackground>
      <Snackbar
        visible={snack['visible']}
        duration={snack['duration']}
        style={snack['wrapperStyle']}
        onDismiss={()=>setSnack(prev =>({...prev, visible: false}))}
      >
        {snack['label']}
      </Snackbar>
    </View>
  );
}

export default Login