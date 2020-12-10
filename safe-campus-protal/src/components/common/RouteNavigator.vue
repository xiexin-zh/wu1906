<template>
  <div class="router-menu">
    <ul class="address-list">
      <li
        @click="backCom"
        v-if="routeAddress.length > 1"
        style="cursor: pointer; padding-right: 8px"
      >
        <a-icon style="font-size: 12px; padding-right: 2px" type="left" />返回
      </li>
      <li style="padding-right: 8px">|</li>
      <li @click="changeRoute(item)" v-for="(item, index) in routeAddress" :key="index">
        <span :class="{'act': index < routeAddress.length - 1}">{{ item.title }}</span>
        <span v-if="index < routeAddress.length - 1" style="padding: 0 5px">/</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'RouteNavigator',
  data() {
    return {
      routeAddress: sessionStorage.getItem('routeAddress') ? JSON.parse(sessionStorage.getItem('routeAddress')) : []
    }
  },
  watch: {
    $route: {
      handler(to) {
        const route = {
          path: to.fullPath,
          title: to.meta.title
        }
        if (!to.path.lastIndexOf('/')) {
          this.routeAddress = [route]
          window.sessionStorage.setItem('routeAddress', JSON.stringify(this.routeAddress))
        }
        // 跳转的path是否存在
        const _index = this.routeAddress.findIndex(item => {
          return item.path === route.path
        })
        if (_index === -1) {
          this.routeAddress.push(route)
          window.sessionStorage.setItem('routeAddress', JSON.stringify(this.routeAddress))
        } else {
          this.routeAddress.splice(_index + 1)
          window.sessionStorage.setItem('routeAddress', JSON.stringify(this.routeAddress))
        }
      },
      immediate: true
    }
  },
  methods: {
    backCom() {
      const item = this.routeAddress[this.routeAddress.length - 2]
      this.$router.push({
        path: item.path,
        query: item.query
      })
    },
    changeRoute(item) {
      this.$router.push(item.path)
    }
  }
}
</script>

<style lang="less" scoped>
.router-menu {
  background-color: #fff;
  padding: 0 5px;
  margin: 8px 0 10px 0;
  ul {
    margin-bottom: 0px;
    list-style: none;
  }
  .line {
    font-weight: bold;
  }
}
.address-list {
  height: 38px;
  padding-left: 0px;
  li {
    float: left;
    height: 38px;
    line-height: 38px;
    font-size: 14px;
    .act {
      color: @main-color;
      cursor: pointer;
    }
  }
}
</style>
