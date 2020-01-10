<template>
  <div>
    <NavbarTop :initial-title="title" />

    <Spinner v-if="isLoading" />
    <template v-else>
      <div class="row my-lg-4 my-xl-3">
        <form class="form-inline my-2 my-lg-0 d-inline-block col-4" action="/search">
          <input
            class="form-control mr-sm-2"
            type="text"
            name="keyword"
            v-model="userPhone"
            placeholder="輸入手機電話..."
          />
          <button type="button" class="btn btn-primary" @click.stop.prevent="searchUser">搜尋</button>
        </form>

        <div class="d-inline-block col-4 d-flex justify-content-center">
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
                <router-link
                  class="page-link"
                  :to="{name: 'admin-manage-members', query: { page }}"
                >{{ page }}</router-link>
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

      <div v-show="searchResultShow" class="searchResult">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">搜尋結果</h5>
            </div>
            <div class="modal-body">
              <MemberTable
                :initial-users="searchResult"
                @after-delete-user="afterDeleteUser"
                @after-toggle-is-admin="afterToggleIsAdmin"
              />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click.stop.prevent="closeResult">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <MemberTable
            :initial-users="leftTableUsers"
            @after-delete-user="afterDeleteUser"
            @after-toggle-is-admin="afterToggleIsAdmin"
          />
        </div>
        <div class="col">
          <MemberTable
            :initial-users="rightTableUsers"
            @after-delete-user="afterDeleteUser"
            @after-toggle-is-admin="afterToggleIsAdmin"
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
import MemberTable from "../../components/table/MemberTable";
import Spinner from "../../components/spinner/Spinner";
import roleMemberAPI from "../../apis/role/member";
import mainUserAPI from "../../apis/main/user";


export default {
  components: {
    NavbarTop,
    NavbarBottm,
    MemberTable,
    Spinner
  },
  data() {
    return {
      title: "會員管理",
      users: [],
      searchResult: [],
      userPhone: "",
      totalPage: 1,
      currentPage: 1,
      searchResultShow: false,
      isLoading: true
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
      return this.users.slice(0, 8);
    },
    rightTableUsers: function() {
      return this.users.slice(8, 16);
    }
  },
  created() {
    const { page = 1 } = this.$route.query;
    this.fetchProfiles({ page });
  },
  beforeRouteUpdate(to, from, next) {
    const { page = 1 } = to.query;
    this.fetchProfiles({ page });
    next();
  },
  methods: {
    async fetchProfiles(page) {
      try {
        const { data, statusText } = await roleMemberAPI.getMembers(page);

        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.totalPage = data.totalPage;
        this.currentPage = data.currentPage;
        this.users = [...data.users]
          .map(user => {
            return {
              ...user,
              consumeCount: user.MemberOrders.length
            };
          })
          .sort((a, b) => Number(a.id) - Number(b.id));
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.$swal({
          type: "error",
          title: "無法取得資料，請稍後再試"
        });
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    async afterDeleteUser(userId) {
      try {
        // eslint-disable-next-line
        const { data, statusText } = await roleMemberAPI.deleteMember({
          userId
        });

        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.users = this.users.filter(user => user.id !== userId);
        this.searchResult = this.searchResult.filter(
          user => user.id !== userId
        );

        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          type: "success",
          title: "已刪除會員",
          text: ""
        });
      } catch (error) {
        // eslint-disable-next-line
        console.log("error", error);
        this.$swal({
          type: "error",
          title: "無法移除使用者，請稍後再試"
        });
      }
    },
    async afterToggleIsAdmin(userId) {
      try {
        const { data, statusText } = await roleMemberAPI.toggleAdmin({
          userId
        });

        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }

        this.users = this.users.map(user => {
          if (user.id !== userId) {
            return user;
          } else {
            return {
              ...user,
              role: ""
            };
          }
        });

        this.searchResult = this.searchResult.map(user => {
          if (user.id !== userId) {
            return user;
          } else {
            return {
              ...user,
              isAdmin: !user.isAdmin
            };
          }
        });
      } catch (error) {
        // eslint-disable-next-line
        console.log("error", error);
        this.$swal({
          type: "error",
          title: "無法切換使用者權限，請稍後再試"
        });
      }
    },
    async searchUser() {
      try {
        const response = await mainUserAPI.user.get({ phone: this.userPhone });
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        if (!data) {
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
          // eslint-disable-next-line
          console.log("data", data);
          this.userPhone = "";
          this.searchResult = [data.user];
          let member = this.searchResult[0].Profile;
          this.searchResult[0].consumeCount = 0 || member.length;
          this.searchResultShow = true;
        }
      } catch (error) {
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    closeResult() {
      this.searchResultShow = false;
    }
  }
};
</script>

<style scoped>
.searchResult {
  position: absolute;
  z-index: 200;
  /* display: none; */
  height: 100vh;
  width: 100vw;
  overflow: auto;
}
</style>