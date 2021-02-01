<template>
  <view class="item u-page u-fx-ver">
    <view class="item-info u-padd-l20 u-padd-r20">
      <view class="info-box u-padd-l30 u-padd-r30 u-fx-jsb">
        <view class="u-fx-f1">
          <view class="info-list u-mar-r30 u-mar-b30" v-for="(item,index) in dataInfo" :key="index">
            <view>
              <text class="u-tips-color u-mar-r10">{{item.title}}：</text>
              {{item.content}}
            </view>
          </view>
        </view>
        <view class="item-status">
          <image 
            :src="taskList.taskType === '1' && taskList.state === '1' ? '/mobile-img/safe-rcywc.png' : 
                  taskList.taskType === '1' && taskList.state === '0' ? '/mobile-img/safe-rcdwc.png' : 
                  taskList.taskType === '2' && taskList.state === '1' ? '/mobile-img/safe-sbywc.png' : 
                  taskList.taskType === '2' && taskList.state === '0' ? '/mobile-img/safe-sbdwc.png' : 
                  taskList.taskType === '3' && taskList.state === '1' ? '/mobile-img/safe-hdywc.png' : 
                  taskList.taskType === '3' && taskList.state === '0' ? '/mobile-img/safe-hddwc.png' : ''
            "
          ></image>
        </view>
        <view 
          :class="['info-title',taskList.taskType === '1' ? 'day-yes': taskList.taskType === '2' ? 'equip-yes' : taskList.taskType === '3' ? 'guid-yes' : '']"> 
          {{ taskList.taskType === '1' ? '日常巡查' : taskList.taskType === '2' ? '设备巡查' : taskList.taskType === '3' ? '安全护导' : '' }} 
        </view>
      </view>
    </view>
    <view class="item-content u-mar-20 u-fx-f1 u-fx-ver u-shadow">
      <view class="content-title u-border-bottom u-fx-jsb">
        <view class="u-font-1"> 参与人员</view>
        <view class="u-font-02 u-tips-color"> 已完成{{num}}人/共{{total}}人</view>
      </view>
      <scroll-view  scroll-y="true" class="scroll-h" @scrolltolower="loadMore" >
        <no-data msg="暂无数据~" v-if="userList.length === 0"></no-data>
        <view class="leave-box u-fx-jsb" v-for="(item,index) in userList" :key="index" @click="detail(item.taskId, item.userCode, item.taskName)">
          <view class="u-fx-jsb">
            <view class="item-img">
              <image class="u-mar-l10" src="/mobile-img/mine-icon-act.png" mode=""></image>
            </view>
            <view class="u-mar-l30 u-fx-ver">
              <view> {{ item.userName }} </view>
              <view  class="u-font-02 u-light-color"> {{item.completeTime | gmtToDate('dateTime')}} </view>
            </view>
          </view>
          <view>
           <u-button :class="['u-font-01', 'btn', item.state === '1' ? 'day-yes' : 'day-no' ]" type="primary" shape="square" size="mini" @click="detail(item.taskId, item.userCode, item.taskName)">{{ item.state === '1' ? '已完成' : '待完成'}}</u-button>
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
      dataInfo: [],
      num: 0,
      total: 0,
      userList: [],
      taskList: {},
      type: ''
    }
  },
  mounted () {
    this.taskId = this.$tools.getQuery().get('id')
    this.type = this.$tools.getQuery().get('type')
    this.myTaskGet()
  },
  methods: {
    async myTaskGet () {
      const res =await actions.getMyTask(this.taskId)
      this.taskList = res.data
      this.userList = res.data.users
      this.total = res.data.users.length
      this.num = 0
      res.data.users.map((el, index) => {
        if (el.state === '1') {
          this.num++
        } 
      })
      this.dataInfo = [
        {
          title: '巡检区域',
          content: res.data.areaName
        },{
          title: '任务时间',
          content: 
          this.type === '0' ? `${this.$tools.getDateTime(res.data.startTime,'time')}-${this.$tools.getDateTime(res.data.endTime,'time')}` 
          : `${res.data.year}-第${ res.data.dateNum}${res.data.taskTimeType === '2' ? '周'
                  : res.data.taskTimeType === '3' ? '月' 
                  : res.data.taskTimeType === '4' ? '季度' : ''}任务 ` 
        },{
          title: '完成方式',
          content: res.data.completeType === '1' ? '一个人完成则所有人完成' : '必须所有人完成才视为完成'
        }
      ]
    },
    detail (id,code,name) {
      this.$tools.navTo({
				url: `./detail?taskId=${id}&code=${code}`,
				title: name
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
.item {
  .item-info {
    height: 350rpx;
    background: url('/mobile-img/safe-task.png') no-repeat; 
    background-size: 100% 95%;
    .info-box {
      height: 280rpx;
      width: 100%;
      margin-top: 65rpx;
      background-color: #fff;
      border-radius: $u-border-radius;
      position: relative;
      align-items: center;
      .info-title {
        position: absolute;
        top:0;
        right:0;
        width: 148rpx;
        height: 56rpx;
        line-height: 56rpx;
        border-top-right-radius: $u-border-radius;
        border-bottom-left-radius: $u-border-radius;
        text-align: center;
      }
      .info-list {
        &:last-of-type {
          margin-bottom: 0;
        }
      }
      .item-status {
        width: 110rpx;
        height: 110rpx;
        image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .item-content {
    padding: 36rpx 48rpx;
    background-color: #fff;
    border-radius: $u-border-radius;
    .content-title{
      height: 70rpx;
      line-height: 70rpx;
    }
    .scroll-h {
      height: calc(100vh - 560rpx);
        .leave-box {
          border-bottom: 1px solid $u-border-color;
          height: 130rpx;
          align-items: center;
          .item-img {
            width: 70rpx;
            height: 70rpx;
            border-radius: 50%;
            image{
              width: 100%;
              height: 100%;
            }
          }
        
      }
    }
  }
}
</style>
