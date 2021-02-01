<template>
  <view class="left-menu">
    <view class="menu">
      <view @click="changeMenu(menu, index)" v-for="(menu, index) in menuList" :key="index" :class="['u-bd-b', {'act': currentIndex === index}]">
        {{ menu.value }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'LeftMenu',
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

<style lang="less" scoped>
  .left-menu {
    margin-left: 12rpx;
    .menu {
      width: 200rpx;
      box-shadow: 1px 0px 6px #eaeaed;
      background-color:#fff;
      view {
        height: 90rpx;
        line-height: 90rpx;
        text-align: center;
        color: #666;
        &.act {
          font-size: 32rpx;
          background-color:#8ba3e5;
          color:#fff;
        }
      }
    }
  }
</style>
