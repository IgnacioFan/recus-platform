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
              <!-- 回到上一頁 prevPage -->
              <li v-show="prevPage" class="page-item">
                <router-link
                  class="page-link"
                  aria-label="Previous"
                  :to="{name: 'admin-manage-members', query: { page: prevPage }}"
                  style="padding-top: 3px;"
                >
                  <span aria-hidden="true">&laquo;</span>
                </router-link>
              </li>
              <!-- 頁碼 -->
              <li
                v-for="page in totalPage"
                :key="page"
                :class="['page-item', { active: currPage === page }]"
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
        <div class="modal-dialog modal-xl" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">搜尋結果</h5>
            </div>
            <div class="modal-body">
              <MemberTable
                :initial-users="searchResult"
                @after-valid-user="afterValidUser"
                @after-toggle-is-admin="afterToggleIsAdmin"
                @after-show-profile="afterShowProfile"
              />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click.stop.prevent="closeResult">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div v-show="showProfile" class="profileForm">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">會員資料</h5>
              <button
                type="button"
                class="btn btn-danger"
                @click.stop.prevent="deleteUser(profile.id)"
              >刪除會員</button>
            </div>
            <div class="modal-body">
              <AdminMemberForm :initial-user="profile" :initial-orders="orders"/>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click.stop.prevent="closeProfile">關閉</button>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <MemberTable
            :initial-users="leftTableUsers"
            @after-valid-user="afterValidUser"
            @after-toggle-is-admin="afterToggleIsAdmin"
            @after-show-profile="afterShowProfile"
          />
        </div>
        <div class="col">
          <MemberTable
            :initial-users="rightTableUsers"
            @after-valid-user="afterValidUser"
            @after-toggle-is-admin="afterToggleIsAdmin"
            @after-show-profile="afterShowProfile"
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
import AdminMemberForm from "../../components/form/AdminMemberForm";
import Spinner from "../../components/spinner/Spinner";
import adminMemberAPI from "../../apis/admin/member";
import adminUserAPI from "../../apis/admin/user";

export default {
  name: "AdminManageMember",
  components: {
    NavbarTop,
    NavbarBottm,
    MemberTable,
    AdminMemberForm,
    Spinner
  },
  data() {
    return {
      title: "會員管理",
      users: [],
      searchResult: [],
      orders: [],
      userPhone: "",
      totalPage: 1,
      currPage: 1,
      profile: {},
      showProfile: false,
      searchResultShow: false,
      isLoading: true
    };
  },
  computed: {
    prevPage() {
      return this.currPage === 1 ? null : this.currPage - 1;
    },
    nextPage() {
      return this.currPage + 1 > this.totalPage ? null : this.currPage + 1;
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
        const { data, statusText } = await adminMemberAPI.getMembers(page);

        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.totalPage = data.totalPage;
        this.currPage = data.currPage;
        this.users = [...data.users]
          .map(user => {
            return {
              ...user,
              consumeCount: user.orders
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
    async deleteUser(userId) {
      try {
        const { data, statusText } = await adminMemberAPI.deleteMember({
          userId
        });

        if (statusText !== "OK" || data.status !== "success") {
          this.$swal({
            type: "error",
            title: data.msg
          });
          throw new Error(statusText);
        }        
        this.showProfile = false;
        this.searchResultShow = false;
        const { page = 1 } = this.$route.query;
        this.fetchProfiles({ page });
        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          type: "success",
          title: data.msg,
          text: ""
        });
      } catch (error) {
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    async afterValidUser(userId) {
      try {
        const { data, statusText } = await adminMemberAPI.validMember({
          userId
        });

        if (statusText !== "OK" || data.status !== "success") {
          this.$swal({
            type: "error",
            title: data.msg
          });
          throw new Error(statusText);
        }

        this.users = this.users.map(user => {
          if (user.id !== userId) {
            return user;
          } else {
            return {
              ...user,
              isValid: !user.isValid
            };
          }
        });

        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          type: "success",
          title: data.msg,
          text: ""
        });
      } catch (error) {
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    async afterToggleIsAdmin(userId) {
      try {
        const { data, statusText } = await adminMemberAPI.toggleAdmin({
          userId
        });

        if (statusText !== "OK" || data.status !== "success") {
          this.$swal({
            type: "error",
            title: data.msg
          });
          throw new Error(statusText);
        }

        this.users = this.users.map(user => {
          if (user.id !== userId) {
            return user;
          } else {
            return {
              ...user,
              role: data.user.role
            };
          }
        });

        this.searchResult = this.searchResult.map(user => {
          if (user.id !== userId) {
            return user;
          } else {
            return {
              ...user,
              role: data.user.role
            };
          }
        });
      } catch (error) {
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    async searchUser() {
      try {
        const response = await adminUserAPI.user.get({ phone: this.userPhone });
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
            title: data.msg
          });
        } else {
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
    async getMemberOrders(userId) {
      try {
        const response = await adminMemberAPI.getMemberOrders(userId);
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
            title: data.msg
          });
        } else {
          this.orders = data.orders
          this.showProfile = true;
        }
      } catch (error) {
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    closeResult() {
      this.searchResult = [];
      this.searchResultShow = false;
    },
    async afterShowProfile(userPhone) {
      try {
        const response = await adminMemberAPI.searchMember({
          phone: userPhone
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
          this.profile = data.user;
          this.getMemberOrders(data.user.id)
        }
      } catch (error) {
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    closeProfile() {
      this.profile = {};
      this.showProfile = false;
    }
  }
};
</script>

<style scoped>
.searchResult {
  position: absolute;
  z-index: 200;
  /* display: none; */
  top: 0;
  height: 100vh;
  width: 100vw;
  overflow: auto;
}

.profileForm {
  position: absolute;
  z-index: 300;
  /* display: none; */
  top: 0;
  height: 100vh;
  width: 100vw;
  overflow: auto;
}
</style>