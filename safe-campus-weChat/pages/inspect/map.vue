<template>
  <view class="map u-page u-fx-ver">
    <view class="map-title u-padd-l20 u-padd-r20 u-font-02">
			<image class="u-mar-r20" src="/mobile-img/safe-jg.png" mode=""></image>
			请勿关闭当前页面，以免丢失轨迹。
		</view>
    <view class="u-fx-f1" id="container"> </view>
    <view class="footer-btn u-fx-ac">
      <u-button type="primary" class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg" @click="submitForm(0)"
        >结束值班</u-button
      > 
      <u-button type="primary" class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg" @click="submitForm(1)"
        >扫码巡查</u-button
      > 
    </view>
  </view>
</template>

<script>
import vConsole from 'vconsole'
import wx from 'weixin-js-sdk'
import validateForm from '@u/validate'
import { store, actions } from './store/index.js'
export default {
  components: {
  },
  data() {
    return {
      currentLocation: {},
			locationList: []
    }
  },
  mounted () {
    new vConsole()
    this.inspectId = this.$tools.getQuery().get('inspectId')
    this.getLocation(true, (data) => {
      console.log('data',data)
      this.map = new qq.maps.Map(document.getElementById("container"), {
        center: new qq.maps.LatLng(data.latitude, data.longitude),      // 地图的中心地理坐标。
        zoom: 16
      });
      this.timer = setInterval(() => {
        this.getLocation()
      }, 5000)
    })
  },
  methods: {
    showMap () {
      console.log('this.locationList',this.locationList)
      const arr = this.locationList.map(item => {
        return new qq.maps.LatLng(item.latitude, item.longitude)
      })
      var polyline = new qq.maps.Polyline({
        path: arr,
        strokeColor: '#3385ff',
        strokeWeight: 4,
        map: this.map
      });
    },
    getLocation (tag, callback) {
      console.log('tag',tag)
      wx.getLocation({
        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: (res) => {
          if (res) {
            console.log('res',res)
            const location = {
              latitude: res.latitude, // 纬度，浮点数，范围为90 ~ -90
              longitude: res.longitude,
              recordTime: new Date()
            }
            if (tag) {
              this.currentLocation = location
              callback(location)
            } else {
              this.locationList.push(location)
              this.showMap()
            }
          }
        }
      });
    },
    submitForm (type) {
      const that = this
      if (type) {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          onlyFromCamera: true,
          success: (res) => {
            let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            const code = result.split('&')[1].split('?')[0]
            const name = result.split('&')[1].split('?')[1]
            that.$tools.navTo({
              url: `./area?name=${name}&code=${code}&inspectId=${this.inspectId}`,
              title: '巡查点'
            })
          }
        })
      } else {
        this.$tools.confirm('确定结束值班吗？', () => {
          this.$tools.navTo({
            url: `./end?inspectId=${this.inspectId}&track=${JSON.stringify(this.locationList)}`,
            title: '巡查值班'
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.map-title {
  height: 60rpx;
  line-height: 60rpx;
  background: #FFC2C2;
  color: #FF3333;
  image {
    width: 25rpx;
    height: 25rpx;
    margin-top: -5rpx;
    vertical-align: middle;
  }
}
.tip::before {
  position: absolute;
  z-index: 99;
  content: '*';
  top: 30rpx;
  color: red;
  font-weight: bold;
  left: 0;
}
.uni-input-placeholder {
  color: $u-light-color;
}
</style>
