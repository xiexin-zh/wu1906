<template>
  <div class="dorm-class-tree  u-fx-ver u-type-white-bg u-padd-t20 u-padd-l10 u-padd-r10">
    <div class="left-top u-fx-ac-jc" v-show="isTab">
      <a-radio-group size="large" @change="change" v-model="currentIndex" button-style="solid">
        <a-radio-button
          style="width: 90px; height: 32px; line-height: 32px; text-align: center"
          :value="item.name"
          :key="index"
          :class="index===currentIndex?'active':''"
          v-for="(item, index) in tabList"
        >{{ item.title }}</a-radio-button
        >
      </a-radio-group>
    </div>
    <div class="page-layout u-fx-f1 u-fx-ver u-mar-t10">
      <div v-if="currentIndex===0 && hasAllDorm" class="allText" @click="select('全部',{})">全部</div>
      <keep-alive>
        <u-dorm-tree
          :isChoose="isChoose"
          :key="key"
          :showAllTag="showDromAllTag"
          :maxHeight="maxHeight"
          v-if="currentIndex===0"
          @select="value=>select('宿舍',value)"
          :school="schoolCode"></u-dorm-tree>
        <u-class-tree
          v-else
          :isOnlyNewSchoolYear="isOnlyNewSchoolYear"
          :maxHeight="maxHeight"
          :school="schoolCode"
          @select="value=>select('班级',value)"></u-class-tree>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'TemplateS',
  props: {
    // 是否展示子房间
    isChoose: {
      type: Boolean,
      default: false
    },
    // 是否只看当前学年
    isOnlyNewSchoolYear: {
      type: Boolean,
      default: false
    },
    // 默认选中到第一条数据的第一个楼层
    showAllTag: {
      type: String,
      default: '1'
    },
    // 全部宿舍按钮
    hasAllDorm: {
      type: Boolean,
      default: true
    },
    // 树组件最高高度
    maxHeight: {
      type: Number,
      default: document.body.clientHeight - 80
    }
  },
   data() {
    return {
      isTab: true,
      currentIndex: 0,
      showDromAllTag: '1',
      reFresh: true,
      key: 0,
      tabList: [
        {
          name: 0,
          title: '宿舍'
        },
        {
          name: 1,
          title: '班级'
        }
      ]
    }
  },
  created() {
    this.showDromAllTag = this.showAllTag
  },
   computed: {
    ...mapState('home', ['schoolCode', 'loginInfo', 'schoolYear'])
  },

  methods: {
      change(value) {
        this.$emit('changeTab', value.target.value)
      },
      select(type, obj) {
        if (type === '全部') {
          obj.buildingCode = ''
          obj.floorCode = ''
          obj.roomCode = ''
          this.showDromAllTag = '0'
          this.key++
        }
        this.$emit('select', { type: type, data: obj })
      }
    }
}
</script>

<style lang="less" scoped>
.allText{
  font-size: 14px;
  position: absolute;
  right: 30px;
  top: 7px;
  color: #0ca3f2;
  z-index: 100;
}
.dorm-class-tree{
  .ant-radio-button-wrapper{
    border: 1px solid #36bfff !important;
    color: #36bfff;
    &.active{
      color: #fff;
    }
  }
  .ant-radio-button-wrapper:nth-of-type(1){
    border-radius: 6px 0px 0px 6px;
  }
  .ant-radio-button-wrapper:nth-of-type(2){
    border-radius: 0px 6px 6px 0px;
  }
}
</style>
