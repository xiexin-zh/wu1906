<template>
  <div class="athority page-layout u-type-white-bg u-fx-ver">
    <u-space direction="vertical" class="layout-padd">
      <u-alert message description="您可以在此处快捷给用户批量绑定职务"></u-alert>
      <u-search-form :search-label="searchRole" @search="search">
        <div slot="left">
          <u-button icon="plus" @click="roleAction(0)" type="primary">添加角色</u-button>
        </div>
      </u-search-form>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table :page-list="pageList" :columns="tableRole" :table-list="roleList">
        <template v-slot:slotOne="slotOne">
          <u-table-action
            @action="addUser(slotOne.record)"
            icon="plus"
            iconTip="新增"
            :label="slotOne.record.userCount"
          ></u-table-action>
        </template>
        <template v-slot:actions="actions">
          <u-button type="link" @click="_addRole(actions.record.id)">权限分配</u-button>
          <u-button type="link" @click="roleAction(1, actions.record)">编辑</u-button>
          <u-button type="link" delete @click="deleteRoles(actions.record)">删除</u-button>
        </template>
      </u-table>
    </div>
    <u-pagination v-model="pageList" :total="total" @change="getList"></u-pagination>
    <u-submit-form
      ref="form"
      :title="formTitle + '角色'"
      :formData="submitRole"
      v-model="formStatus"
      @submit="submit"
    />
    <accord-power
      v-model="roleTag"
      v-if="roleTag"
      :role-id="roleId"
      plateform-type="1"
      app-category-code="2"
      :schoolCode="schoolCode"
    ></accord-power>
    <u-choose-teacher
      is-check
      allow-empty
      ref="chooseTeacherRef"
      v-if="chooseStatus"
      :title="chooseTitle"
      :schoolCode="schoolCode"
      v-model="chooseStatus"
      :bindList="bindList"
      @submit="submitChoose"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AccordPower from '@c/AccordPower'
import tableRole from '../../table-columns/athority'
import searchRole from '../../search-columns/athority'
import submitRole from '../../submit-columns/athority'

export default {
  name: 'DutyList',
  components: { AccordPower },
  data() {
    return {
      tableRole,
      searchRole,
      submitRole,
      formTitle: '',
      formStatus: false,
      chooseTitle: '授权用户',
      chooseStatus: false,
      bindList: [],
      roleList: [],
      pageList: { page: 1, size: 20 },
      total: 0,
      searchObj: {},
      roleTag: false
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    ...mapActions('home', [
      'getAppBySchool',
      'getAppMenu',
      'addRoleMenu',
      'getRoleMenuList',
      'getRolePage',
      'addRole',
      'editRole',
      'delRole',
      'getRoleUser',
      'addRoleUser'
    ]),
    /**
     * 获取角色列表
     */
    async getList() {
      const req = {
        ...this.searchObj,
        ...this.pageList,
        roleName: this.searchObj.roleName || '',
        schoolCode: this.schoolCode
      }
      const res = await this.getRolePage(req)
      this.roleList = res.data.records
      this.total = res.data.total
    },
    /**
     * 表单搜索
     * @param { object } values 表单项
     */
    search(values) {
      this.searchObj = values
      this.getList()
    },
    /**
     * 新增或编辑角色逻辑操作
     * @param { number } type 0-添加 1-编辑
     */
    roleAction(type, record) {
      this.listId = type ? record.id : ''
      this.formTitle = type ? '编辑' : '添加'
      this.submitRole = type ? this.$tools.fillForm(submitRole, record) : submitRole
      this.formStatus = true
    },
    /**
     * 新增或编辑角色业务操作
     */
    async submit(values) {
      const req = {
        ...values,
        schoolCode: this.schoolCode
      }
      if (this.listId) req.id = this.listId
      try {
        this.listId ? await this.editRole(req) : await this.addRole(req)
        this.$refs.form.reset()
        this.$tools.message('success', `${this.formTitle}成功`)
        this.$tools.goNext(this.getList)
      } catch (err) {
        this.$refs.form.error()
      }
    },
    /**
     * 给角色绑定用户逻辑操作
     * 先获取改角色所绑定的用户进行回选
     * @param { object } record 当前角色信息
     */
    async addUser(record) {
      this.roleId = record.id
      const req = {
        roleId: record.id,
        schoolCode: this.schoolCode,
        mobile: '',
        page: 1,
        size: 1000,
        userName: ''
      }
      const res = await this.getRoleUser(req)
      this.bindList = res.data.records
      this.chooseStatus = true
    },
    /**
     * 给角色绑定用户业务操作
     * @param { array } values 所选择的用户列表, 回选的值中必须包含userCode和userName字段
     */
    async submitChoose(values) {
      try {
        const req = {
          roleId: this.roleId,
          schoolCode: this.schoolCode,
          userCode: values.map(item => {
            return item.userCode
          })
        }
        await this.addRoleUser(req)
        this.$refs.chooseTeacherRef.reset()
        this.$tools.message('success', '授权成功')
        this.$tools.goNext(this.getList)
      } catch (err) {
        this.$refs.chooseTeacherRef.error()
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
          content: '该角色已授权职工，删除后将清除已分配的权限，确定删除吗？',
          onOk: () => {
            this._deleteRoles(record.id)
          }
        })
      } else {
        this._deleteRoles(record.id)
      }
    },
    /**
     * 删除角色业务操作
     * @param { number } id 角色id
     */
    async _deleteRoles(id) {
      await this.delRole({ id })
      this.$tools.message('success', '删除成功')
      this.$tools.goNext(this.getList)
    },
    /**
     * 分配权限
     * @param { number} id 角色id
     */
    _addRole(id) {
      this.roleId = id
      this.roleTag = true
    }
  }
}
</script>
<style lang="less" scoped>
</style>
