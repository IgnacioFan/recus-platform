<template>
  <div>
    <AdminNavbarTop :initial-title="title" />

    <Spinner v-if="isLoading" />
    <div v-else class="dash-board">
      <div class="border-bottom">
        <button
          type="button"
          class="btn btn-outline-primary ml-2"
          :disabled="isProcessing"
          @click.stop.prevent="fetchDashboard({ range:'monthly' })"
        >前七天</button>
        <button
          type="button"
          class="btn btn-outline-primary m-2"
          :disabled="isProcessing"
          @click.stop.prevent="fetchDashboard({ range:'weekly' })"
        >前一個月</button>
        <!-- <router-link
          class="btn btn-outline-primary ml-2"
          :to="{ name: 'admin-dashboard-lineChart', 
          query: {range: `weekly`}}"
        >前七天</router-link>
        <router-link
          class="btn btn-outline-primary m-2"
          :to="{ name: 'admin-dashboard-lineChart', 
          query: {range: `monthly`}}"
        >前一個月</router-link> -->
        <router-link
          class="btn btn-outline-primary m-2"
          :to="{ name: 'admin-dashboard-pieChart'}"
        >圓餅圖</router-link>
      </div>
      <div class="row justify-content-around">
        <div class="col-4 border border-secondary rounded shadow-lg">
          <h3 class="text-center mt-2">HotProducts</h3>
          <!-- <AreaChart class="my-3" /> -->
          <AreaChart class="my-3" :initial-data="lineChartProducts" />
          <AdminDashBoardTable :initial-category="hotProducts" />
        </div>
        <div class="col-4 border border-secondary rounded shadow-lg">
          <h3 class="text-center mt-2">HotTags</h3>
          <!-- <AreaChart class="my-3" /> -->
          <AreaChart class="my-3" :initial-data="lineChartTags" />
          <AdminDashBoardTable :initial-category="hotTags" />
        </div>
        <div class="col-4 border border-secondary rounded shadow-lg">
          <h3 class="text-center mt-2">HotMembers</h3>
          <!-- <AreaChart class="my-3" /> -->
          <AreaChart class="my-3" :initial-data="lineChartMembers" />
          <AdminDashBoardTable :initial-category="hotMembers" />
        </div>
      </div>
    </div>
    <AdminNavbarBottm />
  </div>
</template>

<script>
import AdminNavbarTop from "@/components/Navbar/AdminNavbarTop";
import AdminNavbarBottm from "@/components/Navbar/AdminNavbarBottm";
import AreaChart from "@/components/Chart/AreaChart";
import AdminDashBoardTable from "@/components/Table/AdminDashBoardTable";
import Spinner from "@/components/Spinner/Spinner";
import adminDashboardAPI from "@/apis/admin/dashboard";
import io from "socket.io-client";

