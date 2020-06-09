<template>
  <div class="home">
    <div class="navTab">
      <div class="logo">
        <Logo />
      </div>
      <div class="navMenu">
        <Nav :routeName="routeName" />
      </div>
    </div>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import Nav from "../../components/Nav.vue";
import Logo from "../../components/Logo.vue";
import * as DataAction from "../../api/dataAction";
export default {
  data() {
    return {
      routeName: "follow",
    };
  },

  components: {
    Nav,
    Logo
  },
  updated() {
    this.routeName = this.$route.name;
  },
  mounted() {
    this.routeName = this.$route.name;
  }
};
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;

  .navTab {
    width: 200px;
    height: 100%;
    background-color: rgb(54, 71, 89);

    .logo {
      background-color: rgb(54, 71, 89);
      height: 70px;
      border-bottom: 1px solid #ccc;
      box-sizing: border-box;
    }
  }
  .container {
    flex: 1;
  }
}
</style>
