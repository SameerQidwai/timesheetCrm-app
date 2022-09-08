export const colors ={
    primary: '#1890ff',
    success: '#4caf50',
    danger: '#ff4d4f',
    display: '#f6f4f1',
    light: '#909090',
    primaryCondition: (state, key)=>(
        key ? 
            state === key ? 'white' : '#1890ff'
        :
            state ? 'white' : '#1890ff'
    )
}