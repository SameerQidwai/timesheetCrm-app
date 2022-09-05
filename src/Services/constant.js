import { StyleSheet } from "react-native"
import moment from "moment";
// export const Api = "http://localhost:3301/api/v1";
// export const Api = "http://192.168.10.12:3301/api/v1"; // Me
export const Api = "http://54.91.49.138:8000/api/v1"; //Test 


export const status_color = StyleSheet.create({
    'AP': {backgroundColor :'#f6ffed', borderColor: '#b7eb8f', borderWidth: 0, color: '#5da647' },
    'RJ': {backgroundColor :'#ffeded', borderColor: '#eb8f8f', borderWidth: 0, color: '#a64747' },
    'SB': {backgroundColor :'#edf5ff', borderColor: '#8fb2eb', borderWidth: 0, color: '#476ba6' },
    'SV': {backgroundColor :'#f5f5f5', borderColor: '#c4c4c4', borderWidth: 0, color: '#c4c4c4' },
})

export const status_name = {
  'AP': 'Approved',
  'RJ': 'Rejected',
  'SB': 'Submitted',
  'SV': 'Submitted'
}

export const formatFloat = (number) => {
  return !isNaN(parseFloat(number)) ? parseFloat(number).toFixed(2) : '0.00';
};

export const oldFormatDate = (date, string, format) => {
  return (
    date && // check if date is not null or undefined
    (string // check if request is for string date or object
      ? format // check if format is given
        ? moment.utc(date).format(format === true ? 'ddd DD MMM yyyy' : format)
        : // check if format is true return default format or prop format
          moment(date).utcOffset(0, true).format()
      : moment.utc(date))
  );
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

export const testingformatDate = (date, initialString, format)=>{
  
  function func (date, initialString){
    moment.parseZone(date, initialString)
  }
  function func (date, initialString, format){

  }
  function func (date, format){
    return moment.parseZone(date).format(format)
  }
  function func (date, initialString, format){
    moment.parseZone(date, initialString).format(format)
  }
}

export const offsetDate = (datetime, initialFormat, returnFormat) =>{
  return (returnFormat ?
    moment(datetime, initialFormat).utcOffset(0, true).format(returnFormat)
    :
    moment(datetime, initialFormat).utcOffset(0, true)
  )
}

export const utcDate = (datetime, initialFormat, returnFormat) =>{
  return (returnFormat ?
    moment.utc(datetime, initialFormat).format(returnFormat)
    :
    moment.utc(datetime, initialFormat)
  )
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