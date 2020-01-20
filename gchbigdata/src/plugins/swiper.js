// import something here
import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'
 
// require styles
import 'swiper/dist/css/swiper.css'
// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.use(VueAwesomeSwiper, /* { default global options } */)
}
