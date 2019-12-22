<template>
  <div class="container py-5">
    <form class="w-100" @submit.prevent.stop="handleSubmit">
      <div class="text-center mb-4">
        <h1 class="h3 mb-3 font-weight-normal">會員登入</h1>
      </div>

      <div class="form-label-group mb-2">
        <label for="account">帳號或手機號碼</label>
        <input
          id="account"
          v-model="account"
          name="account"
          type="account"
          class="form-control"
          placeholder="Account or Phone"
          required
          autofocus
        />
      </div>

      <div class="form-label-group mb-3">
        <label for="password">密碼</label>
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
      <hr />

      <button class="btn btn-primary mb-3 float-right" type="submit" :disabled="isProcessing">登入</button>

      <div class="text-center mb-3 float-left">
        <p>
          <router-link to="/signup">建立帳號</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import authorizationAPI from "./../apis/authorization";
import { Toast } from "./../utils/helpers";

export default {
  /* eslint-disable */
  name: "SignIn",
  data() {
    return {
      account: "",
      password: "",
      isProcessing: false
    };
  },
  methods: {
    handleSubmit() {
      if (!this.account || !this.password) {
        Toast.fire({
          type: "warning",
          title: "請填入 account 和 password"
        });
        return;
      }

      console.log(this.account);
      console.log(this.password);
      this.isProcessing = true;

      authorizationAPI
        .signIn({
          account: this.account,
          password: this.password
        })
        .then(response => {
          // 取得 API 請求後的資料
          const { data } = response;
          // 將 token 存放在 localStorage 內
          localStorage.setItem("token", data.token);
          console.log(data);
          // 成功登入後轉址到首頁
          this.$router.push("/");
        })
        .catch(error => {
          // 將密碼欄位清空
          this.password = "";

          // 顯示錯誤提示
          Toast.fire({
            type: "warning",
            title: "您輸入的帳號密碼錯誤"
          });
          this.isProcessing = false;
          console.log(error);
        });
    }
  }
};
</script>