<template>
  <div>
    <NavbarTop :initial-title="title" />
    <Spinner v-if="isLoading" />
    <template v-else>
      <div class="row" style="height:100%;">
        <div class="col-8 border border-dark p-0" style="height:calc(100vh - 107px);">
          <div>
            <MealTabs :user="user" @after-add-user="afterAddUser" />
            <Meal
              :initial-categories="categories"
              :initial-dishes="dishes"
              @after-add-to-order="afterAddToOrder"
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
    </template>
    <NavbarBottm />
  </div>
</template>

<script>
import NavbarTop from "../../components/navbar/NavbarTop";
import NavbarBottm from "../../components/navbar/NavbarBottm";
import Meal from "../../components/table/Meal";
import MealTabs from "../../components/tabs/MealTabs";
import List from "../../components/table/List";
import Spinner from "../../components/spinner/Spinner";
import adminDishAPI from "../../apis/admin/dish";
import adminCategoryAPI from "../../apis/admin/category";

export default {
  components: {
    NavbarTop,
    NavbarBottm,
    Meal,
    List,
    MealTabs,
    Spinner
  },
  data() {
    return {
      title: "店內點餐",
      categories: [],
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
      dishPK: 0,
      isLoading: true
    };
  },
  created() {
    const { categoryId = 1 } = this.$route.query;
    this.fetchDishes({ categoryId });
    this.fetchCategories();
  },
  beforeRouteUpdate(to, from, next) {
    const { categoryId = 1 } = to.query;
    this.fetchDishes({ categoryId });
    next();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await adminCategoryAPI.categories.get();
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.categories = data;
      } catch (error) {
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    async fetchDishes(categoryId) {
      try {
        const response = await adminDishAPI.dishes.get(categoryId);
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.dishes = [...data.dishes];
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