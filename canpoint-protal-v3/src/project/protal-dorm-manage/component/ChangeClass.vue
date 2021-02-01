<template>
  <u-modal
    v-if="status"
    @confirm="submitOk"
    :width="900"
    title="更改班次"
    v-model="status"
  >
    <u-search-form v-if="show" @search="search" :search-label="searchLabel"> </u-search-form>
    <div class="u-mar-b10" v-if="!show">
      选择日期：
      <a-date-picker
        :allowClear="false"
        :default-value="defaultValue"
        :disabled-date="disabledDate"
        @change="onChange" />
    </div>
    <div style="height: 500px;" class="u-fx">
      <u-table
        is-radio
        overFlow
        v-model="chooseList"
        :columns="columns"
        :table-list="recordList"
        @clickRow="clickRow"
      >
        <template v-slot:actions="action">
          <div class="u-fx">
            <div v-for="(ele, i) in action.record.outCanpointDormPlanDtoList" :key="i">
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
      </u-table>
    </div>
  </u-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
const columns = [
  {
    title: '班次名称',
    dataIndex: 'orderName',
    width: '15%'
  },
  {
    title: '考勤时间',
    width: '80%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]
const searchLabel = [
  {
    value: 'orderName',
    type: 'input',
    label: '班次名称',
    placeholder: '请输入'
  }
]
export default {
  name: 'ChooseUser',
  components: {
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
      moment,
      searchLabel,
      chooseList: [],
      columns,
      totalList: {},
      recordList: [],
      current: '',
      defaultValue: ''
    }
  },
  async mounted() {
    this._getCheckClass()
  },
  methods: {
    ...mapActions('home', ['getCheckClass']),
    // 班次列表
     async _getCheckClass() {
      const req = {
        orderName: this.orderName,
        schoolCode: this.schoolCode,
        page: 1,
        size: 999
      }
      const res = await this.getCheckClass(req)
      this.recordList = res.data.records.map(el => {
        return {
          ...el,
          id: el.orderId
        }
      })
    },
    disabledDate(current) {
      return current && current < moment().endOf('day')
    },
    search (values) {
      this.orderName = values.orderName
      this._getCheckClass()
    },
    reset() {
      this.$emit('input', false)
    },
    onChange(date, dateString) {
      this.current = dateString
    },
    // 监听选中或取消
    clickRow(item, type) {
      this.totalList = item
    },
    submitOk() {
      console.log('this.totalList', this.totalList)
      if (!this.show && this.current === '') {
        this.$message.warning('请选择日期')
        return
      }
      if (!this.show && !this.totalList.orderId) {
        this.$message.warning('请选择班次')
        return
      }
      this.totalList.current = this.current
      this.$emit('submit', this.totalList)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
