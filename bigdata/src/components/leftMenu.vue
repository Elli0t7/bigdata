<template>
  <q-list highlight sparse no-border dark style="background:transparent">
    <template v-for="menu of menus">
      <q-collapsible :key="menu.id" v-if="menu.gchColumns&&menu.gchColumns.length>0" :icon="menu.icon" class="text-nav" :label="menu.label" :sublabel="menu.sublabel">
        <left-menu :menus='menu.gchColumns' />
      </q-collapsible>
      <q-item clickable v-ripple v-else :key="menu.id" link exact :to="{name:menu.subLabel}">
        <q-item-section avatar>
          <q-icon :name="menu.icon" class='text-nav' ></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label class='menu-label text-nav' label>{{menu.label}}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-list>
</template>
<script>
export default {
  name: "leftMenu",
  data() {
    return {};
  },
  props: ["menus"]
};
</script>

<style lang='stylus'>
.text-nav{
  color #1fc0e9;
}
</style>
