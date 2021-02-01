<template>
  <view>
		<scroll-view  scroll-y="true" class="scroll-h">
      <view class="collapse-box" v-for="list in detailInfo.itemList" :key="list.id">
        <u-collapse :item-style="itemStyle">
          <u-collapse-item :title="list.name">
            <view class="content-title u-padd-l20 u-padd-r20 u-fx-jsb u-font-01 u-main-color">
              <view> 检查标准 </view>
              <view> 不符合/符合 </view>
            </view>
            <view class="add-item u-paddl-20 u-padd-20 u-bd-b" v-for="item in list.standardList" :key="item.id">
              <view class="u-fx-jsb">
                <view class="u-fx-f1 u-content-color"> {{item.itemName}} </view>
                <view class="switch u-tx-r">
                  <u-switch v-model="item.checked" size="28"></u-switch>
                </view>
              </view>
              <view class="check">
                <u-tag v-if="!item.checked" size="mini" text="上报隐患" shape="circle" @click="add(item)"/>
              </view>
              <view class="u-fx-jsb u-type-primary u-mar-t20 u-font-02" v-for="el in item.dangerList" :key="el.dangerCode">
                <view> 隐患编号：{{el.dangerCode}} </view>
                <view> 上报人：{{el.userName}} </view>
              </view>
            </view>
          </u-collapse-item>
        </u-collapse>
      </view>
      <view class="u-padd-l20 record"> 流水记录 </view>
      <view class="u-padd-20 u-type-white-bg">
				<view class="step">
          <view v-if="detailInfo.processList && detailInfo.processList.length === 0">暂无数据</view>
					<view
            v-else
						class="step-list u-fx-ac"
						v-for="(data, index) in detailInfo.processList"
						:key="index"
					>
						<view class="left-w" style="position: relative;">
							<view class="tips"></view>
						</view>
						<view
							class="u-fx-ac u-fx-f1 step-item u-padd-20 u-type-white-bg u-border-radius"
						>
							<view class="u-fx-f1 u-mar-l">
								<view class="u-mar-t10">{{ data.content }}</view>
							</view>
							<view class="u-padd-l40">{{ data.time | gmtToDate("dateTime") }}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
    <view class="footer-btn u-fx-ac">
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
        @click="submit"
      >
      {{ btn }}
      </u-button>
    </view>
  </view>
</template>

<script>
import eventBus from '@u/eventBus'
import { store, actions } from './store/index.js'
export default {
  data () {
    return {
      detailInfo: {},
      itemStyle:{
        background:'#fff',
        paddingLeft:'20rpx',
        paddingRight:'20rpx',
        marginBottom:'20rpx'
      },
      taskId: '',
      btn: ''
    }
  },
  mounted () {
    this.taskId = this.$tools.getQuery().get('id')
    this.state = this.$tools.getQuery().get('state')
    this.btn = this.state === '1' ? '提交' : '审核'
    this.taskResultGet()
  },
  methods: {
    async taskResultGet () {
      const res =await actions.getSpecialDetail(this.taskId)
      this.detailInfo = res.data
      this.detailInfo.itemList = this.detailInfo.itemList.map(el => {
        return {
          ...el,
          standardList: el.standardList.map(item => {
            return {
              ...item,
              checked: true
            }
          })
        }
      })
    },
    add (item) {
      console.log('item',item)
      this.$tools.navTo({
        url: `./add?name=${item.itemName}&id=${item.id}&state=${this.state}&spcialId=${this.taskId}`
      })
    },
    submit () {
      const resultList = []
      this.detailInfo.itemList.map(el => {
        el.standardList.map(item => {
          resultList.push({id: item.id, result: item.checked ? '1' : '0' })
        })
      })
      const req = {
        resultList: resultList,
        submitType: this.state,
        taskId: this.taskId,
        userCode: store.userInfo.userCode,
        userName: store.userInfo.userName
      }
      this.$tools.confirm("确定提交检查结果吗？", () => {
        actions.checkSpecial(req).then(res => {
          this.$tools.toast('提交成功')
          this.$tools.goNext(() => {
            eventBus.$emit('getList')
            this.$tools.navTo({
              url: './index'
            })
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 120rpx);
 .content-title {
   height: 70rpx;
   background-color: #eee;
   align-items: center;
  }
  .add-item {
    align-items: center;
  }
}
	.step-list {
		border-left: 1px $u-light-color solid;
		margin: 0 $u-mp-30;
		.tips {
			z-index: 99;
			top: -10rpx;
			position: absolute;
			left: -12rpx;
			width: 20rpx;
			height: 20rpx;
			border-radius: 100%;
			background-color: $u-type-primary;
		}
		min-height: 120rpx;
		.sjx {
			left: -40rpx;
			position: absolute;
			z-index: 99;
			width: 0px;
			height: 0px;
			border-left: 20rpx transparent solid;
			border-right: 20rpx $u-type-white solid;
			border-top: 20rpx transparent solid;
			border-bottom: 20rpx transparent solid;
		}
  }
  .switch {
    width: 80rpx;
  }
  .check {
    margin-top: 5rpx;
    height: 30rpx;
  }
  .record {
    height: 60rpx;
    line-height: 40rpx;
  }

</style>
