<template>
  <div>
    <NavbarTop />
    <div class="row" style="height:100%;">
      <div class="col-8 border border-dark p-0" style="height:calc(100vh - 107px);">
        <Meal />
      </div>
      <div class="col-4 border border-dark p-0" style="height:calc(100vh - 107px);">
        <List />
      </div>
    </div>
    <NavbarBottm />
  </div>
</template>

<script>
import NavbarTop from "./../components/NavbarTop";
import NavbarBottm from "./../components/NavbarBottm";
import Meal from "./../components/Meal";
import List from "./../components/List";

export default {
  components: {
    NavbarTop,
    NavbarBottm,
    Meal,
    List
  }
};
</script>