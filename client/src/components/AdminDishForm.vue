<template>
  <div class>
    <h1 class="text-center my-2">新增菜單</h1>
    <form class="row" v-show="!isLoading" @submit.stop.prevent="handleSubmit">
      <div class="form-group col-6">
        <label for="name">餐點名稱</label>
        <input
          id="name"
          v-model="dish.name"
          type="text"
          class="form-control"
          name="name"
          placeholder="Enter name"
          required
        />
      </div>

      <div class="form-group col-6">
        <label for="categoryId">類型</label>
        <select
          id="categoryId"
          v-model="dish.CategoryId"
          class="form-control"
          name="categoryId"
          required
        >
          <option value selected disabled>--請選擇--</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >{{ category.name }}</option>
        </select>
      </div>

      <div class="form-check form-check-inline" v-for="tag in allTags" :key="tag.id">
        <input
          class="form-check-input"
          type="checkbox"
          :id="tag.id"
          v-model="dish.tags"
          :value="tag.id"
        />
        <label class="form-check-label" :for="tag.id">{{ tag.name }}</label>
      </div>

      <div class="form-group col-6">
        <label for="price">價格</label>
        <input id="price" v-model="dish.price" type="number" class="form-control" name="price" />
      </div>

      <div class="form-group col-6">
        <label for="description">說明</label>
        <textarea
          id="description"
          v-model="dish.description"
          class="form-control"
          rows="3"
          name="description"
        />
      </div>

      <div class="form-group col-6">
        <label for="image">相片</label>
        <img
          v-if="dish.image"
          :src="dish.image"
          class="d-block img-thumbnail mb-3"
          width="200"
          height="200"
        />

        <input
          id="image"
          type="file"
          name="image"
          accept="image/*"
          class="form-control-file"
          @change="handleFileChange"
        />
      </div>

      <button
        type="submit"
        class="btn btn-primary col-6"
        :disabled="isProcessing"
      >{{ this.isProcessing ? "處理中..." : "送出" }}</button>
    </form>
  </div>
</template>

<script>
import orderAPI from "./../apis/order";
import manageAPI from "./../apis/manage";

export default {
  props: {
    initialDish: {
      type: Object,
      default: () => ({
        name: "",
        CategoryId: "",
        price: "",
        tags: [],
        description: "",
        image: ""
      })
    },
    isProcessing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dish: {
        name: "",
        CategoryId: "",
        price: "",
        tags: [],
        description: "",
        image: ""
      },
      categories: [],
      allTags: [],
      isLoading: true
    };
  },
  computed: {},
  created() {
    this.fetchCategories();
    this.fetchTags();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await orderAPI.categories.get();
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.categories = data;
        this.isLoading = false;
      } catch (error) {
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    async fetchTags() {
      try {
        const response = await manageAPI.tag.get();
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.allTags = data;
      } catch (error) {
        // eslint-disable-next-line
        console.log("error", error);
      }
    },
    handleFileChange(e) {
      const files = e.target.files;
      if (!files.length) return; // 如果沒有檔案則離開此函式
      // 否則產生預覽圖...
      const imageURL = window.URL.createObjectURL(files[0]);
      this.dish.image = imageURL;
    },
    handleSubmit() {
      if (!this.dish.name) {
        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          type: "warning",
          title: "請填寫餐點名稱",
          text: ""
        });
        return;
      } else if (!this.dish.CategoryId) {
        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          type: "warning",
          title: "請選擇餐點類別",
          text: ""
        });
        return;
      }

      this.$emit("after-submit", this.dish);
    }
  }
};
</script>