<template lang="zh-TW">
  <div class="container">
    <div class="row mt-2">
      <div class="col-auto mr-auto px-0">
        <button>推薦區</button>
        <button>菜單區</button>
      </div>
      <div>
        <p class="d-inline-block mb-0 mr-3">{{this.user.name || "userName"}}</p>
        <form class="form-inline my-2 my-lg-0 d-inline-block">
          <input
            class="form-control mr-sm-2"
            type="text"
            value=""
            v-model="userPhone"
            placeholder="09xxxxxxxx"
          />
          <button
            class="btn btn-outline-success my-2 my-sm-0"
            type="submit"
            @click.stop.prevent="searchUser"
          >Search</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      userData: this.user,
      userPhone: this.user.temp,
      userName: this.user.name
    };
  },
  methods: {
    searchUser() {
      this.$emit("after-search-user", this.userPhone);
    }
  },
  watch: {
    user(userData) {
      this.userData = {
        ...this.userData,
        ...userData
      };
    }
  }
};
</script>

<style scoped>
.meal {
  max-height: calc(100vh - 240px);
  overflow: auto;
}
.dish {
  max-height: 100px;
  padding: 15px 15px;
}
.dishName {
  margin-bottom: 15px;
}
.dish span {
  vertical-align: middle;
}
</style>