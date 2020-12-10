<template>
	<view class="subject-list u-mar-t u-fx-ac">
		<view class="subject-scroll u-padd-r20">
			<view @tap="chooseName(subject)" :class="['subject-item', {'act' : currentSubject.subjectCode === subject.subjectCode}]" v-for="subject in subjectList" :key="subject.subjectCode">{{ subject.subjectName }}</view>
		</view>
	</view>
</template>

<script>
	import { store } from '@store'
	export default {
		props: {
			value: {
				type: Object,
				defautl: () => {
					return {
					}
				}
			}
		},
		computed: {
			subjectList: () => store.subjectList,
			currentSubject: {
				get () {
					return this.value
				},
				set (val) {
					this.$emit('input', val)
				}
			}
		},
		data () {
			return {
			}
		},
		methods: {
			chooseName (item) {
				this.currentSubject = item
			}
		}
	}
</script>

<style lang="scss" scoped>
.subject-list {
		background-color: #fff;
		height: 120rpx;
		width: 100%;
		overflow-x: scroll;
		.subject-scroll {
			position: relative;
			white-space:nowrap;
		}
		.subject-item {
			display: inline-block;
			margin-left: 20rpx;
			padding: 15rpx 25rpx;
			background-color: $u-bg-color;
			border: 1px #ddd solid;
			border-radius: 50rpx;
			&.act {
				background-color: $u-type-primary;
				color:#fff;
			}
		}
	}
</style>
