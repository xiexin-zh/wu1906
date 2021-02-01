<template>
  <view>
    <view class="dialog_box">
      <view class="info_title">请假信息</view>
      <view class="u-fx info_radio" style="margin: 20px 0 20px 0">
        <view class="info_text">请假类型：</view>
        <van-radio-group v-model="qjValue" class="u-fx" >
          <van-radio checked-color="#3d7eff" name="1">事假</van-radio>
          <van-radio checked-color="#3d7eff" name="2" style="margin-left: 40px">病假</van-radio>
        </van-radio-group>
      </view>
      <view class="u-fx u-fx-ac">
        <view @click="setTime(0)" :class="['u-fx-f1 u-tx-c time_box', {'time_box_act': timeType === 0}]">
          {{qjForm.startTime}}
        </view>
        <view style="margin:0 8px">至</view>
        <view @click="setTime(1)" :class="['u-fx-f1 u-tx-c time_box', {'time_box_act': timeType === 1}]">
          {{qjForm.endTime}}
        </view>
      </view>
      <view style="padding: 20px 0" class="u-fx">
        <van-datetime-picker
          :visible-item-count = "3"
          class="u-fx-f1"
          :show-toolbar = "false"
          v-model="qjTime"
          type="datetime"
          title="开始时间"
          @change="chooseTime"
        />
      </view>
    </view>
    <view @click="submitForm" class="room_submit_btn">确定</view>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { RadioGroup, Radio } from 'vant'
import mixins from '../utils/mixins'
export default {
  name: 'LeaveDialog',
  components: {
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio
  },
  mixins: [mixins],
  props: {
    currentStudent: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      qjValue: '1',
      currentIndex: -1,
      studentResult: [],
      timeType: 0,
      qjTime: new Date(),
      qjForm: {
        startTime: this.getDateTime(new Date()),
        endTime: '结束日期'
      }
    }
  },
  computed: {
    ...mapState('home', [
      'userInfo'
    ])
  },
  methods: {
    ...mapActions('manage', ['addLeave']),
    setTime (type) {
      this.timeType = type
      if (type) {
        if (this.qjForm.endTime === '结束日期') {
          this.qjTime = new Date(this.qjForm.startTime)
          return
        }
        this.qjTime = new Date(this.qjForm.endTime)
      } else {
        this.qjTime = new Date(this.qjForm.startTime)
      }
    },
    chooseTime () {
      let dataTime = this.getDateTime(this.qjTime)
      if (this.timeType) {
        this.qjForm.endTime = dataTime
      } else {
        this.qjForm.startTime = dataTime
      }
    },
    submitForm () {
      if (this.qjForm.endTime === '结束日期') {
        this.$toast({
          duration: 1200,
          message: '请选择结束日期'
        })
        return false
      }
      if (new Date(this.qjForm.endTime) <= new Date(this.qjForm.startTime)) {
        this.$toast({
          duration: 1200,
          message: '结束时间必须大于开始时间'
        })
        return false
      }
      if (this.qjForm.startTime < this.getDateTime(new Date())) {
        this.$toast({
          duration: 1200,
          message: '录入日期必须大于当前时间'
        })
        return false
      }
      // 提交请假
      this.addLeave({
        startTime: this.qjForm.startTime, // 请假结束时间
        endTime: this.qjForm.endTime, // 请假开始
        userCode: this.currentStudent.userCode, // 用户编码
        vacateType: this.qjValue// 请假类型 1-事假 2-病假
      }).then(data => {
        this.submitOk()
      })
    },
    submitOk () {
      this.$toast.success({
        message: '请假成功'
      })
      this.$emit('close-leave')
      this.qjForm.endTime = '结束日期'
      this.qjForm.startTime = this.getDateTime(new Date())
    },
    getDateTime (time) {
      return this.gmtToDate(time).substring(0, 16)
    }
  }
}
</script>

<style lang="less" scoped>
  .room_submit_btn {
    height: 98px;
    line-height: 98px;
    font-size: 34px;
    color: #fff;
    background-color: #3d7eff;
    text-align: center
  }
  .dialog_box {
    background-color: #fff;
    padding: 20px 25px
  }
  .info_radio {
    padding: 20px 0
  }
  .info_text {
    color: #222;
    font-size: 28px;
    width: 168px;
    text-align: right;
    margin-right: 20px;
  }
  .time_box {
    border: 4px $u-border-color solid;
    color:#333; background-color: #ddd; padding: 8px; border-radius: 4px
  }
  .time_box_act {
    border: 4px #3d7eff solid
  }
</style>
