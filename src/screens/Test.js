import React from "react";
import { ScrollView, View } from "react-native";
import { Card, Text } from "react-native-paper";

const Test = () =>{
    return (
        <ScrollView>
            <Card 
                style={{margin: 10,  borderRadius: 10,  }} 
                elevation={10} mode="elevated"
            >
                <Card.Content>
                    <Text>Project</Text>
                </Card.Content>
            </Card>
        </ScrollView>   
    )
}

export default Test