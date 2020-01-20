<template>
  <q-page padding>
    <div class="flex-center text-center">
      <h6>欢迎登陆</h6>
    </div>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  mounted() {
    console.log(this.$store.state.platforms);
  }
};
</script>

<style>
</style>
