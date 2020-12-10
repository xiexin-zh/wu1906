<template>
  <div class="page-layout qui-fx goods">
    <div class="page-left">
      <grade-tree @select="select"></grade-tree>
    </div>
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button class="export-btn" @click="batchClick">批量确认报到</a-button>
        </div>
      </search-form>
      <table-list
        isZoom
        isCheck
        v-model="chooseList"
        :page-list="pageList"
        @selectAll="selectAll"
        :columns="columns"
        :table-list="userList"
      >
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="详情">
            <a-button
              size="small"
              class="detail-action-btn"
              icon="ellipsis"
              @click.stop="detail(action.record.id)"
            ></a-button>
          </a-tooltip>
          <a-tooltip v-if="!action.record.hasCheckIn" placement="topLeft" title="确认报到">
            <a-button
              size="small"
              class="pair-action-btn"
              icon="check-circle"
              @click.stop="checkClick('single', action.record.id)"
            ></a-button>
          </a-tooltip>
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import GradeTree from '../../component/MajorTree'
import UploadMulti from '@c/UploadFace'
const searchLabel = [
  {
    value: 'name',
    type: 'input',
    label: '姓名'
  },
  {
    value: 'idCard',
    type: 'input',
    label: '身份证号'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '0',
        val: '已报到'
      },
      {
        key: '1',
        val: '未报到'
      }
    ],
    value: 'state',
    type: 'select',
    label: '报到状态'
  }
]
const columns = [
  {
    title: '序号',
    width: '5%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'studentName',
    width: '8%'
  },
  {
    title: '年级',
    width: '8%',
    dataIndex: 'grade'
  },
  {
    title: '专业',
    dataIndex: 'finalMajorName',
    width: '10%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: '5%',
    customRender: (text) => {
      if (text === 1 || text === '1') {
        return '男'
      }
      if (text === 2 || text === '2') {
        return '女'
      }
      return '未知'
    }
  },
  {
    title: '身份证号',
    dataIndex: 'idNumber',
    width: '8%'
  },
  {
    title: '报到状态',
    dataIndex: 'hasCheckIn',
    width: '8%',
    customRender: (text) => {
      if (text === true) {
        return '已报到'
      }
      if (text === false) {
        return '未报到'
      }
      return ''
    }
  },
  {
    title: '人脸照片',
    dataIndex: 'photoUrl',
    width: '10%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '操作',
    width: '5%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'StudentManage',
  components: {
    TableList,
    SearchForm,
    PageNum,
    GradeTree,
    UploadMulti
  },
  data() {
    return {
      columns,
      searchLabel,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {
        schoolCode: ''
      },
      total: 0,
      userList: [],
      chooseList: [],
      totalList: [],
      classCode: '',
      grade: '',
      subjectCode: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {},
  methods: {
    ...mapActions('home', ['getGlList', 'recordDetail', 'downRecord', 'studentReport']),
    async showList(searchObj = {}) {
      this.searchList.schoolCode = this.userInfo.schoolCode
      const req = {
        grade: this.grade, // 年级
        finalMajorCode: this.subjectCode, // 分配专业code
        classCode: this.classCode, // 分配班级code
        state: 3 // 必须是申请成功的学生
      }
      this.searchList = Object.assign(this.searchList, this.pageList, searchObj, req)
      const res = await this.getGlList(this.searchList)
      this.userList = res.data.records.map(item => {
        return {
          ...item,
          disabled: item.hasCheckIn
        }
      })
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.page = 1
      this.dateTime = values.date
      this.state = values.state
      const searchObj = {
        studentName: values.name,
        hasCheckIn: values.state === '0' ? true : values.state === '1' ? false : '',
        idNumber: values.idCard
      }
      this.showList(searchObj)
    },
    // 去详情
    detail(id) {
      this.$router.push({
        path: `/studentManage/studentDetails`,
        query: {
          id
        }
      })
    },
    // 选择树形列表
    select(item) {
      const { classCode, gradeName, subjectCode } = item
      this.grade = Number(gradeName)
      this.subjectCode = subjectCode
      this.classCode = classCode
      this.showList()
    },
    // 表格全选
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach((item) => {
          const index = this.totalList.findIndex((list) => {
            return list.id === item.id
          })
          this.totalList.splice(index, 1)
        })
      }
    },
    submitForm() {
      if (this.totalList.length === 0) {
        this.$message.warning('请选择学生')
        return
      }
    },
    // 批量报到按钮
    batchClick() {
      if (this.chooseList.length === 0) {
        this.$message.error('请选择学生')
        return
      }
      const ids = this.chooseList.join(',')
      this.checkClick('batch', ids)
    },
    // 报到按钮
    checkClick(type, id) {
      this.$confirm({
        title: '确认报到',
        content: '确定学生已报到吗？',
        onOk: async () => {
          let ids = ''
          if (type === 'single') {
            // 单个报到
            ids = [id]
          } else {
            // 批量报到
            ids = this.chooseList
          }
          const req = {
            ids,
            userName: this.userInfo.userName
          }
          const res = await this.studentReport(req)
          if (res && res.code === 200) {
            this.$message.success('报到成功')
            this.showList()
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.goods {
  .page-left {
    background: #fff;
    margin-right: 10px;
    width: 150px;
  }
}
</style>
