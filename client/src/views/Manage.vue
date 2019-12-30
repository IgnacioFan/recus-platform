<template>
  <div>
    <NavbarTop :initial-title="title" />

    <div class="row">
      <ul class="nav nav-pills my-2 col-4">
        <li v-for="category in categories" :key="category.id" class="nav-item">
          <router-link
            class="nav-link"
            :to="{ name: 'order', query: { categoryId: category.id } }"
          >{{ category.name }}</router-link>
        </li>
        <li class="nav-item">
          <button
            type="button"
            class="btn btn-primary"
            data-toggle="modal"
            data-target="#mealModal"
            data-whatever="@mdo"
          >新增菜單</button>
        </li>
      </ul>

      <div v-if="!title" class="d-inline-block col-4 d-flex justify-content-center">
        <nav aria-label="Page navigation example">
          <ul class="pagination mb-0">
            <!-- 回到上一頁 previousPage -->
            <li v-show="previousPage" class="page-item">
              <router-link
                class="page-link"
                aria-label="Previous"
                :to="{name: 'members', query: { page: previousPage }}"
                style="padding-top: 3px;"
              >
                <span aria-hidden="true">&laquo;</span>
              </router-link>
            </li>
            <!-- 頁碼 -->
            <li
              v-for="page in totalPage"
              :key="page"
              :class="['page-item', { active: currentPage === page }]"
            >
              <router-link class="page-link" :to="{name: 'members', query: { page }}">{{ page }}</router-link>
            </li>
            <!-- 前往下一頁 nextPage -->
            <li v-show="nextPage" class="page-item">
              <router-link
                class="page-link"
                :to="{name: 'members', query: { page: nextPage }}"
                aria-label="Next"
                style="padding-top: 3px;"
              >
                <span aria-hidden="true">&raquo;</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>

      <div class="col-4"></div>
    </div>

    <div>
      <MealManage :initial-dishes="dishes" @after-delete-dish="afterDeleteDish" />
    </div>

    <div
      class="modal fade"
      id="mealModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">New message</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="meal-name" class="col-form-label">餐點名稱:</label>
                <input type="text" class="form-control" id="meal-name" />
              </div>
              <div class="form-group">
                <label for="category-name" class="col-form-label">類型:</label>
                <input type="text" class="form-control" id="category-name" />
              </div>
              <div class="form-group">
                <label for="meal-price" class="col-form-label">價格:</label>
                <input type="number" class="form-control" id="meal-price" />
              </div>
              <div class="form-group">
                <label for="message-text" class="col-form-label">Message:</label>
                <textarea class="form-control" id="message-text"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Send message</button>
          </div>
        </div>
      </div>
    </div>

    <NavbarBottm />
  </div>
</template>

<script>
import NavbarTop from "./../components/NavbarTop";
import NavbarBottm from "./../components/NavbarBottm";
import MealManage from "./../components/MealManage";
import orderAPI from "./../apis/order";
import manageAPI from "./../apis/manage";

export default {
  components: {
    NavbarTop,
    NavbarBottm,
    MealManage
  },
  data() {
    return {
      title: "菜單管理",
      users: [],
      categories: [
        { id: 1, name: "菜單" },
        { id: 2, name: "分類" },
        { id: 3, name: "標籤" }
      ],
      dishes: [],
      phone: undefined,
      totalPage: undefined,
      currentPage: 1
    };
  },
  computed: {
    previousPage() {
      return this.currentPage === 1 ? null : this.currentPage - 1;
    },
    nextPage() {
      return this.currentPage + 1 > this.totalPage
        ? null
        : this.currentPage + 1;
    },
    leftTableUsers: function() {
      return this.users.slice(0, 7);
    },
    rightTableUsers: function() {
      return this.users.slice(7, 14);
    }
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
    async afterDeleteDish(dishId) {
      try {
        const response = await manageAPI.dish.delete(dishId);
        const { data, statusText } = response;
        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }
        this.orders = this.orders.filter(order => order.id !== dishId);
        this.$swal({
          type: "success",
          title: data.msg
        });
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