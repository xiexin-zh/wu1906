<template>
  <div>
    <a-modal
      :title="title"
      :visible="bindVisible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :maskClosable="false"
      :destroyOnClose="true"
      wrapClassName="role-dialog"
      width="940px"
    >
      <div class="role-wrapper">
        <div class="role-left">
          <org-tree :scene="2" ref="orgTree" :isDefaultSelect="true" :tableHeight="tableHeight" @tree-click="handleTreeClick"></org-tree>
        </div>
        <div class="role-right qui-fx-ver">
          <search-form @search-form="getUsers" :search-label="searchLabel" style="margin:0 0 15px 0;">
            <div slot="left"></div>
            <div slot="right"></div>
          </search-form>
          <div class="wrap-table qui-fx-f1">
            <a-table
              :columns="columns"
              :dataSource="userList"
              :rowKey="(record, index) => index"
              :pagination="false"
              :loading="loading"
              :customRow="setRow"
              :rowClassName="setRowClassName"
              :rowSelection="{type: 'radio',selectedRowKeys: userSelectedRowKeys,
                              onChange: userTableChange,getCheckboxProps:handleCheckBoxChange}"
              :scroll="{ y: tableHeight - 190 }"
              :style="{height: tableHeight - 200 + 'px'}"
            >
              <template slot="number" slot-scope="text, record, index">
                <span>{{ (searchForm.page - 1) * (searchForm.size) + (index + 1) }}</span>
              </template>
            </a-table>
          </div>
          <page-num :total="userTotal" v-model="searchForm" @change-page="changePage"></page-num>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import OrgTree from './OrgTree'
import mixins from '@u/mixins'
import PageNum from './common/PageNum'
import SearchForm from './common/SearchForm'
const columns = [{
  title: '序号',
  dataIndex: 'index',
  width: '70px',
  align: 'center',
  scopedSlots: {
    customRender: 'number'
  }
}, {
  title: '姓名',
  dataIndex: 'name',
  width: '150px'
}, {
  title: '账号',
  dataIndex: 'account',
  width: '100px'
}, {
  title: '性别',
  dataIndex: 'sex',
  width: '100px',
  customRender: (value) => {
    return value === '1' ? '男' : '女'
  }
}, {
  title: '工号',
  dataIndex: 'schoolNumber',
  width: '100px'
}]

export default {
  name: 'AddRole',
  mixins: [mixins],
  components: {
    OrgTree,
    PageNum,
    SearchForm
  },
  props: {
    filterUserIds: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    filterUserIds (val) {
      this.filterTableData(val)
    },
    bindVisible (val) {
      // console.log(val)
      if (val) {
        this.$nextTick(() => {
          this.$refs.orgTree.getSchoolInfo()
        })
      }
    }
  },
  data () {
    return {
      bindVisible: false,
      roleConfirmLoading: false,
      roleTitle: '角色绑定',
      userList: [],
      rawUserList: [],
      pagination: {},
      loading: false,
      columns,
      form: this.$form.createForm(this),
      currentActiveRow: {},
      currentActiveRoleRow: {},
      userTotal: 0,
      userPagesize: 20,
      userSelectedRowKeys: [0],
      tableHeight: 0,
      userPage: 1,
      activeLevelCode: '',
      searchForm: {
        page: 1,
        size: 20,
        start: 0,
        typeCode: '2',
        schoolName: '',
        schoolScheme: ''
      },
      searchLabel: [
        {
          value: 'name',
          type: 'input',
          label: '职工姓名',
          placeholder: '请输入职工姓名'
        }],
      confirmLoading: false,
      title: '角色绑定',
      selectedKeys: [],
      selectedRows: []
    }
  },
  computed: {
    ...mapState('home', [
      'userInfo'
    ])
  },
  methods: {
    ...mapActions('orgTree', ['getUserInfoList']),
    changePage () {
      this.searchForm.typeCode = '2'
      this.searchForm.levelCode = this.activeLevelCode
      this.getUsers()
    },
    handleOk () {
      if (!this.currentActiveRow.hasOwnProperty('id')) {
        this.$message.warning('请选择绑定人员！')
        return false
      }
      this.roleConfirmLoading = true
      this.$emit('getTeacherInfo', this.currentActiveRow)
      this.roleConfirmLoading = false
      this.bindVisible = false
    },
    /**
     * 处理下已绑定的禁止选择
     */
    handleCheckBoxChange (record) {
      return ({
        props: {
          disabled: this.filterUserIds.indexOf(record.id) !== -1 // Column configuration not to be checked
        }
      })
    },
    userTableChange (selectedRowKeys, selectedRows) {
      this.userSelectedRowKeys = selectedRowKeys
      // this.roleSelectedRows = selectedRows
      this.currentActiveRow = selectedRows[0]
    },
    setRowClassName (record, index) {
      return record.id === this.currentActiveRow.id ? 'active' : ''
    },
    setRow (record, index) {
      return {
        on: {
          click: () => {
            if (this.filterUserIds.indexOf(record.id) === -1) {
              this.currentActiveRow = record
              this.userSelectedRowKeys = [index]
            }
          }
        }
      }
    },
    handleCancel () {
      this.bindVisible = false
      this.currentActiveRow = {}
    },
    handleTreeClick (levelCode) {
      this.activeLevelCode = levelCode
      this.getUsers({ 'levelCode': levelCode })
    },
    handlequery () {
      this.getUsers(this.form.getFieldsValue())
    },
    reloadData (row) {
      this.roleConfirmLoading = false
      this.currentActiveRoleRow = row
      this.userSelectedRowKeys = []
    },
    getUsers (param) {
      this.loading = true
      this.searchForm.schoolName = sessionStorage.getItem('schoolName')
      this.searchForm.schoolScheme = sessionStorage.getItem('schoolScheme')
      const params = Object.assign({}, this.searchForm, param || {})
      this.getUserInfoList(params).then(res => {
        this.loading = false
        this.userList = res.data.list
        this.rawUserList = res.data.list
        // this.filterTableData(this.filterUserIds)
        this.userTotal = res.data.total
        this.currentActiveRow = this.userList[0]
      }).catch(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    this.tableHeight = document.querySelector('#app').offsetHeight - 450
  }
}
</script>
<style scoped>
.role-dialog .role-wrapper >>> .ant-table-tbody .ant-table-row.active{
  background-color: #eef6ff;
}
</style>
<style lang="less" scoped>
.role-dialog{
  .role-wrapper{
    display: flex;
    .role-left{
       border: 1px solid #eee;
       margin-right: 12px;
      //  width: 220px;
       overflow: auto;
    }
    .role-right{
       border: 1px solid #eee;
       padding-top: -15px;
       margin-left: 10px;
    }
  }
}
.pagination-com {
    padding: 0
  }
</style>
