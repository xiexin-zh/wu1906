<template>
  <div class="u-org-menu u-fx-f1" id="tableList">
    <div class="u-pos-box u-scroll-y">
      <u-modal
        cancelText="关闭"
        :isOk="false"
        v-if="visible"
        @confirm="visible = false"
        :width="800"
        title="成员人数"
        v-model="visible"
        closable
      >
        <u-search-form :search-label="searchLabel" @search="search"></u-search-form>
        <div style="height: 500px" class="u-fx">
          <u-table :page-list="pageList" :columns="userColumns" :table-list="userList">
            <template v-slot:slotOne="slotOne">
              <u-type>
                {{
                  getDataState('hasJob', slotOne.record.hasJob)
                }}
              </u-type>
            </template>
          </u-table>
        </div>
        <u-pagination :total="total" v-model="pageList" @change="showUserList"></u-pagination>
      </u-modal>
      <u-choose-teacher
        is-radio
        ref="chooseForm"
        v-if="userTag"
        v-model="userTag"
        :bindList="bindList"
        @submit="chooseTeacher"
        :schoolCode="schoolCode"
        title="添加部门主管"
        allowEmpty
      ></u-choose-teacher>
      <u-submit-form
        ref="form"
        :width="600"
        @submit="sumbitOrg"
        :title="title + '组织机构'"
        v-model="formStatus"
        :form-data="formData"
      ></u-submit-form>
      <u-empty v-if="noData" style="padding-top: 100px" description="暂无组织机构~~">
        <u-button type="light" icon="plus" @click="addOrg(false, {})">添加机构</u-button>
      </u-empty>
      <a-table
        v-if="orgData.length !== 0"
        :defaultExpandAllRows="autoDown"
        :pagination="false"
        :columns="columns"
        :dataSource="orgData"
        style="background-color: #fff"
        :rowKey="record => record.id"
      >
        <template slot="other" slot-scope="text, other">
          <u-table-action
            @button="addTeacher(other.id, other)"
            @action="addTeacher(other.id, other)"
            buttonValue="绑定"
            iconTip="绑定解绑"
            icon="edit"
            :label="other.dutyUserName"
          ></u-table-action>
        </template>
        <template slot="other1" slot-scope="other1">
          <u-tag type="primary-bd" pointer @change="showUser(other1.id)">{{ other1.count }}</u-tag>
        </template>
        <template slot="actions" slot-scope="actions">
          <u-space>
            <u-button type="link" @click="addOrg(false, actions)">添加子级</u-button>
            <u-button type="link" @click="addOrg(true, actions)">编辑</u-button>
            <u-button v-if="actions.parentId" type="link" delete @click="delOrg(actions.id)">删除</u-button>
          </u-space>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import { getDataState } from '@u/libs/data-state'
import $http from '@u/libs/ajax-serve'
const searchLabel = [
  {
    value: 'userName', // 表单属性
    type: 'input', // 表单类型
    label: '姓名', // 表单label值
    placeholder: '请输入' // 表单默认值(非必选字段)
  },
  {
    value: 'mobile', // 表单属性
    type: 'input', // 表单类型
    label: '手机号', // 表单label值
    placeholder: '请输入' // 表单默认值(非必选字段)
  }
]
const userColumns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '30%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '30%'
  },
  {
    title: '状态',
    width: '20%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  }
]
const formData = [
  {
    value: 'orgName',
    initValue: '',
    type: 'input',
    label: '机构名称',
    placeholder: '请输入组织机构名称'
  }
]
const columns = [
  {
    title: '名称',
    dataIndex: 'orgName',
    width: '25%'
  },
  {
    title: '主管',
    dataIndex: 'dutyUserName',
    width: '25%',
    scopedSlots: { customRender: 'other' }
  },
  {
    title: '成员人数',
    width: '20%',
    scopedSlots: { customRender: 'other1' }
  },
  {
    title: '操作',
    width: '30%',
    scopedSlots: { customRender: 'actions' }
  }
]

