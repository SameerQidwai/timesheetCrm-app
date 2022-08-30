import React, { useEffect, useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker';

const DropDown =({value, data, placeholder, onSelect, inputStyle}) =>{
    const [open, setOpen] = useState(false);
    const [select, setSelect] = useState(value ?? null);
    const [items, setItems] = useState(data);

    useEffect(() => {
      setItems(data)
    }, [data])
    

    return (
        <DropDownPicker
            open={open}
            value={select}
            placeholder={open? '' : placeholder}
            items={items}
            setOpen={setOpen}
            setValue={setSelect}
            setItems={setItems}
            listMode="SCROLLVIEW"
            searchable={true}
            scrollViewProps={{
                decelerationRate: "fast"
            }}
            modalProps={{
                animationType: "slide"
            }}
            style={[{
                borderColor: open ? '#6200ee':  '#717171',
                borderRadius: 5,
            },inputStyle]}
            placeholderStyle={{
                color: "#969696",
            }}
            onSelectItem={onSelect}
        />
    )
}

export default DropDown
