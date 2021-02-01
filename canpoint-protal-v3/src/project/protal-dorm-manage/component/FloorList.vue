<template>
  <div class="floor u-tx-c u-fx-ver u-type-white-bg">
    <div class="u-fx-f1">
      <ul class="floor-type u-scroll-y u-padd-r10" :style="{ maxHeight: maxHeight + 'px' }">
        <li
          :class="[{ 'u-tips-color u-type-info-light-bg': currentIndex === index }, 'u-fx-ac u-bd-b']"
          @click="chooseFloor(floor, index)"
          v-for="(floor, index) in floorList"
          :key="index"
        >
          <div class="floor-name">{{ floor.name }}</div>
          <div class="del-button" v-if="currentIndex === index && canEdit">
            <u-button type="link" delete content="确定删除该楼层吗？" @click="floorAction(2, floor)">删除</u-button>
          </div>
        </li>
      </ul>
      <ul class="floor-type" v-if="canEdit">
        <li class="add-floor u-mar-t20">
          <u-button type="light" icon="plus" @click="floorAction(0)">新增楼层</u-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FloorList',
  components: {},
  props: {
    // 是否可编辑
    canEdit: {
      type: Boolean,
      default: false
    },
    // 房间列表
    floorList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 选中的楼层
    currentFloorIndex: {
      type: Number,
      default: 0
    },
    // 最大高度
    maxHeight: {
      type: Number,
      default: document.body.clientHeight - 200
    }
  },
  watch: {
    currentFloorIndex: {
      handler(n, o) {
        this.currentIndex = n
      },
      immediate: true
    }
  },
  data() {
    return {
      currentIndex: this.currentFloorIndex
    }
  },
  methods: {
    // 选中房间
    chooseFloor(item, index) {
      this.currentIndex = index
      this.$emit('chooseFloor', item)
    },
    /**
   * 房间操作
   * @param { type } Number 操作类型： 0.新增 1.编辑 2.删除
   * @param { item } Object 操作对象
   */
    floorAction(type, item) {
      this.$emit('floorAction', type, item)
    }
  }
}
</script>

<style lang="less" scoped>
.floor {
  width: 138px;
  margin-top: 5px;
  .floor-type {
    li {
      cursor: pointer;
      height: 40px;
      line-height: 40px;
      .floor-name{
        width: 138px;
      }
      .del-button{
        position: absolute;
        right: 0;
      }
    }
    .add-floor {
      height: 35px;
      line-height: 35px;
      border-bottom: none;
    }
  }
}
</style>
