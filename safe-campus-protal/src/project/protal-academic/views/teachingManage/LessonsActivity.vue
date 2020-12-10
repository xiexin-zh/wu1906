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
            <a-button icon="plus" class="add-btn" @click="addPlan('')">添加</a-button>
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
    title: '活动名称',
    dataIndex: 'activityName',
    width: '15%'
  },
  {
    title: '备课组',
    dataIndex: 'lessonsGroup',
    width: '10%'
  },
  {
    title: '教研组',
    dataIndex: 'teachingGroup',
    width: '10%'
  },
  {
    title: '专业',
    dataIndex: 'major',
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
    title: '创建人',
    dataIndex: 'creatUser',
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
    value: 'activityName',
    type: 'input',
    label: '活动名称',
    placeholder: '请输入活动名称'
  },
  {
    value: 'teachingGroup',
    type: 'select',
    label: '教研组',
    placeholder: '',
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '教研组1'
      }
    ]
  },
  {
    value: 'lessonGroup',
    type: 'select',
    label: '备课组',
    placeholder: '',
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '备课组1'
      }
    ]
  },
  {
    value: 'major',
    type: 'select',
    label: '专业',
    placeholder: '',
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '软件开发'
      }
    ]
  },
  {
    value: 'semester',
    type: 'select',
    label: '学期',
    placeholder: '',
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '第一学期'
      }
    ]
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
  name: 'LessonsPlan',
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
        major: values.major,
        semester: values.semester
      }
      this.showList()
    },
    // 列表
    async showList(obj = {}) {
      const req = {
        ...this.pageList,
        ...this.searchObj,
        schoolCode: this.userInfo.schoolCode
      }
      this.taskList = [
        {
          id: 1,
          activityName: '这是个活动名称',
          lessonsGroup: '备课组名称',
          teachingGroup: '教研组名称',
          major: '软件开发',
          schoolYear: '2020级',
          semester: '学期',
          creatUser: 'admin',
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
    // 添加/编辑按钮
    addPlan(id) {
      if (id) {
        this.$router.push({
          path: '/teachingManage/AddLessonsActivity',
          query: { id }
        })
      } else {
        this.$router.push({
          path: '/teachingManage/AddLessonsActivity'
        })
      }
    },
    // 详情
    toDetail(id) {
      this.$router.push({
        path: '/teachingManage/lessonsDetails',
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
