<template>
  <div class="row fixed-bottom">
    <router-link class="btn btn-primary col p-3" :to="{ name: 'order'}">
      <p>店內點餐</p>
    </router-link>
    <router-link class="btn btn-primary col p-3" :to="{ name: 'day-orders'}">
      <p>當日訂單</p>
    </router-link>
    <router-link class="btn btn-primary col p-3" :to="{ name: 'memberseach'}">
      <p>會員管理</p>
    </router-link>
    <router-link class="btn btn-primary col p-3" :to="{ name: 'manage-dishes'}">
      <p>菜單管理</p>
    </router-link>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.commit("revokeAuthentication");
      this.$router.push("/signin");
    }
  }
};
</script>

<style scoped>
p {
  font-size: 20px;
  color: aliceblue;
}
.btn-primary:hover {
  background-color: rgb(23, 7, 110);
}
</style>