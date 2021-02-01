<template>
  <div class="total-chart u-fx-ver u-fx-f1">
    <div class="title">{{ title }}</div>
    <div :class="['u-fx-f1', { 'u-fx': justify, ' u-fx-ver': !justify }]">
      <div
        :class="['total-type', {'u-fx-f1 u-fx-ver u-fx-jsa u-fx-ae': justify, 'u-fx-jsa': !justify}]"
      >
        <div class="u-fx-ac-jc" v-for="(item, index) in totalType" :key="index">
          <div class="u-bold">{{ item.total }}</div>
          <div class="u-font-1">{{ item.title }}</div>
        </div>
      </div>
      <div class="u-fx-f3">
        <div class="u-pos-box u-fx u-fx-jc">
          <u-pie
            :id="id"
            :series="dataList"
            plotBorderWidth="4"
            innerSize="20"
            legendColor="#444"
            plotColor="#444"
          ></u-pie>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TotalChart',
  props: {
    justify: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '查寝统计'
    },
    id: {
      type: String,
      default: ''
    },
    totalType: {
      type: Array,
      default: () => {
        return []
      }
    },
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.total-chart {
  padding: 10px;
  .title {
    font-size: 16px;
  }
  .total-type {
    padding: 20px 0;
    & > div:nth-child(2) {
      color: @u-type-primary;
    }
    & > div:nth-child(3) {
      color: @u-type-error;
    }
  }
}
</style>
