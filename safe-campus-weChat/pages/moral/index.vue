<template>
  <view class="moral u-page">
    <view class="nav-tab">
      <view :class="['nav-item',{'active':item.id === currentIndex}]" v-for="item in navs" :key="item.id" @click="tabChange(item.id)">{{item.name}}</view>
    </view>
    <no-data msg="暂无数据~" v-if="moralList.length === 0"></no-data>
    <scroll-view v-else scroll-y="true" class="scroll-h" @scrolltolower="loadMore" >
      <view class="content">
        <view class="record-box">
          <view class="moral-box u-shadow" v-for="(item,index) in moralList" :key="index">
            <view class="moral-info u-fx"> 
							<view class="u-fx-f1 u-fx-ver">
								<view v-if="isDorm" class="moral-pur u-main-color u-font-1">{{ item.buildingName }}{{ item.floorName }}{{ item.beAssessedName }}</view>
							  <view v-else class="moral-pur u-main-color u-font-1">{{ item.gradeName }}{{ isHighSchool ? item.professionName : '' }}{{ item.beAssessedName }}</view>
							  <view class="moral-pur u-main-color u-font-1">{{ item.name }}</view>
								<view class="moral-pur u-light-color u-mar-t">{{ item.remark}}</view>
							</view>
              <view class="u-fx-ver u-type-primary" v-if="item.score || currentIndex === '1'">
                <view class="moral-detail u-font-3">{{ item.score }}</view>
                <view class="u-font-01 u-mar-t u-padd-l u-padd-r u-light-color" @click="detail(item)">查看</view>
              </view>
              <view class="u-fx-ac-jc" v-else>
                <u-button shape="square" size="mini" type="warning" class="custom-style"  @click="add(item.id)">打分</u-button>
              </view>
            </view>
          </view>
        </view>
      </view>
     </scroll-view>
  </view>
</template>

<script>
import eventBus from '@u/eventBus'
import { store, actions } from './store/index.js'
export default {
  data () {
    return {
      moralList: [],
      navs:[{
        id: '1',
        name: '与我有关'
      },
      {
        id: '2',
        name: '我评分的'
      }],
      currentIndex: '1',
      pageList: {
				page: 1,
				size: 15
      },
			isHighSchool: false,
			isDorm: false,
      morePage: false
    }
  },
  mounted () {
		this.isHighSchool = store.userInfo.schoolType === '8' || store.userInfo.schoolType === '9'
		this.isDorm = this.$tools.getQuery().get('type') === 'dorm'
    eventBus.$on('getList', () => {
			this.eduListGet()
    })
    this.eduListGet()
  },
  methods: {
    async eduListGet (tag = false) {
      if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
      }
      const req = {
        schoolCode: store.userInfo.schoolCode,
        schoolYearId: store.schoolYearId,
        page: this.pageList.page,
        size: this.pageList.size,
        type: this.currentIndex,
        userCode: store.userInfo.userCode
      }
			if(this.currentIndex === '1') req.classCode = JSON.parse(uni.getStorageSync('protal')).currentBindClass.classCode
			const action = this.isDorm ? 'getEduListDorm' : 'getEduList'
			const res = await actions[action](req)
      if (tag) {
				this.moralList = this.moralList.concat(res.data.list)
			} else {
				this.moralList = res.data.list;
			}
			this.morePage = res.data.hasNextPage;
    },
    loadMore() {
			if (!this.morePage) {
				this.$tools.toast('数据已加载完毕');
				return;
			}
		  this.eduListGet(true)
		},
    tabChange (type) {
      this.currentIndex = type
      this.eduListGet()
    },
    add (id) {
			this.$tools.navTo({
        url:`./add?id=${id}&type=${this.$tools.getQuery().get('type')}`,
				title: '评分'
			})
		},
    detail (item) {
      this.$tools.navTo({
				url: `./detail?categoryDutyId=${item.id}&categoryId=${item.categoryId}&beAssessedCode=${item.beAssessedCode}&type=${this.$tools.getQuery().get('type')}`,
				title: '查看详情'
			})
    }
  }
}
</script>

<style lang="scss" scoped>
.moral {
  background-color: $u-bg-color;
  .nav-tab {
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background-color: $uni-bg-color;
    margin-bottom: 15rpx;
    .nav-item {
      width: 50%;
      float: left;
      box-shadow: 2rpx 2rpx 8rpx $u-border-color;
    }
    .active {
      border-bottom: 1rpx solid ￥u-border-color-dark;
      background-color: $u-type-primary;
      color: #fff;
    }
  }
  .scroll-h {
    height: calc(100vh - 80rpx);
    .record-box {
      padding: 5rpx 5rpx 0 5rpx; 
      .moral-box {
        margin: $u-mp-20;
				padding: $u-mp-20;
        background-color: $uni-bg-color;
        border-radius: $u-border-radius;
	      overflow: hidden;
        &:first-of-type {
          margin-top: 0;
        }
        .moral-info {
          color: $u-tips-color;
          .moral-pur {
            padding: 4rpx 0;
          }
          .moral-detail {
            padding: 4rpx 0;
            font-weight: bold;
            text-align: center;
          }
          .custom-style {
            width: 120rpx;
            border-radius: 40rpx;
          }
        }
      }
    }
  }
}
</style>
