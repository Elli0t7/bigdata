<template>
  <q-page class="page">
    <div class="row justify-center" id='pageHeader'>
      <!-- <div class="col-lg-5 col-xl-4 desktop-only section-padding"></div>       -->
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-5">
        <datepicker @query='dateChange' />
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 section-padding">
        <div class="first-row section-bg round-border section-padding">
          <echart :options='chart1' />
        </div>

      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 section-padding">
        <div class="first-row section-bg round-border section-padding">
          <echart :options='chart2' />
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 section-padding">
        <div class="second-row section-bg round-border section-padding">
          <echart :options='chart3' />
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 section-padding">
        <div class="second-row section-bg round-border section-padding">
          <echart :options='chart4' />
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 section-padding">
        <div class="second-row section-bg round-border section-padding">
          <echart :options='chart5' />
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
        interval: '',
        dataParama: {}, //日期查询参数        
        chart1: {},
        chart2: {},
        chart3: {},
        chart4: {},
        chart5: {}

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

    },
    computed: {
      platform() {
        return this.$store.state.platform;
      },

    },
    methods: {
      refresh() {
        this.loadTicketSalesStatistics()
        this.loadTicketSpeciesAnalysis()
        this.loadTicketPieChartStatistics('pay')
        this.loadTicketPieChartStatistics('sellAddress')
        this.loadTicketFreeRatio()
      },
      dateChange(p) {

        this.dataParama = p;
        this.refresh()
      },
      //门票售卖免费与收费详情
      loadTicketFreeRatio(){
        let option = {
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
       
    },

    xAxis : [
        {
            type : 'category',
            data : []
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'收费门票',
            type:'bar',
            data:[]
        },
        {
            name:'免费门票',
            type:'bar',           
            data:[]
        },
       
       
    ]
};
        this.$axios({
          url:'/ticket/loadTicketFreeRatio',
          method:'GET',
          params:{
            scenicName: this.platform.scenicName == 'home' ? '' : this.platform.scenicName,
            queryTimeType: this.dataParama.type,
            startDate: this.dataParama.start,
            endDate: this.dataParama.end
          }
        }).then(res=>{
          let dates=[],fee=[],unfee=[]          
          res.desc.forEach(f=>{
            if(dates.indexOf(f.dateStr)==-1){
              dates.push(f.dateStr)
            }
          })
          dates.forEach(f=>{
            let _fee=res.desc.filter(fi=>{return fi.dateStr==f&&fi.name=='收费'})
            let _unfee=res.desc.filter(fi=>{return fi.dateStr==f&&fi.name=='免费'})
            if (_fee.length>0){
              fee.push(_fee[0].count)
            }else{
              fee.push(0)
            }
             if (_unfee.length>0){
              unfee.push(_unfee[0].count)
            }else{
              unfee.push(0)
            }
          })

          option.xAxis[0].data=dates
          option.series[0].data=fee
          option.series[1].data=unfee
          this.chart5=option

        }).catch(e=>{
           this.chart5=option
        })
      },
      //门票售卖统计列表
      loadTicketSalesStatistics() {

        let option = {
        title: {
          text: "票务销售量分析"
        },
        legend: {},
        grid:{
          bottom:'20%'
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
          axisLabel:{
            rotate:30,
            margin:30 
          }          
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "售票数量",
            data: [],
            type: "line",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: {}
          },
          {
            name: "退票数量",
            data: [],
            type: "line",
            label: {
              normal: {
                show: true,
                position: "bottom"
              }
            },
            areaStyle: {}
          }
        ]
      };


        this.$axios({
          method: 'GET',
          url: '/ticket/loadTicketSalesStatistics',
          params: {
            scenicName: this.platform.scenicName == 'home' ? '' : this.platform.scenicName,
            queryTimeType: this.dataParama.type,
            startDate: this.dataParama.start,
            endDate: this.dataParama.end
          }
        }).then(res => {
           res.desc.forEach(f => {
            option.xAxis.data.push(f.dateStr);
            option.series[0].data.push(f.number);
            option.series[1].data.push(f.outNumber);
          });
         

         
          this.chart1 = option

        }).catch(e => {
          this.chart1 = option
        })
      },
      //门票种类销售分析
      loadTicketSpeciesAnalysis() {

        let option = {
          title: {
            text: '票务种类分析',

          },
          series: {
            type: 'sunburst',
            highlightPolicy: 'ancestor',
            data: [],
            radius: [0, '100%'],
            sort: null,
            label: {
              formatter: '{b}：{c} 张'
            },
            levels: [{}, {
                r0: '0%',
                r: '35%',
                itemStyle: {
                  borderWidth: 2
                },
                label: {
                  rotate: 'tangential',

                }
              },
              {
                r0: '35%',
                r: '55%',
                label: {
                  position: 'outside',
                  padding: 3,
                  silent: false,

                },
                itemStyle: {
                  borderWidth: 3
                }
              }
            ]
          }
        };




        this.$axios({
          url: '/ticket/loadTicketSpeciesAnalysis',
          method: 'GET',
          params: {
            scenicName: this.platform.scenicName == 'home' ? '' : this.platform.scenicName,
            queryTimeType: this.dataParama.type,
            startDate: this.dataParama.start,
            endDate: this.dataParama.end
          }
        }).then(res => {
          option.series.data = res.desc
          this.chart2 = option
        }).catch(e => {
          this.chart2 = option
        })
      },
      //门票支付类型分析
      loadTicketPieChartStatistics(statisticsType) {

        let option = {
          title: {
            text: '',
          },

          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [{
            name: '支付方式',
            type: 'pie',
            radius: statisticsType == 'pay' ? '55%' : ['35%', '60%'],
            center: ['50%', '50%'],
            data: [],
            label: {
              normal: {
                formatter: '{b|{b}}\n{hr|}\n{c}张 {d|{d}%}',
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
            // roseType: 'radius',           
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }]
        };
        this.$axios({
          url: '/ticket/loadTicketPieChartStatistics',
          method: 'GET',
          params: {
            scenicName: this.platform.scenicName == 'home' ? '' : this.platform.scenicName,
            trackNo: this.selParking == 'all' ? null : this.selParking,
            queryTimeType: this.dataParama.type,
            startDate: this.dataParama.start,
            endDate: this.dataParama.end,
            statisticsType: statisticsType
          }
        }).then(res => {

          option.series[0].data = res.desc.map(m => {
            m.name = m.type
            m.value = m.quantity
            return m
          }).sort(function (a, b) {
            return b.value - a.value;
          })

          if (statisticsType == 'pay') {
            option.title.text = '支付类型'
            this.chart3 = option
          } else if (statisticsType == 'sellAddress') {
            option.title.text = '取票窗口'
            this.chart4 = option
          }
        }).catch(e => {
          console.error(e)
        })
      }

    },
    mounted() {

      this.Interval = setInterval(() => {
        this.refresh();
      }, this.$store.state.frequency);
    }
  }

</script>
<style scoped lang='stylus'>
  @import '~variables';

</style>
