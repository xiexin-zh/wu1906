<template>
  <div class="page-layout qui-fx-ver">
    <div class="bg-fff padd-l10 padd-r10 " style="height:210px">
      <detail-show :detail-info="detailInfo" :title="infoTitle"></detail-show>
    </div>
    <div class="title">
      <span class="tip"></span>
      <span>参数设置</span>
    </div>
    <div class="form-box qui-fx-f1 mar-t10 bg-fff padd-l10 padd-r10">
      <a-form :form="form">
        <a-form-item label="设备名称" v-bind="formItemLayout">
          <a-input v-decorator="['deviceName', { initialValue: deviceInfo.deviceName }]" disabled />
        </a-form-item>
        <a-form-item label="关联场地" v-bind="formItemLayout">
          <a-input v-decorator="['fieldName', { initialValue: deviceInfo.fieldName }]" disabled />
        </a-form-item>
        <a-form-item label="管理密码" v-bind="formItemLayout">
          <a-input
            v-decorator="[
              'passWord',
              {
                initialValue: deviceInfo.passWord ,rules: [{ required: true, message: '请输入管理密码' }]}
            ]"
            placeholder="请输入管理密码"
          />
        </a-form-item>
        <a-form-item label="消费模式" v-bind="formItemLayout" required>
          <a-select
            @change="changeType"
            v-decorator="[
              'patternType',
              { initialValue: deviceInfo.patternType, rules: [{ required: true, message: '请选择消费模式' }] }
            ]"
            placeholder="请选择消费模式"
          >
            <a-select-option value="1">自由模式</a-select-option>
            <a-select-option value="2">定额模式</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="通行时间"
          v-bind="formItemLayout"
          :required="true"
          v-if="deviceInfo.patternType === '2' || deviceInfo.patternType === 2"
        >
          <div
            class="action qui-fx-jsb qui-fx-ac"
            v-for="(item, i) in accessTimeList"
            :key="item.key"
          >
            <div class="left">
              <template>
                <a-time-picker
                  format="HH:mm"
                  :defaultValue="moment(item.startTime, 'HH:mm')"
                  @change="(val,dateStrings)=>changeTime(val,dateStrings,'startTime', i)"
                  :disabledMinutes="(val)=>getStartMinutes(val, i)"
                  :disabledHours="(val)=>getStartHours(val, i)"
                />
                <span>至</span>
                <a-time-picker
                  format="HH:mm"
                  :disabledHours="(val)=>getDisabledHours(val, i)"
                  :disabledMinutes="(val)=>getDisabledMinutes(val, i)"
                  :defaultValue="moment(item.endTime, 'HH:mm')"
                  @change="(val,dateStrings)=>changeTime(val,dateStrings,'endTime', i)"
                />
                <span>定额 :</span>
                <a-input-number
                  @change="(val,dateStrings)=>numChange(val, i)"
                  :min="1"
                  :max="999999999"
                  :defaultValue="item.limitAmount"
                  placeholder="定额" />
              </template>
            </div>
            <div class="right qui-fx">
              <img :src="deleteImg" alt @click="deleteAccessTime(i)" />
            </div>
          </div>
          <img :src="addImg" alt @click="addAccessTime(0)" />

        </a-form-item>
        <a-form-item label="定额时段" v-bind="formItemLayout" v-if="deviceInfo.patternType === '2' || deviceInfo.patternType === 2">
          非定额时段将自动切换回自由模式
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 15, offset: 3 }">
          <a-button style="margin-right:50px;" @click="cancle">取消</a-button>
          <a-button type="primary" @click="handleSubmit">保存</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import addImg from '../../assets/img/add.png'
