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