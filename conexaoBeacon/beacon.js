import { DeviceEventEmitter } from 'react-native'
import Beacons from 'react-native-beacons-manager'

// Informa à biblioteca para detectar iBeacons
Beacons.detectIBeacons()

// Inicia a detecção de todos os iBeacons próximos
try {
  // Tenta iniciar a detecção de iBeacons na região 'REGION1'
  await Beacons.startRangingBeaconsInRegion('REGION1')
  console.log(`Beacons ranging started successfully!`)
} catch (err) {
  // Se houver um erro ao iniciar a detecção, exibe uma mensagem de erro
  console.log(`Beacons ranging not started, error: ${err}`)
}

// Registra um ouvinte de eventos para os iBeacons detectados
DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
  // Quando iBeacons são detectados, exibe-os no console
  console.log('Found beacons!', data.beacons)
})
