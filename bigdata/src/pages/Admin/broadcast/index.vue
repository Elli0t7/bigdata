<template>
  <q-page class="admin-padding admin-bg">
    <div class="fit relative-position">
      <transition mode="out-in" enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutLeft">
        <div v-show="level==1" class="absolute fit">
          <q-table class='admin-table' :data="tableData" :columns="columns" :filter="filter" :loading="loading" title="广播节点管理"
            :pagination.sync="pagination" row-key="name" color="white" dark>
            <template slot="top-right" slot-scope="props">
              <q-btn icon='add' color="secondary" label="新增广播服务器节点" class="q-mr-lg" @click="addRow" />
              <div class="col" />
              <q-search dark v-model="filter" color='cyan-12' clearable />
            </template>
            <template slot="body" slot-scope="props">
              <q-tr :props="props">
                <q-td key="broadcastName" :props="props">
                  <q-field icon='cloud_queue' :error="$v.currentRow.broadcastName.$error&&currentRow.id==props.row.id"
                    error-label="请输入广播节点名称" icon-color='cyan-12'>
                    <q-input type='text' color='cyan-12' align='left' :hide-underline='!props.row.isModify' :readonly='!props.row.isModify'
                      dark v-model="props.row.broadcastName" />
                  </q-field>
                </q-td>
                <q-td key="scenicId" :props="props">
                  <q-field icon='domain' :error="$v.currentRow.scenicId.$error&&currentRow.id==props.row.id"
                    error-label="请选择所属景区" icon-color='cyan-12'>
                    <q-select dark color='cyan-12' :hide-underline='!props.row.isModify' :readonly='!props.row.isModify'
                      v-model="props.row.scenicId" radio :options="scenicList" />
                  </q-field>
                </q-td>
                <q-td key="ip" :props="props">
                  <q-field :error="$v.currentRow.ip.$error&&currentRow.id==props.row.id" error-label="请输入正确的IP地址">
                    <q-input dark color='cyan-12' :hide-underline='!props.row.isModify' :readonly='!props.row.isModify'
                      v-model="props.row.ip" align='left' />
                  </q-field>
                </q-td>
                <q-td key="port" :props="props">
                  <q-field :error="$v.currentRow.port.$error&&currentRow.id==props.row.id" error-label="请输入正确的端口号">
                    <q-input dark color='cyan-12' :hide-underline='!props.row.isModify' :readonly='!props.row.isModify'
                      v-model="props.row.port" align='left' />
                  </q-field>
                </q-td>
                <q-td key="id" :props="props">
                  <q-btn size='md' dense color='amber' label='设备管理' :disabled='props.row.isNewRow' icon='rss_feed'
                    @click="getDevice(props.row)" class="q-mr-sm" />
                  <q-btn size="md" dense :loading='props.row.saving' :color="props.row.isModify?'blue':'green'" class="q-mr-sm"
                    @click="Modify(props.row)">
                    <q-icon :name="props.row.isModify?'save':'edit'" />{{props.row.isModify?'保存节点':'编辑节点'}}
                    <span slot="loading">
                      <q-spinner-mat class="on-left" />
                      保存节点
                    </span>
                  </q-btn>
                  <q-btn size='md' dense color='red' label='删除节点' icon='delete' @click="deleteRow(props.row)" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </transition>
      <transition mode="out-in" enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
        <div v-show="level==2" class="absolute fit">
          <!--设备列表begin-->
          <q-table key="tb2" class='bg-indigo' :data="currentRow.children" :columns="diviceColumns" :filter="diviceFilter"
            :loading="diviceLoading" :pagination.sync="pagination" row-key="name" title="广播设备管理" color="white" dark>
            <template slot="top-right" slot-scope="deviceProps">
              <q-btn icon='arrow_back' color="secondary" label="返回上一层" class="q-mr-lg" @click="level=1" />
              <div class="col" />
              <q-search dark v-model="filter" color='cyan-12' clearable />
            </template>
            <template slot="body" slot-scope="deviceProps">
              <q-tr :props="deviceProps">
                <q-td key="code" :props="deviceProps">
                  <span> {{deviceProps.row.code}}</span>
                </q-td>
                <q-td key="areaName" :props="deviceProps">
                  <span> {{ deviceProps.row.areaName }}</span>
                </q-td>
                <q-td key="status" :props="deviceProps">
                  <span> {{ deviceProps.row.status }}</span>
                </q-td>
                <q-td key="lon" :props="deviceProps" :error="currentDevice&&$v.currentDevice.lon.$error&&currentDevice.code==deviceProps.row.code"
                  error-label="请输入正确的经度">
                  <q-field class="qf" v-if='deviceProps.row.isModify'>
                    <q-input dark color='cyan-12' v-model="deviceProps.row.lon" align='left' />
                  </q-field>
                  <span v-else> {{ deviceProps.row.lon }}</span>
                </q-td>
                <q-td key="lat" :props="deviceProps" :error="currentDevice&&$v.currentDevice.lat.$error&&currentDevice.code==deviceProps.row.code"
                  error-label="请输入正确的纬度">
                  <q-field class="qf" v-if='deviceProps.row.isModify'>
                    <q-input dark color='cyan-12' v-model="deviceProps.row.lat" align='left' />
                  </q-field>
                  <span v-else> {{ deviceProps.row.lat }}</span>
                </q-td>
                <q-td key="id" style="width:auto" :props="deviceProps">
                  <q-btn size="md" dense :loading='deviceProps.row.saving' :color="deviceProps.row.isModify?'blue':'green'"
                    class="q-mr-sm" @click="syncDevice(deviceProps.row)">
                    <q-icon :name="deviceProps.row.isModify?'save':'edit'" />{{deviceProps.row.isModify?'保存':'编辑'}}
                    <span slot="loading">
                      <q-spinner-mat class="on-left" />
                      保存
                    </span>
                  </q-btn>
                  <q-btn size='md' dense color='red' label='删除' icon='delete' @click="deleteDevice(deviceProps.row)" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <!--设备列表end-->
        </div>
      </transition>
    </div>

    <object width="0" height="0" id="wkipobj" name="wkip" classid="clsid:106DC585-E8EB-4DEB-82CD-1A3FD61B11D2">
    </object>
  </q-page>
