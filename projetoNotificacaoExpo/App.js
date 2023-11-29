// Importações de bibliotecas necessárias do React Native e Expo
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import BeaconsManager from 'react-native-beacons-manager';

// Configuração do manipulador de notificações para o aplicativo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Mostrar alerta quando uma notificação for recebida
    shouldPlaySound: false, // Não reproduzir som ao receber uma notificação
    shouldSetBadge: false, // Não modificar o contador de notificações no ícone do aplicativo
  }),
});

export default function App() {
  // Estados para armazenar informações do aplicativo, notificações e beacon
  const [expoPushToken, setExpoPushToken] = useState(''); // Estado para armazenar o token de notificação
  const [notification, setNotification] = useState(false); // Estado para controlar o status da notificação recebida
  const notificationListener = useRef(); // Referência para o listener de notificações recebidas
  const responseListener = useRef(); // Referência para o listener de respostas a notificações recebidas
  const [beacon, setBeacon] = useState(null); // Estado para armazenar informações do beacon encontrado

  // Função para iniciar a varredura de beacons
  const scanForBeacons = () => {
    BeaconsManager.start();

    
    // Comece a escanear
    BeaconsManager.startRangingBeaconsInRegion('REGION_ID')
      .then(() => console.log('Beacons ranging started succesfully'))
      .catch(error => console.log(`Beacons ranging not started, error: ${error}`));
  };

  // Função chamada quando um dispositivo beacon é encontrado
  const onDeviceFound = (device) => {
    setBeacon(device);
  };

  const connectToBeacon = () => {
    if (!beacon) {
      return;
    }
  
    // Conecte-se ao beacon aqui. A implementação exata pode depender
    // do seu beacon específico e da biblioteca que você está usando.
    beacon.connect()
      .then(() => console.log('Connected to beacon succesfully'))
      .catch(error => console.log(`Failed to connect to beacon, error: ${error}`));
  };



  // Efeito que executa ao montar o componente para registrar e gerenciar notificações
  useEffect(() => {
    // Registra o dispositivo para receber notificações e atualiza o token no estado
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // Adiciona um listener para notificações recebidas e atualiza o estado com a notificação
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Adiciona um listener para respostas a notificações recebidas e imprime no console
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    // Remove os listeners quando o componente é desmontado para evitar vazamentos de memória
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Renderização do componente
  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
    }}>
      {/* Exibe o token de notificação */}
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {/* Exibe os detalhes da notificação recebida se houver */}
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      {/* Botão para agendar uma notificação */}
      <Button
        title="Pressione para agendar uma notificação"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
      {/* Botão para iniciar a varredura de beacons, aparece sempre */}
      <Button title="Procure por Beacons" onPress={scanForBeacons} />
      {/* Botão para conectar ao beacon encontrado, aparece se um beacon for encontrado */}
      {beacon && (
        <Button title="Conecte-se ao farol" onPress={connectToBeacon} />
      )}
    </View>
  );
}

// Função assíncrona para agendar uma notificação
async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Ola gitano aqui estão suas notificações 📬",
      body: 'Samuel Aqui desenvolvendo o seu código de notificações',
      data: { data: 'Segunda feira' },
    },
    trigger: { seconds: 2 }, // Dispara a notificação após 2 segundos
  });
}

// Função assíncrona para registrar o dispositivo para receber notificações
async function registerForPushNotificationsAsync() {
  let token;

  // Configuração do canal de notificação para Android, se for o sistema operacional atual
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Verifica se o dispositivo é válido para receber notificações
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Falha na notificação!');
      return;
    }
    // Obtém o token de notificação do Expo
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
    console.log(token);
  } else {
    alert('Deve usar dispositivo físico para notificações push');
  }

  return token;
}
