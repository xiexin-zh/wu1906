<template>
  <view class="leave u-page">
    <view class="nav-tab">
      <view
        :class="['nav-item',{'active':item.id === currentIndex}]"
        v-for="item in navs"
        :key="item.id"
        @click="tabChange(item.id)"
      >{{item.name}}</view>
    </view>
    <view class="dropDown u-fx">
      <ms-dropdown-menu>
        <ms-dropdown-item v-model="value0" :list="casueList"></ms-dropdown-item>
      </ms-dropdown-menu>
      <ms-dropdown-menu>
        <ms-dropdown-item v-model="value1" :list="currentIndex === '2' ? myList : dateList"></ms-dropdown-item>
      </ms-dropdown-menu>
      <ms-dropdown-menu>
        <ms-dropdown-item v-model="value2" :list="dataList"></ms-dropdown-item>
      </ms-dropdown-menu>
    </view>
    <no-data msg="暂无数据~" v-if="leaveList.length === 0"></no-data>
    <scroll-view v-else scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
      <view class="content">
        <view class="record-box">
          <view
            class="leave-box"
            v-for="(item,index) in leaveList"
            :key="index"
            @click="detail(item.oddNumbers, item.optState)"
          >
            <view class="leave-top u-fx-jsb">
              <view class="leave-title">{{ item.reason }}</view>
              <view
                v-if=" currentIndex === '1'  && item.state === '0'  "
                class="leave-icon"
                @click.stop="check(item.oddNumbers)"
              >...</view>
            </view>
            <view class="leave-info">
              <view class="leave-pur">开始时间：{{ item.startTime | gmtToDate }}</view>
              <view class="leave-pur">结束时间：{{ item.endTime | gmtToDate }}</view>
              <view class="leave-pur">描述：{{ item.remark }}</view>
              <view class="leave-pur">
                状态：
                <text
                  :style="{color: item.state === '0' ? '#2979ff' : item.state === '1' ? '#19be6b' : item.state === '2' ? '#fa3534' : '#ff9900'}"
                >{{ item.state | leaveState }}</text>
              </view>
            </view>
            <view class="leave-bottom u-fx-jsb">
              <view class="leave-time">{{ item.initiationTime | gmtToDate }}</view>
              <view class="leave-detail u-tips-color">查看详情</view>
              <!-- <view class="leave-detail" @click="detail(item.oddNumbers, item.optState)"> 查看详情 > </view> -->
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view v-if="currentIndex === '1'" class="float-add-btn" @click="addLeave"></view>
  </view>
</template>

