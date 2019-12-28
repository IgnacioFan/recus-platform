<template>
  <div class="container">
    <ul class="nav nav-pills my-2">
      <li v-for="category in categories" :key="category.id" class="nav-item">
        <router-link
          class="nav-link"
          :to="{ name: 'order', query: { categoryId: category.id } }"
        >{{ category.name }}</router-link>
      </li>
    </ul>
    <div class="row border border-warning meal">
      <div
        v-for="dish in dishes"
        :key="dish.id"
        @click.stop.prevent="addToList(dish.id,dish.name,dish.price)"
        class="col-lg-4 col-xl-3 dish border border-dark"
      >
        <h5 class="dishName">{{ dish.name }}</h5>
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
      userPhone: "",
      userName: "",
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
    async searchUser() {
      try {
        this.processing = true;
        const response = await orderAPI.user.get({ phone: this.userPhone });
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
          this.$emit("after-add-user", {
            name: data.phone
          });
          this.userName = data.name;
          this.isProcessing = false;
        }
      } catch (error) {
        this.isProcessing = false;
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    addToList(dishId,dishName, dishPrice) {
      this.$swal
        .fire({
          title: "<h1>請選擇數量</h1>",
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
            this.$emit("after-add-to-order", {
              id: dishId,
              name: dishName,
              price: dishPrice,
              quantity: result.value
            });
            this.$swal({
              type: "success",
              title: "成功新增餐點"
            });
          } else {
            this.$swal({
              type: "warning",
              title: "未新增餐點"
            });
          }
        });
    }
  },
  created() {
    this.fetchCategories();
  },
  watch: {
    initialDishes(dishes) {
      this.dishes = {}
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
.dish {
  padding: 15px 15px;
}
.dishName {
  margin-bottom: 15px;
}
.dish span {
  vertical-align: middle;
}
</style>