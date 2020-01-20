<template>
  <div>
    <form class="row">
      <div class="col-3" v-show="!this.initialCreateMember">
        <label class="d-block" for="avatar">相片</label>
        <img :src="user.Profile.avatar | emptyImage" class="img-thumbnail" width="200" height="200" />

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

      <div class="col-9" v-if="!this.initialCreateMember">
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
              type="number"
              class="form-control"
              name="phone"
              placeholder="Enter phone"
              required
              v-show="this.initialEditUser"
            />
          </div>

          <div class="form-group col-6" v-show="!this.initialCreateMember">
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

          <div class="form-group col-6" v-show="!this.initialCreateMember">
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
              v-model="user.password"
              name="password"
              type="password"
              class="form-control"
              placeholder="Password"
              required
              autocomplete
            />
          </div>

          <div class="form-group col-6" v-show="this.initialEditUser">
            <label for="password-check">Password Check</label>
            <input
              id="password-check"
              v-model="user.passwordCheck"
              name="passwordCheck"
              type="password"
              class="form-control"
              placeholder="password Check"
              required
              autocomplete
            />
          </div>

          <div v-show="this.initialEditUser" class="form-group col-12 mt-3">
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

      <div v-else>
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
              type="number"
              class="form-control"
              name="phone"
              placeholder="Enter phone"
              required
              v-show="this.initialEditUser"
            />
          </div>

          <div class="form-group col-6" v-show="!this.initialCreateMember">
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

          <div class="form-group col-6" v-show="!this.initialCreateMember">
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
              v-model="user.password"
              name="password"
              type="password"
              class="form-control"
              placeholder="Password"
              required
              autocomplete
            />
          </div>

          <div class="form-group col-6" v-show="this.initialEditUser">
            <label for="password-check">Password Check</label>
            <input
              id="password-check"
              v-model="user.passwordCheck"
              name="passwordCheck"
              type="password"
              class="form-control"
              placeholder="password Check"
              required
              autocomplete
            />
          </div>

          <div v-show="this.initialEditUser" class="form-group col-12 mt-3">
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
import adminAuthorizationAPI from "../../apis/admin/authorization";
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
      this.user = {
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
      };
      this.$emit("after-form-edit-cancel");
    },
    async handleSubmit() {
      try {
        if (
          !this.user.Profile.name ||
          !this.user.phone ||
          !this.user.password ||
          !this.user.passwordCheck
        ) {
          this.$swal({
            type: "warning",
            title: "請填完所有必須資料"
          });
          return;
        }
        if (this.user.password !== this.user.passwordCheck) {
          this.$swal({
            type: "warning",
            title: "密碼驗證不相同"
          });
          return;
        }
        this.isProcessing = true;
        const response = await adminAuthorizationAPI.signUp({
          account: this.user.phone,
          name: this.user.Profile.name,
          phone: this.user.phone,
          email: "",
          password: this.user.password,
          passwordCheck: this.user.passwordCheck
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

        this.formEditCancel();
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

<style scoped>
.form-check-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}
</style>