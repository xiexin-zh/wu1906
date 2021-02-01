<template>
  <view>
    <scroll-view scroll-y="true"  class="scroll-h u-bg-fff">
			<view v-for="list in eduItemsDtos" :key="list.id">
        <view>
					<view class="edu-box u-fx-jsb">
						<view class="u-fx-f1"> {{list.name}} </view>
						<view class="score"> {{list.score}}分 </view>
					</view>
					<view class="u-fx-jsb edu-list" v-for="item in list.indexDtoList" :key="item.id">
						<view class="u-fx-f1"> {{item.name}} </view>
						<view class="score"> {{item.score}} </view>
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
		data() {
			return {
				total: 0,
				score: 0,
        categoryDutyId: '',
        categoryId: '',
        beAssessedCode: '',
        eduItemsDtos: [],
				detailId: ''
			}
		},
		mounted() {
			this.detailId = this.$tools.getQuery().get('id')
			this.recordGet()
    },
    methods: {
			async recordGet () {
				const res = await actions.getStuDetail(this.detailId)
				const data = res.data
				this.eduItemsDtos = data.eduItemsDtos.map(el => {
					return {
						...el,
						score: 0,
						indexDtoList: el.indexDtoList.map(item => {
							return {
								oldScore: item.score,
								...item,
							}
						})
					}
				})
				this.getSum(this.eduItemsDtos)
			},
			getSum (data) {
				for (let i = 0; i < data.length; i++) { 
					data[i].score = 0
					for (let j = 0; j < data[i].indexDtoList.length; j++) {
						data[i].score = data[i].indexDtoList[j].score + data[i].score
					}
				}
			}
    }
	}
</script>

<style lang="scss">
  .scroll-h {
		height: 100vh;
  }
	.edu-box {
		// height: 60rpx;
		// line-height: 60rpx;
		background-color: #F0F4FF;
		padding: 10rpx 20rpx;
	}
	.edu-list {
		// height: 70rpx;
		// line-height: 50rpx;
		padding: 10rpx 20rpx;
	}
	.score {
    width: 95rpx;
    text-align: right;
  }
</style>
