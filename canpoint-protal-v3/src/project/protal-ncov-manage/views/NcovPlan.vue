<template>
  <div class="ncov-plan page-layout u-fx layout-padd u-type-white-bg">
    <u-choose-device
      filter-choose
      is-check
      ref="chooseDeviceRef"
      v-if="showTag"
      v-model="showTag"
      schoolCode="CANPOINTLIVE"
      :bindList="bindList"
      @submit="submitDevice"
    ></u-choose-device>
    <div class="u-fx-f1 content">
      <a-collapse v-model="activeKey" expand-icon-position="left">
        <a-collapse-panel key="1" header="测温时间">
          <div class="u-fx-ac">
            <div class="title">测温时间：</div>
            <a-checkbox-group v-model="checkedList" :options="options" :disabled="disabled"/>
          </div>
          <div class="u-fx u-mar-t">
            <div class="title">测温时段：</div>
            <div>
              <div class="u-fx u-mar-b10" v-for="(list,i) in timeList" :key="list.key">
                <u-space>
                  <a-input v-model="list.planName" placeholder="请输入" :disabled="disabled"/>
                  <a-time-picker format="HH:mm" v-model="list.startTime" disabled/>
                  <a-time-picker
                    format="HH:mm"
                    v-model="list.endTime"
                    :disabled="disabled"
                    :allowClear="false"
                    :disabledHours="(val)=>getDisabledHours(i)"
                    :disabledMinutes="(val)=>getDisabledMinutes(val, i)"
                    @change="changeTime($event ,i)"/>
                  <u-button v-if="list.key === 0 && !disabled" size="small" type="primary" icon="plus" @click="add">添加</u-button>
                  <u-button v-if="list.key !== 0 && !disabled" size="small" type="danger" @click="del(list)">删除</u-button>
                </u-space>
              </div>
            </div>
          </div>
          <div slot="extra">
            <u-space>
              <u-button v-if="disabled" size="small" type="light" @click="modify(0)" >编辑</u-button>
              <u-button v-if="!disabled" size="small" type="default" @click="modify(1)">取消</u-button>
              <u-button v-if="!disabled" size="small" type="primary" @click="modify(2)">保存</u-button>
            </u-space>
          </div>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="测温设备">
          <div class="u-fx-f1 u-mar-t10">
            <a-table
              :columns="columns"
              :data-source="equipList"
              :pagination="false"
              :rowKey="record => record.id"
            >
              <template slot="actions" slot-scope="text, record">
                <u-button type="link" delete @click="unBind(record)">删除</u-button>
              </template>
            </a-table>
          </div>
          <div slot="extra">
            <u-space>
              <div class="tip u-content-color">
                添加测温设备前，请确认您已完成全校需测温人员的人像录入，如未完成可能导致人像下发遗漏、测温数据的丢失！
              </div>
              <u-button size="small" type="primary" @click="addEquip">添加</u-button>
            </u-space>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <div class="right u-type-white-bg u-mar-l u-padd">
      <div>
        <a-icon class="u-type-primary u-font-3" type="exclamation-circle" />
        <span class="u-font-3 u-mar-l10">请注意</span>
        <p class="u-mar-t">1.测温计划全校通用。没有勾选的工作日，测温数据不统计（疫情日报）。</p>
        <p>2.测温计划时间必须首尾衔接，第一个计划从00:00开始，最后一个计划23:59结束。下一个计划的开始时间，默认是上一个计划的结束时间。</p>
        <p>3.测温计划最多4个，至少保留1个。</p>
      </div>
      <div class="bottom"></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import columns from '../table-columns/plan'
