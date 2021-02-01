<template>
  <view class="site u-page">
    <tab-menu :data-list="list" @change="tabChange"></tab-menu>
    <dropdown-menu
      v-if="isShow"
      @value0Change="value0Change"
      @searchChange="searchChange"
    ></dropdown-menu>
    <no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
    <scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h">
      <view
        class="approve-list u-border-radius"
        v-for="(item, i) in dataList"
        :key="i"
        @click="goDetail(item.id)"
      >
        <view class="detail u-fx">
          <view class="process-type">
            <u-tag
              v-if="item.approvalState === 1"
              mode="light"
              type="primary"
              text="待审批"
            />
            <u-tag
              v-if="item.approvalState === 2"
              mode="light"
              type="success"
              text="已同意"
            />
            <u-tag
              v-if="item.approvalState === 3"
              mode="light"
              type="error"
              text="未同意"
            />
            <u-tag
              v-if="item.approvalState === 4"
              mode="light"
              type="info"
              text="已撤回"
            />
          </view>
          <view class="u-fx-ac">
            <view class="u-fx-f1">
              <view class="u-main-color u-font-1 u-mar-t20">
                <view>
                  第{{ item.fromLesson }}节{{ item.fromSubjectName }}
                  <text class="u-padd-40">
                    <image src="/mobile-img/exchange.png"></image>
                  </text>
                  <text v-if="item.category === 2">
                    第{{ item.toLesson }}节{{ item.toSubjectName }}
                  </text>
                  <text v-if="item.category === 1"
                    >{{ item.toTeacherName }}代课</text
                  >
                  <text v-if="item.category === 3"
                    >{{ item.toTeacherName }}自修</text
                  >
                  <text v-if="item.category === 4"
                    >{{ item.toTeacherName }}教务处理</text
                  >
                </view>
              </view>
              <view class="u-tips-color u-mar-t20"
                >申请人：{{ item.createUsername }}
              </view>
              <view class="u-tips-color u-mar-t20"
                >申请时间：{{ item.createTime | gmtToDate("dateTime") }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="float-add-btn" @click="add" v-if="this.current === 0"></view>
  </view>
</template>
<script>
import wxApi from '@u/wxApi'
import eventBus from "@u/eventBus";
import DropdownMenu from "./component/DropdownMenu.vue";
import noData from "@/components/no-data/no-data.vue";
import { store, actions } from "./store/index.js";
export default {
  components: {
    DropdownMenu,
    noData,
  },
  data() {
    return {
      value0: "",
      searchObj: {
        startTime: "",
      },
      pageList: {
        page: 1,
        size: 15,
      },
      morePage: false,
      dataList: [],
      list: [
        {
          name: "我提交的",
        },
        {
          name: "我审批的",
        },
        {
          name: "调代给我的",
        },
      ],
      current: 0,
      isShow: true,
    };
  },
  async mounted() {
    eventBus.$on("getList", () => {
      this.createList_();
    });
		wxApi.getConfig();
    this.createList_();
  },
  methods: {
    tabChange(item) {
      console.log(item);
      this.current = item;
      this.pageList.page = 1;
      if (this.current === 0) {
        this.isShow = true;
        this.createList_();
      } else if (this.current === 1) {
        this.isShow = true;
        this.myApproveList_();
      } else if (this.current === 2) {
        this.isShow = false;
        this.findtoMyApproveList_();
      }
    },
    value0Change(val) {
      console.log(val);
      this.value0 = val;
      if (this.current === 0) {
        this.createList_();
      } else if (this.current === 1) {
        this.myApproveList_();
      } else if (this.current === 2) {
        this.findtoMyApproveList_();
      }
    },
    searchChange(val) {
      console.log(val);
      this.searchObj = val;
      if (this.current === 0) {
        this.createList_();
      } else if (this.current === 1) {
        this.myApproveList_();
      } else if (this.current === 2) {
        this.findtoMyApproveList_();
      }
    },
    async createList_(tag = false) {
      if (tag) {
        this.pageList.page += 1;
      } else {
        this.pageList.page = 1;
      }
      const req = {
        ...this.pageList,
        schoolCode: store.userInfo.schoolCode,
        createUsercode: store.userInfo.userCode,
        createTime: this.searchObj.startTime,
        approvalState: this.value0,
      };
      const res = await actions.createList(req);
      if (tag) {
        this.dataList = this.dataList.concat(res.data);
      } else {
        this.dataList = res.data;
      }
      this.morePage = res.data.hasNextPage;
    },
    async myApproveList_(tag = false) {
      if (tag) {
        this.pageList.page += 1;
      } else {
        this.pageList.page = 1;
      }
      const req = {
        ...this.pageList,
        schoolCode: store.userInfo.schoolCode,
        approverCode: store.userInfo.userCode,
        createTime: this.searchObj.startTime,
        approvalState: this.value0,
      };
      const res = await actions.myApproveList(req);
      if (tag) {
        this.dataList = this.dataList.concat(res.data.list);
      } else {
        this.dataList = res.data.list;
      }
      this.morePage = res.data.hasNextPage;
    },
    async findtoMyApproveList_(tag = false) {
      if (tag) {
        this.pageList.page += 1;
      } else {
        this.pageList.page = 1;
      }
      const req = {
        ...this.pageList,
        schoolCode: store.userInfo.schoolCode,
        toTeacherCode: store.userInfo.userCode,
        createTime: this.searchObj.startTime,
        approvalState: this.value0,
      };
      const res = await actions.findtoMyApproveList(req);
      if (tag) {
        this.dataList = this.dataList.concat(res.data.list);
      } else {
        this.dataList = res.data.list;
      }
      this.morePage = res.data.hasNextPage;
    },
    loadMore() {
      if (!this.morePage) {
        this.$tools.toast("数据已加载完毕");
        return;
      }
      this.createList_(true);
      this.myApproveList_(true);
      this.findtoMyApproveList_(true);
    },
    goDetail(id) {
      this.$tools.navTo({
        url: "./detail?id=" + id,
        title: "查看详情",
      });
    },
    add() {
      this.$tools.navTo({
        url: "./form",
        title: "添加申请",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 180rpx);
  margin-top: 20rpx;
}
.approve-list {
  background-color: $uni-bg-color;
  margin: $u-mp-20;
  position: relative;
  &:first-child {
    margin-top: 0;
  }
  .detail {
    padding: 20rpx;
  }
  .process-type {
    top: 10rpx;
    right: 20rpx;
    position: absolute;
    font-size: 48rpx;
  }
  image {
    width: 30rpx;
    height: 30rpx;
    vertical-align: middle;
  }
  .u-padd-l0 {
    padding-left: 20rpx;
  }
}
</style>
