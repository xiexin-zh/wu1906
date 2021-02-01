<template>
  <view class="top-menu">
    <view class="u-fx menu-list u-shadow">
      <view @click="changeMenu(menu, index)" v-for="(menu, index) in menuList" :key="index" :class="['u-fx-f1', {'act': currentIndex === index, 'u-bd-r': index !== menuList.length - 1 }]">
        {{ menu.value.replace('小学', '').replace('初中', '').replace('高中', '') }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TopMenu',
  props: {
    menuList: {
      type: Array,
      default: () => {
        return []
      },
      required: true
    }
  },
  data () {
    return {
      currentIndex: 0
    }
  },
  methods: {
    changeMenu (menu, index) {
      this.currentIndex = index
      this.$emit('change-menu', menu)
    }
  }
}
</script>

<style lang="scss" scoped>
  .top-menu {
    .menu-list {
      margin: 15rpx 15rpx 0 25rpx;
      color:#333;
      height: 80rpx;
      border-radius: 8rpx;
      overflow: hidden;
      view {
        text-align: center;
        line-height: 80rpx;
        border-right: 1rpx $u-border-color solid
      }
      .act {
        background-color: $u-type-primary;
        color:#fff;
      }
    }
  }
</style>
