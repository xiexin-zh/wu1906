<template>
  <view class="result u-fx-ver">
    <scroll-view :scroll-y="true" @scrolltolower="loadMore" class="scroll-h">
      <view class="u-auto u-padd-20">
        <no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
        <view class="list u-bg-fff u-mar-b20" v-for="item in dataList" :key="item.id">
          <view
            class="u-fx-jsb u-fx-ac u-mar-l20 u-mar-r20 u-mar-b20 u-padd-t20"
          >
            <text class="user-name">{{ item.userName }}</text>
            <text class="u-tips-color">{{
              $tools.getDateTime(item.time, "noSecond")
            }}</text>
          </view>
          <view class="u-mar-l20 u-mar-r20 u-mar-b20">
            <text class="content u-tips-color">{{ item.content }}</text>
          </view>
          <view class="img-box u-mar-l20 u-mar-r20 u-mar-b20 u-mar-t40">
            <image
              v-for="(el, index) in item.photoUrlList"
              :key="index"
              @click="goImgList(index, item.photoUrlList)"
              :src="el"
              class="upImg"
            ></image>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="upload u-fx-ac-jc">
      <u-button style="width: 100%" type="primary" @click="submitForm"
        >上传心得</u-button
      >
    </view>
  </view>
</template>

<script>
import noData from "@/components/no-data/no-data.vue";
import $tools from "@u/tools";
import { store, actions } from "../store";
export default {
  name: "TrainResult",
  components: {
    noData,
  },
  data() {
    return {
      $tools,
      dataList: [],
      pageList: {
        size: 20,
        page: 1,
      },
    };
  },
  watch: {
    $route(to, from, next) {
      if (from.path.includes("train-result/upload")) {
        this.pageList = {
          size: 20,
          page: 1,
        };
        this.showList();
      }
    },
  },
  created() {
    this.listId = this.$route.query.id;
  },
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
      const req = {
        ...this.pageList,
        trainingPlanId: this.listId,
      };
      const res = await actions.getFeelList(req);
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
    goImgList(index, photoList) {
      uni.setStorageSync("imgPreviewPicList", photoList);
      this.$tools.navTo({
        url: "./imgList?index=" + index,
      });
    },
    submitForm() {
      this.$tools.navTo({
        url: "./upload?id=" + this.listId,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.result {
  height: 100vh;
  overflow: hidden;
}
.scroll-h {
  flex: 1;
  overflow-y: auto;
  .list {
    border-radius: 16rpx !important;
    padding-bottom: 32rpx;

    &:last-child {
      border-bottom: 1px solid #fff;
    }

    .user-name {
      font-weight: 800;
      font-size: 36rpx;
    }

    .content {
      line-height: 50rpx;
    }
  }

  .upImg {
    margin-right: 10rpx;
    width: 80rpx;
    height: 80rpx;
  }
}
.upload {
  height: 120rpx;
  padding: 20rpx;
  color: #ffffff;
}
</style>
