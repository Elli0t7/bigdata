<template>
  <q-layout id='layout' class="bg-layout" view="hHh lpR lFr">
    <q-header  class="bg-layout-header">
      <div class="row">
        <div class="col-4 q-py-md text-deactive">
          <q-tabs v-model='navName' active-color="acttab" narrow-indicator align='justify' indicator-color dense class="fit nav_tabs ">
            <q-tab :name='item.label' class="nav_tab" @click="platformSelected(index)" :key=index v-for='(item,index) in platforms' :label=item.label />
          </q-tabs>
        </div>
        <div class="col-4">
          <div class="sys-tit">
            高淳全域旅游大数据平台
          </div>
        </div>
        <div class="col-4 ">
          <div class="row justify-end">
            <div class="col-auto">
               <!-- @mouseout="showForecast=false"    -->
              <div class="sys-sta q-pt-sm" @mouseenter='showForecast=true' @mouseout="showForecast=false">            
                <iframe    scrolling="no" src="https://tianqiapi.com/api.php?style=tg&skin=sogou&fontsize=12&color=05cdff&&city=高淳" frameborder="0" width="440" height="60" allowtransparency="true"></iframe>
                <q-menu style="background:#0064a9" v-model="showForecast">
                  <iframe scrolling="no" src="https://tianqiapi.com/api.php?style=tw&skin=cucumber&color=2ecdf3&city=高淳" frameborder="0" width="300" height="500" allowtransparency="true"></iframe>
                </q-menu>
              </div>
            </div>
            <div class="col-auto">
              <div class="sys-clo">
                <clock/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" mini-to-overlay show-if-above :mini="miniState" side="left" @mouseover="miniState = false" @mouseout="miniState = true" id="left-drawer" content-class="left-bg">
      <LeftMenu v-if='ck' :menus="selectedPlatform.gchColumns||platforms[0].gchColumns" />
      <div class="absolute-bottom">
        <q-item clickable v-ripple @click="logout">
          <q-item-section avatar>
            <q-icon name='power_settings_new' class="text-red"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-red">退出系统</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-drawer>

    <q-page-container id='page-container'>
      <router-view />
      <multi-preview-ctrl v-if='!isHide' ></multi-preview-ctrl>
    </q-page-container>
    
  </q-layout>
</template>

<script>
import MultiPreviewCtrl from "../components/MultiPreviewCtrl";
import LeftMenu from "../components/leftMenu";
import Clock from "../components/clock";
import AMap from "AMap";
import { mapState } from "vuex";
import { date } from "quasar";
export default {
  name: "MyLayout",
  data() {
    return {
      showForecast:false,
      navName: "",
      selectServer: {},
      showRight: true,
      leftDrawerOpen: true,
      selectIndex: 0,
      weather: {},
      forecast: [],
      miniState: true,
      ck: true
    };
  },
  components: {
    LeftMenu,
    Clock,
    MultiPreviewCtrl
  },
  computed: {
    isHide() {
      return this.$route.meta.isHideMonitor;
    },
    selectedPlatform() {
      return this.$store.state.platform;
    },
    //景区平台
    platforms() {
      let plats = JSON.parse(this.$q.sessionStorage.getItem("platforms"));
      let p = plats.filter(x => {
        return x.id != "10000";
      });
      if (p.length > 0) {
        setTimeout(() => {          
          this.selectServer = {
            layoutType: 2,
            ...p[0].hkConfigs[0]
          };
          this.$store.commit('setSelectServer',this.selectServer)
        }, 7000);
      }
      return plats;
    }
  },
  methods: {   
    //选中平台改变事件
    platformSelected(index) {
      this.ck = true;
      this.selectIndex = index;
      this.$store.commit("setPlatform", this.platforms[index]);
      this.navName = this.platforms[index].label;      
      this.$router.push({
        name: this.platforms[index].gchColumns[0].subLabel
      });
      this.leftDrawerOpen=true
    },
    logout() {
      this.$q
        .dialog({
          title: "退出",
          message: "确定退出系统？",
          // 可选的
          color: "red",
          ok: true,
          cancel: true
        })
        .onOk(() => {
          // 选择"OK"
          this.$q.sessionStorage.set("token", "");
          this.$router.push({
            path: "/"
          });
        })
        .onCancel(() => {
          // 选择"Cancel"或作了关闭操作
        });
    },
    
  },
  created() {
    this.platformSelected(0);
  },
  mounted() {
    // document.addEventListener("MSFullscreenChange", event => {
    //   if (
    //     document.msFullscreenElement != null &&
    //     document.msFullscreenElement.nodeName == "VIDEO"
    //   ) {
    //     this.isFullScreen = true;
    //   } else {
    //     this.isFullScreen = false;
    //   }
    //   console.log(this.isFullScreen);
    // });
    setTimeout(() => {
      this.leftDrawerOpen = true;
    }, 2000);
  }
};
</script>

<style lang="stylus" >
#page-container{
  padding-top 0!important;
}
.text-off {
  color: #07354d;
}

.text-deactive {
  color: rgb(2,100,125);
  opacity 1!important;
}

.text-acttab {
  color: #05cdff;
}

.bg-layout {
   background:#09152a url('../statics/images/bigBg.png') no-repeat 50% 50% / cover;
   //background: url('../statics/images/position.png') no-repeat 50% 50% / 100% 100%;
}

.bg-layout-header {
  height: 10vh;
  background: transparent url('../statics/images/TopBG.png') no-repeat 50% 0% / contain;
  // background: rgb(7,18,46) url('../statics/images/TopBG.png') no-repeat 50% 0% / contain;
}

.sys-tit {
  color: #a6eaff;
  text-align: center;
  line-height: 8vh;
  font-size: 2.85vh;
  font-family: ms;
  letter-spacing: 4px;
}

.nav_tab {
  padding: 0 4px;

  .q-tab__label {
    font-size: 1.66vh;
    font-family: msbd;
    font-weight: bolder;
  }

  .q-tab__content {
    min-width: 80px !important;
  }
}
</style>
