/**
 * 网络请求工具类，所有网络请求通过该类实现
 */
 import axios from 'axios'

//  axios.defaults.baseURL = 'http://127.0.0.1:8080'
 
 export default class Requester {
     static requestJSON(request, withAuth, onSuccessCallback, onErrorCallback) {
         if (withAuth === true) {
             request.headers = {};
             var token = Requester.getAuthToken();
             if (token == null) {
                 onErrorCallback("NO_TOKEN_AVAILABLE");
             }
             request.headers['Authorization'] = token;
         }
 
         axios(request).then(
             (response) => {
                 if (response.status !== 200) {
                     // 处理错误情况
                     alert("The request get status : " + response.status);
                 }
                 else {
                     onSuccessCallback(response)
                 }
             }).catch(onErrorCallback);
     }
 }