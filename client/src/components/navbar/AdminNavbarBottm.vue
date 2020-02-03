<template>
  <div class="row fixed-bottom">
    <router-link class="btn btn-primary col p-2 mx-1" :to="{ name: 'admin-order'}">
      <h3 class="text-light">店內點餐</h3>
    </router-link>
    <router-link class="btn btn-primary col p-2 mx-1" :to="{ name: 'admin-day-orders'}">
      <h3 class="text-light">當日訂單</h3>
    </router-link>
    <router-link class="btn btn-primary col p-2 mx-1" :to="{ name: 'admin-manage-members'}">
      <h3 class="text-light">會員管理</h3>
    </router-link>
    <router-link class="btn btn-primary col p-2 mx-1" :to="{ name: 'admin-manage-meal'}">
      <h3 class="text-light">菜單管理</h3>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "AdminNavbarBottm",
  methods: {
    logout() {
      this.$store.commit("revokeAuthentication");
      this.$router.push("/admin/signin");
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