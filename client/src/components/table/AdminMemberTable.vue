<template>
  <div>
    <table class="table table-striped table-bordered table-hover mb-0">
      <thead class="thead-dark text-center">
        <tr>
          <th width="20%">名稱</th>
          <th>手機</th>
          <th width="20%">消費次數</th>
          <th width="20%">權限</th>
          <th width="15%">驗證</th>
        </tr>
      </thead>
    </table>
    <div class="table-data">
      <table class="table table-striped table-bordered">
        <tbody class="text-center">
          <tr v-for="user in users" :key="user.id">
            <th width="20%">
              <p
                class="text-capitalize text-primary"
                style="cursor: pointer;"
                @click.stop.prevent="showProfile(user.phone)"
              >{{ user.Profile.name }}</p>
            </th>
            <td height="50px">
              <div class="user-name">{{ user.phone }}</div>
            </td>
            <td width="20%">
              <div class="user-name">{{ user.consumeCount || 0 }}</div>
            </td>
            <td width="20%">
              <button
                v-if="user.Profile.name !== currentUser"
                type="button"
                class="btn btn-warning text-capitalize"
                @click.stop.prevent="toggleIsAdmin(user.id)"
              >{{ user.role }}</button>
            </td>
            <td width="15%">
              <button
                v-if="user.Profile.name !== currentUser || !user.isValid"
                type="button"
                class="btn btn-danger"
                @click.stop.prevent="validCheck(user.id)"
              >{{ user.isValid ? "取消" : "同意" }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminMemberTable",
  props: {
    initialUsers: {
      type: Array
    }
  },
  data() {
    return {
      users: this.initialUsers,
      currentUser: this.$store.state.currentUser.name
    };
  },
  methods: {
    validCheck(userId) {
      this.$emit("after-valid-user", userId);
    },
    toggleIsAdmin(userId) {
      this.$emit("after-toggle-is-admin", userId);
    },
    showProfile(userPhone) {
      this.$emit("after-show-profile", userPhone);
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
.table-data {
  max-height: calc(100vh - 180px);
  overflow-y: auto;
}
</style>