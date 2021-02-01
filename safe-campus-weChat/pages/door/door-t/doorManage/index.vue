<template>
	<view class="u-page">
		<!-- <view class="head">我创建的通行权限组</view> -->
		<no-data msg="暂无数据" v-if="groupList.length === 0"></no-data>
		<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h">
			<view class="approve-list" v-for="(item, i) in groupList" :key="i">
				<view class="detail u-fx">
					<view class="process-type" @click="goDetail(item)">
						<view class="div-btn">···</view>
					</view>
					<view class="info u-fx-ac">
						<view class="list u-fx-f1">
							<view class="name">{{ item.ruleGroupName }}</view>
							<view class="normal-time u-fx-ac" v-for="(ele, i) in item.timeRuleList" :key="i">
								<text class="padd-r20">星期{{ toWeekName(ele.weekCode) }}</text>
								<view class="padd-t20 padd-b20" v-for="(item, j) in ele.timeRuleList" :key="j">
									<text>{{ item.accessStart.split(':')[0] }} : {{ item.accessStart.split(':')[1] }}</text>
									<text>~</text>
									<text>{{ item.accessEnd.split(':')[0] }} : {{ item.accessEnd.split(':')[1] }}</text>
								</view>
							</view>
							<view class="u-fx-wp">
								<u-tag class="mar-r20 mar-b20" :text="item.controlGroupName" type="info" v-for="item in item.controlGroupList" :key="item.controlGroupCode"/>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
import { store, actions } from "../store/index.js";
import noData from "@/components/no-data/no-data.vue";

export default {
  name: "index",
  components: {
    noData
  },
  data() {
    return {
      pageList: {
        page: 1,
        size: 15
      },
	  morePage: false,
      groupList: [],
      userGroupCode: ""
    };
  },
  computed: {},
  mounted() {
    this.showList();
  },
  methods: {
    async showList(tag = false) {
		if (tag) {
			this.pageList.page += 1;
		} else {
			this.pageList.page = 1;
		}
      const res = await actions.getgroupList({
        schoolCode: store.userInfo.schoolCode,
        ruleGroupType: 1,
        pageNum: this.pageList.page,
        pageSize: this.pageList.size
      });
	  if (tag) {
	  	this.groupList = this.groupList.concat(res.data.list);
	  } else {
	  	this.groupList = res.data.list;
	  }
	  this.morePage = res.data.hasNextPage;
    },
	loadMore() {
		if (!this.morePage) {
			this.$tools.toast('数据已加载完毕');
			return;
		}
		this.showList(true);
	},
    goDetail(item) {
      this.$tools.navTo({
        url:
          "./detail?ruleGroupCode=" +
          item.ruleGroupCode +
          "&userGroupCode=" +
          item.userGroupCode,
        title: "查看人员列表"
      });
    },
    toWeekName(day) {
      let week = new Map();
      week.set(2, "一");
      week.set(3, "二");
      week.set(4, "三");
      week.set(5, "四");
      week.set(6, "五");
      week.set(7, "六");
      week.set(1, "日");
      return week.get(day);
    }
  }
};
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 100rpx);
}
.list {
  .name {
    margin-bottom: 30rpx;
  }
  .work-title {
    margin-top: 30rpx;
  }
  .div-btn {
    display: inline-block;
    cursor: pointer;
    font-size: 25px;
  }
  .normal-time {
    color: #555555;
  }
  .normal-equ {
    margin-right: 15rpx;
    font-size: 15px;
    color: #fff;
    text-align: center;
    background-color: $u-type-primary;
    border-radius: $u-border-radius;
    padding: 10rpx 20rpx;
  }
}

.head {
  font-size: 18px;
  text-align: center;
  height: 100rpx;
  padding-top: 30rpx;
}
.approve-list {
  background-color: #fff;
  border-radius: 8rpx;
  border-bottom: 1rpx solid #cfd0d1;
  margin: 20rpx;
  position: relative;
  .detail {
    padding: 30rpx;
  }
  .process-type {
    top: 0;
    right: 20rpx;
    position: absolute;
    font-size: 48rpx;
	z-index: 99;
  }
}
</style>
