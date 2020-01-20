<template>
  <div class="monitor-box">
    <div class="column fit">
      <div id="ocxContainer" :class="['col-auto overflow-hidden',windowSize]">
        <iframe ref='iframe' id='iframe' frameborder='0' height="100%" width="100%" scrolling='no' :src='src'></iframe>
      </div>
      <div>
        <div class="row justify-end items-end">
          <div class="col-auto">
            <q-btn label="视频监控" dense flat icon='videocam' text-color='cyan-12'>
              <q-menu @show='beforeShow'>
                <iframe id='mon' class="fit absolute" src="" frameborder="0"></iframe>
                <q-list separator dark no-border>
                  <template v-for="(item,index) in platforms">
                    <q-item v-if="item.hkConfigs.length==1" clickable @click='changeServer(item.hkConfigs[0])' v-close-popup :key="index" link>
                      <q-item-section avatar>
                        <q-icon name="cloud_circle"></q-icon>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{item.label}}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-expansion-item :key="index" v-else-if="item.hkConfigs.length>1" icon="cloud_circle" :label="item.label" default-opened>
                      <q-item :inset-level="1" v-close-popup clickable v-for="(itm,idx) in item.hkConfigs" :key="idx" @click='changeServer(itm)' link>
                        <q-item-section avatar>
                          <q-icon name="room"></q-icon>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{itm.scenicName}}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-expansion-item>
                  </template>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
          <div class="col-auto">
            <q-btn dense flat text-color='cyan-12' icon="minimize" @click="windowState='min'"  />
            <q-btn dense flat text-color='cyan-12' icon="crop_square" @click="windowState='max'"  />
            <q-btn dense flat text-color='cyan-12' icon="close" @click="windowState='close'"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "MultiPreviewCtrl",
  data () {
    return {
      src: "",
      windowState:'min'
    };
  },
  watch: {
    selectServer: function (newVal, oldVal) {
      this.valueChange(newVal)
    },
  },
  computed: {
    windowSize(){
      switch (this.windowState) {
        case 'max':
          return 'monitor-max'
          break;
        case 'min':
          return 'monitor-min'
          break;
        case 'close':
          return 'monitor-close'
          break;  
        default:
          return 'min'
          break;
      }
    },
    selectServer () {
      return this.$store.state.selectServer
    },
    iframe () {
      return this.$refs.iframe;
    },
    selectedPlatform () {
      return this.$store.state.platform;
    },
    //景区平台
    platforms () {
      let p = JSON.parse(this.$q.sessionStorage.getItem("platforms")).filter(
        x => {
          return x.id != "10000";
        }
      );
      return p;
    }
  },
  methods: {
    valueChange (value) {
      if (Object.keys(value).length != 0) {
        this.src =
          value.prefix != "/laojie"
            ? `statics/multiPreview.html?ip=${value.ip}&port=${
            value.port
            }&code=${value.indexCode}&userName=${
            value.userName
            }&passWord=${value.password}&layoutType=${value.layoutType || 1}`
            : `statics/webvideo.html?ip=${value.ip}&port=${value.port}&code=${
            value.indexCode
            }&userName=${value.userName}&passWord=${
            value.password
            }&layoutType=${value.layoutType || 1}`;

        //  this.src = this.selectServer.prefix != "/laojie" ?
        //     `statics/multiPreview.html?ip=${this.selectServer.ip}&port=${this.selectServer.port}&code=${this.selectServer.indexCode}&userName=${this.selectServer.userName}&passWord=${this.selectServer.password}&layoutType=${this.selectServer.layoutType||1}` :
        //     `statics/demo-easy.html`

        this.iframe.src = this.src;
      }
    },
    beforeShow () {
      document.getElementById("mon").parentNode.classList.add("server-menu");
    },
    changeServer (e) {
      this.$store.commit('setSelectServer',{
        layoutType: 2,
        ...e
      })
      // this.selectServer = {
      //   layoutType: 2,
      //   ...e
      // };
    }
  },
  mounted () { }
};
</script>

<style lang='stylus'>
#ocxContainer {
  // flex: 1;
}

.server-menu {
  background: $lin;
}

.monitor-box {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  right: 5vh;
  bottom: 10px;
  // border: 2px solid transparent;
  // border-image: $lin 20 20;
  transition: 1.5s width, height linear;
}

.monitor-close{
  height 0!important;
}


.monitor-min {
  height: 20vh !important;
  width: 25vh !important;
}

.monitor-max {
  height: 88vh !important;
  width: 80vh !important;
}
</style>
