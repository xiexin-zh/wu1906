<template>
  <div class="staff page-layout u-fx u-type-white-bg">
    <div class="left-tree u-padd-t5">
      <u-org-post @select="select" :school="schoolCode"></u-org-post>
    </div>
    <div class="u-fx-ver u-fx-f1">
      <u-space direction="vertical" class="layout-padd">
        <u-search-form :search-label="searchStaff" @search="search">
          <div slot="left">
            <u-space>
              <u-button icon="plus" @click="staffAction(0)" type="primary">添加员工</u-button>
            </u-space>
          </div>
          <div slot="right"></div>
        </u-search-form>
        <u-space class="u-fx-ac u-choose-item">
          已选择 {{ chooseList.length }} 项数据
          <u-button
            @click="deleteStaffBatch"
            :disabled="chooseList.length === 0"
            type="danger"
            delete
          >批量删除</u-button>
        </u-space>
      </u-space>
      <div class="u-fx u-fx-f1">
        <u-table
          is-check
          :page-list="pageList"
          :columns="tableStaff"
          :table-list="userList"
          v-model="chooseList"
        >
          <template v-slot:slotOne="slotOne">
            <u-type>
              {{
              getDataState('hasJob', slotOne.record.hasJob)
              }}
            </u-type>
          </template>
          <template v-slot:slotTwo="slotTwo">
            <u-type>
              {{
              getDataState('sex', slotTwo.record.gender)
              }}
            </u-type>
          </template>
          <template v-slot:actions="actions">
            <u-button type="link" @click="staffAction(1, actions.record)">编辑</u-button>
            <u-button type="link" @click="deleteStaffSingle(actions.record)" delete>删除</u-button>
          </template>
        </u-table>
      </div>
      <u-pagination v-model="pageList" :total="total" @change="getList"></u-pagination>
    </div>
    <u-submit-form
      ref="form"
      :title="formTitle + '员工'"
      :formData="submitStaff"
      v-if="formStatus"
      v-model="formStatus"
      @submit="submit"
    ></u-submit-form>
  </div>
</template>

<script>
import baseData from '@u/libs/base-data'
import { mapState, mapActions } from 'vuex'
import { getDataState } from '@u/libs/data-state'
import tableStaff from '../../table-columns/staff'
import searchStaff from '../../search-columns/staff'
import submitStaff from '../../submit-columns/staff'

export default {
  name: 'Staff',
  data() {
    return {
      getDataState,
      formTitle: '',
      tableStaff,
      searchStaff,
      submitStaff,
      formStatus: false,
      chooseList: [],
      pageList: { page: 1, size: 20 },
      userList: [],
      total: 0,
      searchObj: {},
      dutyList: [] // 职务管理
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  async mounted() {
    // 初始化职务数据
    this.dutyList = await baseData.getDutyManageList()
  },
  methods: {
    ...mapActions('home', ['getStaffPage', 'addStaff', 'editStaff', 'delStaffSingle', 'delStaffBatch', 'getAllPost']),
    /**
     * 点击组织树回调
     * @param { object } item 返回的组织机构相关的数据 type=1组织机构  type=2职务
     */
    select(item) {
      this.orgCode = item.type === '1' ? item.code : ''
      this.stationCode = item.type === '1' ? '' : item.code
      this.getList()
    },
    /**
     * 获取员工列表，当组织机构为根目录时，orgCode传空
     */
    async getList() {
      const req = {
        orgCode: this.orgCode === this.schoolCode ? '' : this.orgCode,
        stationCode: this.stationCode || '',
        ...this.searchObj,
        ...this.pageList,
        schoolCode: this.schoolCode
      }
      const res = await this.getStaffPage(req)
      this.userList = res.data.records.map(item => {
        return {
          ...item,
          _id: item.userCode
        }
      })
      this.total = res.data.total
    },
    // 搜索
    search(values) {
      let hasJob = ''
      if (values.hasJob === 1) {
        hasJob = true
      } else if (values.hasJob === 0) {
        hasJob = false
      }
      const req = {
        ...values,
        hasJob
      }
      this.searchObj = req
      this.getList()
    },
    /**
     * 编辑或添加员工逻辑操作
     * @param { number } type 0: 新增 1: 添加
     * @param { object } record 当前项数据
     */
    staffAction(type, record) {
      this.listId = type ? record.id : ''
      this.formTitle = type ? '编辑' : '添加'
      if (type) {
        record.hasJob = record.hasJob ? 1 : 0
        record.orgCode = (record.orgCode + '').split(',')
        record.stationCode = record.stationCodeStr.split(',')
        submitStaff[4].orgName = record.orgName
      }
      submitStaff[5].list = this.dutyList.map(item => {
        return {
          key: item.stationCode,
          val: item.stationName
        }
      })
      this.submitStaff = type ? this.$tools.fillForm(submitStaff, record) : submitStaff
      this.formStatus = true
    },
    /**
     * 编辑或添加员工业务操作
     * @param { object } values 表单数据
     */
    async submit(values) {
      const req = {
        ...values,
        orgCode: values.orgCode.join(','),
        orgName: values.orgName,
        schoolCode: this.schoolCode,
        hasJob: parseInt(values.hasJob) === 1,
        stationCodeList: values.stationCode
      }
      delete req.stationCode
      if (this.listId) req.id = this.listId
      try {
        this.listId ? await this.editStaff(req) : await this.addStaff(req)
        this.$tools.message('success', `${this.formTitle}成功`)
        this.$refs.form.reset(0)
        this.$tools.goNext(this.getList)
      } catch (err) {
        this.$refs.form.error()
      }
    },
    /**
     * 删除单个员工
     * @param { object } record 员工信息
     */
    deleteStaffSingle(record) {
      const req = {
        userCode: record.userCode,
        schoolCode: this.schoolCode
      }
      this.deleteUser(1, req)
    },
    /**
     * 批量删除员工
     */
    async deleteStaffBatch() {
      const req = {
        schoolCode: this.schoolCode,
        userCodeList: this.chooseList
      }
      this.deleteUser(0, req)
    },
    /**
     * 删除员工
     * @param { number } type 1:单个删除 0:批量删除
     */
    async deleteUser(type, req) {
      type ? await this.delStaffSingle(req) : await this.delStaffBatch(req)
      this.$tools.message('success', '删除成功')
      // 批量删除成功后重置选中数据
      this.chooseList = []
      this.$tools.goNext(this.getList)
    }
  }
}
</script>
<style lang="less" scoped></style>
