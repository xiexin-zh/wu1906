<template>
  <view class="u-page">
    <scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
      <PlanList isShow :data-list="recordList" @goDetail="goDetail"></PlanList>
    </scroll-view>
  </view>
</template>
<script>
import { store, actions } from "./store/index.js";
import eventBus from "@u/eventBus";
import PlanList from "../component/PlanList.vue";
export default {
  components: {
    PlanList,
  },
  data() {
    return {
      recordList: [],
      total: 0,
      pageList: {
        page: 1,
        size: 20,
      },
      morePage: false,
      schoolYearId: "",
      userType: "0", //1班主任，0教职工
      classCode: "",
      gradeCode: "",
      gradeCodes: [],
    };
  },
  async created() {
    this.schoolYearId = store.schoolYear.schoolYearId;
    if (store.userInfo.typeCode === "4") {
      this.userType = "0";
      if (store.teachClassList.length === 0) {
        this.$tools.toast("请绑定班级");
        return;
      }
      uni.setStorageSync("classInfo", {
        gradeCode: store.teachClassList[0].gradeCode,
        classCode: store.teachClassList[0].value,
        schoolYearId: this.schoolYearId,
      });
    }
    uni.setStorageSync("classInfo", {
      gradeCode: this.gradeCode,
      classCode: this.classCode,
      schoolYearId: this.schoolYearId,
    });
    this.showList();
  },
  methods: {
    async showList(tag = false) {
      if (tag) {
        this.pageList.page += 1;
      } else {
        this.pageList.page = 1;
      }
      store.teachClassList.forEach((el) => {
        this.gradeCodes.push(el.gradeCode);
      });
      const req = {
        schoolCode: store.userInfo.schoolCode,
        schoolYearId: this.schoolYearId,
        ...this.pageList,
        gradeCode: this.gradeCodes.toString(),
        state: "2",
      };
      const res = await actions.gettestList(req);
      if (tag) {
        this.recordList = this.recordList.concat(res.data.list);
      } else {
        this.recordList = res.data.list;
      }
      this.morePage = res.data.hasNextPage;
    },
    loadMore() {
      if (!this.morePage) {
        this.$tools.toast("数据已加载完毕");
        return;
      }
      this.showList(true);
    },
    goDetail(item) {
      this.$tools.navTo({
        url: "./detail?id=" + item.id+
          "&gradeCode=" +
          item.gradeCode,
        title: "详情",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 0rpx);
}
</style>
