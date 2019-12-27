<template>
  <ul class="nav nav-pills my-4">
    <li v-for="category in categories" :key="category.id" class="nav-item">
      <router-link
        class="nav-link"
        :to="{ name: 'order', query: { categoryId: category.id } }"
      >{{ category.name }}</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      categories: [
        {id:1,
        name:"尚未製作",
        },
        {id:2,
        name:"製作中",
        },
        {id:3,
        name:"尚未結帳",
        },
        {id:4,
        name:"已結帳的訂單",
        }]
    };
  },
  methods: {
    searchUser() {
      this.$emit("after-search-user", this.userPhone);
    }
  }
};
</script>

<style scoped>

</style>