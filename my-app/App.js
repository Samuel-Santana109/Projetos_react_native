import { StyleSheet,  View } from 'react-native';
import { Titulos } from './components/titulos/titulo';
import { Form } from './components/form/form';
 

export default function App() {
  return (
    <View style={styles.container}>
      <Titulos />
       <Form />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0e5',
    paddingTop: 80,
  },
});

//Sempre usar o ctrl + s para fazer o salvamento automatico
