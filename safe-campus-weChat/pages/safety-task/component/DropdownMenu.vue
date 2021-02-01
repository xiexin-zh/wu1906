<template>
	<view class="dropDown u-fx">
		<ms-dropdown-menu class='u-mar-r20 u-border-radius'>
			<ms-dropdown-item v-model="value0" :list="completeStatusList"></ms-dropdown-item>
		</ms-dropdown-menu>
		<ms-dropdown-menu>
			<ms-dropdown-item v-model="value1Change" :list="typeListTime"></ms-dropdown-item>
		</ms-dropdown-menu>
	</view>
</template>

<script>
	import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue';
	import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue';
	import {
		store,
		actions
	} from '../store/index.js';
	export default {
		components: {
			msDropdownMenu,
			msDropdownItem,
		},
		props: {
			completeStatusList: {
				type: Array,
				default: () => {
					return [];
				}
			}
		},
		data() {
			return {
				value0: '0',
				value1Change: '0',
				typeListTime: [{
						text: '任务类型',
						value: '0'
					},
					{
						text: '一次性计划',
						value: '1'
					},
					{
						text: '周计划',
						value: '2'
					},
					{
						text: '月计划',
						value: '3'
					},
				]
			};
		},
		watch: {
			value0(val, oldval) {
				if (val !== oldval) {
						this.$emit('value0Change', this.value0==='0'?'':this.value0);
				}
			},
			value1Change(val, oldval) {
				if (val !== oldval) {
					this.$emit('value1Change', this.value1Change==='0'?'':this.value1Change);
				}
			},
			
		},
		async mounted() {},
		methods: {
		
		}
	};
</script>

<style lang="scss" scoped>
	.dropdown {
		padding: 4rpx 18rpx 18rpx 18rpx;
		background: #fff;
		font-size: 12px;
	}

	.dropdown-menu {
		width: 50%;
		padding: 2rpx 0;
		// border-bottom: 1rpx solid #ddd;
		border-radius: 8rpx;
	}

	.dropdown-menu:first-child {
		// border-right: 1rpx solid #ddd;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.dropdown-menu:last-child {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	.dropdown-item__selected {
		padding: 10rpx;
	}

	.icon {
		margin-left: 10rpx;
	}

	.down {
		transition: transform 0.3s;
		transform: rotateZ(0);
	}

	.up {
		transition: transform 0.3s;
		transform: rotateZ(-180deg);
	}

	button {
		font-size: 28upx;
	}

	.dropdown-item {
		width: 100%;
		flex: 1;
		position: relative;

		&__selected {
			position: relative;
			display: flex;
			align-items: center;
			background: #fff;
			padding: 20rpx;
			box-sizing: border-box;
			justify-content: center;

			.selected__name {
				font-size: 28rpx;
			}

			.selected__icon {
				margin-left: 20rpx;

				&.down {
					transition: transform 0.3s;
					transform: rotateZ(0);
				}

				&.up {
					transition: transform 0.3s;
					transform: rotateZ(-180deg);
				}
			}
		}
	}

	@font-face {
		font-family: 'iconfont';
		/* project id 1564327 */
		src: url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.eot');
		src: url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.eot?#iefix') format('embedded-opentype'), url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.woff2') format('woff2'),
			url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.woff') format('woff'), url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.ttf') format('truetype'),
			url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.svg#iconfont') format('svg');
	}

	.iconfont {
		font-family: 'iconfont' !important;
		font-size: 24rpx;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
	}
</style>
