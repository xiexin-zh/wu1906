<template>
  <div class="set-up page-layout qui-fx-ver" :style="{ maxHeight: maxHeight, overflow: 'auto' }">
    <div class="time-right">
      <div class="tips_con">
        <div class="tips-title">使用指南</div>
        <div class="tips-body">
          <p>
            1、测温计划全校通用。没有勾选的工作日，测温数据不计入测温计划统计（疫情日报）。
          </p>
          <p>
            2、测温计划时间必须首尾衔接，第一个计划从00:00开始，最后一个计划23:59结束。下一个计划的开始时间，默认是上一个计划的结束时间加一分钟，不可修改。
          </p>
          <p>
            3、测温计划名称用户可编辑。
          </p>
          <p>4、测温计划可增删，最多4个测温计划，至少保留1个。</p>
        </div>
      </div>
    </div>
    <div class="u-bd-1px mar-t10">
      <div class="detail-show">
        <div class="qui-fx-jsb top-title mar-b10 ">
          <div class="title">测温时间</div>
          <div class="mar-top">
            <a-button
              v-if="!isEdit"
              size="small"
              class="edit-action-btn"
              icon="form"
              @click="addPlan"
            >编辑</a-button
            >
            <a-button v-if="isEdit" type="primary" @click="handleSubmit">保存</a-button>
            <a-button
              v-if="isEdit"
              @click="cancel"
              style="margin: 0 10px; border-color: #f5f5f5"
            >取消</a-button
            >
          </div>
        </div>
      </div>
      <a-form v-if="isHide">
        <div class="set_plan">
          <a-form-item v-bind="formItemLayout" label="测温工作日">
            <a-checkbox-group v-model="teacherNoticer">
              <a-checkbox value="1">星期一</a-checkbox>
              <a-checkbox value="2">星期二</a-checkbox>
              <a-checkbox value="3">星期三</a-checkbox>
              <a-checkbox value="4">星期四</a-checkbox>
              <a-checkbox value="5">星期五</a-checkbox>
              <a-checkbox value="6">星期六</a-checkbox>
              <a-checkbox value="7">星期日</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item label="测温时段" v-bind="formItemLayout">
            <ul>
              <li class="qui-fx-f1" v-for="(time, index) in timeList" :key="index">
                <div class="qui-fx">
                  <a-input
                    v-model="time.planName"
                    placeholder="测温计划名称"
                    @change="change(time.planName)"
                  />
                  <a-time-picker disabled v-model="time.startTime" format="HH:mm" />
                  <span style="padding: 0 8px">至</span>
                  <a-time-picker
                    v-model="time.endTime"
                    format="HH:mm"
                    @change="changeTime([...arguments, index])"
                    :disabled="index === timeList.length - 1 && index === 3"
                  ></a-time-picker>
                  <a-button
                    @click="add(false)"
                    v-if="index === timeList.length - 1 && index > 0"
                  >删除</a-button
                  >
                </div>
              </li>
            </ul>
          </a-form-item>
        </div>
      </a-form>
      <div class="set_plan" v-if="isShow">
        <a-form-item v-bind="formItemLayout" label="测温工作日" style="margin-bottom: 0px;">
          <ul class="u-fx">
            <li v-for="item in weekList" :key="item.id" style="padding-left: 10px;">
              <span>{{ showDay(item) }}</span>
            </li>
          </ul>
        </a-form-item>
        <a-form-item label="测温时段" v-bind="formItemLayout">
          <ul>
            <li v-for="item in slotList" :key="item.id">
              <span>{{ item.planName }} {{ item.startTime }}-{{ item.endTime }}</span>
            </li>
          </ul>
        </a-form-item>
      </div>
    </div>
    <div class="u-bd-1px mar-t10">
      <div class="detail-show">
        <div class="qui-fx-jsb top-title mar-b10 ">
          <div class="title">测温设备</div>
          <div class="mar-top">
            <a-button size="small" icon="plus" class="add-btn" @click="bindControl">添加</a-button>
          </div>
        </div>
        <table-list :page-list="pageList" :columns="columns" :table-list="recordList">
          <template v-slot:actions="action">
            <a-tag @click="getRecordList(action.record)" color="#87d068">下发记录</a-tag>
            <a-popconfirm
              placement="left"
              okText="确定"
              cancelText="取消"
              @confirm="delControl(action.record)"
            >
              <template slot="title">您确定删除吗?</template>
              <a-tooltip placement="topLeft" title="删除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </table-list>
      </div>
    </div>
    <choose-control
      ref="chooseUser"
      is-check
      v-show="userTag"
      v-model="userTag"
      :chooseType="chooseType"
      :schoolCode="userInfo.schoolCode"
      @submit="chooseUser"
      title="添加设备"
      :recordList="recordList"
    ></choose-control>
    <down-record
      v-if="recordTag"
      :device-sn="bussCode"
      buss-code="yqfk"
      v-model="recordTag"
    ></down-record>
  </div>
