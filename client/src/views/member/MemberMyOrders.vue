<template>
  <div>
    <NavbarTop />
    <h1>Member Panel</h1>
  </div>
</template>

<script>
import NavbarTop from "../../components/navbar/NavbarTop";
import roleMemberAPI from "../../apis/member/order";

export default {
  name: "MemberMyOrders",
  components: {
    NavbarTop
  },
  data() {
    return {};
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await roleMemberAPI.get();
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        // eslint-disable-next-line
        console.log("data", data);
      } catch (error) {
        // eslint-disable-next-line
        console.log("error", error);
      }
    }
  }
};
</script>