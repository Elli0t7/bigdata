<template>
  <q-layout view="hHh Lpr lfr">
    <q-layout-header
      ref="layoutHeader"
      id="layoutHeader"
      :reveal="$q.platform.is.mobile"
      :class="[$q.platform.is.mobile?'':'no-shadow']"
      color="page"
    >
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="leftDrawerOpen = !leftDrawerOpen"/>
        <div class="row no-wrap fit">
          <div class="col-xs-12 col-xs-12 col-md-12 col-lg-6 col-xl-6">
            <div class="sys-main-nav">
              <div class="sys-title">高淳全域智慧旅游大数据平台</div>
              <q-tabs no-pane-border align="left" text-color="tabs_color">
                <q-tab
                  @select="platformSelected(index)"
                  :key="index"
                  v-for="(item,index) in platforms"
                  :default="platforms.length>1?item.default:true"
                  :label="item.label"
                  exact
                  slot="title"
                />
              </q-tabs>
            </div>
          </div>
          <div class="desktop-only col-xs-5 col-sm-5 col-md-5 col-lg-4 col-xl-4 text-right">
            <div class="weather_box" @click="showForecast">
              <iframe
                width="475"
                scrolling="no"
                height="80"
                frameborder="0"
                allowtransparency="true"
                src="http://i.tianqi.com/index.php?c=code&id=2&color=%2318ffff&bgc=%23&icon=5&py=gaochun&num=3&site=19"
              ></iframe>
            </div>
          </div>
          <div class="desktop-only col-auto text-center">
            <clock/>
          </div>
          <div style="padding-top:.26rem" class="desktop-only col-1 text-center">
            <q-btn @click="logout" icon="power_settings_new" color="red-9" flat label="退出"></q-btn>
          </div>
        </div>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :no-hide-on-route-change="true"
      overlay
      :mini="miniState"
      side="left"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      id="left-drawer"
      content-class="left-bg"
    >
      <LeftMenu v-if="ck" :menus="selectedPlatform.gchColumns||platforms[0].gchColumns"/>
    </q-layout-drawer>
    <q-page-container>
      <div class="row bg-primary overflow-hidden">
        <div :class="[isHide?'col-12':'col-9']">
          <router-view/>
        </div>
        <div v-if="!isHide" class="col-3 section-padding cust-col" style="padding-left:0">
          <div class="fit section-bg column">
            <div class="col-auto">
              <q-btn label="视频监控" size="1.8vh" flat icon="settings" text-color="cyan-12">
                <q-popover anchor="bottom left" self="top left" class="bg-primary">
                  <iframe class="fit absolute" src frameborder="0"></iframe>
                  <q-list separator dark no-border>
                    <template v-for="(item,index) in platforms.filter(x=>{return x.id!='10000'})">
                      <q-item
                        v-if="item.hkConfigs.length==1"
                        @click.native="changeServer(item.hkConfigs[0])"
                        :key="index"
                        link
                        v-close-overlay
                      >
                        <q-item-side icon="cloud_circle"/>
                        <q-item-main>
                          <q-item-tile label>{{item.label}}</q-item-tile>
                        </q-item-main>
                      </q-item>
                      <q-collapsible
                        :key="index"
                        v-else-if="item.hkConfigs.length>1"
                        icon="cloud_circle"
                        :label="item.label"
                      >
                        <q-item
                          v-for="(itm,idx) in item.hkConfigs"
                          :key="idx"
                          @click.native="changeServer(itm)"
                          v-close-overlay
                          link
                        >
                          <q-item-side icon="room"/>
                          <q-item-main :label="itm.scenicName"/>
                        </q-item>
                      </q-collapsible>
                    </template>
                  </q-list>
                </q-popover>
              </q-btn>
            </div>
            <div class="col">
              <div id="ocxContainer" class="fit overflow-hidden">
                <multi-preview-ctrl v-show="!isFullScreen" key="layoutpage" :config="selectServer"/>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      isFullScreen: false,
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
      let plats = JSON.parse(this.$q.sessionStorage.get.item("platforms"));
      let p = plats.filter(x => {
        return x.id != "10000";
      });
      if (p.length > 0) {
        setTimeout(() => {
          this.selectServer = {
            layoutType: 2,
            ...p[0].hkConfigs[0]
          };
        }, 7000);
      }
      return plats;
    }
  },
  methods: {
    changeServer(e) {
      this.selectServer = {
        layoutType: 2,
        ...e
      };
    },
    //选中平台改变事件
    platformSelected(index) {
      this.ck = true;
      this.selectIndex = index;
      this.$store.commit("setPlatform", this.platforms[index]);
      //this.leftDrawerOpen=true
      this.$router.push({
        name: this.platforms[index].gchColumns[0].subLabel
      });
    },
    logout() {
      this.$q
        .dialog({
          title: "退出",
          message: "确定退出系统？",
          // 可选的
          color: "red",
          ok: true,
          cancel: true,
          position: "top"
        })
        .then(() => {
          // 选择"OK"
          this.$q.sessionStorage.set("token", "");
          this.$router.push({
            path: "/"
          });
        })
        .catch(() => {
          // 选择"Cancel"或作了关闭操作
        });
    },

    showForecast() {}
  },
  created() {
    this.platformSelected(0);
  },
  mounted() {
    document.addEventListener("MSFullscreenChange", event => {
      if (
        document.msFullscreenElement != null &&
        document.msFullscreenElement.nodeName == "VIDEO"
      ) {
        this.isFullScreen = true;
      } else {
        this.isFullScreen = false;
      }
      console.log(this.isFullScreen);
    });
    setTimeout(() => {
      this.leftDrawerOpen = true;
    }, 2000);
  }
};
</script>
<style lang='stylus'>
@import '~variables';

.modal-header {
  font-size: 0.16rem;
}

.system-nav, .q-toolbar {
  height: auto !important;
}

.left-bg {
  background-color: $primary;
}

.right-bg {
  background-color: $primary;
}

#left-drawer {
  asides {
    overflow: inherit;

    .switch-drawer {
      position: absolute;
      top: 0;
      right: -0.33rem;
      width: 0.33rem;
      height: 100%;
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.05);
      background-image: url('../statics/icons/right_drawer.png');
      background-repeat: no-repeat;
      background-position: 0% 45%;
      background-size: 0.33rem 0.66rem;
    }

    .menu-label {
      font-size: 0.18rem;
      color: #18ffff;
    }
  }
}

.text-tabs_color {
  .q-tab-label {
    color: rgba(255, 255, 255, 0.4);
    opacity: 1 !important;
    font-size: 0.22rem;
  }

  .active {
    .q-tab-label {
      color: #18ffff;
      heavy();
    }

    .q-tabs-bar {
      border: none;
    }
  }
}

.sys-title {
  padding: 0.1rem 0.35rem 0.07rem;
  font-size: 0.3rem;
  color: $cyan-12;
  letter-spacing: 0.08rem;
  font-weight: 500;
}

.bg-page {
  background: $red-1;
}

.sysdate_box {
  display: inline-block;
  padding: 0.26rem 0.1rem 0.1rem;
}

.systime {
  font-family: LTDH;
  font-size: 0.2rem;
  color: white;
}

.sysdate {
  medium();
  color: white;
  font-size: 0.14rem;
  line-height: 0.18rem;
}

.weather_box {
  padding-top: 0.15rem;
  cursor: pointer;
  medium();

  .row-one {
    font-size: 0.18rem;
  }

  .row-two {
    font-size: 0.14rem;
    line-height: 0.24rem;
  }
}
</style>
