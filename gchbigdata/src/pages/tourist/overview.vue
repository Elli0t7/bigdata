<template>
  <div class="root-box">
    <div class=" text-bl">
      <div class="row fit">
        <div class="col-3"></div>
        <div class="col-6 page-header">{{name}}景区公共信息平台 </div>
        <div class="col-1"></div>
        <div class="col-2">
          <clock />
        </div>
      </div>
    </div>
    <div class="page-body">
      <div class="column fit">
        <div class="col-6">
          <div class="row fit">
            <div class="col-6 section">
              <div class="sec-c column">
                <div class="col-2">
                  <div class="c-t">
                    <div class="c-t-box fit">
                      <div class="ct-t-t ">天气预报</div>
                      <!-- <iframe width="400" scrolling="no" height="100" frameborder="0" allowtransparency="true" src="//i.tianqi.com/index.php?c=code&id=19&icon=1&temp=1&num=5&site=19&py=gaochun"></iframe> -->
                    </div>
                  </div>
                </div>
                <div class="col-10">
                  <div id='mobile2' class="row fit" v-html='mobile2'>
                    <!-- <div class="col-3"></div>
                    <div class="col-9" >
                      <div class="row fit" v-html='mobile2'></div>
                    </div> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="col-3 section">
              <div class="sec-c column">
                <div class="col-2">
                  <div class="c-t">
                    <div class="c-t-box fit">
                      <div class="ct-t-t ">今日游客实时播报</div>
                    </div>
                  </div>
                </div>
                <div class="col-2 d-tb">
                  <div class="d-tc text-green-12 tourist-t">实时在园人数</div>
                </div>
                <div class="col-3 ">
                  <div class="row items-end">
                    <div class="col-10 text-right">
                      <countTo class='text-rl num' :endVal="realTourist" :duration="600" />
                    </div>
                    <div class="col-2 text-right">
                      <div class="d-tc-b">人</div>
                    </div>
                  </div>
                </div>
                <div class="col-2 d-tb">
                  <div class="d-tc text-pl tourist-t">今日入园人数</div>
                </div>
                <div class="col-3 ">
                  <div class="row items-end">
                    <div class="col-10 text-right">
                      <countTo class='text-rl num' :endVal="dayTourist" :duration="600" />
                    </div>
                    <div class="col-2 text-right">
                      <div class="d-tc-b">人</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-3 section">
              <div class="sec-c column">
                <div class="col-2">
                  <div class="c-t">
                    <div class="c-t-box fit">
                      <div class="ct-t-t ">车位使用情况</div>
                    </div>
                  </div>
                </div>
                <div class="col-10">
                  <echart :options='parking' />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="row fit">
            <div class="col-6 section">
              <div class="sec-c column">
                <div class="col-2">
                  <div class="c-t">
                    <div class="c-t-box fit">
                      <div class="ct-t-t ">景区最大承载量</div>
                    </div>
                  </div>
                </div>
                <div class="col-10">
                  <echart :options='bear' />
                </div>
              </div>
            </div>
            <div class="col-6 section">
              <div class="sec-c column">
                <div class="col-2">
                  <div class="c-t">
                    <div class="c-t-box fit">
                      <div class="ct-t-t ">景区舒适度</div>
                    </div>
                  </div>
                </div>
                <div class="col-10">
                  <div class="row fit" style="padding-top:2vh">

                    <div class="col-6 overflow-hidden">
                      <iframe name="weather_inc" src="http://i.tianqi.com/index.php?c=code&id=55&py=gaochun" width="255"
                        height="294" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>
                    </div>
                    <div class="col-6">
                      <echart :options='comfortDegree' />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  require('echarts-liquidfill/src/liquidFill')
  import countTo from "vue-count-to";
  import Echart from "../../components/Echart";
  import Clock from '../../components/clock'
  export default {
    data() {
      return {
        name: '',
        mobile2: '',
        realTourist: 0,
        dayTourist: 0,
        bear: {},
        parking: {},
        comfortDegree: {},
        scenicName: '',
        interval: ''
      }
    },
    watch: {
      '$route'(to, from) {
        this.init()
        this.refresh()
      },
      scenicName() {
        this.init()
        this.refresh()
      }
    },
    components: {
      countTo,
      Echart,
      Clock
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        if (this.$route.params.scenicName) {
          this.scenicName = this.$route.params.scenicName
          switch (this.scenicName) {
            case 'shumancheng':
              this.name = '水慢城'
              break;
            case 'yzs':
              this.name = '游子山'
              break;
            case 'yaxi':
              this.name = '高淳国际慢城'
              break;
            case 'gc':
              this.name = '高淳老街'
              break;
            default:
              break;
          }
        }
      },
      refresh() {        
        this.loadTicketCount()
        this.loadParkCount()
      },
      format(value) {
        return `${parseInt(value)}`;
      },
      loadTicketCount() {
        let getComfortColor = function (e) {
          if (e <= 0.2) {
            return '#7cbb55'
          } else if (e <= 0.4) {
            return '#9cd6ce'
          } else if (e <= 0.6) {
            return '#ddbd4d'
          } else if (e <= 0.8) {
            return '#e98e2c'
          } else if (e <= 1) {
            return '#e43f3d'
          }
        }

        let nowColor = '#49d088',
          dayColor = '#49d088',
          now = 0,
          day = 0;
        this.$axios({
            url: "/tourist/loadTicketCount",
            method: "GET",
            params: {
              scenicName: this.scenicName
            }
          })
          .then(res => {
            this.realTourist = res.desc[0].quantity;
            this.dayTourist = res.desc[0].dayQuantity;

            let max = 0;
            max = res.desc[0].maxThisBear;
            now = (res.desc[0].quantity / res.desc[0].maxThisBear).toFixed(6)
            day = (res.desc[0].dayQuantity / res.desc[0].maxDayBear).toFixed(6)
            nowColor = getComfortColor(now)
            dayColor = getComfortColor(day)

            let level = [{
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
              series: [{
                name: "当前在园人数",
                type: "gauge",
                min: 0,
                max: max,
                radius: "95%",
                // center:['35%','55%'],
                axisLine: {
                  show: true,
                  lineStyle: {
                    width: 20,
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
                  length: 25,
                  lineStyle: {
                    //color:'black'
                  }
                },
                axisLabel: {
                  formatter: function (e) {
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
                    fontSize: 14,
                    fontWeight: ""
                  }
                },
                pointer: {
                  show: true
                },
                detail: {
                  //show:false,
                  formatter: function (param) {
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
                    fontSize: 22,
                    fontWeight: 600
                  }
                },
                data: [{
                  name: "",
                  value: res.desc[0].quantity
                }]
              }]
            };

            let bear = {

              title: [{
                text: '瞬时最大承载量',
                left: '30%',
                top: '12%',
                textAlign: 'center',
                textStyle: {
                  fontWeight: 'normal',
                  color: '#4842fb',
                  fontSize: 18,
                  textAlign: 'center',
                }
              }, {
                text: `${res.desc[0].maxThisBear} 人`,
                left: '30%',
                bottom: '3%',
                textAlign: 'center',
                textStyle: {
                  fontWeight: 'bolder',
                  color: '#f7335e',
                  fontSize: 26,
                  textAlign: 'center',
                }
              }, {
                text: '日最大承载量',
                left: '75%',
                top: '12%',
                textAlign: 'center',
                textStyle: {
                  fontWeight: 'normal',
                  color: '#4842fb',
                  fontSize: 18,
                  textAlign: 'center',
                }
              }, {
                text: `${res.desc[0].maxDayBear} 人`,
                left: '75%',
                bottom: '3%',
                textAlign: 'center',
                textStyle: {
                  fontWeight: 'bolder',
                  color: '#f7335e',
                  fontSize: 26,
                  textAlign: 'center',
                }
              }],
              series: [{
                type: 'liquidFill',
                // data: [0.6, 0.5, 0.4, 0.3],
                data: [now],
                direction: 'right', //波浪方向或者静止
                radius: '55%',
                // 水球颜色
                color: [nowColor],
                center: ['30%', '55%'], //水球位置
                // outline  外边
                outline: {
                  // show: false
                  borderDistance: 5,
                  itemStyle: {
                    borderWidth: 8,
                    borderColor: nowColor,
                  },
                },
                label: {
                  normal: {
                    formatter: function (p) {
                      return (p.data * 100).toFixed(3) + '%'
                    },
                    textStyle: {
                      color: '#29d5fd',
                      insideColor: 'yellow',
                      fontSize: 35
                    }
                  }
                },
                // 内图 背景色 边
                backgroundStyle: {
                  color: 'transparent',
                  // borderWidth: 5,
                  // borderColor: 'red',
                }
              }, {
                type: 'liquidFill',
                data: [day],
                direction: 'right', //波浪方向或者静止
                radius: '55%',
                // 水球颜色
                color: [dayColor],
                center: ['75%', '55%'], //水球位置
                // outline  外边
                outline: {
                  // show: false
                  borderDistance: 5, //内环padding值
                  itemStyle: {
                    borderWidth: 8, //圆边线宽度
                    borderColor: dayColor,
                  },
                },
                label: {
                  normal: {
                    formatter: function (p) {
                      return (p.data * 100).toFixed(3) + '%'
                    }, //重置百分比字体为空
                    textStyle: {
                      color: '#29d5fd',
                      insideColor: 'yellow',
                      fontSize: 35
                    }
                  }
                },
                // 内图 背景色 边
                backgroundStyle: {
                  color: 'transparent',
                  // borderWidth: 5,
                  // borderColor: 'red',
                }
              }]
            };
            this.comfortDegree = option;
            this.bear = bear;
          })
          .catch(e => {});
      },
      //首页停车场车流统计
      loadParkCount() {

        let option = {
          title: [{
            text: '0%',
            left: 'center',
            top: 'center',
            textStyle: {
              fontSize: 33,
              color: '#00F5FF'
            }
          }, {
            text: '123',
            left: 'left',
            top: 'bottom',
            textStyle: {
              fontSize: 14,
              color: '#00F5FF'
            }
          }],
          legend: {
            top: '5%',
            left: 'left'
          },
          series: [{
            color: ["#00F5FF", "#FE5555"],
            name: '访问来源',
            type: 'pie',
            radius: ['55%', '63%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 12
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: [{
                value: 0,
                name: '剩余车位',

              },
              {
                value: 0,
                name: '已用车位',

              }
            ]
          }]
        };
        this.$axios({
          url: '/loadParkCount',
          method: 'GET',
          params: {
            scenicName: this.scenicName
          }
        }).then(res => {
          option.series[0].data[1].value = res.desc.quantity
          option.series[0].data[0].value = res.desc.surplus
          option.title[0].text = `${(res.desc.surplus/(res.desc.quantity+res.desc.surplus)*100).toFixed(1)}%`
          option.title[1].text = `已用：${res.desc.quantity}   剩余：${res.desc.surplus}`
          this.parking = option;
        }).catch(e => {

        })
      },
      getWeather() { 
       
          this.$axios({              
          //url: '/tq/index.php?c=code&id=19&icon=1&temp=1&num=5&site=19&py=gaochun',
           url:'tianqi',
          params:{
            py:'gaochun',
            id:'19'
          }
         
        }).then((r) => {
          let weatherPage = document.createElement('div')
          weatherPage.innerHTML = r.desc;
          for (let i = 0; i < weatherPage.childNodes.length; i++) {
            if (weatherPage.childNodes[i].id == 'mobile2') {
              // this.mobile2=weatherPage.childNodes[i].innerHTML

              this.mobile2 = weatherPage.childNodes[i].children[1].innerHTML
              break
            }
          }

        }).catch(e => {
          console.log(e)
        })
        
        
      }
    },
    mounted() {

      this.refresh()
      this.interval = setInterval(() => {
        this.refresh()
      }, 60000)
     
      this.getWeather()
      setInterval(() => {
        this.getWeather()
      }, 60*60*1000);
    },
  }

</script>

<style>
  .root-box {
    height: 100vh;
    width: 100vw;
    color: white;
    background: linear-gradient(45deg, #1c1d2f, #3d4082);
  }

  .page-header {
    height: 10vh;
    text-align: center;
    line-height: 10vh;
    font-size: 4vh;

  }

  .page-body {
    height: 90vh;
    padding: 0 6vh 1vh;
  }

  .section {
    width: 100%;
    height: 100%;
    padding: 0 1.5vh 3vh;
  }

  .sec-c {
    background: rgba(255, 255, 255, .05);
    width: 100%;
    height: 100%;
    border-radius: 2px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, .2), 0 2px 2px rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .12);
    vertical-align: top;
    padding: 0 6vh 2vh;
  }

  .c-t {
    font-size: 2.6vh;
    text-align: center;
    height: 100%;
    border-bottom: 1px solid #29d5fd;
    ;
  }

  .c-t-box {
    display: table;
  }

  .ct-t-t {
    color: #29d5fd;
    display: table-cell;
    vertical-align: middle;
  }

  .d-tb {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .d-tc {
    position: absolute;
    top: 50%;
    transform: translateY(-50%)
  }

  .d-tc-b {
    font-size: 2vh;
    line-height: 2.6vh;
    padding-bottom: 1vh;

  }

  .num {
    font-size: 6vh;
    font-weight: bold;
    font-family: DinBold;
  }

  .tourist-t {
    font-size: 2.4vh;
  }

  #mobile2 {
    text-align: center;
    overflow: hidden;
    cursor: pointer;
  }

  #mobile2 .wt {
    float: left;
    width: 20%;
    padding-top: 2vh;
  }

  #mobile2 .wt2 {
    display: none;
    float: left;
    margin-top: 1px;
    width: 145px;
    padding-top: 3vh;
  }

  #mobile2 .wtpic {
    width: 100%;
    font-size: 2.2vh
  }

  /* #mobile2 .wtpath{height:18px; line-height:18px; float:left; width:100%;} */

  #mobile2 .wtpath,
  .wtwt,
  .wtfx {
    font-size: 1.8vh;
    line-height: 3.2vh;
    float: left;
    width: 100%;
    text-align: center;
    overflow: hidden;
  }

  #mobile2 .img {
    margin: 3.6vh 22px;
  }

  #mobile2 .day {
    display: block;
    padding: 2vh;
  }

  #mobile2 .red {
    color: #f7335e;
  }

  #mobile2 .blue {
    color: #06c;
  }

</style>
