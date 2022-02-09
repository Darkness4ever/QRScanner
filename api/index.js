import axios from "axios";


const authenticateUser = ({ userName, password }) =>{

//   axios({
//     url: "http://eventapp.azurewebsites.net//api/person/ValidateAndGetPerson/",
//     method: "post",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       "smart-client-key": "AYDPTLBWSK3MVQJSIYGB1OR2JXCY01C5UJ2QAR2MAAIT5Q",
//       "Authorization": "Basic c2hhbjphZG1pbg==",
//     },
//     data: {
//       username :  userName,
//       oldPassword: password,
//       portalId: 2,
//     },
//   });

    return axios.post("http://eventapp.azurewebsites.net//api/person/ValidateAndGetPerson/", 
    {
        username : userName,
        oldPassword: password,
        portalId:2
    },{
        headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  "smart-client-key": "AYDPTLBWSK3MVQJSIYGB1OR2JXCY01C5UJ2QAR2MAAIT5Q",
                  "Authorization": "Basic c2hhbjphZG1pbg==",
                },  
    }
    )
}

const getDetails = (personId) => {
    // console.log('personId : ', personId)
    return axios.get(`http://eventapp.azurewebsites.net//api/person/GetVendorEvents/${personId}/2`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "smart-client-key": "AYDPTLBWSK3MVQJSIYGB1OR2JXCY01C5UJ2QAR2MAAIT5Q",
            "Authorization": "Basic c2hhbjphZG1pbg==",
          },  
    })
}

const addTagTransaction = (payload) => {
    console.log('payload', payload)

    return axios.post('http://eventapp.azurewebsites.net//api/item/AddTagTransaction', payload, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "smart-client-key": "AYDPTLBWSK3MVQJSIYGB1OR2JXCY01C5UJ2QAR2MAAIT5Q",
            "Authorization": "Basic c2hhbjphZG1pbg==",
          },  
    })
}


export default {
    authenticateUser,
    getDetails,
    addTagTransaction
}