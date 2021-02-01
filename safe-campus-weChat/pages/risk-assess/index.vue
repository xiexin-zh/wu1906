<template>
  <view>
    <u-select v-model="siteTag" :list="siteList" @confirm="confirm" :default-value="defaultValue"></u-select>
    <view class="u-fx-ac u-bd-b u-padd u-type-white-bg">
        <view>风险类型:</view>
        <view @click="choose" class="u-fx-f1 u-fx-je u-content-color">
          <text v-if="!categoryName">请选择</text>
          <view> {{categoryName}} </view>
        </view>
        <view class="rit-icon"></view>
      </view>
    <scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h u-padd-20">
      <no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
      <view
        class="approve-list u-border-radius u-type-white-bg"
        v-for="(item, i) in dataList"
        :key="i"
        @click="goDetail(item)"
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
    </scroll-view>
  </view>
</template>
<script>
import eventBus from "@u/eventBus"
import noData from "@/components/no-data/no-data.vue"
import { store, actions } from "./store/index.js"
export default {
  components: {
    noData
  },
  data() {
    return {
      pageList: {
        page: 1,
        size: 15,
      },
      morePage: false,
      dataList: [],
      siteTag: false,
      categoryName: '',
      categoryCode: '',
      siteList: [],
      defaultValue: []
    };
  },
  async mounted() {
    this.riskCategory_()
  },
  methods: {
     async riskCategory_() {
      const res = await actions.riskCategory()
      this.siteList = res.data.map(el=>{
        return {
          label: el.categoryName,
          value: el.categoryCode,
        }
      })
      this.siteList.unshift({label:'全部',value:''})
      this.categoryName = this.siteList[0].label
      this.categoryCode = this.siteList[0].value
      this.defaultValue = [0]
      this.riskIAssessList_()
    },
    choose(){
      this.siteTag = true
    },
    confirm(e) {
      if (!e) {
        return;
      }
      this.categoryName = e[0].label
      this.categoryCode = e[0].value
      this.siteList.forEach((el, index) => {
        if(el.value === e[0].value) {
          this.defaultValue = [index]
        }
      });
      this.riskIAssessList_()
    },
    async riskIAssessList_(tag = false) {
      if (tag) {
        this.pageList.page += 1;
      } else {
        this.pageList.page = 1;
      }
      const req = {
        ...this.pageList,
        schoolCode: store.userInfo.schoolCode,
        categoryCode: this.categoryCode
      };
      const res = await actions.riskIAssessList(req);
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
        this.riskIAssessList_(true);
    },
    goDetail(record) {
      const req = {
        name: record.name,
        checkObject: record.checkObject,
        riskContent: record.riskContent,
        accidentType: record.accidentType,
        methodCode: record.methodCode,
      }
      this.$tools.navTo({
        url: `./add?id=${record.id}&state=${record.assessStatus}&req=${JSON.stringify(req)}`,
        title: "风险评估"
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 70rpx);
}
</style>
