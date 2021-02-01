<template>
  <view class="schedule">
    <scroll-view scroll-y="true" class="scroll-h">
      <view class="schedule-calendar">
        <lxCalendar :value="value" ref="lxCalendar" @change="change"></lxCalendar>
      </view>
      <view class="schedule-sub u-mar-t20 u-mar-b20">
        <u-subsection
          mode="subsection"
          :list="dataList"
          active-color="#0084FF"
          :current="current"
          @change="tabChange"
        ></u-subsection>
      </view>
      <view class="schedule-content u-fx-f1 u-fx-ver">
        <no-data
          msg="暂无数据~"
          v-if="(current === 0 && scheduleInfo.length === 0) || (current === 1 && scheduleList.dateSchedulings.length === 0 && scheduleList.timeSchedulings.length === 0)"
        ></no-data>
        <view class="u-padd-l20 u-padd-r20" v-else>
          <view v-if="current === 0">
            <view
              class="schedule-info u-padd-t20 u-padd-b20 u-padd-l30 u-padd-r30 u-mar-b30 u-fx-ver u-shadow"
              v-for="(item,index) in scheduleInfo"
              :key="index"
              @click="detail(0, item)"
            >
              <view>
                <text class="u-mar-r40 u-tips-color">巡检区域：</text>
                {{item.areaName}}
              </view>
              <view>
                <text class="u-mar-r40 u-tips-color">任务类型：</text>
                <u-tag
                  text="日常巡查"
                  size="mini"
                  shape="circle"
                  v-if="item.taskTypes.indexOf('1') > -1"
                />
                <u-tag
                  class="u-mar-l20"
                  text="设备巡查"
                  type="warning"
                  size="mini"
                  shape="circle"
                  v-if="item.taskTypes.indexOf('2') > -1"
                />
                <u-tag
                  class="u-mar-l20"
                  text="安全护导"
                  type="success"
                  size="mini"
                  shape="circle"
                  v-if="item.taskTypes.indexOf('3') > -1"
                />
              </view>
              <view>
                <text class="u-mar-r40 u-tips-color">任务完成度：</text>
                {{item.completeNum}}/{{item.allTaskNum}}（已完成/任务总数）
              </view>
              <view>
                <text class="u-mar-r40 u-tips-color">参与人数：</text>
                {{item.personNum}}人
              </view>
            </view>
          </view>
          <view v-else class="my-task">
            <view>
              <view
                class="task-type u-font-1 u-main-color"
                v-if="scheduleList.dateSchedulings && scheduleList.dateSchedulings.length !== 0"
              >全天</view>
              <view
                class="task-info u-padd-r20 u-padd-l20 u-mar-b20 u-fx-jsb u-shadow"
                v-for="item in scheduleList.dateSchedulings"
                :key="item.taskId"
                @click="detail(1, item)"
              >
                <view class="u-fx">
                  <view
                    class="task-name u-mar-r20 u-padd-r20 u-padd-l20"
                  >{{ detailInfo.taskType === '1' ? '日常巡查' : detailInfo.taskType === '2' ? '设备巡查' : '安全护导' }}</view>
                  <view class="u-fx-ver u-fx-jsa">
                    <view class="$u-font-03 u-content-color">{{item.taskName}}</view>
                    <view class="$u-font-01 u-tips-color">
                      {{ item.year }}-第{{ item.dateNum }}{{
                      item.taskTimeType === '2' ? '周'
                      : item.taskTimeType === '3' ? '月'
                      : item.taskTimeType === '4' ? '季度' : ''
                      }}任务
                    </view>
                  </view>
                </view>
                <view>
                  <u-button
                    :class="['u-font-01','btn',item.state === '1' ? 'day-yes' : 'day-no' ]"
                    type="primary"
                    shape="square"
                    size="mini"
                    @click="detail(1, item)"
                  >{{ item.state === '1' ? '已完成' : '待完成'}}</u-button>
                </view>
              </view>
              <view
                class="task-type u-font-1"
                v-if="scheduleList.timeSchedulings && scheduleList.timeSchedulings.length !== 0"
              >限时</view>
              <view
                class="task-info u-padd-r20 u-padd-l20 u-mar-b20 u-fx-jsb u-shadow"
                v-for="item in scheduleList.timeSchedulings"
                :key="item.taskId"
                @click="detail(1, item)"
              >
                <view class="u-fx">
                  <view
                    class="task-name time-yes u-padd-r20 u-padd-l20 u-mar-r20"
                  >{{ item.taskType === '1' ? '日常巡查' : item.taskType === '2' ? '设备巡查' : '安全护导' }}</view>
                  <view class="u-fx-ver u-fx-jsa">
                    <view class="$u-font-03 u-content-color">{{item.taskName}}</view>
                    <view
                      class="$u-font-01 u-tips-color"
                    >{{item.startTime | gmtToDate('time')}} - {{item.endTime | gmtToDate('time')}}</view>
                  </view>
                </view>
                <view>
                  <u-button
                    :class="['u-font-01','btn',item.state === '1'?'time-yes':'time-no' ]"
                    type="primary"
                    shape="square"
                    size="mini"
                    @click="detail(1, item)"
                  >{{ item.state === '1' ? '已完成' : '待完成'}}</u-button>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="footer-btn u-fx-ac" v-if="current === 1">
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
        @click="scanQRCode"
      >扫码巡检</u-button>
    </view>
  </view>
