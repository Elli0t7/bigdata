<template>
  <q-page class="row page fit ">
    <div class="col-12 cust-col section-padding " style="padding:4vh">
      <q-table id='ex_table' class="full-width section-bg" ref="table" color='cyan-12' :dark='true' title='游客系数设置'
        :data="serverData" :columns="columns" loading-label='正在加载' row-key="id" :loading="loading" :hide-bottom='true'
        :visible-columns="visibleColumns" :separator="separator">
        <template slot="top" slot-scope="props">
          <div class="row tb-title text-bl">游客系数设置</div>
        </template>
        <q-tr slot="body" slot-scope="props" :props="props">
          <q-td class="scenicName text-bl" key="scenicName" :props="props">{{ props.row.scenicName }}</q-td>
          <q-td key="thisBear" :props="props">
            <q-field class="qf" v-if='props.row.isModify'>
              <q-input type='number' color='primary' :before="[{icon:'remove',handler(){if(props.row.thisBear>1){props.row.thisBear-=1}}}]"
                :after="[{icon:'add',handler(){props.row.thisBear+=1}}]" align='center' dark inverted v-model="props.row.thisBear" />
            </q-field>
            <span v-else>{{props.row.thisBear}}</span>
          </q-td>
          <q-td key="dayBear" :props="props">
            <q-field class="qf" v-if='props.row.isModify'>
              <q-input type='number' color='primary' :before="[{icon:'remove',handler(){if(props.row.dayBear>1){props.row.dayBear-=1}}}]"
                :after="[{icon:'add',handler(){props.row.dayBear+=1}}]" align='center' dark inverted v-model="props.row.dayBear" />
            </q-field>
            <span v-else>{{props.row.dayBear}}</span>
          </q-td>
          <q-td key="thisTourist" :props="props">
            <q-field class="qf" v-if='props.row.isModify'>
              <q-input type='number' color='primary' :before="[{icon:'remove',handler(){if(props.row.thisTourist>1){props.row.thisTourist-=1}}}]"
                :after="[{icon:'add',handler(){props.row.thisTourist+=1}}]" align='center' dark inverted v-model="props.row.thisTourist" />
            </q-field>
            <span v-else>{{props.row.thisTourist}}</span>
          </q-td>
          <q-td key="dayTourist" :props="props">
            <q-field class="qf" v-if='props.row.isModify'>
              <q-input type='number' color='primary' :before="[{icon:'remove',handler(){if(props.row.dayTourist>1){props.row.dayTourist-=1}}}]"
                :after="[{icon:'add',handler(){props.row.dayTourist+=1}}]" align='center' dark inverted v-model="props.row.dayTourist" />
            </q-field>
            <span v-else>{{props.row.dayTourist}}</span>
          </q-td>
          <q-td key="startTime" :props="props">
            <!-- <span >{{ props.row.startTime|dateFormater }}</span>  -->
            <q-field v-if="props.row.isModify">
              <q-datetime dark inverted :format24h='true' color="primary" formater='YYYY-MM-dd HH:mm:ss'
                :hide-underline='true' align='center' v-model="props.row.startTime" type="datetime" />
            </q-field>
            <span v-else>{{props.row.startTime}}</span>
          </q-td>
          <q-td key="endTime" :props="props">
            <!-- <span >{{props.row.endTime}}</span> -->
             <!-- <span >{{props.row.endTime|dateFormater}}</span> -->
            <q-field v-if="props.row.isModify">
              <q-datetime dark inverted :format24h='true' color="primary" formater='YYYY-MM-dd HH:mm:ss'
                :hide-underline='true' align='center' v-model="props.row.endTime" type="datetime" />
            </q-field>
            <span v-else>{{props.row.endTime}}</span>
          </q-td>
          <q-td key="updateTiem" :props="props">
            {{ props.row.updateTiem}}
          </q-td>
          <q-td key="id" :props="props">
            <q-btn size="md" :loading='props.row.saving' :color="props.row.isModify?'blue':'green'" class="q-mr-sm"
              @click="Modify(props.row)">
              <q-icon :name="props.row.isModify?'save':'edit'" />{{props.row.isModify?'保存':'编辑'}}
              <span slot="loading">
                <q-spinner-mat class="on-left" />
                保存
              </span>
            </q-btn>
          </q-td>
        </q-tr>
      </q-table>
    </div>
  </q-page>
