<template>
  <view class="leave u-page">
    <u-subsection v-if="isShow" :list="navs" :current="currentIndex" @change="tabChange" active-color="#fff" bgColor="#fff" buttonColor="#2979ff"></u-subsection>
    <view class="search-list u-fx">
      <u-search @search="teacherLeaveGet(false)" placeholder="学号/学生姓名" v-model="keyword" @clear="teacherLeaveGet(false)" bg-color="#fff" shape="square" :show-action="false" height="75"></u-search> 
    <view class="search-icon">
     <u-button size="mini" :custom-style="customStyle" @click="teacherLeaveGet(false)">筛选</u-button>
    </view>
    </view>
    <scroll-view  scroll-y="true" class="scroll-h" @scrolltolower="loadMore" >
      <no-data msg="暂无数据~" v-if="leaveList.length === 0"></no-data>
      <view class="content" v-else>
        <view class="record-box">
          <view class="leave-box u-fx-ac" v-for="(item,index) in leaveList" :key="index" @click="detail(item.id)">
            <view class="leave-top">
              <image :src="item.urlList[0] || '/mobile-img/person-auto.png'" mode=""></image>
            </view>
            <view class="leave-info u-fx-f1"> 
              <view class="u-main-color u-font-1">{{ item.appraiseItemName }}</view>
              <view class="u-type-info-dark u-font-01 u-mar-t10">{{ item.studentName }} {{ item.studentNo }} {{ isHighSchool ? item.schoolYearId + '级' : '' }}{{ item.gradeName }} {{ isHighSchool ? item.subjectName : '' }} {{ item.className }} </view>
              <view class="u-fx-jsb u-light-color u-font-02 u-mar-t10">
                <view v-if="currentIndex !== 0">评价人：{{ item.appraiserName }} </view>
                <view>{{ item.createTime | gmtToDate }} </view>
                <view @click.stop="del(item)" v-if="currentIndex === 0">
                  <u-icon name="trash-fill" color="#fa3534" size="38" ></u-icon>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
     </scroll-view>
  </view>
</template>

<script>
import eventBus from '@u/eventBus'
import { store, actions } from './store/index.js'
export default {
  components: {
  },
  data () {
    return {
			isHighSchool: false,
      leaveList: [],
      navs:[{
        name: '我评价的'
      },
      {
        name: '与我有关'
      }],
      currentIndex: 0,
      pageList: {
				page: 1,
				size: 15
      },
      morePage: false,
      keyword: '',
      customStyle: {
        color: '#fff',
        backgroundColor:'#2979ff',
        height:'58rpx'
      },
      eduUser: false,
      isShow: false,
      appraiseItemUserCode: ''
    }
  },
  mounted () {
		this.isHighSchool = store.userInfo.schoolType === '8' || store.userInfo.schoolType === '9'
    this.isUserGet()
    this.teacherLeaveGet()
  },
  methods: {
    async isUserGet () {
      const res =await actions.getIsAuthorize(store.userInfo.userCode)
      this.isShow = res.data
    },
    async teacherLeaveGet (tag = false) {
      if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
      }
      const req = {
        schoolCode: store.userInfo.schoolCode,
        appraiseItemUserCode: this.appraiseItemUserCode,
        appraiserCode: store.userInfo.userCode,
        appraiserName: store.userInfo.userName,
        page: this.pageList.page,
        size: this.pageList.size,
        studentNoOrName: this.keyword
      }
      const res = await actions.getBehaviorList(req)
			if (!res.data) {
				return;
			}
      if (tag) {
				this.leaveList = this.leaveList.concat(res.data.list)
			} else {
				this.leaveList = res.data.list;
			}
			this.morePage = res.data.hasNextPage;
    },
    loadMore() {
			if (!this.morePage) {
				this.$tools.toast('数据已加载完毕')
				return;
			}
			if (this.currentIndex === 1) {
         this.appraiseItemUserCode = store.userInfo.userCode
      } else {
         this.appraiseItemUserCode = ''
      }
      this.teacherLeaveGet(true)
		},
    tabChange (type) {
      this.currentIndex = type
      if (type === 1) {
        this.appraiseItemUserCode = store.userInfo.userCode
      } else {
         this.appraiseItemUserCode = ''
      }
      this.teacherLeaveGet()
    },
    detail (id) {
      this.$tools.navTo({
				url: `./detail?id=${id}`,
				title: '查看详情'
			})
    },
    del (item) {
      this.$tools.confirm("确定删除吗?", () => {
        actions.delBehavior(item.id).then((res) => {
          this.$tools.toast("操作成功")
          this.$tools.goNext(() => {
            this.teacherLeaveGet()
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.u-page {
  background-color: #F4F7FC;
  color: $u-main-color;
}
.leave {
  .search-list {
    height: 100rpx;
    padding: 20rpx;
    height: 100rpx;
  }
  .search-icon {
    margin-left: 20rpx;
  }
  position: relative;
  .scroll-h {
    height: calc(100vh - 100rpx);
    .record-box {
      .leave-box {
        margin: 20rpx;
        background-color: $uni-bg-color;
        border-radius: 10rpx;
        padding: 15rpx 25rpx;
        &:first-of-type {
          margin-top: 0;
        }
        .leave-top {
          image {
            width: 80rpx;
            height: 80rpx;
            margin-right: 40rpx;
          }
        }
        .leave-info {
          color: $u-tips-color;
          .leave-pur{
            padding: 6rpx 0;
            font-size: 28rpx;
          }
        }
      }
    }
  }
}
.u-mar-t10 {
  margin-top: 10rpx;
}
</style>
