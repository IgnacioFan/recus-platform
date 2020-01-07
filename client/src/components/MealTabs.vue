<template>
  <div class="container">
    <div class="row mt-2">
      <div class="col-auto mr-auto px-0">
        <button class="d-none">推薦區</button>
        <button class="d-none">菜單區</button>
      </div>
      <div>
        <p class="d-inline-block mb-0 mr-3">{{this.user.name || "userName"}}</p>
        <form class="form-inline my-2 my-lg-0 d-inline-block">
          <input
            class="form-control mr-sm-2"
            type="text"
            v-model="userPhone"
            placeholder="09xxxxxxxx"
          />
          <button
            class="btn btn-outline-success my-2 my-sm-0"
            type="submit"
            @click.stop.prevent="searchUser"
          >Search</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import roleMemberAPI from "./../apis/role/member";

export default {
  data() {
    return {
      user: {
        name: "",
        phone: "",
        temp: ""
      },
      userPhone: ""
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
        if (!data) {
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
          this.user.name = data.user.Profile.name;
          this.$emit("after-add-user", data.user.id);
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
/* .container {
  position: relative;
} */
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