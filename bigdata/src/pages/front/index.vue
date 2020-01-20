<template>
  <q-page class="fh-page">
    <div class="map-box" id='map' v-cloak>
    </div>
    <div class="data-box">
      <div class=" data-wrapper column">
        <div class="col-4 q-pb-xs">
          <div class="fit column justify-end">
            <div class="video-box col-auto">
              <video controls loop autoplay='true' class="bg-black" muted='true' width="100%" height="100%" style='display:block' src="statics/videos/gc5.mp4"></video>
            </div>
          </div>
        </div>
        <div class="col-4 q-py-xs">
          <div class="scenic-data">
            <div class="pop-box full-height">
                  <div class="pop-name">
                    客流量
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
              
          </div>
          <div class="scenic-c">
            <div class="pop-box full-height">
              <div class="row justify-between items-center">
                <div class="pop-name">景区舒适度 </div>
                <div class="pop-sub">
                  <span class='cd c1'>舒适</span>
                  <span class='cd c2'>较舒适</span>
                  <span class='cd c3'>一般</span>
                  <span class='cd c4'>较拥挤</span>
                  <span class='cd c5'>拥挤</span>
                </div>
              </div>
              <div class="confort-chart" style='height:78%'>
                <Echart :options='chartComfort'></Echart>
              </div>
              <div class="row pop-item-name">
                <div class="col" :key='index' v-for='(item,index) in comfortArray'> {{item.name}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4 q-py-xs">
          <div class="scenic-e">
            <swiper :options='{autoplay:true}' class='full-height'>
              <swiper-slide>
                <div class="pop-box full-height">
                  <!-- <div class="pop-name">导游数量</div> -->
                  <div style="height:100%">
                    <Echart :options='guideOption'></Echart>
                  </div>
                </div>
              </swiper-slide>
              <swiper-slide>
                <div class="pop-box full-height">
                  <!-- <div class="pop-name">投诉建议</div> -->
                  <div style='height:100%'>
                    <Echart :options='complains'></Echart>
                  </div>
                </div>
              </swiper-slide>
            </swiper>
          </div>
          <div class="scenic-f">
            <leftCarousel :refreshtime='refreshtime'></leftCarousel>
          </div>
        </div>

      </div>
    </div>
  </q-page>
</template>
<script>
require("echarts-liquidfill/src/liquidFill");
const echarts = require("echarts/lib/echarts");
import AMap from "AMap";
import AMapUI from "AMapUI";
import countTo from "vue-count-to";
import leftCarousel from "../../components/leftCarousel";
import rightCarousel from "../../components/rightCarousel";
import Echart from "../../components/Echart";

export default {
  name: "PageIndex",
  data() {
    return {
      defaultOption: {
        direction: "vertical",
        autoplay: true
      },
      swiperOption: {
        loop: false,
        autoplay: {
          delay: 10000
        },
        disableOnInteraction: false,
        direction: "vertical",
        effect: "flip",
        flipEffect: {
          slideShadows: true,
          limitRotation: true
        }
      },
      comfortArray: [],
      complains: {},
      chartComfort: {},
      fullscreen: false,
      curTourists: 0,
      dayTourists: 0,
      curParkinglot: 0,
      dayParkinglot: 0,
      surplusParkinglot: 0,
      map: {},
      mapOptions: {},
      Interval: null,
      refreshtime: "",
      guideOption: {}
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
    platforms() {
      return JSON.parse(this.$q.sessionStorage.getItem("platforms"));
    },
    mySwiper() {
      return this.$refs.mySwiper;
    }
  },
  methods: {
    fullscreenChange(e) {
      console.log(e);
    },    
    format(value) {
      return `${parseInt(value)}`;
    },
    initMap() {
      let _this = this;
      this.mapOptions = {
        //0.071139 +0.030381
        //118.948122,31.332314
        center: [118.876983, 31.36695],
        //center: this.platform.mapGaode.center.split(","), //[116.397428, 39.90923]
        resizeEnable: true,
        zoom: 11,
        zoom: parseInt(this.platform.mapGaode.zoom, 10),
       // pitch:45, // 地图俯仰角度，有效范围 0 度- 83 度
        //viewMode:'3D', // 地图模式
        //mapStyle:'amap://styles/25ba5849cc3ff0bf6a3e67b9021bc754'
        mapStyle: "amap://styles/f55bb51e74d7ef23c4e711a3fce0d7c4"
        // features: ['bg', 'road', 'building',]
        //showLabel: false
      };

      let mapImageLayer = this.platform.mapGaode.mapImageLayer;
      
      if (mapImageLayer != null) {
        let imageLayer = new AMap.ImageLayer({
          opacity: 1,
          url: "statics/images/Map01.png",
          bounds: new AMap.Bounds(
            [118.697201, 32.200065],
            [119.218941, 31.490144]
            // JSON.parse(mapImageLayer.bounds)[0],
            // JSON.parse(mapImageLayer.bounds)[1]
          ),
          //zooms:[5,15],
          zooms: JSON.parse(mapImageLayer.zooms)
        });
        this.mapOptions.layers = [new AMap.TileLayer(), imageLayer];
      }
      this.map = new AMap.Map("map", this.mapOptions);

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
      //yaxi
      var bound1 = [[119.058086, 31.377649], [119.13396, 31.438597]];
      this.drawArea(bound1);

      //yzs
      var bound2 = [[118.985301, 31.332206], [119.027187, 31.365527]];
      this.drawArea(bound2);

      //smc
      var bound3 = [[118.855182, 31.248885], [118.935176, 31.310182]];
      this.drawArea(bound3);

      //lj
      var bound4 = [[118.862735, 31.316075], [118.899127, 31.346018]];
      this.drawArea(bound4);
    },
    drawArea(bounds) {
      var rings = [
        { radius: 0, r:0 ,g:188,b:212,a:1 },
        { radius: 33, r:29 ,g:233,b:182,a:1  },
        { radius: 66, r:24 ,g:255,b:255,a:1  },
        // { r: 75, c: "#2afcfd" },
      ];
      var canvas = document.createElement("canvas");
      canvas.width=canvas.height=200
      var context = canvas.getContext("2d");      
      var draw = function() {        
        context.clearRect(0, 0, 200, 200);
        context.lineWidth = "3";
        rings.forEach(ring => {
          ring.radius += 0.25;
          ring.a=(100-ring.radius)/50;
          context.strokeStyle = `rgba(${ring.r},${ring.g},${ring.b},${ring.a})`;
          context.beginPath();
          context.shadowBlur=7          
          context.shadowColor=`rgb(${ring.r},${ring.g},${ring.b})`;          
          context.arc(100, 100, ring.radius, 0, 2 * Math.PI);
          context.stroke();
          if (ring.radius == 100) {
            ring.radius = 0;
            ring.a=1
          }
        });
      };
      var anime = function() {
        draw();
        AMap.Util.requestAnimFrame(anime);
      };

      var CanvasLayer = new AMap.CanvasLayer({
        canvas: canvas,
        bounds: new AMap.Bounds(bounds[0], bounds[1]),
        zooms: [3, 18]
      });

      CanvasLayer.setMap(this.map);
      anime();
    },
    refresh() {
      this.loadComplainCount();
      this.loadParkCount()
      this.loadTourGuideCount()
      this.refreshtime = new Date();
    },
    //首页停车场车流统计
    loadParkCount() {
      this.$axios({
        url: "/loadParkCount",
        method: "GET",
        params: {
          scenicName: ''
        }
      })
        .then(res => {          
          this.curParkinglot = res.desc.quantity;
          this.dayParkinglot = res.desc.dayQuantity;
          this.surplusParkinglot = res.desc.surplus;
        })
        .catch(e => {});
    },
    //获取导游统计信息
    loadTourGuideCount() {
      this.$axios({
        url: "/tourGuide/loadTourGuideCount",
        method: "GET"
      })
        .then(res => {
          if (res.desc.length > 0) {
            let Xdata = [],
              online = [],
              offline = [],
              working = [];
            res.desc.forEach(f => {
              Xdata.push(f.name);
              online.push(f.mountGuard);
              offline.push(f.notMountGuard);
              working.push(f.work);
            });

            this.guideOption = {
              title: {
                text: "|  导游数量"
              },
              grid: {
                top: "20",
                right: "22%",
                bottom: "20"
              },
              tooltip: {
                trigger: "axis"
              },
              color: ["#aefa03", "#2df2fc", "#f27d31"],
              legend: {
                top: 0,
                right: "0",
                data: ["在岗", "带团", "离岗"],
                itemGap: 10,
                itemWidth: 10,
                itemHeight: 10
              },
              xAxis: [
                {
                  // name: "景区",
                  type: "category",
                  axisTick: {
                    alignWithLabel: true
                  },
                  axisLabel: {
                    interval: 0,
                    color: "#05c8db"
                  },
                  nameTextStyle: {
                    color: "#05c8db"
                  },
                  data: Xdata
                }
              ],
              yAxis: [
                {
                  type: "value",
                  // name: "导游数",
                  nameTextStyle: {
                    color: "#05c8db"
                  },
                  axisLabel: {
                    show: false,
                    interval: 0,
                    color: "#05c8db"
                  }
                }
              ],
              series: [
                {
                  data: online,
                  name: "在岗",
                  // stack: "one",
                  type: "bar",
                  label: {
                    show: true,
                    position: "top",
                    color: "#fccb05"
                  },
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "#fccb05"
                        },
                        {
                          offset: 1,
                          color: "#f5804d"
                        }
                      ]),
                      barBorderRadius: 12
                    }
                  }
                },
                {
                  data: offline,
                  name: "离岗",
                  // stack: "one",
                  type: "bar",
                  label: {
                    show: true,
                    position: "top",
                    color: "#8bd46e"
                  },
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "#8bd46e"
                        },
                        {
                          offset: 1,
                          color: "#09bcb7"
                        }
                      ]),
                      barBorderRadius: 12
                    }
                  }
                },
                {
                  data: working,
                  name: "带团",
                  // stack: "one",
                  type: "bar",
                  // barWidth:20,
                  label: {
                    show: true,
                    position: "top",
                    color: "#248ff7"
                  },
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "#248ff7"
                        },
                        {
                          offset: 1,
                          color: "#6851f1"
                        }
                      ]),
                      barBorderRadius: 12
                    }
                  }
                }
              ]
            };
          }
        })
        .catch(e => {});
    },

    //获取投诉建议统计信息
    loadComplainCount() {
      this.$axios({
        url: "/complain/loadComplainCount",
        method: "GET",
        params: {}
      })
        .then(res => {
          let xData = [],
            resolve = [],
            unsolve = [];
          res.desc.forEach(f => {
            xData.push(f.name);
            resolve.push(f.dispose);
            unsolve.push(f.untreated);
          });
          let option = {
            title: {
              text: "|  投诉建议"
            },
            tooltip: {
              trigger: "axis"
            },
            grid: {
              top: 40,
              bottom: "20"
            },
            color: ["#37b70c", "#fae521"],
            legend: {
              top: 0,
              right: 0,
              align: "left",
              data: ["已处理", "未处理"],
              itemGap: 10,
              itemWidth: 10,
              itemHeight: 10
            },
            xAxis: [
              {
                // name: "景区",
                type: "category",
                axisTick: {
                  alignWithLabel: true
                },
                axisLabel: {
                  interval: 0,
                  color: "#05c8db"
                },
                nameTextStyle: {
                  color: "#05c8db"
                },
                data: xData
              }
            ],
            yAxis: [
              {
                type: "value",
                // name: "投诉建议",
                axisLabel: {
                  show: false,
                  interval: 0,
                  color: "#05c8db"
                },
                nameTextStyle: {
                  color: "#05c8db"
                }
              }
            ],
            series: [
              {
                data: resolve,
                name: "已处理",
                type: "bar",
                label: {
                  show: true,
                  position: "top"
                },
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "#fccb05"
                      },
                      {
                        offset: 1,
                        color: "#f5804d"
                      }
                    ]),
                    barBorderRadius: 12
                  }
                }
              },
              {
                data: unsolve,
                name: "未处理",
                barWidth: 30,
                type: "bar",
                label: {
                  show: true,
                  position: "top"
                },
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "#8bd46e"
                      },
                      {
                        offset: 1,
                        color: "#09bcb7"
                      }
                    ]),
                    barBorderRadius: 12
                  }
                }
              }
            ]
          };
          this.complains = option;
        })
        .catch(e => {});
    },

    initComfortChart() {
      let getComfortText = function(e) {
        if (e.value <= 0.2) {
          return "舒适";
        } else if (e.value <= 0.4) {
          return "较舒适";
        } else if (e.value <= 0.6) {
          return "一般";
        } else if (e.value <= 0.8) {
          return "较拥挤";
        } else if (e.value <= 1) {
          return "拥挤";
        }
      };

      let getComfortColor = function(e) {
        if (e <= 0.2) {
          return "#7cbb55";
        } else if (e <= 0.4) {
          return "#9cd6ce";
        } else if (e <= 0.6) {
          return "#ddbd4d";
        } else if (e <= 0.8) {
          return "#e98e2c";
        } else if (e <= 1) {
          return "#e43f3d";
        }
      };

      this.$axios({
        url: "/tourist/loadTicketCount",
        method: "GET",
        params: {
          scenicName: ""
        }
      })
        .then(res => {
          this.curTourists=0
          this.dayTourists=0
          let response = res.desc.map(m => {
            m.comfort = (m.quantity / m.maxThisBear).toFixed(2);
            m.color = getComfortColor(m.comfort);
            this.curTourists += m.quantity;
            this.dayTourists += m.dayQuantity; 
            return m;
          });
          this.comfortArray = response;

          let option = {
            // backgroundColor: '#04184A',

            series: [
              {
                type: "liquidFill",
                // data: [0.6, 0.5, 0.4, 0.3],
                data: [response[0].comfort],
                direction: "right", //波浪方向或者静止
                radius: "50%",
                // 水球颜色
                color: [response[0].color],
                center: ["12%", "50%"], //水球位置
                // outline  外边
                outline: {
                  // show: false
                  borderDistance: 5, //内环padding值
                  itemStyle: {
                    borderWidth: 5, //圆边线宽度
                    borderColor: response[0].color
                  }
                },
                label: {
                  normal: {
                    formatter: getComfortText,
                    // textStyle: {
                    color: response[0].color,
                    insideColor: "yellow",
                    fontSize: 18
                    // }
                  }
                },
                // 内图 背景色 边
                backgroundStyle: {
                  color: "transparent"
                  // borderWidth: 5,
                  // borderColor: '#18ffff',
                }
              },
              {
                type: "liquidFill",
                data: [response[1].comfort],
                direction: "right", //波浪方向或者静止
                radius: "50%",
                // 水球颜色
                color: [response[1].color],
                center: ["37.5%", "50%"], //水球位置
                // outline  外边
                outline: {
                  // show: false
                  borderDistance: 5, //内环padding值
                  itemStyle: {
                    borderWidth: 5, //圆边线宽度
                    borderColor: response[1].color
                  }
                },
                label: {
                  normal: {
                    formatter: getComfortText,
                    // textStyle: {
                    color: response[1].color,
                    insideColor: "yellow",
                    fontSize: 18
                    // }
                  }
                },
                // 内图 背景色 边
                backgroundStyle: {
                  color: "transparent"
                  // borderWidth: 5,
                  // borderColor: 'red',
                }
              },
              {
                type: "liquidFill",
                data: [response[2].comfort],
                direction: "right", //波浪方向或者静止
                radius: "50%",
                // 水球颜色
                color: [response[2].color],
                center: ["62.5%", "50%"], //水球位置
                // outline  外边
                outline: {
                  // show: false
                  borderDistance: 5, //内环padding值
                  itemStyle: {
                    borderWidth: 5, //圆边线宽度
                    borderColor: response[2].color
                  }
                },
                label: {
                  normal: {
                    formatter: getComfortText,
                    // textStyle: {
                    color: response[2].color,
                    insideColor: "yellow",
                    fontSize: 18
                    // }
                  }
                },
                // 内图 背景色 边
                backgroundStyle: {
                  color: "transparent"
                  // borderWidth: 5,
                  // borderColor: 'red',
                }
              },
              {
                type: "liquidFill",
                data: [response[3].comfort],
                direction: "right", //波浪方向或者静止
                radius: "50%",
                // 水球颜色
                color: [response[3].color],
                center: ["87.5%", "50%"], //水球位置
                // outline  外边
                outline: {
                  // show: false
                  borderDistance: 5, //内环padding值
                  itemStyle: {
                    borderWidth: 5, //圆边线宽度
                    borderColor: response[3].color
                  }
                },
                label: {
                  normal: {
                    formatter: getComfortText,
                    color: response[3].color,
                    insideColor: "yellow",
                    fontSize: 18
                  }
                },
                // 内图 背景色 边
                backgroundStyle: {
                  color: "transparent"
                }
              }
            ]
          };
          this.chartComfort = option;
        })
        .catch(e => {});
    },
    
    
  },
  created() {
    setTimeout(() => {
      this.initMap();
    }, 10);
  },
  mounted() {
    setTimeout(() => {
      this.initComfortChart();      
      this.refresh();
    }, 10);
    this.Interval = setInterval(() => {
      this.refresh();
    }, this.$store.state.frequency);
  },
  beforeDestroy() {
    this.map.destroy()
    clearInterval(this.Interval);
  },
  deactivated() {
    clearInterval(this.Interval);
  },
  activated() {
    this.Interval = setInterval(() => {
      this.refresh();
    }, this.$store.state.frequency);
  }
};
</script>
<style lang="stylus">
.scenic-f {
  height: 60%;
}

