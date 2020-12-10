<template>
  <div class="students page-layout qui-fx">
    <sub-form
      ref="form"
      @submit-form="submitForm"
      @selectPanel="showSelectPanel"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    >
      <template slot="selectPanel">
        <a-input
          placeholder="请选择"
          :disabled="disableSelect"
          :read-only="true"
          @focus="showSelectPanel"
          v-model="studentInfo.userName"
        >
          <a-icon slot="suffix" type="right" />
        </a-input>
      </template>
      <template slot="selectPanel_1">
        <a-input placeholder="" :disabled="true" v-model="studentInfo.workNo"> </a-input>
      </template>
      <template slot="selectPanel_2">
        <div style="display: flex; justify-content: space-between">
          <a-input style="width: 48%" placeholder="" :disabled="true" v-model="studentInfo.gradeName"> </a-input>
          <a-input style="width: 48%" placeholder="" :disabled="true" v-model="studentInfo.className"> </a-input>
        </div>
      </template>
    </sub-form>
    <student-panel
      title="选择学生"
      studentStatus="1"
      v-if="panelStatus"
      v-model="panelStatus"
      @submit="confirmSelect"
      :isHighSchool="isHighSchool"
    ></student-panel>
    <div class="qui-fx qui-fx-jsb" style="width: 100%">
      <div class="right qui-fx-ver qui-fx-f1" style="padding-right: 10px">
        <search-form isReset @search-form="searchForm" :search-label="searchLabel">
          <div slot="left">
            <a-button icon="plus" class="add-btn" @click="addAward(0)">添加</a-button>
          </div>
        </search-form>
        <table-list
          is-zoom
          @clickRow="clickRow"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          :table-list="userList"
        >
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="编辑">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="addAward(1, action.record)"
              ></a-button>
            </a-tooltip>
            <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="deleteList(action.record)">
              <template slot="title"> 您确定删除吗? </template>
              <a-tooltip placement="topLeft" title="删除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import NoData from '@c/NoData'
import PageNum from '@c/PageNum'
import SubForm from '../../component/SubForm'
import StudentPanel from '../../component/StudentPanel'
import SearchForm from '@c/SearchForm'
import UploadMulti from '@c/UploadFace'
import ShowDialog from '@c/ShowDialog'
import Tools from '@u/tools'