import { mapState, mapActions } from 'vuex'
const options = [
  {
    value: '2',
    label: '周一'
  },
  {
    value: '3',
    label: '周二'
  },
  {
    value: '4',
    label: '周三'
  },
  {
    value: '5',
    label: '周四'
  },
  {
    value: '6',
    label: '周五'
  },
  {
    value: '7',
    label: '周六'
  },
   {
    value: '1',
    label: '周日'
  }
]
export default {
  name: 'NcovPlan',
  components: {},
  data() {
    return {
      columns,
      moment,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      options,
      activeKey: ['0', '1', '2'],
      checkedList: [],
      showTag: false,
      equipList: [],
      timeList: [],
      count: 2,
      disabled: true,
      bindList: []
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'loginInfo'])
  },
  mounted() {
    this._getTmpPlan()
    this._getTmpEquip()
  },
  methods: {
    ...mapActions('home', [
      'getTmpPlan', 'updateTmpPlan', 'getTmpEquip', 'bindTmpEquip', 'unBindTmpEquip'
    ]),
    // 获取测温时间
    async _getTmpPlan() {
      const res = await this.getTmpPlan({ schoolCode: this.schoolCode })
      if (!res.data) {
        this.timeList = [
          {
            key: 0,
            startTime: moment('0:00', 'HH:mm'),
            endTime: moment('12:00', 'HH:mm'),
            planName: '晨检'
          },
          {
            key: 1,
            startTime: moment('12:01', 'HH:mm'),
            endTime: moment('23:59', 'HH:mm'),
            planName: '午检'
          }
        ]
        this.checkedList = ['2', '3', '4', '5', '6']
      } else {
        this.checkedList = res.data.weekday.split(',')
        this.timeList = res.data.timeSlot.map((el, index) => {
          return {
            ...el,
            startTime: moment(this.$tools.getDate(el.startTime, 2), 'HH:mm'),
            endTime: moment(this.$tools.getDate(el.endTime, 2), 'HH:mm'),
            key: index
          }
        })
        this.count = res.data.timeSlot.length
      }
    },
    // 测温时段添加
    add() {
      if (this.timeList.length === 4) return
      const { count, timeList } = this
      const newData = {
        key: count,
        planName: '',
        startTime: this.timeList[this.timeList.length - 1].endTime,
        endTime: moment('23:59', 'HH:mm')
      }
      this.timeList = [...timeList, newData]
      this.count = count + 1
    },
    // 测温时段删除
    del(list) {
      this.timeList = this.timeList.filter(i => i !== list)
      if (this.timeList.length === 1) {
        this.timeList[0].endTime = moment('23:59', 'HH:mm')
      }
    },
    // 测温时间的编辑保存
    async modify(type, record) {
      if (type) {
        if (type === 1) {
          this.disabled = !this.disabled
          this._getTmpPlan()
        } else if (type === 2) {
          try {
            for (let i = 0; i < this.timeList.length; i++) {
              if (!this.timeList[i].planName) {
                this.$message.warning('请输入测温计划名称!')
                return
              }
            }
            const req = {
              schoolCode: this.schoolCode,
              schoolName: this.loginInfo.schoolName,
              weekday: this.checkedList.join(','),
              timeSlot: this.timeList.map(el => {
                return {
                  startTime: moment(el.startTime).format('HH:mm'),
                  endTime: moment(el.endTime).format('HH:mm'),
                  planName: el.planName
                }
              })
            }
            await this.updateTmpPlan(req)
            this.$tools.message('succses', '操作成功')
            this.$tools.goNext(this._getTmpPlan)
            this.disabled = !this.disabled
          } catch (err) {
          }
        }
      } else {
        this.disabled = !this.disabled
      }
    },
    // 结束时间的改变
    changeTime(e, index) {
     if (this.timeList.length - 1 > index) {
      const date = new Date(e)
      const newDate = new Date(date.getTime() + 60000)
      const startDate = this.$tools.getDate(newDate, 2)
      this.timeList[index + 1].startTime = moment(startDate, 'HH:mm')
     }
      this.timeList[this.timeList.length - 1].endTime = moment('23:59', 'HH:mm')
    },
    // 不可选小时
    getDisabledHours(index) {
      if (index === 0) return
      const hours = []
      const timeArr = moment(this.timeList[index - 1].endTime).format('HH:mm').split(':')
      for (var i = 0; i < parseInt(timeArr[0]); i++) {
        hours.push(i)
      }
      return hours
    },
    // 不可选分钟
    getDisabledMinutes(val, index) {
      if (index === 0) return
      const timeArr = moment(this.timeList[index - 1].endTime).format('HH:mm').split(':')
      const minutes = []
      if (val === parseInt(timeArr[0])) {
        for (var i = 0; i <= parseInt(timeArr[1]); i++) {
          minutes.push(i)
        }
      }
      return minutes
    },
    // 获取通知列表
    async _getTmpEquip() {
      const req = {
        page: 1,
        size: 999,
        schoolCode: this.schoolCode
      }
      const res = await this.getTmpEquip(req)
      this.equipList = res.data.list
    },
    // 设备弹框
    addEquip() {
      this.bindList = this.equipList.map(item => {
        return {
          deviceSn: item.deviceSn,
          deviceName: item.deviceName
        }
      })
      this.showTag = true
    },
    // 绑定设备
    async submitDevice(values) {
      try {
        const req = {
          schoolCode: this.schoolCode,
          deviceInfoDtoList: values.map(item => {
            return {
              deviceIp: item.deviceIp,
              deviceName: item.deviceName,
              deviceSn: item.deviceSn,
              deviceType: item.deviceType,
              snapSite: item.snapSite,
              inOrOut: item.inOrOut
            }
          })
        }
        await this.bindTmpEquip(req)
        this.$tools.message('success', '绑定成功')
        this.$refs.chooseDeviceRef.reset()
        this.$tools.goNext(this._getTmpEquip)
      } catch (err) {
        this.$refs.chooseDeviceRef.error()
      }
    },
    // 解绑设备
    async unBind(record) {
      await this.unBindTmpEquip({ id: record.id })
      this.$message.success('删除成功')
      this.$tools.goNext(this._getTmpEquip)
    }
  }
}
</script>
<style lang="less" scoped>
.ncov-plan {
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
    .title {
      width: 90px;
    }
    .tip {
      font-size: 12px;
    }
  }
  .right {
    width: 312px;
    color: #333;
    position: relative;
    .bottom {
      position: absolute;
      bottom: 50px;
      left: 20px;
      width: 90%;
      height: 200px;
      background: url(../assets/img/set.png);
      background-size: 100% 100%;
    }
  }
}
.ant-collapse {
  background-color: #fbfbfd;
}
.ant-form-item {
  margin-bottom: 0px;
}
</style>
