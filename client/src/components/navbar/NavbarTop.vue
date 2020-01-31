<template>
  <nav class="text-right">
    <h1 class="d-inline float-left">{{this.initialTitle}}</h1>

    <p class="d-inline-block text-capitalize mr-3">{{this.connection}}</p>
    <p class="d-inline-block text-capitalize mr-3">Hi,{{user.name}}</p>
    <router-link :to="{name: 'admin-dash-board'}" class="mr-3">儀錶板</router-link>
    <router-link
      :to="{name: 'admin-day-orders', query: { state: this.pending }}"
      class="mr-3"
    >未製作({{pendingLength}})</router-link>
    <router-link
      :to="{name: 'admin-day-orders', query: { state: this.unpaid }}"
      class="mr-3"
    >未結帳({{unpaidLength}})</router-link>
    <template>
      <router-link to="#" class="mr-3">
        <img class="userImg" :src="user.avatar" alt />
      </router-link>
      <button type="button" class="btn btn-sm btn-warning my-2 my-sm-0" @click="logout">登出</button>
    </template>
  </nav>
</template>

<script>
// import adminOrderAPI from "../../apis/admin/order";
import io from "socket.io-client";

export default {
  props: {
    initialTitle: {
      type: String
    }
  },
  data() {
    return {
      user: {},
      pending: "pending",
      unpaid: "unpaid",
      pendingLength: 0,
      unpaidLength: 0,
      pendingLoading: true,
      unpaidLoading: true,
      // socket setting
      isConnected: false,
      connection: "no connection",
      socket: io("http://localhost:3000")
    };
  },
  created() {
    // this.fetchPendingNums();
    // this.fetchUnpaidNums();
    this.user = this.$store.state.currentUser;
  },
  mounted() {
    // socket
    this.socket.on("status", data => {
      //this.isConnected = true;
      this.connection = data;
    });
    this.socket.on("realtime", data => {
      this.pendingLength = data.pending;
      this.unpaidLength = data.unpaid;
      // this.socket.disconnect();
    });
  },
  methods: {
    logout() {
      this.$store.commit("revokeAuthentication");
      this.$router.push("/admin/signin");
    }

    // async fetchPendingNums() {
    //   try {
    //     const response = await adminOrderAPI.orders.pendingNums();
    //     const { data, statusText } = response;
    //     if (statusText !== "OK") {
    //       throw new Error(statusText);
    //     }
    //     // if (state === "pending") {
    //     //   this.pendingLength = data.orders.length;
    //     // }
    //     // if (state === "unpaid") {
    //     //   this.unpaidLength = data.orders.length;
    //     // }

    //     this.pendingLength = data;
    //     this.pendingLoading = false;
    //   } catch (error) {
    //     this.pendingLoading = false;
    //     this.$swal({
    //       type: "warning",
    //       title: "無法取得資料，請稍後再試"
    //     });
    //     // eslint-disable-next-line
    //     console.log("error", error);
    //   }
    // },
    // async fetchUnpaidNums() {
    //   try {
    //     const response = await adminOrderAPI.orders.unpaidNums();

    //     const { data, statusText } = response;
    //     if (statusText !== "OK") {
    //       throw new Error(statusText);
    //     }
    //     // if (state === "pending") {
    //     //   this.pendingLength = data.orders.length;
    //     // }
    //     // if (state === "unpaid") {
    //     //   this.unpaidLength = data.orders.length;
    //     // }

    //     this.unpaidLength = data;
    //     this.unpaidLoading = false;
    //   } catch (error) {
    //     this.unpaidLoading = false;
    //     this.$swal({
    //       type: "warning",
    //       title: "無法取得資料，請稍後再試"
    //     });
    //     // eslint-disable-next-line
    //     console.log("error", error);
    //   }
    // }
  }
};
</script>

<style scoped>
.userImg {
  height: 37px;
  border-radius: 50%;
}
nav {
  background-color: #f1f1f1;
  line-height: 3;
}
</style>