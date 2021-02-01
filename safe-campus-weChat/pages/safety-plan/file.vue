<template>
	<view class="home u-fx-f1 u-fx-ver">
		<view class="title u-bold u-mar-40 u-fx-ac-jc u-type-white u-font-3">
			{{name}}
		</view>
		<view class="conter-box" v-html="content"></view>
	</view>
</template>
<script>
	import {
		store,
		actions
	} from './store/index.js';
	export default {
		computed: {
			userInfo: () => store.userInfo
		},
		data() {
			return {
        content: '',
        name: ''
			};
		},
		async mounted() {
      this.detailId = this.$route.query.id
      this._getTemplateDetail()
    },
		methods: {
      async _getTemplateDetail() {
        const res = await actions.getTemplateDetail(this.detailId)
        this.name = res.data.name
        this.content = res.data.content
      }
    }
	};
</script>
<style lang="scss" scoped>
	.home {
    width: 100%;
    height:calc(100vh - 0rpx);
    background: url('/mobile-img/bg.png') center center no-repeat;
    background-size: 100% 100%;
		.conter-box{
      height: 100%;
			margin: 60rpx 70rpx 120rpx 70rpx;
      overflow-y: scroll;
		}
	}
</style>
