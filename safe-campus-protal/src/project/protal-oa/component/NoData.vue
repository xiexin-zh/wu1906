<template>
  <div class="no-data">
    <img :src="img" alt="" />
    <p>{{ msg }}</p>
    <slot name="btn"></slot>
  </div>
</template>

<script>
import autoImg from './no_data.png'
export default {
  name: 'NoData',
  props: {
    msg: {
      type: String,
      default: '暂无数据'
    },
    img: {
      type: String,
      default: autoImg
    }
  }
}
</script>

<style lang="less" scoped>
.no-data {
  width: 100px;
  padding: 50px 0;
  margin: 0 auto;
  text-align: center;
  img {
    width: 100px;
    height: 100px;
    display: block;
  }
  p {
    padding-top: 15px;
    color: #999;
  }
}
</style>
