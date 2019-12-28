<template>
  <div>
    <NavbarTop :initial-title="title" />
    <form class="form-inline my-2 my-lg-0 d-inline-block" action="/search">
      <input
        class="form-control mr-sm-2"
        type="text"
        name="keyword"
        v-model="phone"
        placeholder="輸入手機電話..."
      />
      <router-link :to="{name:'memberseach', query:{phone:phone}}">
        <button type="button" class="btn btn-primary">搜尋</button>
      </router-link>
    </form>

    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">手機</th>
          <th scope="col">消費次數</th>
          <th scope="col" width="110">刪除</th>
          <th scope="col" width="110">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <th scope="row">
            <router-link :to="{path:'/users', params:{id:user.id}}">{{ user.account }}</router-link>
          </th>
          <td class="position-relative">
            <div class="user-name">{{ user.phone }}</div>
          </td>
          <td class="position-relative">
            <div class="user-name">{{ user.consumeCount }}</div>
          </td>
          <td class="position-relative">
            <button
              type="button"
              class="btn btn-link mr-2"
              @click.stop.prevent="deleteUser(user.id)"
            >Delete</button>
          </td>
          <td class="d-flex justify-content-between">
            <button
              v-if="!user.isSelf"
              type="button"
              class="btn btn-link"
              @click.stop.prevent="toggleIsAdmin(user.id)"
            >
              <template v-if="user.isAdmin">set as user</template>
              <template v-else>set as admin</template>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!----  分頁  ---->
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <!-- 回到上一頁 previousPage -->
        <li class="page-item">
          <router-link
            class="page-link"
            aria-label="Previous"
            :to="{name: 'members', query: { page: previousPage }}"
            v-show="previousPage"
          >
            <span aria-hidden="true">&laquo;</span>
          </router-link>
        </li>
        <!-- 頁碼 -->
        <li
          v-for="page in totalPage"
          :key="page"
          class="page-item"
          :class="['page-item', { active: currentPage === page }]"
        >
          <router-link class="page-link" :to="{name: 'members', query: { page }}">{{ page }}</router-link>
        </li>
        <!-- 前往下一頁 nextPage -->
        <li class="page-item">
          <router-link
            class="page-link"
            :to="{name: 'members', query: { page: nextPage }}"
            aria-label="Next"
            v-show="nextPage"
          >
            <span aria-hidden="true">&raquo;</span>
          </router-link>
        </li>
      </ul>
    </nav>
    <NavbarBottm />
  </div>
</template>

<script>
import NavbarTop from "./../components/NavbarTop";
import NavbarBottm from "./../components/NavbarBottm";
import usersAPI from "./../apis/users";

const dummyUser = {
  user: {
    id: 2,
    account: "user1",
    phone: "0901",
    password: "12345678",
    name: "Nacho",
    email: "user1@example.com",
    image: "",
    isAdmin: false,
    isValid: true,
    createdAt: "2019-11-20T06:25:42.685Z",
    updatedAt: "2019-11-21T09:55:30.970Z",
    Orders: [{ id: 1 }, { id: 2 }, { id: 3 }]
  }
};

export default {
  components: {
    NavbarTop,
    NavbarBottm
  },
  data() {
    return {
      title: "會員管理",
      users: [],
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
    }
  },
  created() {
    const { page } = this.$route.query;
    this.fetchProfiles({ page });
  },
  beforeRouteUpdate(to, from, next) {
    const { page } = to.query;
    this.fetchProfiles({ page });
    next();
  },
  methods: {
    async fetchProfiles({ page = 1 }) {
      try {
        const { data, statusText } = await usersAPI.getMembers({ page });

        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.totalPage = data.totalPage;
        this.currentPage = data.currentPage;
        this.users = data.users
          .map(user => {
            if (user.id !== dummyUser.user.id) {
              return {
                ...user,
                consumeCount: user.Orders.length
              };
            } else {
              return {
                ...user,
                consumeCount: user.Orders.length,
                isSelf: true
              };
            }
          })
          .sort((a, b) => Number(a.id) - Number(b.id));
      } catch (error) {
        this.$swal({
          type: "error",
          title: "無法取得資料，請稍後再試"
        });
      }
    },
    async deleteUser(userId) {
      try {
        const { data, statusText } = await usersAPI.deleteUser({
          userId
        });

        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }

        this.user = this.user.filter(user => user.id !== userId);
      } catch (error) {
        this.$swal({
          type: "error",
          title: "無法將使用者移除，請稍後再試"
        });
      }
    },
    async toggleIsAdmin(userId) {
      try {
        const { data, statusText } = await usersAPI.deleteUser({
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
              isAdmin: !user.isAdmin
            };
          }
        });
      } catch (error) {
        this.$swal({
          type: "error",
          title: "無法切換使用者權限，請稍後再試"
        });
      }
    }
  }
};
</script>