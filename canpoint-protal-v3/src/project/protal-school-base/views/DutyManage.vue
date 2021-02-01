<template>
  <div class="duty-list page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-alert message description="您可以在此处快捷给用户批量绑定职务"></u-alert>
      <u-search-form :search-label="searchDuty" @search="search">
        <div slot="left">
          <u-button icon="plus" @click="dutyAction(0)" type="primary">添加职务</u-button>
        </div>
      </u-search-form>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table :page-list="pageList" :columns="tableDuty" :table-list="postList">
        <template v-slot:slotOne="slotOne">
          <u-table-action
            @action="addUser(slotOne.record)"
            buttonValue="新增"
            icon="plus"
            iconTip="新增"
            :label="slotOne.record.userCount || 0"
          ></u-table-action>
        </template>
        <template v-slot:actions="actions">
          <u-button
            type="link"
            @click="dutyAction(1, actions.record)"
            v-if="!actions.record.hasPreinstall"
          >编辑</u-button>
          <u-button
            type="link"
            delete
            @click="deleteDuty(actions.record)"
            v-if="!actions.record.hasPreinstall"
          >删除</u-button>
        </template>
      </u-table>
    </div>
    <div class="u-type-white-bg">
      <u-pagination justify="end" v-model="pageList" :total="total" @change="getList"></u-pagination>
    </div>
    <u-submit-form
      ref="form"
      :title="formTitle + '职务'"
      :formData="submitDuty"
      v-model="formStatus"
      @submit="submit"
    />
    <u-choose-teacher
      is-check
      chooseByDutyTag
      v-if="chooseStatus"
      ref="chooseTeacherRef"
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
import tableDuty from '@a/table-columns/duty'
import searchDuty from '@a/search-columns/duty'
import submitDuty from '@a/submit-columns/duty'

export default {
  name: 'DutyList',
  components: {},
  data() {
    return {
      formTitle: '',
      formStatus: false,
      submitDuty,
      chooseTitle: '添加成员',
      chooseStatus: false,
      bindList: [],
      searchDuty,
      postList: [],
      tableDuty,
      pageList: { page: 1, size: 20 },
      total: 0
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    ...mapActions('home', ['getPostPage', 'addPost', 'editPost', 'delPost', 'getPostUser', 'addPostUser']),
    /**
     * 获取职务列表
     */
    async getList(searchObj = {}) {
      const req = {
        ...searchObj,
        ...this.pageList,
        schoolCode: this.schoolCode
      }
      const res = await this.getPostPage(req)
      this.postList = res.data.records
      this.total = res.data.total
    },
    /**
     * 搜索列表
     * @param { object } values 搜索表单项
     */
    search(values) {
      this.getList(values)
    },
    /**
     * 新增或编辑职务逻辑操作
     * @param { number } type 0: 新增 1：编辑
     */
    dutyAction(type, record) {
      this.listId = type ? record.id : ''
      this.formTitle = type ? '编辑' : '添加'
      this.submitDuty = type ? this.$tools.fillForm(submitDuty, record) : submitDuty
      this.formStatus = true
    },
    /**
     * 新增或编辑职务业务操作
     * @param { object } values 表单项
     */
    async submit(values) {
      const req = {
        ...values,
        schoolCode: this.schoolCode
      }
      if (this.listId) req.id = this.listId
      try {
        this.listId ? await this.editPost(req) : await this.addPost(req)
        this.$refs.form.reset()
        this.$tools.message('success', `${this.formTitle}成功`)
        this.$tools.goNext(this.getList)
      } catch (err) {
        this.$refs.form.error()
      }
    },
    /**
     * 删除职务逻辑操作
     * 删除时先对职务是否绑定用户进行判断提示，没有绑定则直接删除
     * @param { object } record 职务信息
     */
    deleteDuty(record) {
      if (record.userCount && record.userCount > 0) {
        this.$confirm({
          content: '该职务下存在职工，删除后，职工将自动从职务中移除，请谨慎操作？',
          onOk: () => {
            this.deletePost(record.id)
          }
        })
      } else {
        this.deletePost(record.id)
      }
    },
    /**
     * 删除职务业务操作
     * @param { number } id 职务id
     */
    async deletePost(id) {
      await this.delPost({ id })
      this.$tools.message('success', '删除成功')
      this.$tools.goNext(this.getList)
    },
    /**
     * 添加职务成员逻辑操作
     * 添加时先获取绑定的人员进行回选
     * @param { object } record 职务信息
     */
    async addUser(record) {
      this.stationCode = record.stationCode
      const req = {
        schoolCode: this.schoolCode,
        stationCode: this.stationCode
      }
      const res = await this.getPostUser(req)
      this.bindList = res.data
      this.chooseStatus = true
    },
    /**
     * 添加职务成员业务操作
     * @param { array } values 选择的人员列表
     */
    async submitChoose(values) {
      try {
        const req = {
          schoolCode: this.schoolCode,
          stationCode: this.stationCode,
          userCodes: values.map(item => {
            return item.userCode
          })
        }
        await this.addPostUser(req)
        this.$refs.chooseTeacherRef.reset()
        this.$tools.message('success', '添加成功')
        this.$tools.goNext(this.getList)
      } catch (err) {
        this.$refs.chooseTeacherRef.error()
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
