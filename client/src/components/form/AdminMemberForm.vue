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
          class="align-bottom d-block"
          :readonly="!this.initialEditUser"
        />
      </div>

      <div class="col-9">
        <div class="row">
          <div class="form-group col-6">
            <label for="name">稱呼</label>
            <input
              id="name"
              v-model="user.Profile.name"
              type="text"
              class="form-control"
              name="name"
              placeholder="Enter name"
              required
              :readonly="!this.initialEditUser"
            />
          </div>

          <div class="form-group col-6">
            <label for="phone">手機號碼</label>
            <input
              id="phone"
              v-model="user.phone"
              type="text"
              class="form-control"
              name="phone"
              placeholder="Enter phone"
              required
              :readonly="!this.initialEditUser"
            />
          </div>

          <div class="form-group col-6">
            <label for="account">帳號</label>
            <input
              id="account"
              v-model="user.account"
              type="text"
              class="form-control"
              name="account"
              placeholder="Enter account"
              required
              :readonly="!this.initialEditUser"
            />
          </div>

          <div class="form-group col-6">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="user.Profile.email"
              type="email"
              class="form-control"
              name="email"
              placeholder="Enter email"
              required
              :readonly="!this.initialEditUser"
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
        role: ""
      },
      editUser: this.initialEditUser,
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
    },
    editUser(editUser) {
      this.editUser = editUser;
    }
  },
  created() {
    this.user = {
      ...this.user,
      ...this.initialUser
    };
  },
  methods: {
    handleFileChange(e) {
      const files = e.target.files;
      if (!files.length) return; // 如果沒有檔案則離開此函式
      // 否則產生預覽圖...
      const imageURL = window.URL.createObjectURL(files[0]);
      this.dish.image = imageURL;
    },
    formEditCancel() {
      this.user = {
        ...this.user,
        ...this.initialUser
      };
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