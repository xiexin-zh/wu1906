<template>
  <div class="vertical-tab">
    <div class="title">
      {{ title }}
    </div>
    <ul>
      <li :style="{color: currentIndex === index ? fontCol : '', background: currentIndex === index ? bgCol : ''}" @click="changeTab(list, index)" v-for="(list, index) in tabList" :key="list.key">
        {{ list.val }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'VerticalTab',
  props: {
    title: {
      type: String,
      default: ''
    },
    fontCol: {
      type: String,
      default: '#fff'
    },
    bgCol: {
      type: String,
      default: '#ccc'
    },
    tabList: {
      type: Array,
      default: () => {
        return []
      }
    }
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
      height: 50px;
      text-align: center;
      line-height: 50px;
      background-color: #fafafa;
    }
    ul {
      width: 100%;
      li {
        height: 50px;
        line-height: 50px;
        cursor: pointer;
        text-align: center;
        border-bottom: 1px @bor-color solid;
        &.act {
          background-color: @dark-color;
          color:#fff;
        }
      }
    }
  }
</style>
