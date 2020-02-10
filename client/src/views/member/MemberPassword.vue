<template>
  <div class="box-center" style="background-color: #F0E8DD;height: 100vh;">
    <div class="container border border-secondary" style="border-radius: 5%;">
      <h1 class="py-3 text-center">設定新密碼</h1>
      <form @submit.stop.prevent="handleSubmit">
        <div class="form-label-group mb-3" :class="{'form-group--error': $v.passwordOld.$error}">
          <label for="passwordOld">舊密碼</label>
          <input
            @input="$v.passwordOld.$touch"
            :disabled="isProcessing"
            maxlength="30"
            minlength="8"
            id="passwordOld"
            v-model="passwordOld"
            name="passwordOld"
            type="password"
            class="form-control"
            placeholder="Old password"
            required
            autofocus
            autocomplete
          />
          <small v-if="$v.passwordOld.$error" class="text-danger">長度介於 8 -30</small>
        </div>

        <div class="form-label-group mb-3" :class="{'form-group--error': $v.passwordNew.$error}">
          <label for="passwordNew">新密碼</label>
          <input
            @input="$v.passwordNew.$touch"
            :disabled="isProcessing"
            maxlength="30"
            minlength="8"
            id="passwordNew"
            v-model="passwordNew"
            name="passwordNew"
            type="password"
            class="form-control"
            placeholder="New password"
            required
            autofocus
            autocomplete
          />
          <small v-if="$v.passwordNew.$error" class="text-danger">長度介於 8 -30</small>
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
        <div class="row py-3">
          <button
            class="btn btn-primary col-6"
            :disabled="isProcessing"
            @click.stop.prevent="$router.back()"
          >回上一頁</button>

          <button
            class="btn btn-primary col-6"
            :disabled="isProcessing || $v.$invalid"
            type="submit"
            @click.prevent.stop="handleSubmit"
          >{{ this.isProcessing ? "處理中..." : "送出" }}</button>
        </div>
      </form>
    </div>
    <MemberNavbarBottom />
  </div>
</template>

<script>
import MemberNavbarBottom from "@/components/Navbar/MemberNavbarBottom";
import adminAuthorizationAPI from "@/apis/main/authorization";
import {
  required,
  minLength,
  maxLength,
  sameAs
} from "vuelidate/lib/validators";

export default {
  name: "MemberPassword",
  components: {
    MemberNavbarBottom
  },
  data() {
    return {
      passwordOld: "",
      passwordNew: "",
      passwordCheck: "",
      isProcessing: false
    };
  },
  validations: {
    passwordOld: {
      required,
      minLength: minLength(8),
      maxLength: maxLength(30)
    },
    passwordNew: {
      required,
      minLength: minLength(8),
      maxLength: maxLength(30)
    },
    passwordCheck: {
      sameAs: sameAs("passwordNew")
    }
  },
  methods: {
    async handleSubmit() {
      try {
        this.isProcessing = true;
        const response = await adminAuthorizationAPI.changePassword({
          passwordOld: this.passwordOld,
          passwordNew: this.passwordNew,
          passwordCheck: this.passwordCheck
        });
        const { data, statusText } = response;
        if (statusText !== "OK") {
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
        this.$store.commit("revokeAuthentication");
        this.$router.push("/signin");
      } catch (error) {
        this.isProcessing = false;
        this.$swal({
          icon: "warning",
          title: "密碼錯誤，請確認密碼"
        });
        // eslint-disable-next-line
        console.log("error", error);
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
</style>