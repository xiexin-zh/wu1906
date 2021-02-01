<template>
  <view class="u-page">
    <dropdown-menu
      class="u-mar-b20"
      ref="dropdown"
      @value0Change="value0Change"
      @value1Change="value1Change"
    ></dropdown-menu>
    <scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
      <no-data v-if="recordList.length === 0" msg="暂无数据"></no-data>
      <view
        class="list u-padd-20 u-mar-b20 u-mar-l20 u-mar-r20 u-bg-fff u-border-radius"
        v-for="(item, i) in recordList"
        :key="i"
      >
        <view class="u-fx-jsb u-fx-ac">
          <view class="u-fx u-fx-ac">
            <u-lazy-load
              class="img u-border-radius-all u-mar-r20"
              :image="item.photoUrl"
            ></u-lazy-load>
            <view class="">
              <view class="title   u-mar-b20"
                >{{ item.userName }}
              </view>
              <view class="title u-type-info u-mar-b20"
                >{{ item.workNo }}
              </view>
            </view>
          </view>
          <view class="tag  u-bold"> {{ item.score }}分</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script>
import { store, actions } from "./store/index.js";
import eventBus from "@u/eventBus";
import DropdownMenu from "./component/DropdownMenu.vue";
export default {
  components: { DropdownMenu },
  data() {
    return {
      recordList: [],
      total: 0,
      pageList: {
        page: 1,
        size: 20,
      },
      id: "",
      gradeCode: "",
      classCode: "",
      schoolYearId: "",
      subjectCode: "",
      morePage: false,
    };
  },
  created() {
    this.id = this.$tools.getQuery().get("id");
    this.schoolYearId = uni.getStorageSync("classInfo").schoolYearId;
    this.classCode = uni.getStorageSync("classInfo").classCode;
    this.gradeCode = uni.getStorageSync("classInfo").gradeCode;
  },
  mounted() {},
  methods: {
    value0Change(val) {
      console.log(val);
      this.classCode = val;
      this.getDetail();
    },
    value1Change(val) {
      this.subjectCode = val;
      this.getDetail();
    },
    async getDetail(tag = false) {
      if (tag) {
        this.pageList.page += 1;
      } else {
        this.pageList.page = 1;
      }
      if (!this.subjectCode || !this.classCode) {
        return;
      }
      const req = {
        schoolCode: store.userInfo.schoolCode,
        schoolYearId: this.schoolYearId,
        ...this.pageList,
        classCode: this.classCode,
        subjectCode: this.subjectCode,
        planId: this.id,
      };
      const res = await actions.getscoreList(req);
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
      this.getDetail(true);
    },
  },
};
</script>
<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 100rpx);
}
.list:nth-child(odd) {
  .sub {
    color: $u-type-primary;
    background-color: $u-type-primary-light;
  }
}
.list:nth-child(even) {
  .sub {
    color: $u-type-success;
    background-color: $u-type-success-light;
  }
}
.img {
  width: 120rpx;
  height: 120rpx;
}
</style>
