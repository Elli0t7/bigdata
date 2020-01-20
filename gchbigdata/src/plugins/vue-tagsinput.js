// import something here
import Vue from 'vue'
import VoerroTagsInput from '@voerro/vue-tagsinput'
import '@voerro/vue-tagsinput/dist/style.css'
// require styles
// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
    Vue.use(VoerroTagsInput, /* { default global options } */ )
}