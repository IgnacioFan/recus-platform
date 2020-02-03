<template>
  <div>
    <table class="table table-striped m-0 table-bordered">
      <thead class="thead-dark">
        <tr>
          <th class="text-center" scope="col">#</th>
          <th width="60%" scope="col">名稱</th>
          <th class="text-center" scope="col">數量</th>
          <th class="text-center" scope="col">百分比</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="category in this.initialCategory"
          :key="category.id"
          @click.stop.prevent="fetchData(category.id)"
        >
          <td class="text-center">{{ category.indexId }}</td>
          <td width="60%">
            <div class="category-name">{{ category.name }}</div>
          </td>
          <td class="text-center">
            <div class="category-count">{{ category.count }}</div>
          </td>
          <td class="text-center">
            <div class="category-count">{{ Math.floor(category.count*100/total) }}%</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "AdminDashBoardTable",
  props: {
    initialCategory: {
      type: Array
    },
    initialType: {
      type: String,
      default: ""
    },
    initialIsProcessing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      categories: this.initialCategory
    };
  },
  computed: {
    total: function() {
      let add = 0;
      this.initialCategory.map(item => {
        add += item.count;
      });
      return add;
    }
  },
  methods: {
    fetchData(categoryId) {
      if (this.initialIsProcessing) {
        return;
      } else {
        this.$emit("after-fetch-data", {
          type: this.initialType,
          id: categoryId
        });
      }
    }
  },
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
.table tr:hover td {
  background-color: yellow;
}
</style>