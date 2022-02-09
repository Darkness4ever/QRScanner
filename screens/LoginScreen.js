import React, {useState} from 'react'
import {StyleSheet,SafeAreaView ,Text, View, Button, TouchableOpacity, TextInput, ActivityIndicator,Image} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import $api from '../api'
import axios from 'axios'


const Login = ({navigation}) => {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleUserName = (val) => {
        setUserName(val)
    }
    const handlePassword = (val) => {
        setPassword(val)
    }

    const handleLogin  = () => {
        // navigation.navigate('Home')
        // $api.authenticateUser({userName,password}).then(response => {console.log('Resp : ', response)})
        if(userName === '') {
            setIsError(true)
            setErrorMessage('Please enter username!')
            return
        }
        if(password === '') {
            setIsError(true)
            setErrorMessage('Please enter password!')
            return
        }
        setIsError(false)
        setIsLoading(true)
        $api.authenticateUser({ userName, password }).then(response => {
            // if (response.data.error.key !== 0) {
            //   console.log("Error")
            //   setErrorMessage(response.data.error.value)
            //   setInvalidFlag(true);
              
            // sessionStorage.setItem("entityId", response.data.entity.entityId);
            // AsyncStorage.setItem("entityId", response.data.entity.personId);
            // AsyncStorage.setItem('fName', response.data.entity.fName);
            
            console.log('error Code : ', response.data.error.key)

            if(response.data.error.key !== 0 ) {
                setIsError(true)
                setErrorMessage('Invalid Credentials!')
                return
            }
            
            const personId = response.data.entity.personId;
            const fName = response.data.entity.fName
            console.log('fName', fName)
            console.log('PID : ', personId)
            navigation.navigate('Home', {
                personId,
                fName
            })

            // return
            // setLoader(false)
            
          
        //   }
        })
          .catch(err => {
            console.log(err)
          }).finally(() => {
            setIsLoading(false)
            
          })
      
      
    }


    
    return (
        // <SafeAreaView>
        <LinearGradient colors={['#e4e4e7', '#27272a']} style={{ flex: 1 }}> 
            <View style = {styles.container}>
                {/* <Button title = 'Temp ' onPress = {() =>  navigation.navigate('Home')} /> */}
                <View style={{marginTop : 100, alignItems : 'center'}}>
                    <Image 
                        style = {{width : 200, height :  200}}
                        source = {require('../assets/logo1.png')}
                    />
                </View>

                {/* <View style={{marginTop :  20, alignItems : 'center', borderWidth : 1}}>
                    <Image 
                        style = {{width :  200, height :  200}}
                        source = {require('../assets/logo2.png')}
                        resizeMode = 'center'
                    />
                </View> */}

                
                {isError && (
                    <View style = {{alignItems : 'center'}}>
                        <Text style={{fontSize : 20, color : 'red', margin : 5}}>{errorMessage}</Text>
                    </View>
                )}
                <View style={styles.inputContainer}> 
                    <TextInput style = {styles.input} value = {userName} onChangeText={handleUserName} placeholder='Enter username' maxLength={30} />
                    <TextInput style = {styles.input} value = {password} onChangeText={handlePassword} placeholder='Enter password' maxLength = {30}/>

                </View>
                
                {/* <View style = {styles.submitContainer}> */}
                
                {isLoading && (
                    <View>
                        <ActivityIndicator size = 'large' color = 'white'/>
                    </View>
                )}

                {!isLoading && (
                    <TouchableOpacity
                    style = {{marginTop : '10%', backgroundColor: '#50C2C9', borderRadius : 20, marginHorizontal : '5%' , alignItems : 'center'}}
                    onPress = {handleLogin}
                    disabled = {isLoading}
                  >
                    <Text style = {{fontSize : 25, margin: 5}}> Login</Text>
                </TouchableOpacity>
                )}
                {/* </View> */}
            </View>
        </LinearGradient>
        // </SafeAreaView>


    )

}

const styles = StyleSheet.create({
    container : {
        flex : 1,
 
    },
    inputContainer : {
        marginTop : 50,
        marginHorizontal : '5%',
        // borderWidth :  1,
        // borderColor :  'red',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor : 'white',
        borderColor : '#50C2C9',
        borderRadius : 20,
        alignSelf : 'stretch'
      },
    submitContainer : {
        borderWidth : 1,
        
    }  
})

export default Login