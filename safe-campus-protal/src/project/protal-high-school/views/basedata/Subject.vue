<template>
  <div class="subject page-layout qui-fx">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    ></submit-form>
    <no-data msg="暂无学科" v-if="false">
      <div slot="btn">
        <a-button type="primary" @click="addSubject(0)">
          <a-icon type="plus" />添加学科
        </a-button>
      </div>
    </no-data>
    <div class="qui-fx-ver qui-fx-f1" v-else>
      <div class="qui-fx-je mar-10">
        <a-button type="primary" @click="addSubject(0)">
          <a-icon type="plus" />添加学科
        </a-button>
      </div>
      <table-list :columns="columns" :table-list="subjectList">
        <template v-slot:other1="other1">
          <a-tag color="#87d068" v-if="parseInt(other1.record.enable) === 1">启用</a-tag>
          <a-tag color="#ccc" v-else>禁用</a-tag>
        </template>
        <template v-slot:actions="action">
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="turnOn(action.record.enable, action.record)">
            <template slot="title">确定{{ parseInt(action.record.enable) === 1 ? '禁用' : '启用' }}该学科吗?</template>
            <a-tooltip placement="topLeft" :title="parseInt(action.record.enable) === 1 ? '禁用' : '启用' " >
              <a-button size="small" class="play-action-btn" :icon="parseInt(action.record.enable) === 1 ? 'stop' : 'play-circle'" ></a-button>
            </a-tooltip>
          </a-popconfirm>
          <a-tooltip placement="topLeft" title="教师详情">
            <a-button size="small" class="user-action-btn" icon="team" @click.stop="teacherDeatil(action.record.subjectCode)"></a-button>
          </a-tooltip>
          <a-tooltip v-if="action.record.define === 1" placement="topLeft" title="编辑">
            <a-button
              size="small"
              class="edit-action-btn"
              icon="form"
              @click.stop="addSubject(1, action.record)"
            ></a-button>
          </a-tooltip>
          <a-popconfirm
            v-if="action.record.define === 1"
            placement="left"
            okText="确定"
            cancelText="取消"
            @confirm="deleteList(action.record)"
          >
            <template slot="title">确定删除该学科吗?</template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </table-list>
    </div>
  </div>
</template>

<script>
import editImg from '../../assets/img/database/role/edit.png'
import deleteImg from '../../assets/img/database/role/delete.png'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import NoData from '@c/NoData'
import SubmitForm from '@c/SubmitForm'
const columns = [
  {
    title: '学科编号',
    dataIndex: 'subjectCode',
    width: '10%'
  },
  {
    title: '学科名称',
    dataIndex: 'subjectName',
    width: '10%'
  },
  {
    title: '教师人数',
    dataIndex: 'userNum',
    width: '10%'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '10%'
  },
  {
    title: '学科状态',
    dataIndex: 'status',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
    }
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
    value: 'subjectName',
    initValue: '',
    type: 'input',
    label: '学科名称',
    max: 10,
    placeholder: '请输入学科名称,不超过十个字符'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'input',
    label: '备注',
    required: false,
    placeholder: '请输入备注'
  }
]

export default {
  name: 'Subject',
  components: {
    TableList,
    NoData,
    SubmitForm
  },
  data() {
    return {
      editImg,
      deleteImg,
      columns,
      formData,
      formStatus: false,
      title: '添加学科',
      subjectList: [],
      type: 0,
      id: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.getSubjectList()
  },
  methods: {
    ...mapActions('home', ['addSub', 'editSub', 'getSubById', 'getSubList', 'deleteSub']),
    async getSubjectList() {
      const req = {
        ...this.userInfo
      }
      const res = await this.getSubList(req)
      this.subjectList = res.data
      console.log(this.subjectList)
    },
    addSubject(type, record) {
      this.formStatus = true
      if (type) {
        this.title = '编辑学科'
        this.formData = this.$tools.fillForm(formData, record)
        this.type = 1
        this.id = record.id
      } else {
        this.title = '添加学科'
        this.formData = formData
        this.type = 0
      }
    },
    submitForm(values) {
      console.log(values)
      const req = {
        ...this.userInfo,
        ...values,
        enable: '1'
      }
      if (!this.type) {
        this.addSub(req)
          .then(res => {
            this.$message.success('添加成功')
            this.$tools.goNext(() => {
              this.getSubjectList()
              this.$refs.form.reset()
            })
          })
          .catch(() => {
            this.$refs.form.error()
          })
      } else {
        req.id = this.id
        this.editSub(req)
          .then(res => {
            this.$message.success('编辑成功')
            this.$tools.goNext(() => {
              this.getSubjectList()
              this.$refs.form.reset()
            })
          })
          .catch(() => {
            this.$refs.form.error()
          })
      }
    },
    async turnOn(enable, record) {
      const req = {
        ...this.userInfo,
        id: record.id,
        subjectCode: record.subjectCode,
        subjectName: record.subjectName,
        enable: parseInt(enable) === 0 ? '1' : '0'
      }
      await this.editSub(req)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this.getSubjectList()
      })
    },
    teacherDeatil(subjectCode) {
      this.$router.push({ path: '/basedata/subjectTeacher', query: { subjectCode } })
    },
    async deleteList(record) {
      await this.deleteSub(record.id)
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.getSubjectList()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.subject {
  height: 100%;
  background: #fff;
  .mar-10{
    margin: 10px;
  }
}
</style>
