<template>
  <div class="detail-show">
    <div class="title">{{ title }}</div>
    <a-row>
      <a-col
        v-for="(item, index) in detailInfo"
        :key="index"
        class="detail-row"
        :span="12"
      >{{ item.key }}: <span>{{ item.val }}</span></a-col
      >
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'DetailShow',
  props: {
    detailInfo: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: '基本信息'
    }
  }
}
</script>

<style lang="less" scoped>
.detail-show {
  background-color: #fff;
  margin-bottom: 10px;
  .title {
    font-size: 18px;
    color: @u-main-color;
    padding: 10px;
  }
  .detail-row {
    padding: 10px;
    span {
      padding-left: 20px;
    }
  }
}
</style>
