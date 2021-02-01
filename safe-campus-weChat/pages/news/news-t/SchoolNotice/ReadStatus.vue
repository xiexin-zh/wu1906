<template>
	<view class="u-page">
		<u-tabs-swiper
			ref="uTabs"
			:bold="false"
			:bar-style="{ transform: 'scale(3)', height: '1rpx' }"
			:current="current"
			@change="changeMenu"
			:list="tabList"
			:is-scroll="false"
			active-color="#2979ff"
		></u-tabs-swiper>
		<view class="dropdown u-fx-jsb u-fx-ac">
			<view class="u-fx-ac">
				<text>阅读状态：</text>
				<ms-dropdown-menu><ms-dropdown-item v-model="value0" :list="typeList"></ms-dropdown-item></ms-dropdown-menu>
			</view>
			<view class="">
				<text class="u-type-error">未读：{{ this.readList.unReadCount }}人</text>
				<text class="mar-l20">已读：{{ this.readList.readCount }}人</text>
			</view>
		</view>
		<swiper class="u-page" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item">
				<no-data msg="暂无数据~" v-if="!userList || userList.length === 0"></no-data>
				<scroll-view scroll-y="true"  class="class-style scroll-h">
					<view class="approve-list" v-for="(item, index) in userList" :key="index">
						<view class="detail u-fx">
							<view class="info u-fx-f1">
								<view class="list">
									<view class="name u-main-color">
										教职工姓名:
										<text class="u-tips-color" v-if="item.outUserInfoDto != null">{{ item.outUserInfoDto.userName }}</text>
									</view>
									<view class="u-fx-jsb">
										<view class="u-tips-color" v-if="item.outUserInfoDto != null">工号:{{ item.outUserInfoDto.workNo }}</view>
										<view class="u-main-color time" v-if="item.readStatus == 1">
											<text>阅读时间:{{ item.readTime | gmtToDate }}</text>
										</view>
									</view>
								</view>
							</view>
							<view class="tags">
								<u-tag v-if="item.readStatus == 1" type="success" text="已读" />
								<u-tag v-if="item.readStatus == 0" type="error" text="未读" />
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<no-data msg="暂无数据~" v-if="!userList || userList.length === 0"></no-data>
				<scroll-view scroll-y="true"  class="class-style scroll-h">
					<view class="approve-list" v-for="(item, index) in userList" :key="index">
						<view class="detail u-fx">
							<view class="info u-fx-f1">
								<view class="list">
									<view class="name u-main-color">
										学生姓名: <text class="u-tips-color" v-if="item.outParentQuery != null">{{ item.outParentQuery.studentInfo[0].stuName }}</text>
									</view>
									<view class="u-fx-jsb">
										<view class="u-tips-color" v-if="item.outParentQuery != null">学号: {{ item.outParentQuery.studentInfo[0].userNo }}</view>
										<view v-if="false" class="u-main-color time">
											<text>阅读时间:{{ item.readTime | gmtToDate }}</text>
										</view>
									</view>
									<view class="u-tips-color" v-if="item.outParentQuery != null">家长姓名: {{ item.outParentQuery.parentName }}</view>
								</view>
							</view>
							<view>
								<u-tag v-if="item.readStatus == 1" type="success" text="已读" />
								<u-tag v-if="item.readStatus == 0" type="error" text="未读" />
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import eventBus from "@u/eventBus";
import { store, actions } from "../store/index.js";
import msDropdownMenu from "@/components/ms-dropdown/dropdown-menu.vue";
import msDropdownItem from "@/components/ms-dropdown/dropdown-item.vue";
export default {
  data() {
    return {
      readList: {},
      userList: [],
      pageList: {
        page: 1,
        size: 999,
      },
      // morePage: false,
      current: 0,
      swiperCurrent: 0,
      tabList: [
        {
          name: "教职工",
        },
        {
          name: "家长",
        },
      ],
      value0: "0",
      typeList: [
        {
          text: "全部",
          value: "",
        },
        {
          text: "未读",
          value: "0",
        },
        {
          text: "已读",
          value: "1",
        },
      ],
      userType: "2",
    };
  },
  components: {
    msDropdownMenu,
    msDropdownItem,
  },
  watch: {
    value0(val, oldval) {
      if (val !== oldval) {
        if (this.swiperCurrent === 0) {
          this.userType = 2;
          this.showList();
        } else {
          this.userType = 1;
          this.showList();
        }
      }
    },
  },
  mounted() {
    if (this.value0 === "0") {
      this.value0 = "";
    }
    this.id = this.$tools.getQuery().get("id");
  },
  methods: {
    changeMenu(item) {
      this.swiperCurrent = item;
      if (this.swiperCurrent === 0) {
        this.userType = 2;
        this.showList();
      } else {
        this.userType = 1;
        this.showList();
      }
    },
    transition(e) {
      let dx = e.detail.dx;
      this.$refs.uTabs.setDx(dx);   
    },
    animationfinish(e) {
      let current = e.detail.current;
      this.$refs.uTabs.setFinishCurrent(current);
      this.swiperCurrent = current;
       if (this.swiperCurrent === 0) {
        this.userType = 2;
        this.showList();
      } else {
        this.userType = 1;
        this.showList();
      }
    },
    async showList() {
      let req = null;
      req = {
        schoolCode: store.userInfo.schoolCode,
        ...this.pageList,
        type: this.userType,
        noticeId: this.id,
        readStatus: this.value0,
      };
      const res = await actions.getReadStatus(req);
      this.userList = res.data.list.list;
      this.readList = res.data;
    //   if (tag) {
    //     this.userList = this.userList.concat(res.data.list.list);
    //   } else {
    //     this.userList = res.data.list.list;
    //   }
    //   this.morePage = res.data.hasNextPage;
    // },
    // loadMore() {
    //   if (!this.morePage) {
    //     this.$tools.toast("数据已加载完毕");
    //     return;
    //   }
    //   this.showList(true);
     },
  },
};
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 190rpx);
  margin-top: 10rpx;
}
.approve-list {
  border-radius: $u-border-radius;
  background-color: #fff;
  padding: $u-mp-20;
  margin: $u-mp-20;
  &:first-child {
    margin-top: 0;
  }
  .detail {
		position: relative;
		.tags{
			position: absolute;
			right: 0;
			top: 0
		}
  }
  .process-type {
    top: 10rpx;
    right: 20rpx;
    position: absolute;
    font-size: 48rpx;
  }
  .info {
    width: 100%;
    .list {
      view {
        font-size: 28rpx;
        margin: 10rpx 0;
      }
      .name,
      .time {
        text {
          margin-left: 20rpx;
          font-size: 24rpx;
        }
      }
      .mar-b0 {
        margin: 10rpx 0 0 0;
      }
    }
  }
}
.dropdown {
  padding: 20rpx 20rpx 0rpx 20rpx;
  font-size: 12px;
  .dropdown-menu {
    border: 1rpx solid #ddd;
    border-radius: 8rpx;
  }
  /deep/ .dropdown-item__selected {
    padding: 10rpx 30rpx;
  }
}
</style>
