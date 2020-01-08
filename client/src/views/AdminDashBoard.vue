<template>
  <div>
    <NavbarTop :initial-title="title" />

    <Spinner v-if="isLoading" />
    <template v-else>
      <div class="row justify-content-around" style="margin-top:20vh;">
        <div class="col-6">
          <h3 class="text-center mb-3">HotProducts</h3>
          <DashBoardTable :initial-category="hotProducts" />
        </div>
        <div class="col-6">
          <h3 class="text-center mb-3">HotTags</h3>
          <DashBoardTable :initial-category="hotTags" />
        </div>
      </div>
    </template>
    <NavbarBottm />
  </div>
</template>

<script>
// import Datepicker from "vuejs-datepicker";
// import { en, zh } from "vuejs-datepicker/dist/locale";
import NavbarTop from "./../components/NavbarTop";
import NavbarBottm from "./../components/NavbarBottm";
import DashBoardTable from "./../components/DashBoardTable";
import adminDashboardAPI from "./../apis/admin/dashboard";
import Spinner from "./../components/Spinner";

export default {
  name: "AdminDashBoard",
  components: {
    NavbarTop,
    NavbarBottm,
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
      isLoading: true
    };
  },
  computed: {},
  created() {
    this.fetchDashboard();
  },
  methods: {
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
        this.hotProducts.map((e, index) => (e.id = index + 1));
        this.hotTags.map((e, index) => (e.id = index + 1));
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
.searchResult {
  position: absolute;
  z-index: 200;
  /* display: none; */
  height: 100vh;
  width: 100vw;
  overflow: auto;
}
</style>