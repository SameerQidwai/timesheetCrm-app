import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, Dimensions, KeyboardAvoidingView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { IconButton, Modal, Portal, Text, TextInput, TouchableRipple } from 'react-native-paper'

const windowHeight = Dimensions.get('window').height;

export const TextField = ({value, disable, mode, label, placeholder, textarea, outlineColor, onChangeText, onFocus, onPressOut, showSoftInputOnFocus, returnKeyType, keyboardType, style}) => {
  return (
    <TextInput
      value={value}
      mode={mode ?? "outlined"}
      label={label}
      placeholder={placeholder}
      multiline={textarea?? false}
      numberOfLines={textarea && 4}
      dense
      disabled={disable}
      activeOutlineColor={outlineColor?? "#909090"}
      onChangeText={text => onChangeText(text)}
      returnKeyType={returnKeyType}
      onFocus={onFocus}
      onPressOut={onPressOut}
      showSoftInputOnFocus={showSoftInputOnFocus}
      keyboardType={keyboardType}
      style={[styles.textInput, style]}
    />
  )
}

export const MDropDown =({value, data, mode, placeholder, onSelect, inputStyle, label, zIndex, zIndexInverse,dense ,schema, disabled}) =>{
  schema = schema?? { label: 'label',  value: 'value'}
  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(value);
  const [items, setItems] = useState(data);
  const [valueLabel, setValueLabel] = useState(null);

  useEffect(() => {
      setValueLabel((data??[]).find(el => el[schema['value']] === value )?.[schema['label']])
      setSelect(value)
      // setItems(data)
  }, [data, value])
  
  const opening = (open) =>{
      if (items.length >0){
          setOpen(open)
      }
  }

  return (
    <View>
      <TextInput
        value={valueLabel}
        mode={mode ?? "outlined"}
        label={label}
        placeholder={placeholder}
        dense
        activeOutlineColor="#909090"
        disabled={disabled}
        showSoftInputOnFocus={false}
        onPressIn={()=>opening(!open)}
        // onPressOut={()=>opening(false)}
        right={<TextInput.Icon 
            disabled={disabled}
            name="close"  
            forceTextInputFocus={false}
            onPress={()=>{setSelect(null);setValueLabel(null);opening(!open)}}
        />}
      />
      <Portal>
      <Modal 
        visible={open} 
        onDismiss={()=>opening(!false)}
      >
      <DropDownPicker
        open={open}
        value={select}
        items={items}
        setOpen={opening}
        setValue={setSelect}
        setItems={setItems}
        listMode="MODAL"
        zIndex={zIndex?? 2000}
        zIndexInverse={zIndexInverse??2000}
        searchable={true}
        schema={schema} // required
        disabledItemLabelStyle={{
            opacity: 0.5
        }}
        modalProps={{
          animationType: "slide",
          transparent: true,
          presentationStyle: 'overFullScreen'
        }}
        modalContentContainerStyle={{
          backgroundColor: "#fff",
        }}
        style={[{
            borderColor: open ? '#6200ee':  '#717171',
            borderRadius: 2,
            display: 'none'
        },inputStyle]}
        placeholderStyle={{
            color: "#969696",
        }}
        onSelectItem={(item)=> {
            setValueLabel(item[schema['label']])
            onSelect(item)
        }}
      />
      </Modal>
      </Portal>
    </View>
  )
}

export const ModalDropDown = ({value, data, mode, placeholder, onSelect, inputStyle, label, zIndex, zIndexInverse,dense ,schema, disabled})=> {
  schema = schema?? { label: 'label',  value: 'value'}
  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(value);
  const [items, setItems] = useState(data);
  const [valueLabel, setValueLabel] = useState(null);

  useEffect(() => {
      setValueLabel((data??[]).find(el => el[schema['value']] === value )?.[schema['label']])
      setSelect(value)
  }, [data, value])
  
  const opening = (open) =>{
    // console.log(data, open, '->', items, items.length)
      // if (items.length >0){
        setItems(data)
          setOpen(open)
      // }
  }

  // const searchingText = (text) =>{
  //   console.log(text)
  // }

  // const onPressItem = (item, index) =>{
  //   console.log(item[schema['label']], index, press)
  //   // setValueLabel(item[schema['label']])
  //   // onSelect(item)
  // }

  // const renderListItem = (item, index) =>{
  //   return <TouchableRipple 
  //       onPress={()=> onPressItem(item, index) }
  //       rippleColor={"rgba(0, 0, 0, .12)"}
  //     >
  //       <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
  //         <Text>{item[schema['label']]}</Text>
  //         {item[schema['value']] === select[schema['value']] && <IconButton
  //           icon="check"
  //           // color="white"
  //         />}
  //       </View>
  //     </TouchableRipple>
  // }

  return (
    <View>
      <TextInput
        value={valueLabel}
        mode={mode ?? "outlined"}
        label={label}
        placeholder={placeholder}
        dense
        activeOutlineColor="#909090"
        disabled={disabled}
        showSoftInputOnFocus={false}
        onPressIn={()=>opening(!open)}
        // onPressOut={()=>opening(false)}
        right={<TextInput.Icon 
            disabled={disabled}
            name="close"  
            forceTextInputFocus={false}
            onPress={()=>{setSelect(null);setValueLabel(null);opening(!open)}}
        />}
      />
      <Portal>
        <Modal visible={open} onDismiss={()=>opening(!open)}  style={{flex: 1}}>
        <DropDownPicker
          open={open}
          value={select}
          items={items}
          setOpen={opening}
          setValue={setSelect}
          setItems={setItems}
          listMode="FLATLIST"
          zIndex={zIndex?? 2000}
          zIndexInverse={zIndexInverse??2000}
          searchable={true}
          schema={schema} // required
          autoScroll={true}
          scrollViewProps={{
              decelerationRate: "fast"
          }}
          disabledItemLabelStyle={{
              opacity: 0.5
          }}
          modalProps={{
              animationType: "slide"
          }}
          style={[{
              borderColor: open ? '#6200ee':  '#717171',
              borderRadius: 2,
              display: 'none'
          },inputStyle]}
          placeholderStyle={{
              color: "#969696",
          }}
          onSelectItem={(item)=> {
              setValueLabel(item[schema['label']])
              onSelect(item)
          }}
          containerStyle={{
            flex: 1
          }}
        />
        </Modal>
      </Portal>
    </View>
  )
}

const styles = StyleSheet.create({
    textInput: {marginVertical: 2}
})