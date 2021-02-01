<template>
	<view class="container">
		<view>
      <view class="set_box" v-for="list in dayInfo" :key="list.id">
        <view class="set_time u-tx-r">
          <view class="u-mar-l20 u-mar-t40">{{list.title}}</view>
        </view>
        <!-- 步骤条 -->
        <view class="set-1 u-mar-t10 u-mar-b20">
          <view class="set-2">
            <view class="right u-fx u-mar-l20">
              <view>
                <image 
                  v-if="list.title === '上午班'"
                  :src="list.item[0].morningOnSnacpUrl ? list.item[0].morningOnSnacpUrl : '/mobile-img/Default_touxiang@2x.png'"
                  ></image>
                <image 
                  v-if="list.title === '下午班'" 
                  :src="list.item[0].noonOnSnacpUrl ? list.item[0].noonOnSnacpUrl : '/mobile-img/Default_touxiang@2x.png'"
                  ></image>
              </view>
              <view class="u-fx-ver u-mar-l40">
                <view class="detail">上班打卡
                  <view class="state">
                    <u-tag 
                      :bg-color="(list.item[0].morningOnState === '3' || list.item[0].morningOnState === '6') ? '#ff5454' :
                      list.item[0].morningOnState === '1' ? '#f5b111' :
                      list.item[0].morningOnState === '2' ? '#ff9900' :
                      list.item[0].morningOnState === '4' ? '#cccccc' :
                      list.item[0].morningOnState === '5' ? '#0084ff' : ''" 
                      v-if="list.title === '上午班' && list.item[0].morningOnState" 
                      :text="$tools.getState(parseInt(list.item[0].morningOnState))" 
                      mode="dark" 
                    />
                    <u-tag 
                      :bg-color="(list.item[0].noonOnState === '3' || list.item[0].noonOnState === '6') ? '#ff5454' :
                      list.item[0].noonOnState === '1' ? '#f5b111' :
                      list.item[0].noonOnState === '2' ? '#ff9900' :
                      list.item[0].noonOnState === '4' ? '#cccccc' :
                      list.item[0].noonOnState === '5' ? '#0084ff' : ''" 
                      v-if="list.title === '下午班' && list.item[0].noonOnState" 
                      :text="$tools.getState(parseInt(list.item[0].noonOnState))" 
                      mode="dark" 
                    />
                  </view>
                </view>
                <view class="time u-mar-t20 u-fx-ac">
                  <image src="/mobile-img/kq-time.png"></image>
                  <view v-if="list.title === '上午班'" class="u-mar-l10"> 
                    <text v-if="list.item[0].morningOnRealTime"> {{list.item[0].morningOnRealTime | gmtToDate('time')}}</text>
                    <text v-else> --:--</text>
                  </view>
                  <view v-if="list.title === '下午班'" class="u-mar-l10">
                    <text v-if="list.item[0].noonOnRealTime"> {{list.item[0].noonOnRealTime | gmtToDate('time')}} </text>
                    <text v-else> --:--</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="set-2">
            <view class="right u-fx u-mar-l20 u-mar-t40">
              <view>
                <image 
                  v-if="list.title === '上午班'" 
                  :src="list.item[1].morningOffSnacpUrl ? list.item[1].morningOffSnacpUrl : '/mobile-img/Default_touxiang@2x.png'" 
                  ></image>
                <image 
                  v-if="list.title === '下午班'" 
                  :src="list.item[1].noonOffSnacpUrl ? list.item[1].noonOffSnacpUrl : '/mobile-img/Default_touxiang@2x.png'" 
                  ></image>
              </view>
              <view class="u-fx-ver u-mar-l40">
                <view class="detail">下班打卡
                  <view class="state">
                    <u-tag 
                      :bg-color="(list.item[1].morningOffState === '3' || list.item[1].morningOffState === '6') ? '#ff5454' :
                      list.item[1].morningOffState === '1' ? '#f5b111' :
                      list.item[1].morningOffState === '2' ? '#ff9900' :
                      list.item[1].morningOffState === '4' ? '#cccccc' :
                      list.item[1].morningOffState === '5' ? '#0084ff' : ''" 
                      v-if="list.title === '上午班' && list.item[1].morningOffState"  
                      :text="$tools.getState(parseInt(list.item[1].morningOffState))" 
                      mode="dark" 
                    />
                    <u-tag 
                      :bg-color="(list.item[1].noonOffState === '3' || list.item[1].noonOffState === '6') ? '#ff5454' :
                      list.item[1].noonOffState === '1' ? '#f5b111' :
                      list.item[1].noonOffState === '2' ? '#ff9900' :
                      list.item[1].noonOffState === '4' ? '#cccccc' :
                      list.item[1].noonOffState === '5' ? '#0084ff' : ''" 
                      v-if="list.title === '下午班' && list.item[1].noonOffState"
                      :text="$tools.getState(parseInt(list.item[1].noonOffState))" 
                      mode="dark" 
                    />
                  </view>
                </view>
                <view class="time u-mar-t20 u-fx-ac">
                  <image src="/mobile-img/kq-time.png"></image>
                  <view v-if="list.title === '上午班'" class="u-mar-l10"> 
                    <text v-if="list.item[1].morningOffRealTime"> {{list.item[1].morningOffRealTime | gmtToDate('time')}} </text>
                    <text v-else> --:--</text>
                  </view>
                  <view v-if="list.title === '下午班'" class="u-mar-l10"> 
                    <text v-if="list.item[1].noonOffRealTime"> {{list.item[1].noonOffRealTime | gmtToDate('time')}} </text>
                    <text v-else> --:--</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
		</view>
	</view>