.scenic-e {
  height: 40%;
  padding-bottom: 8px;
}

.scenic-c {
  height: 60%;
}

.scenic-data {
  height: 40%;
  padding-bottom: 8px;
}

.da-swiper {
  height: 100%;
}

.video-box {
  border: 0.8vh solid rgb(20, 66, 93);
  border-radius: 0.5vh;
  // border-image: $lin 40 20;
}

.cd {
  display: inline-block;
  padding: 0 1.5vh;
  position: relative;
  color: #2ecdf3;
}

.cd:before {
  display: block;
  content: '';
  position: absolute;
  left: 0;
  width: 11px;
  height: 11px;
  top: 0.35vh;
  background: red;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.5);
}

.c1:before {
  background: #7cbb55;
}

.c2:before {
  background: #9cd6ce;
}

.c3:before {
  background: #ddbd4d;
}

.c4:before {
  background: #e98e2c;
}

.c5:before {
  background: #e43f3d;
}

.com-box {
  padding: 0.5vh;

  fieldset {
    margin: 1vh 0.5vh;
    color: #18ffff;
    font-size: 0.16rem;

    border-width 1px {
      legend {
        color: #18ffff;
      }
    }
  }

  .com-quantity {
    font-size: 0.16rem;
    text-align: center;
    margin: 0.5vh auto;
    font-weight: bold;
  }

  .com-footer {
    text-align: center;
    font-size: 1.4vh;
    color: #18ffff;
  }
}

