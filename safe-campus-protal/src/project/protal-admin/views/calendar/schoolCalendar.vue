<template>
  <div class="page-layout qui-fx-ver">
    <calendar-detail v-model="userTag" title="查看校历"></calendar-detail>
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    ></submit-form>
    <div class="top-btn-group">
      <a-button icon="plus" class="add-btn" @click="addApp(0)">添加校历</a-button>
    </div>
    <table-list is-zoom :page-list="pageList" :columns="columns" :table-list="userList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="查看校历">
          <a-button
            @click="goDetail(action)"
            size="small"
            class="detail-action-btn"
            icon="ellipsis"
          ></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="编辑">
          <a-button
            size="small"
            class="edit-action-btn"
            icon="form"
            @click.stop="addApp(1, action)"
          ></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="delClick(action)">
          <template slot="title">您确定删除吗?</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import TableList from '@c/TableList'
import Tools from '@u/tools'
import PageNum from '@c/PageNum'
import SubmitForm from '@c/SubmitForm'
import CalendarDetail from '@c/CalendarDetail'
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学年',
    dataIndex: 'year',
    width: '15%'
  },
  {
    title: '学年起止日期',
    dataIndex: 'startDate endDate',
    width: '15%',
    customRender: text => {
      return Tools.getDate(text).substring(0, 10)
    }
  },
  {
    title: '第一学期',
    dataIndex: 'oneStartDate oneEndDate ',
    width: '15%',
    customRender: text => {
      return Tools.getDate(text).substring(0, 10)
    }
  },
  {
    title: '第二学期',
    dataIndex: 'twoStartDate twoEndDate ',
    width: '15%',
    customRender: text => {
      return Tools.getDate(text).substring(0, 10)
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '10%',
    customRender: text => {
      return Tools.getDate(text).substring(0, 10)
    }
  },
  {
    title: '备注',
    dataIndex: 'reamrk',
    width: '10%'
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const formData = [
  {
    value: 'year',
    initValue: [],
    list: [],
    type: 'select',
    label: '学年',
    placeholder: '请选择学年'
  },
  {
    value: 'rangeTime', // 日期区间
    initValue: '',
    type: 'rangeTime',
    label: '学年起止日期'
  },
  {
    value: 'oneAutoUp',
    initValue: 0,
    list: [
      {
        key: 0,
        val: '否'
      },
      {
        key: 1,
        val: '是'
      }
    ],
    type: 'radio',
    label: '升级学年',
    placeholder: '第一学期是否自动升级学年'
  },
  {
    value: 'rangeTime1', // 日期区间
    initValue: '',
    type: 'rangeTime',
    label: '第一学期'
  },
  {
    value: 'rangeTime2', // 日期区间
    initValue: '',
    type: 'rangeTime',
    label: '第二学期'
  },
  {
    value: 'twoAutoUp',
    initValue: 0,
    list: [
      {
        key: 0,
        val: '否'
      },
      {
        key: 1,
        val: '是'
      }
    ],
    type: 'radio',
    label: '升级学年',
    placeholder: '第二学期是否自动升级学年'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'input',
    label: '备注',
    placeholder: '请输入备注',
    required: false
  }
]
export default {
  name: 'SchoolCalendar',
  components: {
    TableList,
    PageNum,
    SubmitForm,
    CalendarDetail
  },
  data() {
    return {
      title: '添加校历',
      formStatus: false,
      formData,
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      userList: [],
      dateList: [],
      id: '',
      year: '',
      calendarInfo: [],
      userTag: false
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this.showList()
    this.yearList()
  },
  methods: {
    ...mapActions('home', [
      'addcalendar',
      'delcalendar',
      'calendarDetail',
      'updateCalendar',
      'getcalendarList',
      'getyearList'
    ]),

    //列表
    async showList() {
      this.pageList.schoolCode = this.schoolCode
      const res = await this.getcalendarList(this.pageList)
      this.userList = res.data.list
      this.total = res.data.total
    },
    //获取学年
    async yearList() {
      this.formData[0].list = []
      this.dateList = []
      this.pageList.schoolCode = this.schoolCode
      const res = await this.getyearList(this.pageList)
      if (res.data.list.length === 0) {
        return
      }
      res.data.list.forEach(ele => {
        this.formData[0].list.push({ key: ele.schoolId, val: ele.semester + ele.schoolYear })
        this.dateList.push({ key: ele.schoolId, val: ele.semester + ele.schoolYear })
      })
    },
    async submitForm(values) {
      this.year = this.dateList.filter(ele => ele.key === values.year)[0].val
      const req = {
        schoolCode: this.schoolCode,
        yearId: values.year,
        year: this.year,
        startDate: this.getDateTime(new Date(values.rangeTime._i)),
        endDate: this.getDateTime(new Date(values.rangeTime._d)),
        oneEndDate: this.getDateTime(new Date(values.rangeTime1._d)),
        oneStartDate: this.getDateTime(new Date(values.rangeTime1._i)),
        twoStartDate: this.getDateTime(new Date(values.rangeTime2._i)),
        twoEndDate: this.getDateTime(new Date(values.rangeTime2._d)),
        twoAutoUp: values.twoAutoUp,
        oneAutoUp: values.oneAutoUp,
        reamrk: values.reamrk
      }
      try {
        if (this.title === '编辑校历') {
          values.id = this.id
          await this.updateCalendar(req)
        } else {
          await this.addcalendar(req)
        }
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.$refs.form.reset()
          this.showList()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    addApp(type, record) {
      this.formStatus = true
      if (type) {
        this.title = '编辑校历'
        this.formData = this.$tools.fillForm(formData, record.record)
        this.id = record.record.id
      } else {
        this.title = '添加校历'
        this.formData = formData
      }
    },
    delClick(record) {
      this.delcalendar(record.record.id).then(res => {
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    },
    async goDetail(record) {
      this.userTag = true

      this.calendarDetail(record.record.id).then(res => {
        this.calendarInfo = res.data
        console.log(this.calendarInfo)
      })
    },
    getDateTime(date) {
      if (date === '' || date === null) {
        return '--'
      }
      const d = new Date(date)
      return (
        d.getFullYear() +
        '-' +
        (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
        '-' +
        (d.getDate() > 9 ? d.getDate() : '0' + d.getDate())
      )
    }
  }
}
</script>
<style lang="less" scoped>
.num-cursor {
  cursor: pointer;
}
</style>
