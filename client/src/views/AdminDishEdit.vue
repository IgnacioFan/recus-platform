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

export default {
  components: {
    AdminDishForm
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
      isProcessing: false
    };
  },
  computed: {},
  created() {},
  methods: {}
};
</script>