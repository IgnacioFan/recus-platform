<template lang="zh-TW">
  <ul class="nav nav-pills my-2 col-4">
    <li v-for="category in categories" :key="category.id" class="nav-item">
      <router-link
        class="nav-link"
        :to="{ name: category.routeName }"
      >{{ category.name }}</router-link>
    </li>
    <li class="nav-item">
      <router-link class="nav-link" :to="{ name: 'admin-dish-new'}">新增菜單</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      categories: [
        { id: 1, name: "菜單", routeName: "manage-dishes" },
        { id: 2, name: "分類", routeName: "manage-categories" },
        { id: 3, name: "標籤", routeName: "manage-tages" }
      ]
    };
  }
};
</script>

<style scoped>
.meal {
  max-height: calc(100vh - 240px);
  overflow: auto;
}
.dish {
  max-height: 100px;
  padding: 15px 15px;
}
.dishName {
  margin-bottom: 15px;
}
.dish span {
  vertical-align: middle;
}
</style>