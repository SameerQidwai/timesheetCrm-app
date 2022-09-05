// Monthly Timesheet Header
<View style={styles.containerView}>
    <View>
        <Pressable 
            android_ripple={{color: '#f47749', borderless: true}}
            onPressOut={() => setDateTime(!dateTime)}>
            <Title>
                {sDate.format('MMM YYYY')}
            <IconButton
                icon="chevron-down"
                color="black"
                size={24}
                style={{ width: 28, height: 20, }}
            />
            </Title>
        </Pressable>
    </View>
    <View style={{justifyContent: 'center'}}>
        <View>
            <Caption>Total Hours</Caption>
        </View>
        <View>
            <Title style={{lineHeight: 22, textAlign: 'center'}}>{formatFloat(timesheets?.['total'])}</Title>
        </View>
    </View>
</View>

//Monthly Date Component
{dateTime && (
    <DateTimePicker
    mode={'date'}
    value={formatDate(sDate).toDate()}
    onChange={(event, dateValue) => {
        setDateTime(false)
        if (event?.type === 'set' && dateValue){
            setDate(formatDate(dateValue));
        }
    }}
    />
)}
//Monthly Header
{<View style={styles.containerView}>
<View>
  <IconButton 
    icon="arrow-left" 
    color="black"
    onPress={()=>navigation.navigate('Timesheet')} 
  />
</View>
<View>
  <Pressable 
    android_ripple={{color: '#f8a587', borderless: true}}
    onPressOut={() => setdateTime(!dateTime)}>
    <Title>
      {sDate.format('MMM YYYY')}
      <IconButton
        icon="chevron-down"
        color="black"
        size={24}
        style={{ width: 28, height: 20, }}
      />
    </Title>
  </Pressable>
</View>
<View>
  <View>
    <Caption>Total Hours</Caption>
  </View>
  <View>
    <Title style={{lineHeight: 22}}>{formatFloat(timesheet['total'])}</Title>
  </View>
</View>
</View> 
}

//Weekly Picker...
{<DateTimePicker
    mode={'date'}
    value={formatDate(sDate).toDate()}
    onChange={(event, dateValue) => {
    setdateTime(false)
    if (event?.type === 'set' && dateValue){
        setDate(formatDate(dateValue));
    }
    }}
/>}