.comfort-box {
  padding: 1vh 3vh;

  div {
    line-height: 1.4vh;
    font-size: 1.4vh;
    margin: 0.5vh 1.5vh;
    display: inline-block;
    position: relative;
  }

  .comfort-1 {
    &:before {
      border-radius: 3px;
      content: '';
      width: 1.4vh;
      height: 1.4vh;
      background: #7CBB55;
      position: absolute;
      left: -20px;
    }
  }

  .comfort-2 {
    &:before {
      border-radius: 3px;
      content: '';
      width: 1.4vh;
      height: 1.4vh;
      background: #9CD6CE;
      position: absolute;
      left: -20px;
    }
  }

  .comfort-3 {
    &:before {
      border-radius: 3px;
      content: '';
      width: 1.4vh;
      height: 1.4vh;
      background: #DDBD4D;
      position: absolute;
      left: -20px;
    }
  }

  .comfort-4 {
    &:before {
      border-radius: 3px;
      content: '';
      width: 1.4vh;
      height: 1.4vh;
      background: #E98E2C;
      position: absolute;
      left: -20px;
    }
  }

  .comfort-5 {
    &:before {
      border-radius: 3px;
      content: '';
      width: 1.4vh;
      height: 1.4vh;
      background: #E43F3D;
      position: absolute;
      left: -20px;
    }
  }
}
</style>
