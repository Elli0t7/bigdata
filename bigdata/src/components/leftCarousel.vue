<template>
  <swiper style="height:100%" :options="swiperOption">   
      <swiper-slide class="pop-box">
        <div class="pop-name">过去7天车辆来源TOP5</div>
        <echart :options='p2c1' />
      </swiper-slide>
      <swiper-slide class="pop-box">
        <div class="pop-name">过去7天停车时长统计</div>
        <echart :options='p2c2' />
      </swiper-slide>
      <swiper-slide class="pop-box">
        <div class="pop-name">过去7天江苏省内车辆来源统计</div>
        <echart :options='p3c1' />
      </swiper-slide>
      <swiper-slide class="pop-box">
        <div class="pop-name">过去7天安徽省内车辆来源统计</div>
        <echart :options='p3c2' />
      </swiper-slide>       
    <!-- <div class="swiper-pagination" slot="pagination"></div> -->
  </swiper>

</template>

<script>
import { date } from "quasar";
import Echart from "./Echart";
const echarts = require("echarts/lib/echarts");
import "echarts/map/js/china.js";
import "echarts/map/js/province/jiangsu.js";
import "echarts/map/js/province/anhui.js";
export default {
  name: "leftCarousel",
  data() {
    return {
      swiperOption: {   
        autoplay: true,     
        pagination: {
          el: ".swiper-pagination"
        }
      },
      params: {
        start: "",
        end: ""
      },
      
      // p1c1: {},
      // p1c2: {},
      p2c1: {},
      p2c2: {},
      p3c1: {},
      p3c2: {}
    };
  },
  props: ["refreshtime"],
  components: {
    Echart
  },
  computed: {
    platform() {
      return this.$store.state.platform;
    }
  },
  watch: {
    refreshtime() {
      //过去7天
      let d = new Date();
      this.params.start = date.formatDate(
        date.subtractFromDate(d, {
          days: 7
        }),
        "YYYY-MM-DD"
      );
      this.params.end = date.formatDate(
        date.subtractFromDate(d, {
          days: 1
        }),
        "YYYY-MM-DD"
      );
      this.refresh();
    }
  },
  methods: {
    format(value) {
      return `${parseInt(value)}`;
    },
    refresh() {
      // this.getp1c1();
      // this.getp1c2();
      this.loadProvinceData("江苏", p => {
        this.p3c1 = p;
      });
      this.loadProvinceData("安徽", p => {
        this.p3c2 = p;
      });
      this.getVehicleOrigin();
      this.loadStopTime();
    },
    //获取车流量
    getp1c1() {
      let options = {
        title: {
          text: "过去7天车流量统计"
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
            areaStyle: {}
          }
        ]
      };

      this.$axios({
        url: "/loadVehicleStream",
        method: "GET",
        params: {
          scenicName:
            this.platform.scenicName == "home" ? "" : this.platform.scenicName,
          trackNo: null,
          type: "custom",
          startDate: this.params.start,
          endDate: this.params.end
        }
      })
        .then(res => {
          if (res.desc) {
            res.desc.forEach(f => {
              options.xAxis.data.push(f.dateStr);
              options.series[0].data.push(f.count);
            });
            // this.p1c1 = options
          }
        })
        .catch(() => {
          //this.p1c1 = options
        });
    },
    //使用率统计
    getp1c2() {
      let options = {
        title: {
          text: "过去7天停车场利用率"
        },
        tooltip: {
          formatter: "{a}<br>{b}：{c}%"
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: []
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            label: {
              distance: 30,
              rotate: 90,
              aligin: "left",
              verticalAlign: "middle",
              show: true,
              position: "insideBottom",
              formatter: "{c}%"
            },
            barMaxWidth: 20,
            name: "车位利用率",
            data: [],
            type: "bar",
            areaStyle: {},
            itemStyle:{
              barBorderRadius: 12
            }
          }
        ]
      };
      this.$axios({
        url: "/loadUseRatio",
        method: "GET",
        params: {
          scenicName:
            this.platform.scenicName == "home" ? "" : this.platform.scenicName,
          trackNo: this.selParking == "all" ? null : this.selParking,
          type: "custom",
          startDate: this.params.start,
          endDate: this.params.end
        }
      })
        .then(res => {
          //console.log(res)
          res.desc.forEach(f => {
            options.xAxis.data.push(f.dateStr);
            options.series[0].data.push((f.useRatio * 100).toFixed(2));
          });
          //this.p1c2=options
        })
        .catch(() => {
          //this.p1c2=options
        });
    },
    //停车时长统计
    loadStopTime() {
      var placeHolderStyle = {
        normal: {
          color: "#fff",
          opacity: 0.1
        },
        emphasis: {
          color: "#fff",
          opacity: 0.1
        }
      };

     let options = {
        color: [
          {
            // 完成的圆环的颜色
            colorStops: [
              {
                offset: 0,
                color: "#57FF86" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#3AA5C7" // 100% 处的颜色
              }
            ]
          },
          {
            // 完成的圆环的颜色
            colorStops: [
              {
                offset: 0,
                color: "#A568FF" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#006CFF" // 100% 处的颜色
              }
            ]
          },
          {
            // 完成的圆环的颜色
            colorStops: [
              {
                offset: 0,
                color: "#FFEA4F" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#F89212" // 100% 处的颜色
              }
            ]
          },
          {
            // 完成的圆环的颜色
            colorStops: [
              {
                offset: 0,
                color: "#FF7671" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#A14AFF" // 100% 处的颜色
              }
            ]
          },
          {
            // 完成的圆环的颜色
            colorStops: [
              {
                offset: 0,
                color: "#eb2100" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#eb3600" // 100% 处的颜色
              }
            ]
          },
          {
            // 完成的圆环的颜色
            colorStops: [
              {
                offset: 0,
                color: "#0096f3" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#33CCFF" // 100% 处的颜色
              }
            ]
          }
        ],        
        textStyle: {
          fontSize: 14,
          color: "#40E7F4 "
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          top: "2%",
          left: "0%",
          data: [
            "2小时以内",
            "2-4小时",
            "4-6小时",
            "6-12小时",
            "12-24小时",
            "24小时以上"
          ],
          textStyle: {
            color: "#40E7F4 ",
            fontSize: 12
          },
          formatter(name) {           
            return name;
          },
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 16
        },
        series: [
          {
            name: "24小时以上",
            type: "pie",
            center:['65%','50%'],
            radius: ["12%", "20%"],
            label: false,
            startAngle: 90,
            clockWise: false, //顺时加载
            hoverAnimation: true,
            hoverOffset: 3,
            data: [
              {
                value: 0,
                name: "24小时以上"
              },
              {
                value: 0,
                hoverAnimation: false, //鼠标移入变大
                itemStyle: placeHolderStyle,
                tooltip: {
                  formatter: function(params, ticket, callback) {
                    return "";
                  }
                }
              }
            ]
          },
          {
            name: "12-24小时",
            type: "pie",
            center:['65%','50%'],
            radius: ["24%", "32%"],
            label: false,
            startAngle: 90,
            clockWise: false,
            hoverAnimation: true,
            hoverOffset: 3,
            data: [
              {
                value: 0,
                name: "12-24小时"
              },
              {
                value: 0,
                hoverAnimation: false,
                itemStyle: placeHolderStyle,
                tooltip: {
                  formatter: function(params, ticket, callback) {
                    return "";
                  }
                }
              }
            ]
          },
          {
            name: "6-12小时",
            type: "pie",
            center:['65%','50%'],
            radius: ["36%", "44%"],
            label: false,
            startAngle: 90,
            clockWise: false,
            hoverAnimation: true,
            hoverOffset: 3,
            data: [
              {
                value: 0,
                name: "6-12小时"
              },
              {
                value: 0,
                hoverAnimation: false,
                itemStyle: placeHolderStyle,
                tooltip: {
                  formatter: function(params, ticket, callback) {
                    return "";
                  }
                }
              }
            ]
          },
          {
            name: "4-6小时",
            type: "pie",
            center:['65%','50%'],
            radius: ["48%", "56%"],
            label: false,
            startAngle: 90,
            clockWise: false,
            hoverAnimation: true,
            hoverOffset: 3,
            data: [
              {
                value: 0,
                name: "4-6小时"
              },
              {
                value: 0,
                hoverAnimation: false,
                itemStyle: placeHolderStyle,
                tooltip: {
                  formatter: function(params, ticket, callback) {
                    return "";
                  }
                }
              }
            ]
          },
          {
            name: "2-4小时",
            type: "pie",
            center:['65%','50%'],
            radius: ["60%", "68%"],
            label: false,
            startAngle: 90,
            clockWise: false,
            hoverAnimation: true,
            hoverOffset: 3,
            data: [
              {
                value: 0,
                name: "2-4小时"
              },
              {
                value: 0,
                hoverAnimation: false,
                itemStyle: placeHolderStyle,
                tooltip: {
                  formatter: function(params, ticket, callback) {
                    return "";
                  }
                }
              }
            ]
          },
          {
            name: "2小时以内",
            type: "pie",
            center:['65%','50%'],
            radius: ["72%", "80%"],
            label: false,
            startAngle: 90,
            clockWise: false,
            hoverAnimation: true,
            hoverOffset: 3,
            data: [
              {
                value: 0,
                name: "2小时以内"
              },
              {
                value: 0,
                hoverAnimation: false,
                itemStyle: placeHolderStyle,
                tooltip: {
                  formatter: function(params, ticket, callback) {
                    return "";
                  }
                }
              }
            ]
          }
        ]
      };
      this.$axios({
        url: "/loadStopTime",
        method: "GET",
        params: {
          scenicName:
            this.platform.scenicName == "home" ? "" : this.platform.scenicName,
          trackNo: null,
          type: "custom",
          startDate: this.params.start,
          endDate: this.params.end
        }
      })
        .then(res => {
          if (res.desc) {
            let desc = res.desc;
            let total = 0;
            desc.forEach(f => {
              total += f.count;
              if (f.durations < 2) {
                options.series[5].data[0].value += f.count;
              } else if (f.durations < 4 && f.durations >= 2) {
                options.series[4].data[0].value += f.count;
              } else if (f.durations < 6 && f.durations >= 4) {
                options.series[3].data[0].value += f.count;
              } else if (f.durations >= 6 && f.durations < 12) {
                options.series[2].data[0].value += f.count;
              } else if (f.durations >= 12 && f.durations < 24) {
                options.series[1].data[0].value += f.count;
              } else {
                options.series[0].data[0].value += f.count;
              }
            });
            options.series[5].data[1].value =
              total - options.series[5].data[0].value;
            options.series[4].data[1].value =
              total - options.series[4].data[0].value;
            options.series[3].data[1].value =
              total - options.series[3].data[0].value;
            options.series[2].data[1].value =
              total - options.series[2].data[0].value;
            options.series[1].data[1].value =
              total - options.series[1].data[0].value;
            options.series[0].data[1].value =
              total - options.series[0].data[0].value;
            this.p2c2 = options;
          }
        })
        .catch(() => {
          this.p2c2 = options;
        });
    },
    //省份下的地图
    loadProvinceData(province, callback) {
      var data = [];
      var PData = [];
      let geoCoordMap = {};
      //地图json
      var mapFeatures = echarts.getMap(province).geoJson.features;
      mapFeatures.forEach(function(v) {
        // 地区名称
        var name = v.properties.name;
        // 地区经纬度
        geoCoordMap[name] = v.properties.cp;
      });
      var convertData = function(data) {
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
        // title: {
        //   text: '过去7天' + province + '省内车辆来源统计',
        // },
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            if (typeof params.value[2] == "undefined") {
              return params.name + " : " + params.value;
            } else {
              return params.name + " : " + params.value[2];
            }
          }
        },
        grid: {
          right: 35,
          top: 5,
          bottom: 10,
          width: "20%"
        },
        xAxis: {
          //max:20000,
          type: "value",
          scale: true,
          position: "top",
          interval: 10000,
          // splitNumber: 1,
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              fontSize:'10',
              color: "#fff"
            }
          }
        },
        yAxis: {
          type: "category",
          nameGap: 16,

          axisLabel: {
            interval: 0,
            textStyle: {
              fontSize:'8',
              color: "#2ecdf3"
            }
          },
          data: []
        },
        visualMap: {
          show: true,
          min: 0,
          max: 500,
          left: "left",
          top: "bottom",
          text: ["高", "低"], // 文本，默认为数值文本
          calculable: true,
          //seriesIndex: [0],
          inRange: {
            color: [
              "#29d5fd",
              "#457dfe",
              "#e87568",
              "#f7335e",
              "#4842fb",
              "#8b34fd"
            ]
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
                fontSize:'10',
                color: "#fff"
              }
            },
            emphasis: {
              show: false
            }
          },
          layoutSize: "80%",
          roam: true,
          itemStyle: {
            normal: {
              areaColor: "#031525",
              borderColor: "#3B5077"
            },
            emphasis: {
              areaColor: "#2B91B7"
            }
          }
        },
        series: [
          {
            type: "map",
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
                  fontSize:'10',
                  color: "#2ecdf3"
                }
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: "#031525",
                borderColor: "#3B5077"
              },
              emphasis: {
                areaColor: "#2B91B7"
              }
            },
            animation: false,
            data: data
          },
          {
            name: "barSer",
            type: "bar",
            roam: false,
            visualMap: true,
            zlevel: 2,
            barMaxWidth: 8,
            itemStyle:{
              barBorderRadius: 12
            },
            label: {
              normal: {
                color:'#2ecdf3',
                fontSize:'10',
                show: true,
                position: "right",
                formatter: "{c}"
                // offset: [0, 10]
              },
              emphasis: {
                show: true,
                position: "right"
                // offset: [10, 0]
              }
            },
            tooltip: {
              // position:'inside',
              formatter: "{b}:{c}"
            },
            data: data
          }
        ]
      };

      this.$axios({
        url: "/loadCarSource",
        method: "GET",
        params: {
          scenicName:
            this.platform.scenicName == "home" ? "" : this.platform.scenicName,
          trackNo: null,
          type: "custom",
          startDate: this.params.start,
          endDate: this.params.end,
          province: province
        }
      })
        .then(res => {
          if (res.desc) {
            let y = [];
            res.desc
              .sort(function(a, b) {
                return a.count - b.count;
              })
              .forEach(f => {
                y.push(f.areaName + "市");
                data.push({
                  name: f.areaName + "市",
                  value: f.count
                });
              });
            options.yAxis.data = y;
            callback(options);
          }
        })
        .catch(() => {
          callback(options);
        });
    },
    //获取车辆来源数据
    getVehicleOrigin() {
      var BJData = [];
      let geoCoordMap = {};

      //地图json
      var mapFeatures = echarts.getMap("china").geoJson.features;

      mapFeatures.forEach(function(v) {
        // 地区名称
        var name = v.properties.name;
        // 地区经纬度
        geoCoordMap[name] = v.properties.cp;
      });

      var convertData = function(data) {
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
      var getMapData = function() {
        let d = [];
        BJData.forEach(s => {
          d.push({
            name: s[1].name,
            value: s[1].value
          });
        });
        return d;
      };

      let origin = {};

      this.$axios({
        url: "/loadCarSource",
        method: "GET",
        params: {
          scenicName:
            this.platform.scenicName == "home" ? "" : this.platform.scenicName,
          trackNo: null,
          type: "custom",
          startDate: this.params.start,
          endDate: this.params.end
        }
      }).then(res => {
        if (res.desc) {
          res.desc.forEach(f => {
            if (geoCoordMap[f.areaName]) {
              BJData.push([
                {
                  name: "江苏"
                },
                {
                  name: f.areaName,
                  value: f.count
                }
              ]);
            }
          });
          origin = {
            tooltip: {
              trigger: "item",
              formatter: function(params) {
                var toolTiphtml = "";
                if (params.seriesType == "map" && params.data) {
                  toolTiphtml = params.data.name + ":" + params.data.value;
                }
                return toolTiphtml;
              }
            },

            visualMap: {
              itemWidth:10,
              show: true,
              min: 0,
              max: 500,
              left: "left",             
              text: ["高", "低"], // 文本，默认为数值文本
              calculable: true,
              seriesIndex: [3],
              realtime: true,
              inRange: {
                color: [
                  "#29d5fd",
                  "#457dfe",
                  "#e87568",
                  "#f7335e",
                 
                ]
              }
            },

            geo: {
              show: true,
              map: "china",
              // left: "left",
              // right: "0",
              // right: '100',
              layoutCenter: ['50%', '50%'],
              layoutSize: '140%',
              label: {
                normal: {
                  fontSize:'10',
                  show: true,
                  color: "#2ecdf3"
                },
                emphasis: {
                  show: false
                }
              },
              roam: true,
              itemStyle: {
                normal: {
                  borderColor: "rgba(147, 235, 248, 1)",
                  borderWidth: 1,
                  areaColor: {
                    type: "radial",
                    x: 0.5,
                    y: 0.5,
                    r: 0.8,
                    colorStops: [
                      {
                        offset: 0,
                        color: "rgba(147, 235, 248, 0)" // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "rgba(147, 235, 248, .2)" // 100% 处的颜色
                      }
                    ],
                    globalCoord: false // 缺省为 false
                  },
                  shadowColor: "rgba(128, 217, 248, 1)",
                  shadowOffsetX: -2,
                  shadowOffsetY: 2,
                  shadowBlur: 10
                },
                emphasis: {
                  areaColor: "#389BB7",
                  borderWidth: 0
                }
              }
            },
            series: [
              {
                name: "map",
                type: "map",
                map: "china",
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
                      color: "#fff"
                    }
                  }
                },
                roam: true,
                itemStyle: {
                  normal: {
                    areaColor: "#031525",
                    borderColor: "#3B5077"
                  },
                  emphasis: {
                    areaColor: "#2B91B7"
                  }
                },
                animation: false,
                data: getMapData(BJData)
              },

              {
                name: "line",
                type: "lines",
                zlevel: 1,
                effect: {
                  show: true,
                  period: 6,
                  trailLength: 0.7,
                  color: "#fff",
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
                name: "arrow",
                type: "lines",
                zlevel: 2,
                symbol: ["none", "none"],
                symbolSize: 10,
                effect: {
                  show: true,
                  period: 6,
                  trailLength: 0,
                  symbol: "diamond",
                  symbolSize: 5
                },
                lineStyle: {
                  normal: {
                    color: "yellow",
                    width: 1,
                    opacity: 0.6,
                    curveness: 0.2
                  }
                },
                data: convertData(BJData)
              },
              {
                name: "effect",
                type: "effectScatter",
                coordinateSystem: "geo",
                zlevel: 1,
                rippleEffect: {
                  period: 8,
                  brushType: "stroke",
                  scale: 4
                },
                label: {
                  normal: {
                    show: true,
                    position: "bottom",
                    formatter: "{@[2]}"
                  }
                },
                symbolSize: function(val) {
                  return 10;
                },
                itemStyle: {
                  normal: {
                    color: "blue"
                  }
                },
                data: BJData.sort(function(a, b) {
                  return b[1].value - a[1].value;
                })
                  .slice(0, 5)
                  .map(function(dataItem) {
                    return {
                      name: dataItem[1].name,
                      // value:dataItem[1].value
                      value: geoCoordMap[dataItem[1].name].concat([
                        dataItem[1].value
                      ])
                    };
                  })
              }
            ]
          };

          this.p2c1 = origin;
        }
      });
    }
  },
  mounted() {
    this.refresh();
  }
};
</script>

<style lang='stylus'>
</style>
