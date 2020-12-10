<template>
  <div class="instrument-add page-layout bg-fff qui-fx-ver">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :query="query"
      :form-data="formData.formData3"
    >
      <div slot="upload">
        <upload-multi :length="1" v-model="fileList" :fileInfo="fileInfo"></upload-multi>
      </div>
    </submit-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SubmitForm from '../../component/SubmitForm'
import UploadMulti from '@c/UploadMulti'
import formData from '../../assets/js/table/formData'
export default {
  name: 'InstrumentAdd',
  components: {
    SubmitForm,
    UploadMulti
  },
  data() {
    return {
      formData,
      fileInfo: {
        tip: '上传图标',
        h: 120, // 高度
        w: 120 // 宽度
      },
      fileList: [],
      detailId: '',
      query: {
        name: 'instrumentArchive'
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.detailId = this.$route.query.id
    if (this.detailId) {
      this.showDetail(this.detailId)
    }
  },
  methods: {
    ...mapActions('home', ['addOtherArchive', 'updateOtherArchive', 'otherArchivesDetail']),
    async showDetail() {
      const res = await this.otherArchivesDetail(this.detailId)
      res.data.validDate = this.$tools.getDate(res.data.validDate)
      res.data.buyDate = this.$tools.getDate(res.data.buyDate)
      this.formData.formData3 = this.$tools.fillForm(formData.formData3, res.data)
      this.fileList = [{ url: res.data.photoUrl }]
    },
    async submitForm(values) {
      if (this.fileList.length === 0) {
        this.$message.warning('请上传图片')
        this.$refs.form.error()
        return false
      }
      try {
        const req = {
          ...values,
          photoUrl: this.fileList[0].url,
          deviceType: this.deviceType,
          schoolCode: this.userInfo.schoolCode,
          type: '2'
        }
        if (!this.detailId) {
          await this.addOtherArchive(req)
        } else {
          req.id = this.detailId
          await this.updateOtherArchive(req)
        }
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.$refs.form.reset()
          this.$router.go(-1)
        })
      } catch {
        this.$refs.form.reset()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.instrument-add {
  padding: 20px;
}
</style>
