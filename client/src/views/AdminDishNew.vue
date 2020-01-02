<template>
  <div class="container">
    <AdminDishForm :is-processing="isProcessing" @after-submit="handleAfterSubmit" />
  </div>
</template>

<script>
import AdminDishForm from "./../components/AdminDishForm";
import manageAPI from "./../apis/manage";

export default {
  components: {
    AdminDishForm
  },
  data() {
    return {
      isProcessing: false
    };
  },
  computed: {},
  created() {},
  methods: {
    async handleAfterSubmit(formData) {
      try {
        this.isProcessing = true;
        const { data, statusText } = await manageAPI.dish.post(formData);
        if (statusText !== "OK" || data.status !== "success") {
          throw new Error(statusText);
        }

        this.$router.push({
          name: "manage-dishes",
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