import React, { useEffect } from 'react';
import { View, Text, PermissionsAndroid, StatusBar } from 'react-native';
import Beacons from 'react-native-beacons-manager';

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
  }, []);

  // Inicializar a detecção de beacons ao montar o componente
  useEffect(() => {
    Beacons.initialize();

    // Monitorar a detecção de beacons
    Beacons.on('beaconsDetected', (beacons) => {
      console.log('Beacons detectados:', beacons);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>React Native Beacons Manager</Text>
      <StatusBar style="auto" />
    </View>
  );
}
