import Vue from 'vue'
import VueRouter from 'vue-router'
import { LocalStorage, SessionStorage } from 'quasar'
import routes from './routes'
import Vuex from 'vuex'

Vue.use(VueRouter)
Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function ( /* { store, ssrContext } */ ) {
  const Router = new VueRouter({
    scrollBehavior: () => ({
      y: 0
    }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })
  
  Router.beforeEach((to, from, next) => {
   // console.log(store)
  //  console.log(Router.app.$store)
    if (to.meta.auth) { //是否验证
      
      if (SessionStorage.get.item('token')==200) { //是否登录
        
        next()
      } else { //未登录则跳转到登录页面
        next({
          name: 'login',
          query: {
            redirect: to.fullPath
          }
        })
      }
    } else {
      next()
    }

  })

  return Router
}
