<template>
  <view>
		<view class="banner u-fx-ac-jc">
			总分:{{total}}分
		</view>
    <scroll-view scroll-y="true"  class="scroll-h u-bg-fff">
			<view class="u-bd-b" v-for="(list,i) in eduInfo.eduItemsDtos" :key="list.id">
        <view>
					<view class="edu-box u-fx-jsb">
						<view class="u-fx-f1"> {{list.name}} </view>
						<view class="score"> {{list.score}}分 </view>
					</view>
					<view class="u-fx-jsb edu-list" v-for="(item,index) in list.indexDtoList" :key="item.id">
						<view> {{item.name}} </view>
						<sunui-stepper 
						  :label="index" 
						  :max="item.oldScore > 0 ? item.oldScore : 0" 
						  :min="item.oldScore > 0 ? 0 : item.oldScore"
						  :val="item.score" 
							@change="valChange($event,i)"
						></sunui-stepper>
					</view>
				</view>
      </view>
    </scroll-view>
		<view class="submit-btn">
			<u-button type="primary" @click="submitForm">提交</u-button>
		</view>
  </view>
</template>

<script>
  import eventBus from '@u/eventBus'
	import { store, actions } from './store/index.js'
	export default {
		data() {
			return {
				isDorm: false,
				total:0,
				score:0,
				eduInfo: {},
				eduId: ''
			}
		},
		watch: {
			eduInfo: {
				handler () {
					this.total = 0
					this.eduInfo.eduItemsDtos.map(el=>{
						this.total += el.score
					})
					this.total += this.eduInfo.baseScore
				},
				deep: true
			}
		},
		mounted() {
			this.isDorm = this.$tools.getQuery().get('type') === 'dorm'
			this.eduId = this.$tools.getQuery().get('id')
			this.recordGet()
    },
    methods: {
			valChange (val, index) {
				this.eduInfo.eduItemsDtos[index].indexDtoList[val.label].score = val.val
				const data = this.eduInfo.eduItemsDtos
				this.getSum(data)
			},
			async recordGet () {
				const action = this.isDorm ? 'getEduDetailDorm' : 'getEduDetail'
				const res = await actions[action](this.eduId)
				this.eduInfo = res.data
				this.eduInfo.eduItemsDtos=this.eduInfo.eduItemsDtos.map(el => {
					return {
						...el,
						score: 0,
						indexDtoList:el.indexDtoList.map(item => {
							return {
								oldScore: item.score,
								...item,
							}
						})
					}
				})
				this.getSum(this.eduInfo.eduItemsDtos)
			},
			getSum (data) {
				for (let i = 0; i < data.length; i++) { 
					data[i].score = 0
					for (let j = 0; j < data[i].indexDtoList.length; j++) {
						data[i].score = data[i].indexDtoList[j].score + data[i].score
					}
				}
			},
			async submitForm () {
				this.eduInfo.assessedCode = store.userInfo.userCode
				this.eduInfo.assessedName = store.userInfo.userName
				const action = this.isDorm ? 'addScoreDorm' : 'addScore'
				const res = await actions[action](this.eduInfo)
				this.$tools.toast("操作成功", 'success')
        this.$tools.goNext(() => {
          eventBus.$emit("getList")
          this.$tools.goBack()
        });
			}
    }
	}
</script>

<style lang="scss">
	.banner {
		height: 180rpx;
		background: url(../../static/img/score.png);
		background-size: 100% 100%;
		color:#fff;
		font-size: 46rpx;
		font-weight: bold;
	}
  .scroll-h {
		height: calc(100vh - 300rpx);
		padding-top: 20rpx;;
  }
  .submit-btn {
    height: 120rpx;
		padding: 20rpx
	}
	.edu-box {
		// height: 60rpx;
		// line-height: 60rpx;
		background-color: #F0F4FF;
		padding: 10rpx 20rpx;
		.score {
			width: 96rpx;
			text-align: right;
		}
	}
	.edu-list {
		// height: 70rpx;
		// line-height: 50rpx;
		padding: 10rpx 20rpx;
	}
</style>
