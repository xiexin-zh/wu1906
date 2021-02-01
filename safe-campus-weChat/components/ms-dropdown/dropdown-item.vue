<template>
	<view class="dropdown-item">
		<!-- selected -->
		<view class="dropdown-item__selected u-fx-ac" @click="changePopup">
			<slot name="title" v-if="$slots.title"></slot>
			<block v-else>
				<view class="selected__name">{{ title ? title : selectItem.text }}</view>
				<view class="selected__icon" :class="showClass === 'show' ? 'up' : 'down'"><span class="iconfont">&#xe851;</span></view>
			</block>
		</view>
		<view class="dropdown-item__content" :style="{ top: contentTop + 'px' }" v-if="showList">
			<!-- dropdown -->
			<view :class="['list', showClass]">
				<slot v-if="$slots.default"></slot>
				<block v-else>
					<view class="list__option u-fx-ac" v-for="(item, index) in list" :key="index" @click="choose(item)">
						<view>{{ item.text }}</view>
						<icon v-if="item.value === value" type="success_no_circle" size="26" />
					</view>
				</block>
			</view>
			<!-- dropdown-mask -->
			<view :class="['dropdown-mask', showClass]" v-if="showList" @click="closePopup"></view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	props: {
		value: [Number, String, Object],
		list: {
			type: Array,
			default: () => {
				return [];
			}
		},
		title: [Number, String]
	},
	data() {
		return {
			showList: '',
			showClass: '',
			selectItem: {},
			contentTop: 0
		};
	},
	watch: {},
	mounted() {
		this.showList = this.active;
		this.selectItem = this.list[this.value];
		document.addEventListener('click', e => {
			// 	//this.$el 可以获取当前组件的容器节点
			if (!this.$el.contains(e.target)) {
				this.close();
			}
		});
	},
	methods: {
		choose(item) {
			this.selectItem = item;
			this.$emit('input', item.value);
			this.closePopup();
		},
		changePopup() {
			if (this.showList) {
				this.closePopup();
			} else {
				this.openPopup();
			}
		},
		openPopup() {
			// this.$parent  -> dropdown-menu
			this.$parent.$emit('close');
			this.showList = true;
			this.$nextTick(() => {
				this.getElementData('.dropdown-item__selected', data => {
					this.contentTop = data[0].bottom;
					this.showClass = 'show';
				});
			});
		},
		closePopup() {
			this.showClass = '';
			setTimeout(() => {
				this.showList = false;
			}, 300);
		},
		close() {
			this.showClass = '';
			this.showList = false;
		},
		getElementData(el, callback) {
			uni
				.createSelectorQuery()
				.in(this)
				.selectAll(el)
				.boundingClientRect()
				.exec(data => {
					callback(data[0]);
				});
		}
	}
};
</script>

<style lang="scss">
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
	&__content {
		position: fixed;
		left: 0;
		right: 0;
		overflow: hidden;
		top: 0;
		bottom: 0;
		z-index: 99;
		.list {
			max-height: 400px;
			overflow-y: auto;
			position: absolute;
			left: 0;
			right: 0;
			z-index: 3;
			background: #fff;
			transform: translateY(-100%);
			transition: all 0.3s;
			&.show {
				transform: translateY(0);
			}
			&__option {
				font-size: 28rpx;
				padding: 26rpx 28rpx;
				display: flex;
				justify-content: space-between;
				&:first-child {
					border-top: 1rpx solid #dddddd;
				}
				&:not(:last-child) {
					border-bottom: 1rpx solid #dddddd;
				}
			}
		}
		.dropdown-mask {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			transition: all 0.3s;
			z-index: 2;
			&.show {
				background: rgba(0, 0, 0, 0.5);
			}
		}
	}
	&:not(:last-child):after {
		content: ' ';
		position: absolute;
		width: 2rpx;
		top: 36rpx;
		bottom: 36rpx;
		right: 0;
		background: $uni-border-color;
	}
}
</style>
