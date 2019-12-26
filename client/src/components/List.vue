<template>
  <div class="container">
    <div class="row my-2">
      <h5 class="col-auto mr-auto px-0">清單</h5>
      <h5 class="col-auto">總數：{{this.addDishes.quantity}}件</h5>
    </div>
    <div class="border border-warning list">
      <div
        v-for="dish in this.addDishes.list"
        :key="dish.id"
        class="dish border border-dark rounded-lg"
      >
        <h5 class="mb-1">{{dish.name}}</h5>
        <div class="row">
          <div class="col-auto mr-auto px-0">
            <span>數量：{{dish.quantity}}</span>
          </div>
          <button
            class="btn btn-primary"
            @click.stop.prevent="handleDeleteButtonClick(dish.id,dish.quantity,dish.price)"
          >刪除</button>
        </div>
      </div>
    </div>
    <h5 class="my-2">備註</h5>
    <textarea class="w-100" v-model="memo" name="memo" id rows="3"></textarea>
    <div class="row my-2">
      <button class="btn btn-primary col py-2" @click.stop.prevent="tableNumber">內用</button>
      <button class="btn btn-primary col py-2" @click.stop.prevent="takingAway">外帶</button>
      <button
        v-show="this.tableNum>0 || this.isTakingAway>0"
        class="btn btn-primary col py-2"
        @click.stop.prevent="submitOrder"
      >新增</button>
    </div>
    <h5 class="text-right">金額：{{this.addDishes.amount}}元</h5>
  </div>
</template>

<script>
import orderAPI from "./../apis/order";

export default {
  props: {
    addDishes: {}
  },
  data() {
    return {
      dishesData: this.addDishes,
      tableNum: 0,
      isTakingAway: 0,
      memo: "",
      quantity: 0,
      amount: 0
    };
  },
  created() {},
  methods: {
    handleDeleteButtonClick(dishId, quantity, price) {
      this.addDishes.quantity =
        Number(this.addDishes.quantity) - Number(quantity);
      this.addDishes.amount = this.addDishes.amount - price * quantity;
      this.$emit("after-delete-dish", dishId);
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
          memo: this.memo,
          quantity: this.addDishes.quantity,
          amount: this.addDishes.amount
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
    addDishes(dishesData) {
      this.dishesData = {
        ...this.dishesData,
        ...dishesData
      };
    }
  }
};
</script>

<style scoped>
.list {
  height: calc(100vh - 350px);
  overflow: auto;
}
.dish {
  padding: 15px 15px;
}
.dish h5 {
  margin-bottom: 15px;
}
.dish span {
  line-height: 2.2;
}
</style>