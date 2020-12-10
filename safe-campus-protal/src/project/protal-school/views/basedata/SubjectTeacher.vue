<template>
  <div class="impower page-layout qui-fx-ver">
    <choose-user
      is-check
      ref="form"
      v-if="userTag"
      chooseType="subject"
      v-model="userTag"
      @submit="submit"
      title="添加教师"
    ></choose-user>
    <no-data msg="暂无教师列表" v-if="false">
      <div slot="btn">
        <a-button type="primary" @click="dialogTag = true">
          <a-icon type="plus" />添加教师
        </a-button>
      </div>
    </no-data>
    <div v-else class="qui-fx-ver qui-fx-f1">
      <search-form isReset @search-form="searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button icon="delete" class="del-btn" @click.stop="deleteList">批量删除</a-button>
          <a-button icon="plus" class="add-btn" @click="userTag = true">添加教师</a-button>
        </div>
      </search-form>
      <table-list
        is-zoom
        is-check
        :page-list="pageList"
        :columns="columns"
        :table-list="userList"
        v-model="chooseList">
        <template v-slot:actions="action">
          <a-popconfirm
            placement="left"
            okText="确定"
            cancelText="取消"
            @confirm="deleteUser(action.record)"
          >
            <template slot="title">您确定删除吗?</template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList(keyWord)"></page-num>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import NoData from '@c/NoData'
import SearchForm from '@c/SearchForm'
import ChooseUser from '@c/ChooseUser'

const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '教师姓名',
    dataIndex: 'teacherName',
    width: '10%'
  },
  {
    title: '工号',
    dataIndex: 'userNo',
    width: '10%'
  },
  {
    title: '手机号码',
    dataIndex: 'mobile',
    width: '10%'
  },
  {
    title: '组织机构',
    dataIndex: 'orgName',
    width: '10%'
  },
  {
    title: '人脸照片',
    dataIndex: 'photoSrc',
    width: '10%',
    scopedSlots: {
      customRender: 'photoPic'
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
    value: 'teacherName',
    initValue: '',
    type: 'input',
    label: '教师姓名',
    placeholder: '请输入'
  },
  {
    value: 'mobile',
    initValue: '',
    type: 'input',
    label: '手机号',
    placeholder: '请输入'
  }
]
export default {
  name: 'SubjectTeacher',
  components: {
    NoData,
    TableList,
    PageNum,
    ChooseUser,
    SearchForm
  },
  data() {
    return {
      userTag: false,
      title: '新增教师',
      searchLabel,
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      userList: [],
      chooseList: [],
      keyWord: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['addSubTeacher', 'getSubTeacherList', 'deleteSubTeacher']),
    submit(value) {
      if (value.length > 0) {
        const req = {
          subjectCode: this.$route.query.subjectCode,
          schoolCode: this.userInfo.schoolCode,
          teacherCodes: value.map(ele => {
            return ele.userCode
          })
        }
        this.addSubTeacher(req)
          .then(res => {
            this.$message.success('添加成功')
            this.$tools.goNext(() => {
              this.showList(this.keyWord)
              this.$refs.form.reset()
            })
          })
          .catch(() => {
            this.$refs.form.error()
          })
      }
    },
    searchForm(values) {
      this.keyWord = values
      this.showList(this.keyWord)
    },
    async deleteUser(record) {
      await this.deleteSubTeacher([record.id])
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.chooseList = []
        this.showList(this.keyWord)
      })
    },
    deleteList() {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择教师')
        return
      }
      this.$tools.delTip('确定删除吗?', () => {
        this.deleteSubTeacher(this.chooseList).then(res => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.chooseList = []
            this.showList(this.keyWord)
          })
        })
      })
    },
    async showList(keyWord = {}) {
      const req = {
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        ...this.userInfo,
        subjectCode: this.$route.query.subjectCode,
        teacherName: keyWord.teacherName,
        mobile: keyWord.mobile
      }
      const res = await this.getSubTeacherList(req)
      if (!res.data) {
        this.userList = []
        return
      }
      this.userList = res.data.list
      this.total = res.data.total
      this.$nextTick(() => {
        this.userList.forEach(ele => {
          this.$set(ele, 'roleName', this.$route.query.name)
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
