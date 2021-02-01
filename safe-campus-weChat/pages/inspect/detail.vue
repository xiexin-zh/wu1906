<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-h ">
      <view class="u-type-white-bg">
        <view class="u-fx-ac u-bd-b u-padd-20">
          <view class="tip">值班员：</view>
          <view class="u-fx-f1 u-fx-je" @click="add('1')">{{ formData.watch }}</view>
        </view>
        <view class="u-fx-jsb u-bd-b u-padd">
          <view class="tip">值班员电话：</view>
          <view class="u-fx-f1 u-fx-je">
            <input type="number" class="u-font-01 u-tx-r u-padd-r10" v-model="formData.watchPhone" />
          </view>
        </view>
        <view class="u-fx-ac u-bd-b u-padd-20">
          <view class="tip">带班领导：</view>
          <view class="u-fx-f1 u-fx-je" @click="add('2')">{{ formData.leader }}</view>
        </view>
        <view class="u-fx-jsb u-bd-b u-padd">
          <view class="tip">带班领导电话：</view>
          <view class="u-fx-f1 u-fx-je">
            <input type="number" class="u-font-01 u-tx-r u-padd-r10" v-model="formData.leaderPhone" />
          </view>
        </view>
      </view>
      <view>
        <view class="u-type-white-bg u-mar-t20">
          <view class="u-fx-ver u-bd-b u-padd">
            <view class="tip">值班轨迹：</view>
            <view class="u-fx-f1 u-fx-je">
              <view class="u-fx-f1" id="container"> </view>
            </view>
          </view>
        </view>
        <view class="u-type-white-bg u-mar-t20">
          <view class="u-fx-ac u-bd-b u-padd-20">
            <view>巡查状态：</view>
            <view class="u-fx-f1 u-fx-je u-tx-r">
              <view>{{formData.patrolStatus === '1' ? '正常' : '异常'}}</view>
            </view>
          </view>
          <view class="u-fx-ver u-bd-b u-padd">
            <view class="u-mar-t10">内容上报：</view>
            <view>
              <view class="u-font-01 u-mar-t20">{{formData.reportContent}}</view>
              <image class="u-mar-t20 u-mar-r20" :src="img" v-for="(img,index) in formData.pictureList" :key="index"></image>
            </view>
          </view>
        </view>
      </view>
		</scroll-view>
  </view>
</template>

<script>
  import vConsole from 'vconsole'
  import { store, actions } from './store/index.js'
  export default {
    data () {
      return {
        formData: {}
      }
    },
    mounted () {
      new vConsole()
      this.inspectId = this.$tools.getQuery().get('id') 
			this.inspectDetailGet()
    },
    methods: {
       async inspectDetailGet () {
        const res =await actions.getInspectDetail(this.inspectId)
        this.formData = res.data
        console.log('res.data',this.formData.track.length>0)
        if(this.formData.track.length>0){
          this.map = new qq.maps.Map(document.getElementById('container'), {
            center: new qq.maps.LatLng(res.data.track[0].latitude, res.data.track[0].longitude),
            zoom: 16
          })
          const arr = res.data.track.map(item => {
            return new qq.maps.LatLng(item.latitude, item.longitude)
          })
          var polyline = new qq.maps.Polyline({
            path: arr,
            strokeColor: '#3385ff',
            strokeWeight: 4,
            map: this.map
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 10rpx)
}
#container {
  width: 300rpx;
  height: 300rpx;
}
image {
  width: 120rpx;
  height: 120rpx;
}
</style>
