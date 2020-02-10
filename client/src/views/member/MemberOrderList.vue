<template>
  <div>
    <h2 class="text-center mb-3">已選擇餐點</h2>
    <div
      class="d-flex justify-content-between border border-secondary border-top-0 border-left-0 border-right-0 my-2 px-3"
    >
      <p>數量：{{quantity}}</p>
      <p>金額：{{amount}}</p>
    </div>

    <router-link :to="{name: 'member-menu'}" v-if="quantity === 0">
      <button class="btn btn-primary w-100 h1">新增一些餐點吧!</button>
    </router-link>
    <template v-else>
      <div v-for="dish in dishes" :key="dish.id" class="card p-3">
        <div class="d-flex justify-content-between">
          <h5>{{dish.name}}</h5>
          <button
            class="btn btn-outline-danger px-4 py-0"
            @click.stop.prevent="removeDish(dish.id,dish.name,dish.quantity)"
          >移除</button>
        </div>
        <div class="d-flex justify-content-between mt-2">
          <p>單價：{{dish.price}}</p>
          <p>數量：{{dish.quantity}}</p>
        </div>
      </div>

      <div class="card p-3">
        <h5 class="my-2">備註</h5>
        <textarea class="w-100" v-model="memo" name="memo" id rows="3"></textarea>
        <div class="row my-2">
          <button class="btn btn-primary col py-2" @click.stop.prevent="tableNumber">內用</button>
          <button class="btn btn-primary col py-2" @click.stop.prevent="takingAway">外帶</button>
          <button
            v-show="this.tableNum>0 || this.isTakingAway>0"
            class="btn btn-primary col py-2"
            @click.stop.prevent="submitOrder"
            :disabled="isProcessing"
          >{{ isProcessing ? "處理中..." : "結帳" }}</button>
        </div>
        <div class="d-flex justify-content-between mt-2">
          <h5 v-show="this.tableNum">桌號：{{this.tableNum}}</h5>
          <h5 v-show="this.isTakingAway">外帶</h5>
          <h5 v-show="!this.tableNum && !this.isTakingAway"></h5>
          <h5>金額：{{amount}}元</h5>
        </div>
      </div>
    </template>

    <MemberNavbarBottom />
  </div>
</template>

<script>
import MemberNavbarBottom from "@/components/Navbar/MemberNavbarBottom";
import memberOrderAPI from "@/apis/member/order";

export default {
  name: "MemberOrderList",
  components: {
    MemberNavbarBottom
  },
  data() {
    return {
      dishes: [],
      tableNum: 0,
      isTakingAway: 0,
      memo: "",
      isProcessing: false
    };
  },
  computed: {
    quantity: function() {
      let e = 0;
      this.dishes.map(dish => {
        e += dish.quantity;
      });
      return e;
    },
    amount: function() {
      let e = 0;
      this.dishes.map(dish => {
        e += dish.price * dish.quantity;
      });
      return e;
    }
  },
  created() {
    this.fetchDishes();
  },
  methods: {
    fetchDishes() {
      this.dishes = [...JSON.parse(localStorage.getItem("orderList"))];
    },
    removeDish(dishId, dishName, dishQuantity) {
      this.$swal
        .fire({
          title: `刪除?`,
          text: `確定要刪除${dishQuantity}個${dishName}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "確定!",
          cancelButtonText: "取消!"
        })
        .then(result => {
          if (result.value) {
            this.dishes = this.dishes.filter(dish => dish.name !== dishName);
            localStorage.setItem("orderList", JSON.stringify(this.dishes));
            this.$swal.fire({
              icon: "success",
              title: "成功刪除",
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
    },
    tableNumber() {
      this.$swal
        .fire({
          title: "<h1>請輸入桌號</h1>",
          icon: "info",
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
    },
    async submitOrder() {
      try {
        this.isProcessing = true;
        const response = await memberOrderAPI.post({
          dishes: this.dishes,
          UserId: this.$store.state.currentUser.id,
          tableNum: this.tableNum,
          isTakingAway: this.isTakingAway,
          memo: this.memo,
          quantity: this.quantity,
          amount: this.amount
        });
        // eslint-disable-next-line
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        localStorage.setItem("orderList", JSON.stringify([]));
        this.dishes = [];
        this.tableNum = 0;
        this.isTakingAway = 0;
        this.memo = "";
        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          icon: "success",
          title: "成功新增清單",
          text: ""
        });
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        this.$swal({
          icon: "warning",
          title: "未新增清單"
        });
        // eslint-disable-next-line
        console.log("error", error);
      }
    }
  }
};
</script>