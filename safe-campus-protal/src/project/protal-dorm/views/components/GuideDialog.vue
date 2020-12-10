<template>
  <div class="ss-guide-dialog" v-if="showTag">
    <div class="ss-guide" :style="{marginTop: top + 'px'}">
      <div>{{ title }}</div>
      <div class="ss-btn">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GuideDialog',
  props: {
    title: {
      type: String,
      default: '欢迎使用宿管系统'
    },
    showTag: {
      type: Boolean,
      default: false
    },
    top: {
      type: String,
      default: '0'
    },
    btnName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.ss-guide-dialog {
    position: absolute;
    color:#fff;
    width:100%;
    height:100%;
    top:0;
    left:0;
    z-index: 999;
    background:rgba(0,0,0,.7);
    .ss-guide {
      color:#fff;
      margin-left: 20px;
      &:first-child {
      font-size: 16px;
      }
    }
  }
  .ss-btn {
    cursor: pointer;
    width: 110px;
    text-align: center;
    border: 1px #fff solid;
    margin-top: 10px;
    font-size: 14px;
    padding: 4px 0;
    border-radius: 3px;
    div {
      width: 100%;
    }
  }
</style>
