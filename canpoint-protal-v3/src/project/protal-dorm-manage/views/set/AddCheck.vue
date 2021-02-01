<template>
  <div class="add-check page-layout u-fx-ver u-type-white-bg u-padd-t">
    <a-form :form="form" :style="{ maxHeight: maxHeight }">
      <a-form-item label="查寝组名称" v-bind="formItemLayout">
        <a-input
          placeholder="请输入查寝组名称"
          v-decorator="['groupName', { initialValue: groupName, rules: [{ required: true, message: '请输入查寝组名称' }] }]"
        />
      </a-form-item>
      <a-form-item label="查寝时间" v-bind="formItemLayout" :required="true">
        <a-table
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :columns="columns.columns"
          :dataSource="data"
          :bordered="true"
          :pagination="false"
          class="table"
        >
          <template slot="action" slot-scope="text, record">
            <div class="u-fx">
              <div>{{ record.accessTimeList.orderCode ? '' : '休息' }}</div>
              <div class="u-mar-r10" v-for="(ele, i) in record.accessTimeList.canpointDormPlanDtoList" :key="i">
                <span v-if="ele.enable" >
                  <span>{{ ele.realSegment }}</span>
                  <span>{{ moment(ele.startTime).format('HH:mm') }}</span>
                  <span> ~ </span>
                  <span>{{ moment(ele.endTime).format('HH:mm') }}</span>
                  <span>{{ ele.checkType === '1' ? '进' : '出' }}宿舍;</span>
                </span>
              </div>
            </div>
          </template>
          <template slot="other1" slot-scope="text, record">
            <u-button type="link" @click="add(0, record)">更改班次</u-button>
          </template>
        </a-table>
      </a-form-item>
      <a-form-item label="特殊日期" v-bind="formItemLayout">
        <a-checkbox-group v-decorator="['hasHoliday', { initialValue: hasHoliday, }]" >
          <a-checkbox value="1"> 法定节假日不查寝 </a-checkbox>
        </a-checkbox-group>
        <div>
          <div>
            必须查寝的日期：
            <u-button size="small" icon="plus" type="light" @click="add(1)">添加</u-button>
          </div>
          <a-table
            :columns="columns.specialColumns"
            :dataSource="clockList"
            :bordered="true"
            :pagination="false"
            class="table"
          >
            <template slot="action" slot-scope="text, record">
              <div class="u-fx">
                <div class="u-mar-r20" v-for="(ele, i) in record.canpointDormPlanDtoList" :key="i">
                  <span v-if="ele.enable" >
                    <span>{{ ele.realSegment }}</span>
                    <span>{{ moment(ele.startTime).format('HH:mm') }}</span>
                    <span> ~ </span>
                    <span>{{ moment(ele.endTime).format('HH:mm') }}</span>
                    <span>{{ ele.checkType === '1' ? '进' : '出' }}宿舍;</span>
                  </span>
                </div>
              </div>
            </template>
            <template slot="other1" slot-scope="text, record">
              <u-button type="link" @click="add(2,record)">编辑</u-button>
              <u-button type="link" style="color:#fc6260;" @click="del('clockList',record)">删除</u-button>
            </template>
          </a-table>
        </div>
        <div>
          <div> 不用查寝的日期：
            <u-button size="small" icon="plus" type="light" @click="clockTag = true">添加</u-button>
          </div>
          <a-table
            :columns="columns.specialColumns"
            :dataSource="unClockList"
            :bordered="true"
            :pagination="false"
            class="table"
          >
            <template slot="action">休息</template>
            <template slot="other1" slot-scope="text, record">
              <u-button type="link" style="color:#fc6260;" @click="del('unClockList',record)">删除</u-button>
            </template>
          </a-table>
        </div>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 10, offset: 10 }">
        <a-button style="margin-right:50px;" @click="cancle">取消</a-button>
        <a-button type="primary" :loading="loading" @click="handleSubmit">保存</a-button>
      </a-form-item>
    </a-form>
    <change-class v-model="visible" :show="show" ref="changeClass" @submit="update"></change-class>
    <no-clock ref="noClock" @submit="noSubmit" v-model="clockTag"> </no-clock>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import columns from '../../table-columns/check'