const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '8%'
  },
  {
    title: '学号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '年级',
    dataIndex: 'gradeName',
    width: '8%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '8%'
  },
  {
    title: '奖励',
    dataIndex: 'awardType',
    width: '10%',
    customRender: (text) => {
      return Tools.getAwardType(text)
    }
  },
  {
    title: '奖金',
    dataIndex: 'awardMoney',
    width: '8%'
  },
  {
    title: '奖励日期',
    dataIndex: 'disposeDate',
    width: '15%',
    customRender: (text) => {
      return text ? Tools.getDate(text, 1) : ''
    }
  },
  {
    title: '颁奖单位',
    dataIndex: 'disposeUnit',
    width: '10%'
  },
  {
    title: '奖励原因',
    dataIndex: 'disposeReason',
    width: '10%'
  },
  {
    title: '添加人',
    dataIndex: 'createUser',
    width: '8%'
  },
  {
    title: '添加时间',
    dataIndex: 'createTime',
    width: '15%',
    customRender: (text) => {
      return text ? Tools.getDate(text, 5) : ''
    }
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'time',
    type: 'rangeTime',
    label: '时间'
  },
  {
    value: 'keyword',
    type: 'input',
    label: '姓名/学号'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '市级三好学生'
      },
      {
        key: '2',
        val: '市级优秀学生干部'
      },
      {
        key: '3',
        val: '县级三好学生'
      },
      {
        key: '4',
        val: '校级三好学生'
      },
      {
        key: '5',
        val: '校级优秀学生干部'
      },
      {
        key: '6',
        val: '校级合格学生'
      },
      {
        key: '7',
        val: '校级优秀团员'
      },
      {
        key: '8',
        val: '校级进步学生'
      },
      {
        key: '9',
        val: '其他'
      }
    ],
    value: 'awardType',
    type: 'select',
    label: '奖励类型'
  }
]
const formData = [
  {
    value: 'userName',
    initValue: '',
    type: 'selectPanel',
    label: '学生姓名',
    readonly: true,
    placeholder: '请选择'
  },
  {
    value: 'workNo',
    initValue: '',
    type: 'selectPanel_1',
    label: '学号',
    disabled: true,
    required: false,
    placeholder: ''
  },
  {
    value1: 'gradeName',
    value2: 'className',
    initValue1: '',
    initValue2: '',
    disabled: true,
    type: 'selectPanel_2',
    required: false,
    label: '班级',
    placeholder1: '',
    placeholder2: '',
    firstList: [],
    secondList: []
  },
  {
    value: 'awardType',
    initValue: '',
    list: [
      {
        key: '1',
        val: '市级三好学生'
      },
      {
        key: '2',
        val: '市级优秀学生干部'
      },
      {
        key: '3',
        val: '县级三好学生'
      },
      {
        key: '4',
        val: '校级三好学生'
      },
      {
        key: '5',
        val: '校级优秀学生干部'
      },
      {
        key: '6',
        val: '校级合格学生'
      },
      {
        key: '7',
        val: '校级优秀团员'
      },
      {
        key: '8',
        val: '校级进步学生'
      },
      {
        key: '9',
        val: '其他'
      }
    ],
    type: 'select',
    label: '奖励',
    placeholder: '请选择'
  },
  {
    value: 'awardMoney',
    initValue: '',
    type: 'number',
    label: '奖金',
    required: false,
    placeholder: '请输入'
  },
  {
    value: 'disposeDate',
    initValue: '',
    type: 'singleTime',
    label: '奖励日期',
    placeholder: '年/月/日'
  },
  {
    value: 'disposeUnit',
    initValue: '',
    type: 'input',
    label: '颁奖单位',
    max: 30,
    required: false,
    placeholder: '请输入颁奖单位(限30字内)'
  },
  {
    value: 'disposeReason',
    initValue: '',
    type: 'textarea',
    label: '奖励原因',
    max: 200,
    minRows: 2,
    maxRows: 3,
    placeholder: '限200字内'
  }
]
export default {
  name: 'Award',
  components: {
    TableList,
    PageNum,
    SubForm,
    UploadMulti,
    SearchForm,
    NoData,
    ShowDialog,
    StudentPanel
  },
  data() {
    return {
      columns,
      searchLabel,
      title: '添加',
      formStatus: false,
      panelStatus: false,
      formData,
      disableSelect: false,
      studentInfo: {
        userName: '',
        workNo: '',
        gradeName: '',
        className: ''
      },
      chooseList: [],
      type: 0,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      userList: [],
      schoolYear: '',
      schoolYearId: '',
      gradeCode: '',
      userId: '',
      searchObj: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'isHighSchool'])
  },
  created() {
    this.columns[3].title = this.isHighSchool ? '专业' : '年级'
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getStuAoPList', 'addStuAoP', 'editStuAop', 'delStuAop']),
    searchForm(values) {
      this.searchObj = {
        keyword: values.keyword || '',
        awardType: values.awardType,
        startTime: new Date(`${values.time[0]} 00:00:00`).getTime(),
        endTime: new Date(`${values.time[1]} 23:59:59`).getTime()
      }
      this.showList()
    },
    async submitForm(values) {
      if (!this.studentInfo.userName) {
        this.$message.warning('请选择学生')
        return
      }
      const req = {
        ...values,
        awardOrPunishment: 1,
        schoolCode: this.userInfo.schoolCode,
        createUser: this.userInfo.userName,
        userCode: this.userCode,
        disposeDate: new Date(values.disposeDate).getTime(),
        createTime: new Date().getTime(),
        schoolYearId: this.schoolYearId,
        schoolYear: this.schoolYear,
        userId: this.userId,
        ...this.studentInfo
      }
      if (this.type) {
        req.id = this.listId
      }
      const res = this.type ? await this.editStuAop(req) : await this.addStuAoP(req)
      if (res && res.code === 200) {
        this.formStatus = false
        this.pageList.page = 1
        this.showList()
      }
    },
    addAward(type, record) {
      this.formStatus = true
      if (type) {
        this.title = '编辑'
        this.formData = this.$tools.fillForm(formData, record)
        this.formData[5].initValue = Tools.getDate(record.disposeDate, 1)
        this.disableSelect = true
        this.studentInfo = {
          userName: record.userName,
          workNo: record.workNo,
          gradeName: record.gradeName,
          className: record.className
        }
        this.type = 1
        this.schoolYear = record.schoolYear || ''
        this.schoolYearId = record.schoolYearId || ''
        this.userCode = record.userCode
        this.userId = record.userId || ''
        this.listId = record.id
      } else {
        this.title = '添加'
        this.formData = formData
        this.type = 0
        this.disableSelect = false
        this.studentInfo = {
          userName: '',
          workNo: '',
          gradeName: '',
          className: ''
        }
      }
    },
    async showList(obj = {}) {
      const req = {
        ...this.searchObj,
        ...obj,
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        awardOrPunishment: 1
      }
      const res = await this.getStuAoPList(req)
      if (!res.data.list) {
        this.userList = []
        return
      }
      this.userList = res.data.list
      this.total = res.data.total
    },
    async deleteList(record) {
      const res = await this.delStuAop({ id: record.id })
      if (res && res.code === 200) {
        this.showList()
      }
    },
    clickRow(id) {
      console.log(id)
    },
    showSelectPanel() {
      this.panelStatus = true
    },
    confirmSelect(item) {
      this.panelStatus = false
      const { userName, userCode, id, userId, gradeName, gradeCode, className, workNo, schoolYearId } = item
      this.studentInfo = {
        userName: userName || '',
        workNo: workNo || '',
        gradeName: gradeName || '',
        className: className || ''
      }
      this.userCode = userCode
      this.gradeCode = gradeCode
      this.schoolYearId = schoolYearId
      this.userId = this.isHighSchool ? userId : id
    }
  }
}
</script>
<style lang="less" scoped>
.students {
  background: #fff;
  height: 100%;
  .left {
    padding: 10px;
  }
  .right {
    padding: 0 10px;
    border-left: 1px solid @bor-color;
    .action {
      div {
        cursor: pointer;
        margin: 4px 30px 0 0;
        img {
          width: 20px;
          height: 20px;
        }
        span {
          font-size: 12px;
        }
      }
    }
  }
}
.modal {
  padding: 0 40px;
  .line {
    margin-bottom: 20px;
  }
  .title {
    font-size: 14px;
    font-weight: bold;
    margin-right: 20px;
    min-width: 70px;
  }
  .download {
    color: #6882da;
    cursor: pointer;
  }
  /deep/ .ant-upload-list-item-info {
    padding: 0 22px 0 4px;
  }
}
</style>