</template>

<script>
import { store, actions } from '../store/index.js'
	export default {
		data() {
			return {
        dayInfo: []
			}
    },
    methods: {
      
    }
	}
</script>

<style lang="scss" scoped>
	.set_box {
		width: 100%;
		display: flex;
		flex-direction: row;
	}
	/* 左侧时间 */
	.set_time {
    width: 20%;
		position: relative;
		view {
			width: 100%;
			position: absolute;
		}
	}
	/* 右侧内容 */
	.set-1 {
		width: 80%;
	
	.set-2 {
      margin-left: 100rpx;
      position: relative;
      .right{
        .detail{
          font-size:28rpx;
          margin-bottom: 10rpx;
          position: relative;
          .state {
            position: absolute;
            top: -10rpx;
            right: -80rpx;
          }
        }
      }
    }
    .set-2::after {
      content: '';
      /* 必须存在如果没有图标就留空 */
      top: 55rpx;
      /* 定位 距离*/
      border-left: #c6c6c6 1px solid;
      /* 横线颜色 */
      left: -44rpx;
      /* 定位 距离*/
      height: 120%;
      /* 高度 */
      position: absolute;
      /* 定位 */
      }
    }
	.set-2::before {
		content: "\e64d";
		/* 必须存在如果没有图标就留空 */
		color: $u-type-primary;
		/* 设置颜色 */
		position: absolute;
		/* 定位 */
		left: -60upx;
		top: 30rpx;
		/* 移动到左边 */
		font-weight: bold;
		/* 图标样式在复制的图标文件中复制相对应的图标样式必须存在 */
		font-family: "iconfont" !important;
		/* 图标样式在复制的图标文件中复制相对应的图标样式必须存在 */
		font-size: 34upx;
		/* 图标大小 */
		font-style: normal;
		/* 图标样式在复制的图标文件中复制相对应的图标样式必须存在 */
		-webkit-font-smoothing: antialiased;
		/* 图标样式在复制的图标文件中复制相对应的图标样式必须存在 */
		-moz-osx-font-smoothing: grayscale;
		/* 图标样式在复制的图标文件中复制相对应的图标样式必须存在 */
    z-index: 1;
	}
	@font-face {
		font-family: "iconfont";
		src: url('//at.alicdn.com/t/font_1337773_f06f5a7las.eot?t=1565581133395');
		/* IE9 */
		src: url('//at.alicdn.com/t/font_1337773_f06f5a7las.eot?t=1565581133395#iefix') format('embedded-opentype'),
			/* IE6-IE8 */
			url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAOIAAsAAAAAB8QAAAM7AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDMgqCRIIjATYCJAMUCwwABCAFhG0HZhvNBsiemjwJqJERRCC3tX4YOM4iqNbCnr29uw8wKGBUsUAKqDyCjY5HcEzCALron1wr8wDk8hKBFpIc5yaXfWZJoIBIQkF1KlvVqWuFfZ3c/CBw0p8fcMJJsQY6uIuEMk8188LgXgfHTJceiXlrm0tGajTgaMCz2T6yyf5BXh+Ef9BdxMSIS9cTaKmvYGbzFhRXA1sZ2C0QO7cRAdhadnmkNTSEqufYLM4qNdKx9AJn+M/Hb2OiQVIWwL6rNufIIP1bj29voaZspAiK/byITqLAaEAmdvX6d7KQ+dEstCw2tjQL0FJDkvZald8e//3y+WglCIaW0E/e5R8vERWvuTWY5RYy3/ywXBtKXBEF395EBN++FCQ8V5CWsmEt4CBgHMz1Ad8rde7s2LbD7oUhT3l+eWHbhxwOB+LFrfkVL7I3FIAWdpdWvfHiYt8FltYWdzy1Pz/WfPhQ/elT7efPvUJiVlRsIj8+18X3az7+5Wb48vVrbnvo7OndVe1cPc55k2ebWG7OmMgYX01bT3vJnNlJWtemes0mn3vI/PJl80NQQqVErfcH/Ys5Fy3evrVoyyZNDLSq/cp5EyYsKTbb69bD/+5fmPs/cFwxG9ABoCNdTY+AKrwdi2npHk0Xu4vMH/Q7Wl+4+Yftkv83kMHXTiVutOlsnh68ZYPZit+hmDmRSxVwlDnvxvI8WOq3gz4VCy3xE8Id/d7H2GV2M6Ghi4ak1gcKDYORGTsaSq2Mg0rDTGhplLyTW+mEsRC5BUYadyC0dwpJWw+h0N53ZMb+glJX/6DSPgpoaUN4nLOVobGtZdYuJHAkQ7EbqiVqwMjF7UVrJSKKTmCmitNrETOpUzAiNLxZykMGxPY4wNRBIjnHEDOqh7nOzZBOR6GRUQ2SeKiKc2NiWBju+6JQieqBvbkYRMAhMkjUDVKTUAaYzufsW99fCSEUOgI20rMQr4UwJurloQihwmcg8/SGWT3v8hKTDkQkjsMgjKH0oFzHi+hgnoKM/VtpIBIulGpF1ihRmDcLz9WHnm/Uv0BZNAD40zJSFJGjjEq77dsEg1ahKoF2qbupYvP0KNS2e69WbmucSNZAOpEa5XpUagAAAA==') format('woff2'),
			url('//at.alicdn.com/t/font_1337773_f06f5a7las.woff?t=1565581133395') format('woff'),
			url('//at.alicdn.com/t/font_1337773_f06f5a7las.ttf?t=1565581133395') format('truetype'),
			/* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
			url('//at.alicdn.com/t/font_1337773_f06f5a7las.svg?t=1565581133395#iconfont') format('svg');
		/* iOS 4.1- */
	}
	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	.icon-yuandian:before {
		content: "\e64d";
	}
	.icon-dingweiweizhi:before {
		content: "\e619";
  }
  .u-size-default{
    padding: 5rpx 10rpx;
  }
  .set_box {
    &:last-child {
      .set-2 {
        &:last-child::after{
          border: none;
        }
      }
    }
  }
  image {
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
  }
  .time {
    image {
      width: 20rpx;
      height: 20rpx;
    }
  }
</style>
