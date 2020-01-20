<template>
  <q-layout view="hHh Lpr lfr">
    <!-- Be sure to play with the Layout demo on docs -->
    <!-- (Optional) The Header -->
    <q-layout-header>
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title>
          高淳全域智慧旅游大数据管理后台
          <span slot="subtitle"></span>
        </q-toolbar-title>
      </q-toolbar>
      <!-- <q-tabs>
        <q-route-tab
          slot="title"
          icon="map"
          to="/your/route"
          replace
          label="One Tab"
        />
        <q-route-tab
          slot="title"
          icon="assignment"
          to="/some/other/route"
          replace
          label="Other Tab"
        />
      </q-tabs>-->
    </q-layout-header>

    <!-- (Optional) The Footer -->
    <!-- <q-layout-footer>
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>
          Footer
          <span slot="subtitle">Subtile</span>
        </q-toolbar-title>
      </q-toolbar>
      <q-tabs>
        <q-route-tab
          slot="title"
          icon="map"
          to="/your/route"
          replace
          label="One Tab"
        />
        <q-route-tab
          slot="title"
          icon="assignment"
          to="/some/other/route"
          replace
          label="Other Tab"
        />
      </q-tabs>
    </q-layout-footer>-->

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-layout-drawer side="left" id="adminMenu" v-model="leftDrawerOpen">
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit q-pa-sm">
        <q-list no-border link inset-delimiter>
          <q-list-header>系统菜单</q-list-header>
          <q-item :to="{name:'userManager'}">
            <q-item-side icon="people" />
            <q-item-main class="first-level" label="用户管理" sublabel />
          </q-item>
          <q-item :to="{name:'parkingManager'}">
            <q-item-side icon="local_parking" />
            <q-item-main class="first-level" label="停车场管理" sublabel />
          </q-item>
          <q-item :to="{name:'broadcastManager'}">
            <q-item-side icon="rss_feed" />
            <q-item-main class="first-level" label="广播节点管理" sublabel />
          </q-item>
          <q-item :to="{name:'monitorManager'}">
            <q-item-side icon="videocam" />
            <q-item-main class="first-level" label="监控管理" sublabel />
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-layout-drawer>

    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from "quasar";
export default {
  // name: 'LayoutName',
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    };
  }
};
</script>

<style lang="stylus">
@import '~variables';

#adminMenu {
  background-color: $primary;
  font-weight: 400;
  color: $cyan-12;

  .q-icon {
    color: $cyan-12;
  }

  .first-level {
    font-size: 0.16rem;
  }
}
</style>

