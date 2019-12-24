<template>
  <div id="app">
    <PageHeader/>
    <div class="app">
      <router-view style="min-height: 600px;"></router-view>
    </div>
    <PageFooter/>
  </div>
</template>

<script>
import PageHeader from './PageHeader.vue';
import PageFooter from './PageFooter.vue';

export default {
  name: 'app',
  components: {
    PageHeader, PageFooter,
  },
};
</script>

<style>
.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
h3 {
  color: #303133;
}
body {
  margin: 0;
}
#app {
  min-width: 1440px;
}
</style>
