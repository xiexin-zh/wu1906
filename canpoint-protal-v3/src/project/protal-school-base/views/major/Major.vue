<template>
  <div class="major page-layout u-fx-ver u-type-white-bg">
    <u-submit-form
      :width="600"
      ref="form"
      @submit="submitForm"
      :title="`${title}专业`"
      v-model="formStatus"
      :form-data="formData"
    ></u-submit-form>
    <u-space direction="vertical" class="layout-padd">
      <u-search-form @search="search" :search-label="searchLabel">
        <div slot="left">
          <u-space>
            <u-button type="primary" icon="plus" @click="add(1)">添加</u-button>
            <u-button type="light" icon="export" @click="add(0)">批量添加</u-button>
          </u-space>
        </div>
      </u-search-form>
      <u-space class="u-fx-ac u-choose-item">
        已选择 {{ chooseList.length }} 项数据
        <u-button
          @click="dels"
          :disabled="chooseList.length === 0"
          type="danger"
          delete
        >批量删除</u-button>
      </u-space>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table
        is-check
        :columns="columns"
        :table-list="subjectList"
        :page-list="pageList"
        v-model="chooseList">
        <template v-slot:actions="action">
          <u-button type="link" @click="add(2, action.record)">编辑</u-button>
          <u-button type="link" delete @click="del(action.record)">删除</u-button>
        </template>
      </u-table>
    </div>
    <u-pagination
      justify="end"
      v-model="pageList"
      :total="total"
      @change="_getMajor"
    ></u-pagination>
  </div>
</template>

<script>
import columns from '../../table-columns/major'
import searchLabel from '../../search-columns/major'
import formDatas from '../../submit-columns/major'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Major',
  data() {
    return {
      columns,
      formData: [],
      formStatus: false,
      title: '添加',
      subjectList: [],
      type: 0,
      searchLabel,
      pageList: {
        page: 1,
        size: 20
      },
      chooseList: [],
      searchList: {},
      total: 0
    }
  },
  computed: {
    ...mapState('home', ['loginInfo'])
  },
  mounted() {
    this._getMajor()
  },
  methods: {
    ...mapActions('home', ['addMajor', 'updateMajor', 'getMajor', 'delMajor', 'delMajors', 'addMajors']),
    async _getMajor() {
      this.searchList.schoolCode = this.loginInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getMajor(this.searchList)
      this.subjectList = res.data.records.map(el => {
        return {
          ...el,
          id: el.majorCode
        }
      })
      this.total = res.data.total
    },
    add(type, record) {
      console.log('type', type)
      this.type = type
      this.title = type === 0 ? '批量添加' : type === 1 ? '添加' : '编辑'
      const autoForm = type ? formDatas.formData : formDatas.formDatas
      this.formData = type === 2 ? this.$tools.fillForm(autoForm, record) : autoForm
      this.majorCode = type === 2 ? record.majorCode : undefined
       this.formStatus = true
    },
    searchForm(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.subjectName = values.subjectName
      this._getMajor(this.searchList)
    },
    // 列表搜索
    search(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList = Object.assign(this.searchList, values)
      this._getMajor()
    },
    async submitForm(values) {
      values.schoolCode = this.loginInfo.schoolCode
      values.majorCode = this.type === 2 ? this.majorCode : undefined
      values.majorNameList = this.type === 0 ? (values.majorNameList.split('\n')) : undefined
      try {
        const res = this.type === 2 ? await this.updateMajor(values) : this.type === 1 ? await this.addMajor(values) : await this.addMajors(values)
        if (this.type === 0 && res.data.failClassList.length > 0) {
          this.$message.warning(`${res.data.failClassList.join(',')}导入失败，检查是否重名`)
        } else {
          this.$message.success(`${this.title}成功`)
        }
        this.$tools.goNext(() => {
          this._getMajor()
          this.$refs.form.reset()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    // 删除员工-单个
    del(record) {
      const req = {
        majorCode: record.majorCode
      }
      this.deleteUser(1, req)
    },
    // 批量删除
    async dels() {
      this.deleteUser(0, this.chooseList)
    },
    // 删除用户
    async deleteUser(type, req) {
      type ? await this.delMajor(req) : await this.delMajors(req)
      this.$tools.message('success', '删除成功')
      this.$tools.goNext(this._getMajor)
      if (!type) {
        this.chooseList = []
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
