import React, {useState, useEffect, useRef} from 'react'
import {StyleSheet, Text, View, Button, TouchableOpacity, Alert, ActivityIndicator, Platform} from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { LinearGradient } from 'expo-linear-gradient';
import $api from '../api'
import { Camera } from 'expo-camera';



const Home = ({route,navigation}) => {

    const [hasPermissions, setHasPermissions] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Not yet Scanned');
    const [showScanner, setShowScanner] = useState(false);
    const [personName, setPersonName] = useState(route.params.fName || '')
    const [eventID, setEventID] = useState(null);
    const [readPointId, setReadPointId] = useState(null);
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [title, setTitle] = useState('')
    const [isResultVisible, setIsResultVisible] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [cameraRef, setCameraRef] = useState(null)


    const cameraReference = useRef(null)

    

    const askForCameraPermission = () => {
         (async () => {
          if(Platform.OS === 'web') {
            setHasPermissions('true')
          }else {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
              console.log(status == 'granted')
              setHasPermissions(status == 'granted')
          }
              
         })() 
    }

    // //Request Camera Permission
    useEffect(() =>  {
        
        askForCameraPermission(); 
        console.log('PID2',route.params.personId)
        $api.getDetails(route.params.personId).then(resp => {
            setEventID(resp.data.entity[0].eventId)
            setReadPointId(resp.data.entity[0].readPoints[0].readPointId)
        })
    },[])

    // useEffect(()=> {
    //   console.log('Inside')
    //   $api.getDetails(navigation.getParam('personId')).then(resp => console.log(resp))
    // },[])


    //handle scanned code
    const handleBarCodeScanned = ({type,data }) => {
        setName('')
        setTitle('')
        setCompany('')
        setScanned(true);
        setIsLoading(true)
        setIsResultVisible('true')
        setText(data);
        const payload = {
          itemId : eventID,
          portalId : 2,
          readpointId: readPointId,
          entityId : null,
          tagNumber : data,
          IsOverride: false,
          itemInstanceId : null,
          transactionType : 'TRTP002',
          isDuplicateTransactionAllowed : false,
          points : 0,
          isverify : true
        }
        console.log('p : ', payload)
        $api.addTagTransaction(payload).then(resp => {
          let errorCode = resp.data.error.key
          if(errorCode == 0 || errorCode == 34) {
            console.log('temp : ', resp.data.entity)
            setIsError(false)
            let Name = resp.data.entity.fName + ' ' +  resp.data.entity.lName
            setName(Name)
            resp.data.entity.personAttributes.forEach(entry => {
              if(entry.attributeName === 'Company')
              setCompany(entry.attributeValue)
              if(entry.attributeName === 'Title')
              setTitle(entry.attributeValue)
            })
          }
          else {
            setIsError(true)
            Alert.alert('User Not registered')
            console.log('User is not registered')
          }
        })
        setShowScanner(false)
        setIsLoading(false)
        // console.log('Type : ' + type + '\nData : ' +  data)
    }
 
    //Check Permissions and return screens
    
    if (hasPermissions === null) {
      return (
        <View style ={styles.container}> 
            <Text>Requesting for camera permissions</Text>
        </View>
      )
    }

    if(hasPermissions === false ) {
      return(
        <View style ={styles.container}> 
        <Text style = {{margin : 10}}>No access to camera</Text>
        <Button title = {'Allow Camera'} onPress = { () => askForCameraPermission()} />
    </View>
      )
    }

    
    //Return View 
    // return (
    //     <View style={styles.container}>
           

    //      {!showScanner && (
    //        <Button title = {'Scan QR Code'} onPress={() => setShowScanner(true)}/>
    //      )}

    //      {showScanner && (
    //        <> 
    //          <View style={styles.barcodebox}>
    //           <BarCodeScanner onBarCodeScanned = {scanned ? undefined : handleBarCodeScanned} style = {{height : 400, width : 400}} />
    //       </View>
    //       <Text style = {styles.maintext}>{text} </Text>

    //       {scanned && <Button title={'Scan again?'} onPress = {() => setScanned(false)} />}
    //        </>
    //      )} 
         
    //     </View>
    //   );

            return (
            <LinearGradient colors={['#b1b1b5', '#000000']} style={{ flex: 1 }}>
                    <View style={{
                        backgroundColor: '#50C2C9',
                        height: '25%',
                        borderBottomLeftRadius: 50,
                        borderBottomRightRadius: 50,
                        paddingHorizontal: 20,
                        opacity: 0.7
                    }}>
                      <View style = {styles.header}>
                          <Text style = {styles.maintext}>{`Hello ${personName} !`}</Text>
                      </View>
                    </View>

                    <View style = {styles.lowerbox}>
                    
                      <TouchableOpacity
                        style = {{marginTop : '10%', backgroundColor: '#50C2C9', borderRadius : 20 }}
                        onPress = {() => setShowScanner(true)}
                      >
                        <Text style = {{fontSize : 30, margin: 5}}> Scan QR Code</Text>
                      </TouchableOpacity>
                     

                  {showScanner && (
                   <> 
                 <View style={styles.barcodebox}>
                      {/* <BarCodeScanner onBarCodeScanned = {scanned ? undefined : handleBarCodeScanned} style = {{height : 400, width : 400}} /> */}
                        <Camera 
                          style={StyleSheet.absoluteFillObject}
                          ref={(ref) => {
                            setCameraRef(ref)
                          }}
                          onBarCodeScanned = {handleBarCodeScanned}
                          zoom = {0.2}
                          barCodeScannerSettings={{
                            barCodeTypes : [BarCodeScanner.Constants.BarCodeType.qr]
                          }} 
                        />
                </View>
                  </>
                 )} 

                  {isLoading && (
                    <View>
                        <ActivityIndicator size = 'large' color = 'white'/>
                    </View>
                  )}

                 {!showScanner && isResultVisible && !isError && !isLoading &&(
                   <View style = {styles.resultContainer}>
                      <Text style = {styles.resultInput}>Welcome</Text>
                      <Text style = {styles.resultInput}>{name}</Text>
                      {/* {title && <Text style = {styles.resultInput}>{`${title} `}</Text>}
                      <Text style = {styles.resultInput}>{company}</Text> */}
                      {title === '' ? 
                      <Text style={styles.resultInput}>{company}</Text>  :
                      
                        <Text style={styles.resultInput}>{`${title}, ${company}`}</Text>
                      
                    }
                   </View>
                 )}

                 {/* {!showScanner && isResultVisible &&} */}
                    </View>
                </LinearGradient>

    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    barcodebox : {
      marginTop : '10%',
      backgroundColor : '#fff',
      alignItems : 'center',
      justifyContent : 'center',
      height : 300,
      width : 300,
      overflow :  'hidden',
      borderRadius : 30,
      // backgroundColor : 'tomato '
    },
    maintext : {
      fontSize : 50,
      marginTop : '20%',
      marginLeft: '10%',
      textAlign : 'center',
      alignSelf : 'stretch',
      color : 'white'
    },
    header : {
      margin : 5,
      width :  '90%',
      alignItems : 'center'
    },
    lowerbox : {
      flex : 1,
      alignItems : 'center',
      // justifyContent : 'center',
      marginHorizontal : 10,
      // borderWidth : 1,
      // borderColor : 'red'
    },
    button : {
      borderRadius :  20
    },
    resultContainer : {
      margin : 60,
      flex :1,
      // borderWidth : 1,
      width : '80%',
      alignItems : 'center',
      justifyContent : 'center'
    },
    resultInput : {
      marginVertical : 10,
      color : 'white',
      fontSize : 30,
      fontWeight : '900',
      alignSelf :'center'
    }
  });



export default Home

