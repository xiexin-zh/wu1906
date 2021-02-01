<template>
  <view>
    <scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h u-padd-t20">
      <view v-if="current === 0"> 
        <no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
        <view
          class="approve-list u-border-radius"
          v-for="(item, i) in dataList"
          :key="i"
        >
          <view class="detail u-fx-ver u-padd u-mar-b20">
            <view class="u-fx-f1" @click="add(2,item)">
              <view class="u-main-color u-font-1 u-mar-t20">
                <view>
                  {{ item.name }}
                  <u-tag
                    v-if="item.status === '1'"
                    mode="dark"
                    type="error"
                    text="未开始"
                    class="u-mar-l20"
                  />
                  <u-tag
                    v-if="item.status === '2'"
                    mode="dark"
                    type="success"
                    text="进行中"
                    class="u-mar-l20"
                  />
                  <u-tag
                    v-if="item.status === '3'"
                    mode="dark"
                    type="info"
                    text="已完成"
                    class="u-mar-l20"
                  />
                </view>
              </view>
              <view class="u-tips-color u-mar-t20"
                >项目类型：{{ item.typeName }}
              </view>
              <view class="u-tips-color u-mar-t20"
                >评估方式：{{ item.methodName }}
              </view>
              <view class="u-tips-color u-mar-t20"
                >创建时间：{{ item.createTime | gmtToDate("dateTime") }}
              </view>
            </view>
            <view class="bottom u-fx-jsb u-mar-t20 u-padd-t10 u-bd-t" v-if="item.status === '1'">
              <view class="u-fx-f1 u-tx-c u-bd-r" @click="publish(item)"> 
                <u-icon :name="`${/mobile-img/}risk-fabu.png`" color="#0084FF" size="32"></u-icon>
                <text class="u-padd-20"> 发布 </text>
              </view>
              <view class="u-fx-f1 u-bd-r u-tx-c" @click="add(1,item)"> 
                <u-icon name="edit-pen" color="#0084FF" size="38"></u-icon>
                <text class="u-padd-20"> 编辑 </text>
              </view>
              <view class="u-fx-f1 u-tx-c" @click="del(item)"> 
                <u-icon name="trash-fill" color="#fa3534" size="38"></u-icon>
                <text class="u-padd-20"> 删除 </text>
              </view>
            </view>
            <view class="bottom u-fx-jsb u-mar-t20 u-padd-t10 u-bd-t" v-else @click="add(2,item)">
              <view class="u-fx-f1 u-tx-c"> 
                <u-icon name="list-dot" color="#0084FF" size="38"></u-icon>
                <text class="u-padd-20"> 查看 </text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-if="current === 1"> 
        <no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
        <view
          class="approve-list u-border-radius"
          v-for="(item, i) in dataList"
          :key="i"
          @click="goDetail(item.id)"
        >
          <view class="detail u-fx-ver u-padd u-mar-b20">
            <view class="u-fx-f1">
              <view class="u-main-color u-font-1 u-mar-t20"> {{ item.name }} </view>
              <view class="u-tips-color u-mar-t20"
                >检查对象：{{ item.checkObject }}
              </view>
              <view class="u-tips-color u-mar-t20"
                >潜在风险：{{ item.riskContent }}
              </view>
              <view class="u-tips-color u-mar-t20"
                >评估状态：
                <text  :class="item.assessStatus === '1' ? 'u-type-error': 'u-type-primary'"> {{item.assessStatus === '1' ? '未评估' : '已评估'}} </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="footer-btn u-fx-ac" v-if="current === 0">
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
        @click="add(0)"
      >
        新增风险辨识
      </u-button>
    </view>
  </view>
</template>
<script>
import eventBus from "@u/eventBus";
import noData from "@/components/no-data/no-data.vue";
import { store, actions } from "./store/index.js";
export default {
  components: {
    noData
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
      current: 0
    };
  },
  async mounted() {
    eventBus.$on("getList", () => {
      this.getRiskIdentify_();
    });
    this.getRiskIdentify_();
  },
  methods: {
    async getRiskIdentify_(tag = false) {
      if (tag) {
        this.pageList.page += 1;
      } else {
        this.pageList.page = 1;
      }
      const req = {
        ...this.pageList,
        schoolCode: store.userInfo.schoolCode
      };
      const res = await actions.getRiskIdentify(req);
      if (tag) {
        this.dataList = this.dataList.concat(res.data.records);
      } else {
        this.dataList = res.data.records;
      }
      this.morePage = res.data.hasNextPage;
    },
    loadMore() {
      if (!this.morePage) {
        this.$tools.toast("数据已加载完毕");
        return;
      }
      this.getRiskIdentify_(true)
    },
    goDetail(id) {
      this.$tools.navTo({
        url: "./detail?id=" + id,
        title: "查看详情",
      });
    },
    add(type, record) {
      uni.setStorageSync('chooseList', [])
      this.$tools.navTo({
        url: `./add?type=${type}&id=${type ? record.id : ''}`,
        title: "风险辨识",
      });
    },
    del(record){
      console.log('record',record)
       this.$tools.confirm("确定删除吗？", () => {
        actions.delRiskIdentify(record.id).then((res) => {
          this.$tools.toast("删除成功")
          this.$tools.goNext(() => {
            this.getRiskIdentify_()
          })
        })
      })
    },
    publish(record){
      this.$tools.confirm("确定发布吗？", () => {
        actions.publishRiskIdentify(record.id).then((res) => {
          this.$tools.toast("发布成功")
          this.$tools.goNext(() => {
            this.getRiskIdentify_()
          })
        })
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 100rpx);
}
.approve-list {
  background-color: $uni-bg-color;
  margin: $u-mp-20;
  position: relative;
  &:first-child {
    margin-top: 0;
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
.bottom {
  height: 60rpx;
  line-height: 70rpx;
}
</style>
