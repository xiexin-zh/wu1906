<template>
  <div class="stu-detail page-layout u-fx-ver u-type-white-bg">
    <u-submit-form
      ref="form"
      @submit="submitForm"
      :title="`${title}家长`"
      v-model="formStatus"
      :form-data="formData"
    ></u-submit-form>
    <u-space direction="vertical" class="layout-padd">
      <u-detail-show :detail-info="detailInfo" title="基本信息"></u-detail-show>
    </u-space>
    <u-tabs @change="showList" v-model="activeTab" :tab-list="tabList"></u-tabs>
    <div class="u-fx-f1 u-fx-ver">
      <u-space class="layout-padd" v-if="activeTab === '1'">
        <u-button icon="plus" @click="add(0)" type="primary">添加家长</u-button>
      </u-space>
      <u-table
        :page-list="pageList"
        :columns="columns"
        :table-list="infoList"
      >
        <template slot="customTitle">
          <span title="默认该学生注册的第一个家长是主要家长，主要家长有权限管理其他家长">
            主要家长
            <a-icon type="question-circle" />
          </span>
        </template>
        <template v-slot:slotTwo="slotTwo">
          <div>
            <a-switch
              :disabled="slotTwo.record.hasMainParent"
              @click.native.stop
              @change="changeMain($event, slotTwo.record)"
              v-model="slotTwo.record.hasMainParent"
            />
          </div>
        </template>
        <template v-slot:actions="action">
          <u-button type="link" @click="add('1', action.record)">编辑 </u-button>
          <u-button type="link" delete @click="del(action.record)"> 删除</u-button>
        </template>
      </u-table>
      <div class="u-type-white-bg">
        <u-pagination
          justify="end"
          v-model="pageList"
          :total="total"
          @change="showList"
        ></u-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getDataState } from '@u/libs/data-state'
import { mapState, mapActions } from 'vuex'
import formData from '../../submit-columns/student'
import columns from '../../table-columns/studentDetail'
export default {
  name: 'StuDetail',
  data() {
    return {
      columns,
      tabList: [
        {
          key: '1',
          title: '学生家长'
        }
      ],
      formData,
      formStatus: false,
      parentsList: [],
      status: '1',
      tabValue: '1',
      title: '添加',
      detailInfo: {},
      activeTab: '1',
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      infoList: []
    }
  },
  computed: {
    ...mapState('home', ['loginInfo'])
  },
  mounted() {
    this.schoolType = this.loginInfo.schoolType === '8' || this.loginInfo.schoolType === '9'
    this.userCode = this.$route.query.code
    this.schoolCode = this.$route.query.schoolCode
    this.schoolYearCode = this.$route.query.schoolYearCode
    this.gradeCode = this.$route.query.gradeCode
    this._getStuDetail()
  },
  methods: {
    ...mapActions('home', [
      'getStuDetail',
      'addStuParent',
      'delStuParent',
      'getStuParent',
      'updateStuParent',
      'updateMainParent'
    ]),
    async _getStuDetail() {
      const req = {
        schoolCode: this.schoolCode,
        schoolYearCode: this.schoolYearCode,
        gradeCode: this.gradeCode,
        userCode: this.userCode
      }
      const res = await this.getStuDetail(req)
      this.childCode = res.data.userCode
      const string = this.schoolType ? '年级' : '入学年份'
      this.detailInfo = {
        '姓名': res.data.userName,
        '性别': getDataState('sex', res.data.gender),
        '学号': res.data.workNo,
        [string]: '',
        '班级': res.data.gradeName + res.data.majorName + res.data.className,
        '走住读': res.data.hasDorm ? '住读' : '走读',
        '卡号': res.data.cardNo,
        '备注': res.data.introduce,
        '照片': `img=${res.data.photoUrl}`
      }
      this.detailInfo[string] = this.schoolType ? res.data.gradeName : res.data.admissionYear
      await this.showList()
    },
    async showList() {
      this.pageList.page = 1
      this.pageList.size = 20
      const req = {
        userCode: this.userCode,
        schoolCode: this.schoolCode,
        childCode: this.userCode,
        ...this.pageList
      }
      const res = await this.getStuParent(req)
      this.infoList = res.data.records
      this.total = res.data.total
    },
    // 家长的添加和编辑弹框
    add(type, record) {
      if (type) {
        this.listId = record.id
        record.parentPhone = record.parentMobile
        this.formData = this.$tools.fillForm(formData, record)
        this.title = '编辑'
      } else {
        this.title = '添加'
        this.formData = this.$tools.fillForm(formData, {})
      }
      this.formStatus = true
    },
    // 更改主要家长
    changeMain(value, e) {
      const req = {
        hasMainParent: true,
        id: e.id
      }
      this.updateMainParent(req).then(res => {
        this.$message.success('设置成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    },
    // 家长操作的提交
    async submitForm(values) {
      try {
        const req = {
          ...values,
          schoolCode: this.schoolCode,
          childCode: this.userCode
        }
        if (this.title === '编辑') {
          req.id = this.listId
        }
        this.title === '编辑' ? await this.updateStuParent(req) : await this.addStuParent(req)
        this.formStatus = false
        this.$message.success(`${this.title}成功`)
        this.$tools.goNext(() => {
          this.showList()
          this.$refs.form.reset()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    // 删除家长
    async del(record) {
      await this.delStuParent({ id: record.id })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
