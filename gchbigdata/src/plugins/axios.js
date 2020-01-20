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
    if (LocalStorage.get.item('token')) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['token'] = LocalStorage.get.item('token')

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
  // response => response.data,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
     
    if(response.headers['content-type']=='text/html; charset=UTF-8'){
         return response.data
     }else{
      const res = response.data      
      if (res.code !== 200) {
        //Notify.create({icon:'fas fa-exclamation-triangle',message:res.msg})
        // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
        if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  
  
          LocalStorage.remove('token')
          // 请自行在引入 MessageBox
          // import { Message, MessageBox } from 'element-ui'
          // MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          //   confirmButtonText: '重新登录',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // }).then(() => {
          //   store.dispatch('FedLogOut').then(() => {
          //     location.reload() // 为了重新实例化vue-router对象 避免bug
          //   })
          // })
        }
        return Promise.reject(res)
      } else {
        return response.data
      }
     }
   
    
    
  },
  error => {
    console.log('err' + error) // for debug
    //Notify.create({icon:'fas fa-exclamation-triangle',message:error.message})
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)
  Vue.prototype.$axios = service
}


