<template>
  <div class="vertical-tab">
    <div class="title">
      {{ title }}
    </div>
    <a-skeleton style="padding: 0 15px" v-if="tabList.length == 0" active :paragraph="{rows: 10}" />
    <ul>
      <li :class="{'act': currentIndex === index}" @click="changeTab(list, index)" v-for="(list, index) in tabList" :key="list.key">
        {{ list.val }}
      </li>
    </ul>
  </div>
</template>

<script>
import NoData from './NoData'
export default {
  name: 'VerticalTab',
  props: {
    title: {
      type: String,
      default: ''
    },
    tabList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    NoData
  },
  data () {
    return {
      currentIndex: 0
    }
  },
  methods: {
    changeTab (item, index) {
      this.currentIndex = index
      this.$emit('input', item)
      this.$emit('change', item)
    }
  }
}
</script>

<style lang="less" scoped>
  .vertical-tab {
    .title {
      font-size: 16px;
      font-weight: bold;
      color: @main-color;
      height: 45px;
      text-align: center;
      line-height: 45px;
      background-color: #fafafa;
    }
    ul {
      width: 100%;
      li {
        height: 42px;
        line-height: 42px;
        cursor: pointer;
        text-align: center;
        border-bottom: 1px @bor-color solid;
        position: relative;
        &.act {
          background-color: #e6f7ff;
          color:#666;
          &::before {
            position: absolute;
            content: '';
            border: 8px#666 solid;
            border-top: 8px transparent solid;
            border-right: 8px transparent solid;
            border-bottom: 8px transparent solid;
            top: 14px;
            left: 15px;
            width: 0;
            height: 0;
          }
        }
      }
    }
  }
</style>
