<template>
  <div class="container h-100">
    <AdminDishForm
      :dish-title="title"
      :is-processing="isProcessing"
      @after-submit="handleAfterSubmit"
    />
  </div>
</template>

<script>
import AdminDishForm from "../../components/form/AdminDishForm";
import adminDishAPI from "../../apis/admin/dish";

export default {
  name: "AdminDishEdit",
  components: {
    AdminDishForm
  },
  data() {
    return {
      title: "編輯菜單",
      isProcessing: false
    };
  },
  computed: {},
  created() {},
  methods: {
    async handleAfterSubmit(formData) {
      try {
        this.isProcessing = true;
        const { data, statusText } = await adminDishAPI.dish.put({
          dishId: this.$route.params.id,
          formData
        });
        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }

        this.$router.push({
          name: "admin-manage-meal",
          query: { categoryId: formData.CategoryId }
        });
        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          type: "success",
          title: "成功建立菜單",
          text: ""
        });
      } catch (error) {
        this.isProcessing = false;
        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          type: "warning",
          title: "建立菜單失敗，請稍後再試",
          text: ""
        });
        // eslint-disable-next-line
        console.log("error", error);
      }
    }
  }
};
</script>