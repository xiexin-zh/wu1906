<template>
  <div class="role page-layout qui-fx-ver">
    <choose-user type="edu" is-radio ref="form" v-if="userTag" v-model="userTag" @submit="submit" title="选择负责人">
    </choose-user>
    <submit-form ref="form" @submit-form="submitForm" :title="title" v-model="formStatus" :form-data="formData">
    </submit-form>
    <div class="qui-fx qui-fx-ver qui-fx-f1">
      <div class="top-btn-group qui-fx">
        <a-button type="primary" @click="addJob(0)"> <a-icon type="plus" />添加街道</a-button>
      </div>
      <table-list :page-list="pageList" :columns="columns" :table-list="roleList">
        <template v-slot:other1="action">
          <div class="qui-fx">
            <span class="tab-add" v-if="!action.record.responsiblePersonName" @click.stop="addCrew(action.record)">
              <a-tag color="green">添加</a-tag>
            </span>
            <span v-else>
              {{ action.record.responsiblePersonName }}
              <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm.stop="unit(action.record)">
                <template slot="title">
                  您确定解绑吗?
                </template>
                <a-tooltip placement="topLeft" title="解绑">
                  <a-icon class="mouse mar-l10" type="unlock" />
                </a-tooltip>
              </a-popconfirm>
            </span>
          </div>
        </template>
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="编辑">
            <a-button
              size="small"
              class="edit-action-btn"
              icon="form"
              @click.stop="addJob(1, action.record)"
            ></a-button>
          </a-tooltip>
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="deleteJob(action.record.id)">
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
    title: '街道名称',
    dataIndex: 'streetName',
    width: '15%'
  },
  {
    title: '办公点',
    dataIndex: 'office',
    width: '10%'
  },
  {
    title: '街道负责人',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
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
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const formData = [
  {
    value: 'streetName',
    initValue: '',
    type: 'input',
    label: '街道名称',
    placeholder: '请输入街道名称'
  },
  {
    value: 'office',
    initValue: '',
    type: 'input',
    required: false,
    label: '办公地点',
    placeholder: '请输入办公地点'
  }
]

export default {
  name: 'Street',
  components: {
    NoData,
    TableList,
    PageNum,
    SubmitForm,
    ChooseUser
  },
  data() {
    return {
      title: '添加街道',
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
      streetName: '',
      streetCode: '',
      streetId: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },

  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['addStreet', 'delStreet', 'getStreet', 'updateStreet', 'updateManager']),
    async submitForm(values) {
      const req = {
        ...values,
        eduCode: this.userInfo.eduCode,
        eduName: this.userInfo.eduName
      }
      let res
      if (this.type) {
        req.id = this.id
        res = this.updateStreet(req)
      } else {
        res = this.addStreet(req)
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
        this.title = '编辑街道'
        this.type = 1
        this.id = record.id
        this.formData = this.$tools.fillForm(formData, record)
      } else {
        this.type = 0
        this.title = '添加街道'
        this.formData = formData
      }
    },
    async deleteJob(id) {
      await this.delStreet({ id })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    async showList() {
      const req = {
        eduCode: this.userInfo.eduCode,
        pageNum: this.pageList.page,
        pageSize: this.pageList.size
      }
      const res = await this.getStreet(req)
      if (!res.data) {
        this.roleList = []
        return
      }
      this.roleList = res.data.list
      this.total = res.data.total
    },
    addCrew(item) {
      this.streetName = item.streetName
      this.streetCode = item.streetCode
      this.streetId = item.id
      this.userTag = true
    },
    async unit(record) {
      console.log(record)
      const req = {
        eduCode: this.userInfo.eduCode,
        eduName: this.userInfo.eduName,
        streetName: '',
        streetCode: '',
        id: record.id,
        responsiblePersonName: '',
        responsiblePersonCode: ''
      }
      await this.updateManager(req)
      this.$message.success('解绑成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    async submit(values) {
      console.log(values)
      const req = {
        eduCode: this.userInfo.eduCode,
        eduName: this.userInfo.eduName,
        streetName: this.streetName,
        streetCode: this.streetCode,
        id: this.streetId,
        responsiblePersonName: values[0].userName,
        responsiblePersonCode: values[0].userCode
      }
      try {
        await this.updateManager(req)
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