<script>
import wxApi from '@u/wxApi'
import eventBus from '@u/eventBus'
import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue'
import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue'
import { store, actions } from '../store/index.js'
export default {
  components: {
    msDropdownMenu,
    msDropdownItem
  },
  data() {
    return {
      dayInfo: [],
      leaveList: [],
      dataList: [],
      navs: [
        {
          id: '1',
          name: '我的请假'
        },
        {
          id: '2',
          name: '我的审批'
        },
        {
          id: '3',
          name: '我的抄送'
        }
      ],
      casueList: [{ text: '全部请假', value: '0' }],
      dateList: [
        {
          text: '审批状态',
          value: '0'
        },
        {
          text: '待审批',
          value: '5'
        },
        {
          text: '审批通过',
          value: '1'
        },
        {
          text: '审批未通过',
          value: '2'
        },
        {
          text: '审批中',
          value: '4'
        }
      ],
      dataList: [
        {
          text: '全部时间',
          value: '0'
        },
        {
          text: '一周内',
          value: '7'
        },
        {
          text: '一个月内',
          value: '30'
        },
        {
          text: '六个月内',
          value: '180'
        }
      ],
      myList: [
        {
          text: '操作状态',
          value: '0'
        },
        {
          text: '待审批',
          value: '2'
        },
        {
          text: '已审批',
          value: '1'
        }
      ],
      value0: '0',
      value1: '0',
      value2: '0',
      currentIndex: '1',
      pageList: {
        page: 1,
        size: 15
      },
      morePage: false
    }
  },
  watch: {
    value0(val, oldval) {
      if (val !== oldval) {
        if (this.currentIndex === '1') {
          this.teacherLeaveGet()
        } else if (this.currentIndex === '2') {
          this.approvalLeaveGet()
        } else if (this.currentIndex === '3') {
          this.copyLeaveGet()
        }
      }
    },
    value1(val, oldval) {
      if (val !== oldval) {
        if (this.currentIndex === '1') {
          this.teacherLeaveGet()
        } else if (this.currentIndex === '2') {
          this.approvalLeaveGet()
        } else if (this.currentIndex === '3') {
          this.copyLeaveGet()
        }
      }
    },
    value2(val, oldval) {
      if (val !== oldval) {
        if (this.currentIndex === '1') {
          this.teacherLeaveGet()
        } else if (this.currentIndex === '2') {
          this.approvalLeaveGet()
        } else if (this.currentIndex === '3') {
          this.copyLeaveGet()
        }
      }
    }
  },
  mounted() {
		wxApi.getConfig('protal-door')
    eventBus.$on('getList', () => {
      this.approvalLeaveGet()
    })
    eventBus.$on('getLeaveList', () => {
      this.teacherLeaveGet()
    })
    this.leaveReasonGet()
    this.teacherLeaveGet()
  },
  methods: {
    async leaveReasonGet() {
      const res = await actions.getLeaveReason()
      const data = res.data.map((el) => {
        el.text = el.name
        el.value = el.id
        return el
      })
      this.casueList = this.casueList.concat(data)
    },
    async teacherLeaveGet(tag = false) {
      let value1 = ''
      if (this.value1 === '0') {
        value1 = ''
      } else if (this.value1 === '5') {
        value1 = '0'
      } else {
        value1 = this.value1
      }
      if (tag) {
        this.pageList.page += 1
      } else {
        this.pageList.page = 1
      }
      const req = {
        applicantCode: store.userInfo.userCode,
        state: value1,
        page: this.pageList.page,
        size: this.pageList.size,
        userCode: store.userInfo.userCode,
        reasonId: this.value0 === '0' ? '' : this.value0,
        day: this.value2 === '0' ? '' : this.value2
      }
      const res = await actions.getTeacherLeave(req)
      if (tag) {
        this.leaveList = this.leaveList.concat(res.data.list)
      } else {
        this.leaveList = res.data.list
      }
      this.morePage = res.data.hasNextPage
    },
    async approvalLeaveGet(tag = false) {
      let value1 = ''
      if (this.value1 === '0') {
        value1 = ''
      } else if (this.value1 === '2') {
        value1 = '0'
      } else {
        value1 = this.value1
      }
      if (tag) {
        this.pageList.page += 1
      } else {
        this.pageList.page = 1
      }
      const req = {
        applicantCode: '',
        optState: value1,
        page: this.pageList.page,
        size: this.pageList.size,
        userCode: store.userInfo.userCode,
        time: '',
        day: this.value2 === '0' ? '' : this.value2,
        reasonId: this.value0 === '0' ? '' : this.value0
      }
      const res = await actions.getApprovalLeave(req)
      if (tag) {
        this.leaveList = this.leaveList.concat(res.data.list)
      } else {
        this.leaveList = res.data.list
      }
      this.morePage = res.data.hasNextPage
    },
    async copyLeaveGet(tag = false) {
      let value1 = ''
      if (this.value1 === '0') {
        value1 = ''
      } else if (this.value1 === '4') {
        value1 = '0'
      } else {
        value1 = this.value1
      }
      if (tag) {
        this.pageList.page += 1
      } else {
        this.pageList.page = 1
      }
      const req = {
        applicantCode: '',
        state: value1,
        page: this.pageList.page,
        size: this.pageList.size,
        userCode: store.userInfo.userCode,
        time: '',
        day: this.value2 === '0' ? '' : this.value2,
        reasonId: this.value0 === '0' ? '' : this.value0
      }
      const res = await actions.getCopyLeave(req)
      if (tag) {
        this.leaveList = this.leaveList.concat(res.data.list)
      } else {
        this.leaveList = res.data.list
      }
      this.morePage = res.data.hasNextPage
    },
    loadMore() {
      if (!this.morePage) {
        this.$tools.toast('数据已加载完毕')
        return
      }
      if (this.currentIndex === '2') {
        this.approvalLeaveGet(true)
      } else if (this.currentIndex === '3') {
        this.copyLeaveGet(true)
      } else {
        this.teacherLeaveGet(true)
      }
    },
    tabChange(type) {
      this.currentIndex = type
      if (type === '2') {
        this.approvalLeaveGet()
      } else if (type === '3') {
        this.copyLeaveGet()
      } else {
        this.teacherLeaveGet()
      }
    },
    addLeave() {
      this.$tools.navTo({
        url: './add',
        title: '新增请假单'
      })
    },
    check(oddNumbers) {
      const arr1 = ['修改', '撤回']
      this.$tools.actionsheet(arr1, (index) => {
        if (index === 0) {
          this.$tools.navTo({
            url: `./add?oddNumbers=${oddNumbers}`,
            title: '编辑请假单'
          })
        } else if (index === 1) {
          this.$tools.confirm(`确定${arr1[index]}吗?`, () => {
            actions.recallLeave(oddNumbers).then((res) => {
              this.$tools.toast('操作成功')
              this.teacherLeaveGet()
            })
          })
        }
      })
    },
    detail(id) {
      if (this.currentIndex === '3') {
        this.leaveRead(id)
      }
      this.$tools.navTo({
        url: `./detail?id=${id}&current=${this.currentIndex}`,
        title: '查看详情'
      })
    },
    leaveRead(oddNumbers) {
      const req = {
        userCode: store.userInfo.userCode,
        oddNumbers: oddNumbers
      }
      actions.readTeacherLeave(req)
    }
  }
}
</script>

