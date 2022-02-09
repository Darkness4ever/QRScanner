import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen'
import Login from './screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack  = createNativeStackNavigator()

export default function App() {
  return (
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
    // <HomeScreen />

    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen  name = "Login" component ={Login} options = {{headerShown : false}}/>
        <Stack.Screen name = "Home" component = {HomeScreen} options = {{headerShown : false}} />
      </Stack.Navigator>
    </NavigationContainer>

    // <Temp/>

    
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
