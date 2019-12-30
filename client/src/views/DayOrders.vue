<template>
  <div>
    <NavbarTop :initial-title="title" />
    <ul class="nav nav-pills">
      <li v-for="category in categories" :key="category.id" class="nav-item">
        <router-link
          class="nav-link"
          :to="{ name: 'day-orders', query: { state: category.id } }"
        >{{ category.name }}</router-link>
      </li>
    </ul>
    <div class="border border-dark p-0 alist">
      <DayOrderList
        :initial-orders="orders"
        :state-button="stateButton"
        @after-delete-order="afterDeleteOrder"
        @after-order-state-switch="afterOrderStateSwitch"
      />
    </div>
    <NavbarBottm />
  </div>
</template>

<script>
import NavbarTop from "./../components/NavbarTop";
import NavbarBottm from "./../components/NavbarBottm";
import DayOrderList from "./../components/DayOrderList";
import ordersAPI from "./../apis/orders";

export default {
  components: {
    NavbarTop,
    NavbarBottm,
    DayOrderList
  },
  data() {
    return {
      title: "當日訂單",
      categories: [
        { id: "pending", name: "未製作" },
        { id: "making", name: "製作中" },
        { id: "unpaid", name: "未結帳" },
        { id: "paid", name: "已結帳" }
      ],
      orders: {},
      stateButton: {},
      addDishes: {
        list: [],
        user: "",
        quantity: 0,
        amount: 0
      },
      user: {
        name: "",
        phone: ""
      }
    };
  },
  methods: {
    async fetchOrders(state) {
      try {
        const response = await ordersAPI.orders.get(state);
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.orders = data;
        if (state.state === "pending") {
          this.stateButton.left = "";
          this.stateButton.right = "製作中";
        }
        if (state.state === "making") {
          this.stateButton.left = "未製作";
          this.stateButton.right = "未結帳";
        }
        if (state.state === "unpaid") {
          this.stateButton.left = "製作中";
          this.stateButton.right = "已結帳";
        }
        if (state.state === "paid") {
          this.stateButton.left = "未結帳";
          this.stateButton.right = "";
        }
      } catch (error) {
        this.$swal({
          type: "warning",
          title: "無法取得資料，請稍後再試"
        });
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    async afterDeleteOrder(orderId) {
      try {
        const response = await ordersAPI.orders.delete(orderId);
        const { data, statusText } = response;
        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }
        this.orders = this.orders.filter(order => order.id !== orderId);
        this.$swal({
          type: "success",
          title: data.msg
        });
      } catch (error) {
        this.$swal({
          type: "warning",
          title: "無法取得資料，請稍後再試"
        });
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    async afterOrderStateSwitch(stateData) {
      try {
        const response = await ordersAPI.state.put(stateData);
        // eslint-disable-next-line
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.orders = this.orders.filter(
          order => order.id !== stateData.orderId
        );
      } catch (error) {
        this.$swal({
          type: "warning",
          title: "無法取得資料，請稍後再試"
        });
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    afterAddUser(payload) {
      this.addDishes.user = payload.name;
    },
    aftersubmitorder() {
      this.addDishes = {
        list: [],
        user: "",
        quantity: 0,
        amount: 0
      };
      this.user.name = "";
    }
  },
  created() {
    const { state = "pending" } = this.$route.query;
    this.fetchOrders({ state });
  },
  beforeRouteUpdate(to, from, next) {
    const { state = "pending" } = to.query;
    this.fetchOrders({ state });
    next();
  }
};
</script>

<style scoped>
.alist {
  max-height: calc(100vh - 150px);
  overflow: auto;
}
</style>