<template>
  <nav class="text-right">
    <h1 class="d-inline float-left">{{this.initialTitle}}</h1>
    <router-link to="/" class="mr-3">儀錶板</router-link>
    <router-link to="/" class="mr-3">未製作(N)</router-link>
    <router-link to="/" class="mr-3">未結帳(N)</router-link>
    <template>
      <router-link to="#" class="mr-3">
        <img class="userImg" src="../assets/Logo.jpg" alt />
      </router-link>
      <button type="button" class="btn btn-sm btn-warning my-2 my-sm-0" @click="logout">登出</button>
    </template>
  </nav>
</template>

<script>
export default {
  props: {
    initialTitle: {
      type: String
    }
  },
  methods: {
    logout() {
      this.$store.commit("revokeAuthentication");
      this.$router.push("/signin");
    }
  }
};
</script>

<style scoped>
.userImg {
  height: 37px;
  border-radius: 50%;
}
nav {
  background-color: #f1f1f1;
  line-height: 3;
}
</style>