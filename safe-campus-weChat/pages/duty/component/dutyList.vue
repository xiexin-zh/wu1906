<template>
  <view class="duty-list">
    <view class="u-auto">
      <view
        class="u-fx-ac u-mar u-padd-30 u-type-white-bg u-border-radius"
        v-for="day in weekDays"
        :key="day.key"
      >
        <view>
          <u-icon name="calendar" color="#2979ff" size="38"></u-icon
        ></view>
        <view class="u-mar-l">{{ day.value }}</view>
        <view class="u-fx-f1 u-mar-l30 u-mar-r40">
          <u-tag
            @close="delUser(item.id)"
            :closeable="isClose"
            v-for="(item, index) in getData(day.key)"
            :key="index"
            :text="item.userName"
            mode="light"
            type="primary"
          />
        </view>
        <view v-if="isAdd">
          <u-icon
            name="plus"
            color="#2979ff"
            size="38"
            @tap="addUser(day.key)"
          ></u-icon>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    isClose: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Boolean,
      default: false,
    },
    dataList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      weekDays: [
        {
          value: "周一",
          key: 1,
        },
        {
          value: "周二",
          key: 2,
        },
        {
          value: "周三",
          key: 3,
        },
        {
          value: "周四",
          key: 4,
        },
        {
          value: "周五",
          key: 5,
        },
        {
          value: "周六",
          key: 6,
        },
        {
          value: "周日",
          key: 0,
        },
      ],
    };
  },
  methods: {
    getData(day) {
      let index;
      if (day === 0) {
        index = 7;
      }
      return this.dataList.filter((item) => {
        return item.weekDay === day || item.weekDay === index;
      });
    },
    addUser(key) {
      this.$emit("addUser", key);
    },
    delUser(id) {
      if (!this.isAdd) return;
      this.$emit("delUser", id);
    },
  },
};
</script>

<style lang="scss" scoped>
.u-mode-light-primary {
  margin: 5px 0px 5px 5px;
}
</style>
