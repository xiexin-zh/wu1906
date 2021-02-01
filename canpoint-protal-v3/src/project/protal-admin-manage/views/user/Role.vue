<template>
  <div class="subject-list page-layout u-fx-ver u-type-white-bg">
    <user-list :role-id="roleId" v-if="userTag" v-model="userTag"></user-list>
    <u-space direction="vertical" class="layout-padd">
      <u-search-form :search-label="searchLabel.roleSearchLabel" @search="search">
        <div slot="left">
          <u-space>
            <u-button icon="plus" @click="roleAction(0)" type="primary">添加角色</u-button>
          </u-space>
        </div>
      </u-search-form>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table :page-list="pageList" :columns="columns.roleColumns" :table-list="roleList">
        <template v-slot:slotOne="slotOne">
          <u-tag
            type="primary-bd"
            pointer
            @change="showUser(slotOne.record.id)"
          >{{ slotOne.record.userCount }}</u-tag>
        </template>
        <template v-slot:actions="actions">
          <u-button type="link" @click="addRole(actions.record.id)">权限分配</u-button>
          <u-button type="link" @click="roleAction(1, actions.record)">编辑</u-button>
          <u-button type="link" delete @click="deleteRoles(actions.record)">删除</u-button>
        </template>
      </u-table>
    </div>
    <u-pagination justify="end" v-model="pageList" :total="total" @change="getRoleList"></u-pagination>
    <accord-power
      v-model="roleTag"
      v-if="roleTag"
      :role-id="roleId"
      plateform-type="1"
      app-category-code="3"
      :schoolCode="schoolCode"
    ></accord-power>
    <u-submit-form
      ref="form"
      :title="formTitle"
      :formData="formData"
      v-model="formStatus"
      @submit="submit"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import UserList from '../../component/UserList'
import columns from '../../table-columns/user'
import formData from '../../submit-columns/user'
import searchLabel from '../../search-columns/user'
import AccordPower from '@c/AccordPower'

export default {
  name: 'Role',
  components: { UserList, AccordPower },
  data() {
    return {
      formTitle: '',
      formStatus: false,
      formData: formData.roleFormData,
      searchLabel,
      roleList: [],
      columns,
      chooseList: [],
      pageList: { page: 1, size: 20 },
      total: 0,
      roleId: '',
      roleTag: false,
      userTag: false
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    ...mapActions('home', ['getRoleListApi', 'addRoleApi', 'editRoleApi', 'delRoleApi']),
    /**
     * 获取员工列表
     * @param { object } searchObj 搜索条件
     */
    async getRoleList(searchObj = {}) {
      const req = {
        ...searchObj,
        ...this.pageList,
        schoolCode: this.schoolCode
      }
      const res = await this.getRoleListApi(req)
      this.roleList = res.data.records
      this.total = res.data.total
    },
    /**
     * 搜索
     * @param { object } values 表单对象
     */
    search(values) {
      this.getRoleList(values)
    },
    /**
     * 新增或编辑角色逻辑操作
     * @param { number } type 0: 新增 1: 编辑
     * @param { object } record 员工信息
     */
    roleAction(type, record) {
      this.listId = type ? record.id : ''
      this.formTitle = type ? '编辑' : '添加'
      this.formData = type ? this.$tools.fillForm(formData.roleFormData, record) : formData.roleFormData
      this.formStatus = true
    },
    /**
     * 添加或编辑角色业务操作
     * @param { object } values 表单绑定的数据
     */
    async submit(values) {
      const req = {
        ...values,
        schoolCode: this.schoolCode
      }
      if (this.listId) req.id = this.listId
      try {
        this.listId ? await this.editRoleApi(req) : await this.addRoleApi(req)
        this.$tools.message('success', `${this.formTitle}成功`)
        this.$refs.form.reset()
        this.$tools.goNext(this.getRoleList)
      } catch (err) {
        this.$refs.form.error()
      }
    },
    /**
     * 删除角色逻辑操作
     * 会对角色是否绑定用户进行判断提示，如果没有绑定直接删除
     * @param { object } record 角色信息
     */
    async deleteRoles(record) {
      if (record.userCount && record.userCount > 0) {
        this.$confirm({
          content: '该角色已授权用户，删除后将清除已分配的权限，确定删除吗？',
          onOk: () => {
            this._deleteRoles(record.id)
          }
        })
      } else {
        this._deleteRoles(record.id)
      }
    },
    /**
     * 删除角色
     * @param { number } id 角色id
     */
    async _deleteRoles(id) {
      await this.delRoleApi({
        id
      })
      this.$message.success('删除成功')
      this.$tools.goNext(this.getRoleList)
    },
    /**
     * 显示授权用户数列表
     * @param { number } id 角色id
     */
    showUser(id) {
      this.roleId = id
      this.userTag = true
    },
    /**
     * 权限分配
     * @param { number } id 角色id
     */
    addRole(id) {
      this.roleId = id
      this.roleTag = true
    }
  }
}
</script>
<style lang="less" scoped>
</style>
