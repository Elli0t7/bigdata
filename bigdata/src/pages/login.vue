<template>
  <div class="login-page ">
    <div class="absolute-full">
      <echart :options='chart'></echart>
    </div>
    <div class="login-box ">
      <h4 class="text-center text-cyan-12">高淳全域智慧旅游大数据平台</h4>
      <div class="relative-position login-content ">

        <q-input color='cyan-12' :error='$v.userName.$error' error-message='请输入正确的用户名!' dark v-model="userName" label="用户名">
          <template v-slot:prepend>
            <q-icon name='account_box' color='cyan-12' />
          </template>
        </q-input>
        <q-input :error='$v.passWord.$error' dark error-message='请输入正确的密码!' color='cyan-12' type="password" v-model="passWord" label="密码">
          <template v-slot:prepend>
            <q-icon name='vpn_key' color='cyan-12' />
          </template>
        </q-input>
        <div class="row">
          <div class="col-6">
            <q-checkbox dark color='cyan-12' label='记住密码' v-model="rememberAccount" />
          </div>
          <div class="col-6">
            <q-field>
              <!-- <q-checkbox color='white' label='登录到管理后台' v-model="goAdmin" /> -->
            </q-field>
          </div>
        </div>
        <q-btn class="full-width login-btn" size='large' @click="login" color='info'>登录</q-btn>
      </div>
      <q-inner-loading :showing="loading">
        <q-spinner-hourglass size="6rem" color="cyan-12"></q-spinner-hourglass>
        <div class="loadingtext">{{loadingtext}}</div>
      </q-inner-loading>
    </div>
  </div>
</template>

