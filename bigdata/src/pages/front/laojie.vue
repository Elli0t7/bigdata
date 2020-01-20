<template>
  <q-page class="fh-page">
    <div class="map-box" id='map' v-cloak>
    </div>
    <div class="data-box">
      <div class="data-wrapper column">
        <div class="col-4 q-pb-xs">
          <swiper :options='cubeOption' class="fit">
            <swiper-slide>
              <div class="fit column justify-end">
                <div class="pop-box " style="height:76%">
                  <div class="pop-name">
                    {{platform.label}}
                  </div>
                  <div class="row pop-item-data" style="height:85%">
                    <div class="col c1">
                      <countTo :endVal="curTourists" :duration="600" />
                    </div>
                    <div class="col c2">
                      <countTo :endVal="dayTourists" :duration="600" />
                    </div>
                    <div class="col c2">
                      <countTo :endVal="dayParkinglot" :duration="600" />
                    </div>
                    <div class="col c2">
                      <countTo :endVal="curParkinglot" :duration="600" />
                    </div>
                    <div class="col c1">
                      <countTo :endVal="surplusParkinglot" :duration="600" />
                    </div>
                  </div>
                  <div class="row pop-item-name">
                    <div class="col">当前游客数</div>
                    <div class="col">今日游客数</div>
                    <div class="col">今日入园车辆</div>
                    <div class="col">当前在园车辆</div>
                    <div class="col">剩余车位</div>
                  </div>
                </div>               
              </div>
            </swiper-slide>
            <swiper-slide>
              <div class="fit column justify-end">
                <div class="pop-box comfort">
                  <div class="pop-name">景区舒适度</div>
                  <div class="chart-box">
                    <echart :options='comfortDegree' />
                  </div>
                </div>
              </div>
            </swiper-slide>           
          </swiper>
        </div>
        <div class="col-4 q-py-xs">
          <left-carousel :refreshtime='refreshtime' />
        </div>
        <div class="col-4 q-py-xs">
          <rightCarousel :refreshtime='refreshtime' />
        </div>
      </div>
    </div>
  </q-page>
  <!-- <q-page ref='page' class="page row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3 section-padding cust-col">
      <left-carousel :refreshtime='refreshtime' />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-7 cust-col ">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 section-padding ">
          <div key='laojie' class="overview-box section-bg section-padding">
            <div class="overview-header">客流量</div>
            <div class="row">
              <div class="col">
                <div class="overview-quantity">
                  <countTo class='text-rl' :endVal="curTourists" :duration="600" />
                </div>
                <div class="overview-footer">当前游客数</div>
              </div>
              <div class="col">
                <div class="overview-quantity">
                  <countTo class='text-pl' :endVal="dayTourists" :duration="600" />
                </div>
                <div class="overview-footer">今日游客数</div>
              </div>
              <div class="col">
                <div class="overview-quantity">
                  <countTo class='text-pl' :endVal="dayParkinglot" :duration="600" />
                </div>
                <div class="overview-footer">今日入园车辆</div>
              </div>
              <div class="col">
                <div class="overview-quantity">
                  <countTo class='text-bl' :endVal="curParkinglot" :duration="600" />
                </div>
                <div class="overview-footer">当前在园车辆</div>
              </div>
              <div class="col">
                <div class="overview-quantity">
                  <countTo class='text-rl' :endVal="surplusParkinglot" :duration="600" />
                </div>
                <div class="overview-footer">剩余车位</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 section-padding" style='height:73.2vh'>
          <div class="fit" id="laojiemap"></div>
        </div>
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 cust-col">
      <div class="column fit">
        <div class="col-4 full-width section-padding">
          <div class="overview-box section-bg fit">
            <div class="overview-header ">景区舒适度</div>
            <div class="fit " style="padding-top:.5vh">
              <echart :options='comfortDegree' />
            </div>
          </div>
        </div>
        <div class="col-8 full-width section-padding">
          <rightCarousel key='laojie_right' :refreshtime='refreshtime' />
        </div>
      </div>
    </div>
  </q-page> -->
