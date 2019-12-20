<template>
  <div class="container">
    <div class="row my-2">
      <h5 class="col-auto mr-auto px-0">清單</h5>
      <h5 class="col-auto">總數：5件</h5>
    </div>
    <div class="border border-warning list">
      <div class="dish border border-dark rounded-lg">
        <h5 class="mb-1">菜名</h5>
        <p>LS、NE</p>
        <div class="row">
          <div class="col-auto mr-auto px-0">
            <span>數量：3</span>
          </div>
          <button class="btn btn-primary">刪除</button>
        </div>
      </div>
      <div class="dish border border-dark rounded-lg">
        <h5 class="mb-1">菜名</h5>
        <p>LS、NE</p>
        <div class="row">
          <div class="col-auto mr-auto px-0">
            <span>數量：3</span>
          </div>
          <button class="btn btn-primary">刪除</button>
        </div>
      </div>
      <div class="dish border border-dark rounded-lg">
        <h5 class="mb-1">菜名</h5>
        <p>LS、NE</p>
        <div class="row">
          <div class="col-auto mr-auto px-0">
            <span>數量：3</span>
          </div>
          <button class="btn btn-primary">刪除</button>
        </div>
      </div>
    </div>
    <h5 class="my-2">備註</h5>
    <textarea class="w-100" name="post" id rows="3"></textarea>
    <div class="row my-2">
      <button class="btn btn-primary col py-2">內用</button>
      <button class="btn btn-primary col py-2">外帶</button>
      <button class="btn btn-primary col py-2">新增</button>
    </div>
    <h5 class="text-right">金額：123456元</h5>
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
.list {
  height: calc(100vh - 350px);
  overflow: auto;
}
.dish {
  padding: 15px 15px;
}
.dish h5 {
  margin-bottom: 15px;
}
.dish span {
  line-height: 2.2;
}
</style>