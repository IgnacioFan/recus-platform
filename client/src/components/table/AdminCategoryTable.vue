<template>
  <div class="col-6 px-1">
    <table class="table table-striped m-0 table-bordered">
      <thead class="thead-dark">
        <tr>
          <th width="70%" scope="col">Name</th>
          <th width="10%" scope="col" class="text-center">Used</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
    </table>
    <div class="table-data">
      <table class="table table-striped table-bordered">
        <tbody>
          <tr v-for="category in this.initialCategory" :key="category.id">
            <td width="70%" class="position-relative">
              <div v-show="!category.isEditing" class="category-name">{{ category.name }}</div>
              <input
                v-show="category.isEditing"
                v-model="category.name"
                type="text"
                class="form-control"
              />
              <span v-show="category.isEditing" class="cancel" @click="handleCancel(category.id)">✕</span>
            </td>
            <td width="10%" class="text-center">
              <div>{{ category.used }}</div>
            </td>
            <td class="d-flex justify-content-between">
              <button
                v-show="!category.isEditing"
                type="button"
                class="btn btn-outline-primary"
                @click.stop.prevent="toggleIsEditing(category.id)"
              >Edit</button>
              <button
                v-show="category.isEditing"
                type="button"
                class="btn btn-outline-success"
                @click.stop.prevent="updateCategory({ categoryId: category.id, name: category.name })"
              >Save</button>
              <button
                type="button"
                class="btn btn-outline-danger"
                @click.stop.prevent="deleteCategory(category.id)"
              >Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminCategoryTable",
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
  watch: {
    initialCategory(categories) {
      this.categories = {
        ...this.categories,
        ...categories
      };
    }
  },
  methods: {
    toggleIsEditing(categoryId) {
      this.$emit("after-editing-category", categoryId);
    },
    handleCancel(categoryId) {
      this.$emit("after-cancel-edit-category", categoryId);
    },
    updateCategory({ categoryId, name }) {
      this.$emit("after-update-category", { categoryId, name });
    },
    deleteCategory(categoryId) {
      this.$emit("after-delete-category", categoryId);
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
  height: calc(100vh - 180px);
  overflow-y: auto;
}
</style>