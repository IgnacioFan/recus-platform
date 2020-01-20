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
        <label for="name">Name</label>
        <input
          id="name"
          v-model="name"
          name="name"
          type="text"
          class="form-control"
          placeholder="name"
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
          <router-link to="/admin/signin">Sign In</router-link>
        </p>
      </div>

      <p class="mt-5 mb-3 text-muted text-center">© 2017-2018</p>
    </form>
  </div>
</template>

<script>
import adminAuthorizationAPI from "../../apis/admin/authorization";

export default {
  /* eslint-disable */
  data() {
    return {
      account: "",
      name: "",
      phone: "",
      email: "",
      password: "",
      passwordCheck: "",
      isProcessing: false
    };
  },
  methods: {
    async handleSubmit() {
      try {
        if (!this.account || !this.password || !this.phone || !this.email) {
          Toast.fire({
            type: "warning",
            title: "請填完所有必須資料"
          });
          return;
        }
        this.isProcessing = true;
        const response = await adminAuthorizationAPI.signUp({
          account: this.account,
          name: this.name,
          phone: this.phone,
          email: this.email,
          password: this.password,
          passwordCheck: this.passwordCheck
        });
        const { data, statusText } = response;
        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }

        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          type: "success",
          title: data.msg
        });

        this.$router.push("admin-sign-in");
      } catch (error) {
        this.$swal({
          type: "warning",
          title: "無法取得資料，請稍後再試"
        });
        // eslint-disable-next-line
        console.log("error", error);
      }
    }
  }
};
</script>