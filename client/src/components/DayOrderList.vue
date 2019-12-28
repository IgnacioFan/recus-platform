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
        <tr v-for="dish in order.sumOfDishes" :key="dish.id">
          <td>
            <div>
              <h4>{{dish.name}}</h4>
              <div class="d-flex justify-content-between">
                <p class="mb-0 d-inline-block">LS、NE</p>
                <p class="d-inline-block">數量：{{dish.DishCombination.quantity}}</p>
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
              <div class="col-4" v-show="order.state === `pending`"></div>
              <button
                v-show="order.state !== `pending`"
                class="col-4 btn btn-primary"
                @click.stop.prevent="stateSwitch(`prevState`, order.id)"
              >
                <svg style="width:20px;height:24px" viewBox="6 1 20 24">
                  <path
                    fill="#f4f4f4"
                    d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
                  />
                </svg>
                {{stateBtn.left}}
              </button>
              <h4 class="col-4 text-center p-0 text-capitalize">{{order.state}}</h4>
              <button
                v-show="order.state !== `paid`"
                class="col-4 btn btn-primary"
                @click.stop.prevent="stateSwitch(`nextState`, order.id)"
              >
                {{stateBtn.right}}
                <svg style="width:20px;height:24px" viewBox="0 2 15 24">
                  <path
                    fill="#f4f4f4"
                    d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
                  />
                </svg>
              </button>
            </div>
            <h5 v-if="order.isTakingAway" class="float-left">外帶</h5>
            <h5 v-else class="float-left">桌號: {{order.tableNum}}</h5>
            <h5 class="float-right">總額: {{order.amount}}</h5>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import { timeFromFilter } from "./../utils/mixins";

export default {
  mixins: [timeFromFilter],
  props: {
    initialOrders: {},
    stateButton: {
      type: Object
    }
  },
  data() {
    return {
      orders: this.initialOrders.orders,
      tableNum: 0,
      isTakingAway: 0,
      memo: "",
      quantity: 0,
      amount: 0,
      stateBtn: this.stateButton
    };
  },
  created() {},
  methods: {
    stateSwitch(state, orderId) {
      this.$emit("after-order-state-switch", { state, orderId });
    },
    deleteOrder(orderId) {
      this.$emit("after-delete-order", orderId);
    }
  },
  watch: {
    initialOrders(orders) {
      this.orders = {};
      this.orders = {
        ...this.orders,
        ...orders
      };
    },
    stateButton(stateBtn) {
      this.stateBtn = {
        ...this.stateBtn,
        ...stateBtn
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