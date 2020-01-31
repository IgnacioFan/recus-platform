<template>
  <div>
    <NavbarTop :initial-title="title" />

    <Spinner v-if="isLoading" />
    <div v-else class="dash-board">
      <div class="border-bottom">
        <router-link
          class="btn btn-outline-primary m-2"
          :to="{ name: 'admin-dash-board', 
        query: {range: `weekly`}}"
        >前七天</router-link>
        <router-link
          class="btn btn-outline-primary"
          :to="{ name: 'admin-dash-board', 
        query: {range: `monthly`}}"
        >前一個月</router-link>
      </div>
      <div class="row justify-content-around">
        <div class="col-4 border border-secondary rounded">
          <h3 class="text-center mt-3">HotProducts</h3>
          <PieChart class="my-3" :initial-data="hotProducts" />
          <DashBoardTable :initial-category="hotProducts" />
        </div>
        <div class="col-4 border border-secondary rounded">
          <h3 class="text-center mt-3">HotTags</h3>
          <PieChart class="my-3" :initial-data="hotTags" />
          <DashBoardTable :initial-category="hotTags" />
        </div>
        <div class="col-4 border border-secondary rounded">
          <h3 class="text-center mt-3">HotMembers</h3>
          <PieChart class="my-3" :initial-data="hotMembers" />
          <DashBoardTable :initial-category="hotMembers" />
        </div>
      </div>
    </div>
    <NavbarBottm />
  </div>
</template>

<script>
//import Datepicker from "vuejs-datepicker";
//import { en, zh } from "vuejs-datepicker/dist/locale";
import NavbarTop from "../../components/navbar/NavbarTop";
import NavbarBottm from "../../components/navbar/NavbarBottm";
import PieChart from "../../components/chart/PieChart";
import DashBoardTable from "../../components/table/DashBoardTable";
import Spinner from "../../components/spinner/Spinner";
import adminDashboardAPI from "../../apis/admin/dashboard";
import io from "socket.io-client";

export default {
  name: "AdminDashBoard",
  components: {
    NavbarTop,
    NavbarBottm,
    PieChart,
    DashBoardTable,
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
      socket: io("http://localhost:3000")
    };
  },
  created() {
    // add socket
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

        this.hotProducts.map((e, index) => (e.id = index + 1));
        this.hotTags.map((e, index) => (e.id = index + 1));
        this.hotMembers.map((e, index) => (e.id = index + 1));
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.$swal({
          type: "warning",
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
.dash-board {
  height: calc(100vh - 110px);
  overflow-y: auto;
}
</style>