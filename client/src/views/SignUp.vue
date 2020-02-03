<template>
  <div class="row d-flex justify-content-center bg-color">
    <h1 class="col-12 py-3 text-center">註冊為新會員</h1>
    <div class="bg-image col-6 max-width"></div>
    <form class="w-100 max-width" @submit.stop.prevent="handleSubmit">
      <div class="row">
        <h3 class="col-12 my-3 text-center">會員資料</h3>
        <div class="form-label-group mb-3" :class="{'form-group--error': $v.name.$error}">
          <label for="name">Name</label>
          <input
            @input="$v.name.$touch"
            :disabled="isProcessing"
            maxlength="20"
            minlength="1"
            id="name"
            v-model="name"
            name="name"
            type="text"
            class="form-control"
            placeholder="name"
            required
            autofocus
          />
          <small v-if="$v.name.$error" class="text-danger">長度介於 1 - 20</small>
        </div>

        <div class="form-label-group mb-3" :class="{'form-group--error': $v.phone.$error}">
          <label for="name">Phone</label>
          <input
            @input="$v.phone.$touch"
            :disabled="isProcessing"
            maxlength="15"
            minlength="8"
            id="phone"
            v-model="phone"
            name="phone"
            type="number"
            class="form-control"
            placeholder="phone"
            required
            autofocus
          />
          <small v-if="$v.phone.$error" class="text-danger">長度須為 10</small>
        </div>

        <div
          class="form-label-group mb-3"
          :class="{'form-group--error': $v.email.$error && !$v.email.$pending}"
        >
          <label for="email">Email</label>
          <input
            @input="$v.email.$touch"
            :disabled="isProcessing"
            id="email"
            v-model="email"
            name="email"
            type="email"
            class="form-control"
            placeholder="email"
            required
            autofocus
          />
          <small v-if="!$v.email.email && $v.email.$dirty" class="text-danger">請輸入格式正確的電子信箱</small>
          <small v-if="!$v.email.required && $v.email.$dirty" class="text-danger">電子信箱必填</small>
        </div>

        <div class="form-label-group mb-3" :class="{'form-group--error': $v.account.$error}">
          <label for="name">Account</label>
          <input
            @input="$v.account.$touch"
            :disabled="isProcessing"
            maxlength="30"
            minlength="6"
            id="account"
            v-model="account"
            name="account"
            type="text"
            class="form-control"
            placeholder="account"
            required
            autofocus
          />
          <small v-show="$v.account.$error" class="text-danger">長度介於 5 - 30</small>
        </div>

        <div class="form-label-group mb-3" :class="{'form-group--error': $v.password.$error}">
          <label for="password">Password</label>
          <input
            @input="$v.password.$touch"
            :disabled="isProcessing"
            maxlength="30"
            minlength="8"
            id="password"
            v-model="password"
            name="password"
            type="password"
            class="form-control"
            placeholder="Password"
            required
            autofocus
            autocomplete
          />
          <small v-if="$v.password.$error" class="text-danger">長度介於 8 - 30</small>
        </div>

        <div class="form-label-group mb-3" :class="{'form-group--error': $v.passwordCheck.$error}">
          <label for="password-check">Password Check</label>
          <input
            @input="$v.passwordCheck.$touch"
            :disabled="isProcessing"
            maxlength="30"
            minlength="8"
            id="password-check"
            v-model="passwordCheck"
            name="passwordCheck"
            type="password"
            class="form-control"
            placeholder="Password"
            required
            autofocus
            autocomplete
          />
          <small v-if="$v.passwordCheck.$error" class="text-danger">輸入的兩組密碼須相同</small>
        </div>

        <div class="col-12 text-center form-footer pb-2">
          <button
            class="btn btn-lg btn-primary btn-block mb-3"
            :disabled="isProcessing || $v.$invalid"
            type="submit"
          >{{ this.isProcessing ? "處理中..." : "送出" }}</button>
          <router-link to="/signin">已經是會員</router-link>
        </div>
      </div>
    </form>
    <div class="col-12 py-3"></div>
  </div>
</template>

<script>
import adminAuthorizationAPI from "@/apis/main/authorization";

import {
  required,
  email,
  minLength,
  maxLength,
  sameAs
} from "vuelidate/lib/validators";

export default {
  name: "SignUp",
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
  validations: {
    account: {
      required,
      minLength: minLength(5),
      maxLength: maxLength(30)
    },
    phone: {
      required,
      minLength: minLength(10),
      maxLength: maxLength(10)
    },
    name: {
      required,
      minLength: minLength(1),
      maxLength: maxLength(20)
    },
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(8),
      maxLength: maxLength(30)
    },
    passwordCheck: {
      sameAs: sameAs("password")
    }
  },
  methods: {
    async handleSubmit() {
      try {
        this.isProcessing = true;
        if (!this.account || !this.password || !this.phone || !this.email) {
          this.$swal({
            icon: "warning",
            title: "請填完所有必須資料"
          });
          return;
        }
        if (this.password !== this.passwordCheck) {
          this.$swal({
            icon: "warning",
            title: "密碼驗證不相同"
          });
          return;
        }

        const response = await adminAuthorizationAPI.signUp({
          account: this.account,
          name: this.name,
          phone: this.phone,
          email: this.email,
          password: this.password,
          passwordCheck: this.passwordCheck
        });
        const { data, statusText } = response;
        if (statusText !== "OK") {
          this.$swal({
            icon: "warning",
            title: data.msg
          });
          throw new Error(statusText);
        }

        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          icon: "success",
          title: data.msg
        });

        this.$router.push("sign-in");
      } catch (error) {
        this.$swal({
          icon: "warning",
          title: "註冊失敗，請稍後再試"
        });
        this.isProcessing = false;
        // eslint-disable-next-line
        console.log("error", error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  border-radius: 0 0 50% 50%;
  @include response(xs) {
    background-color: rgb(240, 232, 221);
  }
}
.bg-color {
  min-height: 100%;
  @include setBackground(
    "https://images.pexels.com/photos/2638019/pexels-photo-2638019.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
  );
  @include response(md) {
    background-image: none;
    background-color: #f0e8dd;
  }
}
.bg-image {
  display: none;
  @include response(md) {
    @include setBackground(
      "https://images.pexels.com/photos/2638019/pexels-photo-2638019.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
    );
    border-radius: 120px 0 0 120px;
    display: block;
  }
}
form {
  flex: 0 0 100%;
  max-width: 100%;
  @include response(md) {
    flex: 0 0 50%;
    max-width: 50%;
    position: relative;
  }
}
.form-label-group {
  flex: 0 0 100%;
  max-width: 100%;
  padding-right: 20px;
  padding-left: 20px;
  @include response(lg) {
    flex: 0 0 50%;
    max-width: 50%;
  }
}
.max-width {
  max-width: 450px;
  min-height: 450px;
  border: 1px solid #dee2e6;
}
.form-footer {
  @include response(lg) {
    position: absolute;
    bottom: 0;
    left: 0;
  }
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>