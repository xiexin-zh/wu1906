<template>
  <view>
		<view class="banner u-fx-ver">
			<view class="rank-title">本班排名：{{sort}}</view>
    	<view class="u-fx-f1 u-fx img-box">
        <view class="u-fx-f1 img-two">
          <view class="title-two">
            <view class="score-size">{{scoreTwo}}</view>
            <view class="u-font-02 u-tips-color">{{classTwo}}</view>
          </view>
        </view>
        <view class="u-fx-f1 img-one">
          <view class="title-one">
            <view class="score-size">{{scoreOne}}</view>
            <view class="u-font-02 u-tips-color">{{classOne}}</view>
          </view>
        </view>
        <view class="u-fx-f1 img-three">
          <view class="title-three">
            <view class="score-size">{{scoreThree}}</view>
            <view class="u-font-02 u-tips-color">{{classThree}}</view>
          </view>
        </view>
		</view>
		</view>
    <scroll-view scroll-y="true"  class="scroll-h u-bg-fff">
			<view v-for="list in eduInfo.eduItemsDtos" :key="list.id">
        <view>
					<view class="edu-box u-font-1 u-fx-jsb">
						<view class="u-fx-f1"> {{list.name}} </view>
						<view class="score"> {{list.score}}分 </view>
					</view>
					<view class="u-fx-jsb edu-list" v-for="item in list.indexDtoList" :key="item.id">
						<view class="u-fx-f1">{{item.name}}</view>
						<view class="score">{{item.score}}</view>
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
				isDorm: false,
				total:0,
				score:0,
				eduInfo: {},
        categoryDutyId:'',
        categoryId:'',
        beAssessedCode:'',
        scoreOne:'',
        classOne:'',
        scoreTwo:'',
        classTwo:'',
        scoreThree:'',
        classThree:'',
        sort:0
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
			this.categoryDutyId = this.$tools.getQuery().get('categoryDutyId')
			this.categoryId = this.$tools.getQuery().get('categoryId')
      this.beAssessedCode = this.$tools.getQuery().get('beAssessedCode')
			this.rankGet()
			this.recordGet()
    },
    methods: {
      async rankGet () {
        const req = {
          categoryId: this.categoryId,
          categoryDutyId: this.categoryDutyId,
          beAssessedCode: this.beAssessedCode
        }
				const action = this.isDorm ? 'getEduRankDorm' : 'getEduRank'
				const res = await actions[action](req)
        this.sort = res.data.sort
        this.scoreOne = res.data.list.length === 0 ? '暂无' : res.data.list[0].score
        this.scoreTwo = res.data.list.length <= 1 ? '暂无' : res.data.list[1].score
        this.scoreThree = res.data.list.length <= 2 ? '暂无' : res.data.list[2].score
				if(this.isDorm){
					this.classOne = res.data.list.length === 0 ? '' : res.data.list[0].buildingName + res.data.list[0].floorName + res.data.list[0].beAssessedName
					this.classTwo = res.data.list.length === 0 ? '' : res.data.list[1].buildingName + res.data.list[1].floorName + res.data.list[1].beAssessedName
					this.classThree = res.data.list.length === 0 ? '' : res.data.list[2].buildingName + res.data.list[2].floorName + res.data.list[2].beAssessedName
				} else {
					this.classOne = res.data.list.length === 0 ? '': res.data.list[0].gradeName + (store.userInfo.schoolType === '8' || store.userInfo.schoolType === '9' ? res.data.list[0].professionName : '') + res.data.list[0].beAssessedName
					this.classTwo = res.data.list.length <= 1 ? '': res.data.list[1].gradeName + (store.userInfo.schoolType === '8' || store.userInfo.schoolType === '9' ? res.data.list[1].professionName : '') + res.data.list[1].beAssessedName
					this.classThree = res.data.list.length <= 2 ? '': res.data.list[2].gradeName + (store.userInfo.schoolType === '8' || store.userInfo.schoolType === '9' ? res.data.list[2].professionName : '') + res.data.list[2].beAssessedName
				}
			},
			async recordGet () {
				const action = this.isDorm ? 'getEduDetailDorm' : 'getEduDetail'
				const res = await actions[action](this.categoryDutyId)
				this.eduInfo = res.data
				this.eduInfo.eduItemsDtos = this.eduInfo.eduItemsDtos.map(el => {
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
				this.getSum(this.eduInfo.eduItemsDtos)
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
	.banner {
    height: 480rpx;
    background-color: #fff;
    padding: 40rpx 50rpx 0 50rpx;
    font-size: 38rpx;
    font-weight: bold;
    .rank-title {
      height: 90rpx;
      text-align: center;
    }
    .img-box {
      align-items: baseline;
      text-align: center;
      .img-two {
        position: relative;
        height: 300rpx;
        background-image: url(../../static/img/two.png);
        background-size: 100% 100%;
        
      }
      .title-one,
      .title-two,
      .title-three {
        position: absolute;
        left: 27%;
        transform: translateX(-20%);
        top: 43%;
      }
      .img-one {
        height: 360rpx;
        position: relative;
        background: url(../../static/img/one.png);
        background-size: 100% 100%;
        margin: 0 60rpx;
      }
      .img-three {
        position: relative;
        height: 270rpx;
        background: url(../../static/img/three.png);
        background-size: 100% 100%;
      }
    }
	}
  .scroll-h {
		height: calc(100vh - 480rpx);
		padding-top: 20rpx;;
  }
	.edu-box {
		background-color: #F0F4FF;
    padding: 20rpx 20rpx;
    
	}
	.edu-list {
		color: $u-content-color;
		padding: 20rpx 20rpx;
  }
  .score {
    width: 95rpx;
    text-align: right;
  }
</style>
