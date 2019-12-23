<template>
  <div>
    <NavbarTop />
    <div class="row" style="height:100%;">
      <div class="col-8 border border-dark p-0" style="height:calc(100vh - 107px);">
        <Meal :initial-dishes="dishes" />
      </div>
      <div class="col-4 border border-dark p-0" style="height:calc(100vh - 107px);">
        <List />
      </div>
    </div>
    <NavbarBottm />
  </div>
</template>

<script>
import NavbarTop from "./../components/NavbarTop";
import NavbarBottm from "./../components/NavbarBottm";
import Meal from "./../components/Meal";
import List from "./../components/List";
import orderAPI from "./../apis/order";

export default {
  components: {
    NavbarTop,
    NavbarBottm,
    Meal,
    List
  },
  data() {
    return {
      dishes: []
    };
  },
  created() {
    const { categoryId = 1 } = this.$route.query;
    this.fetchDishes({ categoryId });
  },
  beforeRouteUpdate(to, from, next) {
    const { categoryId } = to.query;
    this.fetchDishes({ categoryId: categoryId });
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
    }
  }
};
</script>