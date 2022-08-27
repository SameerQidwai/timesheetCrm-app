import React, { useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Headline, Title } from 'react-native-paper'
import { AppContext } from '../context/AppContext'

const Profile = () => {
  const {appStorage, setAppStorage} = useContext(AppContext)
  return (
    <View style={{flex:1}}>
      <View style={styles.header}>
          <Title style={styles.headerTitle}>Profile</Title>
      </View>
        <View>
          <Headline>Welcome {appStorage['email']}</Headline>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Button onPress={()=> setAppStorage({})}>Sign Out</Button>
        </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    backgroundColor: '#f8a587',
    alignItems: 'baseline',
    height: 48
  },
  headerTitle: {
    color: '#fff'
  },
})