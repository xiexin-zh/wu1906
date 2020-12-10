<template>
  <div class="qui-fx-f1" id="tableList">
    <org-user-list v-if="orgTag" v-model="orgTag" :org-code="orgCode"></org-user-list>
    <choose-user
      is-radio
      ref="chooseForm"
      v-if="userTag"
      v-model="userTag"
      @submit="chooseTeacher"
      title="添加部门主管"
    >
    </choose-user>
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    >
    </submit-form>
    <a-skeleton
      style="padding: 0 15px;"
      v-if="orgData.length === 0 && !noData"
      active
      :paragraph="{ rows: 10 }"
    />
    <no-data v-if="noData" msg="暂无组织机构~">
      <a-button type="primary" slot="btn" @click="addOrg(false, {})">添加机构</a-button>
    </no-data>
    <a-table
      v-if="orgData.length !== 0"
      :defaultExpandAllRows="autoDown"
      :pagination="false"
      :columns="columns"
      :dataSource="orgData"
      style="background-color: #fff"
      :scroll="{ y: this.$tools.setScroll('tableList') }"
      :rowKey="record => record.id"
    >
      <template slot="other" slot-scope="text, other">
        <div class="qui-fx">
          <span class="tab-add" v-if="!other.dutyPersonName" @click.stop="addCharge(other)">
            <a-tag color="green">添加</a-tag>
          </span>
          <span v-else>
            {{ other.dutyPersonName }}
            <a-popconfirm
              placement="left"
              okText="确定"
              cancelText="取消"
              @confirm.stop="unit(other)"
            >
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
      <template slot="other1" slot-scope="other1">
        <div>
          <a-tag @click="showUser(other1.code)" style="cursor: pointer" color="green">
            {{ other1.personNum }}
          </a-tag>
        </div>
      </template>
      <template slot="actions" slot-scope="actions">
        <a-tooltip placement="topLeft" title="新增子级">
          <a-button
            size="small"
            class="add-action-btn"
            icon="plus"
            @click="addOrg(false, actions)"
          ></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="编辑">
          <a-button
            size="small"
            class="edit-action-btn"
            icon="form"
            @click="addOrg(true, actions)"
          ></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(actions)">
          <template slot="title">
            您确定删除吗?
          </template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button
              v-if="actions.parentId"
              size="small"
              class="del-action-btn"
              icon="delete"
            ></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>
<script>
import ChooseUser from '@c/ChooseUser'
import NoData from './NoData'
import $ajax from '@u/ajax-serve'
import { mapState } from 'vuex'
import hostEnv from '@config/host-env'
import SubmitForm from './SubmitForm'
import OrgUserList from './OrgUserList'
import { Switch, Tooltip } from 'ant-design-vue'
export { default as FormOutline } from '@ant-design/icons/lib/outline/FormOutline'
export { default as DeleteOutline } from '@ant-design/icons/lib/outline/DeleteOutline'
const formData = [
  {
    value: 'name',
    initValue: '',
    type: 'input',
    label: '机构名称',
    placeholder: '请输入组织机构名称'
  },
  {
    value: 'code',
    initValue: '',
    type: 'input',
    label: '机构编码',
    placeholder: '请输入组织机构编码'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'input',
    label: '备注',
    required: false,
    placeholder: '请输入备注'
  }
  // {
  //   value: 'status',
  //   initValue: true,
  //   list: [
  //     {
  //       key: true,
  //       val: '启用'
  //     },
  //     {
  //       key: false,
  //       val: '禁用'
  //     }
  //   ],
  //   type: 'radio',
  //   label: '是否启用',
  //   placeholder: '请选择是否启用'
  // }
]
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    width: '25%'
  },
  // {
  //   title: '状态',
  //   dataIndex: 'valid',
  //   width: '12%',
  //   scopedSlots: { customRender: 'valid' }
  // },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '20%'
  },
  {
    title: '成员人数',
    width: '15%',
    scopedSlots: { customRender: 'other1' }
  },
  // {
  //   title: '创建日期',
  //   dataIndex: 'createTime',
  //   width: '15%',
  //   customRender: text => {
  //     const d = new Date(text)
  //     return (
  //       d.getFullYear() +
  //       '-' +
  //       (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
  //       '-' +
  //       (d.getDate() > 9 ? d.getDate() : '0' + d.getDate())
  //     )
  //   }
  // },
  {
    title: '操作',
    width: '30%',
    scopedSlots: { customRender: 'actions' }
  }
]

