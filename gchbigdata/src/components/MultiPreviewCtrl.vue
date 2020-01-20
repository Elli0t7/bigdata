<template>
  <iframe ref='iframe' id='iframe' frameborder='0' height="100%" width="100%" scrolling='no' :src='src'>
  </iframe>

</template>

<script>
  import {
    uid
  } from 'quasar'
  export default {
    name: 'MultiPreviewCtrl',
    data() {
      return {
        src: ''
      }
    },
    props: ['config'],
    watch: {
      config: function (newVal, oldVal) {        
        if (Object.keys(newVal).length != 0) {
          this.src = this.config.prefix != "/laojie" ?
            `statics/multiPreview.html?ip=${this.config.ip}&port=${this.config.port}&code=${this.config.indexCode}&userName=${this.config.userName}&passWord=${this.config.password}&layoutType=${this.config.layoutType||1}` :
            `statics/webvideo.html?ip=${this.config.ip}&port=${this.config.port}&code=${this.config.indexCode}&userName=${this.config.userName}&passWord=${this.config.password}&layoutType=${this.config.layoutType||1}`
         

        //  this.src = this.config.prefix != "/laojie" ?
        //     `statics/multiPreview.html?ip=${this.config.ip}&port=${this.config.port}&code=${this.config.indexCode}&userName=${this.config.userName}&passWord=${this.config.password}&layoutType=${this.config.layoutType||1}` :
        //     `statics/demo-easy.html`
         
         iframe.src = this.src;

        }

      }
    },
    methods: {

    },
    mounted() {
      if (Object.keys(this.config).length != 0) {
      this.src = this.config.prefix != "/laojie" ?
            `statics/multiPreview.html?ip=${this.config.ip}&port=${this.config.port}&code=${this.config.indexCode}&userName=${this.config.userName}&passWord=${this.config.password}&layoutType=${this.config.layoutType||1}` :
            `statics/webvideo.html?ip=${this.config.ip}&port=${this.config.port}&code=${this.config.indexCode}&userName=${this.config.userName}&passWord=${this.config.password}&layoutType=${this.config.layoutType||1}`                 
         iframe.src = this.src;}

    },
  }

</script>

<style>
</style>
