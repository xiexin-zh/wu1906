<template>
  <view class="u-page">
    <view class="list">
      <view class="th u-fx-ac">
        <text class="left">姓名</text>
        <view class="mdl u-fx-ac u-fx-jc">
          <text>性别</text>
        </view>
        <!-- <text class="right">组织机构</text> -->
        <text class="mdr">手机号</text>
        <text class="right">操作</text>
      </view>
      <no-data msg="暂无数据" v-if="groupuserList.length === 0"></no-data>
      <scroll-view
        v-else
        scroll-y="true"
        class="scroll-h"
        @scrolltolower="loadMore"
      >
        <view
          v-for="(item, i) in groupuserList"
          :key="i"
          class="tbody u-bd-b u-fx-ac"
        >
          <text class="left">{{ item.userName }}</text>
          <text class="mdl">{{ item.sex == "1" ? "男" : "女" }}</text>
          <!-- <text class="right">{{ item.orgName }}</text> -->
          <text class="mdr">{{ item.mobile }}</text>
          <u-tag
            class="right"
            text="删除"
            type="error"
            @click="actionsheet(item)"
          />
          <!-- <text class="right" @click="actionsheet(item)">删除</text> -->
        </view>
      </scroll-view>
    </view>
    <view class="foot">
      <view class="float-add-btn" @click="add"></view>
    </view>
  </view>
</template>
<script>
import eventBus from "@u/eventBus";
import noData from "@/components/no-data/no-data.vue";
import { store, actions } from "../store/index.js";
export default {
  components: {},
  data() {
    return {
      pageList: {
        page: 1,
        size: 15,
      },
      morePage: false,
      groupuserList: [],
      ruleGroupCode: "",
      userGroupCode: "",
    };
  },
  mounted() {
    this.ruleGroupCode = this.$tools.getQuery().get("ruleGroupCode");
    this.userGroupCode = this.$tools.getQuery().get("userGroupCode");
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
        schoolCode: store.userInfo.schoolCode,
        ruleGroupCode: this.ruleGroupCode,
        userGroupCode: this.userGroupCode,
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
      };
      const res = await actions.getgroupuserList(req);
      if (tag) {
        this.groupuserList = this.groupuserList.concat(res.data.list);
      } else {
        this.groupuserList = res.data.list;
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
    //删除
    actionsheet(item) {
      console.log(item);
      const req = {
        schoolCode: store.userInfo.schoolCode,
        ruleGroupCode: this.ruleGroupCode,
        userGroupCode: item.userGroupCode,
        userCode: item.userCode,
      };
      this.$tools.confirm("确定删除吗", () => {
        actions.delgroupuserList(req).then((res) => {
          this.$tools.toast("删除成功");
          this.showList();
        });
      });
    },
    add() {
      this.$tools.navTo({
        url:
          "./add?ruleGroupCode=" +
          this.ruleGroupCode +
          "&userGroupCode=" +
          this.userGroupCode,
        title: "添加成员",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  padding: 25rpx 20rpx;
  font-size: 28rpx;
  .th {
    background: #7b92f5;
    padding: 20rpx;
    border-radius: 8rpx;
    color: #fff;
  }
  .tbody {
    position: relative;
    padding: 25rpx 20rpx;
    background: $uni-bg-color;
  }
  .tbody:nth-child(even) {
    background: $u-bg-color;
  }
  .left {
    width: 20%;
    text-align: center;
  }
  .mdl {
    width: 20%;
    text-align: center;
  }
  .mdr {
    width: 40%;
    text-align: center;
  }
  .right {
    width: 20%;
    max-width: 120rpx;
    text-align: center;
  }
}
.scroll-h {
  height: calc(100vh - 100rpx);
}
.foot {
  height: 150rpx;
  .add {
    position: absolute;
    bottom: 40rpx;
    left: calc(50% - 40rpx);
    z-index: 1;
    width: 100rpx;
    height: 100rpx;
    line-height: 80rpx;
    border-radius: 100%;
    background: #0079ff;
    color: #fff;
    font-size: 100rpx;
    text-align: center;
  }
}
.uni-popup__wrapper-box {
  width: 270px;
  height: 179px;
  background: inherit;
  background-color: rgba(255, 255, 255, 1);
  border-width: 1px;
  border: 1px solid rgba(204, 204, 204, 1);
  border-radius: 8px;
  box-shadow: none;
  .modal-ti {
    text-align: center;
    margin-top: 20rpx;
    font-size: 22px;
  }
  .modal-su {
    text-align: center;
    margin-top: 20rpx;
    font-size: 15px;
  }
  .modal-btn {
    text-align: center;
    border-top: 1px solid rgba(204, 204, 204, 1);
    margin-top: 70rpx;
    button {
      margin: 30rpx;
    }
  }
}
</style>
