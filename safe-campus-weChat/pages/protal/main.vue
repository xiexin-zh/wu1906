<template>
	<view class="u-fx-ver">
		<notice-dialog v-if="isShow" @close="close" :detail="detail"></notice-dialog>
		<scroll-view scroll-y="true" class="scroll-h">
			<home v-if="tabIndex === 0"></home>
      <app v-else-if="tabIndex === 1"></app>
			<message v-else-if="tabIndex === 2"></message>
      <mine v-else-if="tabIndex === 3"></mine>
		</scroll-view>
		<footer-com></footer-com>
	</view>
</template>

<script>
import { setStore, store, actions } from './store/index.js'
import initData from './assets/js/initData.js'
import FooterCom from './component/footer-com.vue'
import NoticeDialog from './component/notice-dialog.vue'
import apiFun from './store/apiFun.js'
import home from './home.vue'
import app from './app.vue'
import mine from './mine.vue'
import message from './message.vue'
import eventBus from '@u/eventBus'
export default {
	data() {
		return {
			isShow: false,
			detail: {}
		}
	},
  computed: {
    tabIndex: () => store.tabIndex,
		userInfo: () => store.userInfo
  },
	mounted () {
		apiFun._getschoolType()
		if (this.userInfo.typeCode == 16) {
			apiFun.getChildList()
		}
		apiFun.getMenuList()
		this.unRead()
	},
  components: {
		NoticeDialog,
    FooterCom,
    home,
    app,
    mine,
		message
  },
	methods: {
		close () {
			this.isShow = false
		},
		// 判断是否有最新的公告
		async newNotice () {
			const res = await actions.searchPersonNotice({
				page: 1,
				size: 20,
				userCode: this.userInfo.userCode,
				eduCode: this.userInfo.schoolCode
			})
			const detail = res.data.list.find(item => item.popFalg === '1' && !item.readStatus)
			if (detail) {
				this.isShow = true
				this.detail = detail
				initData.readNotice(detail.noticeCode)
			}
		},
		// 获取所有未读消息
		async unRead () {
			const req = {
				eduCode: this.userInfo.schoolCode,
				page: 1,
				size: 200,
				userCode: this.userInfo.userCode
			}
			const one = await actions.unReadApp(req)
			const two = await actions.unReadNotice(req)
			const three = await actions.unReadPlateform(req)
			Promise.all([one, two, three]).then(res => {
				const notice = []
				const total = res.reduce((prev, curr) => {
					notice.push(curr.data)
					return prev + curr.data
				}, 0)
				eventBus.$emit('showTotal', total)
				setStore({
					noticeTotal: notice
				})
				this.$nextTick(function(){
					this.newNotice()
				})
			})
		}
  }
}
</script>

<style lang="scss" scoped>
  .scroll-h {
  	height: calc(100vh - 100rpx);
  }
</style>