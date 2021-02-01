<template>
  <view class="duty-list u-fx-wp">
    <view
      class="u-fx u-mar-b20"
      v-for="day in weekDays"
      :key="day.key"
    >
    <view 
      class="u-mar-l u-fx-ac-jc u-font-02 item" 
      @click="check(day)"
      :class="day.active?'active':''">{{ day.value }}</view>
    </view>
  </view>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    code: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      weekDays: [
        {
          value: "周一",
          active:false,
          key: 1,
        },
        {
          value: "周二",
          active:false,
          key: 2,
        },
        {
          value: "周三",
          active:false,
          key: 3,
        },
        {
          value: "周四",
          active:false,
          key: 4,
        },
        {
          value: "周五",
          active:false,
          key: 5,
        },
        {
          value: "周六",
          active:false,
          key: 6,
        },
        {
          value: "周日",
          active:false,
          key: 7,
        },
      ],
    };
  },
  methods: {
    check(item){
      if(this.code) return
      item.active = !item.active
      let checkObj = this.weekDays.filter(v=>v.active)
      this.$emit('change',checkObj)
    },
  },
};
</script>
<style lang="scss" scoped>
.duty-list {
  .item {
    width: 98rpx;
    height: 44rpx;
    background: #F2F2F2;
    border-radius: 22rpx;
  }
  .active {
    background: #0084FF;
    color: #fff;
  }
}
.u-mode-light-primary {
  margin: 5px 0px 5px 5px;
}
</style>
