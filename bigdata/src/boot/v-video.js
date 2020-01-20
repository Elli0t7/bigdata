import Vue from 'vue'
import VueVideoPlayer from 'vue-video-player'
 
// require videojs style
import 'video.js/dist/video-js.css'
// import 'vue-video-player/src/custom-theme.css'
 


// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  // something to do
  Vue.use(VueVideoPlayer, /* {
    options: global default options,
    events: global videojs events
  } */)
}


