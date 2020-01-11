<template>
  <div>
    <NavbarTop :initial-title="title" />

    <Spinner v-if="isLoading" />
      <template v-else>
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
                    :to="{name: 'admin-manage-members', query: { page: previousPage }}"
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
                  <router-link class="page-link" :to="{name: 'admin-manage-members', query: { page }}">{{ page }}</router-link>
                </li>
                <!-- 前往下一頁 nextPage -->
                <li v-show="nextPage" class="page-item">
                  <router-link
                    class="page-link"
                    :to="{name: 'admin-manage-members', query: { page: nextPage }}"
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
      </template>
    <NavbarBottm />
  </div>
</template>

<script>
import NavbarTop from "../../components/navbar/NavbarTop";
import NavbarBottm from "../../components/navbar/NavbarBottm";
import MealManage from "../../components/table/MealManage";
import ManageTabs from "../../components/tabs/ManageTabs";
import Spinner from "../../components/spinner/Spinner";
import adminDishAPI from "../../apis/admin/dish";


export default {
  components: {
    NavbarTop,
    NavbarBottm,
    MealManage,
    ManageTabs,
    Spinner
  },
  data() {
    return {
      title: "菜單管理",
      dishes: [],
      isLoading: true
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
    async afterDeleteDish(dishId) {
      try {
        const response = await adminDishAPI.dish.delete(dishId);
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