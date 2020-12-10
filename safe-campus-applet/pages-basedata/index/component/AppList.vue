<template>
  <view class="app-list u-auto">
    <view
      @click="goApp(app.package, app.path)"
      class="app-item u-fx-ac-jc"
      v-for="(app, index) in showList"
      :key="index"
    >
      <u-image width="64" height="64" :src="app.icon"></u-image>
      <text class="u-content-color u-font-01 u-padd-t10 u-tx-c">{{
        app.title
      }}</text>
    </view>
  </view>
</template>

<script>
import { store } from "@store";
export default {
  computed: {
    currentUserType: () => store.currentUserType,
  },
  data() {
    return {
      appList: [
        {
					package: 'pages-classcard',
          path: "notice",
          title: "通知公告",
          icon: "http://canpointtest.com/mini-img/tzgg-icon.png",
					type: ['4', '16']
        },
        {
					package: 'pages-classcard',
          path: "task",
          title: "作业",
          icon: "http://canpointtest.com/mini-img/zy-icon.png",
					type: ['4', '16']
        },
        {
					package: 'pages-classcard',
          path: "album",
          title: "班级相册",
          icon: "http://canpointtest.com/mini-img/album-icon.png",
					type: ['4', '16']
        },
        {
					package: 'pages-classcard',
          path: "class-circle",
          title: "班级风采",
          icon: "http://canpointtest.com/mini-img/circle.png",
					type: ['4', '16']
        },
				{
					package: 'pages-basedata',
				  path: "face",
				  title: "人像采集",
				  icon: "http://canpointtest.com/mini-img/face-icon.png",
					type: ['4', '16']
				},
				{
					package: 'pages-basedata',
				  path: "class-manage",
				  title: "班级管理",
				  icon: "http://canpointtest.com/mini-img/class-manage-icon.png",
					type: ['4']
				},
				{
					package: 'pages-consume',
				  path: "one-card",
				  title: "一卡通消费",
				  icon: "http://canpointtest.com/mini-img/consume.png",
					type: ['4', '16']
				}
      ],
			showList: []
    };
  },
	mounted () {
		this.showList = this.appList.filter(item => {
			return item.type.indexOf(this.currentUserType) > -1
		})
	},
  methods: {
    goApp(module, path) {
      if (this.currentUserType === "4") {
        if (!store.currentBindClass.classCode) {
          this.$tools.toast("您尚未加入班级");
          return;
        }
      } else {
        if (!store.currentBindStudent.classCode) {
          this.$tools.toast("您尚未绑定孩子");
          return;
        }
      }
      this.$tools.navTo({
        url: `/${module}/${path}/index`,
        title: "通知公告",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-list {
  background-color: #fff;
  padding: 40rpx 0rpx 0;
  .app-item {
    width: 20%;
		margin-bottom: 40rpx;
    float: left;
    text-align: center;
  }
}
</style>
