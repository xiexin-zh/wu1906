<template>
  <div class="user-list page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-search-form :search-label="searchLabel.userSearchLabel" @search="search">
        <div slot="left">
          <u-space>
            <u-button icon="plus" @click="userAction(0)" type="primary">添加员工</u-button>
          </u-space>
        </div>
      </u-search-form>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table :page-list="pageList" :columns="columns.userColumns" :table-list="userList">
        <template v-slot:slotOne="slotOne">
          <u-tag type="primary">{{ getRoleName(slotOne.record.roleId) }}</u-tag>
        </template>
        <template v-slot:actions="actions">
          <u-button type="link" @click="userAction(1, actions.record)">编辑</u-button>
          <u-button type="link" delete @click="deleteUser(actions.record.id)">删除</u-button>
        </template>
      </u-table>
    </div>
    <u-pagination justify="end" v-model="pageList" :total="total" @change="getUserList"></u-pagination>
    <u-submit-form
      ref="form"
      :title="formTitle + '员工'"
      :formData="formData"
      v-model="formStatus"
      @submit="submit"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import UserList from '../../component/UserList'
import baseData from '@u/libs/base-data'
import columns from '../../table-columns/user'
import searchLabel from '../../search-columns/user'
import formData from '../../submit-columns/user'

export default {
  name: 'User',
  components: { UserList },
  data() {
    return {
      baseData,
      formTitle: '',
      formStatus: false,
      columns,
      formData: formData.userFormData,
      searchLabel,
      userList: [],
      roleList: [],
      pageList: { page: 1, size: 20 },
      total: 0
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  async mounted() {
    // 初始化角色列表
    this.roleList = await baseData.getAdminRoleList()
    this.getUserList()
  },
  methods: {
    ...mapActions('home', ['getUserListApi', 'addUserApi', 'delUserApi', 'editUserApi']),
    /**
     * 获取员工列表
     * @param { object } searchObj 搜索条件
     */
    async getUserList(searchObj = {}) {
      const req = {
        ...this.pageList,
        ...searchObj,
        schoolCode: this.schoolCode
      }
      const res = await this.getUserListApi(req)
      this.userList = res.data.records
      this.total = res.data.total
    },
    /**
     * 获取角色名称
     */
    getRoleName(id) {
      if (id === 0) {
        return '超级管理员'
      }
      return this.roleList.filter(item => item.id === id)[0].roleName
    },
    /**
     * 搜索
     * @param { object } values 表单对象
     */
    search(values) {
      this.getUserList(values)
    },
    /**
     * 新增或编辑员工逻辑操作
     * @param { number } type 0: 新增 1: 编辑
     * @param { object } record 员工信息
     */
    async userAction(type, record) {
      this.listId = type ? record.id : ''
      this.formTitle = type ? '编辑' : '添加'
      formData.userFormData[2].list = this.roleList.map(item => {
        return {
          key: item.id,
          val: item.roleName
        }
      })
      this.formData = type ? this.$tools.fillForm(formData.userFormData, record) : formData.userFormData
      this.formStatus = true
    },
    /**
     * 添加或编辑员工业务操作
     * @param { object } values 表单绑定的数据
     */
    async submit(values) {
      const req = {
        ...values,
        schoolCode: this.schoolCode
      }
      if (this.listId) {
        req.id = this.listId
      }
      try {
        this.listId ? await this.editUserApi(req) : await this.addUserApi(req)
        this.$message.success(`${this.formTitle}成功`)
        this.$refs.form.reset()
        this.$tools.goNext(this.getUserList)
      } catch (err) {
        this.$refs.form.error()
      }
    },
    /**
     * 删除员工
     * @param { number } id 员工id
     */
    async deleteUser(id) {
      await this.delUserApi({
        id
      })
      this.$tools.message('success', '删除成功')
      this.$tools.goNext(this.getUserList)
    }
  }
}
</script>
<style lang="less" scoped></style>
