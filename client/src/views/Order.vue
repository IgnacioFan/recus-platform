<template>
  <div>
    <NavbarTop :initial-title="title" />
    <div class="row" style="height:100%;">
      <div class="col-8 border border-dark p-0" style="height:calc(100vh - 107px);">
        <div>
          <MealTabs :user="user" @after-add-user="afterAddUser" />
          <Meal :initial-dishes="dishes" @after-add-to-order="afterAddToOrder" />
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
import adminDishAPI from "./../apis/admin/dish";

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
        temp: "",
        phone: ""
      },
      dishPK: 0
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
        const response = await adminDishAPI.dishes.get(categoryId);
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
    afterDeleteDish(dishPK) {
      this.addDishes.list = this.addDishes.list.filter(
        dish => dish.PK !== dishPK
      );
    },
    afterAddToOrder(payload) {
      const { id, name, price, quantity } = payload;
      this.addDishes.list.push({
        PK: this.dishPK++,
        id: id,
        name: name,
        price: price,
        quantity: quantity
      });
      this.addDishes.quantity =
        Number(this.addDishes.quantity) + Number(quantity);
      this.addDishes.amount = this.addDishes.amount + price * quantity;
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
      this.dishPK = 0;
    },
    afterAddUser(userId) {
      this.addDishes.user = userId;
    }
  }
};
</script>