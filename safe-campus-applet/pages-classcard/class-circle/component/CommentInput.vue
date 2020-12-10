<template>
	<view class="input-box u-bg-color" v-show="showInputTag" id="input-box" :style="{ bottom: inputOffsetBottom > 0 ? inputOffsetBottom + 'px' : '0' }">
		<view class="input-box-flex u-fx-ac u-flex-nowrap u-padd-l20 u-padd-r20">
			<view class="input-box-flex-grow">
				<input
					type="text"
					class="content u-bg-fff u-padd-l20 u-padd-r20 u-border-radius"
					id="input"
					v-model="content"
					:adjust-position="false"
					confirm-type="send"
					:confirm-hold="true"
					placeholder-style="color:#DDD;"
					:cursor-spacing="6"
					:maxlength="100"
					placeholder="评论"
					:focus="showInputTag ? 'auto' : 'false'"
					@blur="blurInput"
					@confirm="sendMsg"
				/>
			</view>
			<button class="btn u-mar-l20" type="primary" size="mini" @touchend.prevent="sendMsg">发送</button>
			<!-- #ifdef MP-WEIXIN -->
			<view v-show="showInput" :style="{ height: viewOffsetBottom + 'px' }"></view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
import { store, actions } from '@store';
export default {
	props: {
		showInputTag: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			content: '',
			inputOffsetBottom: 0, //键盘的高度
			viewOffsetBottom: 0 //视窗距离页面的距离
		};
	},
	onReady() {
		//设置input输入框距离键盘的高度 --也就是键盘的高度
		//设置view距离键盘和输入框的高度
		uni.onKeyboardHeightChange(res => {
			this.inputOffsetBottom = res.height;
			this.viewOffsetBottom = res.height + uni.upx2px(100);
		});
	},
	created() {
		this.userCode = store.userInfo.userCode;
	},
	methods: {
		blurInput() {
			this.$emit('blurInput')
		},
		sendMsg(){
			this.$emit('sendMsg', this.content)
			this.$tools.goNext(() => {
				this.content = ''
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.input-box {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	z-index: 999;
	&-flex {
		height: 100rpx;
		&-grow {
			flex-grow: 1;
			.content {
				height: 60rpx;
				caret-color: $uni-color-success;
			}
		}
		.btn {
			background-color: $u-type-success;
			border: none;
		}
	}
}
</style>
