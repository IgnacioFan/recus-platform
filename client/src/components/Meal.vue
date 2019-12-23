<template>
  <div class="container">
    <div class="row mt-2">
      <div class="col-auto mr-auto px-0">
        <button>推薦區</button>
        <button>菜單區</button>
      </div>
      <div>
        <p class="d-inline-block m-0">User name</p>
        <form class="d-inline-block">
          <input type="search" placeholder="09xxxxxxxx" aria-label="Search" />
        </form>
      </div>
    </div>
    <ul class="nav nav-pills my-4">
      <li v-for="category in categories" :key="category.id" class="nav-item">
        <router-link
          class="nav-link"
          :to="{ name: 'order', query: { categoryId: category.id } }"
        >{{ category.name }}</router-link>
      </li>
    </ul>
    <div class="row border border-warning meal">
      <div v-for="dish in dishes" :key="dish.id" class="col-lg-4 col-xl-3 dish border border-dark">
        <router-link class :to="{ }">
          <h5 class="dishName">{{ dish.name }}</h5>
        </router-link>
        <div class="row">
          <div class="col-auto mr-auto px-0">
            <span>價格：{{ dish.price }}</span>
          </div>
          <router-link class="btn btn-primary" :to="{ }">說明</router-link>
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
    }
  },
  created() {
    this.fetchCategories();
  },
  watch: {
    initialDishes(dishes) {
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
  max-height: calc(100vh - 240px);
  overflow: auto;
}
.dish {
  max-height: 100px;
  padding: 15px 15px;
}
.dishName {
  margin-bottom: 15px;
}
.dish span {
  vertical-align: middle;
}
</style>