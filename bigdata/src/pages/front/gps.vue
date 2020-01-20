<template>
  <q-page class="page">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 section-padding" style="height:88.8vh">
        <div class="fit section-bg round-border" style="padding:0 .3rem">
          <div class="left-head">
            <q-tabs align='center'>
              <q-tab name="all" default v-model="state" label='全部' slot="title" />
              <q-tab name="online" v-model="state" label='在线' slot="title" />
              <q-tab name="offline" v-model="state" label='离线' slot="title" />
            </q-tabs>
            <div class="search-box round-border">
              <q-search v-model="keyword" clearable dark hide-underline />
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
              <q-item tag="label" class='moni-item round-border' v-for="(item,index) in monitors" :key='index'>
                <q-item-side>
                  <q-checkbox v-model="item.checked" color="red" />
                </q-item-side>
                <q-item-main>
                  <q-item-tile :class="[item.state==1?'blue-font':'red-font']" label>{{item.name}} （{{item.state|stateFilter}}）</q-item-tile>
                  <q-item-tile sublabel>{{item.comment}}</q-item-tile>
                </q-item-main>
              </q-item>

            </q-list>

          </q-scroll-area>
        </div>

      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-9 section-padding" style="height:88.8vh">
        <div class="fit section-bg round-border" id='map'>

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
        state: 'all',
        checked_one: false,
        keyword: '',
        monitors: [{
          id: 1,
          name: '监控1',
          ip: '192.168.0.1',
          comment:'荷花园东1监控',
          position: [118.884058,31.295208],
          state: 1,
          url: '',
          checked:false
        }, {
          id: 1,
          name: '监控2',
          ip: '192.168.0.1',
          comment:'乐活林-东2监控',
          position: [118.895602,31.284243],
          state: 1,
          url: '',
           checked:false
        }, {
          id: 1,
          name: '监控3',
          ip: '192.168.0.1',
          comment:'湿地动物园-东2监控',
          position:[118.894358,31.298032],
          state: 0,
          url: '',
           checked:false
        }]

      }
    },
    filters:{
       stateFilter(value) {
        return value==1?'在线':'离线'
      }
    },
    computed: {
      platform: function () {
        return this.$store.state.platform;
      }
    },
    watch: {
      state: function () {
        console.log(this.state)
      }
    },
    methods: {
      initMap() {

        let mapOptions = {
          center: [this.platform.center.lng, this.platform.center.lat], //[116.397428, 39.90923]
          resizeEnable: true,
          zoom: this.platform.zoom,
          //zoom: 15,

        }
        switch (this.platform.id) {
          case '10000':

            break;
          case '10001':

            var imageLayer;

            imageLayer = new AMap.ImageLayer({
              url: 'statics/images/shuimanchengMap.jpg',
              bounds: new AMap.Bounds(
                [118.878436, 31.280667],
                [118.90616, 31.30564]
              ),
              zooms: [14, 18],

            });


            mapOptions.layers = [
              new AMap.TileLayer(),
              imageLayer
            ]
            break;
          case '10002':
            break;
          case '10003':
            var imageLayer;

            imageLayer = new AMap.ImageLayer({
              url: '../../statics/images/youzishanMap.jpg',
              bounds: new AMap.Bounds(
                [118.997607, 31.3305],
                [119.094598, 31.385607]
              ),
              zooms: [14, 18],
              opacity: 0.8
            });


            mapOptions.layers = [
              new AMap.TileLayer(),
              imageLayer
            ]

            break;
          case '10004':
            break;
          default:
            break;
        }










        //初始化高德地图 
        let map = new AMap.Map('map', mapOptions)

        AMapUI.loadUI(['control/BasicControl'], function (BasicControl) {
          var zoomCtrl1 = new BasicControl.Zoom({
              theme: 'dark',
              showZoomNum: true
            }),
            zoomCtrl2 = new BasicControl.Zoom({
              position: 'br',
              showZoomNum: true
            });
          map.addControl(zoomCtrl1);

        });

        map.on('click', function (e) {
          console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat())
        });



        if (this.platform.id == '10000') {
          let bounds = [
            [
              [118.895581, ],
              []
            ],
            [],
            [],
            []
          ]

          var addCanvas = function (bound) {
            /*
             * 添加Canvas图层
             */
            var canvas = document.createElement('canvas');
            canvas.width = canvas.height = 200;
            var context = canvas.getContext('2d')
            context.fillStyle = 'rgb(0,100,255)';
            context.strokeStyle = 'white';
            context.globalAlpha = 1;
            context.lineWidth = 2;
            var radious = 0;
            var draw = function (argument) {
              context.clearRect(0, 0, 200, 200)
              context.globalAlpha = (context.globalAlpha - 0.01 + 1) % 1;
              radious = (radious + 1) % 100;

              context.beginPath();
              context.arc(100, 100, radious, 0, 2 * Math.PI);
              context.fill();
              context.stroke();
              CanvasLayer.reFresh() //2D视图时可以省略
              AMap.Util.requestAnimFrame(draw)
            }

            var CanvasLayer = new AMap.CanvasLayer({
              canvas: canvas,
              bounds: new AMap.Bounds(bound
                // [116.328911, 39.937229],
                // [116.342659, 39.946275]
              ),
              zooms: [3, 18],
            });

            CanvasLayer.setMap(map);
            draw();
          }
        }

        //      if(this.platform.mapImage){

        //  // 创建图片图层
        //   var imageLayer = new AMap.ImageLayer({            
        //       //url:'http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/dongwuyuan.jpg',
        //       bounds: new AMap.Bounds(),
        //       url:'../../statics/images/'+this.platform.mapImage , // 图片 Url
        //       zIndex:2,
        //       zooms: [3, 18], // 设置可见级别，[最小级别，最大级别]
        //       map:map
        //   });

        //     }





      },

    },
    mounted() {
      this.initMap()
    }
  }

</script>
<style lang='stylus' scoped>

  .page-box
   height 88.8vh
  .left-head
   height 18%
   padding .2rem 0  
   .q-tabs-head
    font-size .18rem
    background-color transparent !important 
    bold()
    .active 
      .q-tab-label
        blue-linear()
      // .q-tabs-bar
        
        

  
 
     
  .search-box
    border 1px solid white
    margin .15rem auto
    padding .08rem .05rem
  .moni-item   
   margin .1rem 0
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