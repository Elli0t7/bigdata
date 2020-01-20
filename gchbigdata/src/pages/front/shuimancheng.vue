<template>
  <q-page ref='page' class="page row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3 cust-col section-padding">
      <left-carousel :refreshtime='refreshtime' />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-7 cust-col">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-9 section-padding">
          <div class="overview-box section-bg">
            <div class="overview-header">游客数量</div>
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
        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-3 section-padding">
          <div :key='platform.id' class="overview-box section-bg">
            <div class="overview-header">导游数量</div>
            <div class="row">
              <div class="col">
                <div class="overview-quantity">
                  <countTo class='text-pl' key="work" :endVal="guide.work" :duration="600" />
                </div>
                <div class="overview-footer">带团</div>
              </div>
              <div class="col">
                <div class="overview-quantity">
                  <countTo class='text-rl' key="mountGuard" :endVal="guide.mountGuard" :duration="600" />
                </div>
                <div class="overview-footer">在岗</div>
              </div>
              <div class="col">
                <div class="overview-quantity">
                  <countTo class='text-pl' key="all" :endVal="guide.all" :duration="600" />
                </div>
                <div class="overview-footer">全部</div>
              </div>
            </div>

          </div>
        </div>

      </div>
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
          <div class="section-padding">
            <div style="height:53vh" id="allmap"></div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12-col-xl-12 section-padding">
          <div class="section-bg  section-padding" style="overflow:hidden">
            <swiper style="height:17.07vh;" :options="swiperOption1" ref="chartSwiper">
              <swiper-slide class="row">
                <echart :options='chart1' />
              </swiper-slide>
              <swiper-slide class="row">
                <echart :options='chart2' />
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 col-xl-2 cust-col">
      <div class="fit column">
        <div class="col-2 full-width section-padding ">
          <div key="complain" class="overview-box section-bg">
            <div class="overview-header">投诉建议</div>
            <div class="row">
              <div class="col">
                <div class="overview-quantity">
                  <countTo class='text-pl' :endVal="complain.dispose" :duration="600" />
                </div>
                <div class="overview-footer">已处理</div>
              </div>
              <div class="col">
                <div class="overview-quantity">
                  <countTo class='text-rl' :endVal="complain.untreated" :duration="600" />
                </div>
                <div class="overview-footer">未处理</div>
              </div>
              <div class="col">
                <div class="overview-quantity">
                  <countTo class='text-pl' :endVal="complain.all" :duration="600" />
                </div>
                <div class="overview-footer">全部</div>
              </div>
            </div>
          </div>          
        </div>
        <div class="col-5 full-width section-padding">          
          <div class="overview-box section-bg fit">
            <div class="overview-header ">景区舒适度</div>
            <div class="fit">
              <echart :options='comfortDegree' />
            </div>
          </div>
        </div>
        <div class="col-5 full-width section-padding">
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
import { date } from "quasar";
export default {
  name: "shuimancheng",
  data() {
    return {
      swiperOption1: {
        loop: false,
        autoplay: {
          delay: 10000
        },
        disableOnInteraction: false,
        direction: "vertical"
      },
      complain: {
        dispose: 0,
        untreated: 0,
        all: 0
      },
      comfortDegree: {},
      curTourists: 0,
      dayTourists: 0,
      curParkinglot: 0,
      dayParkinglot: 0,
      surplusParkinglot: 0,
      map: {},
      mapOptions: {},
      Interval: null,
      refreshtime: "",
      guide: {
        work: 0,
        mountGuard: 0,
        all: 0
      },
      chart1: {},
      chart2: {},
      dateparams: {
        start: "",
        end: ""
      }
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
    chartSwiper() {
      return this.$refs.chartSwiper;
    }
  },
  methods: {
    LoginPlat() {
      // if (typeof (preview.LoginPlat) != 'function') return
      //Demo默认使用密码登录方式
      let IP = this.platform.hkConfigs[0].ip;
      var port = this.platform.hkConfigs[0].port;
      var UserName = this.platform.hkConfigs[0].userName;
      var Password = this.platform.hkConfigs[0].password;
      var v1 =
        '<?xml version="1.0" encoding="utf-8"?><LoginInfo><LoginType>2</LoginType><SynLogin>1</SynLogin><IP>' +
        IP +
        "</IP><Port>" +
        port +
        "</Port><UserName>" +
        UserName +
        "</UserName><Password>" +
        Password +
        "</Password></LoginInfo>";
      //alert(v1);
      console.log(v1);
      var v = preview.LoginPlat(v1);
      if (v != 0) {
        this.$q.notify({
          message: "登录失败，请查看日志preview.log",
          type: "negative"
        });
      } else {
        if (this.platform.hkConfigs[0].indexCode) {
          let codes = this.platform.hkConfigs[0].indexCode.split(",");
          for (let index = 0; index < codes.length; index++) {
            this.StartPreview(codes[index]);
          }
        }
      }
    },
    StartPreview(code) {
      var _param =
        '<?xml version="1.0" encoding="UTF-8"?><Preview><CamIndexCode>' +
        code +
        "</CamIndexCode></Preview>";
      console.log(_param);
      preview.StartPreview(_param);
    },

    //获取车流量
    getChart1() {
      let options = {
        title: {
          text: "各月车流量走势图"
        },
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
    format(value) {
      return `${parseInt(value)}`;
    },
    initMap() {
      let _this = this;
      this.mapOptions = {
        center: this.platform.mapGaode.center.split(","), //[116.397428, 39.90923]
        resizeEnable: true,
        zoom: parseInt(this.platform.mapGaode.zoom, 10)
      };

      let mapImageLayer = this.platform.mapGaode.mapImageLayer;
      if (mapImageLayer != null) {
        let imageLayer = new AMap.ImageLayer({
          url: mapImageLayer.url,
          bounds: new AMap.Bounds(
            JSON.parse(mapImageLayer.bounds)[0],
            JSON.parse(mapImageLayer.bounds)[1]
          ),
          zooms: JSON.parse(mapImageLayer.zooms)
        });
        this.mapOptions.layers = [new AMap.TileLayer(), imageLayer];
      }
      this.map = new AMap.Map("allmap", this.mapOptions);

      AMapUI.loadUI(["control/BasicControl"], function(BasicControl) {
        var zoomCtrl1 = new BasicControl.Zoom({
          theme: "dark",
          showZoomNum: true
        });

        _this.map.addControl(zoomCtrl1);
      });

      this.map.on("click", function(e) {
        console.log(e.lnglat.getLng() + "," + e.lnglat.getLat());
      });
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
          this.complain = res.desc[0];
        })
        .catch(e => {});
    },
    refresh() {
      console.log("refreshed");
      let scenicName = this.platform.scenicName;
      this.loadParkCount(scenicName);
      this.loadTicketCount(scenicName);
      this.loadTicket();
      this.getChart1();
      this.loadTourGuideCount();
      this.loadComplainCount();
      this.refreshtime = new Date();
      //this.getDevices();
    },
    //门票售卖统计列表
    loadTicket() {
      let option = {
        title: {
          text: "各月份售票走势图"
        },
        legend: {},
        grid: {
          bottom: "40%"
        },
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
    }
  },

  mounted() {
    setTimeout(() => {
      this.initMap();
      this.refresh();
    }, 100);
    // setTimeout(()=>{
    //    this.LoginPlat()
    // },10000)
    this.Interval = setInterval(() => {
      this.refresh();
    }, this.$store.state.frequency);
  },
  beforeDestroy() {
    // if (typeof preview.StopPreview == "function") {
    //   preview.StopPreview(-1);
    // }
    clearInterval(this.Interval);
  }
};
</script>
<style>
.com {
  font-size: 0.14rem;
  line-height: 0.16rem;
  margin: 0.07rem;
}
</style>