import ChangeClass from '../../component/ChangeClass'
import NoClock from '../../component/NoClock'

export default {
  name: 'SetGroup',
  components: {
    ChangeClass,
    NoClock
  },
  data() {
    return {
      moment,
      columns,
      formItemLayout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 19 }
      },
      loading: false,
      recordTag: false,
      bussCode: '',
      userTag: false,
      maxHeight: 0,
      dateData: [],
      data: [
        {
          key: 2,
          weekDay: '周一',
          accessTimeList: {},
          id: 0
        },
        {
          key: 3,
          weekDay: '周二',
          accessTimeList: {},
          id: 1
        },
        {
          key: 4,
          weekDay: '周三',
          accessTimeList: {},
          id: 2
        },
        {
          key: 5,
          weekDay: '周四',
          accessTimeList: {},
          id: 3
        },
        {
          key: 6,
          weekDay: '周五',
          accessTimeList: {},
          id: 4
        },
        {
          key: 7,
          weekDay: '周六',
          accessTimeList: {},
          id: 5
        },
        {
          key: 1,
          weekDay: '周日',
          accessTimeList: {},
          id: 6
        }
      ],
      formLayout: 'horizontal',
      selectedRowKeys: [],
      pageList: {
        page: 1,
        size: 9999
      },
      form: this.$form.createForm(this),
      groupId: '',
      chooseType: 'groupset',
      detailData: null,
      groupName: '',
      type: '',
      visible: false,
      clockTag: false,
      clockList: [],
      unClockList: [],
      classId: '',
      state: '',
      show: false,
      hasHoliday: ['1'],
      check: false,
      chooseRecord: {},
      count: 0
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  created() {
    this.maxHeight = window.screen.height - 280 + 'px'
    this.groupId = this.$route.query.id ? this.$route.query.id.toString() : ''
    if (this.groupId) {
      this.check = true
      this.attendanceGroupDetail_()
    }
  },
  methods: {
    ...mapActions('home', ['updateCheckGroup', 'checkGroupDetail', 'addCheckGroup']),
    // 获取详情
    async attendanceGroupDetail_() {
      const res = await this.checkGroupDetail({ groupId: this.groupId })
      this.showData(res.data)
    },
    add(type, record) {
      this.state = type
      if (type) {
        this.$refs.changeClass.defaultValue = type === 2 ? moment(record.current).format('YYYY-MM-DD HH:mm:ss') : ''
        this.$refs.changeClass.current = type === 2 ? record.current : ''
        this.$refs.changeClass.chooseList = type === 2 ? [record.classId ? record.classId : record.id] : []
        this.$refs.changeClass.totalList = type === 2 ? { ...record, id: record.classId ? record.classId : record.id } : {}
        this.chooseRecord = type === 2 ? record : {}
        this.show = false
        this.$refs.changeClass.title = '必须打卡的日期'
      } else {
        console.log('record', record)
        this.show = true
        this.$refs.changeClass.chooseList =
          JSON.stringify(this.data[record.id].accessTimeList) === '{}' ? []
            : [this.data[record.id].accessTimeList.classId ? this.data[record.id].accessTimeList.classId : this.data[record.id].accessTimeList.id]
        this.classId = record.id
        this.$refs.changeClass.title = '更改班次'
        this.$refs.changeClass.totalList = record.accessTimeList
        console.log(this.data)
      }
      this.visible = true
    },
    // 更换班次
    update(record) {
      if (this.state === 1) {
        const { count, clockList } = this
        const newData = {
          key: count,
          ...record,
          canpointDormPlanDtoList: record.outCanpointDormPlanDtoList
        }
        this.clockList = [...clockList, newData]
        this.count = count + 1
      } else if (this.state === 2) {
        for (var i = 0; i < this.clockList.length; i++) {
          if (this.clockList[i].key === this.chooseRecord.key) {
            this.clockList[i].classId = record.id
            this.clockList[i].current = record.current
            this.clockList[i].code = record.orderCode
            this.clockList[i].name = record.orderName
            this.clockList[i].id = record.orderId
            this.clockList[i].canpointDormPlanDtoList = record.outCanpointDormPlanDtoList
            this.clockList[i].key = this.chooseRecord.key
          }
        }
      } else {
        this.data[this.classId].accessTimeList = {
          ...record,
          canpointDormPlanDtoList: record.outCanpointDormPlanDtoList
        }
      }
      this.$refs.changeClass.reset()
    },
    // 不用打卡日期
    noSubmit(record) {
      this.unClockList.push(record)
      this.clockTag = false
    },
    // 表单回填
    async showData(value) {
      if (!value) return
      this.detailData = value
      this.hasHoliday = value.hasHoliday ? ['1'] : []
      this.groupName = value.name
      value.checkTimeDtoList.forEach((item, index) => {
        this.selectedRowKeys.push(parseInt(item.weekNum))
        if (parseInt(item.weekNum) === 1) {
          this.data[6].accessTimeList = item
        } else {
          this.data[parseInt(item.weekNum) - 2].accessTimeList = item
        }
      })
      this.clockList = value.singnInDtoList.map((ele, index) => {
        return {
          id: ele.id,
          classId: ele.id,
          code: ele.orderCode,
          current: this.$tools.getDate(ele.startDate, 1),
          key: index,
          canpointDormPlanDtoList: ele.canpointDormPlanDtoList
        }
      })
      this.count = this.clockList.length
      this.unClockList = value.noSingnInDtoList.map(ele => {
        return {
          ...ele,
          current: ele.startDate === ele.endDate ? this.$tools.getDate(ele.startDate, 1) : `${this.$tools.getDate(ele.startDate, 1)}~${this.$tools.getDate(ele.endDate, 1)}`
        }
      })
    },
    // 考勤日期选择
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    cancle() {
      const path = '/check'
      this.$router.push({ path })
    },
    // 特殊日期的删除
    del(type, record) {
      this[type] = this[type].filter(list => list !== record)
    },
    // 提交权限组
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
           this.submit(values)
        }
      })
    },
    async submit(values) {
      try {
        if (this.selectedRowKeys.length === 0) {
            this.$message.warning('请勾选查寝时间')
            return
          }
          const rules = []
          const weeks = []
          this.selectedRowKeys.forEach(item => {
            var id = 1
            id = item === 1 ? id = 6 : id = item - 2
            weeks.push(this.data[id])
          })
          weeks.forEach(ele => {
            rules.push({
              orderCode: ele.accessTimeList.orderCode,
              weekNum: ele.key
            })
          })
          let result = true
          rules.forEach(eve => {
            if (!eve.orderCode) result = false
          })
          if (!result) {
            this.$message.warning('请选择班次')
            return
          }
          const specialClockDayRules = this.clockList.map(ele => {
            return {
              orderCode: ele.orderCode,
              startDate: ele.current,
              endDate: ele.current,
              schoolCode: this.schoolCode
            }
          })
          const noClockDayRules = this.unClockList.map(ele => {
            return {
              orderCode: '',
              startDate: ele.current.indexOf('~') > -1 ? ele.current.split('~')[0] : ele.current,
              endDate: ele.current.indexOf('~') > -1 ? ele.current.split('~')[1] : ele.current,
              schoolCode: this.schoolCode
            }
          })
          const specialDateDtoList = specialClockDayRules.concat(noClockDayRules)
          const req = {
            checkTimeDtoList: rules,
            groupName: values.groupName,
            hasHoliday: values.hasHoliday.length > 0,
            schoolCode: this.schoolCode,
            specialDateDtoList: specialDateDtoList
          }
          this.loading = true
          req.groupId = this.groupId ? this.groupId : ''
          this.groupId ? await this.updateCheckGroup(req) : await this.addCheckGroup(req)
          this.$message.success(`${this.groupId ? '编辑' : '添加'}成功`)
          this.$tools.goNext(() => {
            this.loading = true
            const path = '/check'
            this.$router.push({ path })
          })
        } catch (err) {
          this.loading = false
        }
    }
  }
}
</script>

<style lang="less" scoped>
.add-check {
  overflow: auto;
  .table {
    max-height: 400px;
    overflow: auto;
  }
  .action {
    margin: 5px 0;
    span {
      margin: 0 5px;
    }
    .right {
      img {
        width: 24px;
        height: 24px;
        margin: 0 10px;
        cursor: pointer;
      }
    }
  }
}
</style>
