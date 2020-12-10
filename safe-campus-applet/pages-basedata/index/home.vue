<template>
	<view class="mini-home">
		<main-com v-if="current === 0"></main-com>
		<concat-com v-if="current === 1"></concat-com>
		<mine-com v-if="current === 2"></mine-com>
		<footer-bottom @change="change"></footer-bottom>
	</view>
</template>

<script>
	import { store } from '@store'
	import baseData from '@u/base-data'
	import footerBottom from '../common/footerBottom.vue'
	import mainCom from './mainCom.vue'
	import concatCom from '../contact/contactCom.vue'
	import mineCom from '../mine/mineCom.vue'
	import eventBus from '@u/eventBus'
	export default {
		components: {
			footerBottom,
			mainCom,
			concatCom,
			mineCom
		},
		computed: {
			currentUserType:() => store.currentUserType
		},
		data () {
			return {
				baseData,
				current: 0
			}
		},
		async mounted() {
			this.$tools.showLoading()
			// 用户初次绑定之后加载
			eventBus.$on('loginOk', () => {
				this.getBaseInfo()
			})
			this.getBaseInfo()
		},
		methods: {
			getBaseInfo () {
				console.log('获取用户信息')
				// 获取用户所关联的信息
				baseData.getBaseInfo(() => {
					if (this.currentUserType === '4') {
						this.baseData.getClassList()
					} else {
						this.baseData.getChildList()
					}
				})
			},
			change (index) {
				this.current = index
			}
		}
	}
</script>

<style>
</style>
