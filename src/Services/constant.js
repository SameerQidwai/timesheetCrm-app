import { StyleSheet } from "react-native"
import moment from "moment";
import { MMKV } from 'react-native-mmkv'
export const storage = new MMKV()

// export const Api = "http://localhost:3301/api/v1";
// export const Api = "http://192.168.10.12:3301/api/v1"; // Me
export const Api = "http://54.91.49.138:8000/api/v1"; //Test 

export const status_background = StyleSheet.create({
    'AP': {backgroundColor :'#f6ffed' },
    'RJ': {backgroundColor :'#ffeded' },
    'SB': {backgroundColor :'#edf5ff' },
    'SV': {backgroundColor :'#f5f5f5' },
})

export const status_color = StyleSheet.create({
    'AP': { color: '#5da647' },
    'RJ': { color: '#a64747' },
    // 'RJ': { color: '#cf1322' },
    'SB': { color: '#476ba6' },
    'SV': { color: '#000' },
})


export const status_border = StyleSheet.create({
  'AP': { borderColor: '#b7eb8f', borderWidth: 1, borderRadius: 3, paddingHorizontal: 3 },
  'RJ': { borderColor: '#ffa39e', borderWidth: 1, borderRadius: 3, paddingHorizontal: 3 },
  'SB': { borderColor: '#8fb2eb', borderWidth: 1, borderRadius: 3, paddingHorizontal: 3 },
  // 'SV': { borderColor: '#c4c4c4', borderWidth: 1, borderRadius: 3, paddingHorizontal: 3 },
})


export const status_name = {
  'AP': 'Approved',
  'RJ': 'Rejected',
  'SB': 'Submitted',
  'SV': ' '
}

export const formatFloat = (number) => {
  return !isNaN(parseFloat(number)) ? parseFloat(number).toFixed(2) : '0.00';
};

export const formatDate = (date, initialString, format)=>{
  if (initialString){
    if (format){
      return moment.parseZone(date, initialString).format(format === true ? 'yyyy-MM-DD' : format )
    }
    return moment.parseZone(date, initialString)
  }else{
    if (format){
      return moment.parseZone(date).format(format === true ? 'yyyy-MM-DD' : format)
    }
    return moment.parseZone(date)
  }
}

export const headers = (token) => {
  return {
    'content-type': 'application/json',
    Authorization: `${token}`,
  };
};

export const sorting = (data, key) => {
  let sortData = data.sort((a, b) =>
    (a?.[key]?.toLowerCase() ?? '').localeCompare(b?.[key]?.toLowerCase() ?? '')
  );
  return sortData;
};

export const thumbUrl = (type) => {
  if (type === 'pdf') {
    return require('../../assets/icons/pdf.png');
  } else if (type === 'doc' || type === 'docx') {
    return require('../../assets/icons/doc.png');
  } else if (type === 'xls' || type === 'xlsx') {
    return require('../../assets/icons/xls.png');
  } else if (type === 'ppt' || type === 'pptx') {
    return require('../../assets/icons/ppt.png');
  } else if (type === 'csv') {
    return require('../../assets/icons/csv.png');
  } else if (/(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i.test(type)) {
    return require('../../assets/icons/img.png');
  } else {
    return require('../../assets/icons/default.png');
  }
};

export function checkToken(message, token){
  return message === 'Authentication Expired or Invalid'
    ? undefined
    : token?.authorization;
}