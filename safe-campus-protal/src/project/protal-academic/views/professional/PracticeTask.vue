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
            <a-button icon="plus" class="add-btn" @click="addTask">添加实践任务</a-button>
          </div>
        </search-form>
        <table-list is-zoom :page-list="pageList" :columns="columns" :table-list="taskList">
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="编辑">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="addTask(action.record)"
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
    title: '实践任务',
    dataIndex: 'name',
    width: '40%'
  },
  {
    title: '创建人',
    dataIndex: 'createName'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
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
    value: 'name',
    type: 'input',
    label: '实践任务',
    placeholder: '请输入实践任务'
  }
]
const formData = [
  {
    value: 'name',
    initValue: '',
    type: 'input',
    max: 15,
    label: '实践任务名称',
    placeholder: '请输入名称(限15字内)'
  }
]
export default {
  name: 'PracticeTask',
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
    ...mapActions('home', [
      'addPracticeTask',
      'getPracticeTask',
      'delPracticeTaskById',
      'editPracticeTask'
    ]),
    // 搜索
    searchForm(values) {
      this.searchObj = {
        name: values.name
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
      const res = await this.getPracticeTask(req)
      if (!res.data.records) {
        this.taskList = []
        return
      }
      this.taskList = res.data.records
      this.total = res.data.total
    },
    // 删除按钮
    async deleteList(record) {
      await this.delPracticeTaskById(record.id)
      this.showList()
    },
    // 添加/编辑实践任务按钮
    addTask(record) {
      this.formData = record.id ? this.$tools.fillForm(formData, record) : formData
      this.formTitle = record.id ? '编辑' : '添加'
      this.listId = record.id || ''
      this.formStatus = true
    },
    // 提交保存
    async submitForm(values) {
      const req = {
        createName: this.userInfo.userName,
        schoolCode: this.userInfo.schoolCode,
        name: values.name
      }
      const highReq = {
        id: this.listId,
        name: values.name
      }
      const res = this.listId
        ? await this.editPracticeTask(highReq)
        : await this.addPracticeTask(req)
      if (res && res.code === 200) {
        this.formStatus = false
        this.showList()
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
