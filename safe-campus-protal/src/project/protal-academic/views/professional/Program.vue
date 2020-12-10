<template>
  <div class="table-page page-layout qui-fx">
    <div class="qui-fx qui-fx-jsb" style="width: 100%">
      <div class="right qui-fx-ver qui-fx-f1" style="padding-right: 10px">
        <search-form isReset @search-form="searchForm" :search-label="searchLabel">
          <div slot="left">
            <a-button icon="plus" class="add-btn" @click="addProgram('')">添加</a-button>
          </div>
        </search-form>
        <table-list is-zoom :page-list="pageList" :columns="columns" :table-list="programList">
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="编辑">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="addProgram(action.record.id)"
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
    title: '专业',
    dataIndex: 'majorName',
    width: '20%'
  },
  {
    title: '专业培养年份',
    dataIndex: 'gradeYear',
    width: '10%'
  },
  {
    title: '学制',
    dataIndex: 'systemType',
    width: '10%'
  },
  {
    title: '学历',
    dataIndex: 'educationTypeStr',
    width: '15%'
  },
  {
    title: '创建人',
    dataIndex: 'createName'
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
    value: 'majorCode',
    type: 'select',
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '软件开发'
      },
      {
        key: '2',
        val: '软件测试'
      }
    ],
    label: '专业',
    placeholder: ''
  },
  {
    value: 'gradeYear',
    type: 'select',
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '2020',
        val: '2020'
      },
      {
        key: '2019',
        val: '2019'
      }
    ],
    label: '专业培养年份',
    placeholder: ''
  }
]
export default {
  name: 'PracticeTask',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  data() {
    return {
      columns,
      searchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      programList: [],
      searchObj: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.getSubject()
    this.getGrade()
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getSchemeList', 'delScheme', 'getHighMajorAll', 'getHighGradeList']),
    async getSubject() {
      const req = {
        size: 9999,
        page: 1,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getHighMajorAll(req)
      if (res && res.code === 200) {
        this.searchLabel[0].list = res.data.records.map((item) => {
          return {
            key: item.subjectCode,
            val: item.subjectName
          }
        })
      }
    },
    async getGrade() {
      const res = await this.getHighGradeList({
        schoolCode: this.userInfo.schoolCode
      })
      if (res && res.code === 200) {
        this.searchLabel[1].list = res.data
          .map((item) => {
            return {
              key: item.gradeName,
              val: item.gradeName
            }
          })
          .reverse()
      }
    },
    // 搜索
    searchForm(values) {
      this.searchObj = {
        ...values
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
      const res = await this.getSchemeList(req)
      if (!res.data.records) {
        this.programList = []
        return
      }
      this.programList = res.data.records
      this.total = res.data.total
    },
    // 删除按钮
    async deleteList(record) {
      await this.delScheme(record.id)
      this.showList()
    },
    // 添加/编辑实践任务按钮
    addProgram(id) {
      if (id) {
        this.$router.push({
          path: '/program/addProgram',
          query: {
            id
          }
        })
      } else {
        this.$router.push({
          path: '/program/addProgram'
        })
      }
    }
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
