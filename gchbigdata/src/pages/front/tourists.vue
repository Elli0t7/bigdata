<template>
  <q-page class="page" :key='platform.id'>
    <div class="row justify-center" id='pageHeader'>
      <div class="col-lg-3 col-xl-3 desktop-only section-padding"></div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <datepicker v-if='platform.id=="10004"' @query='dateChange' :typelist='[{label:"本周",selected:true,name:"week"},{label:"本月",selected:false,name:"month"},{label:"今年",selected:false,name:"year"}]' />
        <datepicker v-else @query='dateChange' />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3">
        <div class="row fit">
          <div class="col-5">
            <!-- <div><span class="red-font">2115</span></div> -->
          </div>
          <div class="col-1"></div>
          <div class="col-5"></div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-7 col-xl-7 section-padding">
        <div class="first-row section-bg round-border section-padding">
          <echart ref='chart1' :options='chart1' />
        </div>

      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 section-padding">
        <div class="first-row section-bg round-border section-padding">
          <echart ref='chart2' :options='chart2' />
        </div>
      </div>
      <template v-if='platform.id==10004'>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 section-padding">
          <div class="second-row section-bg round-border section-padding">
            <echart :options='chart3' />
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 section-padding">
          <div class="second-row section-bg round-border section-padding">
            <echart ref='chart4' :options='chart4' />
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 section-padding">
          <div class="second-row section-bg round-border section-padding">
            <echart :options='chart5' />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 section-padding">
          <div class="second-row section-bg round-border section-padding">
            <echart :options='chart3' />
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 section-padding">
          <div class="second-row section-bg round-border section-padding">
            <echart ref='chart4' :options='chart4' />
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 section-padding">
          <div class="second-row section-bg round-border section-padding">
            <echart :options='chart5' />
          </div>
        </div>
      </template>
    </div>
   

  </q-page>
</template>

