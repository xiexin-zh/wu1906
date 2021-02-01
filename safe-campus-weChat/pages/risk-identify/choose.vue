<template>
  <view>
    <scroll-view scroll-y="true" class="scroll-h">
      <no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
      <view class="u-type-white-bg">  
        <u-checkbox-group class="approve-list u-type-white-bg u-padd-l20 u-padd-r20" :wrap="true">
          <u-checkbox 
            @change="checkboxGroup($event,item)"
            v-model="item.checked" 
            v-for="(item, i) in dataList"
            :key="i" 
            :name="item.id"
            class="u-bd-b"
            :disabled="type === 2"
          >
          <view class="detail u-fx-ver u-padd u-fx-f1">
            <view class="u-tips-color u-mar-t20"
              >检查对象：{{ item.checkObject }}
            </view>
            <view class="u-tips-color u-mar-t20"
              >潜在风险：{{ item.riskContent }}
            </view>
            <view class="u-tips-color u-mar-t20"
              >事故类型：
              <text> {{item.riskType}} </text>
            </view>
          </view>
          </u-checkbox>
        </u-checkbox-group>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import noData from '@/components/no-data/no-data.vue'
import eventBus from "@u/eventBus";
import { store, actions, setStore } from "./store/index.js"
export default {
  components: {
    noData
  },
  data() {
    return {
      dataList: [],
      chooseAllList: [],
      type: ''
    };
  },
  mounted() {
    this.type = parseInt(this.$tools.getQuery().get("type"))
    this.dataList = uni.getStorageSync('chooseList')
    this.chooseAllList = uni.getStorageSync('chooseList')
  },
  methods: {
    checkboxGroup(e,record){
      if(e.value){
        this.chooseAllList.push(record)
      } else {
        const index = this.chooseAllList.findIndex(list => list.id === e.name)
        this.chooseAllList.splice(index, 1)
      }
      uni.setStorageSync('chooseList', this.chooseAllList)
    }
  },
  destroyed() {
    eventBus.$emit('getList')
  },
};
</script>
<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 10rpx);
}
</style>
