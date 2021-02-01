<template>
  <div class="bureau page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-search-form :search-label="searchColumns.edu" @search="search">
        <div slot="left">
          <u-space>
            <u-button icon="plus" @click="change(false)" type="primary">添加机构</u-button>
          </u-space>
        </div>
      </u-search-form>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table
        is-zoom
        :page-list="pageList"
        :columns="tableColumns.edu"
        :table-list="schoolList"
        v-model="chooseList"
      >
        <template v-slot:actions="action">
          <u-button type="link" @click="goDetial('/institution/schDetail', action)">详情</u-button>
          <u-button type="link" @click="change(true, action)">编辑</u-button>
          <!-- <u-button type="link" delete @click="del">删除</u-button> -->
        </template>
      </u-table>
    </div>
    <u-pagination justify="end" v-model="pageList" :total="total" @change="_getEdu"></u-pagination>
    <u-submit-form
      ref="form"
      :width="600"
      @submit="submitForm"
      :title="`${title}机构`"
      v-model="formStatus"
      :form-data="submitColumns.edu"
    >
    </u-submit-form>
  </div>
</template>

<script>
import tableColumns from '../../table-columns/tableColumns.js'
import searchColumns from '../../search-columns/searchColumns.js'
import submitColumns from '../../submit-columns/submitColumns.js'
import { mapActions } from 'vuex'
export default {
  name: 'Bureau',
  components: {},
  data() {
    return {
      tableColumns,
      searchColumns,
      submitColumns,
      schoolList: [],
      chooseList: [],
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      total: 0,
      title: '添加',
      disabled: false,
      formStatus: false,
      areaList: [],
      placeholder: '请选择地区',
      appForm: {}
    }
  },
  mounted() {
    this._getEdu()
  },
  methods: {
    ...mapActions('home', ['getEdu', 'addEdu', 'delEdu', 'updateEdu', 'schoolDetail']),
    // 机构列表
    async _getEdu() {
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getEdu(this.searchList)
      this.schoolList = res.data.records
      this.total = res.data.total
    },
    // 机构添加和编辑
    async change(tag, record) {
      if (tag) {
        this.isEdit = true
        const res = await this.schoolDetail({ schoolCode: record.record.schoolCode })
        const data = res.data
        this.appForm = data
        this.submitColumns.edu = this.$tools.fillForm(this.submitColumns.edu, data)
        this.submitColumns.edu[3].initValue = `${data.provinceName}/${data.cityName}/${data.areaName}`
        this.$refs.form.areaList = [data.provinceCode, data.cityCode, data.areaCode]
        this.submitColumns.edu[1].disabled = true
        this.title = '编辑'
        this.disabled = true
      } else {
        this.isEdit = false
        this.appForm = []
        this.title = '新增'
        this.disabled = false
        this.submitColumns.edu = this.$tools.fillForm(this.submitColumns.edu, {})
        this.submitColumns.edu[3].initValue = '请选择地区'
        this.submitColumns.edu[1].disabled = false
      }
      this.formStatus = true
    },
    // 搜索
    search(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.provinceCode = values.areaList[0]
      this.searchList.cityCode = values.areaList[1]
      this.searchList.areaCode = values.areaList[2]
      this.searchList = Object.assign(this.searchList, values)
      this._getEdu()
    },
    // 机构提交
    async submitForm(values) {
      try {
       values.provinceCode = values.areaList[0]
        values.cityCode = values.areaList[1]
        values.areaCode = values.areaList[2]
        const req = {
          ...this.appForm,
          ...values
        }
        this.title === '新增' ? await this.addEdu(req) : await this.updateEdu(req)
        this.formStatus = false
        this.$refs.form.reset()
        this.$message.success(`${this.title}成功`)
        this.$tools.goNext(() => {
          this._getEdu()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    del(record) {
      this.$message.error('不可删除')
    },
    goDetial(path, record) {
      this.$router.push({
        path: path,
        query: {
          id: record.record.schoolCode,
          name: record.record.schoolName,
          type: 'edu'
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
