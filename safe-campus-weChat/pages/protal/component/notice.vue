<template>
  <view class="notice">
    <no-data v-if="noticeList.length === 0"></no-data>
    <view
      v-for="notice in noticeList"
      :key="notice.id"
      class="notice-list u-bd-b"
      @click="detail(notice)"
    >
      <text
        v-if="notice.noticeType === '2' || notice.noticeType === '3'"
        class="title u-te link"
        >{{ notice.title }}评价...</text
      >
      <text v-else class="title u-te">{{ notice.title }}</text>
      <text class="time u-font-02 u-content-color">{{
        notice.createTime | getToDate
      }}</text>
    </view>
  </view>
</template>

<script>
import noData from "@/components/no-data/no-data.vue";
export default {
  components: {
    noData,
  },
  props: {
    noticeList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    detail(notice) {
      const { id, noticeType, bussId } = notice;
      // noticeType  1-其他公告   2-教学评价 3-问卷调查
      if (noticeType === "2") {
        this.$tools.navTo({
          url: `../academic-education/quality/index?id=${id}&bussId=${bussId}`,
        });
        return;
      }
      if (noticeType === "3") {
        this.$tools.navTo({
          url: `../academic-education/survey/index?id=${id}&bussId=${bussId}`,
        });
        return;
      }
      this.$tools.navTo({
        url: `../news/news-t/SchoolNotice/detail?id=${id}`,
        title: "详情",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.notice-list {
  background-color: #fff;
  padding: $u-mp-20;
  .title {
    margin-bottom: $u-mp-20;
  }
  .link {
    color: #0084ff;
  }
  .time {
  }
}
</style>
