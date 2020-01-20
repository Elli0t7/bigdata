<template>
  <q-page ref='page' class="page row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3 cust-col section-padding">
      <div class="column fit">
        <div class="col-4 full-width section-bg">
          <video controls loop autoplay='true' class="bg-black" muted='true' width="100%" height="100%" src="statics/videos/gc5.mp4"></video>
        </div>
        <div class="col-8 full-width" style="padding-top:1vh">
          <left-carousel :refreshtime='refreshtime' />
        </div>
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-7 cust-col">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-9 ">
          <div class="section-padding">
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
        </div>
        <div class="col-xs-6 col-sm-6 col-md-6 col-lg-3 col-xl-3">
          <div class="section-padding">
            <div class="overview-box section-bg">
              <div class="overview-header">导游数量</div>
              <div class="row">
                <div class="col">
                  <div class="overview-quantity">
                    <countTo class='text-pl' :endVal="guide.work" :duration="600" />
                  </div>
                  <div class="overview-footer">带团</div>
                </div>
                <div class="col">
                  <div class="overview-quantity">
                    <countTo class='text-rl' :endVal="guide.mountGuard" :duration="600" />
                  </div>
                  <div class="overview-footer">在岗</div>
                </div>
                <div class="col">
                  <div class="overview-quantity">
                    <countTo class='text-pl' :endVal="guide.all" :duration="600" />
                  </div>
                  <div class="overview-footer">全部</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <swiper id="my-swiper" :options="swiperOption" @slideChange='slideChange' ref="mySwiper">
        <swiper-slide class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-9 ">
            <div class="section-padding">
              <div class="overview-box section-bg">
                <div class="overview-header">{{platforms[1].label}}</div>
                <div class="row">
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-rl'  :endVal="curTourists" :duration="600" />
                    </div>
                    <div class="overview-footer">当前游客数</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-pl'  :endVal="dayTourists" :duration="600" />
                    </div>
                    <div class="overview-footer">今日游客数</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-pl'  :endVal="dayParkinglot" :duration="600" />
                    </div>
                    <div class="overview-footer">今日入园车辆</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-bl'  :endVal="curParkinglot" :duration="600" />
                    </div>
                    <div class="overview-footer">当前在园车辆</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-rl'  :endVal="surplusParkinglot" :duration="600" />
                    </div>
                    <div class="overview-footer">剩余车位</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-3 col-xl-3">
            <div class="section-padding">
              <div class="overview-box section-bg">
                <div class="overview-header">导游数量</div>
                <div class="row">
                  <div class="col">
                    <div class="overview-quantity">                     
                      <countTo class='text-pl'  :endVal="guide.work" :duration="600" />
                    </div>
                    <div class="overview-footer">带团</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">                     
                      <countTo class='text-rl'  :endVal="guide.mountGuard" :duration="600" />
                    </div>
                    <div class="overview-footer">在岗</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">                     
                      <countTo class='text-pl'  :endVal="guide.all" :duration="600" />
                    </div>
                    <div class="overview-footer">全部</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </swiper-slide>
        <swiper-slide class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-9 ">
            <div class="section-padding">
              <div class="overview-box section-bg">
                <div class="overview-header">{{platforms[2].label}}</div>
                <div class="row">
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-rl'  :endVal="curTourists" :duration="600" />
                    </div>
                    <div class="overview-footer">当前游客数</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-pl'  :endVal="dayTourists" :duration="600" />
                    </div>
                    <div class="overview-footer">今日游客数</div>
                  </div>

                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-pl'  :endVal="dayParkinglot" :duration="600" />
                    </div>
                    <div class="overview-footer">今日入园车辆</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-bl'  :endVal="curParkinglot" :duration="600" />
                    </div>
                    <div class="overview-footer">当前在园车辆</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-rl'  :endVal="surplusParkinglot" :duration="600" />
                    </div>
                    <div class="overview-footer">剩余车位</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-3 col-xl-3">
            <div class="section-padding">
              <div class="overview-box section-bg">
                <div class="overview-header">导游数量</div>
                <div class="row">
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-pl'  :endVal="guide.work" :duration="600" />
                    </div>
                    <div class="overview-footer">带团</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-rl'  :endVal="guide.mountGuard" :duration="600" />
                    </div>
                    <div class="overview-footer">在岗</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-pl'  :endVal="guide.all" :duration="600" />
                    </div>
                    <div class="overview-footer">全部</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </swiper-slide>
        <swiper-slide class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-9 ">
            <div class="section-padding">
              <div class="overview-box section-bg">
                <div class="overview-header">{{platforms[3].label}}</div>
                <div class="row">
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-rl'  :endVal="curTourists" :duration="600" />
                    </div>
                    <div class="overview-footer">当前游客数</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-pl'  :endVal="dayTourists" :duration="600" />
                    </div>
                    <div class="overview-footer">今日游客数</div>
                  </div>

                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-pl'  :endVal="dayParkinglot" :duration="600" />
                    </div>
                    <div class="overview-footer">今日入园车辆</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-bl'  :endVal="curParkinglot" :duration="600" />
                    </div>
                    <div class="overview-footer">当前在园车辆</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-rl'  :endVal="surplusParkinglot" :duration="600" />
                    </div>
                    <div class="overview-footer">剩余车位</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-3 col-xl-3">
            <div class="section-padding">
              <div class="overview-box section-bg">
                <div class="overview-header">导游数量</div>
                <div class="row">
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-pl'  :endVal="guide.work" :duration="600" />
                    </div>
                    <div class="overview-footer">带团</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-rl'  :endVal="guide.mountGuard" :duration="600" />
                    </div>
                    <div class="overview-footer">在岗</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-pl'  :endVal="guide.all" :duration="600" />
                    </div>
                    <div class="overview-footer">全部</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </swiper-slide>
        <swiper-slide class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 ">
            <div class="section-padding">
              <div class="overview-box section-bg">
                <div class="overview-header">{{platforms[4].label}}</div>
                <div class="row">
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-rl'  :endVal="curTourists" :duration="600" />
                    </div>
                    <div class="overview-footer">当前游客数</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-pl'  :endVal="dayTourists" :duration="600" />
                    </div>
                    <div class="overview-footer">今日游客数</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-pl'  :endVal="dayParkinglot" :duration="600" />
                    </div>
                    <div class="overview-footer">今日入园车辆</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-bl'  :endVal="curParkinglot" :duration="600" />
                    </div>
                    <div class="overview-footer">当前在园车辆</div>
                  </div>
                  <div class="col">
                    <div class="overview-quantity">
                      <countTo class='text-rl'  :endVal="surplusParkinglot" :duration="600" />
                    </div>
                    <div class="overview-footer">剩余车位</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper> -->

      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 section-padding relative-position">
          <div style="height:72vh" id="allmap"></div>
        </div>
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 cust-col section-padding ">
      <div class="column fit  ">
        <div class="col-6 section-bg section-padding">
          <div class="column fit">
            <div class="col-10">
              <echart :options='chartComfort' />
            </div>
            <div class="col-2 comfort-box">
              <div class="comfort-1">舒适</div>
              <div class="comfort-2">较舒适</div>
              <div class="comfort-3">一般</div>
              <div class="comfort-4">较拥挤</div>
              <div class="comfort-5">拥挤</div>
            </div>
          </div>
        </div>
        <div class="col-6  seciton-padding " style="padding-top:1vh">
          <div class="fit section-bg">
            <div class="com-box fit">
              <div class="overview-header " style="margin:1vh auto;">投诉建议</div>
              <fieldset :key='index' v-for="(item,index) in complains">
                <legend style="color:#18ffff">{{item.name}}</legend>
                <div class="row">
                  <div class="col">
                    <div class="com-quantity">
                      <countTo class='text-bl' :endVal="item.dispose" :duration="600" />
                    </div>
                    <div class="com-footer">已处理</div>
                  </div>
                  <div class="col">
                    <div class="com-quantity">
                      <countTo class='text-rl' :endVal="item.untreated" :duration="600" />
                    </div>
                    <div class="com-footer">未处理</div>
                  </div>
                  <div class="col">
                    <div class="com-quantity">
                      <countTo class='text-pl' :endVal="item.all" :duration="600" />
                    </div>
                    <div class="com-footer">全部</div>
                  </div>
                </div>
              </fieldset>

            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { animate } from "quasar";
