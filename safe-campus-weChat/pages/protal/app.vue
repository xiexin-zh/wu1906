<template>
  <view class="app">
    <view v-if="!isEdit" class="u-fx-ac enjoy-app">
      <text class="text">常用模块</text>
      <view class="u-fx-f1 u-fx">
        <view v-for="enjoy in enjoyApp" :key="enjoy.id" class="app">
          <image class="app-icon" :src="enjoy.icon || '/mobile-img/app-auto-icon.png'" alt="">
        </view>
      </view>
      <view class="btn edit" @click="isEdit = true">编辑</view>
    </view>
    <view v-if="isEdit" class="enjoy-app u-fx-jsb u-fx-ac">
      <text class="text">常用模块</text>
      <view class="btn save" @click="isEdit = false">完成</view>
    </view>
    <view v-if="isEdit" class="system-list edit-app u-bd-t">
      <view v-if="enjoyApp.length === 0" class="no-app u-tips-color">暂未添加模块到首页，请点击添加</view>
      <view @click="delEnjoy(enjoy.id)" v-for="enjoy in enjoyApp" :key="enjoy.id" class="app u-fx-ac-jc" :class="{'act': isEdit}">
				<image class="del-add-img" src="/mobile-img/del-app-icon.png"></image>
        <view>
          <image class="app-icon" :src="enjoy.icon || '/mobile-img/app-auto-icon.png'" alt="">
        </view>
        <text class="text u-font-01 u-content-color">{{ enjoy.name.split('-')[0] }}</text>
      </view>
    </view>
    <view class="app-module">
			<no-data v-if="appList.length === 0"></no-data>
			<view class="system-box">
				<view class="system-list" v-for="app in appList" :key="app.id">
					<view class="system u-font-1">{{ app.name }}</view>
					<view @click="chooseEnjoy(module, isShow(module.id))" class="app u-fx-ac-jc animate__animated animate__fadeIn" :class="{'act': isEdit}" v-for="module in app.children" :key="module.id">
						<image v-if="isShow(module.id) && isEdit" class="del-add-img" src="/mobile-img/del-app-icon.png"></image>
						<image v-if="!isShow(module.id) && isEdit" class="del-add-img" src="/mobile-img/add-app-icon.png"></image>
						<view>
							<image class="app-icon" :src="module.icon || '/mobile-img/app-auto-icon.png'" alt="">
						</view>
						<view class="text u-content-color u-font-01">{{ module.name.split('-')[0] }}</view>
						<view v-if="false" class="text u-tips-color u-font-02">({{ module.name.split('-')[1] }})</view>
					</view>
				</view> 
			</view>
    </view>
  </view>
</template>

<script>
  import { store, setStore } from './store/index.js'
	import apiFun from './store/apiFun.js'
  export default {
    data () {
      return {
        isEdit: false
      }
    },
    computed: {
			userInfo: () => store.userInfo,
			enjoyApp: () => store.enjoyApp,
			appList: () => store.appList
    },
    mounted () {
    },
    methods: {
			// 获取菜单列表
			async getMenuList () {
				const res = await actions.getMenuList({
					plateformType: 1,
					schoolCode: this.userInfo.schoolCode,
					userId: this.userInfo.userId,
					userType: this.userInfo.typeCode
				})
				this.appList = res.data
			},
      delEnjoy (id) {
        if (this.enjoyApp.length === 4) {
          uni.showToast({
              title: '至少保留4个模块',
              duration: 1200
          })
          return
        }
        const index = this.enjoyApp.findIndex(item => {
          return item.id === id
        })
        this.enjoyApp.splice(index, 1)
        this.setEnjoy(this.enjoyApp)
      },
      chooseEnjoy (item, tag) {
        if (!this.isEdit) {
					if (!apiFun.isRoleApp(item.url)) {
						this.$tools.toast('您没有访问权限')
						return
					}
					if (item.url.indexOf('#') > -1 || item.url.indexOf('http') > -1) {
						window.location.href= item.url
					} else {
						this.$tools.navTo({
							title: item.name.split('-')[0],
							url: item.url
						})
					}
					return
				}
        if (tag) {
          this.delEnjoy(item.id)
        } else {
          if (this.enjoyApp.length === 7) {
            uni.showToast({
                title: '最多只能添加7个模块',
                duration: 1200
            })
            return
          }
          this.enjoyApp.push({
            id: item.id,
            icon: item.icon,
            name: item.name,
						url: item.url
          })
          this.setEnjoy(this.enjoyApp)
        }
      },
      setEnjoy (data) {
        setStore({
          key: 'enjoyApp',
          data
        })
				// 分别存教职工和家长的首页收藏app
				if (this.userInfo.typeCode == 4) {
					setStore({
						key: 'enjoyTeacherApp',
						data
					})
				} else {
					setStore({
						key: 'enjoyParentApp',
						data
					})
				}
      },
      isShow (id) {
        return this.enjoyApp.some(item => {
          return item.id === id
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .enjoy-app {
    height: 80rpx;
    line-height: 80rpx;
    background-color: #fff;
    padding: 0 20rpx;
    .text {
      padding-right: 10rpx;
    }
    .app {
      margin-left: 20rpx;
      .app-icon {
        width: 40rpx;
        height: 40rpx;
        display: block;
      }
    }
    .btn {
      border-radius: $u-border-radius;
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      color: #666;
      font-size: 24rpx;
    }
    .edit {
      border: 1px #ccc dashed;
    }
    .save {
      color: #fff;
      background-color: $u-type-primary;
    }
  }
  .app-module {
    .module {
      height: 75rpx;
      line-height: 75rpx;  
      padding: 0 15rpx;
      font-weight: 600;
    }
    .system-box {
      padding-top: 30rpx;
      background-color: #fff;
    }
  }
  .edit-app {
    overflow: auto;
    background-color: #fff;
    padding-top: 10rpx;
   }
   .no-app {
     padding: 30rpx;
     text-align: center;
     font-size: 24rpx;
   }
  .system-list {
    overflow: auto;
    .system {
      margin-left: 30rpx;
      margin-bottom: 10rpx;
      height: 34rpx;
      line-height: 34rpx;
      padding-left: 16rpx;
      border-radius: $u-border-radius;
      border-left: 8rpx solid $u-type-primary;
    }
    .app {
      float: left;
      width: 22.5%;
      margin-left: 2%;
      margin-bottom: 10rpx;
      padding: 20rpx 0;
      position: relative;
			.del-add-img {
				width: 36rpx;
				height: 36rpx;
				display: block;
				position: absolute;
				top: 4rpx;
				right: 4rpx;
				z-index: 88;
			}
      &.act {
        border-radius: $u-border-radius;
        background-color: $u-bg-color;
      }
      .app-icon {
        width: 52rpx;
        height: 52rpx;
        display: block;
      }
      .text {
				margin-top: 15rpx;
        transform: scale(.9);
        -webkit-transform: scale(.9);
      }
    }
  }
</style>