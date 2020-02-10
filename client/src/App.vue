<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default {
  name: "App"
};
</script>

<style lang="scss">
html {
  height: 100%;
}
body {
  background-color: #f4f7f8;
  color: color(secondary);
  height: 100%;
}
#app {
  height: 100%;
}
</style>