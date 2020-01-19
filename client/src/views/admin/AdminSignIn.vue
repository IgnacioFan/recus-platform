<template>
  <div class="box-center bg-image">
    <div class="overlay"></div>
    <form class="p-5 border rounded" @submit.prevent.stop="handleSubmit" style="width: 25vw;">
      <div class="mb-4 text-center">
        <h2 class="mb-5 font-weight-normal">歡迎來到濾客平台</h2>
      </div>

      <div class="form-label-group mb-2">
        <label for="account">手機號碼</label>
        <input
          id="account"
          v-model="account"
          name="account"
          type="text"
          class="form-control"
          placeholder="09XXXXXXX"
          :disabled="isProcessing"
          autofocus
        />
      </div>

      <div class="form-label-group mb-3 pb-4 border-bottom">
        <label for="password">密碼</label>
        <input
          id="password"
          v-model="password"
          name="password"
          type="password"
          class="form-control"
          placeholder="Password"
          required
          :disabled="isProcessing"
          autocomplete
        />
      </div>

      <button
        class="btn btn-lg btn-primary btn-block mb-3"
        type="submit"
        :disabled="isProcessing"
      >Submit</button>

      <div class="text-center mb-3">
        <p>
          成為會員？
          <router-link to="/admin/signup">註冊加入</router-link>
        </p>
      </div>

      <p class="mt-5 text-center">&copy; 2019-2020</p>
    </form>
  </div>
</template>

<script>
import store from "../../store";
import adminAuthorizationAPI from "../../apis/admin/authorization";

export default {
  name: "SignIn",
  data() {
    return {
      account: "",
      password: "",
      isProcessing: false
    };
  },
  methods: {
    async handleSubmit() {
      try {
        this.isProcessing = true;

        if (!this.account || !this.password) {
          this.$swal({
            type: "warning",
            title: "帳號與密碼不可空白"
          });
          this.isProcessing = false;
          return;
        }

        // send log in form to API
        const response = await adminAuthorizationAPI.signIn({
          account: this.account,
          password: this.password
        });

        const { data, statusText } = response;

        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }

        // store jwt in localstorage
        localStorage.setItem("token", data.token);

        this.$store.commit("setCurrentUser", data.user);

        if (data.user.isValid === false) {
          this.$swal({
            type: "warning",
            title: "帳號已被停權，請連繫管理者!"
          });
          this.isProcessing = false;
          return;
        }

        store.state.isAuthenticated = await store.dispatch("fetchCurrentUser");

        if (data.user.role === "member") this.$router.push("/member/myorders");
        if (data.user.role === "admin") this.$router.push("/admin/order");

        this.$swal({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          type: "success",
          title: "成功登入",
          text: ""
        });
      } catch (error) {
        this.password = "";
        this.isProcessing = false;

        this.$swal({
          type: "error",
          title: "Oops...",
          text: "請確認您的帳號密碼",
          footer: '<a href="/signup">建立帳號?</a>'
        });
      }
    }
  }
};
</script>

<style scoped>
.box-center {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bg-image {
  z-index: -200;
  background-image: url(https://images.pexels.com/photos/1422286/pexels-photo-1422286.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}
.overlay {
    z-index: -100;
    background: rgba(0, 0, 0, .5);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

form{
  background-color: rgba(250, 250, 250, .85);
}
</style>