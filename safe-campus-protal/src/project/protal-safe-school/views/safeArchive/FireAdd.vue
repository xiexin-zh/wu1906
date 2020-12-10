<template>
  <div class="fire-add page-layout bg-fff qui-fx-ver">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :query="query"
      :form-data="formList"
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
  name: 'FireAdd',
  components: {
    SubmitForm,
    UploadMulti
  },
  data() {
    return {
      formData,
      deviceType: '1',
      fileInfo: {
        tip: '上传图标',
        h: 120, // 高度
        w: 120 // 宽度
      },
      fileList: [],
      query: {
        name: 'fireArchive',
        query: {
          deviceType: this.deviceType
        }
      },
      detailId: '',
      formList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.deviceType = this.$route.query.deviceType
    this.detailId = this.$route.query.id
    this.query.query.deviceType = this.$route.query.deviceType
    if (this.deviceType === '4') {
      this.formList = formData.formData4
    } else if (this.deviceType === '5') {
      this.formList = formData.formData3
    } else if (this.deviceType === '2') {
      this.formList = formData.formData2
    } else {
      if (this.deviceType === '1') {
        formData.formData1[1].list = [
          {
            key: '手提式泡沫灭火器',
            val: '手提式泡沫灭火器'
          },
          {
            key: '手提式二氧化碳灭火器',
            val: '手提式二氧化碳灭火器'
          },
          {
            key: '手提式干粉灭火器',
            val: '手提式干粉灭火器'
          },
          {
            key: '手提式1211灭火器',
            val: '手提式1211灭火器'
          }
        ]
        formData.formData1[1].initValue = '手提式泡沫灭火器'
        this.formData.formData1[6].label = '灭火器图片'
      } else {
        formData.formData1[1].list = [
          {
            key: '室内消火栓',
            val: '室内消火栓'
          },
          {
            key: '室外消火栓',
            val: '室外消火栓'
          }
        ]
        formData.formData1[1].initValue = '室内消火栓'
        this.formData.formData1[6].label = '消火栓图片'
      }
      this.formList = formData.formData1
    }
    if (this.detailId) {
      this.showDetail(this.detailId)
    }
  },
  methods: {
    ...mapActions('home', ['addFireArchive', 'updateFireArchive', 'addSafeArchive', 'fireArchivesDetail',
      'updateSafeArchive', 'addOtherArchive', 'updateOtherArchive', 'otherArchivesDetail', 'safeArchivesDetail' ]),
    async showDetail() {
      if (this.deviceType === '2') {
        const res = await this.fireArchivesDetail(this.detailId)
        res.data.validDate = this.$tools.getDate(res.data.validDate)
        res.data.buyDate = this.$tools.getDate(res.data.buyDate)
        this.formList = this.$tools.fillForm(formData.formData2, res.data)
        this.fileList = [{ url: res.data.photoUrl }]
      } else if (this.deviceType === '4') {
        const res = await this.safeArchivesDetail(this.detailId)
        res.data.hasFluent = res.data.hasFluent ? res.data.hasFluent : '1'
        res.data.hasFireDoor = res.data.hasFireDoor ? res.data.hasFireDoor : '1'
        this.formList = this.$tools.fillForm(formData.formData4, res.data)
        this.fileList = [{ url: res.data.photoUrl }]
      } else if (this.deviceType === '5') {
        const res = await this.otherArchivesDetail(this.detailId)
        res.data.validDate = this.$tools.getDate(res.data.validDate)
        res.data.buyDate = this.$tools.getDate(res.data.buyDate)
        this.formList = this.$tools.fillForm(formData.formData3, res.data)
        this.fileList = [{ url: res.data.photoUrl }]
      } else {
        const res = await this.fireArchivesDetail(this.detailId)
        res.data.validDate = this.$tools.getDate(res.data.validDate)
        res.data.buyDate = this.$tools.getDate(res.data.buyDate)
        this.formList = this.$tools.fillForm(formData.formData1, res.data)
        this.fileList = [{ url: res.data.photoUrl }]
      }
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
          schoolCode: this.userInfo.schoolCode
        }
        if (!this.detailId) {
          if (this.deviceType === '4') {
            req.hasFireDoor = req.hasFireDoor !== '1'
            req.hasFluent = req.hasFluent !== '1'
            await this.addSafeArchive(req)
          } else if (this.deviceType === '5') {
            req.type = '1'
            await this.addOtherArchive(req)
          } else {
            await this.addFireArchive(req)
          }
        } else {
          req.id = this.detailId
          if (this.deviceType === '4') {
            req.hasFireDoor = req.hasFireDoor !== '1'
            req.hasFluent = req.hasFluent !== '1'
            await this.updateSafeArchive(req)
          } else if (this.deviceType === '5') {
            await this.updateOtherArchive(req)
          } else {
            await this.updateFireArchive(req)
          }
        }
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.$refs.form.reset()
          this.$router.push({
            path: '/fireArchive',
            query: {
              deviceType: this.deviceType
            }
          })
        })
      } catch {
        this.$refs.form.reset()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.fire-add {
  padding: 20px;
}
</style>
