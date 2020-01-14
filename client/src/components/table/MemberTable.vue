<template>
  <table class="table table-striped table-bordered table-hover">
    <thead class="thead-dark text-center">
      <tr>
        <th>名稱</th>
        <th>手機</th>
        <th>消費次數</th>
        <th>刪除</th>
        <th>權限</th>
      </tr>
    </thead>
    <tbody class="text-center">
      <tr v-for="user in users" :key="user.id">
        <th>
          <router-link
            class="text-capitalize"
            v-if="user.Profile"
            :to="{path:'/users', params:{id:user.id}}"
          >{{ user.Profile.name }}</router-link>
          <router-link v-else :to="{path:'/users', params:{id:user.id}}">{{ "User" }}</router-link>
        </th>
        <td height="50px">
          <div class="user-name">{{ user.phone }}</div>
        </td>
        <td>
          <div class="user-name">{{ user.consumeCount }}</div>
        </td>
        <td>
          <button
            v-if="user.id !== currentUser"
            type="button"
            class="btn btn-warning"
            @click.stop.prevent="deleteUser(user.id)"
          >Delete</button>
        </td>
        <td>
          <button
            v-if="user.id !== currentUser"
            type="button"
            class="btn btn-danger text-capitalize"
            @click.stop.prevent="toggleIsAdmin(user.id)"
          >{{ user.role }}</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    initialUsers: {
      type: Array
    }
  },
  data() {
    return {
      users: this.initialUsers,
      currentUser: this.$store.state.currentUser.id
    };
  },
  methods: {
    deleteUser(userId) {
      this.$emit("after-delete-user", userId);
    },
    toggleIsAdmin(userId) {
      this.$emit("after-toggle-is-admin", userId);
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

<style scoped>
.form-control {
  display: inline-block;
  max-width: 80%;
  margin-right: 10px;
}
.table td,
.table th {
  padding: 0.4rem;
  vertical-align: middle;
}
</style>