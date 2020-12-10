<template>
	<view class="notice-type">
		<view class="u-padd-40">
			<u-subsection @change="change" bg-color="#fff" button-color="#7092fe" active-color="#fff" :list="list" :current="current"></u-subsection>
		</view>
		<system-template v-if="current === 0"></system-template>
		<my-template v-if="current === 1"></my-template>
	</view>
</template>

<script>
import SystemTemplate from './component/SystemTemplate.vue'
import MyTemplate from './component/MyTemplate.vue'
export default {
	components: {
		SystemTemplate,
		MyTemplate
	},
	data() {
		return {
			list: [
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
