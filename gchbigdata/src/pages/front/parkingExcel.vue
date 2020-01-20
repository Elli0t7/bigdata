<template>
  <q-page class="row page fit ">
    <div class="col-12 cust-col section-padding " style="padding:4vh">
      <q-table id='ex_table' class="full-width section-bg" ref="table" color='cyan-12' :dark='true' title='停车场数据导出'
        :data="serverData" :columns="currentExType.columns" :filter="filter" loading-label='正在加载' row-key="rowNum"
        :selected.sync="selectedSecond" :pagination.sync="serverPagination" :loading="loading" :separator="separator"
        @request="request">
        <template slot="top" slot-scope="props">
          <!-- tb-title text-bl -->
          <div class="row full-width tb-title">
            <div class="col-2">
               <q-field dark color='cyan-12' >
              <q-select dark color='cyan-12' class="ex_title "  :hide-underline='true'  @input="onExTypeChange" v-model="exType" radio :options='exportTypes' />   
            </q-field>   
            </div>
                 
          </div> 
          <div class="row gutter-sm fit">             
            <div class="col-2 ">
              <q-field dark color='cyan-12' :label-width='3' label='景区'>
                <q-select dark color='cyan-12' v-model="ScenicName" @input='onScenicNameChange' radio :options="ScenicNameOptions" />
              </q-field>
            </div>
            <div class="col-2 ">
              <q-field dark color='cyan-12' :label-width='3' label='停车场'>
                <q-select color='cyan-12' dark v-model="trackNo" @input="onTrackNoChange" radio :options="trackNoOptions" />
              </q-field>
            </div>
            <div class="col-6 ">
              <datepicker id='ex_tb' @query='dateChange' />
            </div>
            <div class="col-1">
              <q-btn icon='search' color='blue' label='查询' @click="doQuery" />
            </div>
            <div class="col-1">
              <a v-if="isCanExport" download='停车来源' :href="href">
                <q-btn icon='bar_chart' color='blue' label='导出'></q-btn>
              </a>
              <q-btn v-else icon='bar_chart' color='blue' label='导出' :disable='!isCanExport'></q-btn>
            </div>
            <div v-if='exType==1' class="col-2 ">
              <q-field dark color='cyan-12' :label-width='3' label='省份'>
                <q-select dark color='cyan-12' v-model="province" @input='onProvinceChange' radio :options="provinceOptions" />
              </q-field>
            </div>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
  import datepicker from '../../components/datepicker'
  export default {
    // name: 'PageName',

    data() {
      return {
        provinceOptions: [{
          label: '江苏',
          value: '江苏'
        }, {
          label: '安徽',
          value: '安徽'
        }],
        province: '江苏',
        exType: 0,
        currentExType: {},
        exportTypes: [{
            label: '车辆来源(省)数据导出',
            value: 0,
            api: '/backendPark/park/loadCarSourceProvinceExcel',
            links: '/backendPark/park/excel/loadCarSourceProvinceExcel?',
            columns: [{
                name: "rowNum",
                label: "行号",
                field: "rowNum",
                sortable: true,
                required: true,
                align: 'left'
              },
              {
                name: "dateTime",
                label: "日期",
                field: "dateTime",
                required: true,
                align: 'left'
              },
              {
                name: "province",
                label: "省份",
                field: "province",
                sortable: true,
                required: true,
                align: 'left'
              },
              {
                name: "label",
                label: "景区名称",
                field: "label",
                required: true,
                align: 'left'
              },
              {
                name: "trackName",
                label: "停车场",
                field: "trackName",
                required: true,
                align: 'left'
              },
              {
                name: "carCount",
                label: "数量(辆)",
                field: "carCount",
                required: true,
                align: 'left'
              },

            ]
          },
          {
            label: '车辆来源(市)数据导出',
            value: 1,
            api: '/backendPark/park/loadCarSourceCityExcel',
            links: '/backendPark/park/excel/loadCarSourceCityExcel?',
            columns: [{
                name: "rowNum",
                label: "行号",
                field: "rowNum",
                sortable: true,
                required: true,
                align: 'left'
              },
              {
                name: "dateTime",
                label: "日期",
                field: "dateTime",
                required: true,
                align: 'left'
              },
              {
                name: "city",
                label: "市/区",
                field: "city",
                sortable: true,
                required: true,
                align: 'left'
              },
              {
                name: "label",
                label: "景区名称",
                field: "label",
                required: true,
                align: 'left'
              },
              {
                name: "trackName",
                label: "停车场",
                field: "trackName",
                required: true,
                align: 'left'
              },
              {
                name: "carCount",
                label: "数量(辆)",
                field: "carCount",
                required: true,
                align: 'left'
              },

            ]
          },
          {
            label: '停车场每日收入导出',
            value: 2,
            api: '/backendPark/park/loadCarSourcePayAmountExcel',
            links: '/backendPark/park/excel/loadCarSourcePayAmountExcel?',
            columns: [{
                name: "rowNum",
                label: "行号",
                field: "rowNum",
                sortable: true,
                required: true,
                align: 'left'
              },
              {
                name: "dateTime",
                label: "日期",
                field: "dateTime",
                required: true,
                align: 'left'
              },
              {
                name: "label",
                label: "景区名称",
                field: "label",
                required: true,
                align: 'left'
              },
              {
                name: "trackName",
                label: "停车场",
                field: "trackName",
                required: true,
                align: 'left'
              },
              {
                name: "pay_amount",
                label: "金额",
                field: "pay_amount",
                required: true,
                align: 'left'
              },

            ]
          },
          {
            label: '停车时间段分析导出',
            value: 3,
            api: '/backendPark/park/loadDayPeriodTimeExcel',
            links: '/backendPark/park/excel/loadCarSourceProvinceExcel?',
            columns: [{
                name: "rowNum",
                label: "行号",
                field: "rowNum",
                sortable: true,
                required: true,
                align: 'left'
              },
              {
                name: "dateTime",
                label: "日期",
                field: "dateTime",
                required: true,
                align: 'left'
              },
              {
                name: "periodTime",
                label: "时间段",
                field: "periodTime",
                sortable: true,
                required: true,
                align: 'left'
              },
              {
                name: "label",
                label: "景区名称",
                field: "label",
                required: true,
                align: 'left'
              },
              {
                name: "trackName",
                label: "停车场",
                field: "trackName",
                required: true,
                align: 'left'
              },
              {
                name: "periodTimeCount",
                label: "数量(辆)",
                field: "periodTimeCount",
                required: true,
                align: 'left'
              },

            ]
          },
        ],

        href: '',
        isCanExport: false,
        startDate: '',
        endDate: '',
        dateType: '',
        ScenicName: '',
        ScenicNameOptions: [],
        trackNo: '',
        trackNoOptions: [{
          label: '所有停车场',
          value: ''
        }, ],
        layoutModal: false,
        filter: "",
        loading: false,
        serverPagination: {
          rowsPerPage: 10,
          page: 1,
          rowsNumber: 10 // 指定这个属性就确定了分页是服务器端的
        },
        selectedSecond: [],
        separator: "horizontal",
        serverData: [],
       
      };
    },
    components: {
      datepicker
    },
    computed: {
      platforms() {
        return this.$store.state.platforms;
      },
    },
    mounted() {
      this.loadScenicList();
      this.currentExType = this.exportTypes[0]
    },
    methods: {
      onTrackNoChange(){
        this.doQuery()
      },
      onProvinceChange() {
        this.doQuery()
      },
      onExTypeChange() {
        this.currentExType = this.exportTypes[this.exType];
        this.doQuery();
      },
      loadScenicList() {
        this.$axios({
          url: '/navigate/loadScenicList',
          method: 'GET'
        }).then(r => {
          this.ScenicNameOptions = r.desc.map(f => {
            f.value = f.scenicName
            return f
          })
          if (this.ScenicNameOptions.length > 0) {
            this.ScenicName = this.ScenicNameOptions[0].value
          }
        }).catch()
      },
      onScenicNameChange(scenicName) {
        this.$axios({
          method: 'GET',
          url: '/loadParkUsageRate',
          params: {
            scenicName: scenicName
          }
        }).then(r => {
          let trackNoOptions = [{
            label: '所有停车场',
            value: ''
          }, ];
          r.desc.forEach(f => {            
            trackNoOptions.push({
              label: f.trackName,
              value: f.trackNo
            })
          });
          this.trackNoOptions = trackNoOptions;
          this.trackNo=trackNoOptions[0].value
          this.doQuery()
        }).catch()
      },
      doQuery() {
        this.request({
          pagination: {
            page: 1,
            rowsPerPage: this.serverPagination.rowsPerPage
          }
        });
      },
      dateChange(e) {
        this.startDate = e.start
        this.endDate = e.end;
        this.dateType = e.type
        this.doQuery()
      },
      request(props) {
        
        let links = process.env.BASE_API + this.currentExType.links
        let params = {
          currentPage: props.pagination.page,
          pageSize: props.pagination.rowsPerPage,
        }
        if (this.dateType && this.dateType != 'custom') {
          params.type = this.dateType
          links += `type=${this.dateType}`
        } else {
          params.startDate = this.startDate
          params.type = this.dateType
          params.endDate = this.endDate
          links += `type=${this.dateType}&startDate=${this.startDate}&endDate=${this.endDate}`
        }

        if (this.ScenicName && this.ScenicName != 'home') {
          params.scenicName = this.ScenicName
          links += `&scenicName=${this.ScenicName}`
        }
        if (this.trackNo) {
          params.trackNo = this.trackNo
          links += `&trackNo=${this.trackNo}`
        }
        if (this.exType == 1) {
          params.province = this.province
          links += `&province=${this.province}`
        }
        this.href = links
        this.loading = true;
        this.$axios({
            method: "GET",
            url: this.currentExType.api,
            params: params
          })
          .then(res => {
            if (!res.desc) {
              this.serverData = []
              this.$q.notify({
                message: '没有数据。',
                type: 'info'
              })
              this.isCanExport = false
              this.loading = false;
              return
            }
            this.serverPagination = props.pagination
            // 然后我们更新提取的行
            this.serverData = res.desc.backList.map((a, b, c) => {
              a.rowNum = b + 1
              return a
            }).sort((a, b) => {
              return a.rowNum - b.rowNum
            });
            if (res.desc.backList.length > 0) {
              this.isCanExport = true
            } else {
              this.isCanExport = false
            }
            this.serverPagination.rowsNumber = res.desc.totalRecord
            // 最后我们告诉QTable退出“加载”状态
            this.loading = false;
          })
          .catch(err => {
            this.serverData=[]
            this.loading = false;
            this.isCanExport=false
            this.$q.notify({
              message: '查询失败！请稍后再试',
              type: 'negative'
            })
          });
      }
    }
  };

</script>

<style>
  #ex_tb .q-tabs-head {
    background: transparent !important
  }

  #ex_table .q-table-middle {
    max-height: 60vh !important
  }

  .tb-title {
    font-size: 2.2vh;
    letter-spacing: 2px;
    padding: 2vh 0;
      }
  .ex_title{
    font-size: 2.2vh;
    line-height: 2.8vh;
  }    

</style>
