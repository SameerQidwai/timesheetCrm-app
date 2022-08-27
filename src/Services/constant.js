import { StyleSheet } from "react-native"

// export const Api = "http://localhost:3301/api/v1";
export const Api = "http://54.91.49.138:8000/api/v1"; //Test 


export const status_color = StyleSheet.create({
    'AP': {backgroundColor :'#f6ffed', borderColor: '#b7eb8f', borderWidth: 1, color: '#5da647' },
    'RJ': {backgroundColor :'#ffeded', borderColor: '#eb8f8f', borderWidth: 1, color: '#a64747' },
    'SB': {backgroundColor :'#edf5ff', borderColor: '#8fb2eb', borderWidth: 1, color: '#476ba6' },
    'SV': {backgroundColor :'#f5f5f5', borderColor: '#c4c4c4', borderWidth: 1, color: '#c4c4c4' },
})

export const status_name = {
  'AP': 'Approved',
  'RJ': 'Rejected',
  'SB': 'Submitted'
}

export const headers = (token) => {
    return {
      'content-type': 'application/json',
      Authorization: `${token}`,
    };
  };
