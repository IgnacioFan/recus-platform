<template>
  <div>
    <NavbarTop :initial-title="title" />

    <div class="row my-lg-4 my-xl-3">
      <form class="form-inline my-2 my-lg-0 d-inline-block col-4" action="/search">
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

      <div class="d-inline-block col-4 d-flex justify-content-center">
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

    <div class="row">
      <div class="col">
        <MemberTable :initial-users="leftTableUsers" />
      </div>
      <div class="col">
        <MemberTable :initial-users="rightTableUsers" />
      </div>
    </div>

    <NavbarBottm />
  </div>
</template>

<script>
import NavbarTop from "./../components/NavbarTop";
import NavbarBottm from "./../components/NavbarBottm";
import MemberTable from "./../components/MemberTable";
import usersAPI from "./../apis/users";

const dummyUser = {
  user: {
    id: 1,
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
    NavbarBottm,
    MemberTable
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
    },
    leftTableUsers: function() {
      return this.users.slice(0, 7);
    },
    rightTableUsers: function() {
      return this.users.slice(7, 14);
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
        // eslint-disable-next-line
        console.log("error", error);
      }
    }
  }
};
</script>