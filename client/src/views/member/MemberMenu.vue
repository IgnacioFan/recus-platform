<template>
  <div>
    <h2 class="text-center mb-3">點餐</h2>
    <Spinner v-if="isLoading" />
    <div v-else id="accordionCategory">
      <div class="card" v-for="dish in menu" :key="dish.id">
        <div class="card-header p-0" :id="`heading${dish.name}`">
          <button
            class="btn btn-link collapsed w-100 py-3"
            data-toggle="collapse"
            :data-target="`#collapse${dish.name}`"
            aria-expanded="true"
            :aria-controls="`collapse${dish.name}`"
          >
            <h3>{{dish.name}}</h3>
          </button>
        </div>

        <AccordionMealTable :initial-dishes="dish" />
      </div>
    </div>
    <MemberNavbarBottom />
  </div>
</template>

<script>
import Spinner from "@/components/Spinner/Spinner";
import MemberNavbarBottom from "@/components/Navbar/MemberNavbarBottom";
import AccordionMealTable from "@/components/Table/AccordionMealTable";
import memberDishAPI from "@/apis/member/dish";

export default {
  name: "MemberMenu",
  components: {
    Spinner,
    AccordionMealTable,
    MemberNavbarBottom
  },
  data() {
    return {
      menu: [],
      isLoading: true
    };
  },
  created() {
    this.fetchDishes();
  },
  methods: {
    async fetchDishes() {
      try {
        const response = await memberDishAPI.get();
        const { data, statusText } = response;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        for (const key in data.menu) {
          this.menu.push({
            name: data.menu[key].name,
            dishes: delete data.menu[key]["name"] ? data.menu[key] : []
          });
        }
        for (const e in this.menu) {
          for (const k in this.menu[e].dishes) {
            this.menu[e].dishes[k].id = k;
          }
        }
        this.isLoading = false;
      } catch (error) {
        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          icon: "warning",
          title: "無法取得餐點",
          text: ""
        });
        this.isLoading = false;
        // eslint-disable-next-line
        console.log("error", error);
      }
    }
  }
};
</script>