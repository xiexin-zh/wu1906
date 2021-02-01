<template>
  <view>
    <scroll-view scroll-y="true" class="scroll-h">
      <image class="image" :src="detailInfo.thumbnailUrl"></image>
      <view class="u-mar-b10">
        <u-tabs
          :list="list"
          height="102"
          bar-width="120"
          bar-height="4"
          :is-scroll="false"
          :current="current"
          active-color="#0084FF"
          inactive-color="#333333"
          font-size="28"
          @change="change"
        >
        </u-tabs>
      </view>
      <view class="" v-if="current === 0">
        <view class="card u-fx-ac u-padd-20">
          <view class="rigth">
            <u-row>
              <u-col class="u-mar-b10 u-blod">
                {{ detailInfo.name }}
              </u-col>
            </u-row>
            <u-row>
              <u-col class="u-mar-t10 u-tips-color u-font-02">
                资源类型：{{ detailInfo.classType }}
              </u-col>
            </u-row>
            <u-row>
              <u-col class="u-mar-t10 u-tips-color u-font-02">
                适用学段：{{ detailInfo.section }}
              </u-col>
            </u-row>
            <view gutter="16" class="u-padd-l10 u-padd-r10">
              <view class="u-mar-t10 u-fx-f1 u-tips-color u-font-02"> 课程简介： </view>
              <view class="u-mar-t10 u-mar-l30 u-fx-f4  u-tips-color u-font-02">
                <jyf-parser :html="detailInfo.des" ref="article"></jyf-parser>
              </view>
            </view>
          </view>
        </view>
        <u-cell-group v-for="(item, index) in detailInfo.planList" :key="index">
          <u-cell-item :arrow="false">
            <view slot="title"> 教案{{ index + 1 }}：{{ item.name }} </view>
            <view class="right-icon" slot="right-icon">
              <u-button
                type="primary"
                :custom-style="customStyle"
                @click="classesBegin(index)"
                size="mini"
                >开始上课</u-button
              >
            </view>
          </u-cell-item>
        </u-cell-group>
      </view>
      <view v-if="current === 2" class="resources-cont u-bg-fff">
        <u-cell-group>
          <u-cell-item
            v-for="(item, index) in detailInfo.resourceList"
            :key="index"
            :arrow="false"
            :label="item.docSize | dosizeformat"
            :title="item.name | nameFormat"
          >
            <!-- <u-icon
              class="u-mar-r10 left-icon"
              slot="icon"
              size="50"
              name="search"
            ></u-icon> -->
            <view class="right-icon" slot="right-icon">
              <u-button
                type="primary"
                :custom-style="customStyle"
                @click="downFile(item.resourceUrl)"
                size="mini"
                >下载</u-button
              >
            </view>
          </u-cell-item>
        </u-cell-group>
        <view class="list"> </view>
      </view>
    </scroll-view>
  </view>
</template>
<script>
import eventBus from "@u/eventBus";
import { store, actions } from "./store/index.js";
export default {
  components: {},
  data() {
    this.id = this.$tools.getQuery().get("id");
    return {
      customStyle: {
        borderRadius: "40px", // 注意驼峰命名，并且值必须用引号包括，因为这是对象
        color: "#fff",
        // display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center',
      },
      list: [
        {
          name: "课程详情",
        },
        {
          name: "课后习题",
        },
        {
          name: "相关资源",
          count: 5,
        },
      ],
      current: 0,
      detailInfo: {},
    };
  },
  async created() {
    this.showDetail();
  },
  methods: {
    change(index) {
      this.current = index;
      if (index === 1) {
        this.$tools.navTo({
          url: `./exercise?id=${this.id}`,
        });
      }
    },
    async showDetail() {
      const req = {
        id: this.id,
        schoolCode: store.userInfo.schoolCode,
        source: "3",
        userName: store.userInfo.userName,
      };
      const res = await actions.classroomInfo(req);
      this.detailInfo = res.data;
    },
    classesBegin(index) {
      this.$tools.navTo({
        url: `./classBegin?id=${this.id}&index=${index}`,
      });
    },
    //下载
    downFile(url) {
      this.$tools.downloadFile(url);
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-h {
  // height: calc(100vh - 10rpx);
  .image {
    width: 100%;
    height: 420rpx;
  }
  .card {
    display: flex;
    background: #ffffff;
    margin-bottom: 10rpx;
    .left {
      width: 220rpx;
      .image-icon {
        width: 100%;
      }
    }

    .rigth {
      width: 100%;
    }
  }
  .resources-cont {
    .left-icon {
      margin-top: 15rpx;
    }
    .right-icon {
      margin-top: 15rpx;
    }
  }
}
</style>
