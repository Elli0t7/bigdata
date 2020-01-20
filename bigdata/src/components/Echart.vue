<template>
<div class="fit"  >
   <!-- <q-resize-observable  @resize="onResize" /> -->
   <div  class="chart"   ref="myEchart"  >    
    </div> 
   
</div>
  
</template>

<script>
const echarts = require("echarts/lib/echarts");
require("echarts/theme/dark");

export default {
  data() {
    return {
      
    };
  },
  props: ["options"],
  computed:{
    chart(){
      return echarts.init(this.$refs.myEchart, "dark");
    }
  },
  watch:{
    options:function(){       
           this.chart.setOption(this.options);
    }
  },  
  methods: {
    initChart() { 
        this.chart.setOption(this.options);
    },   
  },
  mounted() {
    setTimeout(() => {     
         this.initChart();       
    }, 100);

  },

};
</script>

<style lang="stylus">
.chart {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
