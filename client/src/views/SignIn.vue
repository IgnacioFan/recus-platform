<template>
  <div class="container py-5">
    <form class="w-100" @submit.prevent.stop="handleSubmit">
      <div class="text-center mb-4">
        <h1 class="h3 mb-3 font-weight-normal">Sign In</h1>
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

      <div class="form-label-group mb-3">
        <label for="password">Password</label>
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
          <router-link to="/signup">Sign Up</router-link>
        </p>
      </div>

      <p class="mt-5 mb-3 text-muted text-center">&copy; 2017-2018</p>
    </form>
  </div>
</template>

<script>
import authorizationAPI from "./../apis/authorization";

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
        const response = await authorizationAPI.signIn({
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

        this.$router.push("/order");

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