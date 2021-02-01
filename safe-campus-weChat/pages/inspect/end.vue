<template>
  <view>
    <scroll-view scroll-y="true" class="scroll-h">
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
      <view class="u-type-white-bg u-mar-t20">
        <view class="u-fx-ver u-bd-b u-padd">
          <view class="tip">值班轨迹：</view>
          <view class="u-fx-f1 u-fx-je">
            <view class="u-fx-f1" id="container"></view>
          </view>
        </view>
      </view>
      <view class="u-type-white-bg u-mar-t20">
        <view class="u-fx-ac u-bd-b u-padd-20">
          <view>巡查状态：</view>
          <view class="u-fx-f1 u-fx-je u-tx-r">
            <view>异常</view>
            <u-switch size="40" class="u-mar-l10 u-mar-r10" v-model="status"></u-switch>
            <view>正常</view>
          </view>
        </view>
        <view class="u-fx-ver u-bd-b u-padd">
          <view>内容上报：</view>
          <view class="u-mar-t10">
            <textarea
              class="item-text-area u-font-01"
              v-model="formData.content"
              placeholder="请填写详细的问题描述"
            />
          </view>
          <an-upload-img v-model="photoUrl" total="9" style="margin: 20rpx"></an-upload-img>
        </view>
      </view>
    </scroll-view>
    <view class="footer-btn u-fx-ac u-bg-color">
      <u-button type="primary" class="u-fx-f1 u-mar-l u-mar-r" @click="submitForm">上报</u-button>
    </view>
  </view>
</template>

<script>
import eventBus from '@u/eventBus'
import validateForm from '@u/validate'
import anUploadImg from '@/components/an-uploadImg/an-uploadImg'
import { store, actions } from './store/index.js'
const yzForm = {
  content: '请填写详细的问题描述'
}
export default {
  components: {
    anUploadImg
  },
  data() {
    return {
      formData: {},
      status: false,
      photoUrl: []
    }
  },
  mounted() {
    this.inspectId = this.$tools.getQuery().get('inspectId')
    this.track = JSON.parse(this.$tools.getQuery().get('track'))
    if (this.track.length > 0) {
      this.map = new qq.maps.Map(document.getElementById('container'), {
        center: new qq.maps.LatLng(this.track[0].latitude, this.track[0].longitude), // 地图的中心地理坐标。
        zoom: 16
      })
      const arr = this.track.map((item) => {
        return new qq.maps.LatLng(item.latitude, item.longitude)
      })
      var polyline = new qq.maps.Polyline({
        path: arr,
        strokeColor: '#3385ff',
        strokeWeight: 4,
        map: this.map
      })
    }
    this.inspectDetailGet()
  },
  methods: {
    async inspectDetailGet() {
      const res = await actions.getInspectDetail(this.inspectId)
      this.formData = res.data
    },
    submitForm() {
      validateForm(yzForm, this.formData, () => {
        if (!this.formData.content) {
          return this.$tools.toast('请填写详细的问题描述')
        }
        let req = {
          ...this.formData,
          track: this.track,
          id: this.inspectId,
          status: this.status ? '1' : '0'
        }
        if(this.photoUrl && this.photoUrl.length > 0){
          req.pictureList = this.photoUrl.map((el) => {
            return el.url
          })
        }
        this.$tools.confirm('确定上报巡查结果吗？', () => {
          actions.endInspect(req).then((res) => {
            this.$tools.toast('上报成功')
            this.$tools.goNext(() => {
              eventBus.$emit('getList')
              this.$tools.navTo({
                url: './index'
              })
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
}
.uni-input-placeholder,
.uni-textarea-placeholder {
  color: $u-light-color;
}
.item-text-area {
  height: 120rpx;
  width: 100%;
  line-height: 40rpx;
}
#container {
  height: 600rpx;
}
</style>
