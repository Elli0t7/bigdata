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
      isFullScreen:false,
      //接口刷新频率，单位ms
      frequency: 60000,      
    },
    getters: {
      
     
    },
    mutations: {
      setToken(state, token) {
        state.token = token
        SessionStorage.set('token', token)
      },
      setPlatform(state, platform) {        
        state.platform = platform
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
