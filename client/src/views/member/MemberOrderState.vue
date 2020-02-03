<template>
  <div>
    <h2 class="text-center mb-3">當日訂單狀況</h2>
    <Spinner v-if="isLoading" />
    <template v-else>
      <h1 class="text-center mt-5" v-if="orders.length === 0">沒有任何訂單</h1>
      <div v-else class="card mb-3" v-for="order in orders" :key="order.id">
        <div class="card-body py-0">
          <table class="table table-striped table-hover mb-0">
            <thead>
              <tr>
                <th>
                  <div class="row">
                    <h5 class="col">訂單編號：{{order.flowId}}</h5>
                    <h5
                      v-if="order.state === 'pending'"
                      class="col-4 text-center p-0 text-capitalize"
                    >未製作</h5>
                    <h5
                      v-if="order.state === 'making'"
                      class="col-4 text-center p-0 text-capitalize"
                    >製作中</h5>
                    <h5
                      v-if="order.state === 'unpaid'"
                      class="col-4 text-center p-0 text-capitalize"
                    >未結帳</h5>
                    <h5
                      v-if="order.state === 'paid'"
                      class="col-4 text-center p-0 text-capitalize"
                    >已結帳</h5>
                    <h5 v-if="order.isTakingAway" class="col text-right">外帶</h5>
                    <h5 v-else class="col text-right">桌號：{{order.tableNum}}</h5>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="dish in order.sumOfDishes" :key="dish.id">
                <td>
                  <div class="d-flex justify-content-between">
                    <h4 class="mb-0 d-inline-block">{{dish.name}}</h4>
                    <p
                      class="d-inline-block"
                      style="line-height: 2;"
                    >數量：{{dish.DishCombination.perQuantity}}</p>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="note">
                <td>
                  <h5>備註</h5>
                  <h4 class="border border-secondary mb-2 p-2 rounded-lg">{{order.memo}}</h4>
                  <h5 class="float-left">總額：{{order.amount}}</h5>
                  <small class="float-right">{{order.createdAt | timeFrom}}</small>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </template>
    <MemberNavbarBottom />
  </div>
</template>

<script>
import Spinner from "@/components/Spinner/Spinner";
import MemberNavbarBottom from "@/components/Navbar/MemberNavbarBottom";
import memberOrderAPI from "@/apis/member/order";
import { timeFromFilter } from "@/utils/mixins";

export default {
  name: "MemberOrderState",
  mixins: [timeFromFilter],
  components: {
    Spinner,
    MemberNavbarBottom
  },
  data() {
    return {
      orders: [],
      isLoading: true
    };
  },
  created() {
    this.fetchOrder();
  },
  methods: {
    async fetchOrder() {
      try {
        const response = await memberOrderAPI.getTodayOrder();
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.orders = [...data.order];
        this.isLoading = false;
      } catch (error) {
        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          icon: "warning",
          title: "無法取得餐點",
          text: ""
        });
        this.isLoading = false;
        // eslint-disable-next-line
        console.log("error", error);
      }
    }
  }
};
</script>

<style scoped>
.table td,
.table th {
  padding: 0.4rem;
  vertical-align: middle;
}
</style>