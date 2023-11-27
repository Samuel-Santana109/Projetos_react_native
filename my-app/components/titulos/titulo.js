import React from "react";
import { View, Text } from "react-native";
import style from './style'

export function Titulos(){
    return(
        <View style={style.boxTitle}>
            <Text style={style.textTitle}>Testando novo conteudo</Text>
        </View>
    );
}