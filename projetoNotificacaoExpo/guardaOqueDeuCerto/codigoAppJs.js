// Importações necessárias do React Native e do Expo
import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Configura o tratamento de notificações recebidas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Componente principal do aplicativo
export default function App() {
  // Estados para armazenar o token do Expo, notificação recebida e listeners

    // Estado para armazenar o token de notificação do Expo
    const [expoPushToken, setExpoPushToken] = useState('');

    // Estado para controlar o status da notificação recebida
    const [notification, setNotification] = useState(false);

    // Referência para o listener de notificações recebidas
    const notificationListener = useRef();

    // Referência para o listener de respostas a notificações recebidas
    const responseListener = useRef();


  // Efeito para lidar com as notificações
  useEffect(() => {
    // Registra o dispositivo para receber notificações
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // Adiciona um listener para notificações recebidas
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Adiciona um listener para respostas a notificações recebidas
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    // Remove os listeners quando o componente é desmontado
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Renderização do componente
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {/* Mostra o título, corpo e dados da notificação recebida */}
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      {/* Botão para agendar uma notificação */}
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
}

// Função para agendar uma notificação
async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Ola gitano aqui estao suas notificaçoes 📬",
      body: 'Samuel Aqui desenvolvendo o seu codigo de notigicaçoes',
      data: { data: 'Segunda feira' },
    },
    trigger: { seconds: 2 }, // Dispara a notificação após 2 segundos
  });
}

// Função para registrar o dispositivo para receber notificações
async function registerForPushNotificationsAsync() {
  let token;

  // Configuração do canal de notificação para Android
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
      alert('Failed to get push token for push notification!');
      return;
    }
    // Obtém o token de notificação do Expo
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }
  
  return token;
}
