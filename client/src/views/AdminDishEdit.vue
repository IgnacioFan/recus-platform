<template>
  <div class="container">
    <AdminDishForm
      :initial-dish="dish"
      :is-processing="isProcessing"
      @after-submit="handleAfterSubmit"
    />
  </div>
</template>

<script>
import AdminDishForm from "./../components/AdminDishForm";
import adminDishAPI from "./../apis/admin/dish";

export default {
  components: {
    AdminDishForm
  },
  data() {
    return {
      dish: {},
      isProcessing: false
    };
  },
  computed: {},
  created() {
    this.fetchDish();
  },
  methods: {
    async fetchDish() {
      try {
        const { data, statusText } = await adminDishAPI.dish.get(
          this.$route.params.id
        );
        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        // this.dish = data.dish;
        this.dish = {
          ...this.dish,
          ...data.dish
        };
        // eslint-disable-next-line
        console.log("data", data);
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
    },
    async handleAfterSubmit(formData) {
      try {
        this.isProcessing = true;
        const { data, statusText } = await adminDishAPI.dish.post(formData);
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