<template>
  <q-page class="page">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 section-padding" style="height:88.8vh">
        <div class="fit section-bg round-border" style="padding:0 .3rem">
          <div class="left-head">
            <q-tabs align='center'  style="margin-bottom:20px" v-model="state">
              <q-tab name="all" default=""   label='全部' slot="title" />
              <q-tab name="online" label='在线' slot="title" />
              <q-tab name="offline" label='离线' slot="title" />
            </q-tabs>
            <div class="row">
               <div class="col-3" style="padding:.1rem .2rem"><q-checkbox label='全选' color="white" v-model='checkedAll' @input="checkedAllwifi" /></div>
            <div class="col-9 ">             
              <q-search v-model="keyword" clearable dark  />
            </div>
           
             </div>
            
          </div>
          <q-scroll-area style="height: 80%" :thumb-style="{
                                                            right: '4px',
                                                            borderRadius: '5px',
                                                            background: '#18ffff',
                                                            width: '10px',
                                                            opacity: .5
                                                          }"
            :delay="500">
            <q-list  link no-border dark>               
              <q-item :title='item.lng==null||item.lat==null?"该设备没有经纬度数据，无法定位。":""'  tag="label" class='moni-item round-border' v-for="(item,index) in wififilter" :key='index'>
                <q-item-side >
                  <q-checkbox v-model="item.checked" color="white" @input='checked(item)' :disable='item.lng==null||item.lat==null' />
                </q-item-side>
                <q-item-main>                  
                  <q-item-tile :class="[item.state==0?'text-green':'text-red']" label><q-icon size="30" :name="item.state==0?'wifi':'wifi_off'" class="q-mr-sm"/>{{item.remark}} （{{item.state|stateFilter}}）</q-item-tile>
                  <q-item-tile sublabel>AP：{{item.apName}}</q-item-tile>
                  <q-item-tile sublabel>链接人数：<strong>{{item.linkingNumber}}</strong></q-item-tile>
                </q-item-main>
              </q-item>

            </q-list>

          </q-scroll-area>
        </div>

      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-9 section-padding" style="height:88.8vh">
        <div class="fit section-bg round-border" id='wifimap'>

        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
  import AMap from 'AMap'
  import AMapUI from 'AMapUI'
  export default {
    // name: 'PageName',
    data() {
      return {
        checkedAll:false,
        infoWindow :{},
        map:'',
        mapOptions:{},
        heatmap:{},
        state: 'all',      
        keyword: '',
        wifi: []

      }
    },
    filters:{
       stateFilter(value) {
        return value==0?'在线':'离线'
      }
    },
    computed: {
      platform: function () {
        return this.$store.state.platform; 
      },
      wififilter:function(){
        let _wifi=this.wifi.filter(f=>{return f.remark!=null}).filter(f=>{ 
          return this.keyword==''?true:f.remark.indexOf(this.keyword)!=-1
        }).filter(f=>{
          return this.state=='all'?true:(this.state=='online'?f.state==0:f.state==-1)
        })       
        return _wifi
        //return this.wifi
      },
      wifiChecked:function(){
        let _wifi=this.wifi.filter(f=>{return f.remark!=null}).filter(f=>{
          return (this.keyword==''&&f.remark!=null?true:f.remark.indexOf(this.keyword)!=-1)&&f.checked==true
        }).filter(f=>{
          return this.state=='all'?true:(this.state=='online'?f.state==0:f.state==-1)
        })  
        
        return _wifi
       // return this.wifi
      }
    },
    watch: {
      state: function () {
        console.log(this.state)
      },
      wifiChecked:function(){
          
          this.heatmap.setDataSet({
                  data: this.wifiChecked.map(m=>{
                    let d={}
                    d.count=m.count
                    d.lng=m.lng
                    d.lat=m.lat
                    return d
                  }),
                   max: 200
                });   
      }
    },
    methods: {
      checkedAllwifi(){
         if(this.checkedAll){
           this.wififilter.forEach(f => {
            f.checked=this.checkedAll
            if(f.marker){
              f.marker.show()
            }
            
          });
         }else{
            this.wififilter.forEach(f => {
            f.checked=this.checkedAll
            if(f.marker){
               f.marker.hide()
            }
           
          });
         }
          
        
      },
      checked(e){
        console.log(e)
         if(e.checked){
           e.marker.show()
           this.infoWindow.setInfoTitle(e.opt.title);
          this.infoWindow.setInfoBody(e.opt.body);
          this.infoWindow.open(this.map, [e.lon,e.lat]);
           
        }else{
           e.marker.hide()
          this.infoWindow.close()
        }
      },       
      getWifi(){
        let _this=this;
        this.$axios({
          url:'/wifi/loadWifiList',
          method:'GET',          
        }).then(res=>{
          
           res.desc.filter(f=>{return f.lon!=null&&f.lat!=null}).map(f=>{                        
             f.checked=false
             var marker = new AMap.Marker({
            visible:f.checked,
            position: [f.lon,f.lat],
            map: _this.map,
            animation:'AMAP_ANIMATION_DROP',
            content:`<i aria-hidden="true" class="q-icon marker_shark material-icons ${f.state==0?'text-lime-14':'text-deep-orange-12'}" style="font-size: 28px;">wifi</i>`,
            title:f.remark
        });
       let title= `<div class=${f.state==0?'text-lime-14':'text-deep-orange-12'} style='font-size:16px'><strong>${f.remark}</strong></div>`
        let body=`<div class='info-body text-grey'>                   
                   <div class='row'><div class='col-5 text-right'>状态：</div><div class='col-7 ${f.state==0?'text-lime-14':'text-deep-orange-12'}'>${f.state==0?'在线':'离线'}</div></div>
                   <div class='row'><div class='col-5 text-right'>链接人数：</div><div class='col-7'>${f.linkingNumber}</div></div>
                   <div class='row'><div class='col-5 text-right'>AP：</div><div class='col-7'>${f.apName}</div></div>
                   <div class='row'><div class='col-5 text-right'>MAC：</div><div class='col-7'>${f.mac}</div></div>
                   <div class='row'><div class='col-5 text-right'>位置：</div><div class='col-7'>${f.lon}，${f.lat}</div></div>               
                   </div>`
            
        marker.title = f.remark;
        marker.on('click', ()=>{
          _this.infoWindow.setInfoTitle(title);
          _this.infoWindow.setInfoBody(body);
          _this.infoWindow.open(_this.map, marker.getPosition());
        });
            
            f.opt={
              title:title,
              body:body
            }
           
            f.marker=marker
            f.lng=f.lon
            f.lat=f.lat
            f.count=f.linkingNumber  
            // f.checked=false     
           
            return f     
          })
        
         
          this.wifi=res.desc             
        }).catch(e=>{console.error(e)})
      },
      initMap() {
        let _this = this;        
        this.mapOptions = {
          center: this.platform.mapGaode.center.split(','), //[116.397428, 39.90923]
          resizeEnable: true,
          zoom: parseInt(this.platform.mapGaode.zoom,10),         

        }

        
        
        
        let mapImageLayer=this.platform.mapGaode.mapImageLayer
        if(mapImageLayer!=null){
          let  imageLayer = new AMap.ImageLayer({
              url: mapImageLayer.url,
              bounds: new AMap.Bounds(
                JSON.parse(mapImageLayer.bounds)[0],
                JSON.parse(mapImageLayer.bounds)[1]

              ),
              zooms: JSON.parse(mapImageLayer.zooms),

            });          
            this.mapOptions.layers = [
              new AMap.TileLayer(),
              imageLayer
            ]
        }
       this.map= new AMap.Map('wifimap', this.mapOptions)
        this.getWifi()
           this.map.plugin(["AMap.Heatmap"], () => {
              //初始化heatmap对象
              this.heatmap = new AMap.Heatmap(this.map, {
                radius: 60, //给定半径
                opacity: [0, 0.8],
              });
            })
        
        //初始化高德地图 
        // this.map = new AMap.Map('allmap', mapOptions)

        AMapUI.loadUI(['control/BasicControl','overlay/SimpleInfoWindow'], function (BasicControl,SimpleInfoWindow) {
          var zoomCtrl1 = new BasicControl.Zoom({
              theme: 'dark',
              showZoomNum: true
            })
            _this.infoWindow=new SimpleInfoWindow({ offset: new AMap.Pixel(0, -31)})
          _this.map.addControl(zoomCtrl1);

        });

        this.map.on('click', function (e) {
          console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat())
        });



       
      },

    },
    mounted() {
      setTimeout(()=>{
        this.initMap()
        this.heatmap.setDataSet({
                  data: this.wifiChecked,
                   max: 200
                });    
     },1000)
     
      
    }
  }

</script>
<style lang='stylus' scoped>
@import '~variables';
  .page-box
   height 88.8vh
  .active
   color $bl
  .moni-item   
   margin-bottom .1rem
   padding .22rem  
   background rgba(255,255,255,0.05)  
   .q-item-label
      font-size .16rem
      bold()
   .q-item-sublabel
      font-size .12rem
      margin-top .1rem
      medium()
    
    
    
</style>