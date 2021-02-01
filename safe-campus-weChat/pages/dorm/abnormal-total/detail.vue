<template>
  <view class="abnoram-detail u-page u-fx u-fx-ver">
    <view class="banner-img banner-kqtj"></view>
    <scroll-view scroll-y="true" class="scroll-h">
      <component :is="currentCom" :query="$route.query"></component>
    </scroll-view>
  </view>
</template>

<script>


import DormExcDetail from '../component/DormExcDetail'
import ParentExcDetail from '../component/ParentExcDetail'
import mixins from '../../../utils/mixins'
import { store, actions } from '../store/index.js';
export default {
  name: 'AbnormalDetail',
  mixins: [mixins],
  computed: {
    currentCom () {
      return store.userInfo.typeCode === '16' ? ParentExcDetail : DormExcDetail
    },
  },
  data () {
    return {
      query: {}
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
	.banner-img {
		width: 100%;
		height: 240rpx;
		background: url('http://canpointtest.com/mobile-img/kqtj.png') no-repeat;
		background-size: 100% 240rpx;
	}
	.scroll-h {
		height: calc(100vh - 240rpx);
	}
</style>
