<template>
  <div class="attend-box u-fx-ac">
    <div class="attend-tip u-fx-ac-jc">
      <img :src="type === 'am' ? amIcon : pmIcon" alt />
      <div class="u-type-white u-bold u-mar-t10">{{ title }}</div>
    </div>
    <div class="u-fx-f1 u-fx-ac-jc">
      <div class="u-font-3 u-type-success u-bold">{{ totalList[0] || 0 }}</div>
      <div>{{ list[0] }}(人)</div>
    </div>
    <div class="u-fx-f1 u-fx-ac-jc">
      <div class="u-font-3 u-type-error u-bold">{{ totalList[1] || 0 }}</div>
      <div>{{ list[1] }}(人)</div>
    </div>
    <div class="u-fx-f1 u-fx-ac-jc">
      <div class="u-font-3 u-type-warning u-bold">{{ totalList[2] || 0 }}</div>
      <div>{{ list[2] }}(人)</div>
    </div>
  </div>
</template>
<script>
import amIcon from '../assets/img/am-icon.png'
import pmIcon from '../assets/img/pm-icon.png'
export default {
  name: 'AttendBox',
  props: {
    type: {
      type: String,
      default: 'am'
    },
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    totalList: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      amIcon,
      pmIcon
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.attend-box {
  width: 48%;
  float: left;
  margin-left: 1.33%;
  margin-bottom: 20px;
  background-color: @u-border-color;
  padding: 20px;
  .amIcon {
    width: 60px;
    height: 60px;
    display: block;
  }
  .attend-tip {
    width: 100px;
    background-color: @u-type-primary-disabled;
    height: 120px;
  }
}
</style>
