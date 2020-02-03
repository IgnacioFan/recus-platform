<template>
  <div>
    <AdminNavbarTop :initial-title="title" />

    <Spinner v-if="isLoading" />
    <div v-else class="dash-board">
      <div class="border-bottom">
        <router-link
          class="btn btn-outline-primary ml-2"
          :to="{ name: 'admin-dashboard-pieChart', 
        query: {range: `weekly`}}"
        >前七天</router-link>
        <router-link
          class="btn btn-outline-primary m-2"
          :to="{ name: 'admin-dashboard-pieChart', 
        query: {range: `monthly`}}"
        >前一個月</router-link>
        <router-link class="btn btn-outline-primary" :to="{ name: 'admin-dashboard-lineChart'}">曲線圖</router-link>
      </div>
      <div class="row justify-content-around">
        <div class="col-4 border border-secondary rounded shadow-lg">
          <h3 class="text-center mt-3">HotProducts</h3>
          <PieChart class="my-3" :initial-data="hotProducts" />
          <AdminDashBoardTable :initial-category="hotProducts" />
        </div>
        <div class="col-4 border border-secondary rounded shadow-lg">
          <h3 class="text-center mt-3">HotTags</h3>
          <PieChart class="my-3" :initial-data="hotTags" />
          <AdminDashBoardTable :initial-category="hotTags" />
        </div>
        <div class="col-4 border border-secondary rounded shadow-lg">
          <h3 class="text-center mt-3">HotMembers</h3>
          <PieChart class="my-3" :initial-data="hotMembers" />
          <AdminDashBoardTable :initial-category="hotMembers" />
        </div>
      </div>
    </div>
    <AdminNavbarBottm />
  </div>
</template>

<script>
import AdminNavbarTop from "../../components/Navbar/AdminNavbarTop";
import AdminNavbarBottm from "../../components/Navbar/AdminNavbarBottm";
import PieChart from "@/components/Chart/PieChart";
import AdminDashBoardTable from "@/components/Table/AdminDashBoardTable";
import Spinner from "@/components/Spinner/Spinner";
import adminDashboardAPI from "@/apis/admin/dashboard";
import io from "socket.io-client";

export default {
  name: "AdminDashBoardPieChart",
  components: {
    AdminNavbarTop,
    AdminNavbarBottm,
    PieChart,
    AdminDashBoardTable,
    Spinner
  },
  data() {
    return {
      state: {
        date: ""
      },
      title: "儀錶板",
      hotProducts: [],
      hotTags: [],
      hotMembers: [],
      startDay: "",
      endDay: "",
      isLoading: true,
      socket: io("https://recusplatform.herokuapp.com/")
    };
  },
  created() {
    this.socket.emit("init");
    const { range = "weekly" } = this.$route.query;
    this.fetchDashboard({ range });
    //this.fetchss({ id: 1 });
  },
  beforeRouteUpdate(to, from, next) {
    const { range = "weekly" } = to.query;
    this.fetchDashboard({ range });
    //this.fetchss({ id: 1 });
    next();
  },
  methods: {
    async fetchDashboard(range) {
      try {
        this.isLoading = true;
        this.hotProducts = [];
        this.hotTags = [];
        this.hotMembers = [];
        const response = await adminDashboardAPI.getPieChart(range);
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        for (var productprop in data.hotProducts) {
          this.hotProducts.push(data.hotProducts[productprop]);
        }
        for (var tagprop in data.hotTags) {
          this.hotTags.push(data.hotTags[tagprop]);
        }
        for (var memberrop in data.hotMembers) {
          this.hotMembers.push(data.hotMembers[memberrop]);
        }

        this.hotProducts.push({ name: "其他", count: data.otherProducts });
        this.hotTags.push({ name: "其他", count: data.otherTags });
        this.hotMembers.push({ name: "其他", count: data.otherMembers });

        this.hotProducts.map((e, index) => (e.indexId = index + 1));
        this.hotTags.map((e, index) => (e.indexId = index + 1));
        this.hotMembers.map((e, index) => (e.indexId = index + 1));

        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.$swal({
          icon: "warning",
          title: "無法取得資料，請稍後再試"
        });
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    async fetchss(id) {
      try {
        const response = await adminDashboardAPI.getLineChart(id);
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        // eslint-disable-next-line
        console.log("data", data);
      } catch (error) {
        this.$swal({
          icon: "warning",
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
.dash-board {
  height: calc(100vh - 110px);
  overflow-y: auto;
}
.small {
  padding-right: 70px;
  padding-left: 70px;
}
</style>