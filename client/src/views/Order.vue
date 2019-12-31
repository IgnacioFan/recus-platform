<template>
  <div>
    <NavbarTop :initial-title="title" />
    <div class="row" style="height:100%;">
      <div class="col-8 border border-dark p-0" style="height:calc(100vh - 107px);">
        <div class>
          <MealTabs :user="user" @after-search-user="afterSearchUser" />
          <Meal
            :initial-dishes="dishes"
            @after-add-to-order="afterAddToOrder"
            @after-add-user="afterAddUser"
          />
        </div>
      </div>
      <div class="col-4 border border-dark p-0" style="height:calc(100vh - 107px);">
        <List
          :add-dishes="addDishes"
          @after-delete-dish="afterDeleteDish"
          @after-submit-order="aftersubmitorder"
        />
      </div>
    </div>
    <NavbarBottm />
  </div>
</template>

<script>
import NavbarTop from "./../components/NavbarTop";
import NavbarBottm from "./../components/NavbarBottm";
import Meal from "./../components/Meal";
import MealTabs from "./../components/MealTabs";
import List from "./../components/List";
import orderAPI from "./../apis/order";

export default {
  components: {
    NavbarTop,
    NavbarBottm,
    Meal,
    List,
    MealTabs
  },
  data() {
    return {
      title: "店內點餐",
      dishes: [],
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
  created() {
    const { categoryId = 1 } = this.$route.query;
    this.fetchDishes({ categoryId });
  },
  beforeRouteUpdate(to, from, next) {
    const { categoryId = 1 } = to.query;
    this.fetchDishes({ categoryId });
    next();
  },
  methods: {
    async fetchDishes(categoryId) {
      try {
        const response = await orderAPI.dishes.get(categoryId);
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.dishes = data;
      } catch (error) {
        this.$swal({
          type: "warning",
          title: "無法取得資料，請稍後再試"
        });
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    afterDeleteDish(dishId) {
      this.addDishes.list = this.addDishes.list.filter(
        dish => dish.id !== dishId
      );
    },
    afterAddToOrder(payload) {
      const { id, name, price, quantity } = payload;
      this.addDishes.list.push({
        id: id,
        name: name,
        price: price,
        quantity: quantity
      });
      this.addDishes.quantity =
        Number(this.addDishes.quantity) + Number(quantity);
      this.addDishes.amount = this.addDishes.amount + price * quantity;
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
      this.user.temp = "";
    },
    async afterSearchUser(userPhone) {
      try {
        const response = await orderAPI.user.get({ phone: userPhone });
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        if (data.name === undefined) {
          this.$swal({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
            type: "warning",
            title: "未找到會員",
            text: ""
          });
        } else {
          this.addDishes.user = data.id;
          this.user = { name: data.name, phone: "" };
        }
      } catch (error) {
        // eslint-disable-next-line
        console.log("error", error);
      }
    }
  }
};
</script>