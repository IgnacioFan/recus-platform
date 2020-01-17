<template>
  <div class="icon-bg vh-100">
    <NavbarTop :initial-title="title" />
    <div class="row pb-6">
      <router-link
        v-for="kind in kinds"
        :key="kind.name"
        class="icon-bg col-4 col-md-3 col-lg-2 pb-2 align-self-center text-center"
        :to="{name: 'admin-order-category', params:{categoryId: kind.id}}"
      >
        <img
          class="icon py-3 px-2"
          :src="require('../../assets/icon/'+`${kind.icon}`)"
          :alt="kind.name"
        />
        <span class="font-weight-bold">{{kind.name}}</span>
      </router-link>
    </div>

    <NavbarBottm />
  </div>
</template>

<script>
import NavbarTop from "../../components/navbar/NavbarTop";
import NavbarBottm from "../../components/navbar/NavbarBottm";

export default {
  components: {
    NavbarTop,
    NavbarBottm
  },
  data() {
    return {
      title: "點餐目錄",
      kinds: [
        {
          id: 101,
          name: "熱門商品",
          icon: "Fire.png",
          urlname: "admin-order-index"
        },
        {
          id: 102,
          name: "老饕最愛",
          icon: "Heart.png",
          urlname: "admin-order-index"
        },
        {
          id: 103,
          name: "老闆推薦",
          icon: "Star.png",
          urlname: "admin-order-index"
        },
        {
          id: 1,
          name: "New",
          icon: "Dish.png",
          urlname: "admin-order-index"
        },
        {
          id: 2,
          name: "氣泡飲",
          icon: "Ice-drink.png",
          urlname: "admin-order-index"
        },
        {
          id: 3,
          name: "義式咖啡",
          icon: "Cup.png",
          urlname: "admin-order-index"
        },
        {
          id: 4,
          name: "單品手沖",
          icon: "Teapot.png",
          urlname: "admin-order-index"
        },
        {
          id: 5,
          name: "冷萃咖啡",
          icon: "Ice-drip-cafe.png",
          urlname: "admin-order-index"
        },
        {
          id: 6,
          name: "茶品",
          icon: "Tea-cup.png",
          urlname: "admin-order-index"
        },

        {
          id: 7,
          name: "手做甜點",
          icon: "Cake.png",
          urlname: "admin-order-index"
        },
        {
          id: 8,
          name: "薄餅",
          icon: "Cookie.png",
          urlname: "admin-order-index"
        },
        {
          id: 9,
          name: "比薩",
          icon: "Pizza.png",
          urlname: "admin-order-index"
        }
      ]
    };
  }
};
</script>

<style scoped>
.icon-bg {
  background-color: lightblue;
}
.icon {
  width: 100%;
  max-width: 200px;
}
.pb-6 {
  padding-bottom: 60px;
}
</style>

