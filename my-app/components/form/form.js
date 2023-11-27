import React, { useState } from "react";
import { TextInput, Text, View, Button } from "react-native";
import { ResultImc } from "./resultImc/resultImc";

export function Form(){

    //Recebe por padrao null
    const [altura, novaAltura] = useState(null)
    const [peso, novoPeso] = useState(null)
    const [mensagemErro, novamensagemErro ] = useState('Preencha os campos')
    const [imc, novoImc] = useState(null)
    const [textButton, novoTextButton] = useState("Calcular Imc")
    const [textResposta, novaTextResposta ] = useState(null)

    function imcCalculo(){
        return novoImc((peso/(altura*altura)).toFixed(2))
    }

    function validationImc(){
        if( peso != null && altura != null){
            imcCalculo()
            novaAltura(null)
            novoPeso(null)
            novaTextResposta("Seu imc é igual")
            novoTextButton("Calcular Novamente")
            return
        } else {
            novoImc(null)
            novamensagemErro("Preencha o peso e altura")
            novoTextButton("Caluclar")
        }
    }

    return(
        <View>
            <View>
                <Text>Altura</Text>
                <TextInput
                onChangeText={novaAltura}
                value={altura}
                placeholder="Ex, 1.75"
                keyboardAppearance="numeric"
                />
                <Text>Peso</Text>
                <TextInput
                onChangeText={novoPeso}
                value={peso}
                placeholder="Ex, 75.365"
                keyboardAppearance="numeric"
                />
                <Button
                onPress={() => validationImc()}
                 title={textButton}
                 />
            </View>
             <ResultImc 
             textResposta={textResposta} 
             ResultadotImc={imc}
             />
        </View>
    );
}