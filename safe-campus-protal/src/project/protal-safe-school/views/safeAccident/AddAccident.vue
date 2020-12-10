<template>
  <div class="accident-add page-layout bg-fff qui-fx-ver">
    <div class="content pos-box">
      <submit-form ref="form" @submit-form="submitForm" :form-data="formData" @update="update" :query="query">
        <div slot="upload">
          <upload-multi :length="9" v-model="fileList" :fileInfo="fileInfo"></upload-multi>
          <div class="u-type-error">注：限上传9张图片</div>
        </div>
      </submit-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SubmitForm from '../../component/SubmitForm'
import UploadMulti from '@c/UploadMulti'
const formData = [
  {
    value: 'title',
    initValue: '',
    type: 'input',
    label: '事故名称',
    placeholder: '请输入事故名称'
  },
  {
    value: 'happenTime',
    type: 'singleTime',
    label: '事故发生时间'
  },
  {
    value: 'type',
    initValue: [],
    list: [
      {
        key: '1',
        val: '交通事故'
      },
      {
        key: '2',
        val: '踩踏事故'
      },
      {
        key: '3',
        val: '溺水事故'
      },
      {
        key: '4',
        val: '火灾事故'
      },
      {
        key: '5',
        val: '触电事故'
      },
      {
        key: '6',
        val: '校园伤害'
      },
      {
        key: '7',
        val: '其他'
      }
    ],
    type: 'select',
    label: '事故分类',
    placeholder: '请选择事故分类'
  },
  {
    value: 'nature',
    initValue: [],
    list: [
      {
        key: '1',
        val: '责任事故'
      },
      {
        key: '2',
        val: '自然事故'
      },
      {
        key: '3',
        val: '技术事故'
      },
      {
        key: '4',
        val: '其他'
      }
    ],
    type: 'select',
    label: '事故性质',
    placeholder: '请选择事故性质'
  },
  {
    value: 'level',
    initValue: [],
    list: [
      {
        key: '1',
        val: '特大重大事故'
      },
      {
        key: '2',
        val: '重大事故'
      },
      {
        key: '3',
        val: '较大事故'
      },
      {
        key: '4',
        val: '一般事故'
      }
    ],
    type: 'select',
    label: '事故等级',
    placeholder: '请选择事故等级'
  },
  {
    value: 'financialLoss',
    initValue: '',
    type: 'numberInput',
    label: '事故直接经济损失',
    placeholder: '请输入事故直接经济损失',
    min: 0,
    title: '元'
  },
  {
    value: 'deathNum',
    initValue: '',
    type: 'numberInput',
    label: '死亡人数',
    placeholder: '请输入死亡人数',
    min: 0,
    title: '人'
  },
  {
    value: 'injuredNum',
    initValue: '',
    type: 'numberInput',
    label: '受伤人数',
    placeholder: '请输入受伤人数',
    min: 0,
    title: '人'
  },
  {
    value: 'location',
    initValue: '',
    type: 'input',
    label: '事故发生地点',
    max: 30,
    placeholder: '请输入事故发生地点'
  },
  {
    value: 'status',
    initValue: '1',
    list: [
      {
        key: '1',
        val: '新填报'
      },
      {
        key: '2',
        val: '处理中'
      },
      {
        key: '3',
        val: '已结案'
      }
    ],
    type: 'radio',
    label: '事故现状态',
    placeholder: '请选择事故现状态'
  },
  {
    value: 'details',
    initValue: '',
    type: 'textarea',
    label: '事故发生详情',
    placeholder: '请说明详情',
    minRows: 2,
    maxRows: 6,
    max: 600,
    show: true
  },
  {
    type: 'upload',
    label: '事故照片',
    required: false
  },
  {
    value: 'disposeInfo',
    initValue: '',
    type: 'textarea',
    label: '处理信息',
    placeholder: '请说明详情',
    minRows: 2,
    maxRows: 6,
    max: 600,
    show: false
  },
  {
    value: 'finishInfo',
    initValue: '',
    type: 'textarea',
    label: '结案信息',
    placeholder: '请说明详情',
    minRows: 2,
    maxRows: 6,
    max: 600,
    show: false
  }
]
export default {
  name: 'AddAccident',
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
        name: 'safeAccident'
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
    ...mapActions('home', ['addAccident', 'updateOtherArchive', 'accidentDetail']),
    async showDetail() {
      const res = await this.accidentDetail(this.detailId)
      res.data.validDate = this.$tools.getDate(res.data.validDate)
      res.data.buyDate = this.$tools.getDate(res.data.buyDate)
      this.formData.formData3 = this.$tools.fillForm(formData.formData3, res.data)
      this.fileList = [{ url: res.data.photoUrl }]
    },
    // 事故现状改变
    update(e) {
      if (e.target.value === '1') {
        this.formData[12].show = false
        this.formData[13].show = false
      } else if (e.target.value === '2') {
        this.formData[12].show = true
        this.formData[13].show = false
      } else {
        this.formData[12].show = false
        this.formData[13].show = true
      }
    },
    async submitForm(values) {
      try {
        values.pictures = this.fileList.map(el => el.url)
        values.schoolCode = this.userInfo.schoolCode
        values.schoolName = this.userInfo.schoolName
        values.userCode = this.userInfo.userCode
        values.userName = this.userInfo.userName
        if (!this.detailId) {
          await this.addAccident(values)
        } else {
          values.id = this.detailId
          await this.updateOtherArchive(values)
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
.accident-add {
  padding: 20px;
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
  }
}
</style>
