<template>
  <div class="subject-list page-layout u-fx-ver">
    <u-space direction="vertical">
      <div class="layout-padd u-type-white-bg">
        <u-search-form :search-label="searchLabel" @search="search">
          <div slot="left">
            <u-space>
              <u-button icon="plus" @click="subjectAction(0)" type="primary">添加学科</u-button>
            </u-space>
          </div>
          <div slot="right"></div>
        </u-search-form>
      </div>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table :page-list="pageList" :columns="columns" :table-list="subjectList">
        <template v-slot:actions="actions">
          <u-button type="link" @click="subjectAction(1, actions.record)">编辑</u-button>
          <u-button type="link" delete @click="deleteSubject(actions.record)">删除</u-button>
        </template>
      </u-table>
    </div>
    <div class="u-type-white-bg">
      <u-pagination justify="end" v-model="pageList" :total="total" @change="getList"></u-pagination>
    </div>
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
import columns from '../../table-columns/subject'
import searchLabel from '../../search-columns/subject'
import formData from '../../submit-columns/subject'

export default {
  name: 'Subject',
  components: {},
  data() {
    return {
      formTitle: '',
      formStatus: false,
      formData,
      searchLabel,
      subjectList: [],
      columns,
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
    ...mapActions('home', ['getSubjectPage', 'addSubject', 'editSubject', 'delSubject']),
    // 获取数据列表
    async getList() {
      const req = {
        ...this.searchObj,
        ...this.pageList,
        schoolCode: this.schoolCode
      }
      const res = await this.getSubjectPage(req)
      this.subjectList = res.data.records
      this.total = res.data.total
    },
    // 列表搜索
    search(values) {
      this.searchObj = values
      this.getList()
    },
    // 添加/编辑学科  0-添加 1-编辑
    subjectAction(type, record) {
      this.listId = type ? record.id : ''
      this.formTitle = type ? '编辑学科' : '添加学科'
      this.formData = type ? this.$tools.fillForm(formData, record) : formData
      this.formStatus = true
    },
    // 添加/编辑学科-提交
    async submit(values) {
      const req = {
        ...values,
        schoolCode: this.schoolCode
      }
      if (this.listId) req.id = this.listId
      try {
        this.listId ? await this.editSubject(req) : await this.addSubject(req)
        this.$message.success('添加成功')
        this.$refs.form.reset()
        this.$tools.goNext(this.getList)
      } catch (err) {
        this.$refs.form.error()
      }
    },
    // 删除学科
    async deleteSubject(record) {
      try {
        await this.delSubject({
          id: record.id
        })
        this.$message.success('删除成功')
        this.$tools.goNext(this.getList)
      } catch (err) {}
    }
  }
}
</script>
<style lang="less" scoped></style>
