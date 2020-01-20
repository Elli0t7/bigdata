<template>
  <q-list highlight sparse no-border dark>
  <template  v-for="menu of menus">
    <q-collapsible :key="menu.id"  v-if="menu.gchColumns&&menu.gchColumns.length>0" :icon="menu.icon" :label="menu.label" :sublabel="menu.sublabel">
       <left-menu :menus='menu.gchColumns'/>
     </q-collapsible>
    <q-item v-else :key="menu.id" link exact :to="{name:menu.subLabel}">
    <q-item-side :icon="menu.icon"  text-color='cyan-12' />
    <q-item-main>
      <q-item-tile class='menu-label' label>{{menu.label}}</q-item-tile>
    </q-item-main>
  </q-item>
  </template>
</q-list>
</template>
<script>
export default {
  name: 'leftMenu',
  data () {
    return {}
  },
  props:['menus']
}
</script>

<style>
</style>
