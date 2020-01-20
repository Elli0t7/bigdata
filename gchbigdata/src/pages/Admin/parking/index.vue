<template>
  <q-page padding class="row justify-center">
   
  <q-table class="fit"
    ref="table"
    title='停车场管理'
    :data="serverData"
    :columns="columns"
    :filter="filter"
    row-key="name"
    selection='multiple'
    :selected.sync="selectedSecond"
    :pagination.sync="serverPagination"
    :loading="loading"
    :visible-columns="visibleColumns"
    :separator="separator"
    @request="request"
  >   
   <q-tr slot="body" slot-scope="props" :props="props">
         <q-td auto-width>
            <q-checkbox color="primary" v-model="props.selected" />
          </q-td>
        <q-td key="id"  auto-width :props="props">
          <div class="row items-center justify-between no-wrap">
            <q-btn size="sm" round dense color="secondary" icon="fas fa-eye" @click="props.row.id--" class="q-mr-sm" ><q-tooltip>预览</q-tooltip></q-btn>
            <q-btn size="sm" round dense color="tertiary" icon="fas fa-edit" @click="props.row.id++" class="q-mr-sm" ><q-tooltip>编辑</q-tooltip></q-btn>
            <q-btn size="sm" round dense color="red" icon="fas fa-trash-alt" @click="props.row.id++" class="q-mr-sm" ><q-tooltip>删除</q-tooltip></q-btn>          
          </div>
        </q-td>      
         <q-td key="id" :props="props">{{ props.row.id }}</q-td>
        <q-td key="name" :props="props">{{ props.row.name }}</q-td> 
      </q-tr>
     <!-- <template slot="top-selection" slot-scope="props">
        
      </template> -->
      <template slot="top-left" slot-scope="props">
      <q-search       
        color="secondary"
        v-model="filter"
        class="col-6"
      />
      <q-btn color="secondary" flat label="新增停车场" icon='add' @click="layoutModal=true" class="q-mr-sm" ><q-tooltip>新增停车场数据</q-tooltip></q-btn>       
         <q-btn color="secondary" icon='delete' :disable='selectedSecond.length<=0' flat label="删除" @click="deleteRow"  >  <q-tooltip>删除选中行</q-tooltip></q-btn>      
    </template>
    <template slot="top-right" slot-scope="props">
      <q-tooltip>表格样式设置</q-tooltip>
      <q-table-columns
        color="secondary"
        class="q-mr-sm"
        v-model="visibleColumns"
        :columns="columns"
      />
      <!-- <q-tooltip>删除选中行</q-tooltip> -->
      <q-select
        color="secondary"
        v-model="separator"
        :options="[
          { label: '水平', value: 'horizontal' },
          { label: '垂直', value: 'vertical' },
          { label: '单元格', value: 'cell' },
          { label: '无', value: 'none' }
        ]"
        hide-underline
      >
     
      </q-select>
      <q-btn
        flat round dense
        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
        @click="props.toggleFullscreen"
      >
      <q-tooltip>{{props.inFullscreen==true ? '退出全屏':'全屏'}}</q-tooltip>
      </q-btn>
       </template>
       
  </q-table>  
  <!-- 新增数据模态框begin -->
    <q-modal v-model="layoutModal" :content-css="{minWidth: '60vw', minHeight: '70vh'}">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-btn
            flat
            round
            dense
            @click="layoutModal = false"
            icon="reply"
          />
          <q-toolbar-title>
            新增停车场
          </q-toolbar-title>
        </q-toolbar>

        <!-- <q-toolbar slot="header">
          <q-search class="full-width" inverted v-model="search" color="none" />
        </q-toolbar> -->

        <q-toolbar slot="footer">
          <q-toolbar-title>
            Footer
          </q-toolbar-title>
        </q-toolbar>

        <div class="layout-padding">
          <q-btn color="primary" @click="layoutModal = false" label="Close" />
          <!-- <p class="caption" v-for="n in 15" :key="`c-${n}`">This is a Modal presenting a Layout.</p> -->
        </div>
      </q-modal-layout>
    </q-modal>
<!-- 新增数据模态框end -->
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data() {
    return {
      layoutModal:false,
      list: [],
      total: 10,
      filter: "",
      loading: false,
      pageIndex: 1,
      serverPagination: {
        page: 1,
        rowsNumber: 10 // 指定这个属性就确定了分页是服务器端的
      },
      selectedSecond: [],
      visibleColumns: ["id", "name"],
      separator: "horizontal",
      serverData: [],
      columns: [
        {
          name: "desc",
          required: true,
          label: "操作",
          align: "left",
          field: "id"
        },
        { name: "id", label: "ID", field: "id", sortable: true },
        { name: "name", label: "停车场", field: "name", sortable: true },
        { name: "carbs", label: "Carbs (g)", field: "carbs" },
        { name: "protein", label: "Protein (g)", field: "protein" },
        { name: "sodium", label: "Sodium (mg)", field: "sodium" },
        {
          name: "calcium",
          label: "Calcium (%)",
          field: "calcium",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        },
        {
          name: "iron",
          label: "Iron (%)",
          field: "iron",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        }
      ]
    };
  },
  mounted() {
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    });
  },
  methods: {
    deleteRow() {
      this.$q
        .dialog({
          title: "删除数据",
          message: "确认要删除选中的数据？",
          ok: "确认",
          cancel: "取消"
        })
        .then(() => {
          this.$q.notify({
            color: "positive",
            icon: "fas fa-check-square",
            message: "已成功删除"
          });
        })
        .catch(() => {
          this.$q.notify({
            color: "info",
            icon: "fas fa-exclamation",
            message: "已取消"
          });
        });
    },
    request({ pagination, filter }) {
      // 我们将QTable设置为“加载”状态
      this.loading = true;
      this.$axios({
        method: "post",
        url: "/getParkingList",
        data: {
          pageIndex: this.serverPagination.page
        }
      })
        .then(data => {
          console.log(data);
          this.serverPagination = pagination;
          this.serverPagination.rowsNumber = data.data.total;
          // 然后我们更新提取的行
          this.serverData = data.data.list;

          // 最后我们告诉QTable退出“加载”状态
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    }
  }
};
</script>

<style>
</style>
