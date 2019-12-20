<template>
  <div class="container">
    <div class="row mt-2">
      <div class="col-auto mr-auto px-0">
        <button>推薦區</button>
        <button>菜單區</button>
      </div>
      <div>
        <p class="d-inline-block m-0">User name</p>
        <form class="d-inline-block">
          <input type="search" placeholder="09xxxxxxxx" aria-label="Search" />
        </form>
      </div>
    </div>
    <ul class="nav nav-pills my-4">
      <li v-for="category in categories" :key="category.id" class="nav-item">
        <router-link class="nav-link" :to="{}">{{ category.name }}</router-link>
      </li>
    </ul>
    <div class="row border border-warning meal">
      <div class="col-lg-4 col-xl-3 dish border border-dark">
        <h5>菜名</h5>
        <div class="row">
          <div class="col-auto mr-auto px-0">
            <span>價格：180</span>
          </div>
          <button class="btn btn-primary">說明</button>
        </div>
      </div>
      <div class="col-lg-4 col-xl-3 dish border border-dark">
        <h5>菜名</h5>
        <div class="row">
          <div class="col-auto mr-auto px-0">
            <span>價格：180</span>
          </div>
          <button class="btn btn-primary">說明</button>
        </div>
      </div>
      <div class="col-lg-4 col-xl-3 dish border border-dark">
        <h5>菜名</h5>
        <div class="row">
          <div class="col-auto mr-auto px-0">
            <span>價格：180</span>
          </div>
          <button class="btn btn-primary">說明</button>
        </div>
      </div>
      <div class="col-lg-4 col-xl-3 dish border border-dark">
        <h5>菜名</h5>
        <div class="row">
          <div class="col-auto mr-auto px-0">
            <span>價格：180</span>
          </div>
          <button class="btn btn-primary">說明</button>
        </div>
      </div>
      <div class="col-lg-4 col-xl-3 dish border border-dark">
        <h5>菜名</h5>
        <div class="row">
          <div class="col-auto mr-auto px-0">
            <span>價格：180</span>
          </div>
          <button class="btn btn-primary">說明</button>
        </div>
      </div>
      <div class="col-lg-4 col-xl-3 dish border border-dark">
        <h5>菜名</h5>
        <div class="row">
          <div class="col-auto mr-auto px-0">
            <span>價格：180</span>
          </div>
          <button class="btn btn-primary">說明</button>
        </div>
      </div>
      <div class="col-lg-4 col-xl-3 dish border border-dark">
        <h5>菜名</h5>
        <div class="row">
          <div class="col-auto mr-auto px-0">
            <span>價格：180</span>
          </div>
          <button class="btn btn-primary">說明</button>
        </div>
      </div>
      <div class="col-lg-4 col-xl-3 dish border border-dark">
        <h5>菜名</h5>
        <div class="row">
          <div class="col-auto mr-auto px-0">
            <span>價格：180</span>
          </div>
          <button class="btn btn-primary">說明</button>
        </div>
      </div>
      <div class="col-lg-4 col-xl-3 dish border border-dark">
        <h5>菜名</h5>
        <div class="row">
          <div class="col-auto mr-auto px-0">
            <span>價格：180</span>
          </div>
          <button class="btn btn-primary">說明</button>
        </div>
      </div>
      <div class="col-lg-4 col-xl-3 dish border border-dark">
        <h5>菜名</h5>
        <div class="row">
          <div class="col-auto mr-auto px-0">
            <span>價格：180</span>
          </div>
          <button class="btn btn-primary">說明</button>
        </div>
      </div>
      <div class="col-lg-4 col-xl-3 dish border border-dark">
        <h5>菜名</h5>
        <div class="row">
          <div class="col-auto mr-auto px-0">
            <span>價格：180</span>
          </div>
          <button class="btn btn-primary">說明</button>
        </div>
      </div>
      <div class="col-lg-4 col-xl-3 dish border border-dark">
        <h5>菜名</h5>
        <div class="row">
          <div class="col-auto mr-auto px-0">
            <span>價格：180</span>
          </div>
          <button class="btn btn-primary">說明</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orderAPI from "./../apis/order";

export default {
  data() {
    return {
      categories: []
    };
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await orderAPI.categories.get();
        // STEP 2：將 response 中的 data 和 statusText 取出
        const { data, statusText } = response;
        // STEP 3：如果 statusText 不是 OK 的話則進入錯誤處理
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        // STEP 4：將從伺服器取得的 data 帶入 Vue 內
        this.categories = data;
      } catch (error) {
        // eslint-disable-next-line
        console.log("error", error);
      }
    }
  }
};
</script>

<style scoped>
.meal {
  height: calc(100vh - 240px);
  overflow: auto;
}
.dish {
  max-height: 100px;
  padding: 15px 15px;
}
.dish h5 {
  margin-bottom: 15px;
}
.dish span {
  vertical-align: middle;
}
</style>