export default {
  name: 'OrgManage',
  components: {
    ASwitch: Switch,
    ATooltip: Tooltip,
    SubmitForm,
    NoData,
    ChooseUser,
    OrgUserList
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    school: {
      type: String,
      default: ''
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'eduCode'])
  },
  data() {
    return {
      noData: false,
      autoDown: true,
      title: '组织机构',
      orgData: [],
      columns,
      formData,
      formStatus: false,
      userTag: false,
      record: null,
      code: '',
      orgCode: '',
      orgTag: false
    }
  },
  async mounted() {
    /**
     * @description 获取组织机构根节点
     */
    this.code = this.type === 'edu' ? this.eduCode : this.schoolCode
    if (this.type === 'school') {
      this.columns[1].title = '主管'
      this.columns[1].dataIndex = 'code'
      this.columns[1].scopedSlots = { customRender: 'other' }
    }
    if (this.school) {
      this.code = this.school
    }
    if (this.readOnly) {
      this.columns.splice(3, 1)
    }
    this.showList()
  },
  methods: {
    async showList() {
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_11002}/school/org/getSchoolRoot/${this.code}`
      })
      if (res.data === null || res.data.length === 0) {
        this.noData = true
        return
      } else {
        this.noData = false
      }
      this.orgData = this.newOrgData([res.data])
    },
    // 查询部门人员
    showUser(orgCode) {
      console.log(orgCode)
      this.orgCode = orgCode
      this.orgTag = true
    },
    // 深层递归
    newOrgData(data) {
      data.forEach(item => {
        item.children = item.orgChilds || null
        if (item.orgChilds && item.orgChilds.length > 0) {
          this.newOrgData(item.orgChilds)
        }
      })
      return data
    },
    addOrg(type, record) {
      this.isEdit = type
      this.formStatus = true
      if (type) {
        this.id = record.id
        this.parentId = record.parentId || ''
        this.formData = this.$tools.fillForm(formData, record)
        if (!record.parentId) {
          // this.formData[1].disabled = true
          this.formData.splice(1, 1)
        }
      } else {
        this.formData = formData
        this.parentId = record.id || ''
      }
    },
    async submitForm(values) {
      try {
        const params = {
          schoolCode: this.code,
          valid: 1,
          ...values,
          parentId: this.parentId
        }
        if (this.isEdit) {
          params.id = this.id
          await $ajax.post({
            url: `${hostEnv.protal_api_11002}/school/org/update`,
            params: params
          })
        } else {
          await $ajax.post({
            url: `${hostEnv.protal_api_11002}/school/org/add`,
            params: params
          })
        }
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.$refs.form.reset()
          this.showList()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    async del(record) {
      await $ajax.get({
        url: `${hostEnv.protal_api_11002}/school/org/delete/${record.id}`
      })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    // 编辑添加主管
    addCharge(record) {
      console.log(record)
      this.record = record
      this.userTag = true
    },
    // 解绑
    untie(record) {
      console.log(record)
    },
    // 绑定主管
    async chooseTeacher(value) {
      console.log(value)
      await $ajax.postForm({
        url: `${hostEnv.protal_api_11002}/school/org/savedutyPerson`,
        params: {
          dutyPersonCode: value[0].userCode,
          dutyPersonName: value[0].userName,
          schoolCode: this.schoolCode,
          code: this.record.code
        }
      })
      this.$message.success('添加成功')
      this.$refs.chooseForm.reset()
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    async unit(record) {
      await $ajax.postForm({
        url: `${hostEnv.protal_api_11002}/school/org/savedutyPerson`,
        params: {
          dutyPersonCode: '',
          dutyPersonName: '',
          schoolCode: this.schoolCode,
          code: record.code
        }
      })
      this.$message.success('解绑成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    }
  }
}
</script>
