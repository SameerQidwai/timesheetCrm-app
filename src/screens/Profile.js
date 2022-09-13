import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Appbar, Button, Headline, IconButton, Title, Text, Subheading } from 'react-native-paper'
import { colors } from '../components/Common/theme'
import { AppContext } from '../context/AppContext'
import { getEmployee } from '../services/profile-api'

const Profile = () => {
  const [profile, setProfile] = useState({})
  const {appStorage, setAppStorage} = useContext(AppContext)
  
  useEffect(() => {
    getProfile()
  }, [])
  

  const getProfile = async() =>{
    const {id, accessToken} = appStorage
    const {success, data, basic, setToken } = await getEmployee(id, accessToken)
    if (success){
      setProfile(basic)
      setAppStorage(prev=> ({...prev, accessToken: setToken}))
    }else{
      setProfile({})
    }
  }

  return (
    <View style={{flex:1}}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title={'Profile'} />
      </Appbar.Header>
        <View style={styles.iconView}>
          <IconButton icon="account-circle" size={100} color={colors['primary']} animated onPress={()=>console.log('me')}/>
          <Headline>{profile['firstName'] + profile['lastName']}</Headline>
          <Subheading>{profile['username']}</Subheading>
        <Button
            mode={"contained"}
            color={colors['danger']}
            compact
            style={{width: '45%', borderRadius: 2}}
            labelStyle={{color: '#fff'}}
            onPress={()=> setAppStorage({})}>
            Sign Out
          </Button>
        </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  header:{
    flexDirection: 'row',
    backgroundColor: colors['primary'],
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  headerTitle: {
    color: '#fff'
  },
  iconView: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'center',
    height: 300
  }
})