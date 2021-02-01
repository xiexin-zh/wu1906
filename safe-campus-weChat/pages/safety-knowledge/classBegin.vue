<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-h" >
      <view class="img—box">
        <u-swiper height='420' mode="number" indicator-pos="topCenter" :list="detailInfo.pictures"></u-swiper>
        <view class="title-name">
          {{detailInfo.name}}
        </view>
      </view>
      <view class="card u-bg-fff u-padd-15 u-mar-t10">
          <u-row>
            <u-col class="u-mar-b10 u-bold">
              教案{{Number(index)+1}}
            </u-col>
          </u-row>
          <u-row>
            <u-col class="u-mar-t10 u-tips-color u-font-02">
              <jyf-parser :html="detailInfo.content" ref="article"></jyf-parser>
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
    return {
      detailInfo:{},
    }
  },
  async created() {
    this.id = this.$tools.getQuery().get('id')
    this.index = this.$tools.getQuery().get('index')
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
      const res = await actions.classroomInfo(req)
      this.detailInfo = res.data.planList[this.index]
      this.detailInfo.pictures = this.detailInfo.pictures.map(el=>{
        return {
          title:'',
          image:el
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 102rpx);
  .img—box{
    position: relative;
    .title-name{
      padding: 10rpx;
      padding-left: 29rpx;
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      background: #000000;
      opacity: 0.5;
      color: #ffff;
    }
  }
}
</style>
