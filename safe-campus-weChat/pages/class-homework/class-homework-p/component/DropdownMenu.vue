<template>
	<view class="dropDown u-fx u-bg-fff">
		<ms-dropdown-menu v-if="current === 0">
			<view class="dropdown-item">
				<view class="dropdown-item__selected u-fx-ac" @click="onShowDatePicker()">
					<view class="selected__name">{{ title }}</view>
					<view class="selected__icon" :class="showPicker ? 'up' : 'down'"><span class="iconfont">&#xe851;</span></view>
				</view>
				<mx-date-picker
					:show="showPicker"
					format="yyyy-mm-dd"
					:showAll="true"
					type="date"
					:show-tips="true"
					@confirm="onSelected"
					@cancel="onSelected"
					@all="cancelAll"
				/>
			</view>
		</ms-dropdown-menu>
	</view>
</template>

<script>
import MxDatePicker from '@/components/mx-datepicker/mx-datepicker.vue';
import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue';
import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue';
import { store, actions } from '../store/index.js';
export default {
	components: {
		msDropdownMenu,
		msDropdownItem,
		MxDatePicker
	},
	props: {
		statusList: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			dateValue: '',
			current: 0,
			showPicker: false,
			title: '选择日期'
		};
	},
	watch: {
		title(val, oldval) {
			if (val !== oldval) {
				this.$emit('searchChange', this.title);
			}
		}
	},
	async mounted() {
	},
	methods: {
		onShowDatePicker() {
			this.showPicker = !this.showPicker;
		},
		cancelAll(e) {
			this.showPicker = false;
			this.title = '选择日期';
		},
		onSelected(e) {
			this.showPicker = false;
			if (!e) {
				return;
			}
			this.title = e.value;
		}
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
	width: 100%;
	padding: 2rpx 0;
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
	font-family: 'iconfont'; /* project id 1564327 */
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
