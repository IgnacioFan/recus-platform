<template>
  <div class="container py-5">
    <form action="/search" class="my-4">
      <div class="form-row">
        <div class="col-auto">
          <input
            type="text"
            class="form-control"
            name="keyword"
            placeholder="輸入手機電話..."
            v-model="phone"
          />
        </div>
        <div class="col-auto">
          <router-link :to="{name:'memberseach', query:{phone:phone}}">
            <button type="button" class="btn btn-primary">搜尋</button>
          </router-link>
        </div>
      </div>
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
  </div>
</template>

<script>
const dummyData = {
  users: [
    {
      id: 1,
      account: "root",
      phone: "0900",
      password: "12345678",
      name: "root",
      email: "root@example.com",
      image: "",
      isAdmin: true,
      isValid: true,
      createdAt: "2019-11-20T06:25:42.685Z",
      updatedAt: "2019-11-21T09:55:30.970Z",
      Orders: [{ id: 1 }, { id: 2 }, { id: 3 }]
    },
    {
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
    },
    {
      id: 3,
      account: "user2",
      phone: "0902",
      password: "12345678",
      name: "yoshi",
      email: "user2@example.com",
      image: "",
      isAdmin: false,
      isValid: true,
      createdAt: "2019-11-20T06:25:42.685Z",
      updatedAt: "2019-11-21T09:55:30.970Z",
      Orders: [{ id: 1 }, { id: 2 }, { id: 3 }]
    }
  ],
  currentPage: 1,
  totalPage: 3
};
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
  components: {},
  data() {
    return {
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
    this.fetchProfiles();
  },
  methods: {
    fetchProfiles() {
      (this.totalPage = dummyData.totalPage),
        (this.currentPage = dummyData.currentPage),
        (this.users = dummyData.users
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
          .sort((a, b) => Number(a.id) - Number(b.id)));

      this.users = dummyData.users.map(user => ({
        ...user,
        consumeCount: user.Orders.length
      }));
    },
    deleteUser(userId) {
      this.user = this.user.filter(user => user.id !== userId);
    },
    toggleIsAdmin(userId) {
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
    }
  }
};
</script>