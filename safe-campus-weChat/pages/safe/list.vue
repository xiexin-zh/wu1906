<template>
  <view class="task u-page u-fx-ver">
    <view class="task-title u-padd-t30 u-padd-l20 u-padd-r20 u-font-02">
      <u-subsection 
        mode="subsection"
        :list="dataList" 
        active-color="#2979ff"
        :current="current"
        @change="tabChange">
      </u-subsection>
    </view>
    <view class="task-content u-fx-f1 u-fx-ver ">
      <scroll-view  scroll-y="true" class="scroll-h">
        <no-data msg="暂无数据~" v-if="areaList.dateSchedulings && areaList.timeSchedulings && areaList.dateSchedulings.length === 0 && areaList.timeSchedulings.length === 0"></no-data>
        <view class="u-padd-l20 u-padd-r20" v-else>
          <view class="task-type u-font-1 u-main-color" v-if="areaList.dateSchedulings && areaList.dateSchedulings.length !== 0">全天任务</view>
          <view class="task-info u-padd-r30 u-padd-l30 u-mar-b30 u-fx-jsb u-shadow" v-for="item in areaList.dateSchedulings" :key="item.taskId" @click="detail(1, item.taskId, item.taskName)">
            <view class="u-fx">
              <view class="task-name u-mar-r20"> 
                <image src="/mobile-img/safe-qt.png" mode=""></image>
              </view>
              <view class="u-fx-ver u-fx-jsa"> 
                <view class="$u-font-03 u-content-color"> {{item.taskName}} </view>
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
              <u-button :class="['u-font-01','btn',item.state === '1' ? 'day-yes' : 'day-no' ]" type="primary" shape="square" size="mini" @click="detail(1, item.taskId, item.taskName)">{{ item.state === '1' ? '已完成' : '待完成'}}</u-button>
            </view>
          </view>
          <view class="task-type u-font-1 u-main-color" v-if="areaList.timeSchedulings && areaList.timeSchedulings.length !== 0">限时任务</view>
          <view class="task-info u-padd-r30 u-padd-l30 u-mar-b30 u-fx-jsb u-shadow" v-for="item in areaList.timeSchedulings" :key="item.taskId" @click="detail(0, item.taskId, item.taskName)">
            <view class="u-fx">
              <view class="task-name u-mar-r20"> 
                <image src="/mobile-img/safe-tm.png" mode=""></image>
              </view>
              <view class="u-fx-ver u-fx-jsa"> 
                <view class="$u-font-03 u-content-color"> {{item.taskName}} </view>
                <view class="$u-font-01 u-tips-color">
                  {{item.startTime | gmtToDate('time')}} - {{item.endTime | gmtToDate('time')}}
                </view>
              </view>
            </view>
            <view>
              <u-button :class="['u-font-01','btn',item.state === '1' ? 'time-yes' : 'time-no' ]" type="primary" shape="square" size="mini" @click="detail(0, item.taskId, item.taskName)">{{ item.state === '1' ? '已完成' : '待完成'}}</u-button>
            </view>
          </view>
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
      areaList: {},
      dataList: [
        {
          name: '日常巡查'
        }, 
        {
          name: '设备巡查'
        }, 
        {
          name: '安全护导'
        }
      ],
      current: 0
    }
  },
  mounted () {
    this.type = this.$tools.getQuery().get("type")
    this.date = this.$tools.getQuery().get("date")
    this.areaCode = this.$tools.getQuery().get("code")
    this.areaLeaveGet()
  },
  methods: {
    tabChange (index) {
      this.current = index
      this.areaLeaveGet()
    },
    async areaLeaveGet () {
      const req = {
        schoolCode: store.userInfo.schoolCode,
        userCode: this.type === '1' ? this.areaCode : undefined,
        date: this.date,
        areaCode: this.type === '0' ? this.areaCode : undefined,
        taskType: this.current+1
      }
      if (this.type === '0') {
        const res = await actions.getAreaList(req)
        this.areaList = res.data
      } else {
        const res = await actions.getUserList(req)
        this.areaList = res.data
      }
    },
    detail (type,id, name) {
      const url = this.type === '0' ? `./item?id=${id}&type=${type}` : `./detail?taskId=${id}&code=${this.areaCode}`
      this.$tools.navTo({
				url: url,
				title: name
			})
    }
  }
}
</script>

<style lang="scss" scoped>
.u-page {
  background-color: #FFF;
  color: $u-main-color;
}
.task {
  .task-title {
    height: 100rpx;
  }
  .task-content {
    background-color: #fff;
    border-radius: $u-border-radius;
    .scroll-h {
      height: calc(100vh - 60rpx);
      .task-type {
        height: 100rpx;
        line-height: 100rpx;
        color: $u-main-color;
      }
      .task-info {
        height: 150rpx;
        align-items: center;
        .task-name {
          height: 80rpx;
          width: 80rpx;
          image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