</template>
<script>
  import {
    required,
    numeric,
    ipAddress
  } from 'vuelidate/lib/validators'
  import {
    uid
  } from 'quasar'
  export default {
    name: 'broadcastIndex',
    data() {
      return {
        level: 1,
        serverState: -1,
        currentRow: {},
        currentDevice: {},
        scenicList: [],
        tableData: [],
        diviceLoading: false,
        diviceFilter: '',
        diviceColumns: [{
            name: 'code',
            align: 'left',
            label: '设备ID',
            field: 'code',
            sortable: true
          }, {
            name: 'areaName',
            required: true,
            label: '区域名称',
            align: 'left',
            field: 'areaName',
            sortable: true
          },
          {
            name: 'status',
            align: 'left',
            label: '状态',
            field: 'status',
            required: true,
          },
          {
            name: 'lon',
            align: 'left',
            label: '经度',
            field: 'lon'
          },
          {
            name: 'lat',
            align: 'center',
            label: '纬度',
            field: 'lat'
          },
          {
            name: 'id',
            align: 'right',
            label: '操作',
            field: 'id'
          },
        ],
        columns: [{
            name: 'broadcastName',
            required: true,
            label: '广播节点名称',
            align: 'left',
            field: 'broadcastName',
            sortable: true
          },
          {
            name: 'scenicId',
            align: 'left',
            label: '所属景区',
            field: 'scenicId',
            required: true,
          },
          {
            name: 'ip',
            align: 'left',
            label: '服务器IP',
            field: 'ip',
            sortable: true
          },
          {
            name: 'port',
            align: 'left',
            label: '服务器端口',
            field: 'port'
          },
          {
            name: 'id',
            align: 'center',
            label: '操作',
            field: 'id'
          },
        ],
        filter: '',
        visibleColumns: ['broadcastName', 'scenicId', 'ip', 'port', 'id'],
        loading: false,
        pagination: {
          sortBy: null, // 字符串，列“name”属性值
          descending: false,
          page: 1,
          rowsPerPage: 12 // 当前每页显示的行数
        }
      }
    },
    validations: {
      currentRow: {
        broadcastName: {
          required,
        },
        scenicId: {
          required,
        },
        ip: {
          required,
          ipAddress
        },
        port: {
          required,
          numeric
        }
      },
      currentDevice: {
        lon: {
          required
        },
        lat: {
          required
        }
      }
    },
    watch: {

    },
    computed: {

    },
    methods: {
      //获取服务节点列表
      getServer() {
        this.loading = true;
        this.$axios({
          url: '/broadcast/loadBroadcastConfigList',
          method: 'get',
          params: {
            scenicId: ''
          }
        }).then(r => {
          this.loading = false
          this.tableData = r.desc.map(m => {
            m.isModify = false
            m.saving = false
            m.expand = false
            m.isNewRow = false
            m.children = []
            return m
          });
        }).catch(e => {
          this.loading = false
        })
      },
      //删除设备
      deleteDevice(row) {
        this.diviceLoading = true
        this.$q.dialog({
          title: '删除',
          message: `确定要删除节点-${row.areaName}?`,
          color: 'red',
          ok: true,
          cancel: true,
        }).then(() => {          
          if (!row.isNewRow) {
            this.$axios({
              url: '/broadcast/delectBroadcast',
              method: 'POST',
              data: {
                id: row.id
              }
            }).then(s => {
              this.getDevice(this.currentRow)
               this.diviceLoading = false
               row.isNewRow=true
              this.$q.notify({
                message: '操作成功！',
                type: 'positive'
              })
            }).catch(e => {
              this.diviceLoading = false
              this.$q.notify({
                message: '操作失败！',
                type: 'negative'
              })
            })
          } else {
            let children = this.currentRow.children
            for (let i = 0; i < children.length; i++) {
              if (children[i].id == row.id) {
                children.splice(i, 1)
                this.$q.notify({
                  message: '操作成功！',
                  type: 'positive'
                })
                return
              }

            }

          }
        }).catch()


      },
      //拉取广播服务器设备列表
      getDevice(row) {
        this.currentRow = row
        this.level = 2
        this.loading = true
        let boardArray = [];
        if (!(!!window.ActiveXObject || "ActiveXObject" in window) || document.all.wkipobj.object == null) {
          this.$q.notify({
            message: "加载ocx失败,请使用IE11浏览器。",
            type: 'negative'
          });
          this.loading = false
          return
        }
        try {
          this.serverState = wkipobj.InitIPAS(0, `${row.ip}:${row.port}`);
        } catch (e) {
          this.serverState = -1
          this.$q.notify({
            message: e.message,
            type: 'negative'
          })
          this.loading = false
          return;
        }
        if (this.serverState != 0) {
          this.$q.notify({
            message: "连接广播服务器失败！",
            type: 'negative'
          });
          this.loading = false
        } else if (this.serverState == 0) {
          //成功连接->读取区域信息
          var area_info = wkipobj.GetAreaInfo();
          if (area_info == null) {
            this.$q.notify({
              message: "读取广播信息失败！",
              type: 'negative'
            });

          } else {
            var arrayBSTR = area_info.toArray();
            var area_cnt = arrayBSTR.length;
            var _broadcastId = row.id
            var _id = uid()
            var arrayForeach = function (list) {
              boardArray = []
              arrayBSTR.forEach(spk => {
                let spk_info_array = spk.toArray()
                let _lon = '',
                  _lat = '',
                  _isNewRow = true
                if (list) {
                  let samerow = list.filter(f => {
                    return parseInt(f.code) == spk_info_array[0]
                  })
                  if (samerow.length > 0) {
                    _lon = samerow[0].lon
                    _lat = samerow[0].lat
                    _isNewRow = false
                    _id = samerow[0].id
                  }
                }
                let spkObj = {
                  id: _id,
                  broadcastId: _broadcastId,
                  code: spk_info_array[0],                  
                  areaName: spk_info_array[1],
                  volume: spk_info_array[2],
                  status: spk_info_array[3],
                  fileName: spk_info_array[4],
                  saving: false,
                  isModify: false,
                  isNewRow: _isNewRow,
                  lon: _lon,
                  lat: _lat,
                }
                boardArray.push(spkObj)
              });
            }


            if (area_cnt > 0) {

              let _this = this;

              this.$axios({
                url: '/broadcast/loadBroadcastList',
                params: {
                  broadcastId: row.id
                }
              }).then(s => {

                if (s.desc.length > 0) {
                  let list = s.desc;
                  arrayForeach(list)
                  row.children = boardArray;
                } else {
                  arrayForeach()
                  row.children = boardArray;
                }
              }).catch(f => {
                arrayForeach()
                row.children = boardArray;
              })

            }
          }
          console.log(this.tableData)
          this.loading = false
        }

      },
      //景区列表
      loadScenicList() {
        this.$axios({
          url: 'scenic/loadScenicList',
          method: 'GET'
        }).then(r => {
          this.scenicList = r.desc.map(m => {
            m.value = m.id
            return m
          }).filter(f => {
            return f.id != '10000'
          });

        }).catch(e => {})
      },
      syncDevice(row) {
        row.isModify = !row.isModify
        debugger
        if (!row.isModify) {
          this.diviceLoading = true
          row.saving = true
          this.$axios({
            url: row.isNewRow ? '/broadcast/addBroadcast' : '/broadcast/updateBroadcast',
            method: 'POST',
            data: {
              areaType:row.areaType,              
              id: row.id,
              broadcastId: row.broadcastId,
              code: row.code,
              lat: row.lat,
              lon: row.lon
            }
          }).then(s => {
            this.diviceLoading = false
            row.saving = false
            row.isNewRow = false
            this.$q.notify({
              message: '操作成功！',
              type: 'positive'
            })
          }).catch(e => {
            this.diviceLoading = false
            row.saving = false
            this.$q.notify({
              message: '操作失败！',
              type: 'negative'
            })
          })
        }
      },
      //修改、保存服务器节点
      Modify(row) {
        if (!row.isModify) {
          //打开修改
          row.isModify = true
          this.currentRow = row
        } else {
          //保存 
          this.currentRow = row
          this.$v.$touch()
          if (!this.$v.currentRow.$invalid) {
            row.saving = true
            this.$axios({
              url: row.isNewRow ? '/broadcast/addBroadcastConfig' : '/broadcast/updateBroadcastConfig',
              method: 'POST',
              dataType: 'json',
              data: row.isNewRow ? {
                ind: 0,
                scenicId: row.scenicId,
                ip: row.ip,
                port: row.port,
                broadcastName: row.broadcastName
              } : {
                broadcastId: row.id,
                ind: 0,
                id: row.id,
                scenicId: row.scenicId,
                ip: row.ip,
                port: row.port,
                broadcastName: row.broadcastName
              }
            }).then(r => {
              row.isModify = false
              row.saving = false
              row.isNewRow = false
              this.$q.notify({
                message: '保存成功！',
                type: 'positive'
              })
              // this.getBaseData()
            }).catch(e => {
              this.$q.notify({
                message: e.msg,
                type: 'negative'
              })
              row.saving = false
              row.isModify = true
            })
          }
        }
      },
      addRow() {
        let row = {
          id: uid(),
          broadcastName: `广播服务器-${this.tableData.length}`,
          scenicId: '',
          ip: '222.190.138.228',
          port: 65003,
          isModify: true,
          saving: false,
          expand: false,
          children: [],
          isNewRow: true,
        }
        this.tableData.unshift(row)
      },
      deleteRow(row) {
        this.$q.dialog({
          title: '删除',
          message: `确定要删除节点-${row.broadcastName}?`,
          color: 'red',
          ok: true,
          cancel: true,
        }).then(() => {
          this.loading = true
          if (row.isNewRow) {
            for (let index = 0; index < this.tableData.length; index++) {
              if (this.tableData[index].id == row.id) {
                this.tableData.splice(index, 1);
                this.$q.notify({
                  message: '操作成功!',
                  type: 'positive'
                })
                this.loading = false;
                return
              }
            }

          } else {
            this.$axios({
              method: 'post',
              url: '/broadcast/delectBroadcastConfig',
              data: {
                id: row.id
              }
            }).then(r => {
              for (let index = 0; index < this.tableData.length; index++) {
                if (this.tableData[index].id == row.id) {
                  this.tableData.splice(index, 1);
                  this.$q.notify({
                    message: '操作成功!',
                    type: 'positive'
                  })
                  this.loading = false;
                  return
                }
              }

            }).catch(e => {
              this.loading = false
              this.$q.notify({
                message: e.msg,
                type: 'negative'
              })
            })
          }

        }).catch()
      },
      refresh() {
        this.loading = true
        this.$axios({

        }).then(r => {
          this.tableData = r.desc
          this.loading = false
        }).catch(e => {
          this.loading = false
          this.$q.notify({
            message: e.msg,
            type: 'negative'
          })
        })
      }
    },
    mounted() {
      this.loadScenicList();
      this.getServer();

    },
    created() {


    }
  }

</script>

<style>

</style>
