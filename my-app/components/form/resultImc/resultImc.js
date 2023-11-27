import React from "react";
import { View, Text } from "react-native";


export function ResultImc(props){
    return(
        <View>
            <Text>{props.textResposta}</Text>
           <Text>{props.ResultadotImc}</Text>
        </View>
    );
}