<script>
import Echart from "../../components/Echart";
import datepicker from "../../components/datepicker";
const echarts = require("echarts/lib/echarts");
//import 'echarts/map/js/china'
//require("echarts/map/js/china")
import "echarts/map/js/china.js";
export default {
  data() {
    return {
      dataParama: {}, //日期查询参数
      selParking: "all", //选中的停车场
      parkings: [
        {
          //停车场列表
          label: "所有停车场",
          value: "all"
        },
        {
          label: "Google",
          value: "goog"
        },
        {
          label: "Facebook",
          value: "fb"
        }
      ],
      chart1: {},
      chart2: {},
      chart3: {},
      chart4: {},
      chart5: {}
    };
  },
  components: {
    datepicker,
    Echart
  },
  watch: {
    platform: function() {      
      this.refresh();
    },
    selParking: function() {
      this.refresh();
    },
    dataParama: function() {
      this.refresh();
    }
  },
  computed: {
    echart1() {
      return this.$refs.chart1;
    },
    echart2() {
      return this.$refs.chart2;
    },
    echart4() {
      return this.$refs.chart4;
    },
    platform() {
      return this.$store.state.platform;
    },
   
  },
  methods: {
    refresh() {
      this.chart1={}
      this.chart2={}
      this.chart3={}
      this.chart4={}
      this.chart5={}
      //this.getVehicleOrigin();
      if (this.platform.id == "10004") {
        this.loadDataAnalysisAarea();
        this.loadDataAnalysisAgeGroup();
        this.loadDataAnalysisSex();
        this.loadDataAnalysisExpenditure();
        this.loadDataAnalysisStay();
      } else {
        this.loadTouristProvince();
        this.loadTouristAge();
        this.loadTouristArea();
        this.loadTouristSex();
        this.loadTouristEntryTime();
      }
    },
    dateChange(p) {
      this.dataParama = p;
      this.refresh();
    },
    //游客入园时段分析
    loadTouristEntryTime() {
      let option = {
        tooltip: {
          trigger: "axis"
        },
        title: {
          text: "游客入园时段分析"
        },
        xAxis: {
          type: "category",
          data: []
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [],
            type: "line",
            areaStyle: {},
            label: {
              normal: {
                show: true,
                position: "top"
              }
            }
          }
        ]
      };
      this.$axios({
        url: "/tourist/loadTouristEntryTime",
        method: "GET",
        params: {
          scenicName:
            this.platform.scenicName == "home" ? "" : this.platform.scenicName,
          queryTimeType: this.dataParama.type,
          startDate: this.dataParama.start,
          endDate: this.dataParama.end
        }
      })
        .then(res => {
          res.desc.forEach(f => {
            option.xAxis.data.push(f.type);
            option.series[0].data.push(f.quantity);
          });
          this.chart2 = option;
        })
        .catch(e => {
          this.chart2 = option;
        });
    },

    //游客性别分析
    loadTouristSex() {
      let option = {
        legend: {
          top: "13%"
        },
        title: {
          text: "游客性别比例分析"
        },
        tooltip: {},
        calculable: true,
        series: [
          {
            name: "性别比例",
            type: "pie",
            startAngle: 0,
            radius: ["0%", "55%"],
            center: ["50%", "60%"],
            //roseType: 'area',
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                formatter: "{b}{c|{c}人}\n{hr|}\n{d|{d}%}",
                rich: {
                  b: {
                    align: "left",
                    padding: 4
                  },
                  hr: {
                    borderColor: "#12EABE",
                    width: "100%",
                    borderWidth: 1,
                    height: 0
                  },
                  d: {
                    align: "left",
                    padding: 4
                  },
                  c: {
                    align: "left",
                    padding: 4
                  }
                }
              },
              emphasis: {
                show: true
              }
            },

            data: []
          }
        ]
      };
      this.$axios({
        url: "/tourist/loadTouristSex",
        method: "GET",
        params: {
          scenicName:
            this.platform.scenicName == "home" ? "" : this.platform.scenicName,
          queryTimeType: this.dataParama.type,
          startDate: this.dataParama.start,
          endDate: this.dataParama.end
        }
      })
        .then(res => {
          option.series[0].data = res.desc.map(m => {
            m.name = m.type;
            m.value = m.quantity;
            return m;
          });
          this.chart4 = option;
        })
        .catch(e => {
          this.chart4 = option;
        });
    },
    //游客来源区域分析
    loadTouristArea() {
      let option = {
        legend: {
          top: "13%"
        },
        title: {
          text: "游客来源区域分析"
        },
        tooltip: {},
        calculable: true,

        series: [
          {
            name: "来源地",
            type: "pie",
            startAngle: 0,
            radius: ["0%", "55%"],
            center: ["50%", "60%"],
            //roseType: 'area',
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                formatter: "{b}{c|{c}人}\n{hr|}\n{d|{d}%}",
                rich: {
                  b: {
                    align: "left",
                    padding: 4
                  },
                  hr: {
                    borderColor: "#12EABE",
                    width: "100%",
                    borderWidth: 1,
                    height: 0
                  },
                  d: {
                    align: "left",
                    padding: 4
                  },
                  c: {
                    align: "left",
                    padding: 4
                  }
                }
              },
              emphasis: {
                show: true
              }
            },

            data: []
          }
        ]
      };
      this.$axios({
        url: "/tourist/loadTouristArea",
        method: "GET",
        params: {
          scenicName:
            this.platform.scenicName == "home" ? "" : this.platform.scenicName,
          queryTimeType: this.dataParama.type,
          startDate: this.dataParama.start,
          endDate: this.dataParama.end
        }
      })
        .then(res => {
          option.series[0].data = res.desc.map(m => {
            m.name = m.type;
            m.value = m.quantity;
            return m;
          });
          this.chart5 = option;
        })
        .catch(e => {
          this.chart5 = option;
        });
    },
    //游客年龄分析
    loadTouristAge() {
      let option = {
        //  backgroundColor: '#0a1235',
        color: [
          "#f845f1",
          "#ad46f3",
          "#5045f6",
          "#4777f5",
          "#44aff0",
          "#45dbf7",
          "#f6d54a",
          "#f69846",
          "#ff4343"
        ],
        legend: {
          top: "10%"
        },
        title: {
          text: "游客年龄段分析"
        },
        tooltip: {},
        calculable: true,

        series: [
          {
            name: "游客年龄段",
            type: "pie",
            startAngle: 0,
            radius: ["0%", "55%"],
            center: ["50%", "60%"],
            //roseType: 'area',
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                formatter: "{b}岁 {c|{c}人}\n{hr|}\n{d|{d}%}",
                rich: {
                  b: {
                    align: "left",
                    padding: 4
                  },
                  hr: {
                    borderColor: "#12EABE",
                    width: "100%",
                    borderWidth: 1,
                    height: 0
                  },
                  d: {
                    align: "left",
                    padding: 4
                  },
                  c: {
                    align: "left",
                    padding: 4
                  }
                }
              },
              emphasis: {
                show: true
              }
            },

            data: []
          }
        ]
      };
      this.$axios({
        url: "/tourist/loadTouristAge",
        method: "GET",
        params: {
          scenicName:
            this.platform.scenicName == "home" ? "" : this.platform.scenicName,
          queryTimeType: this.dataParama.type,
          startDate: this.dataParama.start,
          endDate: this.dataParama.end
        }
      })
        .then(res => {
          option.series[0].data = res.desc.map(m => {
            m.name = m.type;
            m.value = m.quantity;
            return m;
          });
          this.chart3 = option;
        })
        .catch(e => {
          this.chart3 = option;
        });
    },
    //游客来源区域分析
    loadTouristProvince() {
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
      let piedata = [],
        xAxis = [];
      this.$axios({
        url: "/tourist/loadTouristProvince",
        method: "GET",
        params: {
          scenicName:
            this.platform.scenicName == "home" ? "" : this.platform.scenicName,
          trackNo: this.selParking == "all" ? null : this.selParking,
          queryTimeType: this.dataParama.type,
          startDate: this.dataParama.start,
          endDate: this.dataParama.end
        }
      }).then(res => {
        if (res.desc) {
          res.desc.sort((a,b)=>{
            return b.quantity-a.quantity
          }).forEach(f => {
            if (geoCoordMap[f.type]) {
              BJData.push([
                {
                  name: "江苏"
                },
                {
                  name: f.type,
                  value: f.quantity
                }
              ]);
            }
            xAxis.push(f.type);
            piedata.push(f.quantity);
          });
          origin = {
            grid:{
              left:'55%'
            },
            title: {
              text: "全国游客来源TOP5"
            },
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
            xAxis: {
              type: "category",
              data: xAxis
            },
            yAxis: {
              type: "value"
            },

            visualMap: {
              show: true,
              min: 0,
              max: 500,
              left: "left",
              top: "bottom",
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
                  "#4842fb",
                  "#8b34fd"
                ]
              }
            },

            geo: {
              show: true,
              map: "china",
              left: "5%",

              // layoutSize: '80%',
              label: {
                normal: {
                  show: true,
                  color: "white"
                },
                emphasis: {
                  show: false
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
                  return 8;
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
              },
              { 
                tooltip:{

                },
                name: "游客来源地",
                type: "bar",               
                label:{
                  show:true,
                  position:'top'
                },
                barMaxWidth:'30',
                data: piedata
              }
            ]
          };
          this.chart1 = origin;
        }
      });
    },

    //老街维度数据分析之区域分析
    loadDataAnalysisAarea() {
      var labelOption = {
        normal: {
          show: true,
          position: "insideBottom",
          distance: 15,
          align: "left",
          verticalAlign: "middle",
          rotate: 90,
          formatter: "{c}  {name|{a}}",
          fontSize: 12,
          rich: {
            // name: {
            //   textBorderColor: "#fff"
            // }
          }
        }
      };
      let option = {
        title: {
          text: "游客区域分析"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "right"
        },
        series: [
          {
            name: "游客性别比例",
            type: "pie",
            radius: ["45%", "75%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: "inside",
                formatter: "{b}:{c} ({d}%)"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "18",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: []
          }
        ]
      };

      this.$axios({
        url: "/loadDataAnalysisAarea",
        method: "GET",
        params: {
          startDate: this.dataParama.start,
          endDate: this.dataParama.end
        }
      })
        .then(res => {
          option.series[0].data = res.desc;
          this.chart3 = option;
        })
        .catch();
    },
    //老街维度数据分析之年龄分析
    loadDataAnalysisAgeGroup() {
      let option = {
        title: {
          text: "游客年龄段分析"
        },
        legend: {},
        tooltip: {
          trigger: "axis",
          showContent: true
        },
        dataset: {
          source: []
        },
        xAxis: {
          type: "category"
        },
        yAxis: {
          gridIndex: 0
        },
        grid: {
          right: "30%"
        },
        series: []
      };

      this.$axios({
        url: "/loadDataAnalysisAgeGroup",
        method: "GET",
        params: {
          startDate: this.dataParama.start,
          endDate: this.dataParama.end
        }
      })
        .then(res => {
          let source = [],
            series = [];
          source.push(["hour", ...res.desc.xAxis]);

          res.desc.series.forEach(s => {
            let row = [s.name, ...s.data];
            source.push(row);
            series.push({
              type: "line",
              smooth: true,
              seriesLayoutBy: "row"
            });
          });
          series.push({
            type: "pie",
            id: "pie",
            radius: "45%",
            center: ["80%", "50%"],
            label: {
              formatter: "{b}: {d}%",
              // position: 'inside',
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "18",
                  fontWeight: "bold"
                }
              }
            },
            encode: {
              itemName: "hour",
              value: source[0][1],
              tooltip: source[0][1]
            }
          });
          option.dataset.source = source;
          option.series = series;

          this.echart4.chart.on("updateAxisPointer", event => {
            var xAxisInfo = event.axesInfo[0];
            if (xAxisInfo) {
              var dimension = xAxisInfo.value + 1;
              this.echart4.chart.setOption({
                series: {
                  id: "pie",
                  label: {
                    formatter: "{b}: {@[" + dimension + "]} ({d}%)",
                    emphasis: {
                      show: true,
                      textStyle: {
                        fontSize: "18",
                        fontWeight: "bold"
                      }
                    }
                  },
                  encode: {
                    value: dimension,
                    tooltip: dimension
                  }
                }
              });
            }
          });
          this.chart4 = option;
        })
        .catch();
    },
    //老街维度数据分析之性别分析
    loadDataAnalysisSex() {
      let option = {
        title: {
          text: "游客性别比例分析"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "right"
        },
        series: [
          {
            name: "游客性别比例",
            type: "pie",
            radius: ["45%", "75%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: "inside",
                formatter: "{b}:{c} ({d}%)"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "18",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: []
          }
        ]
      };

      this.$axios({
        url: "/loadDataAnalysisSex",
        method: "GET",
        params: {
          startDate: this.dataParama.start,
          endDate: this.dataParama.end
        }
      })
        .then(res => {
          option.series[0].data = res.desc;
          this.chart5 = option;
        })
        .catch();
    },
    //老街维度数据分析之消费分析
    loadDataAnalysisExpenditure() {
      let option = {
        title: {
          text: "游客消费能力分析"
        },
        legend: {},
        tooltip: {
          trigger: "axis",
          showContent: true
        },
        dataset: {
          source: []
        },
        xAxis: {
          type: "category"
        },
        yAxis: {
          gridIndex: 0
        },
        grid: {
          right: "30%"
        },
        series: []
      };

      this.$axios({
        url: "/loadDataAnalysisExpenditure",
        method: "GET",
        params: {
          startDate: this.dataParama.start,
          endDate: this.dataParama.end
        }
      })
        .then(res => {
          let source = [],
            series = [];
          source.push(["hour", ...res.desc.xAxis]);

          res.desc.series.forEach(s => {
            let row = [s.name, ...s.data];
            source.push(row);
            series.push({
              type: "line",
              smooth: true,
              seriesLayoutBy: "row"
            });
          });
          series.push({
            type: "pie",
            id: "pie",
            radius: "45%",
            center: ["85%", "50%"],
            label: {
              formatter: "{b}: {d}%",
              position: "inside",
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "18",
                  fontWeight: "bold"
                }
              }
            },
            encode: {
              itemName: "hour",
              value: source[0][1],
              tooltip: source[0][1]
            }
          });
          option.dataset.source = source;
          option.series = series;

          this.echart1.chart.on("updateAxisPointer", event => {
            var xAxisInfo = event.axesInfo[0];
            if (xAxisInfo) {
              var dimension = xAxisInfo.value + 1;
              this.echart1.chart.setOption({
                series: {
                  id: "pie",
                  label: {
                    formatter: "{b}: {@[" + dimension + "]} ({d}%)",
                    emphasis: {
                      show: true,
                      textStyle: {
                        fontSize: "18",
                        fontWeight: "bold"
                      }
                    }
                  },
                  encode: {
                    value: dimension,
                    tooltip: dimension
                  }
                }
              });
            }
          });

          this.chart1 = option;
        })
        .catch();
    },
    //老街维度数据分析之停留时间分析
    loadDataAnalysisStay() {
      let option = {
        title:{
          text:'游客停留时间分析'
        },
        legend: {
          right:'right'
        },
        tooltip: {
          trigger: "axis",
          showContent: true
        },
        dataset: {
          source: []
        },
        xAxis: {
          type: "category"
        },
        yAxis: {
          gridIndex: 0
        },
        grid: {
          top: "55%"
        },
        series: []
      };

      this.$axios({
        url: "/loadDataAnalysisStay",
        method: "GET",
        params: {
          startDate: this.dataParama.start,
          endDate: this.dataParama.end
        }
      })
        .then(res => {
          let source = [],
            series = [];
          source.push(["hour", ...res.desc.xAxis]);

          res.desc.series.forEach(s => {
            let row = [s.name, ...s.data];
            source.push(row);
            series.push({
              type: "line",
              smooth: true,
              seriesLayoutBy: "row"
            });
          });
          series.push({
            type: "pie",
            id: "pie",
            radius: "30%",
            center: ["50%", "35%"],
            label: {
              formatter: "{b}:{d}%",
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "18",
                  fontWeight: "bold"
                }
              }
            },

            encode: {
              itemName: "hour",
              value: source[0][1],
              tooltip: source[0][1]
            }
          });
          option.dataset.source = source;
          option.series = series;

          console.log(this.echart2);

          this.echart2.chart.on("updateAxisPointer", event => {
            var xAxisInfo = event.axesInfo[0];
            if (xAxisInfo) {
              var dimension = xAxisInfo.value + 1;
              this.echart2.chart.setOption({
                series: {
                  id: "pie",
                  label: {
                    formatter: "{b}: {@[" + dimension + "]} ({d}%)"
                  },
                  encode: {
                    value: dimension,
                    tooltip: dimension
                  }
                }
              });
            }
          });

          this.chart2 = option;
        })
        .catch();
    }
  },
  mounted() {},
  activated(){

  }
};
</script>
<style scoped lang='stylus'>
@import '~variables';

.red-font {
  red-linear();
}
</style>