<script>
import anime from 'animejs/lib/anime.es.js';
import echart from "../components/Echart";
import "echarts/map/js/world.js";
import { required, minLength } from "vuelidate/lib/validators";
export default {
  data () {
    return {
      chart: {},
      rememberAccount: true,
      animate: "",
      goAdmin: false,
      loading: false,
      userName: "",
      passWord: "",
      loadingtext: "正在登录…"
    };
  },
  validations: {
    userName: {
      required
    },
    passWord: {
      required
    }
  },
  components: {
    echart
  },
  mounted () {
    this.initChart();
    anime({
      targets: '.login-box',  
      scale:[0,1],   
      duration: 5000,
      delay: 2000
    })
    setTimeout(() => {
      if (this.$q.cookies.has("accountInfo")) {
        let accountInfo = this.$q.cookies.get("accountInfo");
        this.userName = accountInfo.userName;
        this.passWord = accountInfo.passWord;
      }
      document.body.addEventListener("keyup", this.enter);
    }, 200);
  },
  beforeDestroy () {
    document.body.removeEventListener("keyup", this.enter);
  },
  methods: {
    initChart () {
      function randomData () {
        return Math.round(Math.random() * 300);
      }

      var geoCoordMap = {
        上海: [121.4648, 31.2891],
        尼日利亚: [-4.388361, 11.186148],
        美国洛杉矶: [-118.24311, 34.052713],
        香港邦泰: [114.195466, 22.282751],
        美国芝加哥: [-87.801833, 41.870975],
        加纳库马西: [-4.62829, 7.72415],
        英国曼彻斯特: [-1.657222, 51.886863],
        德国汉堡: [10.01959, 54.38474],
        哈萨克斯坦阿拉木图: [45.326912, 41.101891],
        俄罗斯伊尔库茨克: [89.116876, 67.757906],
        巴西: [-48.678945, -10.493623],
        埃及达米埃塔: [31.815593, 31.418032],
        西班牙巴塞罗纳: [2.175129, 41.385064],
        柬埔寨金边: [104.88659, 11.545469],
        意大利米兰: [9.189948, 45.46623],
        马来西亚: [101.681865, 3.136134],
        匈牙利布达佩斯: [17.108519, 48.179162],
        澳大利亚悉尼: [150.993137, -33.675509],
        美国加州: [-121.910642, 41.38028],
        澳大利亚墨尔本: [144.999416, -37.781726],
        墨西哥: [-99.094092, 19.365711],
        加拿大温哥华: [-123.023921, 49.311753],
        广州: [113.5107, 23.2196],
        成都: [103.9526, 30.7617],
        武汉: [114.3896, 30.6628],
        北京: [116.4551, 40.2539],
        南京: [118.8062, 31.9208],        
        桂林:[110.28,25.29],
        韩国:[127.5,37]

      };
      var BJData = [
        [
          {
            name: "马来西亚",
            value: 120
          },
          {
            name: "上海"
          }
        ],
         [
          {
            name: "韩国",
            value: 120
          },
          {
            name: "上海"
          }
        ],
        [
          {
            name: "南京",
            value: 100
          },
          {
            name: "上海"
          }
        ],
        [
          {
            name: "桂林",
            value: 100
          },
          {
            name: "上海"
          }
        ],
        [
          {
            name: "北京",
            value: 100
          },
          {
            name: "上海"
          }
        ],
        [
          {
            name: "广州",
            value: 70
          },
          {
            name: "上海"
          }
        ],
        [
          {
            name: "成都",
            value: 30
          },
          {
            name: "上海"
          }
        ],
        [
          {
            name: "武汉",
            value: 50
          },
          {
            name: "上海"
          }
        ],
       

        [
          {
            name: "香港邦泰",
            value: randomData()
          },
          {
            name: "上海"
          }
        ],
       
       
        [
          {
            name: "英国曼彻斯特",
            value: randomData()
          },
          {
            name: "上海"
          }
        ],
        [
          {
            name: "德国汉堡",
            value: randomData()
          },
          {
            name: "上海"
          }
        ],
        [
          {
            name: "哈萨克斯坦阿拉木图",
            value: randomData()
          },
          {
            name: "上海"
          }
        ],      
        
        [
          {
            name: "埃及达米埃塔",
            value: randomData()
          },
          {
            name: "上海"
          }
        ],
        [
          {
            name: "西班牙巴塞罗纳",
            value: randomData()
          },
          {
            name: "上海"
          }
        ]
        // [
        //   {
        //     name: "柬埔寨金边",
        //     value: randomData()
        //   },
        //   {
        //     name: "上海"
        //   }
        // ],
        // [
        //   {
        //     name: "意大利米兰",
        //     value: randomData()
        //   },
        //   {
        //     name: "上海"
        //   }
        // ],
        // [
        //   {
        //     name: "乌拉圭蒙得维的亚",
        //     value: randomData()
        //   },
        //   {
        //     name: "上海"
        //   }
        // ],
        // [
        //   {
        //     name: "莫桑比克马普托",
        //     value: randomData()
        //   },
        //   {
        //     name: "上海"
        //   }
        // ],
        // [
        //   {
        //     name: "阿尔及利亚阿尔及尔",
        //     value: randomData()
        //   },
        //   {
        //     name: "上海"
        //   }
        // ],
        // [
        //   {
        //     name: "阿联酋迪拜",
        //     value: randomData()
        //   },
        //   {
        //     name: "上海"
        //   }
        // ],
        // [
        //   {
        //     name: "匈牙利布达佩斯",
        //     value: randomData()
        //   },
        //   {
        //     name: "上海"
        //   }
        // ],
        // [
        //   {
        //     name: "澳大利亚悉尼",
        //     value: randomData()
        //   },
        //   {
        //     name: "上海"
        //   }
        // ],
        // [
        //   {
        //     name: "美国加州",
        //     value: randomData()
        //   },
        //   {
        //     name: "上海"
        //   }
        // ],
        // [
        //   {
        //     name: "澳大利亚墨尔本",
        //     value: randomData()
        //   },
        //   {
        //     name: "上海"
        //   }
        // ],
        // [
        //   {
        //     name: "墨西哥",
        //     value: randomData()
        //   },
        //   {
        //     name: "上海"
        //   }
        // ],
        // [
        //   {
        //     name: "加拿大温哥华",
        //     value: randomData()
        //   },
        //   {
        //     name: "上海"
        //   }
        // ]
      ];
      var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var dataItem = data[i];
          var fromCoord = geoCoordMap[dataItem[0].name];
          var toCoord = geoCoordMap[dataItem[1].name];
          if (fromCoord && toCoord) {
            res.push([
              {
                coord: fromCoord,
                value: dataItem[0].value
              },
              {
                coord: toCoord
              }
            ]);
          }
        }
        return res;
      };
      var convertData2 = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var dataItem = data[i];
          var fromCoord = geoCoordMap[dataItem[1].name];
          var toCoord = geoCoordMap[dataItem[0].name];
          if (fromCoord && toCoord) {
            res.push([
              {
                coord: fromCoord,
                value: dataItem[0].value
              },
              {
                coord: toCoord
              }
            ]);
          }
        }
        return res;
      };

      var series = [];
      [["上海", BJData]].forEach(function (item, i) {
        series.push(
          // {
          //   name: "攻击线1",
          //   type: "lines",
          //   zlevel: 2,
          //   effect: {
          //     show: true,
          //     color: "#0bc7f3",
          //     period: 4, //箭头指向速度，值越小速度越快
          //     trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
          //     symbol: "arrow", //箭头图标
          //     symbolSize: 5 //图标大小
          //   },
          //   lineStyle: {
          //     normal: {
          //       color: "#0bc7f3",
          //       width: 1, //尾迹线条宽度
          //       opacity: 0, //尾迹线条透明度
          //       curveness: 0.3 //尾迹线条曲直度
          //     }
          //   },
          //   data: convertData(item[1])
          // },
          {
            name: "业务",
            type: "lines",
            zlevel: 2,
            //  effect: {
            //       symbol: 'arrow',
            //       show: true,
            //       period: 6,
            //       trailLength: 0.5,
            //       color: '#fff',
            //       symbolSize: 8
            //   },
            //   lineStyle: {
            //       normal: {
            //           color: '#c2f555',
            //           width: 0,
            //           curveness: 0.2
            //       }
            //   },
            effect: {
              show: true,
              // color: "#FF0000",
              period: 6, //箭头指向速度，值越小速度越快
              trailLength: 0, //特效尾迹长度[0,1]值越大，尾迹越长重
              symbol: "arrow", //箭头图标
              symbolSize: 8 //图标大小
            },
            lineStyle: {
              normal: {
                // color: "#FF0000",
                width: 1, //尾迹线条宽度
                opacity: 1, //尾迹线条透明度
                curveness: 0.3 //尾迹线条曲直度
              }
            },
            data: convertData2(item[1])
          },
          {
            type: "effectScatter",
            coordinateSystem: "geo",
            zlevel: 2,
            rippleEffect: {
              //涟漪特效
              period: 6, //动画时间，值越小速度越快
              brushType: "stroke", //波纹绘制方式 stroke, fill
              scale: 7 //波纹圆环最大限制，值越大波纹越大
            },
            label: {
              normal: {
                show: true,
                position: "right", //显示位置
                offset: [5, 0], //偏移设置
                formatter: "{b}" //圆环显示文字
              },
              emphasis: {
                show: true,
                color: "#FF6A6A"
              }
            },
            symbol: "circle",
            symbolSize: function (val) {
              return 8 + val[2] / 1000; //圆环大小
            },
            itemStyle: {
              normal: {
                show: true
              },
              emphasis: {
                show: true,
                color: "#FF6A6A"
              }
            },
            data: item[1].map(function (dataItem) {
              return {
                name: dataItem[0].name,
                value: geoCoordMap[dataItem[0].name].concat([dataItem[0].value])
              };
            })
          },
          //被攻击点
          {
            type: "scatter",
            coordinateSystem: "geo",
            zlevel: 2,
            rippleEffect: {
              period: 4,
              brushType: "stroke",
              scale: 4
            },
            label: {
              normal: {
                show: true,
                color: "rgb(121,255,255)",
                position: "right",
                formatter: "{b}"
              },
              emphasis: {
                show: true,
                color: "#FF6A6A"
              }
            },
            symbol: "pin",
            symbolSize: 30,
            itemStyle: {
              normal: {
                show: true,
                color: "red"
              },
              emphasis: {
                show: true,
                color: "#FF6A6A"
              }
            },
            data: [
              {
                name: item[0],
                value: geoCoordMap[item[0]].concat([100]),
                visualMap: false
              }
            ]
          }
        );
      });

      let option = {
        // color:['#a6c84c', '#ffa022', '#46bee9'],
        backgroundColor: "#000",
        // tooltip: {
        //   trigger: "item",
        //   backgroundColor: "#1540a1",
        //   borderColor: "#FFFFCC",
        //   showDelay: 0,
        //   hideDelay: 0,
        //   enterable: true,
        //   transitionDuration: 0,
        //   extraCssText: "z-index:100",
        //   formatter: function(params, ticket, callback) {
        //     //根据业务自己拓展要显示的内容
        //     var res = "";
        //     var name = params.name;
        //     var value = params.value[params.seriesIndex + 1];
        //     res =
        //       "<span style='color:#fff;'>" +
        //       name +
        //       "</span><br/>数据：" +
        //       value;
        //     return res;
        //   }
        // },
        visualMap: {
          //图例值控制
          show: false,
          type: "piecewise",
          pieces: [
            {
              max: 80,
              color: "#a6c84c"
            },
            {
              min: 80,
              max: 120,
              color: "#ffa022"
            },
            {
              min: 120,
              color: "#46bee9"
            }
          ],
          calculable: true
        },
        geo: {
          map: "world",
          show: true,
          label: {
            emphasis: {
              show: false
            }
          },
          roam: false, //是否允许缩放
          layoutCenter: ["10%", "70%"], //地图位置
          layoutSize: "480%",
          itemStyle: {
            normal: {
              show: "true",
              color: "#04284e", //地图背景色
              borderColor: "#5bc1c9" //省市边界线
            },
            emphasis: {
              show: "true",
              color: "rgba(37, 43, 61, .5)" //悬浮背景
            }
          }
        },
        series: series
      };
      this.chart = option;
    },
    enter (e) {
      if (e.keyCode == "13") {
        this.login();
      }
    },
    login () {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.loading = true;
        this.loadingtext = "正在登录…";
        if (!this.goAdmin) {
          this.$axios({
            url: "/navigate/loadNavigate",
            method: "POST",
            data: {
              userName: this.userName,
              password: this.passWord
            }
          })
            .then(response => {
              this.loadingtext = "登录成功！";
              if (this.rememberAccount) {
                this.$q.cookies.set(
                  "accountInfo",
                  JSON.stringify({
                    userName: this.userName,
                    passWord: this.passWord
                  }),
                  {
                    expires: 10
                  }
                );
              } else {
                if (this.$q.cookies.has("accountInfo")) {
                  this.$q.cookies.remove("accountInfo");
                }
              }
              setTimeout(() => {
                this.loading = false;
                this.$store.commit("setToken", 200);
                let guangdian = {
                  gchColumns: [
                    {
                      default: true,
                      subLabel: "guangdian",
                      routerName: "guangdian",
                      scenicId: "10005",
                      isEnabled: 0,
                      icon: "map",
                      id: "ADF7EFD551FF4B9483B85DBFCCA3BC0F",
                      label: "景区概览",
                      ind: "99"
                    }
                  ],
                  default: false,
                  scenicName: "guangdian",
                  routerName: "guangdian",
                  broadcastConfigs: [],
                  icon: null,
                  hkConfigs: [
                    {
                      code: "001002",
                      id: "123",
                      ind: "0",
                      indexCode:
                        "001642,001138,001446,001356,001628,001629,001367,001437,001681",
                      ip: "222.190.138.228",
                      password: "Hik12345+",
                      port: "8099",
                      prefix: "/smc",
                      scenicId: "10001",
                      scenicName: "水慢城",
                      userName: "admin"
                    },
                    {
                      code: "001007",
                      id: "126",
                      ind: "0",
                      indexCode:
                        "001158,001109,001128,001161,001116,001114,001108,001129,001107",
                      ip: "120.195.64.106",
                      password: "Hik12345",
                      port: "8099",
                      prefix: "/yaxi",
                      scenicId: "10002",
                      scenicName: "慢客中心",
                      userName: "admin"
                    },
                    {
                      code: "001007",
                      id: "128",
                      ind: "1",
                      indexCode: "001112,001115,001128,001118",
                      ip: "120.195.115.3",
                      password: "hik12345+",
                      port: "8099",
                      prefix: "/dsyaxi",
                      scenicId: "10002",
                      scenicName: "大山",
                      userName: "admin"
                    },
                    {
                      code: "001007",
                      id: "129",
                      ind: "2",
                      indexCode:
                        "001145,001137,001141,001140,001144,001138,001143,001136,001119",
                      ip: "36.152.18.66",
                      password: "Hik12345",
                      port: "8099",
                      prefix: "/xjyaxi",
                      scenicId: "10002",
                      scenicName: "新建停车场",
                      userName: "admin"
                    },
                    {
                      code: "001007",
                      id: "127",
                      ind: "0",
                      indexCode: "001107,001103,001109,001102",
                      ip: "221.226.142.210",
                      password: "Hik12345",
                      port: "8099",
                      prefix: "/yzs",
                      scenicId: "10003",
                      scenicName: "游子山",
                      userName: "admin"
                    }
                  ],
                  id: "10005",
                  label: "广电",
                  state: true,
                  mapGaode: {
                    mapImageLayer: null,
                    center: "118.869265,31.31952",
                    zoom: "18",
                    id: "f5c2d7b0-11e3-ff39-bb64-e85ddf7c0f4d"
                  },
                  sublabel: null
                };
                //response.desc.push(guangdian)

                this.$store.commit("setPlatforms", response.desc);
                this.$router.push({
                  path: "/index"
                });
              }, 1000);
            })
            .catch(err => {
              this.loadingtext = `登录失败! ${err.msg}`;
              setTimeout(() => {
                this.loading = false;
              }, 1500);
            });
        } else {
          this.$axios({
            url: "/user/login",
            method: "POST",
            data: {
              userName: this.userName,
              password: this.passWord
            }
          })
            .then(response => {
              this.loadingtext = "登录成功！";
              if (this.rememberAccount) {
                this.$q.cookies.set(
                  "accountInfo",
                  JSON.stringify({
                    userName: this.userName,
                    passWord: this.passWord
                  }),
                  {
                    expires: 10
                  }
                );
              } else {
                if (this.$q.cookies.has("accountInfo")) {
                  this.$q.cookies.remove("accountInfo");
                }
              }
              setTimeout(() => {
                this.loading = false;
                this.$store.commit("setToken", 200);
                // this.$store.commit('setPlatforms', response.desc)
                this.$router.push({
                  path: "/Admin"
                });
              }, 1000);
            })
            .catch(err => {
              this.loadingtext = `登录失败! ${err.msg}`;
              setTimeout(() => {
                this.loading = false;
              }, 1500);
            });
        }
      }
    }
  }
};
</script>
<style lang='stylus'>
.login-page {
  // background-image: url('../statics/images/login_bg.jpg');
  // background: #84fab0;
  // background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 100vh;
  color: white;
  position: relative;

  position relative .login-content {
    padding: 0 1rem 0.55rem;
    width: 6rem;
  }

  .login-box {
    position:relative;
    top:30vh;
    width:60vh;
    margin:0 auto;
    transform-origin:50% 50%;
    padding: 0.5rem 2rem;
    background-color: rgba(0, 0, 0, 0.41);
    // border: 1px solid rgba(255, 255, 255, 0.3);
    z-index: 12;
    box-shadow: 0px 0px 25px rgb(121, 255, 255);

    .q-if-label {
      color: white;
      font-size: 0.18rem;
    }

    .q-if-control {
      color: white;
      font-size: 0.26rem;
    }

    .q-inner-loading {
      z-index: 130;
      background: rgba(0, 0, 0, 0.64);
    }
  }

  .loadingtext {
    color: $cyan-12;
  }

  #loginCanvas {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .login-btn {
    margin: 0.5rem 0 1rem;
    letter-spacing: 20px;
  }

  #slider {
    width: 100%;
    height: 100%;
    background-size: cover;
  }

  .nivoSlider {
    // background: url("../images/loading.gif") no-repeat 50% 50% rgb(255, 255, 255);
    // width:100%;
    // height:100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    overflow: hidden;
  }

  .nivoSlider img {
    left: 0px;
    top: 0px;
    display: none;
    position: absolute;
    height: 100px;
  }

  .nivoSlider a {
    border: 0px currentColor;
    display: block;
  }

  .nivo-controlNav {
    left: 384px;
    width: 193px;
    height: 38px;
    bottom: -14px;
    padding-top: 14px;
    padding-left: 50px;
    position: absolute;
    z-index: 9;
    // background-image: url("../images/bullets-bg.png");
    background-repeat: no-repeat;
  }

  .nivo-controlNav a {
    // background: url("../images/bullets.png") no-repeat;
    border: 0px currentColor;
    width: 23px;
    height: 17px;
    text-indent: -9999px;
    margin-right: 3px;
    float: left;
    display: block;
  }

  .nivo-controlNav a.active {
    background-position: 0px -17px;
  }

  .nivo-directionNav a {
    // background: url("../images/arrows.png") no-repeat;
    border: 0px currentColor;
    width: 65px;
    height: 65px;
    text-indent: -9999px;
    display: block;
  }

  a.nivo-nextNav {
    background-position: -65px 0px;
    top: 151px;
    right: 30px;
  }

  a.nivo-prevNav {
    left: 30px;
    top: 151px;
  }

  a.nivo-nextNav:hover {
    background-position: -65px -65px;
    top: 151px;
    right: 30px;
  }

  a.nivo-prevNav:hover {
    background-position: 0px -65px;
    left: 30px;
    top: 151px;
  }

  .nivo-caption {
    font-family: Helvetica, Arial, sans-serif;
  }

  .nivo-caption a {
    color: rgb(255, 255, 255);
    border-bottom-color: rgb(255, 255, 255);
    border-bottom-width: 1px;
    border-bottom-style: dotted;
  }

  .nivo-caption a:hover {
    color: rgb(255, 255, 255);
  }

  /* nivoSlider */
  .nivoSlider {
    position: relative;
  }

  .nivoSlider img {
    left: 0px;
    top: 0px;
    position: absolute;
  }

  .nivoSlider a.nivo-imageLink {
    margin: 0px;
    padding: 0px;
    border: 0px currentColor;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    display: none;
    position: absolute;
    z-index: 6;
  }

  .nivoSlider {
    position: relative;
  }

  .nivoSlider img {
    left: 0px;
    top: 0px;
    position: absolute;
  }

  .nivoSlider a.nivo-imageLink {
    margin: 0px;
    padding: 0px;
    border: 0px currentColor;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    display: none;
    position: absolute;
    z-index: 6;
  }

  .nivo-slice {
    height: 100%;
    display: block;
    position: absolute;
    z-index: 5;
  }

  .nivo-box {
    display: block;
    position: absolute;
    z-index: 5;
  }

  .nivo-caption {
    background: rgb(0, 0, 0);
    left: 0px;
    width: 30%;
    bottom: 0px;
    color: rgb(255, 255, 255);
    display: none;
    position: absolute;
    z-index: 8;
    opacity: 0.8;
  }

  .nivo-caption p {
    margin: 0px;
    display: none;
  }

  .nivo-caption a {
    display: inline !important;
  }

  .nivo-html-caption {
    display: none;
  }

  .nivo-directionNav a {
    top: 45%;
    position: absolute;
    z-index: 9;
    cursor: pointer;
  }

  .nivo-prevNav {
    left: 0px;
  }

  .nivo-nextNav {
    right: 0px;
  }

  .nivo-controlNav a {
    position: relative;
    z-index: 9;
    cursor: pointer;
  }

  .nivo-controlNav a.active {
    font-weight: bold;
  }
}
</style>