</template>

<script>
  import {
    date
  } from 'quasar'
  import datepicker from '../../components/datepicker'
  export default {
    // name: 'PageName',

    data() {
      return {

        loading: false,
        visibleColumns: ["dayBear", "dayTourist", 'endTime', 'scenicName', 'startTime', 'thisBear', 'thisTourist',
          'updateTiem'
        ],
        separator: "horizontal",
        serverData: [],
        columns: [{
            name: "scenicName",
            label: "景区名称",
            field: "scenicName",
            required: true,
            align: 'left'
          },
          {
            name: "thisBear",
            label: "瞬时承载量",
            field: "thisBear",
            required: true,
            align: 'left'
          },
          {
            name: "dayBear",
            label: "日承载量",
            field: "dayBear",
            required: true,
            align: 'left'
          },
          {
            name: "thisTourist",
            label: "实时游客数",
            field: "thisTourist",
            required: true,
            align: 'left'
          },
          {
            name: "dayTourist",
            label: "当日总游客数",
            field: "dayTourist",
            required: true,
            align: 'center'
          },
          {
            name: "startTime",
            label: "开始生效时间",
            field: "startTime",
            required: true,
            align: 'center'
          },
          {
            name: "endTime",
            label: "结束时间",
            field: "endTime",
            sortable: true,
            required: true,
            align: 'center'
          },
          {
            name: "updateTiem",
            label: "最后修改时间",
            field: "updateTiem",
            required: true,
            align: 'center'
          },
          {
            name: "id",
            label: "操作",
            field: "id",
            required: true,
            align: 'center'
          },

        ]
      };
    },
    filters: {
      dateFormater(d) {
        if (d) {
          return date.formatDate(d, 'YYYY-MM-DD HH:mm:ss')
        } else {
          return ''
        }

      }
    },
    components: {
      datepicker
    },
    computed: {

    },
    mounted() {
      this.getBaseData();
    },
    methods: {
      Modify(row) {
        if (!row.isModify) {
          //打开修改
          row.isModify = true
        } else {
          //保存
          row.saving = true
          this.$axios({
            url: '/freeRate/updateFree',
            method: 'POST',
            dataType: 'json',
            data: {
              // ...row
              id: row.id,
              scenicName: row.scenicName,
              dayTourist: row.dayTourist,
              thisTourist: row.thisTourist,
              dayBear: row.dayBear,
              thisBear: row.thisBear,
              startTime: date.formatDate(row.startTime, 'YYYY-MM-DD HH:mm:ss'),
              endTime: date.formatDate(row.endTime, 'YYYY-MM-DD HH:mm:ss')
            }
          }).then(r => {
            row.isModify = false
            row.saving = false
            this.$q.notify({
              message: '保存成功！',
              type: 'positive'
            })
            this.getBaseData()
          }).catch(e => {            
            this.$q.notify({
              message: e.msg,
              type: 'negative'
            })
            row.saving = false
            row.isModify = true
          })

        }
      },
      getBaseData() {
        this.loading = true
        this.$axios({
          url: '/freeRate/loadFreeRateList',
          method: 'GET',
        }).then(r => {
          this.serverData = r.desc.map(m => {
            for (const k in m) {
              if (m[k] == null) {
                m[k] = ''
              }
            }
            m.isModify = false
            m.saving = false
            return m
          })
          this.loading = false
        }).catch(e => {
          this.loading = false
        })
      }
    }
  };

</script>

<style>
  #ex_tb .q-tabs-head {
    background: transparent !important
  }

  #ex_table .q-table-middle {
    max-height: 63vh !important
  }

  .tb-title {
    font-size: 2.8vh;
    letter-spacing: 2px;
    padding: 1vh 0;

  }

  .scenicName {
    font-size: 2.2vh !important;
    font-weight: lighter !important;

  }
 

</style>
