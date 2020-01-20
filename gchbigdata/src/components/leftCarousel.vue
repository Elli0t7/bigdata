<template>
  <q-carousel :key="platform.id" color="yellow" class="round-border section-bg" quick-nav infinite :autoplay="autoplay"
    height="100%">
    <template v-if="platform.id=='10000'">
      <q-carousel-slide class="flex flex-center section-padding">
        <echart :options='p2c1' />
      </q-carousel-slide>
      <q-carousel-slide class="flex flex-center section-padding">
        <echart :options='p2c2' />
      </q-carousel-slide>
      <q-carousel-slide class="flex flex-center section-padding">
        <echart :options='p3c1' />
      </q-carousel-slide>
      <q-carousel-slide class="flex flex-center section-padding">
        <echart :options='p3c2' />
      </q-carousel-slide>
    </template>
    <template v-else>
      <q-carousel-slide class="flex flex-center section-padding">
        <div class="column fit">
          <div class="col-6">
            <echart :options='p2c1' />
          </div>
          <div class="col-6">
            <echart :options='p2c2' />
          </div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide class="flex flex-center section-padding">
        <div class="column fit">
          <div class="col-6">
            <echart :options='p3c1' />
          </div>
          <div class="col-6">
            <echart :options='p3c2' />
          </div>
        </div>
      </q-carousel-slide>
    </template>

    <q-carousel-control slot="control" position="bottom-left" :offset="[18, 22]" class="text-white" style="background: rgba(0, 0, 0, .3); padding: 4px; border-radius: 4px">
      <q-toggle dark color="amber" v-model="autoplay" label="自动播放" />
    </q-carousel-control>
  </q-carousel>

</template>

