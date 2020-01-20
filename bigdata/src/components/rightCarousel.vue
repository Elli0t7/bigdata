<template>
  <swiper :options='{autoplay:true}' class="fit">
    <template v-if="platform.id=='10001'">
      <swiper-slide class="pop-box">
        <div class="pop-name">支付类型统计</div>
        <div class="chart-box">
          <echart :options='p1c11' />
        </div>
      </swiper-slide>
      <swiper-slide class="pop-box">
        <div class="pop-name">取票窗口售票量</div>
        <div class="chart-box">
          <echart key='p1c21' :options='p1c21' />
        </div>
      </swiper-slide>
      <swiper-slide class="pop-box">
        <div class="pop-name">游客入园时段分析</div>
        <div class="chart-box">
          <echart :options='p2c1' />
        </div>
      </swiper-slide>
      <swiper-slide class="pop-box">
        <div class="pop-name">游客性别比例分析</div>
        <div class="chart-box">
          <echart :options='p2c2' />
        </div>
      </swiper-slide>
      <swiper-slide class="pop-box">
        <div class="pop-name">游客来源区域分析</div>
        <div class="chart-box">
          <echart :options='p2c3' />
        </div>
      </swiper-slide>
    </template>
    <template v-if="platform.id=='10002'">
      <swiper-slide class="pop-box">
        <div class="pop-name">今日车辆来源比例</div>
        <div class="chart-box">
          <echart :options='p1c1' />
        </div>
      </swiper-slide>
      <swiper-slide class="pop-box">
        <div class="pop-name">今日各时段车流量</div>
        <div class="chart-box">
          <echart :options='p2c1' />
        </div>
      </swiper-slide>
    </template>
    <template v-if="platform.id=='10003'">
      <swiper-slide class="pop-box">
        <div class="pop-name">支付类型统计</div>
        <div class="chart-box">
          <echart :options='p1c11' />
        </div>
      </swiper-slide>
      <swiper-slide class="pop-box">
        <div class="pop-name">取票窗口售票量</div>
        <div class="chart-box">
          <echart key='p1c21' :options='p1c21' />
        </div>
      </swiper-slide>
      <swiper-slide class="pop-box">
        <div class="pop-name">游客入园时段分析</div>
        <div class="chart-box">
          <echart :options='p2c1' />
        </div>
      </swiper-slide>
      <swiper-slide class="pop-box">
        <div class="pop-name">游客性别比例分析</div>
        <div class="col-6">
          <echart :options='p2c2' />
        </div>
      </swiper-slide>
      <swiper-slide class="pop-box">
        <div class="pop-name">游客来源区域分析</div>
        <div class="chart-box">
          <echart :options='p2c3' />
        </div>
      </swiper-slide>
    </template>
    <template v-if="platform.id=='10004'">
      <swiper-slide class="pop-box">
        <div class="pop-name">本月游客区域分析</div>
        <echart :options='p1c1' />
      </swiper-slide>
      <swiper-slide class="pop-box">
        <div class="pop-name">游客性别比例分析</div>
        <echart :options='p1c2' />
      </swiper-slide>
      <swiper-slide class="pop-box">
        <div class="pop-name">游客年龄段分析</div>
        <echart ref='p1c3' :options='p1c3' />
      </swiper-slide>
    </template>
  </swiper>

</template>