</template>
<script>
import AMap from "AMap";
import AMapUI from "AMapUI";
import countTo from "vue-count-to";
import leftCarousel from "../../components/leftCarousel";
import rightCarousel from "../../components/rightCarousel";
import Echart from "../../components/Echart";
export default {
  name: "laojiePage",
  data() {
    return {
      cubeOption: {
        autoplay: true,
        // effect: "cube",
        // cubeEffect: {
        //   slideShadows: true,
        //   shadow: true,
        //   shadowOffset: 100,
        //   shadowScale: 0.6
        // }
      },
      comfortDegree: {},     
      curTourists: 0,
      dayTourists: 0,
      curParkinglot: 0,
      dayParkinglot: 0,
      surplusParkinglot: 0,
      map: {},
      heatmap: {},
      mapOptions: {},
      heatMapData: [],
      Interval: null,
      refreshtime: "",
      guide: []
    };
  },
  components: {
    countTo,
    Echart,
    leftCarousel,
    rightCarousel
  },

  computed: {
    platform() {
      return this.$store.state.platform;
    },   
  },
  methods: {
    format(value) {
      return `${parseInt(value)}`;
    },
    initMap() {
      let _this = this;
      this.mapOptions = {
        center: this.platform.mapGaode.center.split(","), //[116.397428, 39.90923]
        resizeEnable: true,
        zoom:17,
        //zoom: parseInt(this.platform.mapGaode.zoom, 10),
         mapStyle: "amap://styles/f55bb51e74d7ef23c4e711a3fce0d7c4"
        //  features: ['bg', 'road', 'building',]
        //showLabel: false
      };

      // let mapImageLayer = this.platform.mapGaode.mapImageLayer;
      // if (mapImageLayer != null) {
        //let imageLayer=null
        let imageLayer = new AMap.ImageLayer({
          url: 'statics/images/lj_map.png',
          bounds: new AMap.Bounds([118.864571,31.347453],[118.875195,31.322688]),
          zooms: 10
        });
        this.mapOptions.layers = [new AMap.TileLayer(), imageLayer];
      //}
      this.map = new AMap.Map("map", this.mapOptions);

      // this.map.plugin(["AMap.Heatmap"], () => {
      //   //初始化heatmap对象
      //   this.heatmap = new AMap.Heatmap(this.map, {
      //     radius: 38, //给定半径
      //     opacity: [0, 0.8]
      //   });
      // });

      AMapUI.loadUI(["control/BasicControl"], function(BasicControl) {
        var zoomCtrl1 = new BasicControl.Zoom({
          theme: "dark",
          showZoomNum: true,
          position: {
            top: "120px",
            right: "10px"
          }
        });
        _this.map.addControl(zoomCtrl1);
      });

      this.map.on("click", function(e) {
        console.log(e.lnglat.getLng() + "," + e.lnglat.getLat());
      });
    },
    refresh() {
      let scenicName =
        this.platform.scenicName == "home" ? "" : this.platform.scenicName;
      this.loadParkCount(scenicName);
      this.loadTicketCount(scenicName);
      this.getHeatMapData();
      this.refreshtime = new Date();
    },
    //首页停车场车流统计
    loadParkCount(scenicName) {
      this.$axios({
        url: "/loadParkCount",
        method: "GET",
        params: {
          scenicName: scenicName
        }
      })
        .then(res => {
          this.curParkinglot = res.desc.quantity;
          this.dayParkinglot = res.desc.dayQuantity;
          this.surplusParkinglot = res.desc.surplus;
        })
        .catch(e => {});
    },
    //首页票务客流统计
    loadTicketCount() {
      this.$axios({
        url: "/tourist/loadTicketCount",
        method: "GET",
        params: {
          scenicName: this.platform.scenicName
        }
      })
        .then(res => {
          this.curTourists = res.desc[0].quantity;
          this.dayTourists = res.desc[0].dayQuantity;

          let max = 0;
          max = res.desc[0].maxThisBear;

          let level = [
            {
              name: "舒适",
              axisValue: max * 0.1,
              comfortValue: max * 0.2
            },
            {
              name: "较舒适",
              axisValue: max * 0.3,
              comfortValue: max * 0.4
            },
            {
              name: "一般",
              axisValue: max * 0.5,
              comfortValue: max * 0.6
            },
            {
              name: "较拥挤",
              axisValue: max * 0.7,
              comfortValue: max * 0.8
            },
            {
              name: "拥挤",
              axisValue: max * 0.9,
              comfortValue: max
            }
          ];

          let option = {
            // title: {
            //   x: "center",
            //   bottom: 20,
            //   subtext: "景区舒适度"
            // },
            tooltip: {
              show: true
            },
            series: [
              {
                name: "当前入园人数",
                type: "gauge",
                min: 0,
                max: max,
                radius: "95%",
                axisLine: {
                  show: true,
                  lineStyle: {
                    width: 10,
                    shadowBlur: 2,
                    color: [
                      [0.2, "#7CBB55"],
                      [0.4, "#9CD6CE"],
                      [0.6, "#DDBD4D"],
                      [0.8, "#E98E2C"],
                      [1, "#E43F3D"]
                    ]
                  }
                },
                axisTick: {
                  show: false,
                  splitNumber: 1
                },
                splitLine: {
                  show: true,
                  length: 15,
                  lineStyle: {
                    //color:'black'
                  }
                },
                axisLabel: {
                  formatter: function(e) {
                    if (e == level[0].axisValue) {
                      return "舒适";
                    } else if (e == level[1].axisValue) {
                      return "较舒适";
                    } else if (e == level[2].axisValue) {
                      return "一般";
                    } else if (e == level[3].axisValue) {
                      return "较拥挤";
                    } else if (e == level[4].axisValue) {
                      return "拥挤";
                    } else {
                      return e;
                    }
                  },
                  textStyle: {
                    fontSize: 12,
                    fontWeight: ""
                  }
                },
                pointer: {
                  show: true
                },
                detail: {
                  //show:false,
                  formatter: function(param) {
                    var comfort = "";
                    if (param < level[0].comfortValue) {
                      comfort = level[0].name;
                    } else if (param < level[1].comfortValue) {
                      comfort = level[1].name;
                    } else if (param < level[2].comfortValue) {
                      comfort = level[2].name;
                    } else if (param < level[3].comfortValue) {
                      comfort = level[3].name;
                    } else if (param < level[4].comfortValue) {
                      comfort = level[4].name;
                    }
                    return comfort;
                  },
                  //offsetCenter: ['40%', '80%'],
                  textStyle: {
                    fontSize: 14
                  }
                },
                data: [
                  {
                    name: "",
                    value: res.desc[0].quantity
                  }
                ]
              }
            ]
          };
          this.comfortDegree = option;
        })
        .catch(e => {});
    },
    //老街热力图
    getHeatMapData() {
      let _this = this;
      this.$axios({
        url: "/loadGisHot",
        method: "GET",
        params: {}
      })
        .then(res => {
          let temp = [];
          res.desc.forEach(f => {
            AMap.convertFrom(
              new AMap.LngLat(f.lon, f.lat),
              "baidu",
              (status, result) => {
                if (result.info === "ok") {
                  var lnglats = result.locations;
                  temp.push({
                    lng: lnglats[0].getLng(),
                    lat: lnglats[0].getLat(),
                    count: f.cust_CNT
                  });
                }
              }
            );
          });
          // setTimeout(() => {
          //   _this.heatmap.setDataSet({
          //     data: temp,
          //     max: 1000
          //   });
          // }, 4000);
        })
        .catch(err => {});
    }
  },

  mounted() {
    setTimeout(() => {
      this.initMap();
      this.refresh();
    }, 100);   
    this.Interval = setInterval(() => {
      this.refresh();
    }, this.$store.state.frequency);
  },
  beforeDestroy() {
   this.map.destroy()
  },
  activated() {
    this.refresh();
  }
};
</script>
