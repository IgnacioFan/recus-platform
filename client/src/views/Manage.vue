<template>
  <div>
    <NavbarTop :initial-title="title" />

    <div class="row">
      <ManageTabs />

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

    <NavbarBottm />
  </div>
</template>

<script>
import NavbarTop from "./../components/NavbarTop";
import NavbarBottm from "./../components/NavbarBottm";
import MealManage from "./../components/MealManage";
import ManageTabs from "./../components/ManageTabs";
import orderAPI from "./../apis/order";
import manageAPI from "./../apis/manage";

export default {
  components: {
    NavbarTop,
    NavbarBottm,
    MealManage,
    ManageTabs
  },
  data() {
    return {
      title: "菜單管理",
      users: [],
      dishes: [],
      phone: undefined,
      totalPage: undefined,
      currentPage: 1
    };
  },
  computed: {},
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

        this.dishes = this.dishes.filter(dish => dish.id !== dishId);

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