<template>
  <view class="leave u-page">
    <view class="dropDown u-fx">
      <ms-dropdown-menu>
        <ms-dropdown-item v-model="value0" :list="casueList"></ms-dropdown-item>
      </ms-dropdown-menu>
      <ms-dropdown-menu>
        <ms-dropdown-item v-model="value1" :list="dateList"></ms-dropdown-item>
      </ms-dropdown-menu>
        <ms-dropdown-menu>
        <ms-dropdown-item v-model="value2" :list="dataList"></ms-dropdown-item>
      </ms-dropdown-menu>
    </view>
    <no-data msg="暂无数据~" v-if="leaveList.length === 0"></no-data>
    <scroll-view v-else scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
      <view class="content">
        <view class="record-box">
          <view class="leave-box" v-for="(item,index) in leaveList" :key="index" @click="detail(item.oddNumbers)">
            <view class="leave-top u-fx-jsb">
              <view class="leave-title"> {{ item.reason }} </view>
              <view v-if=" item.state === '0'  " class="leave-icon" @click.stop="check(item.oddNumbers)"> ...</view>
            </view>
            <view class="leave-info"> 
              <view class="leave-pur">开始时间：{{ item.startTime | gmtToDate }}</view>
              <view class="leave-pur">结束时间：{{ item.endTime | gmtToDate }}</view>
              <view class="leave-pur">描述：{{ item.remark }}</view>
              <view class="leave-pur">状态：
                <text :style="{color: item.state === '0' ? '#2979ff' : item.state === '1' ? '#19be6b' : item.state === '2' ? '#fa3534' : '#ff9900'}">
									{{ item.state | leaveState }}
								</text>
              </view>
            </view>
            <view class="leave-bottom u-fx-jsb">
              <view class="leave-time"> {{ item.initiationTime | gmtToDate }}</view>
              <view class="leave-detail u-tips-color"> 查看详情</view>
            </view>
          </view>
        </view>
      </view>
     </scroll-view>
     <view class="float-add-btn" @click="addLeave"> </view>
     <choose-child @change="childInfo"></choose-child>
  </view>
</template>

<script>
import wxApi from '@u/wxApi'
import eventBus from '@u/eventBus'
import chooseChild from '@/components/choose-child/choose-child.vue'
import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue'
import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue'
import { store, actions } from '../store/index.js'
export default {
  components: {
    msDropdownMenu,
    msDropdownItem,
    chooseChild
  },
  data () {
    return {
      dayInfo: [],
      leaveList: [],
      dataList: [],
      casueList: [{text:'全部请假',value:'0'}],
      dateList: [
        {
          text: '全部审批',
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
      value0: '0',
      value1: '0',
      value2: '0',
      pageList: {
				page: 1,
				size: 15
      },
      morePage: false
    }
  },
  watch: {
		value0 (val, oldval) {
			if (val !== oldval) {
        this.teacherLeaveGet()
			}
		},
		value1 (val, oldval) {
			if (val !== oldval) {
        this.teacherLeaveGet()
			}
    },
		value2 (val, oldval) {
			if (val !== oldval) {
        this.teacherLeaveGet()
			}
		}
  },
  mounted () {
		wxApi.getConfig('protal-door')
    this.studentCode = store.childList[0].userCode
    this.studentName = store.childList[0].userName
    this.schoolCode = store.childList[0].schoolCode
	  eventBus.$on('getList', () => {
			this.teacherLeaveGet()
    })
    this.leaveReasonGet()
    this.teacherLeaveGet()
    this.teacherGet(store.childList[0])
  },
  methods: {
    // 查询孩子是否有班主任
    async teacherGet(record) {
			const req = {
				userCode: record.userCode,
				schoolYearId: store.schoolYear.schoolYearId,
				schoolCode: record.schoolCode
			}
			const res = await actions.getTeacher(req)
			this.teacherInfo = res.data
		},
    async leaveReasonGet () {
      const res = await actions.getLeaveReason()
      const result = res.data.filter(el=>el.name === '事假' || el.name === '病假' || el.name === '其他')
      const data = result.map(el => {
        el.text = el.name
        el.value = el.id
        return el
      })
      this.casueList =this.casueList.concat(data)
    },
    async teacherLeaveGet ( tag = false ) {
      let value1 = ''
      if (this.value1 === '0') {
        value1 =  ''
      } else if ( this.value1 === '5' ) {
        value1 =  '0'
      } else {
        value1 =  this.value1 
      }
      if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
      const req = {
        applicantCode: store.userInfo.userCode,
        userCode: this.studentCode,
        time: '',
        state: value1,
        page: this.pageList.page,
				size: this.pageList.size,
        reasonId: this.value0 ===  '0' ? '' : this.value0,
        day: this.value2 === '0' ? '' : this.value2
      }
      const res = await actions.getStudentLeave(req)
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
			this.teacherLeaveGet(true)
		},
    addLeave () {
      if (!this.teacherInfo) {
				this.$tools.toast('暂无班主任，请联系学校管理员设置')
				return false
			}
			this.$tools.navTo({
        url: `./add?userName=${this.studentName}&userCode=${this.studentCode}&schoolCode=${this.schoolCode}`,
				title: '新增请假单'
			})
		},
    check (oddNumbers) {
      const arr1 = ['修改', '撤回']
        this.$tools.actionsheet(arr1, (index) => {
          if (index === 0) {
            this.$tools.navTo({
              url: `./add?oddNumbers=${oddNumbers}`,
              title: '编辑请假单'
            })
          } else {
            this.$tools.confirm(`确定${arr1[index]}吗?`, () => {
              actions.recallStudentLeave(oddNumbers).then(res => {
                this.$tools.toast('操作成功')
                this.teacherLeaveGet()
              })
            })
          }
        })
    },
    detail (id) {
      this.$tools.navTo({
        url: `./detail?id=${id}`,
        title: '查看详情'
      })
    },
    childInfo (item) {
      console.log('aaa',item)
      if (item.userCode !== this.studentCode) {
        this.studentCode = item.userCode
        this.studentName = item.userName
        this.schoolCode = item.schoolCode
        this.teacherLeaveGet()
        this.teacherGet(item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.leave {
  background-color: $u-bg-color;
  position: relative;
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
    height: calc(100vh - 110rpx);
    .record-box {
      padding: 5rpx 5rpx 0 5rpx; 
      .leave-box {
        margin: 20rpx;
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
          .leave-pur{
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
    font-family: 'iconfont';  /* project id 1564327 */
    src: url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.eot');
    src: url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.eot?#iefix') format('embedded-opentype'),
    url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.woff2') format('woff2'),
    url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.woff') format('woff'),
    url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.ttf') format('truetype'),
    url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.svg#iconfont') format('svg');
  }
</style>
