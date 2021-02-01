<template>
  <view class="statistics u-page">
    <view>
      <view class="search-list u-fx">
        <u-search @search="check" placeholder="输入姓名搜索" v-model="keyword" :show-action="false" bg-color="#fff" shape="square" height="75"></u-search>
        <view class="search-icon" @click="check">
          <u-icon name="list-dot" class="u-font-3"></u-icon>
          <view class="u-font-02"> 记录 </view>
        </view>
      </view>
      <view class="search-box" v-if="isShow">
        <view class="search-info" v-for="(item,index) in studentList" :key="index"> 
          <view class="search-stu u-bd-b" @click="choose(item)"> 
            {{ item.userName }} , {{ item.workNo }} , {{ isHighSchool ? item.schoolYearId + '级' : '' }} / {{ item.gradeName }} / {{ item.className }}
          </view>
        </view>
      </view>
      <view class="student-box u-fx-ac">
        <view v-if=" JSON.stringify(studentInfo) == '{}' "> 暂无学生 </view>
        <view class="u-fx-ac" v-else> 
          <image :src="studentInfo.photoUrl" mode=""></image>
          <view> {{ studentInfo.userName }} {{ studentInfo.workNo }} {{ isHighSchool ? studentInfo.schoolYearId + '级' : '' }}{{ studentInfo.gradeName }} {{ studentInfo.className }} </view>
        </view>
      </view>
      <scroll-view scroll-y="true" class="attandence-box">
        <view class="attandence-info u-fx-jc u-fx-ac"  v-for="item in attandenceInfo" 
          :key="item.id"
          @click="detail(item)">
          <image src="/mobile-img/class-moral-icon.png" mode=""></image>
          <scroll-view scroll-y="true" class="attandence-word u-fx-f1">
            {{item.name}}
          </scroll-view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { store, actions } from './store/index.js'
export default {
  data () {
    return {
      dataList: [],
      attandenceInfo:[],
      num: '',
      keyword: '',
      pageList: {
				page: 1,
				size: 15
      },
			isHighSchool: false,
      morePage: false,
      isShow: false,
      studentList: [],
      studentInfo: {}
    }
  },
  watch: {
    keyword: {
      handler (newVal, oldVal) {
        this.keyword = newVal
        if (this.keyword !== '') {
          this.queryStudent()
        } else {
          this.studentList = []
        }
      }
    }
  },
  mounted () {
		this.isHighSchool = store.userInfo.schoolType === '8' || store.userInfo.schoolType === '9'
    this.stuMoralGet()
  },
  methods: {
    async queryStudent () {
      const req = {
        keyword: this.keyword,
        schoolCode: store.userInfo.schoolCode,
				schoolYearId: store.schoolYear.schoolYearId
      }
      const res = await actions.getQueryStudent(req)
      if (res.data.list.length > 0) {
        this.isShow = true
        this.studentList = res.data.list
      } else {
        this.isShow = false
        this.studentList = []
      }
    },
    choose (item) {
      this.isShow = false
      this.studentList = []
      this.studentInfo = item
    },
    check () {
      this.$tools.navTo({
        url:'./record',
        title:'列表'
      })
    },
    async stuMoralGet (tag = false) {
      if (tag) {
        this.pageList.page += 1;
      } else {
        this.pageList.page = 1;
      }
      const req = {
        page: this.pageList.page,
        size: this.pageList.size,
        userCode: store.userInfo.userCode,
        schoolCode: store.userInfo.schoolCode
      }
      const res = await actions.getStuMoral(req)
      if (tag) {
        this.attandenceInfo = this.attandenceInfo.concat(res.data.list)
      } else {
        this.attandenceInfo = res.data.list;
      }
      this.morePage = res.data.hasNextPage;
    },
    async detail (item) {
      if (JSON.stringify(this.studentInfo) == '{}') {
        this.$tools.toast('请搜索学生进行选择')
      } else {
        this.$tools.navTo({
          url: `./add?id=${item.id}&studentInfo=${JSON.stringify(this.studentInfo)}`,
          title: '评分'
        })
      }
    },
    close () {
      this.$refs.popup.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.u-page {
  background-color: #F4F7FC;
  color: $u-main-color;
}
.statistics {
  .search-list {
    height: 100rpx;
    width: 100%;
    padding: 20rpx;
    position: relative;
    .search-icon {
      margin-left: 20rpx;
      color: $u-type-primary;
    }
  }
  .search-box {
    width: 85%;
    max-height: calc(100vh - 300rpx);
    overflow: scroll;
    text-align: center;
    position: absolute;
    top: 86rpx;
    left: 25rpx;
    z-index: 100;
    .search-info {
      background: #fff;
      height: 70rpx;
      line-height: 70rpx;
      font-size: 26rpx;
      color: $u-content-color;
      .search-stu {
        margin: 0 auto;
      }
    }
  }
  .student-box {
    text-align: center;
    height: 100rpx;
    background-color: #fff;
    margin:0 20rpx;
    border-radius: 15rpx;
    padding: 20rpx;
    image {
      width: 80rpx;
      height: 80rpx;
      margin-right: 20rpx;
    }
  }
  .attandence-box {
    height: calc(100vh - 300rpx);
    :nth-child(3n) {
      border-right: none;
    }
    .attandence-info {
      width: 44.6%;
      float: left;  
      margin-bottom: 30rpx;
      background-color: $uni-bg-color;
      margin: 2% 2.5%;
      padding: 0 20rpx;
      border-radius: 15rpx;
      box-shadow: 0px 1px 6px #ddedef;
      height: 180rpx;
      overflow-y: scroll;
      image {
        width: 80rpx;
        height: 80rpx;
      }
      .attandence-word {
        margin-left: 20rpx;
      }
    }
  }
}
</style>