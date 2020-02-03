<template>
  <div
    :id="`collapse${initialDishes.name}`"
    class="collapse"
    :aria-labelledby="`heading${initialDishes.name}`"
    data-parent="#accordionCategory"
  >
    <div class="card-body">
      <!-- ////// -->
      <div id="accordionDish">
        <div class="card" v-for="dish in initialDishes.dishes" :key="dish.id">
          <div class="card-header" :id="`heading${dish.name}`">
            <button
              class="btn btn-link collapsed w-100"
              style="position:relative;text-align: left;"
              data-toggle="collapse"
              :data-target="`#collapse${dish.name}`"
              aria-expanded="true"
              :aria-controls="`collapse${dish.name}`"
            >
              <h5 class="d-inline-block">{{dish.name}}</h5>
              <button
                class="btn btn-primary ml-auto"
                @click.stop.prevent="addOrder(dish.id, dish.name, dish.price)"
                style="position:absolute;top: 0;right: 0;"
              >加入訂單</button>
            </button>
          </div>

          <div
            :id="`collapse${dish.name}`"
            class="collapse"
            :aria-labelledby="`heading${dish.name}`"
            data-parent="#accordionDish"
          >
            <div class="card-body p-0">
              <img :src="dish.image" style="width:100%;height:150px;" />
              <p>
                ${{dish.price}}
                <span
                  class="badge badge-pill badge-primary"
                  v-for="tag in dish.hasTags"
                  :key="tag.id"
                >{{tag.name}}</span>
              </p>
              <div>{{dish.description}}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ////// -->
    </div>
  </div>
</template>

<script>
export default {
  name: "AccordionMealTable",
  props: {
    initialDishes: {
      type: Object
    }
  },
  data() {
    return {
      isLoading: false,
      isProcessing: false
    };
  },
  computed: {
    dishes: function() {
      return this.initialDishes.slice(0, -1);
    }
  },
  created() {
    this.fetchOrder();
  },
  methods: {
    fetchOrder() {
      if (localStorage.getItem("orderList")) {
        this.orderList = JSON.parse(localStorage.getItem("orderList"));
      } else {
        localStorage.setItem("orderList", JSON.stringify([]));
      }
    },
    addOrder(dishId, dishName, dishPrice) {
      this.$swal
        .fire({
          title: "<h1>請選擇數量</h1>",
          icon: "info",
          input: "number",
          html: "",
          showCloseButton: true,
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText: '<i class="fa fa-thumbs-up"></i> 確認',
          cancelButtonText: '<i class="fa fa-thumbs-down"></i> 返回'
        })
        .then(result => {
          if (+result.value > 0) {
            if (localStorage.getItem("orderList") === `[]`) {
              this.orderList.push({
                id: dishId,
                name: dishName,
                price: dishPrice,
                quantity: +result.value
              });
            } else {
              if (this.orderList.find(dish => dish.name === dishName)) {
                this.orderList.find(
                  dish => dish.name === dishName
                ).quantity += +result.value;
              } else {
                this.orderList.push({
                  id: dishId,
                  name: dishName,
                  price: dishPrice,
                  quantity: +result.value
                });
              }
            }

            localStorage.setItem("orderList", JSON.stringify(this.orderList));
            this.$swal({
              toast: true,
              position: "top",
              showConfirmButton: false,
              timer: 3000,
              icon: "success",
              title: "成功新增餐點",
              text: ""
            });
          } else {
            this.$swal({
              toast: true,
              position: "top",
              showConfirmButton: false,
              timer: 3000,
              icon: "warning",
              title: "未新增餐點",
              text: ""
            });
          }
        });
    }
  }
};
</script>

<style scoped>
</style>