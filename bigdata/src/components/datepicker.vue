<template>
  <div class="row justify-center items-center fit">
    <div class="col-4 q-pr-md">
      <div class="fit text-tt">
        <q-tabs dark v-model='selectedType' class="type-pick ">
          <template v-if="typelist!=undefined&&typelist.length>0">
            <q-tab v-for="(item,index) in typelist" :key='index' slot="title" :label="item.label" :name='item.name' />
          </template>
          <template v-else>
            <q-tab label="今日" name='day' />
            <q-tab label="本周" name='week' />
            <q-tab label="本月" name='month' />
            <q-tab label="全年" name='year' />
          </template>
        </q-tabs>
      </div>
    </div>
    <div class="col-2">
      <q-input dark outlined color='tt' dense v-model="params.start" mask="date" @focus="()=>$refs.qDateProxy.show()" >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="params.start" @input="() => $refs.qDateProxy.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
          <!-- <template v-slot:prepend>
           <div  style="font-size:1rem" >开始</div>
          </template> -->
        </q-input>       
       
    </div>
    <div class="col-auto text-tt q-px-md">—</div>
    <div class="col-2">
      <q-input dark color='tt' outlined dense v-model="params.end" mask="date" @focus="()=>$refs.qDateProxy1.show()" >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                <q-date v-model="params.end" @input="() => $refs.qDateProxy1.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
           <!-- <template v-slot:prepend>
           <div  style="font-size:1rem" >结束</div>
          </template> -->
        </q-input>
    </div>
    <div class="col-auto q-px-md">
      <q-btn label='查询' :disabled='!(params.start&&params.end)' color="secondary"  @click="btnQuery('custom')" icon='search'></q-btn>
    </div>
  </div>

</template>

<script>
import { date } from 'quasar'
export default {
  // name: 'ComponentName',
  data () {
    return {
      today: date.formatDate(new Date(), 'YYYY-MM-DD'),
      min: date.formatDate(new Date(2018, 1, 1), 'YYYY-MM-DD'),
      selectedType: '',
      params: {
        type: '',
        start: "",
        end: ""
      }
    };
  },
  props: ['typelist'],
  methods: {
    btnQuery (type) {
      this.params.type = type
      if (type == 'custom') {
        this.params.start = date.formatDate(this.params.start, 'YYYY-MM-DD')
        this.params.end = date.formatDate(this.params.end, 'YYYY-MM-DD')
      }
      this.$emit('query', this.params)
    },
  },
  watch: {
    selectedType: function () {
      let d = new Date();
      switch (this.selectedType) {
        case 'day':
          this.params.start = this.params.end = date.formatDate(d, 'YYYY-MM-DD')

          this.btnQuery('day')
          break;
        case 'week':
          this.params.start = date.formatDate(date.subtractFromDate(d, { days: d.getDay() - 1 }), 'YYYY-MM-DD')
          this.params.end = date.formatDate(date.addToDate(d, { days: 7 - d.getDay() }), 'YYYY-MM-DD')
          this.btnQuery('week')
          break;
        case 'month':
          let nd = new Date(d.getFullYear(), d.getMonth() + 1, 0)
          this.params.start = date.formatDate(d.setDate(1), 'YYYY-MM-DD')
          this.params.end = date.formatDate(nd, 'YYYY-MM-DD')
          this.btnQuery('month')
          break;
        case 'year':
          this.params.start = date.formatDate(new Date(d.getFullYear(), 0, 1), 'YYYY-MM-DD')
          this.params.end = date.formatDate(d, 'YYYY-MM-DD')
          this.btnQuery('year')
          break;

        default:
          break;
      }

    }
  },
  mounted () {
    if (this.typelist && this.typelist.length > 0) {
      this.selectedType = this.typelist.filter(f => {
        return f.selected == true
      })[0].name
    } else {
      this.selectedType = 'day'
    }

  }

};

</script>

<style lang='stylus'>
.date-box {
  padding: 0.04rem;
  border: 1px solid white;
  color: white;
}

.type-pick {
  .q-tabs-head {
    // min-height inherit
  }
}

.q-datetime-weekdaystring {
  font-size: 0.08rem;
}

.q-datetime-datestring {
  font-size: 0.27rem;

  span.small {
    font-size: 0.12rem;
  }
}

.hide-btn {
  i {
    visibility: hidden;
    width: 0;
  }
}

.sp {
  position: absolute;
  left: 50%;
  top: 50%;
  height: 0.1rem;
  height: 0.1rem;
  margin-left: -0.05rem;
  margin-top: -0.06rem;
}
</style>