<script>
import Echart from "./Echart";
import { date } from "quasar";
import countTo from "vue-count-to";
const echarts = require("echarts/lib/echarts");
import "echarts/map/js/china.js";
import "echarts/map/js/province/jiangsu.js";
import "echarts/map/js/province/anhui.js";
export default {
  name: "rightCarousel",
  data() {
    return {
      dataParama: {
        start: "",
        end: ""
      },
      autoplay: false,
      p1c1: {},
      p1c2: {},
      p1c3: {},
      p2c1: {},
      p2c2: {},
      p2c3: {},
      p3c1: {},
      p3c2: {},
      p3c3: {},
      p1c11: {},
      p1c21: {},
      p1c31: {}
    };
  },
  props: ["refreshtime"],
  components: {
    Echart,
    countTo
  },
  computed: {
    chartp1c3() {
      return this.$refs.p1c3;
    },
    platform() {
      return this.$store.state.platform;
    }
  },
  watch: {
    platform: function() {},
    refreshtime: function() {
      this.refresh();
    }
  },
  methods: {
    format(value) {
      return `${parseInt(value)}`;
    },
    refresh() {
      this.p1c1 = {};
      this.p1c2 = {};
      this.p1c3 = {};
      this.p2c1 = {};
      this.p2c2 = {};
      this.p2c3 = {};
      this.p3c1 = {};
      this.p3c2 = {};
      this.p3c3 = {};
      this.p1c11 = {};
      this.p1c21 = {};
      this.p1c31 = {};
      if (this.platform.id == "10002") {
        this.loadCarSource();
        this.loadVehicleStream();
      } else if (this.platform.id == "10004") {
        this.loadDataAnalysisAarea();
        this.loadDataAnalysisSex();
        this.loadDataAnalysisAgeGroup();
      } else {
        this.loadTicketPieChartStatistics("pay");
        this.loadTicketPieChartStatistics("sellAddress");
        // this.loadTicketSalesStatistics()
        this.loadTouristEntryTime();
        this.loadTouristArea();
        this.loadTouristSex();
      }

      // this.loadDataAnalysisSex()
      // this.loadDataAnalysisExpenditure()
      // this.loadDataAnalysisStay()
    },
    loadVehicleStream() {
      let option = {
        // title: {
        //   text: "今日各时段车流量"
        // },
        //显示series中信息，提示框组件
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        series: [
          {
            name: "今日各时段车流量",
            type: "pie",
            radius: "45%",
            center: ["50%", "50%"],
            label: {
              formatter: "{b} {d}%"
            },
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };

      this.$axios({
        url: "/loadVehicleStream",
        method: "GET",
        params: {
          scenicName:
            this.platform.scenicName == "home" ? "" : this.platform.scenicName,
          type: "day"
        }
      })
        .then(res => {
          if (res.desc && res.desc.length > 0) {
            option.series[0].data = res.desc.map(m => {
              m.name = m.dateStr;
              m.value = m.count;
              return m;
            });
          } else {
            let hours = new Date().getHours();
            option.series[0].data.push({
              name: date.formatDate(new Date(), "YYYY-MM-DD HH时"),
              value: 0
            });
          }
          this.p2c1 = option;
        })
        .catch(e => {
          this.p2c1 = option;
        });
    },

    loadCarSource() {
      let option = {
        // title: {
        //   text: "今日车辆来源比例"
        // },
        //显示series中信息，提示框组件
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        series: [
          {
            name: "今日车辆来源比例",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            label: {
              formatter: "{b} {d}%"
            },
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };

      this.$axios({
        url: "/loadCarSource",
        method: "GET",
        params: {
          scenicName:
            this.platform.scenicName == "home" ? "" : this.platform.scenicName,
          type: "day"
        }
      })
        .then(res => {
          if (res.desc.length > 0) {
            option.series[0].data = res.desc.map(m => {
              m.name = m.areaName;
              m.value = m.count;
              return m;
            });
          } else {
            option.series[0].data = [
              { name: "江苏", value: 0 },
              { name: "安徽", value: 0 },
              { name: "其他", value: 0 }
            ];
          }
          this.p1c1 = option;
        })
        .catch(e => {
          this.p1c1 = option;
        });
    },
    //游客入园时段分析
    loadTouristEntryTime() {
      let option = {
        tooltip: {
          trigger: "axis"
        },
        // title: {
        //   text: "游客入园时段分析"
        // },
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
          this.p2c1 = option;
        })
        .catch(e => {
          this.p2c1 = option;
        });
    },

    //游客性别分析
    loadTouristSex() {
      let option = {
        legend: {
          top: "13%"
        },
        // title: {
        //   text: "游客性别比例分析"
        // },
        tooltip: {},
        calculable: true,
        series: [
          {
            name: "性别比例",
            type: "pie",
            startAngle: 0,
            radius: ["0%", "50%"],
            center: ["50%", "50%"],
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
          this.p2c2 = option;
        })
        .catch(e => {
          this.p2c2 = option;
        });
    },
    //游客来源区域分析
    loadTouristArea() {
      let option = {
        legend: {
          top: "13%"
        },
        // title: {
        //   text: "游客来源区域分析"
        // },
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
          this.p2c3 = option;
        })
        .catch(e => {
          this.p2c3 = option;
        });
    },

    //门票支付类型分析
    loadTicketPieChartStatistics(statisticsType) {
      let option = {
        // title: {
        //   text: ""
        // },

        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "支付方式",
            type: "pie",
            radius: statisticsType == "pay" ? "45%" : ["30%", "50%"],
            center: ["50%", "50%"],
            data: [],
            label: {
              normal: {
                formatter: "{b|{b}}\n{hr|}\n{c} {d|{d}%}",
                rich: {
                  b: {
                    color: "#fff",
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
                    color: "#fff",
                    align: "left",
                    padding: 4
                  },
                  c: {
                    color: "#fff",
                    align: "center",
                    padding: 4
                  }
                }
              }
            },
            // roseType: 'radius',
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function(idx) {
              return Math.random() * 200;
            }
          }
        ]
      };
      this.p1c1 = {};
      this.$axios({
        url: "/ticket/loadTicketPieChartStatistics",
        method: "GET",
        params: {
          scenicName:
            this.platform.scenicName == "home" ? "" : this.platform.scenicName,
          trackNo: this.selParking == "all" ? null : this.selParking,
          queryTimeType: this.dataParama.type,
          startDate: this.dataParama.start,
          endDate: this.dataParama.end,
          statisticsType: statisticsType
        }
      })
        .then(res => {
          option.series[0].data = res.desc
            .map(m => {
              m.name = m.type;
              m.value = m.quantity;
              return m;
            })
            .sort(function(a, b) {
              return b.value - a.value;
            });

          if (statisticsType == "pay") {
            // option.title.text = "支付类型";
            this.p1c11 = option;
          } else if (statisticsType == "sellAddress") {
            // option.title.text = "取票窗口";
            this.p1c21 = option;
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    //老街维度数据分析之区域分析
    loadDataAnalysisAarea() {
      let option = {
        // title: {
        //   text: "本月游客区域分析"
        // },
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
            name: "游客区域分析",
            type: "pie",
            radius: ["35%", "55%"],
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
      this.p1c1 = {};
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
          this.p1c1 = option;
        })
        .catch();
    },

    //老街维度数据分析之性别分析
    loadDataAnalysisSex() {
      let option = {
        // title: {
        //   text: "游客性别比例分析"
        // },
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
            radius: ["35%", "55%"],
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
          this.p1c2 = option;
        })
        .catch();
    },

    //老街维度数据分析之年龄分析
    loadDataAnalysisAgeGroup() {
      this.p1c3 = {};
      let option = {
        // title: {
        //   text: "游客年龄段分析"
        // },
        legend: {
          top: "10%"
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
          top: "30%",
          left: "10%",
          right: "10%"
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
          option.dataset.source = source;
          option.series = series;
          this.p1c3 = option;
        })
        .catch();
    }
  },
  mounted() {
    let d = new Date();
    let nd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    this.dataParama.start = date.formatDate(d.setDate(1), "YYYY-MM-DD");
    this.dataParama.end = date.formatDate(nd, "YYYY-MM-DD");
    this.refresh();
  }
};
</script>

<style lang='stylus'>
</style>
