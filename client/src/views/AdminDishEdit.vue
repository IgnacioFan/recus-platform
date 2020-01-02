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
//import manageAPI from "./../apis/manage";

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