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


//select UnSelect 
{<View style={{justifyContent:'flex-end', flexDirection: 'row', marginHorizontal: 10}}>
    {!longPressed ?<Button
        compact
        uppercase={false}
        labelStyle={{marginVertical:2, marginHorizontal: 2}}
        onPress={()=>setLongPress(true)}
      >
        Select
      </Button>
    :
      <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
        <Button 
          compact
          uppercase={false}
          labelStyle={{marginVertical:2, marginHorizontal: 2}}
          onPress={()=>setLongPress(false)}
        >
          Unselect
        </Button>
        {/* <Button 
          compact
          uppercase={false}
          
          labelStyle={{marginVertical:2}}
        >
          Select All
        </Button> */}
      </View>
    }
  </View>}

// BackGound Imag
{
<ImageBackground 
            source={require('../../assets/images/Z-avatar.png')} 
            resizeMode="contain" 
            style={ {
                flex: 1,
                justifyContent: "center"
            }}
></ImageBackground>
}


//WeeklyTimeSheet Flat List
{<View style={styles.pageView}>
  <FlatList
    data={timesheets?.['data']?.['milestones'] ?? []}
    // data={projects_timesheet?? []}
    renderItem={renderItem}
    keyExtractor={(item, index) => index}
    extraData={selected}
    onRefresh={getData}
    refreshing={fetching}
    ListEmptyComponent={<NoRecords waiting={fetching} />}
    ListHeaderComponent={
      timesheets?.['data']?.['milestones']?.length > 0 && (
        <View
          style={{
            justifyContent: 'flex-end',
            flexDirection: 'row',
            marginHorizontal: 10,
            marginTop: 7,
          }}>
          {!longPressed ? (
            <Button
              mode="outlined"
              compact
              uppercase={false}
              color="#1890ff"
              labelStyle={{
                marginVertical: 2,
                marginHorizontal: 5,
                fontWeight: 'normal',
              }}
              onPress={() => setLongPress(true)}>
              Select
            </Button>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <Button
                mode="outlined"
                compact
                uppercase={false}
                color="#1890ff"
                labelStyle={{
                  marginVertical: 2,
                  marginHorizontal: 5,
                  fontWeight: 'normal',
                }}
                onPress={onSelectAll}>
                Select All
              </Button>
              <Button
                mode="outlined"
                compact
                uppercase={false}
                color="#1890ff"
                labelStyle={{
                  marginVertical: 2,
                  marginHorizontal: 5,
                  fontWeight: 'normal',
                }}
                onPress={onUnselectAll}>
                Cancel
              </Button>
            </View>
          )}
        </View>
      )
    }
  />
</View>;}

//ModalDropDownFlatList
{<Portal>
  <Modal visible={open} onDismiss={()=>opening(!open)}   >
  <TextInput
    mode={"outlined"}
    label={"Search Item"}
    placeholder={"Type to Search"}
    dense
    activeOutlineColor="#909090"
    onChangeText={searchingText}
    right={<TextInput.Icon 
        disabled={disabled}
        name="search"  
    />}
  />
    <FlatList
      data={items ?? []}
      renderItem={renderListItem}
      keyExtractor={(item, index) => index}
      extraData={select}
      // onRefresh={getData}
      // refreshing={fetching}
      style={{marginTop: 10}}
    />
  </Modal>
</Portal>}