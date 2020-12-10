<template>
  <div class="detail-show">
    <div class="title u-fx-ac u-fx-jsb">
      <div>{{ title }}</div>
      <div>
        <slot></slot>
      </div>
    </div>
    <div class="u-fx-ac">
      <!-- <div class="user-pic">
        <img :src="photoSrc" alt />
      </div> -->
      <div class="u-fx-f1">
        <a-row>
          <a-col v-for="(item, index) in detailInfo" :key="index" class="detail-row" :span="12">
            {{ item.key }}:
            <span>{{ item.val }}</span>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailShow',
  props: {
    photoSrc: {
      type: String,
      default: ''
    },
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
  .user-pic {
    margin: 10px;
    width: 80px;
    height: 80px;
    display: block;
    background-color: #eee;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  background-color: #fff;
  margin-bottom: 10px;
  .title {
    font-size: 18px;
    color: @main-color;
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
