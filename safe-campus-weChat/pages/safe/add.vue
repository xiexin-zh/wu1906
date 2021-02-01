<template>
  <view>
		<scroll-view  scroll-y="true" class="scroll-h ">
			<view class="add-top u-padd-t30 u-padd-r20 u-padd-l20" >
				<view class="add-info u-padd-20 u-fx-jsb u-shadow">
					<view class="u-fx">
						<view 
              :class="['add-name', 'u-mar-r20', 'u-padd-r20', 'u-padd-l20', taskResultList.taskType === '1' ? 'day-yes': taskResultList.taskType === '2' ? 'equip-yes' : taskResultList.taskType === '3' ? 'guid-yes' : '']"> 
              {{ taskResultList.taskType === '1' ? '日常巡查' : taskResultList.taskType === '2' ? '设备巡查' : '安全护导'  }} 
            </view>
						<view class="u-fx-ver u-fx-jsa"> 
							<view class="u-font-1 u-content-color"> {{taskResultList.taskName}}<span class="u-font-02">({{taskResultList.userName}})</span> </view>
              <view class="u-font-01 u-tips-color" v-if="taskResultList.timeType === '1'">{{taskResultList.startTime | gmtToDate('time')}} - {{taskResultList.endTime | gmtToDate('time')}}</view>
            	<view class="u-font-01 u-tips-color" v-if="taskResultList.timeType === '2'">
                {{ taskResultList.year }}-第{{ taskResultList.dateNum }}{{
                  taskResultList.taskTimeType === '2' ? '周'
                  : taskResultList.taskTimeType === '3' ? '月' 
                  : taskResultList.taskTimeType === '4' ? '季度' : ''
                }}任务
              </view>
						</view>
					</view>
					<view class="add-status">
						<image 
              :src="taskResultList.taskType === '1' && taskResultList.state === '1' ? '/mobile-img/safe-rcywc.png' : 
                    taskResultList.taskType === '1' && taskResultList.state === '0' ? '/mobile-img/safe-rcdwc.png' : 
                    taskResultList.taskType === '2' && taskResultList.state === '1' ? '/mobile-img/safe-sbywc.png' : 
                    taskResultList.taskType === '2' && taskResultList.state === '0' ? '/mobile-img/safe-sbdwc.png' : 
                    taskResultList.taskType === '3' && taskResultList.state === '1' ? '/mobile-img/safe-hdywc.png' : 
                    taskResultList.taskType === '3' && taskResultList.state === '0' ? '/mobile-img/safe-hddwc.png' : ''
              "
            ></image>
					</view>
				</view>
			</view>
      <view v-if="taskResultList.taskType === '1'">
        <view class="content-title u-padd-l20 u-padd-r20 u-fx-jsb">
          <view class="u-font-1"> 巡检项 </view>
          <view class="u-font-02"> 不通过/通过 </view>
        </view>
        <view class="add-content u-fx-ver u-bg-fff">
          <view class="add-item u-padd-20 u-fx-jsb u-bd-b" v-for="list in taskResultList.checkList" :key="list.id">
            <view>{{list.name}}</view>
            <u-switch v-model="list.checked" :size="30"></u-switch>
          </view>
        </view>
      </view>
       <view v-if="taskResultList.taskType === '2'">
        <view class="content-title u-padd-l20 u-padd-r20 u-fx-jsb">
          <view class="u-font-1"> 检查设备 </view>
          <view class="u-font-02"> 异常/正常 </view>
        </view>
        <view class="collapse-box" v-for="list in taskResultList.checkList" :key="list.id">
          <u-collapse :item-style="itemStyle" v-if="list.children && list.children.length > 0">
            <u-collapse-item :title="list.name">
              <view class="add-item u-padd-20 u-fx-jsb u-bd-b" v-for="item in list.children" :key="item.id">
                <view>{{item.name}}</view>
                <u-switch v-model="item.checked" :size="30"></u-switch>
              </view>
            </u-collapse-item>
          </u-collapse>
           <view class="add-item u-padd-20 u-fx-jsb u-bd-b" v-else>
            <view>{{list.name}}</view>
            <u-switch v-model="list.checked" :size="30"></u-switch>
          </view>
        </view>
      </view>
			<view v-if="taskResultList.taskType === '3'">
        <view class="content-title u-padd-l20 u-padd-r20 u-fx-jsb">
          <view class="u-font-1"> 护导详情 </view>
          <view class="u-font-02"> 异常/正常</view>
        </view>
        <view class="add-content u-fx-ver u-bg-fff">
          <view class="add-item u-padd-20 u-fx-jsb u-bd-b" v-for="list in taskResultList.checkList" :key="list.id">
            <view>{{list.name}}</view>
            <u-switch v-model="list.checked" :size="30"></u-switch>
          </view>
          <view class="u-bd-b u-padd-20">
            <view>护导报告：</view>
            <textarea v-model="taskResultList.remark" class="item-text-area u-font-02 u-padd-t20" placeholder="请填写护导报告" />
          </view>
          <view class="u-bd-b u-padd-20">
            <view>照片：</view>
            <an-upload-img total="9" v-model="taskResultList.photoUrls" style="margin: 20rpx"></an-upload-img>
          </view>
        </view>
			</view>
			<view v-if="taskResultList.taskType !== '3'">
        <view class="content-title u-padd-l20 u-padd-r20 u-fx-jsb">
          <view class="u-font-1"> 巡检报告</view>
        </view>
        <view class="add-content u-fx-ver u-bg-fff">
          <view class="u-bd-b u-padd-20">
            <view>照片：</view>
            <an-upload-img v-model="taskResultList.photoUrls" total="9" style="margin: 20rpx"></an-upload-img>
          </view>
          <view class="u-bd-b u-padd-20 ">
            <view>备注：</view>
            <textarea v-model="taskResultList.remark" class="item-text-area u-font-02 u-padd-t20" placeholder="请填写备注" />
          </view>
          <view class="u-fx-ac u-bd-b u-padd-20 ">
            <view>位置：{{taskResultList.location}}</view>
          </view>
        </view>
			</view>
		</scroll-view>
    <view class="footer-btn u-fx-ac">
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
        @click="submitForm"
      >
        确定
      </u-button>
    </view>
  </view>
