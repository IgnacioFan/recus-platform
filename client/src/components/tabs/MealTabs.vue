<template>
  <div class="container">
    <div class="row mt-2">
      <div class="col-auto mr-auto px-0">
        <button class="d-none">推薦區</button>
        <button class="d-none">菜單區</button>
      </div>
      <div>
        <p v-show="this.userName" class="d-inline-block text-capitalize mb-0 mr-3">{{this.userName}}</p>
        <form class="form-inline my-2 my-lg-0 d-inline-block">
          <input
            class="form-control mr-sm-2"
            type="text"
            v-model="userPhone"
            placeholder="09xxxxxxxx"
            style="width: 110px;"
          />
          <button
            class="btn btn-outline-success my-2 my-sm-0"
            type="submit"
            @click.stop.prevent="searchUser"
          >搜尋會員</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import roleMemberAPI from "../../apis/role/member";

export default {
  props: {
    userName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      userPhone: "",
      searchResultShow: false
    };
  },
  methods: {
    async searchUser() {
      try {
        const response = await roleMemberAPI.searchMember({
          phone: this.userPhone
        });
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        
        if (data.status === "error") {
          this.$swal({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
            type: "warning",
            title: "未找到會員",
            text: ""
          });
        } else {
          this.userPhone = "";
          this.$emit("after-show-user", data.user);
        }
      } catch (error) {
        // eslint-disable-next-line
        console.log("error", error);
      }
    }
  },
  watch: {
    user(userData) {
      this.userData = {
        ...this.userData,
        ...userData
      };
    }
  }
};
</script>

<style scoped>
.meal {
  max-height: calc(100vh - 240px);
  overflow: auto;
}
.dish {
  max-height: 100px;
  padding: 15px 15px;
}
.dishName {
  margin-bottom: 15px;
}
.dish span {
  vertical-align: middle;
}
</style>