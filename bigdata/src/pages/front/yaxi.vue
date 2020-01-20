<template>
  <q-page key='yaxi' class="fh-page">
    <div class="map-box" id='map' v-cloak>
    </div>
    <div class="data-box">
      <div class="data-wrapper column">
        <div class="col-4 q-pb-xs">
          <swiper :options='cubeOption' class="fit">
            <swiper-slide>
              <div class="fit column justify-end">
                <div class="pop-box q-mb-sm" style="height:37%">
                  <div class="pop-name">
                    {{platform.label}}
                  </div>
                  <div class="row pop-item-data">
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
                  </div>
                  <div class="row pop-item-name">
                    <div class="col">当前游客数</div>
                    <div class="col">今日游客数</div>
                    <div class="col">今日入园车辆</div>
                    <div class="col">当前在园车辆</div>
                  </div>
                </div>
                <div class="pop-box " style="height:37%">
                  <div class="pop-name">
                    停车场剩余车位情况
                  </div>
                  <div class="row pop-item-data">
                    <div :key='index' v-for='(item,index) in parkings' class="col c1">
                      <countTo :endVal="item.parkSumRuckSpace" :duration="600" />
                    </div>
                  </div>
                  <div class="row pop-item-name">
                    <div :key='index' v-for='(item,index) in parkings' style="font-size:.5rem" class="col ">
                      <div class="ellipsis">{{item.trackName}}</div> 
                    </div>
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
            <swiper-slide>
              <div class="fit column justify-end">
                <div class=" guide-complain-box q-mb-sm">
                  <div class="pop-box full-height">
                    <div class="pop-name">导游数量</div>
                    <div class="row pop-item-data">
                      <div class="col c1">
                        <countTo :endVal="guide.work" :duration="600" />
                      </div>
                      <div class="col c2">
                        <countTo :endVal="guide.mountGuard" :duration="600" />
                      </div>
                      <div class="col c1">
                        <countTo :endVal="guide.all" :duration="600" />
                      </div>
                    </div>
                    <div class="row pop-item-name">
                      <div class="col">带团</div>
                      <div class="col">在岗</div>
                      <div class="col">全部</div>
                    </div>
                  </div>
                </div>
                <div class=" guide-complain-box">
                  <div class="pop-box full-height">
                    <div class="pop-name">投诉建议</div>
                    <div class="row pop-item-data">
                      <div class="col c1">
                        <countTo :endVal="complain.dispose" :duration="600" />
                      </div>
                      <div class="col c2">
                        <countTo :endVal="complain.untreated" :duration="600" />
                      </div>
                      <div class="col c1">
                        <countTo :endVal="complain.all" :duration="600" />
                      </div>
                    </div>
                    <div class="row pop-item-name">
                      <div class="col">已处理</div>
                      <div class="col">未处理</div>
                      <div class="col">全部</div>
                    </div>
                  </div>
                </div>

              </div>
            </swiper-slide>
            <swiper-slide>
              <div class="fit column justify-end">
                <div class="pop-box comfort">
                  <div class="pop-name">各月车流量走势图</div>
                  <div class="chart-box">
                    <echart :options='chart2' />
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
</template>
<script>
import AMap from "AMap";
import AMapUI from "AMapUI";
import countTo from "vue-count-to";
import leftCarousel from "../../components/leftCarousel";
import rightCarousel from "../../components/rightCarousel";
import Echart from "../../components/Echart";
import { mapState } from "vuex";

