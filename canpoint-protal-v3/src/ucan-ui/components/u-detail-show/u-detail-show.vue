<template>
  <div class="u-detail-show">
    <div class="title">{{ title }}</div>
    <div class="u-auto u-bd-t">
      <div
        :style="{ width: 100 / number + '%' }"
        class="info-detail u-fx-ac"
        v-for="(val, key, index) in detailInfo"
        :key="index"
      >
        <div class="info-w">{{ key }}:</div>
        <div class="u-fx-f1">
          <span v-if="!isImg(val)">{{ val }}</span>
          <a-popover placement="left">
            <template slot="content">
              <img
                :src="(val + '').replace('img=', '')"
                style="max-width: 400px; max-height: 400px; display: block; "
                alt
              />
            </template>
            <img v-if="isImg(val)" :src="(val + '').replace('img=', '')" alt />
          </a-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailShow',
  props: {
    // 每行显示个数
    number: {
      type: Number,
      default: 4
    },
    // 详情信息
    detailInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 标题
    title: {
      type: String,
      default: '详情'
    }
  },
  methods: {
    // 判断url路径是否是图片
    isImg(val) {
      return (val + '').indexOf('img=') > -1
    }
  }
}
</script>

<style lang="less" scoped>
.u-detail-show {
  background-color: #fff;
  margin-bottom: 10px;
  .title {
    font-size: 16px;
    font-weight: bold;
    color: @u-content-color;
    margin-bottom: 10px;
  }
  .info-detail {
    border-bottom: 1px @u-border-color solid;
    border-right: 1px #f5f5f5 solid;
    float: left;
    height: 36px;
    .info-w {
      width: 120px;
      height: 35px;
      line-height: 35px;
      text-align: right;
      padding-right: 10px;
      background-color: @u-bg-color;
    }
    span {
      padding-left: 10px;
      color: @u-tips-color;
    }
    img {
      vertical-align: middle;
      margin-left: 10px;
      width: 30px;
      height: 30px;
      border-radius: 2px;
    }
  }
}
</style>
