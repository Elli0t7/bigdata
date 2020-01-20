<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>

import { colors } from 'quasar'
export default {
  name: 'App',
 
  created(){
   // colors.setBrand('primary','#f33');
  },
  mounted(){
   
  }
}
</script>

<style lang='stylus'>
//  #q-app{
//    background:url('./statics/images/bg.jpg');
//  }

</style>
