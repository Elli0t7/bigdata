import axios from 'axios'
import qs from 'qs'
import { Notify } from 'quasar'
import { LocalStorage, SessionStorage } from 'quasar'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
const service=axios.create({
  method:'GET',
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 30000, // request timeout
  transformRequest: [function (data) {
    // 对 data 进行任意转换处理    
    return qs.stringify(data);
  }],

})

export default ({ app, router, store, Vue }) => {
  
 // request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (LocalStorage.getItem('token')) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['token'] = LocalStorage.getItem('token')

    }
    if(config.method=='post'){ 
      config.data = { 
          ...config.data, 
          _t: Date.parse(new Date())/1000, 
      } 
  }else if(config.method=='get'){ 
      config.params = { 
          _t: Date.parse(new Date())/1000, 
          ...config.params 
      } 
  } 
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(  
  response => {
     
    if(response.headers['content-type']=='text/html; charset=UTF-8'){
         return response.data
     }else{
      const res = response.data      
      if (res.code !== 200) {       
        if (res.code === 50008 || res.code === 50012 || res.code === 50014) { 
          LocalStorage.remove('token')         
        }
        return Promise.reject(res)
      } else {
        return response.data
      }
     }
   
    
    
  },
  error => {
    console.log('err' + error) // for debug   
    return Promise.reject(error)
  }
)
  Vue.prototype.$axios = service
}


