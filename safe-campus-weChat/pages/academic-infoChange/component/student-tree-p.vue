<template>
  <view class="">
    <ly-drawer :visible="studentTag" mode="right" width="80%" @close="close">
      <no-data msg="暂无班级数据~" v-if="noDataTag"></no-data>
      <view v-else>
        <scroll-view :scroll-y="true" class="scroll-h u-padd-t40">
          <view class="u-padd-20">
            <u-radio-group
              v-model="selectVal"
              :wrap="true"
              class="u-padd-l20"
              @change="changeStudent"
            >
              <u-radio
                v-for="el in treeData"
                :key="el.userCode"
                :name="el.userCode"
                class="u-mar-t10"
              >
                {{ el.userName }}
              </u-radio>
            </u-radio-group>
          </view>
        </scroll-view>
      </view>
      <view class="footer">
        <view class="button confirm" @tap="confirm">确定</view>
        <view class="button cancle" @tap="close">取消</view>
      </view>
    </ly-drawer>
  </view>
</template>

<script>
import LyDrawer from "@/components/ly-drawer/ly-drawer.vue";
import LyTree from "@/components/ly-tree/ly-tree.vue";
import noData from "@/components/no-data/no-data.vue";
import { store } from "../store";
export default {
  components: {
    LyTree,
    noData,
    LyDrawer,
  },
  props: {
    studentTag: {
      type: Boolean,
      default: false,
    },
    schoolInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      noDataTag: false,
      ready: false,
      selectedData: [],
      treeData: [],
      checkedKeys: [],
      selectVal: "",
      userInfo: {},
    };
  },
  created() {
    this.getTreeData();
  },
  methods: {
    close() {
      this.$emit("close");
    },
    confirm() {
      this.$emit("confirm", this.userInfo);
    },
    changeStudent(userCode) {
      this.selectVal = userCode;
      const obj = this.treeData.find((item) => item.userCode === userCode);
      this.userInfo = obj;
    },
    getTreeData() {
      this.treeData = store.childList || [];
    },
  },
};
</script>
<style lang="scss">
.footer {
  position: fixed;
  z-index: 998;
  left: 0;
  bottom: 0;
  background: #ffffff;
  width: 100%;
  height: 100rpx;
  overflow: hidden;
  box-shadow: 1rpx 1rpx 8px #c7c7c7;
}

.footer .button {
  width: 50%;
  border: none;
  text-align: center;
  float: right;
  font-size: 30rpx;
  border-radius: 0;
  height: 100rpx;
  line-height: 100rpx;
}

.footer .button:after {
  width: 0;
  height: 0;
}

.footer .button.confirm {
  background: #2979ff;
  color: #fff;
}

.footer .button.cancle {
  background: #f5f5f5;
}

.ly-search {
  margin: 0rpx 30rpx;
  padding-top: 20rpx;
  padding-bottom: 15rpx;
  border-bottom: 1px solid #ededed;
}

uni-input {
  font-size: 28rpx;
}

.scroll-h {
  height: calc(100vh - 160rpx);
}
</style>