import deleteImg from '../../assets/img/delete.png'
import { mapState, mapActions } from 'vuex'
import NoData from '@c/NoData'
import DetailShow from '@c/DetailShow'
export default {
  name: 'SetMachine',
  components: {
    NoData,
    DetailShow
  },
  data() {
    return {
      moment,
      form: this.$form.createForm(this),
      title: '',
      formStatus: false,
      machineId: '',
      detailInfo: [],
      infoTitle: '基本信息',
      schoolInfo: {},
      adminId: '',
      visible: false,
      plateformType: '2',
      schoolList: [],
      userTag: false,
      maxHeight: 0,
      groupName: '',
      accessTimeList: [],
      addImg,
      deleteImg,
      cardInfo: {},
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      count: 0,
      deviceSn: '',
      deviceId: '',
      deviceInfo: {
        patternType: '1'
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.deviceId = this.$route.query.id
    this.deviceSn = this.$route.query.deviceSn
    this.consumeDetailGet()
  },
  methods: {
    ...mapActions('home', ['addConsume', 'getDetailConsume']),
    async consumeDetailGet() {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        deviceSn: this.deviceSn,
        id: this.deviceId
      }
      const res = await this.getDetailConsume(req)
      this.deviceInfo = res.data
      this.deviceInfo.patternType = this.deviceInfo.patternType === 1 ? '1' : '2'
      this.accessTimeList = res.data.limits ? res.data.limits : []
      this.patternType = this.deviceInfo.patternType === 1 ? '1' : '2'
      this.showMachine(this.machineId)
    },
    async showMachine(id) {
      this.detailInfo = [
        {
          key: '设备名称',
          val: this.deviceInfo.deviceType
        },
        {
          key: '绑定机构',
          val: this.deviceInfo.schoolName
        },
        {
          key: '网络状态',
          val: this.deviceInfo.deviceStatus === '1' ? '离线' : '在线'
        },
        {
          key: '序列号',
          val: this.deviceInfo.deviceSn
        },
        {
          key: '固件版本',
          val: this.deviceInfo.firmwareVersion
        },
        {
          key: 'MAC地址',
          val: this.deviceInfo.macAddress
        },
        {
          key: '软件版本',
          val: this.deviceInfo.softwareVersion
        },
        {
          key: 'IP地址',
          val: this.deviceInfo.deviceIp
        }
      ]
    },
    cancle() {
      const path = '/machineManage'
      this.$router.push({ path })
    },
    changeType(val) {
      this.deviceInfo.patternType = val
      this.patternType = val
    },
    // 添加考勤时间
    addAccessTime(index, key) {
      this.accessTimeList.push({ startTime: '00:00', endTime: '00:00', limitAmount: 0, key: this.count })
      this.count = this.count + 1
    },
    numChange(val, index) {
      this.accessTimeList[index].limitAmount = val
    },
    changeTime (val, dateStrings, type, index) {
      if (type === 'startTime') {
        this.accessTimeList[index].startTime = moment(val).format('HH:mm')
      } else {
        this.accessTimeList[index].endTime = moment(val).format('HH:mm')
      }
    },
    getStartHours(val, index) {
      if (index === 0) {
        return
      }
      const hours = []
      const time = this.accessTimeList[index - 1].endTime
      const timeArr = time.split(':')
      for (var i = 0; i < parseInt(timeArr[0]); i++) {
        hours.push(i)
      }
      return hours
    },
    getDisabledHours(val, index) {
      const hours = []
      const time = this.accessTimeList[index].startTime
      const timeArr = time.split(':')
      for (var i = 0; i < parseInt(timeArr[0]); i++) {
        hours.push(i)
      }
      return hours
    },
    getStartMinutes(selectedHour, index) {
      if (index === 0) {
        return
      }
      const time = this.accessTimeList[index - 1].endTime
      const timeArr = time.split(':')
      const minutes = []
      if (selectedHour === parseInt(timeArr[0])) {
        for (var i = 0; i < parseInt(timeArr[1]); i++) {
          minutes.push(i)
        }
      }
      return minutes
    },
    getDisabledMinutes(selectedHour, index) {
      const time = this.accessTimeList[index].startTime
      const timeArr = time.split(':')
      const minutes = []
      if (selectedHour === parseInt(timeArr[0])) {
        for (var i = 0; i < parseInt(timeArr[1]); i++) {
          minutes.push(i)
        }
      }
      return minutes
    },
    // 移除计划
    deleteAccessTime(index) {
      if (index === 0 && this.accessTimeList.length === 1) {
        this.$message.warning('已经是最后一项了')
        return false
      }
      const arr = this.accessTimeList.splice(index, 1)
      this.accessTimeList = this.accessTimeList.filter(tag => tag !== arr)
    },
    // 提交权限组
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.authorization = this.authorization
          values.devSn = this.deviceSn
          const rules = []
          const weeks = []
          weeks.forEach(ele => {
            ele.accessTimeList.forEach(item => {
              rules.push({
                weekCode: ele.key,
                accessStart: item.startTime ? item.startTime : '00:00',
                accessEnd: item.endTime ? item.endTime : '00:00'
              })
            })
          })
          let result = true
          rules.forEach(eve => {
            if (
              parseInt(eve.accessStart.split(':')[0]) * 60 + parseInt(eve.accessStart.split(':')[1]) >
              parseInt(eve.accessEnd.split(':')[0]) * 60 + parseInt(eve.accessEnd.split(':')[1])
            ) {
              result = false
            }
          })
          if (!result) {
            this.$message.warning('通行开始时间不能晚于结束时间')
          }
          if (values.patternType === '1') {
            values.consumeLimits = []
          } else {
            values.consumeLimits = this.accessTimeList.map(el => {
              return {
                'devSn': this.deviceSn,
                'limitAmount': el.limitAmount,
                'schoolCode': this.userInfo.schoolCode,
                'startTime': el.startTime,
                'endTime': el.endTime
              }
            })
          }
          this.addConsume(values).then(res => {
            this.$message.success('添加成功')
            const path = '/machineManage'
            this.$tools.goNext(() => {
              this.$router.push({ path })
            })
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.form-box {
  max-height: calc(100vh - 350px);
  overflow: scroll;
}
  .action {
    margin: 5px 0;

  }
  img {
        width: 24px;
        height: 24px;
        margin: 0 10px;
        cursor: pointer;
      }
  span
   {
      margin: 0 5px;
    }
  .title {
    margin: 20px;
    height: 30px;
    border-bottom: 1px solid #ccc;
    .tip {
      display: inline-block;
      width: 5px;
      height: 18px;
      // margin-top: 8px;
      background-color: #6882DA;
    }
  }
</style>