export default {
  name: 'UOrgMneu',
  props: {
    // 判断是局端(edu)还是校端(school)
    type: {
      type: String,
      required: true
    },
    // 学校code
    schoolCode: {
      type: String,
      required: true,
      default: ''
    },
    // 是否对主管进行绑定和解绑操作
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      getDataState,
      pageList: {
        page: 1,
        size: 20
      },
      userList: [],
      searchLabel,
      visible: false,
      noData: true,
      autoDown: true,
      title: '',
      orgData: [],
      columns,
      userColumns,
      formData,
      formStatus: false,
      userTag: false,
      total: 0,
      bindList: []
    }
  },
  async mounted() {
    this.showList()
  },
  methods: {
    async showList() {
      const res = await $http.get({
        url: `/protal_v3_11101/canpointOrg/tree`,
        params: {
          schoolCode: this.schoolCode
        }
      })
      if (res.data === null) {
        this.noData = true
        this.orgData = []
        return
      } else {
        this.noData = false
      }
      this.orgData = this.newOrgData([res.data])
    },
    // 添加或编辑组织机构
    async addOrg(type, record) {
      this.isEdit = type
      this.parentId = record.id || ''
      this.title = type ? '编辑' : '添加'
      this.formStatus = true
      this.formData = type ? this.$tools.fillForm(formData, record) : formData
    },
    // 提交组织机构
    async sumbitOrg(values) {
      try {
        if (this.isEdit) {
          // 编辑
          await $http.post({
            url: `/protal_v3_11101/canpointOrg/modify`,
            params: {
              orgName: values.orgName,
              id: this.parentId
            }
          })
        } else {
          // 新增
          await $http.post({
            url: `/protal_v3_11101/canpointOrg/add`,
            params: {
              orgName: values.orgName,
              parentId: this.parentId,
              schoolCode: this.schoolCode
            }
          })
        }
        this.$message.success(`${this.title}成功`)
        this.$refs.form.reset()
        this.$tools.goNext(() => {
          this.showList()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    // 查询部门人员
    showUser(id) {
      this._id = id
      this.visible = true
      this.showUserList()
    },
    async showUserList(searchObj = {}) {
      const res = await $http.post({
        url: `/protal_v3_11101/canpointOrg/query/user`,
        params: {
          ...this.pageList,
          id: this._id,
          ...searchObj
        }
      })
      this.userList = res.data.records
      this.total = res.data.total
    },
    change() {
      this.showUser()
    },
    // 深层递归处理数据
    newOrgData(data) {
      data.forEach(item => {
        item.children = item.children || null
        if (item.children && item.children.length > 0) {
          this.newOrgData(item.children)
        }
      })
      return data
    },
    async delOrg(id) {
      await $http.delQuery({
        url: `/protal_v3_11101/canpointOrg/delete`,
        params: {
          id
        }
      })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    submitForm() {},
    // 绑定主管
    async addTeacher(id, item) {
      this.id = id
      this.userTag = true
      if (item.dutyUserCode) {
        this.bindList = [
          {
            userCode: item.dutyUserCode,
            userName: item.dutyUserName
          }
        ]
      } else {
        this.bindList = []
      }
    },
    // 编辑添加主管
    async chooseTeacher(value) {
      try {
        await $http.post({
          url: '/protal_v3_11101/canpointOrg/dutyUser/manage',
          params: {
            id: this.id,
            dutyUserCode: value[0] ? value[0].userCode : '',
            dutyUserName: value[0] ? value[0].userName : ''
          }
        })
        this.$message.success('设置成功')
        this.$refs.chooseForm.reset()
        this.$tools.goNext(() => {
          this.showList()
        })
      } catch (err) {
        this.$refs.chooseForm.error()
      }
    },
    // 搜索人员
    search(values) {
      this.showUserList(values)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-table-tbody > tr > td {
  border-bottom: 1px #f5f5f5 solid !important;
}
/deep/ .ant-table-thead > tr > th {
  border-bottom: 1px #eee solid !important;
}
/deep/ .ant-table-row:hover {
  background-color: #f5f5f5 !important;
}
</style>
