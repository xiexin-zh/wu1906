<template>
	<view class="dropDown u-fx">
		<ms-dropdown-menu class='u-mar-r10 u-border-radius'>
			<ms-dropdown-item v-model="value0Change" :list="list0"></ms-dropdown-item>
		</ms-dropdown-menu>
		<ms-dropdown-menu class=' u-border-radius'>
			<ms-dropdown-item v-if='list1.length!==0' v-model="value1Change" :list="list1"></ms-dropdown-item>
		</ms-dropdown-menu>
		<ms-dropdown-menu class='u-mar-l10 u-border-radius'>
			<ms-dropdown-item v-if='list2.length!==0' v-model="value2Change"  :list="list2"></ms-dropdown-item>
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
			list0: {
				type: Array,
				default: () => {
					return [];
				}
			},
			list1: {
				type: Array,
				default: () => {
					return [];
				}
			},
			list2: {
				type: Array,
				default: () => {
					return [];
				}
			},
		},
		data() {
			return {
				title:'0',
				value0Change: '0',
				value1Change: '0',
				value2Change: '0',
			};
		},
		watch: {
			value0Change(val, oldval) {
				if (val !== oldval) {
					this.$emit('value0Change', this.value0Change==='0'?'':this.value0Change);
				}
			},
			value1Change(val, oldval) {
				if (val !== oldval) {
					if(this.value1Change==='0'){
						this.$emit('value1Change','')
						this.value2Change = '0'
					}else{
						this.$emit('value1Change',this.value1Change)
					}
				}
			},
			value2Change(val, oldval) {
				if (val !== oldval) {
					this.$emit('value2Change', this.value2Change==='0'?'':this.value2Change);
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
