import React, { useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';
import { Beacons } from 'react-native-beacons-manager';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {

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

  useEffect(() => {
    Beacons.initialize();

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

  // return (
  //   <View style={styles.container}>
  //     <Text>Open up App.js to start working on your app!</Text>
  //     <StatusBar style="auto" />
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
