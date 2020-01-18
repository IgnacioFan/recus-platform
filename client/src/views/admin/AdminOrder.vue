<template>
  <div>
    <NavbarTop :initial-title="title" />
    <Spinner v-if="isLoading" />
    <template v-else>
      <div class="row" style="height:100%;">
        <div class="col-8 border border-dark p-0" style="height:calc(100vh - 107px);">
          <div>
            <div class="container row mt-2">
              <div class="col-auto mr-auto px-0">
                <button class="d-none">推薦區</button>
                <button class="d-none">菜單區</button>
              </div>
              <div>
                <p
                  v-show="this.userName"
                  class="d-inline-block text-capitalize mb-0 mr-2"
                >{{this.userName}}</p>
                <form class="form-inline my-2 my-lg-0 d-inline-block">
                  <input
                    class="form-control"
                    type="text"
                    v-model="userPhone"
                    placeholder="09XXXXXXXX"
                    style="width: 110px;"
                  />
                  <button
                    class="btn btn-outline-success mx-2"
                    type="submit"
                    @click.stop.prevent="searchUser"
                  >搜尋會員</button>
                  <button
                    class="btn btn-outline-success"
                    type="submit"
                    @click.stop.prevent="createUser"
                  >快速註冊會員</button>
                </form>
              </div>
            </div>
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

    <div v-show="searchResultShow" class="searchResult">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">會員資料</h5>
            <button
              type="button"
              class="btn btn-primary"
              @click.stop.prevent="editUserBtn"
              v-show="false"
            >編輯</button>
          </div>
          <div class="modal-body">
            <AdminMemberForm
              :initial-user="user"
              :initial-edit-user="editUser"
              :initial-create-member="createMember"
              @after-form-edit-cancel="afterFormEditCancel"
            />
          </div>
          <div class="modal-footer" v-show="!this.editUser">
            <button type="button" class="btn btn-primary" @click.stop.prevent="afterAddUser">加入</button>
            <button type="button" class="btn btn-primary" @click.stop.prevent="closeResult">關閉</button>
          </div>
        </div>
      </div>
    </div>

    <NavbarBottm />
  </div>
</template>

<script>
import NavbarTop from "../../components/navbar/NavbarTop";
import NavbarBottm from "../../components/navbar/NavbarBottm";
import Meal from "../../components/table/Meal";
import List from "../../components/table/List";
import AdminMemberForm from "../../components/form/AdminMemberForm";
import Spinner from "../../components/spinner/Spinner";
import adminDishAPI from "../../apis/admin/dish";
import adminCategoryAPI from "../../apis/admin/category";
import roleMemberAPI from "../../apis/role/member";

export default {
  name: "AdminOrder",
  components: {
    NavbarTop,
    NavbarBottm,
    Meal,
    List,
    AdminMemberForm,
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
      userName: "",
      userPhone: "",
      createMember: false,
      user: {},
      dishPK: 0,
      searchResultShow: false,
      editUser: false,
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
        this.categories = data.categories;
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
    async searchUser() {
      try {
        const response = await roleMemberAPI.searchMember({
          phone: this.userPhone
        });
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        if (data.status === "error") {
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
          this.user = data.user;
          this.searchResultShow = true;
        }
      } catch (error) {
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
      this.userName = "";
      this.dishPK = 0;
    },
    afterAddUser() {
      this.userName = this.user.Profile.name;
      this.addDishes.user = this.user.id;
      this.user = {};
      this.userPhone = "";
      this.searchResultShow = false;
    },
    closeResult() {
      this.searchResultShow = false;
      this.user = {};
      this.editUser = false;
    },
    afterFormEditCancel() {
      if (this.createMember) {
        this.searchResultShow = false;
      }
      this.createMember = false;
      this.editUser = false;
    },
    editUserBtn() {
      this.editUser = true;
    },
    createUser() {
      this.user = {
        Profile: {
          avatar: "",
          email: "",
          name: ""
        },
        account: "",
        phone: "",
        role: ""
      };
      this.createMember = true;
      this.searchResultShow = true;
      this.editUser = true;
    }
  }
};
</script>

<style scoped>
.searchResult {
  top: 0;
  position: absolute;
  z-index: 200;
  /* display: none; */
  height: 100vh;
  width: 100vw;
  overflow: auto;
}
</style>