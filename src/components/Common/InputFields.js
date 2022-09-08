import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInput } from 'react-native-paper'

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
      style={styles.textInput}
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
      setItems(data)
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
      <DropDownPicker
        open={open}
        value={select}
        items={items}
        setOpen={opening}
        setValue={setSelect}
        setItems={setItems}
        listMode="SCROLLVIEW"
        zIndex={zIndex??2000}
        zIndexInverse={zIndexInverse??2000}
        searchable={true}
        schema={schema} // required
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
      />
    </View>
  )
}

const styles = StyleSheet.create({
    textInput: {marginVertical: 2}
})