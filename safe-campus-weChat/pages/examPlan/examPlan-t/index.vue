<template>
  <view class="u-page">
		<tab-menu :data-list="tabList" @change="changeMenu"></tab-menu>
		<scroll-view class="scroll-h" @scrolltolower="loadMore" scroll-y="true">
			<PlanList isShow :data-list="recordList"></PlanList>
		</scroll-view>
  </view>
</template>
<script>
import { store, actions } from "./store/index.js";
import noData from "@/components/no-data/no-data.vue";
import eventBus from "@u/eventBus";
import PlanList from "../component/PlanList.vue";

export default {
  components: {
    noData,
    PlanList,
  },
  data() {
    return {
      tabList: [
        {
          name: "未开始",
        },
        {
          name: "进行中",
        },
        {
          name: "已结束",
        },
      ],
      current: '0',
      swiperCurrent: '0',
      recordList: [],
      searchObj: {},
      total: 0,
      pageList: {
        page: 1,
        size: 20,
      },
      morePage: false,
      noticeId: "",
    };
  },
  filters: {},
  mounted() {
    this.showList();
  },
  methods: {
    changeMenu(item) {
      this.current = item;
      this.showList();
    },
    async showList(tag = false) {
      if (tag) {
        this.pageList.page += 1;
      } else {
        this.pageList.page = 1;
      }
      const req = {
        schoolCode: store.userInfo.schoolCode,
        userCode: store.userInfo.userCode,
        ...this.pageList,
        state: this.current,
      };
      const res = await actions.getplanList(req);
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
  },
};
</script>

<style lang="scss" scoped>
	.scroll-h {
		height: calc(100vh - 80rpx);
	}
</style>
