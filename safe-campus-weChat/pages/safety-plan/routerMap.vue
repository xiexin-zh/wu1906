<template>
	<view class="home u-fx-f1 u-padd-20 u-padd-t30  u-fx-ver">
		<view class="page u-fx-je  u-mar-b20">
			共<text class="u-mar-l10 u-mar-r10 u-type-primary">{{length}}</text>张
		</view>
		<u-swiper :list="list" :height='430'></u-swiper>
	</view>
</template>
<script>
	import { actions } from './store/index.js'
	export default {
		data() {
			return {
        list: [],
        length: 0
			};
		},
		async mounted() {
      this.detailId = this.$route.query.id
      this._getTemplateRoute()
    },
		methods: {
      async _getTemplateRoute() {
        const res = await actions.getTemplateRoute({emergencyId: this.detailId})
        this.list = res.data.map(el => {
          return{
            ...el,
            title: el.name,
            image: el.photoUrl
          }
        })
        this.length = res.data.length
      }
		}
	};
</script>

<style lang="scss" scoped>
	.home {
		.wrap {
			padding: 40rpx;
		}
	}
</style>
