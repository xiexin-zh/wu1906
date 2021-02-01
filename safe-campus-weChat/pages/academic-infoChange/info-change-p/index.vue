<template>
  <view class="list-box">
    <scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h">
      <view class="u-auto">
        <no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
        <view class="u-padd-20">
          <view
            class="list u-padd-10 u-bg-fff"
            v-for="item in dataList"
            :key="item.id"
            @click="goDetail(item.id)"
          >
            <view class="user-name u-mar-t20 u-padd-10">
              <text class="name">{{ item.studentName }}</text>
              <u-tag
                :text="getStatus(item.auditStatus)[0]"
                :type="getStatus(item.auditStatus)[1]"
                mode="dark"
                shape="square"
                class="status"
              />
            </view>
            <view class="u-padd-10">
              <text class="u-tips-color">原专业班级：</text
              >{{ item.oldClassInfo }}
            </view>
            <view class="into u-padd-10 u-mar-b20">
              <text class="u-tips-color">转入专业班级：</text
              >{{ item.newClassInfo }}
            </view>
            <view class="apply-msg u-padd-10 u-mar-b20 u-fx-jsb">
              <view>
                <text class="u-tips-color">
                  申请人：{{
                    item.creatorCode === userInfo.userCode
                      ? "我"
                      : item.creatorName
                  }}
                </text>
              </view>
              <view>
                <text class="u-tips-color"
                  >申请时间：{{
                    Tools.getDateTime(item.createTime, "dateTime")
                  }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="add-btn" @click="toAdd">+</view>
  </view>
</template>

<script>
import eventBus from "@u/eventBus";
import noData from "@/components/no-data/no-data.vue";
import { store, actions } from "../store/index.js";
import Tools from "@u/tools";
export default {
  name: "InfoChange-T",
  components: {
    noData,
  },
  data() {
    return {
      Tools,
      pageList: {
        page: 1,
        size: 20,
      },
      morePage: false,
      dataList: [],
    };
  },
  computed: {
    userInfo() {
      return store.userInfo;
    },
  },
  watch: {},
  created() {},
  mounted() {
    eventBus.$on("getList", () => {
      this.showList();
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
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        currentUserCode: this.userInfo.userCode,
        source: "3",
      };
      const res = await actions.getChangeListPage(req);
      if (tag) {
        this.dataList = this.dataList.concat(res.data.records);
      } else {
        this.dataList = res.data.records;
      }
      this.morePage = res.data.current < res.data.pages;
    },
    loadMore() {
      if (!this.morePage) {
        this.$tools.toast("数据已加载完毕");
        return;
      }
      this.showList(true);
    },
    toAdd() {
      this.$tools.navTo({
        url: `./form`,
      });
    },
    goDetail(id) {
      this.$tools.navTo({
        url: `../component/detail?id=${id}`,
      });
    },
    getStatus(val) {
      if (val === "2") {
        return ["审批通过", "success"];
      }
      if (val === "3") {
        return ["审批拒绝", "error"];
      }

      return ["审批中", "warning"];
    },
  },
};
</script>

<style lang="scss" scoped>
.list-box {
  height: 100vh;
  overflow: hidden;
  position: relative;
}
.scroll-h {
  height: 100vh;
}

.list {
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  .user-name {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .name {
      font-weight: 600;
      font-size: 34rpx;
      letter-spacing: 2px;
    }

    .status {
      width: 150rpx;
      text-align: center;
    }
  }
}
.list:last-child {
  margin-bottom: 80rpx;
}

.apply-msg {
  border-top: 1px solid #eee;
  padding-top: 30rpx;
}

.add-btn {
  position: absolute;
  right: 0;
  bottom: 100rpx;
  margin-left: -30rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  font-size: 60rpx;
  text-align: center;
  line-height: 75rpx;
  background-color: #2979ff;
  color: #fff;
  font-weight: 900;
}
</style>
