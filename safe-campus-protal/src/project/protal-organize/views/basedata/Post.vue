<template>
  <div class="role page-layout qui-fx-ver">
    <choose-user
      type="edu"
      chooseType="organize"
      :bind-obj="bindObj"
      is-check
      ref="form"
      v-if="userTag"
      v-model="userTag"
      @submit="submit"
      title="添加用户"
    >
    </choose-user>
    <submit-form ref="form" @submit-form="submitForm" :title="title" v-model="formStatus" :form-data="formData">
    </submit-form>
    <div class="qui-fx qui-fx-ver qui-fx-f1">
      <div class="top-btn-group qui-fx">
        <a-button type="primary" @click="addJob(0)"> <a-icon type="plus" />添加职务</a-button>
      </div>
      <table-list :page-list="pageList" :columns="columns" :table-list="roleList">
        <template v-slot:totalNums="totalNum">
          <div class="qui-fx qui-fx-ac">
            {{ totalNum.record.employeesNum }}
            <a-button
              size="small"
              type="primary"
              icon="plus"
              style="margin-left:10px;"
              @click="addCrew(totalNum.record)"
            ></a-button>
          </div>
        </template>
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="编辑" v-if="action.record.defaultState !== '0'">
            <a-button
              size="small"
              class="edit-action-btn"
              icon="form"
              @click.stop="addJob(1, action.record)"
            ></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="left"
            okText="确定"
            cancelText="取消"
            @confirm="deleteJob(action.record.id)"
            v-if="action.record.defaultState !== '0'"
          >
            <template slot="title">
              您确定删除吗?
            </template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
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
import SubmitForm from '@c/SubmitForm'
import NoData from '@c/NoData'
import Tools from '@u/tools'
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
    title: '职务名称',
    dataIndex: 'jobName',
    width: '10%'
  },
  {
    title: '成员人数',
    width: '10%',
    scopedSlots: {
      customRender: 'totalNum'
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: text => {
      return Tools.getDate(text).substring(0, 10)
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '20%'
  },
  {
    title: '操作',
    width: '30%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const formData = [
  {
    value: 'jobName',
    initValue: '',
    type: 'input',
    label: '职务名称',
    placeholder: '请输入职务名称'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'input',
    required: false,
    label: '备注',
    placeholder: '请输入备注'
  }
]

export default {
  name: 'Post',
  components: {
    NoData,
    TableList,
    PageNum,
    SubmitForm,
    ChooseUser
  },
  data() {
    return {
      title: '添加职位',
      formStatus: false,
      formData,
      columns,
      type: 0,
      id: '',
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      roleList: [],
      userTag: false,
      jobName: '',
      jobCode: '',
      bindObj: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.init()
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getJobList',
      'addEduJob',
      'updateJob',
      'delJob',
      'addUserjob',
      'addDefaultJob',
      'getQueryjob'
    ]),
    // 初始
    async init() {
      const req = {
        eduCode: this.userInfo.eduCode,
        category: '04'
      }
      const res = await this.getQueryjob(req)
      if (!res.data) {
        return
      }
      if (res.data.length === 0) {
        const req = {
          eduCode: this.userInfo.eduCode,
          eduName: this.userInfo.eduName,
          category: '04'
        }
        const con = await this.addDefaultJob(req)
        this.showList()
      }
    },
    async submitForm(values) {
      const req = {
        ...values,
        eduCode: this.userInfo.eduCode,
        eduName: this.userInfo.eduName,
        defaultState: '1',
        category: '04'
      }
      let res
      if (this.type) {
        req.id = this.id
        res = this.updateJob(req)
      } else {
        res = this.addEduJob(req)
      }
      res
        .then(() => {
          const msg = this.type ? '编辑成功' : '添加成功'
          this.$message.success(msg)
          this.$tools.goNext(() => {
            this.showList()
            this.$refs.form.reset()
          })
        })
        .catch(() => {
          this.$refs.form.error()
        })
    },
    addJob(type, record) {
      this.formStatus = true
      if (type === 1) {
        this.title = '编辑职务'
        this.type = 1
        this.id = record.id
        this.formData = this.$tools.fillForm(formData, record)
      } else {
        this.type = 0
        this.title = '添加职务'
        this.formData = formData
      }
    },
    async deleteJob(id) {
      await this.delJob({ id })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    async showList() {
      const req = {
        eduCode: this.userInfo.eduCode,
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        category: '04'
      }
      const res = await this.getJobList(req)
      if (!res.data) {
        this.roleList = []
        return
      }
      this.roleList = res.data.list
      this.total = res.data.total
    },
    addCrew(item) {
      this.jobName = item.jobName
      this.jobCode = item.jobCode
      this.bindObj = {
        eduCode: this.userInfo.eduCode,
        jobCode: this.jobCode
      }
      this.userTag = true
    },
    async submit(values) {
      const userCodeList = []
      values.forEach(ele => {
        userCodeList.push(ele.userCode)
      })
      const req = {
        schoolCode: this.userInfo.eduCode,
        jobCode: this.jobCode,
        jobName: this.jobName,
        userCodeList
      }
      try {
        await this.addUserjob(req)
        this.$refs.form.reset()
        this.$message.success('添加成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      } catch (e) {
        this.$refs.form.error()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.role {
  background: #fff;
  height: 100%;
  .top-btn-group {
    background: #f0f2f5;
  }
  .table-total-num {
    cursor: pointer;
  }
  .action {
    div {
      cursor: pointer;
      margin: 4px 20px 0 0;
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
</style>
