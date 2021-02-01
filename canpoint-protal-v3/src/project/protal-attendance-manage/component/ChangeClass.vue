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
    <div class="u-fx-ver u-fx-f1">
      <u-search-form v-if="show" isReset @search="searchForm" :search-label="searchLabel"> </u-search-form>
      <div class="u-mar-b10" v-if="!show">
        选择日期：
        <a-date-picker
          :allowClear="false"
          :default-value="defaultValue"
          :disabled-date="disabledDate"
          @change="onChange" />
      </div>
      <div style="min-height: 300px;" class="u-fx-ver">
        <u-table
          is-radio
          :columns="columns"
          :table-list="recordList"
          @clickRow="clickRow"
          v-model="chooseList"
        >
          <template v-slot:actions="actions">
            <div class="u-fx">
              <div class="u-mar-r20" v-for="(ele, i) in actions.record.ruleTimeDtoList" :key="i">
                <span v-if="ele.startTime">{{ ele.startTime }} ~ {{ ele.endTime }}</span>
              </div>
            </div>
          </template>
        </u-table>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
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
      customRender: 'actions'
    }
  }
]
const searchLabel = [
  {
    value: 'name',
    type: 'input',
    label: '班次名称',
    placeholder: '请输入'
  }
]
export default {
  name: 'ChangeClass',
  components: {
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('home', ['schoolCode']),
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
  created() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getShiftManage']),
    disabledDate(current) {
      return current && current < moment().endOf('day')
    },
    async showList(name = '') {
      this.pageList.schoolCode = this.schoolCode
      const res = await this.getShiftManage({
        ...this.pageList,
        name
      })
      this.classList = res.data.list
      this.recordList = res.data.list
      console.log(this.recordList)
      this.chooseList = res.data.list.length > 0 ? [ res.data.list[0].id ] : []
    },
    searchForm (values) {
      if (values.name) {
        this.recordList = this.classList.filter(item => item.name === values.name)
      } else {
        this.recordList = this.classList
      }
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
      this.recordList = this.classList
      this.confirmLoading = true
      this.totalList.current = this.current
      this.$emit('submit', this.totalList)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
