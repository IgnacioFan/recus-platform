<template>
  <div>
    <form class="row">
      <div class="col-3">
        <label class="d-block" for="avatar">相片</label>
        <img :src="user.Profile.avatar" class="img-thumbnail" width="200" height="200" />

        <input
          id="avatar"
          type="file"
          name="avatar"
          accept="avatar/*"
          @change="handleFileChange"
          class="align-bottom"
          style="display: block;"
          v-show="this.initialEditUser"
        />
      </div>

      <div class="col-9">
        <div class="row">
          <div class="form-group col-6">
            <label for="name">稱呼</label>
            <div v-show="!this.initialEditUser">{{ user.Profile.name }}</div>
            <input
              id="name"
              v-model="user.Profile.name"
              type="text"
              class="form-control"
              name="name"
              placeholder="Enter name"
              required
              v-show="this.initialEditUser"
            />
          </div>

          <div class="form-group col-6">
            <label for="phone">手機號碼</label>
            <div v-show="!this.initialEditUser">{{ user.phone }}</div>
            <input
              id="phone"
              v-model="user.phone"
              type="text"
              class="form-control"
              name="phone"
              placeholder="Enter phone"
              required
              v-show="this.initialEditUser"
            />
          </div>

          <div class="form-group col-6">
            <label for="account">帳號</label>
            <div v-show="!this.initialEditUser">{{ user.account }}</div>
            <input
              id="account"
              v-model="user.account"
              type="text"
              class="form-control"
              name="account"
              placeholder="Enter account"
              required
              v-show="this.initialEditUser"
            />
          </div>

          <div class="form-group col-6">
            <label for="email">Email</label>
            <div v-show="!this.initialEditUser">{{ user.Profile.email }}</div>
            <input
              id="email"
              v-model="user.Profile.email"
              type="email"
              class="form-control"
              name="email"
              placeholder="Enter email"
              required
              v-show="this.initialEditUser"
            />
          </div>

          <div class="form-group col-6" v-show="this.initialEditUser">
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

          <div class="form-group col-6" v-show="this.initialEditUser">
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

          <div v-show="this.initialEditUser" class="form-group col-12">
            <a class="btn btn-primary col-6 py-2" href="#" @click.stop.prevent="formEditCancel">取消</a>

            <button
              type="submit"
              class="btn btn-primary col-6 py-2"
              :disabled="isProcessing"
              @click.stop.prevent="handleSubmit"
            >{{ this.isProcessing ? "處理中..." : "送出" }}</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { emptyImageFilter } from "../../utils/mixins";

export default {
  mixins: [emptyImageFilter],
  name: "AdminMemberForm",
  props: {
    initialUser: {
      type: Object,
      default: () => ({
        Profile: {
          avatar: "",
          email: "",
          name: ""
        },
        account: "",
        phone: "",
        role: ""
      })
    },
    initialEditUser: {
      type: Boolean
    },
    initialCreateMember: {
      type: Boolean
    }
  },
  data() {
    return {
      user: {
        Profile: {
          avatar: "",
          email: "",
          name: ""
        },
        account: "",
        phone: "",
        password: "",
        passwordCheck: "",
        role: ""
      },
      password: "",
      passwordCheck: "",
      editUser: this.initialEditUser,
      createMember: this.initialCreateMember,
      isProcessing: false
    };
  },
  computed: {},
  watch: {
    initialUser(user) {
      this.user = {
        ...this.user,
        ...user
      };
    }
  },
  created() {},
  methods: {
    handleFileChange(e) {
      const files = e.target.files;
      if (!files.length) return; // 如果沒有檔案則離開此函式
      // 否則產生預覽圖...
      const imageURL = window.URL.createObjectURL(files[0]);
      this.dish.image = imageURL;
    },
    formEditCancel() {
      this.$emit("after-form-edit-cancel");
    },
    handleSubmit() {}
  }
};
</script>

<style scoped>
.form-check-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}
</style>