<template>
  <div class="table-page page-layout qui-fx">
    <sub-form
      ref="form"
      @submit-form="submitForm"
      :title="formTitle"
      v-model="formStatus"
      :form-data="formData"
    >
    </sub-form>
    <div class="qui-fx qui-fx-jsb" style="width: 100%">
      <div class="right qui-fx-ver qui-fx-f1" style="padding-right: 10px">
        <search-form isReset @search-form="searchForm" :search-label="searchLabel">
          <div slot="left">
            <a-button icon="plus" class="add-btn" @click="addClick">添加</a-button>
          </div>
        </search-form>
        <table-list is-zoom :page-list="pageList" :columns="columns" :table-list="taskList">
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="查看详情">
              <a-button
                size="small"
                class="detail-action-btn"
                icon="ellipsis"
                @click.stop="toDetail(action.record.id)"
              ></a-button>
            </a-tooltip>
            <a-popconfirm
              placement="left"
              okText="确定"
              cancelText="取消"
              @confirm="deleteList(action.record)"
            >
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
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import SubForm from '../../component/SubForm'
import Tools from '@/utils/tools'
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '教师姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '年级',
    dataIndex: 'schoolYear',
    width: '10%'
  },
  {
    title: '学期',
    dataIndex: 'semester',
    width: '10%'
  },
  {
    title: '教学类别',
    dataIndex: 'type',
    width: '15%'
  },
  {
    title: '专业',
    dataIndex: 'major',
    width: '15%'
  },
  {
    title: '班级',
    dataIndex: 'class',
    width: '10%'
  },
  {
    title: '课程',
    dataIndex: 'subject',
    width: '10%'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '15%',
    customRender: (text) => {
      return Tools.getDate(text, 5)
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
    value: 'semester',
    type: 'select',
    label: '学期',
    placeholder: '',
    list: []
  },
  {
    value: 'type',
    type: 'select',
    label: '教学类别',
    placeholder: '',
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '期中'
      },
      {
        key: '2',
        val: '期末'
      }
    ]
  },
  {
    value: 'major',
    type: 'select',
    label: '专业',
    placeholder: '',
    list: []
  },
  {
    value: 'subject',
    type: 'select',
    label: '课程',
    placeholder: '',
    list: []
  },
  {
    value: 'userName',
    type: 'input',
    label: '教师姓名',
    placeholder: '请输入教师姓名'
  }
]
const formData = [
  {
    value: 'title',
    initValue: '',
    type: 'input',
    max: 15,
    label: '实践任务名称',
    placeholder: '请输入名称(限15字内)'
  }
]
export default {
  name: 'Summary',
  components: {
    TableList,
    PageNum,
    SearchForm,
    SubForm
  },
  data() {
    return {
      formTitle: '添加',
      formStatus: false,
      formData,
      columns,
      searchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      taskList: [],
      searchObj: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {},
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getPlanList', 'delTask']),
    // 搜索
    searchForm(values) {
      this.searchObj = {
        groupName: values.groupName,
        leader: values.leader,
        member: values.member
      }
      this.showList()
    },
    // 任务列表
    async showList(obj = {}) {
      const req = {
        ...this.pageList,
        ...this.searchObj,
        schoolCode: this.userInfo.schoolCode
      }
      this.taskList = [
        {
          id: 1,
          userName: '李佳乐',
          schoolYear: '2020',
          semester: '第一学期',
          type: '期中',
          major: '软件技术',
          class: '班级',
          subject: 'java开发',
          createTime: 1606791845443
        }
      ]
      // const res = await this.getPlanList(req)
      // if (!res.data.list) {
      //   this.taskList = []
      //   return
      // }
      // this.taskList = res.data.list
      // this.total = res.data.total
    },
    // 删除按钮
    async deleteList(record) {
      await this.delTask({ id: record.id })
      this.showList()
    },
    // 添加按钮
    addClick() {
      this.$router.push({
        path: '/teacherWork/addSummary'
      })
    },
    toDetail(id) {
      this.$router.push({
        path: '/teacherWork/summaryDetails',
        query: { id }
      })
    },
    // 提交保存
    submitForm(values) {}
  }
}
</script>
<style lang="less" scoped>
.table-page {
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
