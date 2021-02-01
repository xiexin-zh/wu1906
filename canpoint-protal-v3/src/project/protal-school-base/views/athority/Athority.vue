<template>
  <div class="athority page-layout u-type-white-bg u-fx-ver">
    <u-space direction="vertical" class="layout-padd">
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
            :label="slotOne.record.userCount || 0"
          ></u-table-action>
        </template>
        <template v-slot:slotTwo="slotTwo">
          <u-tooltip :label="slotTwo.record.remark" :slice="30"></u-tooltip>
        </template>
        <template v-slot:actions="actions">
          <u-button type="link" @click="chooseRole(actions.record.id)">分配权限</u-button>
          <u-button type="link" @click="roleAction(1, actions.record)">编辑</u-button>
          <u-button type="link" delete @click="deleteRoles(actions.record)">删除</u-button>
        </template>
      </u-table>
    </div>
    <u-pagination justify="end" v-model="pageList" :total="total" @change="getList"></u-pagination>
    <u-submit-form
      ref="form"
      :title="formTitle + '角色'"
      :formData="submitRole"
      v-model="formStatus"
      @submit="submit"
    />
    <u-choose-teacher
      is-check
      ref="chooseTeacherRef"
      v-if="chooseStatus"
      :title="chooseTitle"
      :schoolCode="schoolCode"
      v-model="chooseStatus"
      :bindList="bindList"
      allowEmpty
      @submit="submitChoose"
    />
    <accord-power
      v-model="roleTag"
      v-if="roleTag"
      :role-id="roleId"
      app-category-code="1"
      :schoolCode="schoolCode"
    ></accord-power>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AccordPower from '@c/AccordPower'
import tableRole from '../../table-columns/athority'
import searchRole from '../../search-columns/athority'
import submitRole from '../../submit-columns/athority'

export default {
  name: 'Athority',
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
      roleTag: false,
      listId: '',
      roleId: ''
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
    // 获取数据列表
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
    // 列表搜索
    search(values) {
      this.searchObj = values
      this.getList()
    },
    /**
     * 新增或编辑角色
     * @param { number } 0-添加 1-编辑
     */
    roleAction(type, record) {
      this.listId = type ? record.id : ''
      this.formTitle = type ? '编辑' : '添加'
      this.submitRole = type ? this.$tools.fillForm(submitRole, record) : submitRole
      this.formStatus = true
    },
    /**
     * 新增或编辑角色操作
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
     * 添加成员
     * @param { object } record 角色信息
     */
    async addUser(record) {
      this.roleId = record.id
      const req = {
        roleId: record.id,
        schoolCode: this.schoolCode,
        mobile: '',
        page: 1,
        size: 500,
        userName: ''
      }
      const res = await this.getRoleUser(req)
      this.bindList = res.data.records
      this.chooseStatus = true
    },
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
        this.$tools.message('success', '添加成功')
        this.$tools.goNext(this.getList)
      } catch (err) {
        this.$refs.chooseTeacherRef.error()
      }
    },
    /**
     * 删除角色
     * @param { object } record 角色信息
     */
    async deleteRoles(record) {
      if (record.userCount && record.userCount > 0) {
        this.$confirm({
          content: '该角色已授权职工，删除后将清除已分配的权限，确定删除吗？',
          onOk: () => {
            this._deleteRoles(record.id)
          },
          onCancel() {}
        })
      } else {
        this._deleteRoles(record.id)
      }
    },
    async _deleteRoles(id) {
      await this.delRole({ id })
      this.$tools.message('success', '删除成功', 2000)
      this.$tools.goNext(this.getList)
    },
    /**
     * 分配权限
     * @param { number} id 角色id
     */
    chooseRole(id) {
      console.log(id)
      this.roleId = id
      this.roleTag = true
    }
  }
}
</script>
<style lang="less" scoped>
</style>
