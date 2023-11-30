/*Exemplo de como usar a biblioteca react-native-beacons-manager para detectar e se conectar a um beacon*/
import React, { useState } from 'react';
import BeaconsManager from 'react-native-beacons-manager';

const App = () => {
  // Inicializa o estado do beacon como nulo
  const [beacon, setBeacon] = useState(null);

  // Função para escanear os beacons
  const scanForBeacons = () => {
    // Inicia a busca por beacons
    BeaconsManager.start();
  };

  // Função chamada quando um dispositivo é encontrado
  const onDeviceFound = (device) => {
    // Atualiza o estado do beacon com o dispositivo encontrado
    setBeacon(device);
  };

  // Função para conectar ao beacon
  const connectToBeacon = () => {
    // Verifica se há um beacon disponível
    if (!beacon) {
      return; // Se não houver beacon, a função para aqui
    }

    // Conecta ao beacon
    beacon.connect();
  };

  return (
    <View>
      {/* Botão para iniciar a varredura de beacons */}
      <Button title="Scan for Beacons" onPress={scanForBeacons} />
      {/* Botão para conectar ao beacon, aparece somente se um beacon for encontrado */}
      {beacon && (
        <Button title="Connect to Beacon" onPress={connectToBeacon} />
      )}
    </View>
  );
};


