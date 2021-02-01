<template>
  <view>
    <view class="head">
      <dropdown-menu
        @value0Change="value0Change"
        @value1Change="value1Change"
      ></dropdown-menu>
    </view>
    <scroll-view scroll-y="true" class="scroll-h">
			<duty-list :data-list="recordList"></duty-list>
    </scroll-view>
  </view>
</template>
<script>
import dutyList from '../component/dutyList.vue'
import { store, actions } from "./store/index.js";
import eventBus from "@u/eventBus";
import DropdownMenu from "./component/DropdownMenu.vue";
export default {
  components: {
    DropdownMenu,
		dutyList
  },
  data() {
    return {
      recordList: [],
      classCode: "",
      gradeCode: "",
      schoolYearId: "",
    };
  },
  watch: {
    classCode(val) {
      if (!val) {
        return;
      }
      this.showList();
    },
  },
  created() {
    this.schoolYearId = uni.getStorageSync("classInfo").schoolYearId;
    this.classCode = uni.getStorageSync("classInfo").classCode;
  },
  methods: {
    value0Change(val) {
      this.gradeCode = val;
    },
    value1Change(val) {
      this.classCode = val;
    },
    async showList() {
      const req = {
        schoolCode: store.userInfo.schoolCode,
        classCode: this.classCode,
        schoolYearId: this.schoolYearId,
      };
      const res = await actions.getdutyList(req);
      this.recordList = res.data.listInfo
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 100rpx);
}
.head {
  height: 100rpx;
}
</style>
