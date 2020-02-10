<template>
  <div>
    <div style="height:37px;"></div>
    <div class="fixed-bottom">
      <div class="collapse" id="navbarToggleExternalContent">
        <div class="p-2 text-center" style="border-radius: 50% 50% 0 0;background-color: #e3f2fd;">
          <router-link :to="{name: 'member-profile'}" class="d-block py-2 h4">會員設定</router-link>
          <router-link :to="{name: 'member-password'}" class="d-block py-2 h4">密碼設定</router-link>
          <router-link :to="{name: 'member-my-orders'}" class="d-block py-2 h4">訂餐紀錄</router-link>
          <div class="text-primary py-2 h4" @click="logout">登出</div>
        </div>
      </div>

      <footer class="row text-center" style="background-color: #e3f2fd;">
        <router-link class="col p-2" :to="{name: 'member-menu'}">菜單</router-link>
        <router-link class="col p-2" :to="{name: 'member-order-list'}">結帳</router-link>
        <router-link class="col p-2" :to="{name: 'member-order-state'}">狀態</router-link>
        <p
          class="text-primary col p-2"
          data-toggle="collapse"
          data-target="#navbarToggleExternalContent"
          aria-controls="navbarToggleExternalContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >會員</p>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "MemberNavbarBottom",
  data() {
    return {};
  },
  created() {},
  methods: {
    logout() {
      this.$store.commit("revokeAuthentication");
      this.$router.push("/signin");
    }
  }
};
</script>