<template>
  <div class="bg-image text-center">
    <h1 class="pt-5">Oops! Page not found</h1>
    <button class="btn btn-success mt-5 p-4" href="#" @click.stop.prevent="$router.back()">回上一頁</button>
    <router-link :to="{name: 'sign-in'}" class="btn btn-success ml-3 mt-5 p-4">登入</router-link>
  </div>
</template>

<script>
export default {
  name: "NotFound"
};
</script>

<style scoped>
.bg-image {
  z-index: -200;
  background-image: url(https://www.monterail.com/hubfs/vue%20js%20BUDOWNICZY%20-%20wersja%202-2.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
}
.overlay {
  z-index: -100;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

form {
  background-color: rgba(250, 250, 250, 0.85);
}
</style>