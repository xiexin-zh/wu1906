<template>
	<view class="qui-page">
		<scroll-view scroll-y="true" class="scroll-h check">
			<view class="head_img">
				<u-avatar :src="src" size="150"></u-avatar>
				<!-- <u-avatar :text="text"></u-avatar> -->
				<view class="">学生</view>
				<view class="">在寝室</view>
			</view>
			<view class="content_">
				<view class="">
					<u-icon name="home-fill" size="42" class="icon"></u-icon>
					<text>沁园1栋/1楼/101</text>
				</view>
				<view class="">
					<u-icon name="account" size="42" class="icon"></u-icon>
					<text>宿管：12345758697</text>
				</view>
				<view class="">
					<u-icon name="account" size="42" class="icon"></u-icon>
					<text>班主任：12498473621</text>
				</view>
				<view class="">
					<u-icon name="hourglass" size="42" class="icon"></u-icon>
					<text>最近出入时间：2020/1/1 11：00</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import eventBus from "@u/eventBus.js";
export default {
  data() {
    return {
      src: "http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg",
      text: "无头像"
    };
  },
  components: {},
  mounted() {},
  methods: {
    changeColor() {
      eventBus.$emit("change");
    }
  }
};
</script>

<style lang="scss" scoped>
.scroll-h {
  height: 100vh;
}
.qui-page {
  $u-bg-color: #f3f4f6;
}
.check {
  .head_img {
    text-align: center;
    margin-top: 100rpx;
  }
  .content_ {
    margin-left: 80rpx;
  }
  view {
    padding: 10rpx 10rpx;
    text {
      padding-left: 30rpx;
color: $u-main-color;    }
  }
}
</style>
