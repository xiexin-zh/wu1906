<template>
  <a-modal
    width="800px"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <div class="qui-fx-ver">
      <search-form v-if="show" isReset @search-form="searchForm" :search-label="searchLabel"> </search-form>
      <div class="u-mar-b10" v-if="!show">
        选择日期：
        <a-date-picker
          :allowClear="false"
          :default-value="defaultValue"
          :disabled-date="disabledDate"
          @change="onChange" />
      </div>
      <table-list
        is-radio
        :columns="columns"
        :table-list="recordList"
        @clickRow="clickRow"
        v-model="chooseList"
      >
        <template v-slot:actions="action">
          <div class="qui-fx">
            <div class="u-mar-r20" v-for="(ele, i) in action.record.ruleTimeDtoList" :key="i">
              <span v-if="ele.startTime">{{ ele.startTime }}</span>
              <span v-if="ele.startTime"> ~ </span>
              <span v-if="ele.startTime">{{ ele.endTime }}</span>
            </div>
          </div>
        </template>
      </table-list>
    </div>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import moment from 'moment'
const columns = [
  {
    title: '班次名称',
    dataIndex: 'name',
    width: '20%'
  },
  {
    title: '考勤时间',
    width: '60%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'searchKey',
    type: 'input',
    label: '班次名称',
    placeholder: '请输入'
  }
]
export default {
  name: 'ChooseUser',
  components: {
    TableList,
    SearchForm
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    teacherList: {
      type: Array,
      default: () => {
        return []
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'eduCode']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      searchLabel,
      confirmLoading: false,
      chooseList: [],
      pageList: {
        page: 1,
        size: 9999
      },
      columns,
      totalList: {},
      recordList: [],
      current: '',
      defaultValue: '',
      title: ''
    }
  },
  methods: {
    ...mapActions('home', ['getStudentStatistics']),
    disabledDate(current) {
      return current && current < moment().endOf('day')
    },
    async showList() {
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getStudentStatistics(this.searchList)
      this.recordList = res.data.list
      this.chooseList = [ res.data.list[0].id ]
    },
    searchForm (values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList = Object.assign(this.searchList, values)
      this.showList()
    },
    // 监听选中或取消
    clickRow(item, type) {
      this.totalList = item
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    onChange(date, dateString) {
      this.current = dateString
    },
    submitOk() {
      if (!this.show && this.current === '') {
        this.$message.warning('请选择日期')
        return
      }
      if (!this.show && !this.totalList.code) {
        this.$message.warning('请选择班次')
        return
      }
      this.confirmLoading = true
      this.totalList.current = this.current
      this.$emit('submit', this.totalList)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
