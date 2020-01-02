<template>
  <div>
    <ul class="nav nav-pills my-1">
      <li v-for="category in categories" :key="category.id" class="nav-item">
        <router-link
          class="nav-link"
          :to="{ name: 'manage-dishes', query: { categoryId: category.id } }"
        >{{ category.name }}</router-link>
      </li>
    </ul>
    <div class="row border border-warning meal">
      <div v-for="dish in dishes" :key="dish.id" class="col-4 px-1 mb-3">
        <div class="card">
          <div class="card-header d-flex justify-content-between p-0">
            <h5 class="pt-1">{{ dish.name }}</h5>
            <div class="dropdown dropleft">
              <div
                id="dropdownMenu1"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                  <path
                    fill="#000000"
                    d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z"
                  />
                </svg>
              </div>
              <div class="dropdown-menu" aria-labelledby="dropdownMenu1">
                <a class="dropdown-item" href="#!">編輯</a>
                <a class="dropdown-item" @click.stop.prevent="handleDeleteButtonClick(dish.id)">刪除</a>
              </div>
            </div>
          </div>
          <div class="row" style="height: 140px">
            <img :src="dish.image" class="card-img-top col-6 px-0" height="140px" width="220px" />
            <div class="card-body col-6 p-0 px-2">
              <p class="card-text overflow-hidden" style="height: 110px;">{{ dish.description }}</p>
              <p style="position: absolute;bottom: 0;">價格：{{ dish.price }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orderAPI from "./../apis/order";

export default {
  props: {
    initialDishes: {
      type: Array
    }
  },
  data() {
    return {
      dishId: 0,
      isProcessing: false,
      categories: [],
      dishes: this.initialDishes
    };
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await orderAPI.categories.get();
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
    handleDeleteButtonClick(dishId) {
      this.$emit("after-delete-dish", dishId);
    },
  },
  created() {
    this.fetchCategories();
  },
  watch: {
    initialDishes(dishes) {
      this.dishes = {};
      this.dishes = {
        ...this.dishes,
        ...dishes
      };
    }
  }
};
</script>

<style scoped>
.meal {
  max-height: calc(100vh - 210px);
  overflow: auto;
}

.dropdown-menu {
  min-width: 2.5rem;
}
</style>