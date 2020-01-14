<template>
  <div>
    <NavbarTop :initial-title="title" />

    <Spinner v-if="isLoading" />
    <div v-else class="dash-board">
      <div class="d-flex justify-content-around border-bottom">
        <router-link class="btn btn-outline-success" :to="{ name: 'admin-dash-board'}">前七週</router-link>
        <router-link class="btn btn-outline-success" :to="{ name: 'admin-dash-board'}">前一個月</router-link>
        <datepicker
          class="d-inline-block"
          style="margin-top:3px;"
          :language="zh"
          placeholder="開始日"
          v-model="startDay"
        ></datepicker>
        <datepicker
          class="d-inline-block"
          style="margin-top:3px;"
          :language="zh"
          placeholder="結束日"
          v-model="endDay"
        ></datepicker>
      </div>
      <div class="row justify-content-around">
        <div class="col-4">
          <h3 class="text-center mt-3">HotProducts</h3>
          <PieChart class="my-3" :initial-data="hotProducts" />
          <DashBoardTable :initial-category="hotProducts" />
        </div>
        <div class="col-4">
          <h3 class="text-center mt-3">HotTags</h3>
          <PieChart class="my-3" :initial-data="hotTags" />
          <DashBoardTable :initial-category="hotTags" />
        </div>
        <div class="col-4">
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
import Datepicker from "vuejs-datepicker";
import { en, zh } from "vuejs-datepicker/dist/locale";
import NavbarTop from "../../components/navbar/NavbarTop";
import NavbarBottm from "../../components/navbar/NavbarBottm";
import PieChart from "../../components/chart/PieChart";
import DashBoardTable from "../../components/table/DashBoardTable";
import Spinner from "../../components/spinner/Spinner";
import adminDashboardAPI from "../../apis/admin/dashboard";

export default {
  name: "AdminDashBoard",
  components: {
    NavbarTop,
    NavbarBottm,
    PieChart,
    Datepicker,
    DashBoardTable,
    Spinner
  },
  data() {
    return {
      en: en,
      zh: zh,
      state: {
        date: ""
      },
      title: "儀錶板",
      hotProducts: [],
      hotTags: [],
      hotMembers: [],
      startDay: "",
      endDay: "",
      isLoading: true
    };
  },
  computed: {},
  created() {
    this.fetchDashboard();
  },
  methods: {
    show() {
      // eslint-disable-next-line
      console.log("startDay", this.startDay);
      // eslint-disable-next-line
      console.log("startDay", this.endDay);
    },
    async fetchDashboard() {
      try {
        const response = await adminDashboardAPI.get();
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