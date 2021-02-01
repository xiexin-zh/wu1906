<template>
  <div class="class page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-search-form :search-label="searchLabel" @search="search" ref="searchForm">
        <div slot="left">
          <u-space>
            <u-button icon="plus" @click="add(0)" type="primary">添加班次</u-button>
          </u-space>
        </div>
      </u-search-form>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table :page-list="pageList" :columns="columns.class" :table-list="classList">
        <template v-slot:slotOne="slotOne">
          <div class="u-fx-ver">
            <div class="u-fx" v-for="(ele, i) in slotOne.record.outCanpointDormPlanDtoList" :key="i">
              <div v-if="ele.enable">
                <span>{{ ele.realSegment }}</span>
                <span>{{ moment(ele.startTime).format('HH:mm') }}</span>
                <span> ~ </span>
                <span>{{ moment(ele.endTime).format('HH:mm') }}</span>
                <span>{{ ele.checkType === '1' ? '进' : '出' }}宿舍</span>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:actions="actions">
          <u-button type="link" @click="add(1, actions.record)">编辑</u-button>
          <u-button type="link" delete @click="del(actions.record.orderId)">删除</u-button>
        </template>
      </u-table>
    </div>
    <u-pagination v-model="pageList" :total="total" @change="_getCheckClass"></u-pagination>
    <u-submit-form
      ref="form"
      :width="1000"
      @submit="submitForm"
      :title="`${title}班次`"
      v-model="formStatus"
      :form-data="formData"
    >
      <div slot="topTips" class="u-mar-b10">
        <u-alert type="warning" message="查寝时间范围不可交叉！且起止时间不能相等哦"></u-alert>
      </div>
      <div slot="slotOne">
        <div class="u-tips-color">类型：一天可设置早午晚4次查寝计划，查寝时段不可交叉，查寝时段依次递增。</div>
        <a-table
          :columns="columns.time"
          :dataSource="tableList"
          :pagination="false"
          :bordered="true"
          class="table"
        >
          <template slot="slotOne" slot-scope="text, record">
            <template>
              <a-time-picker
                v-model="record.startTime"
                :allowClear="false"
                format="HH:mm"
                :defaultValue="moment(record.startTime || '00:00', 'HH:mm')"
              />
              —
              <a-time-picker
                v-model="record.endTime"
                :allowClear="false"
                format="HH:mm"
                :defaultValue="moment(record.endTime || '00:00', 'HH:mm')"
              />
            </template>
          </template>
          <template slot="slotTwo" slot-scope="text, record,index">
            <template>
              <a-switch
                v-model="record.enable"
                checked-children="是"
                un-checked-children="否"
                @change="onChange($event,record)"
                :disabled="index === 3"/>
            </template>
          </template>
        </a-table>
      </div>
    </u-submit-form>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import columns from '../../table-columns/class'
import searchLabel from '../../search-columns/class'
import formData from '../../submit-columns/class'
const data = [
  {
    id: 1,
    planName: '早查寝',
    realSegment: '早上',
    checkType: '2',
    enable: false,
    planCode: 'MO',
    realSegmentCode: '1',
    startTime: '',
    endTime: ''
  },
  {
    id: 2,
    planName: '午查寝',
    realSegment: '中午',
    checkType: '1',
    enable: false,
    planCode: 'NI',
    realSegmentCode: '2',
    startTime: '',
    endTime: ''
  },
  {
    id: 3,
    planName: '',
    realSegment: '中午',
    checkType: '2',
    enable: false,
    planCode: 'NO',
    realSegmentCode: '2',
    startTime: '',
    endTime: ''
  },
  {
    id: 4,
    planName: '晚查寝',
    realSegment: '晚上',
    checkType: '1',
    enable: true,
    planCode: 'EI',
    realSegmentCode: '3',
    startTime: '',
    endTime: ''
  }
]
export default {
  name: 'Class',
  data() {
    return {
      moment,
      tableList: data,
      formData,
      visible: false,
      formStatus: false,
      title: '添加',
      searchLabel,
      columns,
      classList: [],
      pageList: { page: 1, size: 20 },
      total: 0,
      searchList: {}
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this._getCheckClass()
  },
  methods: {
     ...mapActions('home', [
      'getCheckClass', 'addCheckClass', 'updateCheckClass', 'delCheckClass'
    ]),
    async _getCheckClass() {
      this.searchList.schoolCode = this.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getCheckClass(this.searchList)
      this.classList = res.data.records
      this.total = res.data.total
    },
    add(type, record) {
      this.title = type ? '编辑' : '添加'
      this.formStatus = true
      this.formData = type ? this.$tools.fillForm(formData, record) : formData
      if (type) {
        this.orderId = record.orderId
        this.tableList = record.outCanpointDormPlanDtoList.map((el, index) => {
          return {
            ...el,
            id: index + 1,
            startTime: this.$tools.getDate(el.startTime),
            endTime: this.$tools.getDate(el.endTime)
          }
        })
      } else {
        this.tableList = data
      }
    },
    search(value) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList = Object.assign(this.searchList, value)
      this._getCheckClass()
    },
    // 查寝计划的启用状态的改变
    onChange(e, record) {
      console.log(0, record)
      if (record.id === 2) {
        this.tableList[2].enable = this.tableList[1].enable
      } else if (record.id === 3) {
        this.tableList[1].enable = this.tableList[2].enable
      }
    },
      // 机构提交
    async submitForm(values) {
      let result = true
      this.tableList.forEach(el => {
        if (el.startTime >= el.endTime && el.enable) result = false
      })
      if (!result) {
        this.$message.warning('请填写正确的时间')
        this.$refs.form.error()
        return
      }
      const canpointDormPlanDtoList = this.tableList.map(el => {
        return {
          enable: el.enable,
          planCode: el.planCode,
          planId: el.planId,
          checkType: el.checkType,
          realSegmentCode: el.realSegmentCode,
          startTime: el.startTime ? moment(el.startTime).format('HH:mm:ss') : '00:00:00',
          endTime: el.endTime ? moment(el.endTime).format('HH:mm:ss') : '00:00:00'
        }
      })
      values.canpointDormPlanDtoList = canpointDormPlanDtoList
      values.schoolCode = this.schoolCode
      values.orderId = this.title === '编辑' ? this.orderId : undefined
      console.log('values', values)
      try {
        this.title === '添加' ? await this.addCheckClass(values) : await this.updateCheckClass(values)
        this.formStatus = false
        this.$refs.form.reset()
        this.$message.success(`${this.title}成功`)
        this.$tools.goNext(() => {
          this._getCheckClass()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    async del(id) {
      await this.delCheckClass({ orderId: id })
      this.$tools.message('succses', '删除成功')
      this.pageList.page = 1
      this.pageList.size = 20
      this.$tools.goNext(this._getCheckClass)
    }
  }
}
</script>
<style lang="less" scoped>
.set-group {
  .table {
    max-height: 300px;
    overflow: auto;
  }
}
</style>