require("echarts-liquidfill/src/liquidFill");
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
      complains: [],
      chartComfort: {},
      fullscreen: false,
      mapHeight: {},
      curTourists: 0,
      dayTourists: 0,
      curParkinglot: 0,
      dayParkinglot: 0,
      surplusParkinglot: 0,
      map: {},
      mapOptions: {},
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
    platforms() {
      return JSON.parse(this.$q.sessionStorage.get.item("platforms"));
    }
    // mySwiper() {
    //   return this.$refs.mySwiper
    // }
  },
  methods: {
    fullscreenChange(e) {
      console.log(e);
    },
    toggleFullscreen() {
      let el = document.getElementById("video-box");
      if (!this.fullscreen) {
        animate.start({
          from: 20,
          to: 100,
          apply(pos) {
            el.style.width = `${pos}%`;
            el.style.height = `${pos}%`;
          }
        });
      } else {
        animate.start({
          from: 100,
          to: 20,
          apply(pos) {
            el.style.width = `${pos}%`;
            el.style.height = `${pos}%`;
          }
        });
      }
      this.fullscreen = !this.fullscreen;
    },
    // slideChange() {
    //   // let index = this.mySwiper.swiper.activeIndex
    //   // let scenicName = this.platforms[index + 1].scenicName
    //   this.loadTicketCount()
    //   this.loadParkCount()
    //   this.loadTourGuideCount(scenicName)

    // },
    format(value) {
      return `${parseInt(value)}`;
    },
    initMap() {
      let _this = this;
      this.mapOptions = {
        center: this.platform.mapGaode.center.split(","), //[116.397428, 39.90923]
        resizeEnable: true,
        zoom: 11,
        zoom: parseInt(this.platform.mapGaode.zoom, 10)
        //  features: ['bg', 'road', 'building',]
        //showLabel: false
      };

      let mapImageLayer = this.platform.mapGaode.mapImageLayer;
      if (mapImageLayer != null) {
        let imageLayer = new AMap.ImageLayer({
          opacity: 1,
          // url:'/statics/images/quanyu.png',
          url: mapImageLayer.url,
          bounds: new AMap.Bounds(
            //[118.723201,31.520065],[119.178741,31.486144]
            JSON.parse(mapImageLayer.bounds)[0],
            JSON.parse(mapImageLayer.bounds)[1]
          ),
          //zooms:[5,15],
          zooms: JSON.parse(mapImageLayer.zooms)
        });
        this.mapOptions.layers = [new AMap.TileLayer(), imageLayer];
      }
      this.map = new AMap.Map("allmap", this.mapOptions);

      //初始化高德地图
      // this.map = new AMap.Map('allmap', mapOptions)

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
    refresh() {
      this.loadComplainCount();
      this.loadTicketCount();
      this.loadParkCount();
      this.loadTourGuideCount();
      this.refreshtime = new Date();
    },
    //首页停车场车流统计
    loadParkCount() {
      this.$axios({
        url: "/loadParkCount",
        method: "GET"
      })
        .then(res => {
          this.curParkinglot = 0;
          this.dayParkinglot = 0;
          this.surplusParkinglot = 0;
          this.curParkinglot = res.desc.quantity;
          this.dayParkinglot = res.desc.dayQuantity;
          this.surplusParkinglot = res.desc.surplus;
        })
        .catch(e => {});
    },
    //获取导游统计信息
    loadTourGuideCount(scenicName) {
      this.guide = {
        work: 0,
        all: 0,
        mountGuard: 0,
        notMountGuard:0
      };
      this.$axios({
        url: "/tourGuide/loadTourGuideCount",
        method: "GET"
      })
        .then(res => {
          if (res.desc.length > 0) {
           
            res.desc.forEach(f=>{
              this.guide.notMountGuard+=f.notMountGuard
              this.guide.mountGuard+=f.mountGuard
              this.guide.work+=f.work
              this.guide.all+=f.all
            })
            ;
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
          this.complains = res.desc;
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
          let response = res.desc.map(m => {
            m.comfort = (m.quantity / m.maxThisBear).toFixed(2);
            m.color = getComfortColor(m.comfort);
            return m;
          });

          let option = {
            // backgroundColor: '#04184A',
            title: [
              {
                text: "景区舒适度"
              },
              {
                text: response[0].name,
                left: "28%",
                top: "45%",
                textAlign: "center",
                textStyle: {
                  fontWeight: "normal",
                  color: "#18ffff",
                  fontSize: 15,
                  textAlign: "center"
                }
              },
              {
                text: response[1].name,
                left: "73%",
                top: "45%",
                textAlign: "center",
                textStyle: {
                  fontWeight: "normal",
                  color: "#18ffff",
                  fontSize: 15,
                  textAlign: "center"
                }
              },
              {
                text: response[2].name,
                left: "28%",
                top: "90%",
                textAlign: "center",
                textStyle: {
                  fontWeight: "normal",
                  color: "#18ffff",
                  fontSize: 16,
                  textAlign: "center"
                }
              },
              {
                text: response[3].name,
                left: "73%",
                top: "90%",
                textAlign: "center",
                textStyle: {
                  fontWeight: "normal",
                  color: "#18ffff",
                  fontSize: 15,
                  textAlign: "center"
                }
              }
            ],
            series: [
              {
                type: "liquidFill",
                // data: [0.6, 0.5, 0.4, 0.3],
                data: [response[0].comfort],
                direction: "right", //波浪方向或者静止
                radius: "35%",
                // 水球颜色
                color: [response[0].color],
                center: ["28%", "25%"], //水球位置
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
                radius: "35%",
                // 水球颜色
                color: [response[1].color],
                center: ["73%", "25%"], //水球位置
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
                radius: "35%",
                // 水球颜色
                color: [response[2].color],
                center: ["28%", "73%"], //水球位置
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
                radius: "35%",
                // 水球颜色
                color: [response[3].color],
                center: ["73%", "73%"], //水球位置
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
                    // textStyle: {
                    color: response[3].color,
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
              }
            ]
          };
          // let da= res.desc.quantity*100/res.desc.maxThisBear
          // this.chartComfort.series[0].data=[0.5]

          this.chartComfort = option;
        })
        .catch(e => {});
    },
    //首页票务客流统计
    loadTicketCount() {
      // color: [
      //             [0.2, "#7CBB55"],
      //             [0.4, "#9CD6CE"],
      //             [0.6, "#DDBD4D"],
      //             [0.8, "#E98E2C"],
      //             [1, "#E43F3D"]
      //           ]

      this.$axios({
        url: "/tourist/loadTicketCount",
        method: "GET"
      })
        .then(res => {
          this.curTourists = 0;
          this.dayTourists = 0;
          res.desc.forEach(f => {
            this.curTourists += f.quantity;
            this.dayTourists += f.dayQuantity;
          });
          // this.curTourists = res.desc[0].quantity
          // this.dayTourists = res.desc[0].dayQuantity
        })
        .catch(e => {});
    }
  },
  mounted() {
    setTimeout(() => {
      this.initComfortChart();
      // this.slideChange();
      this.refresh();
      this.initMap();
    }, 100);
    this.Interval = setInterval(() => {
      this.refresh();
    }, this.$store.state.frequency);
  },
  beforeDestroy() {
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
