<template>
  <table class="table table-striped table-bordered table-hover">
    <thead class="thead-dark">
      <tr>
        <th>Name</th>
        <th>手機</th>
        <th>消費次數</th>
        <th>刪除</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <th>
          <router-link :to="{path:'/users', params:{id:user.id}}">{{ user.account }}</router-link>
        </th>
        <td>
          <div class="user-name">{{ user.phone }}</div>
        </td>
        <td>
          <div class="user-name">{{ user.consumeCount }}</div>
        </td>
        <td>
          <button type="button" class="btn btn-warning" @click.stop.prevent="deleteUser(user.id)">X</button>
        </td>
        <td>
          <button
            v-if="!user.isSelf"
            type="button"
            class="btn btn-danger"
            @click.stop.prevent="toggleIsAdmin(user.id)"
          >
            <template v-if="user.isAdmin">管理員</template>
            <template v-else>使用者</template>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import usersAPI from "./../apis/users";

export default {
  props: {
    initialUsers: {
      type: Array
    }
  },
  data() {
    return {
      users: this.initialUsers
    };
  },
  methods: {
    async deleteUser(userId) {
      try {
        const { data, statusText } = await usersAPI.deleteUser({
          userId
        });

        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        // eslint-disable-next-line
        console.log("data", data);
        this.users = this.users.filter(user => user.id !== userId);
      } catch (error) {
        // eslint-disable-next-line
        console.log("error", error);
        this.$swal({
          type: "error",
          title: "無法將使用者移除，請稍後再試"
        });
      }
    },
    async toggleIsAdmin(userId) {
      try {
        const { data, statusText } = await usersAPI.toggleAdmin({
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
        // eslint-disable-next-line
        console.log("error", error);
        this.$swal({
          type: "error",
          title: "無法切換使用者權限，請稍後再試"
        });
      }
    }
  },
  watch: {
    initialUsers(users) {
      this.users = {};
      this.users = {
        ...this.users,
        ...users
      };
    }
  }
};
</script>