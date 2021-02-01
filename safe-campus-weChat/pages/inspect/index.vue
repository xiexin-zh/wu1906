<template>
  <view class="inspect u-pages">
    <scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h u-padd-t20">
      <no-data v-if="dataList && dataList.length === 0" msg="暂无数据"></no-data>
      <view class="inspect-list u-mar-b20 u-mar-l20 u-mar-r20 u-border-radius" v-for="(item, i) in dataList" :key="i" v-else>
        <view class="detail u-fx u-padd-20 u-mar-b20">
          <view class="info u-fx-ac" @click="detail(item)">
            <view class="list u-fx-f1 u-line3">
              <view class="name u-fx u-main-color u-font-1">
                <image :src="item.watchAvatar"></image>
                <view class="u-mar-l20">
                  <view> {{item.watch}} </view>
                  <view class="u-mar-l10 u-font-02 u-tips-color"> {{item.watchJob && item.watchJob.length > 0 ? item.watchJob.join(',') : '暂无'}} </view>
                </view>
              </view>
              <view class="u-fx-jsb">
                <view>
                  <view class="u-mar-t10">
                    <text class="u-tips-color"> 开始时间： </text>
                    {{ item.startTime | gmtToDate }}
                  </view>
                  <view class="u-mar-t10">
                    <text class="u-tips-color"> 结束时间： </text>
                    {{ item.endTime | gmtToDate }}
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view :class="['status', 'u-tx-c', 'u-type-white','u-border-radius', item.patrolStatus === '1' ? 'u-type-primary-bg' : item.patrolStatus === '0' ? 'u-type-error-bg' : 'u-type-warning-bg']">
          {{ item.patrolStatus === '1' ? '正常' : item.patrolStatus === '0' ? '异常' : '--'}}
        </view>
      </view>
    </scroll-view>
    <view class="footer-btn u-fx-ac">
      <u-button type="primary" class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg" @click="submit">
        巡查值班
      </u-button>
    </view>
  </view>
</template>

<script>
import wxApi from '@u/wxApi'
import eventBus from '@u/eventBus'
import noData from '@/components/no-data/no-data.vue'
import { store, actions } from './store/index.js'
export default {
  components: {
    noData
  },
  data() {
    return {
      pageList: {
        pages: 1,
        size: 15
      },
      morePage: false,
      dataList: []
    }
  },
  async mounted() {
    wxApi.getConfig();
    eventBus.$on('getList', () => {
    	this.showList()
    })
    this.showList()
  },
  methods: {
    detail(item) {
      this.$tools.navTo({
        url: `./detail?id=${item.id}`
      })
    },
    async showList(tag = false) {
      if (tag) {
        this.pageList.pages += 1
      } else {
        this.pageList.pages = 1
      }
      this.pageList.schoolCode = store.userInfo.schoolCode
      const res = await actions.getInspectList(this.pageList)
      this.total = res.data.total
      if (tag) {
        this.dataList = this.dataList.concat(res.data.records)
      } else {
        this.dataList = res.data.records
      }
      this.morePage = res.data.hasNextPage
    },
    loadMore() {
      if (!this.morePage) {
        this.$tools.toast('数据已加载完毕')
        return
      }
      this.showList(true)
    },
    submit() {
      this.$tools.navTo({
        url: './submit'
      })
    }
  }
}
</script>

<style lang="scss">
.scroll-h {
  height: calc(100vh - 100rpx);
  .inspect-list {
    background-color: $uni-bg-color;
    position: relative;
    .detail {
      position: relative;
      .info {
        width: 100%;
      }
    }
    .status {
      position: absolute;
      top: 2rpx;
      right: 2rpx;
      width: 110rpx;
      height: 50rpx;
      line-height: 50rpx;
    }
  }
  .name {
    image {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
    }
  }
}
</style>
