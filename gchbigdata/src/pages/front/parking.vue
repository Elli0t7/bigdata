<template>
  <q-page class="page">
    <div class="row justify-center" id='pageHeader'>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 col-xl-2">
        <div class="row justify-end section-padding">
          <div v-if="this.platform.scenicName!='home'" class=" sel-box round-border col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
            <q-select dark hide-underline v-model="selParking" placeholder="请选择停车场" radio :options="parkings" />
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-5">
        <datepicker @query='dateChange' />
      </div>
    </div>
    <div class="row">
      
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 section-padding">
        <div class="first-row section-bg round-border section-padding">
          <echart :options='chart2' />
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 section-padding">
        <div class="first-row section-bg round-border section-padding">
          <echart :options='chart5' />
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 section-padding">
        <div class="first-row section-bg round-border section-padding">
          <echart :options='chart6' />
        </div>
      </div>
     
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 section-padding">
        <div class="second-row section-bg round-border section-padding">
          <echart :options='chart1' />
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 section-padding">
        <div class="second-row section-bg round-border section-padding">
          <echart :options='chart4' />
        </div>
      </div>
       <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 section-padding">
        <div class="second-row section-bg round-border section-padding">
          <echart :options='chart3' />
        </div>
      </div>
      
    </div>
   

  </q-page>
</template>

<script>
  import Echart from "../../components/Echart";
  import datepicker from '../../components/datepicker'
  const echarts = require("echarts/lib/echarts");
  import 'echarts/map/js/china.js';
  import 'echarts/map/js/province/jiangsu.js';
  import 'echarts/map/js/province/anhui.js';
  import {
    mapState
  } from 'vuex';
  export default {
    data() {
      return {
        isInitData: false,
        Interval:'',
        headHeight: 0,
        dataParama: {}, //日期查询参数
        selParking: 'all', //选中的停车场
        parkings: [{ //停车场列表
          label: '所有停车场',
          value: 'all'
        }, ],
        chart1: {

        },
        chart2: {},
        chart4:{},
        chart3: {

        },
        //江苏省
        chart5: {

        },
        //安徽省
        chart6: {}

      }
    },
    components: {
      datepicker,
      Echart
    },
    watch: {
      platform:function(){
        this.refresh();
      },
      selParking: function () {
        this.refresh();
      },
      // dataParama: function () {
      //   //console.log(this.dataParama)
      //   this.refresh();
      // }
    },
    computed: {
      platform() {
        return this.$store.state.platform;
      }
    },
    methods: {
      //获取停车场列表
      getParkings() {
         this.parkings=[{ //停车场列表
          label: '所有停车场',
          value: 'all'
        }, ]
        this.$axios({
          url: '/loadParkUsageRate',
          method: 'GET',
          params: {
            scenicName: this.platform.scenicName == 'home' ? '' : this.platform.scenicName
          }
        }).then(res => {
          //console.log(res);
          if (res.desc && res.desc.length > 0) {
            res.desc.forEach((f) => {
              this.parkings.push({
                label: f.trackName,
                value: f.trackNo
              })
            })
          }
        })
      },
      //获取车流量
      getChart1() {
        let options = {
          title: {
            text: '车流量统计'
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
            trackNo: this.selParking == 'all' ? null : this.selParking,
            type: this.dataParama.type,
            startDate: this.dataParama.start,
            endDate: this.dataParama.end
          }
        }).then(res => {
          if (res.desc) {
            res.desc.forEach((f) => {
              options.xAxis.data.push(f.dateStr)
              options.series[0].data.push(f.count)

            })
            this.chart1 = options

          }
        }).catch(() => {
          this.chart1 = options
        })



      },
      //停车时长统计
      loadStopTime() {
        let options = {
          title: {
            text: '停车时长统计'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [{
            name: '停车时长',
            type: 'pie',
            radius: '60%',
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
            trackNo: this.selParking == 'all' ? null : this.selParking,
            type: this.dataParama.type,
            startDate: this.dataParama.start,
            endDate: this.dataParama.end
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
            this.chart3 = options
          }
        }).catch(() => {
          this.chart3 = options
        })
      },
      //使用率统计
      loadUseRatio() {

         let options={
          title: {
            text: '停车场利用率'
          },
          tooltip:{
            formatter:'{a}<br>{b}：{c}%'
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
            label:{
              distance:30,
              rotate:90,
              aligin:'left',
              verticalAlign:'middle',              
              show:true,
              position:'insideBottom',
              formatter:'{c}%'
            },
            barMaxWidth:20,
            name:'车位利用率',
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
            type: this.dataParama.type,
            startDate: this.dataParama.start,
            endDate: this.dataParama.end
          }
        }).then(res => {
          //console.log(res)
          res.desc.forEach(f=>{
            options.xAxis.data.push(f.dateStr)
            options.series[0].data.push((f.useRatio*100).toFixed(2))
          })
          this.chart4=options
          

        }).catch(() => {
          this.chart4=options
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
            text: province + '省内车辆来源统计',
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
             interval:10000,
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
            left: '15%',
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
                  formatter:'{c}'
                  // offset: [0, 10]
                },
                emphasis: {
                  show: true,
                  position: 'right',
                  // offset: [10, 0]
                }
              },
              tooltip:{
               // position:'inside',
                formatter:'{b}:{c}'
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
            trackNo: this.selParking == 'all' ? null : this.selParking,
            type: this.dataParama.type,
            startDate: this.dataParama.start,
            endDate: this.dataParama.end,
            province: province
          }
        }).then((res) => {
          if (res.desc) {
             let y=[]
            res.desc.sort(function(a,b){
              return a.count-b.count
            }).forEach((f) => {
              y.push(f.areaName + '市')
              data.push({
                name: f.areaName + '市',
                value: f.count
              })
            });
            options.yAxis.data=y
            callback(options)
          }
        }).catch(() => {
          callback(options)
        });


      },
      //刷新数据
      refresh() {
        this.getChart1();
        this.getVehicleOrigin();
        this.loadStopTime();
        this.loadUseRatio();       
        this.loadProvinceData('江苏', (p) => {
          this.chart5 = p;
        })
        this.loadProvinceData('安徽', (p) => {
          this.chart6 = p;
        })       
      },
      dateChange(p) {
        // console.log(p)
        this.dataParama = p;
        this.refresh()
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
            trackNo: this.selParking == 'all' ? null : this.selParking,
            type: this.dataParama.type,
            startDate: this.dataParama.start,
            endDate: this.dataParama.end
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
                text: '全国车辆来源TOP5',
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
                // left: 'left',
                // right: '100',
                // layoutSize: '80%',
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

            this.chart2 = origin;
          }
        })


      }
    },
    mounted() {
      this.getParkings()
      
         this.Interval = setInterval(() => {
         this.refresh();
       }, this.$store.state.frequency);
    },
    activated(){
      this.getParkings()
      this.refresh()
    }
  }

</script>
<style  lang='stylus'>
  @import '~variables';

</style>
