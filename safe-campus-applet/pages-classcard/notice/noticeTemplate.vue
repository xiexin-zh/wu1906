<template>
	<view class="notice-type">
		<view class="u-padd-40">
			<u-subsection @change="change" bg-color="#fff" button-color="#7092fe" active-color="#fff" :list="list" :current="current"></u-subsection>
		</view>
		<notice-type v-if="current === 0"></notice-type>
		<system-template v-if="current === 1"></system-template>
		<my-template v-if="current === 2"></my-template>
	</view>
</template>

<script>
import NoticeType from './component/NoticeType.vue'
import SystemTemplate from './component/SystemTemplate.vue'
import MyTemplate from './component/MyTemplate.vue'
export default {
	components: {
		NoticeType,
		SystemTemplate,
		MyTemplate
	},
	data() {
		return {
			list: [
				{
					name: '新建通知'
				},
				{
					name: '系统模板'
				},
				{
					name: '我的模板'
				}
			],
			current: 0
		};
	},
	methods: {
		change (index) {
			this.current = index
		}
	}
};
</script>

<style lang="scss" scoped></style>
