<template>
  <view class="map u-page u-fx-ver">
    <iframe id="mapPage" width="100%" height="100%" frameborder=0
      src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=SI5BZ-RTZRQ-2YD52-GAIRP-Z2CBK-7SFIC&referer=myapp">
    </iframe>
  </view>
</template>

<script>
import vConsole from 'vconsole'
import wx from 'weixin-js-sdk'
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
    this.init()
  },
  methods: {
    init(){
      window.addEventListener('message', event =>  {
        // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
        var loc = event.data;
        if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
            console.log('location', loc); // 获取的选中的地址数据
            this.$tools.navTo({
              url: `./index?adress=${loc.poiaddress}`
            })
        }
        return false
      }, false)
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