</template>

<script>
import eventBus from '@u/eventBus'
import anUploadImg from '@/components/an-uploadImg/an-uploadImg'
import { store, actions } from './store/index.js'
export default {
  components: {
    anUploadImg
  },
  data () {
    return {
      itemStyle:{
        background:'#fff',
        paddingLeft:'20rpx',
        paddingRight:'20rpx',
        marginTop:'20rpx'
      },
      checked: false,
      taskId: '',
      taskResultList: {}
    }
  },
  mounted () {
    this.taskId = this.$tools.getQuery().get('taskId')
    this.taskResultGet()
  },
  methods: {
    async  taskResultGet () {
      const res = await actions.getTaskResult(this.taskId)
      this.taskResultList = res.data
    },
    dataFilter (data) {
      return data.map(el=>{
        return {
          ...el,
          state: el.checked ? '1' : '2',
          children: el.children && el.children.length > 0 ? this.dataFilter(el.children) : []
        }
      })
    },
    submitForm () {
      this.taskResultList.photoUrls = this.taskResultList.photoUrls.map(el => {
        return el.url
      })
      this.taskResultList.taskId = this.taskId
      this.taskResultList.resultList = this.dataFilter(this.taskResultList.checkList)
      actions.getCompleteTask(this.taskResultList).then(res=>{
			this.$tools.toast("操作成功")
        this.$tools.goNext(() => {
          eventBus.$emit('getList')
          this.$tools.goBack()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 120rpx);
  .add-status {
    width: 100rpx;
    height: 100rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
 .content-title {
   height: 90rpx;
   align-items: center;
  }
  .add-content {
    background-color: #fff;
    image {
      width: 120rpx;
      height: 120rpx;
    }
  }
  .add-top {
    height: 200rpx;
  }
 .add-info {
    height: 170rpx;
    background-color: #fff;
    align-items: center;
    border-radius:  $u-border-radius;
    .add-name {
      height: 98rpx;
      width: 98rpx;
      line-height: 36rpx;
      padding-top: 15rpx;
      border-radius:  $u-border-radius;
    }
  }
  .item-text-area {
		height: 120rpx;
		width: 100%;
		line-height: 40rpx;
		color: $u-content-color;
  }
  .add-item {
    align-items: center;
  }
  .collapse-box {
    margin-top: -20rpx;
  }
}
</style>
