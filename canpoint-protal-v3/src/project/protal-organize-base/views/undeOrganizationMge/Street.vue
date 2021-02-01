<template>
  <div class="Street-list page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-search-form :search-label="searchStreet" @search="search">
        <div slot="left">
          <u-button icon="plus" @click="_addStreet(0)" type="primary">添加街道</u-button>
        </div>
      </u-search-form>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table :page-list="pageList" :columns="tableStreet" :table-list="recordList">
        <template v-slot:slotOne="slotOne">
          <u-table-action
            @button="addLeader(0,slotOne.record)"
            @action="addLeader(1,slotOne.record)"
            buttonValue="绑定"
            iconTip="更换解绑"
            icon="edit"
            :label="slotOne.record.leaderName"
          ></u-table-action>
        </template>
        <template v-slot:actions="actions">
          <u-button
            type="link"
            @click="_addStreet(1, actions.record)"
          >编辑</u-button>
          <u-button
            type="link"
            delete
            :content="actions.record.groupListDtoList.length?'该街道下存在督办小组，删除后，督办小组将自动解散，确定删除吗？':'确定删除该街道吗'"
            @click="deleteStreet(actions.record)"
          >删除</u-button>
        </template>
      </u-table>
    </div>
    <div class="u-type-white-bg">
      <u-pagination justify="end" v-model="pageList" :total="total" @change="getList"></u-pagination>
    </div>
    <u-submit-form
      ref="form"
      :title="formTitle + '街道'"
      :formData="submitStreet"
      v-model="formStatus"
      @submit="submit"
    />
    <u-choose-teacher
      is-radio
      ref="chooseTeacherRef"
      v-if="showTag"
      :allowEmpty="true"
      v-model="showTag"
      :schoolCode="schoolCode"
      :bindList="bindList"
      @submit="submitLeader"
      :chooseByDutyTag="true"
      title="选择负责人"
    >
    </u-choose-teacher>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { tableStreet } from '../../table-columns/tableColumns'
import { searchStreet } from '../../search-columns/searchColumns'
import { submitStreet } from '../../submit-columns/submitColumns'
export default {
  name: 'StreetList',
  components: {},
  data() {
    return {
      showTag: false, // 选择负责人弹框
      formTitle: '',
      formStatus: false,
      submitStreet,
      chooseStatus: false,
      bindList: [],
      searchStreet,
      recordList: [],
      tableStreet,
      chooseList: [],
      pageList: { page: 1, size: 20 },
      total: 0,
      searchObj: {}
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    ...mapActions('home', ['getStreet', 'addStreet', 'updateStreet', 'delStreet', 'getPostUser', 'addStreetUser', 'updateManager', 'updateLeader']),
    // 获取数据列表
    async getList() {
      const req = {
        ...this.searchObj,
        ...this.pageList,
        eduCode: this.schoolCode
      }
      const res = await this.getStreet(req)
      this.recordList = res.data.records
      this.total = res.data.total
    },
    // 搜索列表
    search(values) {
      this.searchObj = values
      this.getList()
    },
    // 新增街道
    _addStreet(type, record) {
      this.listId = type ? record.id : ''
      this.formTitle = type ? '编辑' : '添加'
      this.submitStreet = type ? this.$tools.fillForm(submitStreet, record) : submitStreet
      this.formStatus = true
    },
    // 新增街道负责人
    addLeader(type, record) {
        this.list = record
        this.bindList = type ? [{ userCode: record.leaderCode, userName: record.leaderName }] : []
        this.showTag = true
    },
    // 绑定负责人提交
    async submitLeader(values) {
      const req = {
        ...this.list,
        leaderCode: values.length ? values[0].userCode : '',
        leaderName: values.length ? values[0].userName : ''
      }
      try {
          await this.updateLeader(req)
          this.$message.success('绑定成功')
          this.$refs.chooseTeacherRef.reset()
          this.$tools.goNext(this.getList)
      } catch { this.$refs.chooseTeacherRef.error() }
    },
    // 街道编辑或提交操作
    async submit(values) {
      const req = {
        ...values,
        eduCode: this.schoolCode
      }
      try {
        this.listId ? await this.updateStreet({ ...req, id: this.listId }) : await this.addStreet(req)
        this.$refs.form.reset()
        this.$tools.message('success', `${this.formTitle}成功`)
        this.$tools.goNext(this.getList)
      } catch (err) {
        this.$refs.form.error()
      }
    },
    // 删除街道
    async deleteStreet(record) {
        try {
          await this.delStreet({ id: record.id })
          this.$tools.message('success', '删除成功')
          this.$tools.goNext(this.getList)
        } catch (err) {}
      }
  }
}
</script>
<style lang="less" scoped>
.Street-list {
  .add-user-btn {
    width: 16px;
    height: 16px;
    margin-left: 8px;
    text-align: center;
    font-size: 12px;
    line-height: 12px;
    border-radius: 50%;
  }
}
</style>