export default {
  name: "AdminDashBoardLineChart",
  components: {
    AdminNavbarTop,
    AdminNavbarBottm,
    AreaChart,
    AdminDashBoardTable,
    Spinner
  },
  data() {
    return {
      state: "",
      title: "儀錶板",
      lineChartProducts: [
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "A"
        },
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "B"
        },
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "C"
        },
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "D"
        },
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "E"
        }
      ],
      lineChartTags: [
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "A"
        },
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "B"
        },
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "C"
        },
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "D"
        },
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "E"
        }
      ],
      lineChartMembers: [
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "雷鴻濤"
        },
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "雷炫明"
        },
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "於浩然"
        },
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "秦文昊"
        },
        {
          count: [0, 0, 0, 0, 0, 0, 0],
          range: ["1", "2", "3", "4", "5", "6", "7"],
          title: "石哲瀚"
        }
      ],
      hotProducts: [],
      hotTags: [],
      hotMembers: [],
      isLoading: true,
      isProcessing: false,
      socket: io("https://recusplatform.herokuapp.com/")
    };
  },
  created() {
    this.socket.emit("init");
    const { range = "weekly" } = this.$route.query;
    this.fetchDashboard({ range });
  },
  beforeRouteUpdate(to, from, next) {
    const { range = "weekly" } = to.query;
    this.fetchDashboard({ range });
    next();
  },
  methods: {
    async fetchDashboard(range) {
      try {
        this.isLoading = true;
        this.hotProducts = [];
        this.hotTags = [];
        this.hotMembers = [];
        var productId = [];
        var tagId = [];
        var memberId = [];
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

        this.hotProducts.map((e, index) => (e.indexId = index + 1));
        this.hotTags.map((e, index) => (e.indexId = index + 1));
        this.hotMembers.map((e, index) => (e.indexId = index + 1));

        this.hotProducts.map(e => productId.push(e.id));
        this.hotTags.map(e => tagId.push(e.id));
        this.hotMembers.map(e => memberId.push(e.id));

        this.afterFetchData(productId, "product", range.range);
        this.afterFetchData(tagId, "tag", range.range);
        this.afterFetchData(memberId, "user", range.range);
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
    async afterFetchData(ids, type, range) {
      this.isProcessing = true;
      try {
        const response = await adminDashboardAPI.getLineChart({
          ids: ids,
          type: type,
          range: range
        });
        // eslint-disable-next-line
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        var wproductBox = [
        {
          count: ["20", "11", "18", "14", "10", "5", "1"],
          range: ["01-20", "01-21", "01-22", "01-23", "01-24", "01-25", "01-26"],
          title: "燕麥奶拿鐵"
        },
        {
          count: ["17", "10", "7", "11", "4", "0", "10"],
          range: ["17", "10", "7", "11", "4", "0", "10"],
          title: "燕麥奶焦糖瑪奇朵"
        },
        {
          count: ["11", "14", "13", "10", "20", "14", "10"],
          range: ["11", "14", "13", "10", "20", "14", "10"],
          title: "黑框美式"
        },
        {
          count: ["12", "11", "17", "17", "14", "21", "16"],
          range: ["12", "11", "17", "17", "14", "21", "16"],
          title: "玫瑰水果茶"
        },
        {
          count: ["12", "30", "22", "19", "24", "21", "22"],
          range: ["12", "30", "22", "19", "24", "21", "22"],
          title: "莊園冰低咖啡"
        }
      ]
        var wtagBox = [
        {
          count: ["1", "3", "2", "0", "1", "1", "1"],
          range: ["01-20", "01-21", "01-22", "01-23", "01-24", "01-25", "01-26"],
          title: "衣索比亞"
        },
        {
          count: ["2", "0", "2", "1", "2", "0", "1"],
          range: ["01-20", "01-21", "01-22", "01-23", "01-24", "01-25", "01-26"],
          title: "深焙"
        },
        {
          count: ["0", "2", "1", "1", "0", "0", "1"],
          range: ["01-20", "01-21", "01-22", "01-23", "01-24", "01-25", "01-26"],
          title: "淺焙"
        },
        {
          count: ["1", "0", "0", "0", "1", "0", "0"],
          range: ["1", "0", "0", "0", "1", "0", "0"],
          title: "新品"
        },
        {
          count: ["1", "3", "0", "1", "0", "1", "2"],
          range: ["1", "3", "0", "1", "0", "1", "2"],
          title: "肯亞"
        }
      ]
        var wmemberBox = [
        {
          count: ["2", "1", "0", "0", "1", "1", "1"],
          range: ["01-20", "01-21", "01-22", "01-23", "01-24", "01-25", "01-26"],
          title: "雷鴻濤"
        },
        {
          count: ["1", "0", "1", "1", "0", "1", "1"],
          range: ["01-20", "01-21", "01-22", "01-23", "01-24", "01-25", "01-26"],
          title: "雷炫明"
        },
        {
          count: ["0", "2", "1", "1", "0", "0", "1"],
          range: ["01-20", "01-21", "01-22", "01-23", "01-24", "01-25", "01-26"],
          title: "於浩然"
        },
        {
          count: ["1", "0", "0", "0", "1", "0", "0"],
          range: ["01-20", "01-21", "01-22", "01-23", "01-24", "01-25", "01-26"],
          title: "秦文昊"
        },
        {
          count: ["1", "3", "0", "0", "0", "1", "2"],
          range: ["01-20", "01-21", "01-22", "01-23", "01-24", "01-25", "01-26"],
          title: "石哲瀚"
        }
      ]

        var mproductBox = [
        {
          count: ["80", "71", "88", "62"],
          range: ["01-06", "01-13", "01-20", "01-27"],
          title: "燕麥奶拿鐵"
        },
        {
          count: ["73", "82", "71", "81"],
          range: ["01-06", "01-13", "01-20", "01-27"],
          title: "燕麥奶焦糖瑪奇朵"
        },
        {
          count: ["50", "54", "66", "62"],
          range: ["01-06", "01-13", "01-20", "01-27"],
          title: "黑框美式"
        },
        {
          count: ["55", "66", "68", "62"],
          range: ["01-06", "01-13", "01-20", "01-27"],
          title: "玫瑰水果茶"
        },
        {
          count: ["62", "64", "55", "58"],
          range: ["01-06", "01-13", "01-20", "01-27"],
          title: "莊園冰低咖啡"
        }
      ]
        var mtagBox = [
        {
          count: ["7", "5", "4", "0"],
          range: ["01-06", "01-13", "01-20", "01-27"],
          title: "衣索比亞"
        },
        {
          count: ["2", "0", "4", "1"],
          range: ["01-06", "01-13", "01-20", "01-27"],
          title: "深焙"
        },
        {
          count: ["3", "3", "4", "2"],
          range: ["01-06", "01-13", "01-20", "01-27"],
          title: "淺焙"
        },
        {
          count: ["3", "10", "14", "18"],
          range: ["01-06", "01-13", "01-20", "01-27"],
          title: "新品"
        },
        {
          count: ["3", "8", "4", "8"],
          range: ["01-06", "01-13", "01-20", "01-27"],
          title: "肯亞"
        }
      ]
        var mmemberBox = [
        {
          count: ["3", "5", "4", "2", "0", "0", "2"],
          range: ["01-06", "01-13", "01-20", "01-27"],
          title: "雷鴻濤"
        },
        {
          count: ["1", "0", "3", "3", "2", "0", "1"],
          range: ["01-06", "01-13", "01-20", "01-27"],
          title: "雷炫明"
        },
        {
          count: ["2", "2", "3", "1", "2", "1", "1"],
          range: ["01-06", "01-13", "01-20", "01-27"],
          title: "於浩然"
        },
        {
          count: ["1", "1", "2", "3", "0", "0", "1"],
          range: ["01-06", "01-13", "01-20", "01-27"],
          title: "秦文昊"
        },
        {
          count: ["1", "1", "3", "1", "2", "2", "1"],
          range: ["01-06", "01-13", "01-20", "01-27"],
          title: "石哲瀚"
        }
      ]
if (type === "product" && range === 'monthly') {this.lineChartProducts = wproductBox}
if (type === "tag" && range === 'monthly') {this.lineChartTags = wtagBox}
if (type === "user" && range === 'monthly') {this.lineChartMembers = wmemberBox}

if (type === "product" && range === 'weekly') {this.lineChartProducts = mproductBox}
if (type === "tag" && range === 'weekly') {this.lineChartTags = mtagBox}
if (type === "user" && range === 'weekly') {this.lineChartMembers = mmemberBox}
        // if (type === "product") {
          // for (const key in data.pChart) {
          //   var productInfo = [];
          //   for (const keyt in data.pChart[key]) {
          //     productInfo.push(data.pChart[key][keyt].count);
          //   }
          //   productBox.push({
          //     title: key,
          //     count: productInfo,
          //     range: data.range
          //   });
          // }
        //   this.lineChartProducts = productBox
        // }

        // if (type === "tag") {
          // for (const key in data.tChart) {
          //   var tagInfo = [];
          //   for (const keyt in data.tChart[key]) {
          //     tagInfo.push(data.tChart[key][keyt].count);
          //   }
          //   tagBox.push({
          //     title: key,
          //     count: tagInfo,
          //     range: data.range
          //   });
          // }
        //   this.lineChartTags = tagBox
        // }

        // if (type === "user") {
          // for (const key in data.uChart) {
          //   var userInfo = [];
          //   for (const keyt in data.uChart[key]) {
          //     userInfo.push(data.uChart[key][keyt].count);
          //   }
          //   memberBox.push({
          //     title: key,
          //     count: userInfo,
          //     range: data.range
          //   });
          // }
        //   this.lineChartMembers = memberBox
        // }

        this.isProcessing = false;
      } catch (error) {
        this.$swal({
          icon: "warning",
          title: "無法取得資料，請稍後再試"
        });
        this.isProcessing = false;
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