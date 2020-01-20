<template>
  <div class="row justify-center fit">
    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-5 section-padding">
      <q-tabs v-model='selectedType' class="type-pick">
        <template v-if="typelist!=undefined&&typelist.length>0">
           <q-tab v-for="(item,index) in typelist" :key='index' slot="title" :label="item.label" :name='item.name'/>
        </template>
        <template v-else>
        <q-tab slot="title" label="今日" name='day'/>
        <q-tab slot="title" label="本周" name='week'/>
        <q-tab slot="title" label="本月" name='month'/>
        <q-tab slot="title" label="全年" name='year'/>
        </template>
      </q-tabs>
    </div>
    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-3 section-padding">
      <div class="date-box row round-border" >
        <div class="col-4 hide-btn">
          <q-datetime align="center"  style="height:100%" :min="min" :max='params.end' format='YYYY-MM-DD' hide-underline color="red" dark v-model="params.start"
            type="date" />
        </div>
        <div class="col-2 relative-position">
          <div class="sp">~</div>
        </div>
        <div class="col-4 hide-btn">
          <q-datetime style="height:100%"  format='YYYY-MM-DD' :min='params.start' :max="today" hide-underline color="red" dark v-model="params.end" type="date" />
        </div>
        <div class="col-2 text-right">
          <q-btn size="sm" :disabled='!(params.start&&params.end)' dense  flat @click="btnQuery('custom')" icon='search'></q-btn> 
        </div>
      </div>
    </div>
  </div>

</template>

<script>
 import { date } from 'quasar'
  export default {
    // name: 'ComponentName',
    data() {
      return {
        today:date.formatDate(new Date(),'YYYY-MM-DD'),
        min:date.formatDate(new Date(2018,1,1),'YYYY-MM-DD'),
        selectedType:'',
        params: {
          type:'',
          start: "",
          end: ""
        }
      };
    },
    props:['typelist'],
    methods:{
      btnQuery(type){
        this.params.type=type
        if(type=='custom'){
          this.params.start=date.formatDate(this.params.start,'YYYY-MM-DD')
          this.params.end=date.formatDate(this.params.end,'YYYY-MM-DD')
        }
        this.$emit('query',this.params)
      },
    },
    watch:{
      selectedType:function(){         
         let d=new Date();          
         switch (this.selectedType) {
          case 'day':
          this.params.start=this.params.end=date.formatDate(d,'YYYY-MM-DD')

          this.btnQuery('day')
          break;
          case 'week':
          this.params.start=date.formatDate(date.subtractFromDate(d, { days: d.getDay()-1}),'YYYY-MM-DD')
          this.params.end=date.formatDate(date.addToDate(d , { days: 7-d.getDay()}),'YYYY-MM-DD')
          this.btnQuery('week')
          break;
           case 'month':                  
           let nd=new Date(d.getFullYear(),d.getMonth()+1,0)          
           this.params.start=date.formatDate(d.setDate(1),'YYYY-MM-DD')
           this.params.end=date.formatDate(nd,'YYYY-MM-DD')
          this.btnQuery('month')
          break;
           case 'year':
           this.params.start=date.formatDate(new Date(d.getFullYear(),0,1),'YYYY-MM-DD')
           this.params.end=date.formatDate(d,'YYYY-MM-DD')
           this.btnQuery('year')
          break;
      
        default:
          break;
      }
     
      }
    },
    mounted(){      
      if(this.typelist&&this.typelist.length>0){
        this.selectedType=this.typelist.filter(f=>{
          return f.selected==true
        })[0].name
      }else{
        this.selectedType='day'
      }
      
    }
    
  };

</script>

<style lang='stylus'>
@import '~variables';
  .date-box{
    padding .04rem
    border:1px solid white;
    color:white
  }
  .type-pick{
    .q-tabs-head{
      min-height inherit
    }
    .q-tab-label{
      font-size .18rem
      }
     
    .q-tab{
      margin-right .08rem
      padding 0 .1rem
      height .34rem
      min-height .32rem
      border-radius 6px
      &:before{
        border-radius 6px
        }
    }
    .active{
      background-image $bg-bl-45     
    }
    .q-tabs-bar{
      display:none;
    }
    .q-tab-label{
      opacity:1 !important
      }
  }

  .q-datetime-weekdaystring {
    font-size: 0.08rem;
  }

  .q-datetime-datestring {
    font-size: 0.27rem;

    span.small {
      font-size: 0.12rem;
    }
  }

  .hide-btn {
    i {
      visibility: hidden;
      width: 0;
    }
  }

  .sp {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 0.1rem;
    height: 0.1rem;
    margin-left: -0.05rem;
    margin-top: -0.06rem;
  }

</style>