</template>
<script>
import moment from 'moment'
import $tools from '@u/tools'
import { mapActions, mapState } from 'vuex'
import ChooseControl from '@c/ChooseControl'
import TableList from '@c/TableList'
import DownRecord from '@c/DownRecord'

const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '15%'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '15%',
    customRender: text => {
      return parseInt(text) === 1 ? '网络相机' : parseInt(text) === 2 ? '面板机' : '班牌'
    }
  },
  {
    title: '安装位置',
    dataIndex: 'snapSite',
    width: '15%'
  },
  {
    title: '设备SN码',
    dataIndex: 'deviceSn',
    width: '15%',
    align: 'center'
  },
  {
    title: '控制类型',
    dataIndex: 'inOrOut',
    width: '15%',
    customRender: text => {
      return parseInt(text) === 1 ? '进' : parseInt(text) === 2 ? '出' : '无'
    }
  },
  {
    title: '是否校门门禁',
    dataIndex: 'controlType',
    width: '15%',
    customRender: text => {
      return parseInt(text) === 1 ? '是' : '否'
    }
  },
  {
    title: '操作',
    key: 'action',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'TemPlan',
  components: { ChooseControl, TableList, DownRecord },
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 14 }
      },
      teacherNoticer: [],
      columns,
      name: '',
      timeList: [],
      inVal: '',
      weekList: [],
      slotList: [],
      isEdit: false, // 编辑状态
      isShow: true,
      isHide: false,
      recordList: [],
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      userTag: false,
      maxHeight: 0,
      recordTag: false,
      bussCode: '',
      chooseType: 'ncovGroup'
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.showData()
    this.showList()
  },
  mounted() {
    this.maxHeight = window.screen.height - 280 + 'px'
  },
  methods: {
    moment,
    ...mapActions('home', [
      'saveorUpdate',
      'getplanList',
      'gettimeList',
      'getmanageList',
      'delDevice',
      'updateDevice'
    ]),
    showDay(item) {
      const _item = parseInt(item)
      if (_item === 1) {
        return '星期一'
      } else if (_item === 2) {
        return '星期二'
      } else if (_item === 3) {
        return '星期二'
      } else if (_item === 4) {
        return '星期四'
      } else if (_item === 5) {
        return '星期五'
      } else if (_item === 6) {
        return '星期六'
      } else if (_item === 7) {
        return '星期日'
      }
    },
    async showList() {
      const req = {
        page: this.pageList.page,
        size: this.pageList.size,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getmanageList(req)
      this.recordList = res.data.list
      this.total = res.data.total
    },
    // 下发记录
    getRecordList(item) {
      this.recordTag = true
      this.bussCode = item.deviceSn
    },
    bindControl() {
      this.userTag = true
    },
    chooseUser(value) {
      this.userTag = false
      this.$refs.chooseUser.reset()
      const controlArr = []
      value.forEach(ele => {
        controlArr.push({
          deviceIp: ele.deviceIp,
          deviceName: ele.deviceName,
          deviceSn: ele.deviceSn,
          deviceType: ele.deviceType,
          inOrOut: ele.inOrOut,
          snapSite: ele.snapSite
        })
      })
      const req = {
        deviceInfoDtoList: controlArr,
        schoolCode: this.userInfo.schoolCode
      }
      this.updateDevice(req).then(() => {
        this.$message.success('添加成功')
        this.$tools.goNext(() => {
          this.showList()
          this.$refs.chooseUser.reset()
        })
      })
    },
    async delControl(record) {
      await this.delDevice({ id: record.id })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    addPlan() {
      this.isEdit = true
      this.isHide = true
      this.isShow = false
    },
    cancel() {
      this.isEdit = false
      this.isHide = false
      this.isShow = true
    },
    changeTime([a, b, index]) {
      if (index === 3) {
        this.timeList[index].endTime = '23:59'
        return
      }
      if (b !== '23:59') {
        if (index === this.timeList.length - 1) {
          this.add(true, this.timeList[index].endTime, '23:59')
        } else {
          this.modifyTime(b, index)
        }
      }
    },
    modifyTime(b, index) {
      const time = b
      const tempTime = '2020-01-01 ' + time + ':00'
      const date = this.$tools.getDateTime(tempTime)
      const newDate = new Date(date.getTime() + 60000)
      const startDate = this.$tools.getDate(newDate, 2)
      this.timeList[index + 1].startTime = moment(startDate, 'HH:mm')
    },
    add(tag, sTime, eTime) {
      const time = moment(sTime).format('HH:mm')
      const tempTime = '2020-01-01 ' + time + ':00'
      const date = this.$tools.getDateTime(tempTime)
      const newDate = new Date(date.getTime() + 60000)
      const startDate = this.$tools.getDate(newDate, 2)
      if (tag) {
        this.timeList.push({
          startTime: startDate,
          endTime: eTime
        })
      } else {
        this.timeList.splice(this.timeList.length - 1)
        this.timeList[this.timeList.length - 1].endTime = '23:59'
      }
      this.editTag()
    },
    editTag() {
      this.timeList = this.timeList.map(item => {
        return {
          ...item,
          startTime: moment(item.startTime, 'HH:mm'),
          endTime: moment(item.endTime, 'HH:mm')
        }
      })
    },
    async showData() {
      const res = await this.getplanList({ schoolCode: this.userInfo.schoolCode })
      if (!res.data) {
        this.timeList = [
          {
            startTime: moment('0:00', 'HH:mm'),
            endTime: moment('12:00', 'HH:mm'),
            planName: '晨检'
          },
          {
            startTime: moment('12:01', 'HH:mm'),
            endTime: moment('23:59', 'HH:mm'),
            planName: '午检'
          }
        ]
        this.teacherNoticer = [1, 2, 3, 4, 5].toString()
        this.handleSubmit()
      } else {
        console.log(res.data.weekday)
        this.weekList = res.data.weekday.split(',')
        this.teacherNoticer = res.data.weekday.split(',')
        this.slotList = []
        res.data.timeSlot.forEach((item, index) => {
          this.slotList.push({
            startTime: this.$tools.getDate(item.startTime, 2),
            endTime: this.$tools.getDate(item.endTime, 2),
            planName: item.planName
          })
        })
        res.data.timeSlot.forEach((item, index) => {
          this.timeList.push({
            startTime: moment(
              item.startTime ? this.$tools.getDate(item.startTime) : '',
              'HH:mm' / 1000
            ),
            endTime: moment(item.endTime ? this.$tools.getDate(item.endTime) : '', 'HH:mm' / 1000),
            planName: item.planName
          })
        })
      }
    },
    change(name) {
      this.inVal = name
      if (this.inVal == '') {
        this.$message.warning('请输入测温计划名称!')
      }
    },
    handleSubmit() {
      const timeSlot = []
      this.timeList.forEach(item => {
        timeSlot.push({
          startTime: moment(item.startTime).format('HH:mm'),
          endTime: moment(item.endTime).format('HH:mm'),
          planName: item.planName
        })
      })
      for (let i = 0; i < timeSlot.length; i++) {
        if (timeSlot[i].planName == undefined) {
          this.$message.warning('请输入测温计划名称!')
          return
        }
      }
      const req = {
        schoolCode: this.userInfo.schoolCode,
        schoolName: this.userInfo.schoolName,
        weekday: this.teacherNoticer.toString(),
        timeSlot
      }
      this.saveorUpdate(req).then(res => {
        const timeSlot = []
        this.timeList = []
        this.showData()
        this.$message.success('保存成功!')
        this.isEdit = false
        this.isHide = false
        this.isShow = true
      })
    }
  }
}
</script>
<style lang="less" scoped>
.set-up {
  background: #fff;
  padding: 10px 40px;
  overflow: auto;
}
.ant-input-number {
  width: 100%;
}
.time-right {
  height: 274px;
  background: url(../../assets/img/plan_bg.png) no-repeat;
  background-size: 100% 100%;
  .tips_con {
    padding: 30px;
    margin-top: 50px;
  }
  .tips-title {
    color: #f08080;
    font-size: 18px;
    margin-bottom: 10px;
  }
}
.set_plan {
  margin-top: 20px;
  ul li input {
    width: 200px;
    margin-right: 30px;
  }
}
.detail-show {
  .top-title {
    background-color: #ececec;
  }
  .title {
    font-size: 18px;
    padding: 10px;
  }
  .mar-top {
    padding-top: 10px;
  }
}
</style>
