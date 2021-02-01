<template>
  <view class="pad-top">
    <!-- <no-data v-if="dataList.length === 0"></no-data> -->
     <view class="toggle-list u-shadow" v-for="(list, index) in dataList" :key="index" @click="checkList(list, index)">
      <view class="toggle-title u-fx u-fx-ac" @click="toggle(list, index)">
        <view class="u-fx-f1">
          <slot name="title" :list="list"></slot>
        </view>
        <view v-if="isIcon" :class="{'rot-icon': list.toggle}">
          <i class="iconfont iconjiantou icon-list"></i>
        </view>
      </view>
        <view v-if="list.toggle" class="toggle-info u-bd-t">
          <slot name="list" :list="list"></slot>
        </view>
    </view>
    <view class="ht10"></view>
  </view>
</template>

<script>
// import NoData from '@c/common/NoData'
export default {
  name: 'ToggleList',
  components: {
    // NoData
  },
  props: {
    dataList: {
      type: Array,
      default: () => {
        return []
      },
      required: true
    },
    isChoose: {
      type: Boolean,
      default: false
    },
    personNum: {
      type: Boolean,
      default: false
    },
    isToggle: {
      type: Boolean,
      default: true
    },
    isIcon: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    toggle (list, index) {
      console.log('list',list)
      console.log('index',index)
      if (!this.isToggle) return
      if (this.isChoose) return
      if (this.personNum && !list.toggle) {
        this.$emit('get-num', list.userCode)
      }
      this.$emit('refresh')
      if (!this.dataList[index].toggle) {
        this.dataList.forEach(item => {
          item.toggle = false
        })
      }
      this.dataList[index].toggle = !this.dataList[index].toggle
    },
    checkList (list, index) {
      this.$emit('check-list', list)
    }
  }
}
</script>
<style lang="scss">
.pad-top{
  padding-top: 4rpx;
}
  .toggle-list {
    margin: 20rpx 15rpx;
    &:first-child {
      margin-top: 0rpx;
    }
    .rot-icon {
      transform: rotate(90deg);
    }
    line-height: 90rpx;
    .toggle-title {
      padding: 0 20rpx;
      color:#333333;
      i {
        color:#cccccc;
      }
    }
    .toggle-info {
      max-height: 1000rpx;
      overflow: hidden;
      background-color:#fff;
      color:#666;
      p {
        padding-left: 20rpx;
        line-height: 70rpx;
      }
    }
    .toggle-enter, .toggle-leave-to {
      max-height: 0rpx
    }
    .toggle-enter-to {
      max-height: 1000rpx;
    }
    .toggle-enter-active{
      transition: all 1s ease
    }
    .toggle-leave-active {
      transition: all .5s ease
    }
  }
.icon-list{
  font-size: 16rpx;
  color: #666
}
.ht10{
  height: 10rpx;
}
</style>