<script>
  import {
    date
  } from 'quasar'
  import Echart from "./Echart"; 
  const echarts = require("echarts/lib/echarts");
  import 'echarts/map/js/china.js';
  import 'echarts/map/js/province/jiangsu.js';
  import 'echarts/map/js/province/anhui.js';
  export default {
    name: 'leftCarousel',
    data() {
      return {
        params: {
          start: '',
          end: ''
        },
        autoplay: true,
        // p1c1: {},
        // p1c2: {},
        p2c1: {},
        p2c2: {},
        p3c1: {},
        p3c2: {},
      }
    },
    props: ['refreshtime'],
    components: {
      Echart,      
    },
    computed: {
      platform() {
        return this.$store.state.platform;
      },
    },
    watch: {
      refreshtime: function () {
        //过去7天
        let d = new Date();
        this.params.start = date.formatDate(date.subtractFromDate(d, {
          days: 7
        }), 'YYYY-MM-DD')
        this.params.end = date.formatDate(date.subtractFromDate(d, {
          days: 1
        }), 'YYYY-MM-DD')
        this.refresh()
      }
    },
    methods: {
      format(value) {
        return `${parseInt(value)}`;
      },
      refresh() {
        // this.getp1c1();
        // this.getp1c2();
        this.loadProvinceData('江苏', (p) => {
          this.p3c1 = p;
        })
        this.loadProvinceData('安徽', (p) => {
          this.p3c2 = p;
        })
        this.getVehicleOrigin();
        this.loadStopTime();
      },
      //获取车流量
      getp1c1() {

        let options = {
          title: {
            text: '过去7天车流量统计'
          },
          tooltip: {
            trigger: 'axis',
            formatter: "{b} : {c}"
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
          },
          yAxis: {
            type: 'value',

          },
          series: [{
            data: [],
            type: 'line',
            areaStyle: {}
          }]
        }

        this.$axios({
          url: '/loadVehicleStream',
          method: 'GET',
          params: {
            scenicName: this.platform.scenicName == 'home' ? '' : this.platform.scenicName,
            trackNo: null,
            type: 'custom',
            startDate: this.params.start,
            endDate: this.params.end
          }
        }).then(res => {

          if (res.desc) {
            res.desc.forEach((f) => {
              options.xAxis.data.push(f.dateStr)
              options.series[0].data.push(f.count)

            })
            // this.p1c1 = options

          }
        }).catch(() => {
          //this.p1c1 = options
        })



      },
      //使用率统计
      getp1c2() {
        let options = {
          title: {
            text: '过去7天停车场利用率'
          },
          tooltip: {
            formatter: '{a}<br>{b}：{c}%'
          },
          xAxis: {
            type: 'category',
            boundaryGap: true,
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            label: {
              distance: 30,
              rotate: 90,
              aligin: 'left',
              verticalAlign: 'middle',
              show: true,
              position: 'insideBottom',
              formatter: '{c}%'
            },
            barMaxWidth: 20,
            name: '车位利用率',
            data: [],
            type: 'bar',
            areaStyle: {}
          }]
        }
        this.$axios({
          url: '/loadUseRatio',
          method: 'GET',
          params: {
            scenicName: this.platform.scenicName == 'home' ? '' : this.platform.scenicName,
            trackNo: this.selParking == 'all' ? null : this.selParking,
            type: 'custom',
            startDate: this.params.start,
            endDate: this.params.end
          }
        }).then(res => {
          //console.log(res)
          res.desc.forEach(f => {
            options.xAxis.data.push(f.dateStr)
            options.series[0].data.push((f.useRatio * 100).toFixed(2))
          })
          //this.p1c2=options


        }).catch(() => {
          //this.p1c2=options
        })
      },
      //停车时长统计
      loadStopTime() {
        let options = {
          title: {
            text: '过去7天停车时长统计'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [{
            name: '停车时长',
            type: 'pie',
            radius: '45%',
            center: ['50%', '60%'],
            label: {
              normal: {
                formatter: '{b|{b}}\n{hr|}\n{c}辆 {d|{d}%}',
                rich: {
                  b: {
                    color: '#fff',
                    align: 'left',
                    padding: 4
                  },
                  hr: {
                    borderColor: '#12EABE',
                    width: '100%',
                    borderWidth: 1,
                    height: 0
                  },
                  d: {
                    color: '#fff',
                    align: 'left',
                    padding: 4
                  },
                  c: {
                    color: '#fff',
                    align: 'center',
                    padding: 4
                  }
                }
              }
            },
            data: [{
                name: '2小时以内',
                value: 0,
              },
              {
                name: '2-4小时',
                value: 0,
              },

              {
                value: 0,
                name: '4-6小时以'
              },
              {
                value: 0,
                name: '6-12小时'
              },
              {
                value: 0,
                name: '12-24小时'
              },
              {
                value: 0,
                name: '24小时以上'
              },

            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            // roseType: 'radius',
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }]
        }

        this.$axios({
          url: '/loadStopTime',
          method: 'GET',
          params: {
            scenicName: this.platform.scenicName == 'home' ? '' : this.platform.scenicName,
            trackNo: null,
            type: 'custom',
            startDate: this.params.start,
            endDate: this.params.end
          }
        }).then(res => {
          if (res.desc) {

            let desc = res.desc;
            desc.forEach((f) => {

              if (f.durations < 2) {
                options.series[0].data[0].value += f.count
              } else if (f.durations < 4 && f.durations >= 2) {
                options.series[0].data[1].value += f.count
              } else if (f.durations < 6 && f.durations >= 4) {
                options.series[0].data[2].value += f.count
              } else if (f.durations >= 6 && f.durations < 12) {
                options.series[0].data[3].value += f.count
              } else if (f.durations >= 12 && f.durations < 24) {
                options.series[0].data[4].value += f.count
              } else {
                options.series[0].data[5].value += f.count
              }
            })
            this.p2c2 = options
          }
        }).catch(() => {
          this.p2c2 = options
        })
      },
      //省份下的地图
      loadProvinceData(province, callback) {
        var data = [];
        var PData = [];
        let geoCoordMap = {}
        //地图json        
        var mapFeatures = echarts.getMap(province).geoJson.features
        mapFeatures.forEach(function (v) {
          // 地区名称
          var name = v.properties.name;
          // 地区经纬度
          geoCoordMap[name] = v.properties.cp;
        });
        var convertData = function (data) {
          var res = [];
          for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
              res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
              });
            }
          }
          return res;
        };

        let options = {
          title: {
            text: '过去7天' + province + '省内车辆来源统计',
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              if (typeof (params.value)[2] == "undefined") {
                return params.name + ' : ' + params.value;
              } else {
                return params.name + ' : ' + params.value[2];
              }
            }
          },
          grid: {
            right: 25,
            top: 80,
            bottom: 30,
            width: '20%'
          },
          xAxis: {
            //max:20000,
            type: 'value',
            scale: true,
            position: 'top',
            interval: 10000,
            // splitNumber: 1,
            boundaryGap: false,
            axisLabel: {
              textStyle: {
                color: '#aaa'
              }
            }
          },
          yAxis: {
            type: 'category',
            nameGap: 16,

            axisLabel: {
              interval: 0,
              textStyle: {
                color: '#999'
              }
            },
            data: []
          },
          visualMap: {
            show: true,
            min: 0,
            max: 500,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'], // 文本，默认为数值文本
            calculable: true,
            //seriesIndex: [0],
            inRange: {
              color: ['#29d5fd', '#457dfe', '#e87568', '#f7335e', '#4842fb', '#8b34fd']

            }
          },
          geo: {
            show: true,
            //left: '15%',
            map: province,
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: 'white'
                }
              },
              emphasis: {
                show: false,
              }
            },
            layoutSize: '80%',
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#031525',
                borderColor: '#3B5077',
              },
              emphasis: {
                areaColor: '#2B91B7',
              }
            }
          },
          series: [

            {
              type: 'map',
              map: province,
              geoIndex: 0,
              aspectScale: 0.75, //长宽比
              showLegendSymbol: false, // 存在legend时显示
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    color: '#fff'
                  }
                }
              },
              roam: true,
              itemStyle: {
                normal: {
                  areaColor: '#031525',
                  borderColor: '#3B5077',
                },
                emphasis: {
                  areaColor: '#2B91B7'
                }
              },
              animation: false,
              data: data
            },
            {
              name: 'barSer',
              type: 'bar',
              roam: false,
              visualMap: true,
              zlevel: 2,
              barMaxWidth: 15,
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  formatter: '{c}'
                  // offset: [0, 10]
                },
                emphasis: {
                  show: true,
                  position: 'right',
                  // offset: [10, 0]
                }
              },
              tooltip: {
                // position:'inside',
                formatter: '{b}:{c}'
              },
              data: data
            }


          ]
        };

        this.$axios({
          url: '/loadCarSource',
          method: 'GET',
          params: {
            scenicName: this.platform.scenicName == 'home' ? '' : this.platform.scenicName,
            trackNo: null,
            type: 'custom',
            startDate: this.params.start,
            endDate: this.params.end,
            province: province
          }
        }).then((res) => {
          if (res.desc) {
            let y = []
            res.desc.sort(function (a, b) {
              return a.count - b.count
            }).forEach((f) => {
              y.push(f.areaName + '市')
              data.push({
                name: f.areaName + '市',
                value: f.count
              })
            });
            options.yAxis.data = y
            callback(options)
          }
        }).catch(() => {
          callback(options)
        });


      },
      //获取车辆来源数据
      getVehicleOrigin() {

        var BJData = []
        let geoCoordMap = {}

        //地图json
        var mapFeatures = echarts.getMap('china').geoJson.features

        mapFeatures.forEach(function (v) {
          // 地区名称
          var name = v.properties.name;
          // 地区经纬度
          geoCoordMap[name] = v.properties.cp;
        });

        var convertData = function (data) {
          var res = [];
          for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = geoCoordMap[dataItem[0].name];
            var toCoord = geoCoordMap[dataItem[1].name];
            if (fromCoord && toCoord) {
              res.push({
                fromName: dataItem[1].name,
                toName: dataItem[0].name,
                coords: [toCoord, fromCoord]
              });
            }
          }
          return res;
        };
        var getMapData = function () {
          let d = [];
          BJData.forEach((s) => {
            d.push({
              name: s[1].name,
              value: s[1].value
            })
          });
          return d
        }

        let origin = {};

        this.$axios({
          url: '/loadCarSource',
          method: 'GET',
          params: {
            scenicName: this.platform.scenicName == 'home' ? '' : this.platform.scenicName,
            trackNo: null,
            type: 'custom',
            startDate: this.params.start,
            endDate: this.params.end
          }
        }).then(res => {
          if (res.desc) {
            res.desc.forEach((f) => {
              if (geoCoordMap[f.areaName]) {
                BJData.push([{
                  name: '江苏'
                }, {
                  name: f.areaName,
                  value: f.count
                }]);
              }

            })
            origin = {
              title: {
                text: '过去7天全国车辆来源TOP5',
              },
              tooltip: {
                trigger: 'item',
                formatter: function (params) {
                  var toolTiphtml = '';
                  if (params.seriesType == 'map' && params.data) {
                    toolTiphtml = params.data.name + ':' + params.data.value
                  }
                  return toolTiphtml;
                }
              },

              visualMap: {
                show: true,
                min: 0,
                max: 500,
                left: 'left',
                top: 'bottom',
                text: ['高', '低'], // 文本，默认为数值文本
                calculable: true,
                seriesIndex: [3],
                realtime: true,
                inRange: {
                  color: ['#29d5fd', '#457dfe', '#e87568', '#f7335e', '#4842fb', '#8b34fd']

                }
              },

              geo: {
                show: true,
                map: 'china',
                left: 'left',
                right: '0',
                // right: '100',
                // layoutSize: '180%',
                label: {
                  normal: {
                    show: true,
                    color: 'white'

                  },
                  emphasis: {
                    show: false,
                  }
                },
                roam: true,
                itemStyle: {
                  normal: {
                    areaColor: '#031525',
                    borderColor: '#3B5077',
                  },
                  emphasis: {
                    areaColor: '#2B91B7',
                  }
                }
              },
              series: [{
                  name: 'map',
                  type: 'map',
                  map: 'china',
                  geoIndex: 0,
                  aspectScale: 0.75, //长宽比
                  showLegendSymbol: false, // 存在legend时显示
                  label: {
                    normal: {
                      show: true
                    },
                    emphasis: {
                      show: false,
                      textStyle: {
                        color: '#fff'
                      }
                    }
                  },
                  roam: true,
                  itemStyle: {
                    normal: {
                      areaColor: '#031525',
                      borderColor: '#3B5077',
                    },
                    emphasis: {
                      areaColor: '#2B91B7'
                    }
                  },
                  animation: false,
                  data: getMapData(BJData)
                },

                {
                  name: 'line',
                  type: 'lines',
                  zlevel: 1,
                  effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.7,
                    color: '#fff',
                    symbolSize: 3
                  },
                  lineStyle: {
                    normal: {
                      // color: 'red',
                      width: 0,
                      curveness: 0.2
                    }
                  },
                  data: convertData(BJData)
                },
                {

                  name: 'arrow',
                  type: 'lines',
                  zlevel: 2,
                  symbol: ['none', 'none'],
                  symbolSize: 10,
                  effect: {
                    show: true,
                    period: 6,
                    trailLength: 0,
                    symbol: 'diamond',
                    symbolSize: 5
                  },
                  lineStyle: {
                    normal: {
                      color: 'yellow',
                      width: 1,
                      opacity: 0.6,
                      curveness: 0.2
                    }
                  },
                  data: convertData(BJData)
                },
                {
                  name: 'effect',
                  type: 'effectScatter',
                  coordinateSystem: 'geo',
                  zlevel: 1,
                  rippleEffect: {
                    period: 8,
                    brushType: 'stroke',
                    scale: 4
                  },
                  label: {
                    normal: {
                      show: true,
                      position: 'bottom',
                      formatter: '{@[2]}'
                    }
                  },
                  symbolSize: function (val) {
                    return 10
                  },
                  itemStyle: {
                    normal: {
                      color: 'blue'
                    }
                  },
                  data: BJData.sort(function (a, b) {
                    return b[1].value - a[1].value;
                  }).slice(0, 5).map(function (dataItem) {
                    return {
                      name: dataItem[1].name,
                      // value:dataItem[1].value
                      value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                    };
                  })
                },


              ]
            };

            this.p2c1 = origin;
          }
        })


      }
    },
    mounted() {
      this.refresh()
    }
  }

</script>

<style lang='stylus'>
  @import '~variables';

</style>
