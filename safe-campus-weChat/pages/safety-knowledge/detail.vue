<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-h" >
      <view class="card u-fx">
        <view class="left u-fx-ac-jc">
          <image class="image" src="/mobile-img/iconKlg@2x.png"></image>
        </view>
        <view class="rigth">
            <u-row>
              <u-col class="u-mar-t30 ">
                {{detailInfo.name}}
              </u-col>
            </u-row>
            <u-row>
              <u-col class="u-mar-t10 u-tips-color u-font-02">
                资源类型：{{detailInfo.category}}
              </u-col>
            </u-row>
            <u-row>
              <u-col class="u-mar-t10 u-tips-color u-font-02">
                 文件类型：{{detailInfo.fileTypeName}}
              </u-col>
            </u-row>
            <u-row>
              <u-col class="u-mar-t10 u-tips-color u-font-02">
                发布时间：{{detailInfo.createTime | gmtToDate}}
              </u-col>
            </u-row>
        </view>
      </view>
      <view class="cont u-bg-fff u-border-radius-middle u-padd-20">
        <image class="image u-border-radius-middle" :src="detailInfo.thumbnailUrl "></image>
        <u-row>
          <u-col >
            <jyf-parser :html="detailInfo.des" ref="article"></jyf-parser>
          </u-col>
        </u-row>
      </view>
		</scroll-view>
  </view>
</template>
<script>
import eventBus from '@u/eventBus'
import { store, actions } from './store/index.js'
export default {
  components: {
  },
  data () {
    this.id = this.$tools.getQuery().get('id')
    return {
      // src1:require('./assets/img/icon@2x.png'),
     detailInfo:{},
    }
  },
  async mounted () {
    this.showDetail()
  },
  
  methods: {
    async showDetail() {
       const req = {
        id: this.id,
        schoolCode: store.userInfo.schoolCode,
        source: '3',
        userName: store.userInfo.userName
      }
      const res = await actions.klgInfo(req)
      this.detailInfo = res.data
    },
   
  }
}
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 88rpx);
  padding: 20rpx;
  .card{
    display: flex;
    height: 238rpx;
    background: #FFFFFF;
    box-shadow: 0rpx 5rpx 13rpx 0rpx rgba(0, 0, 0, 0.06);
    border-radius: 16rpx 20rpx 20rpx 20rpx;
    margin-bottom: 20rpx;
    .left{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 220rpx;
      .image{
        width: 109rpx;
        height: 157rpx;
      }
    }
    .rigth{
      width: 100%;
    }
  }
  .image{
				width: 100% ;
				height: 334rpx;
	}
}
</style>
