<template>
  <q-page class="page">
    <div class="row justify-center" id='pageHeader'>
      <!-- <div class="col-lg-5 col-xl-4 desktop-only section-padding"></div>       -->
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-5">
        <datepicker @query='dateChange' />
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-8 section-padding">

        <div class="first-row section-bg round-border section-padding">
          <echart :options='vehicleFlow' />
        </div>

      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 section-padding">
        <div class="first-row section-bg round-border section-padding">
          <echart :options='vehicleOrigin' />
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 section-padding">
        <div class="second-row section-bg round-border section-padding">
          <echart :options='usageRate' />
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 section-padding">
        <div class="second-row section-bg round-border section-padding">
          <echart :options='parkingDuration' />
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 section-padding">
        <div class="second-row section-bg round-border section-padding">
          <echart :options='vehicleFlow' />
        </div>
      </div>
    </div>
  

  </q-page>
</template>

<script>
  import Echart from "../../components/Echart";
  import datepicker from '../../components/datepicker'
  const echarts = require("echarts/lib/echarts");
  //import 'echarts/map/js/china'
  //require("echarts/map/js/china")
  import 'echarts/map/js/china.js';
  export default {
    data() {
      return {        
        dataParama: {}, //日期查询参数
        selParking: 'all', //选中的停车场
        parkings: [{ //停车场列表
            label: '所有停车场',
            value: 'all'
          }, {
            label: 'Google',
            value: 'goog'
          },
          {
            label: 'Facebook',
            value: 'fb'
          }
        ],
        //车流量数据
        vehicleFlow: {
          title: {
            text: '车流量统计'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            areaStyle: {}
          }]
        },
        //来源地统计
        vehicleOrigin:{},
        //利用率 
        usageRate: {
          title: {
            text: '停车场利用率'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            areaStyle: {}
          }]
        },
        //停车时长
        parkingDuration: {
          title: {
            text: '停车时长统计'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },


          series: [{
            name: '访问来源',
            type: 'pie',
            radius: '60%',
            center: ['50%', '50%'],
            data: [{
                value: 335,
                name: '直接访问'
              },
              {
                value: 310,
                name: '邮件营销'
              },
              {
                value: 274,
                name: '联盟广告'
              },
              {
                value: 235,
                name: '视频广告'
              },
              {
                value: 400,
                name: '搜索引擎'
              }
            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: 'radius',
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }]
        },
        //流量对比
        flows: {}

      }
    },
    components: {
      datepicker,
      Echart
    },
    watch: {
      platform: function () {
        this.refresh();
      },
      selParking: function () {
        this.refresh();
      },
      dataParama: function () {
        this.refresh();
      }
    },
    computed: {
      platform() {
        return this.$store.state.platform;
      },
     
    },
    methods: {
      refresh() {
        this.getVehicleOrigin();
      },
      dateChange(p) {
        this.dataParama = p;
      },
      //获取车辆来源数据
      getVehicleOrigin() {
        let geoCoordMap = {}       
        let data1=[{"count":1,"areaName":"海南"},{"count":16,"areaName":"甘肃"},{"count":11,"areaName":"黑龙江"},{"count":7,"areaName":"西藏"},{"count":17,"areaName":"其他"},{"count":10,"areaName":"内蒙"},{"count":35,"areaName":"河北"},{"count":9,"areaName":"青海"},{"count":45,"areaName":"湖北"},{"count":21,"areaName":"辽宁"},{"count":5,"areaName":"新疆"},{"count":22,"areaName":"陕西"},{"count":12,"areaName":"湖南"},{"count":23,"areaName":"福建"},{"count":21,"areaName":"四川"},{"count":62,"areaName":"山东"},{"count":27,"areaName":"天津"},{"count":57,"areaName":"北京"},{"count":155,"areaName":"上海"},{"count":7,"areaName":"吉林"},{"count":228,"areaName":"浙江"},{"count":19,"areaName":"山西"},{"count":2409,"areaName":"安徽"},{"count":69,"areaName":"河南"},{"count":8,"areaName":"贵州"},{"count":40,"areaName":"江西"},{"count":20,"areaName":"重庆"},{"count":24342,"areaName":"江苏"},{"count":14,"areaName":"云南"},{"count":19,"areaName":"宁夏"},{"count":42,"areaName":"广东"},{"count":29,"areaName":"广西"}]
       
        //地图json
        var mapFeatures = echarts.getMap('china').geoJson.features

        mapFeatures.forEach(function (v) {
          // 地区名称
          var name = v.properties.name;
          // 地区经纬度
          geoCoordMap[name] = v.properties.cp;
        });

        //console.log(geoCoordMap)
        var max = 480,
          min = 9; // todo 
        var maxSize4Pin = 100,
          minSize4Pin = 20;

        var convertData = function (data) {
          var res = [];
          for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].areaName];
            if (geoCoord) {
              res.push({
                name: data[i].areaName,
                value: geoCoord.concat(data[i].count),
              });
            }
          }
          return res;
        };
      var getMapData=  function(){
              let d=[];
              data1.forEach((s)=>{
                d.push({name:s.areaName,value:s.count})
              });
              console.log(d)
              return d

            }
        let origin = {
          title: {
            text: '车辆来源TOP5',           
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              var toolTiphtml='';
              if(params.seriesType=='map'){
                toolTiphtml = params.data.name+':'+params.data.value
              }else if(params.seriesType=='scatter')                
               toolTiphtml = params.data.name+':'+params.data.value[2]               
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
            seriesIndex: [0],
            realtime:true,
            inRange: {              
              color: ['#1488CC','yellow', 'red'] // 浅蓝             

            }
          },
          
          geo: {
            show: true,
            map: 'china',
            label: {
              normal: {
                show: true,
                color:'white'

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
          series: [            
            {
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
            data:getMapData(data1)
        },
            {
              name: '点',
              type: 'scatter',
              coordinateSystem: 'geo',
              symbol: 'pin', //气泡
              symbolSize:  40,
              label: {
                normal: {
                  formatter:'{@[2]}',
                  show: true,
                  textStyle: {
                    color: '#fff',
                    fontSize: 9,
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: '#F62157', //标志颜色
                }
              },
              zlevel: 6,
              data: convertData(data1),
            },            
            {
              name: 'Top 5',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              data: convertData(data1.sort(function (a, b) {
                return b.count - a.count;
              }).slice(0, 5)),
              symbolSize: 10,
              showEffectOn: 'render',
              rippleEffect: {
                brushType: 'stroke'
              },
              hoverAnimation: true,
              label: {
                normal: {
                  formatter:function(params){
                    return '   top '+(params.dataIndex+1)
                  },
                  position: 'right',
                  show: true,
                  color:'red'
                }
              },
              itemStyle: {
                normal: {
                  color: 'yellow',
                  shadowBlur: 10,
                  shadowColor: 'yellow'
                }
              },
              zlevel: 1
            },

          ]
        };
        
        this.vehicleOrigin = origin;
      }
    },
    mounted() {
      
    }
  }

</script>
<style scoped lang='stylus'>
@import '~variables';

</style>