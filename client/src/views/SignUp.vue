<template>
  <div class="container py-5">
    <form class="w-100" @submit.stop.prevent="handleSubmit">
      <div class="text-center mb-4">
        <h1 class="h3 mb-3 font-weight-normal">Sign Up</h1>
      </div>

      <div class="form-label-group mb-2">
        <label for="name">Account</label>
        <input
          id="account"
          v-model="account"
          name="account"
          type="text"
          class="form-control"
          placeholder="account"
          required
          autofocus
        />
      </div>

      <div class="form-label-group mb-2">
        <label for="name">Phone</label>
        <input
          id="phone"
          v-model="phone"
          name="phone"
          type="text"
          class="form-control"
          placeholder="phone"
          required
          autofocus
        />
      </div>

      <div class="form-label-group mb-2">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          name="email"
          type="email"
          class="form-control"
          placeholder="email"
          required
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
        />
      </div>

      <div class="form-label-group mb-3">
        <label for="password-check">Password Check</label>
        <input
          id="password-check"
          v-model="passwordCheck"
          name="passwordCheck"
          type="password"
          class="form-control"
          placeholder="Password"
          required
        />
      </div>

      <button class="btn btn-lg btn-primary btn-block mb-3" type="submit">Submit</button>

      <div class="text-center mb-3">
        <p>
          <router-link to="/signin">Sign In</router-link>
        </p>
      </div>

      <p class="mt-5 mb-3 text-muted text-center">© 2017-2018</p>
    </form>
  </div>
</template>

<script>
export default {
  /* eslint-disable */
  data() {
    return {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
      isProcessing: false
    };
  },
  methods: {
    handleSubmit() {
      if (!this.account || !this.password || !this.phone || this.email) {
        Toast.fire({
          type: "warning",
          title: "請填完所有必須資料"
        });
        return;
      }

      this.isProcessing = true;

      authorizationAPI
        .signUp({
          account: this.account,
          phone: this.phone,
          email: this.email,
          password: this.password,
          passwordCheck: this.passwordCheck
        })
        .then(response => {
          // 取得 API 請求後的資料
          const { data } = response;
          console.log(data);
          // 成功登入後轉址到登入
          this.$router.push("/signin");
        })
        .catch(error => {
          // 顯示錯誤提示
          Toast.fire({
            type: "warning",
            title: "表單輸入有誤"
          });
          this.isProcessing = false;
          console.log(error);
        });

      const data = JSON.stringify({
        account: this.account,
        phone: this.phone,
        email: this.email,
        password: this.password,
        passwordCheck: this.passwordCheck
      });

      // TODO: 向後端驗證使用者登入資訊是否合法
      console.log("data", data);
    }
  }
};
</script>