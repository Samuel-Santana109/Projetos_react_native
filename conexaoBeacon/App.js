import React, { useEffect } from 'react';
import { View, Text, PermissionsAndroid, StatusBar } from 'react-native';
import Beacons from 'react-native-beacons-manager';
import { DeviceEventEmitter } from 'react-native';

export default function App() {
  // Solicitar permissões de Bluetooth ao iniciar o componente
  useEffect(() => {
    async function requestPermissions() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
        );

        if (granted) {
          console.log('Permissões de Bluetooth concedidas');
        } else {
          console.error('Permissões de Bluetooth negadas');
        }
      } catch (error) {
        console.error(error);
      }
    }

    requestPermissions();

    // Inicializa a detecção de iBeacons e define um ouvinte para detectá-los
    async function startBeaconDetection() {
      // Informa à biblioteca para detectar iBeacons
      Beacons.detectIBeacons();

      try {
        // Tenta iniciar a detecção de iBeacons na região 'REGION1'
        await Beacons.startRangingBeaconsInRegion('REGION1');
        console.log(`Beacons ranging started successfully!`);
      } catch (err) {
        // Se houver um erro ao iniciar a detecção, exibe uma mensagem de erro
        console.log(`Beacons ranging not started, error: ${err}`);
      }

      // Registra um ouvinte de eventos para os iBeacons detectados
      DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
        // Quando iBeacons são detectados, exibe-os no console
        console.log('ITens conecdos!', data.beacons);
      });
    }

    startBeaconDetection();

    // Limpa os listeners quando o componente é desmontado
    return () => {
      DeviceEventEmitter.removeAllListeners('beaconsDidRange');
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>React Native Beacons Manager</Text>
      <StatusBar style="auto" />
    </View>
  );
}