</template>

<script>
import wx from 'weixin-js-sdk'
import lxCalendar from '../../components/lx-calendar/lx-calendar.vue'
import { store, actions } from './store/index.js'
export default {
  components: {
    lxCalendar
  },
  data() {
    return {
      dataList: [
        {
          name: '所有'
        },
        {
          name: '我的'
        }
      ],
      scheduleInfo: [],
      current: 0,
      date: '',
      scheduleList: {},
      value: ''
    }
  },
  mounted() {
    this.currentDate = this.$tools.getDateTime(new Date(), 'date')
    this.currentTmie = this.$tools.getDateTime(new Date(), 'second')
    this.$refs.lxCalendar.nowYear = this.$tools.getQuery().get('date').substring(0, 4)
    this.$refs.lxCalendar.nowMonth =
      this.$tools.getQuery().get('date').substring(5, 6) === 0
        ? this.$tools.getQuery().get('date').substring(6, 7)
        : this.$tools.getQuery().get('date').substring(5, 7)
    this.value = this.$tools.getQuery().get('date')
    this.date = this.$tools.getQuery().get('date')
    this.scheduleGet()
  },
  methods: {
    tabChange(index) {
      this.current = index
      this.scheduleGet()
    },
    change(e) {
      this.date = e.fulldate === this.currentDate ? `${this.currentDate} ${this.currentTmie}` : `${e.fulldate} 23:59:59`
      this.scheduleGet()
    },
    async scheduleGet() {
      const req = {
        date: this.date,
        schoolCode: store.userInfo.schoolCode
      }
      if (this.current === 0) {
        const res = await actions.getAllSchedule(req)
        this.scheduleInfo = res.data
      } else {
        req.userCode = store.userInfo.userCode
        const res = await actions.getMySchedule(req)
        this.scheduleList = res.data
      }
    },
    detail(type, item) {
      const data = this.$tools.getDateTime(item.wdate, 'date').substring(0, 11).replace(/-/g, '/')
      const url = type ? `./detail?taskId=${item.taskId}` : `./list?date=${this.date}&code=${item.areaCode}&type=0`
      this.$tools.navTo({
        url: url,
        title: `${item.areaName}(${data})`
      })
    },
    scanQRCode() {
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        onlyFromCamera: true,
        success: (res) => {
          let result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
          const schoolCode = result.split('&')[0].substring(11)
          const code = result.split('&')[1].substring(5)
          this.$tools.navTo({
            url: `./task?date=${this.date}&schoolCode=${schoolCode}&code=${code}`,
            title: '巡查任务'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.schedule {
  .scroll-h {
    height: calc(100vh - 120rpx);
    .schedule-calendar {
      background-color: $u-type-primary;
      color: #fff;
    }
    .schedule-sub {
      padding: 0 180rpx;
    }
    .schedule-content {
      border-radius: $u-border-radius;
      .schedule-info {
        height: 254rpx;
        background-color: #fff;
        justify-content: space-between;
      }
      .my-task {
        .task-type {
          height: 80rpx;
          line-height: 80rpx;
          color: $u-main-color;
        }
        .task-info {
          height: 150rpx;
          align-items: center;
          background-color: #fff;
          .task-name {
            height: 98rpx;
            width: 98rpx;
            line-height: 36rpx;
            padding-top: 15rpx;
            border-radius: $u-border-radius;
            background-color: $u-type-primary-disabled;
            color: $u-type-primary;
          }
        }
      }
    }
  }
}
</style>
