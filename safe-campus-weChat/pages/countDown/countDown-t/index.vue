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
    <swiper
      class="u-page"
      :current="swiperCurrent"
      @transition="transition"
      @animationfinish="animationfinish"
    >
      <swiper-item class="swiper-item">
        <no-data msg="暂未数据~" v-if="recordList.length === 0"></no-data>
        <scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h">
          <view class="u-of">
            <view v-for="(item, i) in recordList" :key="i">
              <view
                class="u-bg-fff u-padd-b"
                v-if="item.endTime >= new Date().getTime()"
              >
                <view class="u-fx-jsb u-padd-40">
                  <view class="info u-fx-ac u-font-1">
                    应用于{{ item.outCountDownClassDtoList.length }}个班级
                  </view>
                  <view class="u-font-24" @click="actionsheet(item.id)">
                    ...
                  </view>
                </view>
                <view class="down">
                  <view class="count u-content-color">
                    <view class="tips_">
                      距离
                      <text> {{ item.name }}</text>
                      {{ item.tips }}
                    </view>
                    <view
                      class="num_"
                      v-if="
                        Math.ceil(
                          (item.endTime - new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        ) > 1
                      "
                    >
                      <text>
                        {{
                          Math.round(
                            (item.endTime - new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        }}天</text
                      >
                    </view>
                    <view class="num_" v-else>
                      <text>{{
                        formatDuring(item.endTime - new Date().getTime())
                      }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </swiper-item>
      <swiper-item class="swiper-item">
        <no-data v-if="getpastList.length === 0"></no-data>
        <scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h">
          <view class="u-of">
            <view v-for="(item, i) in recordList" :key="i">
              <view
                class="u-bg-fff u-padd-b"
                v-if="item.endTime < new Date().getTime()"
              >
                <view class="u-fx-jsb u-padd-40">
                  <!-- <view class="process-type">
                      <view class="div-btn" @click="deList(item.id)">
                        <u-icon name="trash" color="red" size="38"></u-icon>
                      </view>
                    </view> -->
                  <view class="info u-fx-ac u-font-1">
                    应用于{{ item.outCountDownClassDtoList.length }}个班级
                  </view>
                </view>
                <view class="down">
                  <view class="count u-content-color">
                    <view class="tips">
                      距离
                      <text> {{ item.name }}</text>
                      {{ item.tips }}
                    </view>
                    <view class="num">
                      <text> 0天</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
    <view class="foot">
      <view class="float-add-btn" @click="add"></view>
    </view>
  </view>
</template>
<script>
import { store, actions } from "./store/index.js";
import noData from "@/components/no-data/no-data.vue";
import eventBus from "@u/eventBus";
export default {
  data() {
    return {
      tabList: [
        {
          name: "进行中",
        },
        {
          name: "已过期",
        },
      ],
      current: 0,
      swiperCurrent: 0,
      recordList: [],
      total: 0,
      pageList: {
        page: 1,
        size: 20,
      },
      morePage: false,
      getpastList: [],
    };
  },
  components: {
    noData,
  },
  filters: {},
  mounted() {
    eventBus.$on("getList", () => {
      this.showList();
    });
    this.showList();
  },
  methods: {
    changeMenu(item) {
      this.swiperCurrent = item;
    },
    animationfinish(e) {
      let current = e.detail.current;
      this.$refs.uTabs.setFinishCurrent(current);
      this.swiperCurrent = current;
      this.current = current;
    },
    transition(e) {
      let dx = e.detail.dx;
      this.$refs.uTabs.setDx(dx);
    },
    async showList(tag = false) {
      if (tag) {
        this.pageList.page += 1;
      } else {
        this.pageList.page = 1;
      }
      const req = {
        schoolCode: store.userInfo.schoolCode,
        ...this.searchObj,
        ...this.pageList,
      };
      const res = await actions.getcountList(req);
      const getpastList = [];
      res.data.list.forEach((el) => {
        if (el.endTime < new Date().getTime()) {
          this.getpastList.push(res.data.list);
        }
      });
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
    add() {
      this.$tools.navTo({
        url: "./form",
        title: "发布倒计时",
      });
    },
    actionsheet(id) {
      console.log(id);
      const arr = ["编辑", "删除"];
      this.$tools.actionsheet(["编辑", "删除"], (index) => {
        if (index == 0) {
          this.$tools.navTo({
            url: `./form?id=${id}`,
            title: "编辑倒数日",
          });
        } else if (index == 1) {
          this.$tools.confirm("确定删除吗", () => {
            actions.delCount(id).then((res) => {
							this.$tools.toast("删除成功", 'success');
							this.$tools.goNext(() => {
							  this.showList();
							});
            });
          });
        }
      });
    },
    //删除
    deList(id) {
      this.$tools.confirm("确定删除吗", () => {
        actions.delCount(id).then((res) => {
          this.$tools.toast("删除成功");
          this.showList();
        });
      });
    },
    formatDuring(mss) {
      var days = parseInt(mss / (1000 * 60 * 60 * 24));
      var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = ((mss % (1000 * 60)) / 1000).toFixed(0);
      return hours + " 小时 " + minutes + " 分钟 ";
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 100rpx);
}
.down {
  background: $u-bg-color;
  border-radius: $u-border-radius;
  letter-spacing: 4rpx;
  width: 80%;
  margin: 0 auto 20rpx auto;
  .count {
    padding: 30px;
    text-align: center;
    .tips_ {
      font-size: 35rpx;
      text {
        color: rgb(41, 121, 255);
      }
    }
    .num_ {
      color: $u-type-primary;
      font-size: 50rpx;
      font-weight: bold;
      padding-top: 20rpx;
    }
    .tips {
      font-size: 35rpx;

      color: #d3d3d3;
    }
    .num {
      color: #d3d3d3;
      font-size: 50rpx;
      font-weight: bold;
      padding-top: 20rpx;
    }
  }
}
.u-font-24 {
  font-size: 48rpx;
  line-height: 0px;
}
</style>
