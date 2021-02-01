<template>
  <view class="accident u-page">
    <view class="dropDown u-fx">
      <ms-dropdown-menu>
        <ms-dropdown-item v-model="type" :list="searchData.accidentType"></ms-dropdown-item>
      </ms-dropdown-menu>
      <ms-dropdown-menu>
        <ms-dropdown-item v-model="state" :list="searchData.accidentState"></ms-dropdown-item>
      </ms-dropdown-menu>
      <ms-dropdown-menu>
        <ms-dropdown-item v-model="level" :list="searchData.accidentLevel"></ms-dropdown-item>
      </ms-dropdown-menu>
    </view>
    <no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
    <scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h u-padd-t10" v-else>
      <view class="accident-list u-mar-b20 u-mar-l20 u-mar-r20" v-for="item in dataList" :key="item.id">
        <view class="detail u-fx u-padd-20 u-mar-b20">
          <view class="info u-fx-ac" @click="detail(item)">
            <view class="list u-fx-f1 u-line3">
              <view class="name u-fx-jsb u-font-1">
                <view class="u-padd-l20"> {{ item.title }} </view>
                <view class="state">
                  <view class="state-title u-font-01 u-type-white">{{ item.level | accidentLevel }} </view>
                  <image
                    class="state-img"
                    :src="`/mobile-img/accident-${
                      item.level === '1' ? 'td' : item.level === '2' ? 'zd' : item.level === '3' ? 'jd' : 'yb'
                    }.png`"
                  ></image>
                </view>
              </view>
              <view class="u-fx-ver">
                <view class="u-fx-jsb u-mar-t10">
                  <text class="u-tips-color"> 事故填报学校： </text>
                  <text>{{ item.schoolName }} </text>
                </view>
                <view class="u-fx-jsb u-mar-t10">
                  <text class="u-tips-color"> 事故发生地点： </text>
                  <text>{{ item.location }} </text>
                </view>
                <view class="u-fx-jsb u-mar-t10">
                  <text class="u-tips-color"> 事故发生时间： </text>
                  <text>{{ item.happenTime | gmtToDate('date') }} </text>
                </view>
                <view class="u-fx-jsb u-mar-t10">
                  <text class="u-tips-color"> 死亡人数： </text>
                  <text>{{ item.deathNum }} </text>
                </view>
                <view class="u-fx-jsb u-mar-t10">
                  <text class="u-tips-color"> 受伤人数： </text>
                  <text>{{ item.injuredNum }} </text>
                </view>
                <view class="u-fx-jsb u-mar-t10">
                  <text class="u-tips-color"> 事故分类： </text>
                  <text>{{ item.type | accidentType }} </text>
                </view>
                <view class="u-fx-jsb u-mar-t10">
                  <text class="u-tips-color"> 事故性质： </text>
                  <text>{{ item.nature | accidentNature }} </text>
                </view>
                <view class="u-fx-jsb u-mar-t10">
                  <text class="u-tips-color"> 事故现状态： </text>
                  <text>{{ item.nowStatus }} </text>
                </view>
              </view>
              <view class="check u-fx-jsb u-mar-t10 u-padd-t10">
                <view> 查看详情 </view>
                <view class="u-tips-color"> > </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="float-add-btn" @click="addAccident"> </view>
  </view>
</template>

<script>
import eventBus from '@u/eventBus'
import noData from '@/components/no-data/no-data.vue'
import { store, actions } from './store/index.js'
import searchData from './assets/search.js'
import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue'
import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue'
export default {
  components: {
    noData,
    msDropdownMenu,
    msDropdownItem
  },
  data() {
    return {
      searchData,
      pageList: {
        page: 1,
        size: 15
      },
      morePage: false,
      dataList: [],
      type: '0',
      state: '0',
      level: '0'
    }
  },
  watch: {
    type(val, old) {
      if (val !== old) {
        this.showList()
      }
    },
    state(val, old) {
      if (val !== old) {
        this.showList()
      }
    },
    level(val, old) {
      if (val !== old) {
        this.showList()
      }
    }
  },
  async mounted() {
    eventBus.$on('getList', () => {
      this.showList()
    })
    this.showList()
  },
  methods: {
    async showList(tag = false) {
      if (tag) {
        this.pageList.page += 1
      } else {
        this.pageList.page = 1
      }
      const req = {
        ...this.pageList,
        schoolCodeList: [store.userInfo.schoolCode],
        accidentType: this.type === '0' ? '' : this.type,
        accidentNature: this.state === '0' ? '' : this.state,
        accidentLevel: this.level === '0' ? '' : this.level
      }
      const res = await actions.getAccidentList(req)
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
    //详情
    detail(item) {
      this.$tools.navTo({
        url: `./detail?id=${item.id}&state=${item.nowStatus}`
      })
    },
    addAccident() {
      this.$tools.navTo({
        url: './add',
        title: '上报事故'
      })
    }
  }
}
</script>

<style lang="scss">
.accident {
  .scroll-h {
    height: calc(100vh - 130rpx);
    .accident-list {
      background-color: $uni-bg-color;
      border-radius: 16rpx;
      position: relative;
      .detail {
        position: relative;
        .info {
          width: 100%;
          .name {
            border-bottom: 1px solid #f5f5f5;
            position: relative;
            &::before {
              position: absolute;
              content: '';
              background-color: #0088ff;
              width: 8rpx;
              height: 36rpx;
              left: 0;
              top: 10rpx;
            }
            .state {
              position: relative;
              .state-title {
                position: absolute;
                right: -15rpx;
                width: 180rpx;
                top: -5rpx;
                z-index: 99;
                text-align: right;
              }
              .state-img {
                width: 180rpx;
                height: 58rpx;
                position: absolute;
                right: -30rpx;
              }
            }
          }
          .check {
            border-top: 1px dashed #ccc;
          }
        }
      }
    }
  }
}
.dropdown {
  padding: 4rpx 18rpx 18rpx 18rpx;
  background: $uni-bg-color;
  font-size: 12px;
}
.dropdown-menu {
  width: 50%;
  padding: 2rpx 0;
  border: 1rpx solid $u-border-color;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
}
.dropdown-menu:first-child {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}
.dropdown-menu:last-child {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.dropdown-item__selected {
  padding: 10rpx;
}
@font-face {
  font-family: 'iconfont'; /* project id 1564327 */
  src: url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.eot');
  src: url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.eot?#iefix') format('embedded-opentype'),
    url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.woff2') format('woff2'),
    url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.woff') format('woff'),
    url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.ttf') format('truetype'),
    url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.svg#iconfont') format('svg');
}
</style>
