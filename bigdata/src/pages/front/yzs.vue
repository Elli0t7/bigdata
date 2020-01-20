<template>
  <q-page key='yzs' class="fh-page">
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
                <div class="row guide-complain-box">
                  <div class="col-6 q-pr-xs">
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
                  <div class="col-6 q-pl-xs">
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
                <div class="pop-box comfort">
                  <div class="pop-name">各月份售票走势图</div>
                  <div class="chart-box">
                    <echart :options='chart1' />
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
      swiperOption1: {
        loop: false,
        autoplay: {
          delay: 10000
        },
        disableOnInteraction: false,
        direction: "vertical"
      },
      fullscreen: false,
      complain: {},
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
      model: 1,
      guide: {},
      complain: {
        dispose: 0,
        untreated: 0,
        all: 0
      },
      chart1: {},
      chart2: {}
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
        this.initMap();
        this.refresh();        
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
        center: this.platform.mapGaode.center.split(","), //[116.397428, 39.90923]
        resizeEnable: true,
        zoom: parseInt(this.platform.mapGaode.zoom, 10),
        mapStyle: "amap://styles/f55bb51e74d7ef23c4e711a3fce0d7c4"
        //  features: ['bg', 'road', 'building',]
        //showLabel: false
      };

      let mapImageLayer = this.platform.mapGaode.mapImageLayer;
      if (mapImageLayer != null) {
        let imageLayer = new AMap.ImageLayer({
          url: 'statics/images/yzs_map.png',
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
      this.loadParkCount();
      this.loadTourGuideCount();
      this.loadTicketCount();
      this.getChart1();
      this.loadTicket();
      this.loadComplainCount();
      this.refreshtime = new Date();
    },
    //首页停车场车流统计
    loadParkCount() {
      this.$axios({
        url: "/loadParkCount",
        method: "GET",
        params: {
          scenicName: this.platform.scenicName
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
            title:  [{
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
    //获取车流量
    getChart1() {
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

    //门票售卖统计列表
    loadTicket() {
      let option = {
        // title: {
        //   text: "各月份售票走势图"
        // },
        grid: {
          bottom: "40%"
        },
        legend: {},
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
          axisLabel: {
            rotate: 30,
            margin: 30
          }
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "售票数量",
            data: [],
            type: "line",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: {}
          },
          {
            name: "退票数量",
            data: [],
            type: "line",
            label: {
              normal: {
                show: true,
                position: "bottom"
              }
            },
            areaStyle: {}
          }
        ]
      };
      this.$axios({
        method: "GET",
        url: "/ticket/loadTicketSalesStatistics",
        params: {
          scenicName: this.platform.scenicName,
          queryTimeType: "year"
        }
      })
        .then(res => {
          res.desc.forEach(f => {
            option.xAxis.data.push(f.dateStr);
            option.series[0].data.push(f.number);
            option.series[1].data.push(f.outNumber);
          });

          this.chart1 = option;
        })
        .catch(e => {
          this.chart1 = option;
        });
    }
  },

  created() {},
  mounted() {
    
    setTimeout(() => {
      this.initMap();
    }, 100);
    this.refresh();
    this.Interval = setInterval(() => {
      this.refresh();
    }, this.$store.state.frequency);
  },
  beforeDestroy() {
    this.map.destroy()
    clearInterval(this.Interval);
  }
};
</script>



