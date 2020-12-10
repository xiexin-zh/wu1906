<template>
  <a-modal
    width="1200px"
    title="选择巡查任务"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <div class="qui-fx-ver">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="日常巡查"></a-tab-pane>
        <a-tab-pane key="2" tab="设备巡检"></a-tab-pane>
        <a-tab-pane key="3" tab="安全护导"></a-tab-pane>
      </a-tabs>
      <table-list
        is-check
        :scroll-h="370"
        v-model="chooseList"
        :columns="columns"
        @clickRow="clickRow"
        @selectAll="selectAll"
        :table-list="userList"
      >
        <template v-slot:other1="other1">
          <div v-if="other1.record.taskTimeType ==='1' ">{{ other1.record.dates.map(el => el.substr(0, 10)).join(',') }}</div>
          <div v-if="other1.record.timeType ==='1' && other1.record.taskTimeType ==='2' ">{{ other1.record.dates | getWeeks }}</div>
          <div v-if="other1.record.timeType ==='1' && other1.record.taskTimeType ==='3' ">{{ other1.record.dates.map(el => el > 9 ? `${el}日` : `0${el}日`).join(',') }}</div>
          <div v-if="other1.record.timeType ==='2' && other1.record.taskTimeType ==='2' ">{{ other1.record.dates.map(el => `${other1.record.year}-第${el}周` ).join(',') }}</div>
          <div v-if="other1.record.timeType ==='2' && other1.record.taskTimeType ==='3' ">{{ other1.record.dates.map(el => el > 9 ? `${other1.record.year}-${el}月` : `${other1.record.year}-0${el}月`).join(',') }}</div>
          <div v-if="other1.record.taskTimeType ==='4' ">{{ other1.record.dates.map(el => `${other1.record.year}-第${el}季度`).join(',') }}</div>
        </template>
      </table-list>
    </div>
  </a-modal>
</template>

<script>
import TableList from '@c/TableList'
import { mapState, mapActions } from 'vuex'
const columns = [
  {
    title: '序号',
    width: '12%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '任务名称',
    dataIndex: 'name',
    width: '20%'
  },
  {
    title: '任务类型',
    dataIndex: 'taskTimeType',
    width: '20%',
    customRender: text => {
      if (text === '1') {
        return '自定义任务'
      } else if (text === '2') {
        return '周任务'
      } else if (text === '3') {
        return '月任务'
      } else if (text === '4') {
        return '季度任务'
      }
    }
  },
  {
    title: '任务时间',
    width: '20%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '检查地点',
    dataIndex: 'address',
    width: '20%'
  }
]
export default {
  name: 'ChooseTask',
  components: {
    TableList
  },
  props: {
    params: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      columns,
      confirmLoading: false,
      chooseList: [],
      userList: [],
      totalList: [],
      status: false,
      searchList: {
        page: 1,
        size: 99999
      },
      tabActive: '1'
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  methods: {
    ...mapActions('home', ['getTaskList', 'holidayBindTask', 'weekBindTask', 'getBindTask', 'getWeekBind']),
    callback(key) {
      this.tabActive = key
      this.showList()
    },
    async showList() {
      this.searchList.schoolCode = this.schoolCode
      this.searchList.taskType = this.tabActive
      const req = {
        holidayId: this.params.holidayId ? this.params.holidayId : undefined,
        weekNum: this.params.weekNum ? this.params.weekNum : undefined,
        schoolCode: this.schoolCode,
        taskType: this.tabActive
      }
      if (this.params.holidayId) {
        const result = await this.getBindTask(req)
        this.chooseList = result.data
      } else {
        const result = await this.getWeekBind(req)
        this.chooseList = result.data
      }
      const res = await this.getTaskList(this.searchList)
      this.userList = res.data.records.map(el => {
        return {
          ...el,
          id: el.code
        }
      })
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.totalList.findIndex(list => {
            return list.id === item.id
          })
          this.totalList.splice(index, 1)
        })
      }
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    // 监听选中或取消
    clickRow(item, type) {
      if (type) {
        if (this.isCheck) {
          this.totalList.push(item)
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex(list => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    },
    submitOk() {
      if (this.totalList.length === 0) {
        this.$message.warning('请选择巡查任务')
        return
      }
      this.confirmLoading = true
      this.$emit('submit', this.totalList)
      const taskTemplateCodes = []
      this.totalList.map(el => taskTemplateCodes.push(el.code))
      const req = {
        holidayId: this.params.holidayId ? this.params.holidayId : undefined,
        weekNum: this.params.weekNum ? this.params.weekNum : undefined,
        schoolCode: this.schoolCode,
        taskTemplateCodes: taskTemplateCodes
      }
      if (this.params.holidayId) {
        this.holidayBindTask(req).then(el => {
          this.$message.success('操作成功')
          this.reset()
          this.status = false
          this.$tools.goNext(() => {
            this.$emit('updateDay')
          })
        })
      } else {
        this.weekBindTask(req).then(el => {
          this.$message.success('操作成功')
          this.reset()
          this.status = false
          this.$tools.goNext(() => {
            this.$emit('updateWeek')
          })
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
