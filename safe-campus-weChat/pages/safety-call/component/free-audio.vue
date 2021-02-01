<template>
	<!-- 音频播放器组件 -->
	<view v-if='url' class='flex justify-between align-center audio'>
		<view class='flex-1 '>
			<slider @change='changeAudio' :activeColor='activeColor' :min='0' :max='duration.toFixed(0)' :value='currentTime.toFixed(0)' :step='0.1'></slider>
		</view>
		<!-- <view class='mr-3'  @click='start'>
			<image :src='startPic' class='icon' v-show='!status'></image>
			<image :src='endPic' class='icon' v-show='status'></image>
		</view> -->
		<view class='ml-3'>{{getTime(Math.round(currentTime))}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				context: null,
				currentTime: 0,
				duration: 100,
				status: false
			}
		},
		props: {
			url: String,
			activeColor: {
				type: String,
				default: '#0E7EFC'
			},
			startPic: String,
			endPic: String
		},
		created() {
			this.context = uni.createInnerAudioContext();
			this.context.src = this.url;
			this.onTimeUpdate();
			this.onCanplay();
			this.onEnded();
		},
		methods: {
			start() { //点击播放\
				this.context.play()
				this.status = !this.status;
				// if(this.status) {
				// }else {
				// }
			},
			//点击结束播放
			stop(){
				this.context.pause();
				this.status = !this.status;
			},
			onCanplay() { //进入可播放状态
				this.context.onCanplay(() => {
					this.context.duration;
					setTimeout(()=>{
						this.duration = this.context.duration;
					},1000)
				})
			},
			onTimeUpdate() { //音频播放进度
				this.context.onTimeUpdate(() => {
					this.currentTime = this.context.currentTime;
				})
			},
			onEnded() { //播放结束
				this.context.onEnded(()=> {
					this.status = false;
					this.currentTime = 0;
				})
			},
			changeAudio(e) {
				this.context.seek(e.detail.value)
			},
			getTime(time) {
				let m = parseInt(time / 60);
				let s = time % 60;
				return this.towNum(m) + ':' + this.towNum(s);
			},
			towNum(num) {
				if(num >= 10) {
					return num;
				}else {
					return '0' + num;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.audio {
		/* background: #F4F4F4; */
		padding: 20rpx;
		// /deep/ .uni-slider-thumb{
		// 	width: 20rpx!important;
		// 	height: 20rpx!important;
		// }
	}
	
	.icon {
		width: 80rpx;
		height: 80rpx;
	}
</style>