export default {
  name: "PageIndex",
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
      swiperOption: {
        loop: false,
        autoplay: {
          delay: 10000
        },
        disableOnInteraction: false
      },
      swiperOption1: {
        loop: false,
        autoplay: {
          delay: 10000
        },
        disableOnInteraction: false,
        direction: "vertical"
      },
      comfortDegree: {},
      fullscreen: false,
      chart1: {},
      chart2: {},
      complain: {
        dispose: 0,
        untreated: 0,
        all: 0
      },
      dayParkinglot:0,
      curParkinglot:0,
      curTourists: 0,
      dayTourists: 0,
      parkings: [],
      map: {},      
      mapOptions: {},     
      Interval: null,
      refreshtime: "",
      model: 1,
      guide: {
        work: 0,
        mountGuard: 0,
        all: 0
      }
    };
  },
  components: {
    countTo,
    Echart,
    leftCarousel,
    rightCarousel
  },
  watch: {
    platform: function() {
      this.fullscreen = false;
      setTimeout(() => {
        this.refresh();
        this.initMap();
      }, 1000);
    }
  },
  computed: {
    platform() {
      return this.$store.state.platform;
    },
    platforms() {
      return JSON.parse(this.$q.sessionStorage.getItem("platforms"));
    },
    
  },
  methods: {
    
   
    format(value) {
      return `${parseInt(value)}`;
    },
    initMap() {
      let _this = this;
      this.mapOptions = {
        center: [119.080956,31.414503],
        resizeEnable: true,
        zoom: parseInt(this.platform.mapGaode.zoom, 10),
         mapStyle: "amap://styles/f55bb51e74d7ef23c4e711a3fce0d7c4"
      };
      let mapImageLayer = this.platform.mapGaode.mapImageLayer;
      if (mapImageLayer != null) {
        let imageLayer = new AMap.ImageLayer({
          url: 'statics/images/yx_map.png',
          bounds: new AMap.Bounds(
            JSON.parse(mapImageLayer.bounds)[0],
            JSON.parse(mapImageLayer.bounds)[1]
          ),
          zooms: JSON.parse(mapImageLayer.zooms)
        });
        this.mapOptions.layers = [new AMap.TileLayer(), imageLayer];
      }
      this.map = new AMap.Map("map", this.mapOptions);
      //初始化高德地图
      // this.map = new AMap.Map('allmap', mapOptions)

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
      this.loadParkUsageRate();
      this.loadTourGuideCount();
      this.loadParkCount(this.platform.scenicName);
      this.loadTicketCount(this.platform.scenicName);
      this.loadComplainCount();
      this.getChart2();
      this.refreshtime = new Date();
      //this.getDevices();
    },
    //新景区车库查询
    loadParkUsageRate() {
      this.$axios({
        url: "/loadParkUsageRate",
        method: "GET",
        params: {
          scenicName: this.platform.scenicName
        }
      })
        .then(r => {
          this.parkings = r.desc;
        })
        .catch(e => {});
    },
    //获取导游统计信息
    loadTourGuideCount() {
      this.guide = {
        work: 0,
        all: 0,
        mountGuard: 0
      };
      this.$axios({
        url: "/tourGuide/loadTourGuideCount",
        method: "GET",
        params: {
          scenicName: this.platform.scenicName
        }
      })
        .then(res => {
          if (res.desc.length > 0) {
            this.guide = res.desc[0];
          }
        })
        .catch(e => {
          this.guide = {
            work: 0,
            all: 0,
            mountGuard: 0
          };
        });
    },
    //获取投诉建议统计信息
    loadComplainCount() {
      this.$axios({
        url: "/complain/loadComplainCount",
        method: "GET",
        params: {
          scenicName: this.platform.scenicName
        }
      })
        .then(res => {
          this.complaint = res.desc[0];
        })
        .catch(e => {});
    },
    //获取车流量
    getChart2() {
      let options = {
        // title: {
        //   text: "各月车流量走势图"
        // },
        tooltip: {
          trigger: "axis",
          formatter: "{b} : {c}"
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [],
            type: "line",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: {}
          }
        ]
      };

      this.$axios({
        url: "/loadVehicleStream",
        method: "GET",
        params: {
          scenicName: this.platform.scenicName,
          type: "year"
        }
      })
        .then(res => {
          if (res.desc) {
            res.desc.forEach(f => {
              options.xAxis.data.push(f.dateStr);
              options.series[0].data.push(f.count);
            });
            this.chart2 = options;
          }
        })
        .catch(() => {
          this.chart2 = options;
        });
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
    loadTicketCount(scenicName) {
      this.$axios({
        url: "/tourist/loadTicketCount",
        method: "GET",
        params: {
          scenicName: scenicName
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
             title: [
              {
                x: "70%",
                top: "45%",
                textStyle: {
                  fontSize: 34
                },
                text: res.desc[0].quantity
              },
              {
                x: "70%",
                top: "25%",
                text: "当前入园人数",
                textStyle: {
                  color: "#fffeee",
                  fontSize: 14
                }
              }
            ],
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
                center: ["35%", "50%"],
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
    }
  },

  created() {},
  mounted() {
    this.refresh();
    setTimeout(() => {
      this.initMap();
    }, 100);
    setTimeout(() => {
      // this.LoginPlat()
    }, 10000);
    this.Interval = setInterval(() => {
      this.refresh();
    }, this.$store.state.frequency);
  },
  beforeDestroy() {
    this.map.destroy()
    // if (typeof preview.StopPreview == "function") {
    //  let v= preview.StopPreview(-1);

    // }
    clearInterval(this.Interval);
  }
};
</script>