<style lang="scss" scoped>
.leave {
  background-color: $u-bg-color;
  position: relative;
  .nav-tab {
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background-color: $uni-bg-color;
    margin-bottom: 15rpx;
    .nav-item {
      width: 30%;
      float: left;
      &:nth-of-type(2) {
        margin: 0 37rpx;
      }
    }
    .active {
      border-bottom: 4rpx solid $u-type-info-disabled;
    }
  }
  .select-box {
    background-color: $u-bg-color;
    padding: 20rpx 0;
    .select {
      width: 30%;
      float: left;
      border: none;
      margin-left: 20rpx;
    }
  }
  .scroll-h {
    height: calc(100vh - 190rpx);
    .record-box {
      padding: 5rpx 5rpx 0 5rpx;
      .leave-box {
        margin: 20rpx;
        background-color: $uni-bg-color;
        border-radius: $u-border-radius;
        padding: 25rpx 20rpx;
        &:first-of-type {
          margin-top: 0;
        }
        .leave-top {
          margin-bottom: 10rpx;
          .leave-icon {
            font-size: 40rpx;
            font-weight: bolder;
          }
          .leave-title {
            font-size: 32rpx;
            font-weight: bold;
          }
        }
        .leave-info {
          color: $u-tips-color;
          .leave-pur {
            padding: 6rpx 0;
            font-size: 28rpx;
          }
        }
        .leave-bottom {
          margin-top: 10rpx;
          padding-top: 10rpx;
          font-size: 28rpx;
          border-top: 1rpx solid ￥u-border-color;
          .leave-time {
            color: $u-light-color;
          }
          .leave-detail {
            font-weight: bold;
          }
        }
      }
    }
  }
  .add-icon {
    position: absolute;
    left: 43%;
    bottom: 5%;
    image {
      height: 100rpx;
      width: 100rpx;
    }
  }
}
.dropdown {
  padding: 4rpx 18rpx 18rpx 18rpx;
  background: $uni-bg-color;
  font-size: 12px;
}
.dropdown-menu {
  width: 50%;
  padding: 2rpx 0;
  border: 1rpx solid $u-border-color;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
}
.dropdown-menu:first-child {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}
.dropdown-menu:last-child {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.dropdown-item__selected {
  padding: 10rpx;
}
@font-face {
  font-family: 'iconfont'; /* project id 1564327 */
  src: url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.eot');
  src: url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.eot?#iefix') format('embedded-opentype'),
    url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.woff2') format('woff2'),
    url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.woff') format('woff'),
    url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.ttf') format('truetype'),
    url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.svg#iconfont') format('svg');
}
</style>
