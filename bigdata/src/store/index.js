import Vue from 'vue'
import Vuex from 'vuex'
import {
  LocalStorage,
  SessionStorage
} from 'quasar'


//import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function ( /* { ssrContext } */ ) {
  const Store = new Vuex.Store({

    state: {
      //用户token
      token: '',
      //当前平台
      platform: {},
      platforms: [],
      selectServer:{},
      isFullScreen:false,
      //接口刷新频率，单位ms
      frequency: 60000,      
      custMap:'',
    },
    getters: {
      
     
    },
    mutations: {
      setSelectServer(state,server){
        state.selectServer=server
      },
      setToken(state, token) {
        state.token = token
        SessionStorage.set('token', token)
      },
      setPlatform(state, _platform) { 
               
        state.platform = _platform
        if(_platform.id=='10001'){
          state.custMap='statics/images/gch_map.png'
        }
        if(_platform.id=='10002'){
          state.custMap='statics/images/yx_map.png'
        }
        if(_platform.id=='10003'){
          state.custMap='statics/images/yzs_map.png'
        }
        // console.log(platform)

      },
      setPlatforms(state, platforms) {        
        state.platforms = platforms
        
        SessionStorage.set('platforms', JSON.stringify(platforms))
        // console.log(platform)

      },
      setFullScreen(state,isfull){
        state.isFullScreen=isfull
        console.log(state.isFullScreen)
      },
      

     



    }

    // modules: {
    //   example
    // }
  })

  return Store
}
