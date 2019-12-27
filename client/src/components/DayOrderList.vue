<template>
  <div class="row">
    <table
      v-for="order in orders"
      :key="order.id"
      class="col-3 table table-striped table-bordered table-hover"
    >
      <thead>
        <tr>
          <th>
            <div class="d-flex justify-content-between">
              <small>{{order.createdAt | timeFrom}}</small>
              <h4 class="mr-5">{{order.id}}</h4>
              <button class="btn btn-primary" @click.stop.prevent="deleteOrder(order.id)">刪除</button>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div>
              <h4>Dish Name</h4>
              <div class="d-flex justify-content-between">
                <p class="mb-0 d-inline-block">LS、NE</p>
                <p class="d-inline-block">數量：{{order.quantity}}</p>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="note">
          <td>
            <h4>{{order.memo}}</h4>
            <div class="row my-2">
              <button
                class="col-4 btn btn-primary"
                @click.stop.prevent="stateSwitch(`prevState`, order.id)"
              >未處理</button>
              <h4 class="col-4 text-center">{{order.state}}</h4>
              <button
                class="col-4 btn btn-primary"
                @click.stop.prevent="stateSwitch(`nextState`, order.id)"
              >未結帳</button>
            </div>
            <h5 v-if="order.isTakingAway" class="float-left">外帶</h5>
            <h5 v-else class="float-left">桌號: {{order.memo}}</h5>
            <h5 class="float-right">總額: {{order.amount}}</h5>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import { timeFromFilter } from "./../utils/mixins";
import orderAPI from "./../apis/order";

export default {
  mixins: [timeFromFilter],
  props: {
    initialOrders: {
      type: Array
    }
  },
  data() {
    return {
      orders: this.initialOrders,
      tableNum: 0,
      isTakingAway: 0,
      memo: "",
      quantity: 0,
      amount: 0
    };
  },
  created() {},
  methods: {
    stateSwitch(state, orderId) {
      this.$emit("after-order-state-switch", { state, orderId });
    },
    deleteOrder(orderId) {
      this.$emit("after-delete-order", orderId);
    },
    tableNumber() {
      this.$swal
        .fire({
          title: "<h1>請輸入桌號</h1>",
          type: "info",
          input: "number",
          html: "",
          showCloseButton: true,
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText: '<i class="fa fa-thumbs-up"></i> 確認',
          cancelButtonText: '<i class="fa fa-thumbs-down"></i> 返回'
        })
        .then(result => {
          if (+result.value > 0) {
            this.isTakingAway = 0;
            this.tableNum = +result.value;
            this.$swal({
              type: "success",
              title: "成功新增桌號"
            });
          } else {
            this.$swal({
              type: "warning",
              title: "未新增桌號"
            });
          }
        });
    },
    takingAway() {
      this.isTakingAway = 1;
      this.tableNum = 0;
      this.$swal({
        type: "success",
        title: "已選擇外帶"
      });
    },
    async submitOrder() {
      try {
        if (this.addDishes.list.length === 0) {
          throw new Error(statusText);
        }
        const response = await orderAPI.list.post({
          dishes: this.addDishes.list,
          UserId: this.addDishes.user,
          tableNum: this.tableNum,
          isTakingAway: this.isTakingAway,
          memo: this.memo
        });
        // eslint-disable-next-line
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.$emit("after-submit-order");
        this.tableNum = 0;
        this.isTakingAway = 0;
        this.memo = "";
        this.$swal({
          type: "success",
          title: "成功新增清單"
        });
      } catch (error) {
        this.$swal({
          type: "warning",
          title: "未新增清單"
        });
        // eslint-disable-next-line
        console.log("error", error);
      }
    }
  },
  watch: {
    initialOrders(orders) {
      this.orders = {
        ...this.orders,
        ...orders
      };
    }
  }
};
</script>

<style scoped>
.note-text {
  overflow-wrap: break-word;
}
</style>