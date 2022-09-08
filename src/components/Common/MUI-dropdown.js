import React, { useEffect, useState } from 'react'
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInput } from 'react-native-paper';

const MDropDown =({value, data, placeholder, onSelect, inputStyle, label, zIndex, zIndexInverse,dense ,schema, disabled}) =>{
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
                mode="outlined"
                label={label}
                dense={dense}
                activeOutlineColor="#909090"
                placeholder={placeholder}
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

export default MDropDown
