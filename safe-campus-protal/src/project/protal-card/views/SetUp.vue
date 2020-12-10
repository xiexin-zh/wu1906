<template>
  <div class="page-layout qui-fx-ver set-up">
    <submit-form ref="form" @submit-form="submitForm" :title="title" v-model="formStatus" :form-data="formData"> </submit-form>
    <div class="qui-fx">
      <div class="mar-r10">学校编码:</div>
      <div class="code"> {{ dataInfo ? dataInfo.schoolCode : '' }} </div>
      <a-button icon="form" class="edit-action-btn mar-l10" @click="add(1)" v-if="dataInfo && dataInfo.schoolCode">编辑</a-button>
      <a-button icon="plus" class="add-btn mar-l10" @click="add(0)" v-else>新增</a-button>
    </div>
    <div class="qui-fx mar-t10">
      <div class="mar-r10">上次同步时间:</div>
      <div class="mar-r10 code"> {{ dataInfo ? dataInfo.updateTime : '' | gmtToDate }} </div>
      <a-button icon="export" class="export-all-btn" @click="sync" v-if="dataInfo && dataInfo.schoolCode">同步数据</a-button>
      <div style="font-size:16px" v-if="show">1小时后可再次同步</div>
    </div>
  </div>
</template>

<script>
import SubmitForm from '@c/SubmitForm'
import { mapState, mapActions } from 'vuex'
const formData = [
  {
    value: 'schoolCode',
    initValue: '',
    type: 'input',
    label: '学校编码',
    placeholder: '请输入学校编码'
  }
]
export default {
  name: 'SetUp',
  components: {
    SubmitForm
  },
  data() {
    return {
      code: '',
      date: this.$tools.getDate(new Date()),
      title: '新增',
      formStatus: false,
      formData,
      dataInfo: {},
      show: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['addSchoolCode', 'getSchoolCode', 'updateSchoolCode', 'syncData']),
    async showList() {
      const res = await this.getSchoolCode()
      this.dataInfo = res.data
      const date = new Date().getTime
      if ((this.dataInfo.updateTime - date) < 60 * 60) {
        this.show = true
      } else {
        this.show = false
      }
    },
    add(type) {
      if (type) {
        this.title = '编辑'
        this.formData = this.$tools.fillForm(formData, this.dataInfo)
      } else {
        this.title = '新增'
      }
      this.formStatus = true
    },
    async sync() {
      await this.syncData({})
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    submitForm(values) {
      let res = null
      if (this.title === '编辑') {
        values.id = this.dataInfo.id
        res = this.updateSchoolCode(values)
      } else {
        res = this.addSchoolCode(values)
      }
      res.then(() => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.showList()
          this.$refs.form.reset()
        })
      }).catch(() => {
        this.$refs.form.error()
      })
    },
    searchForm(values) {
      this.rangeTime = values.rangeTime
      this.showCount()
    }
  }
}
</script>
<style lang="less" scoped>
  .set-up {
    padding: 100px;
     font-size: 18px;
    .code{
      font-weight: bold;
    }
  }

</style>
