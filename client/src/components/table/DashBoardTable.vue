<template>
  <div>
    <table class="table table-striped m-0 table-bordered">
      <thead class="thead-dark">
        <tr>
          <th class="text-center" scope="col">#</th>
          <th width="80%" scope="col">Name</th>
          <th class="text-center" scope="col">Count</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in this.initialCategory" :key="category.id">
          <td class="text-center">{{ category.id }}</td>
          <td width="80%">
            <div class="category-name">{{ category.name }}</div>
          </td>
          <td class="text-center">
            <div class="category-count">{{ category.count }}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    initialCategory: {
      type: Array
    }
  },
  data() {
    return {
      categories: this.initialCategory
    };
  },
  methods: {},
  watch: {
    initialCategory(categories) {
      this.categories = {
        ...this.categories,
        ...categories
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