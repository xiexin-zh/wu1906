<template>
  <div class="info qui-fx-ver">
    <!-- <div class="content pos-box bg-fff"> -->
    <div class="u-padd-10 u-padd-l20 u-padd-t40">
      <a-form :form="form">
        <a-form-item label="课堂名称：" v-bind="formItemLayout">
          <a-input
            :maxLength="30"
            v-decorator="[
              'name',
              {
                initialValue: cardInfo.name,
                rules: [{ required: true, message: '请填写课堂名称' }]
              }
            ]"
            placeholder="请填写课堂名称"
          />
        </a-form-item>
        <a-form-item label="课堂类型" v-bind="formItemLayout">
          <a-cascader
            v-decorator="[
              'resourceType',
              {
                initialValue: cardInfo.resourceType,
                rules: [{ required: true, message: '请填写资源名称' }]
              }
            ]"
            placeholder="请填写课堂类型"
            :options="options"
          />
        </a-form-item>
        <a-form-item required label="封面图" v-bind="formItemLayout">
          <a-row >
            <a-col :span="24" >
              <upload-multi
                :length="1"
                v-model="cardInfo.thumbnailUrl"
                :fileInfo="fileInfo"
              ></upload-multi>
            </a-col>
            <a-col :span="8" >
              备注：限上传1张照片
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="适用学段" v-bind="formItemLayout">
          <a-select
            mode="multiple"
            v-decorator="[
              'sections',
              { initialValue: cardInfo.sections, rules: [{ required: true, message: '请选择文件类型' }] },
            ]"
            placeholder="请选择适用学段">
            <a-select-option :value="1">幼儿园</a-select-option>
            <a-select-option :value="2">小学低年级</a-select-option>
            <a-select-option :value="4">小学高年级</a-select-option>
            <a-select-option :value="8">初中</a-select-option>
            <a-select-option :value="16">高中</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="简介" v-bind="formItemLayout">
          <a-textarea
            :maxLength="300"
            v-decorator="[
              'des',
              {
                initialValue: cardInfo.des,
                rules: [{ required: true, message: '请填写简介' }]
              }
            ]"
            placeholder="请填写简介"
            :rows="4" />
        </a-form-item>
      </a-form>
      <div class="u-tx-c u-mar-t20">
        <a-button @click="cancel" >取消</a-button>
        <a-button class="mar-l10" type="primary" @click="save" :disabled="isLoad">保存</a-button>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import UploadMulti from '@c/UploadMulti'
import quillConfig from '../../../../assets/js/quill-config'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Info',
  components: {
    quillEditor,
    UploadMulti
  },
  data() {
    return {
      options: [], // 资源树
      appForm: {},
      firstData: [],
      quillOption: quillConfig,
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      fileInfo: {
        tip: '上传图标',
        h: 120, // 高度
        w: 120 // 宽度
      },
      isLoad: false,
      form: this.$form.createForm(this),
      cardInfo: {
        thumbnailUrl: []
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  watch: {
  },
  async created() {
    this.id = this.$route.query.id
    await this._treeView()
    if (this.id) {
      this.showDetail()
    }
  },
  methods: {
    ...mapActions('home', [
      'addClass',
      'classSearchBasic',
      'classModifyBasic',
      'treeView'
    ]),
    // 获取资源树
    async _treeView() {
      const res = await this.treeView()
      this.options = res.data.map(res => {
        return {
          label: res.categoryName,
          value: `${res.id}+${res.categoryName}`,
          isLeaf: false,
          children: res.children ? res.children.map(el => {
            return {
              label: el.categoryName,
              value: `${el.id}+${el.categoryName}`
            }
          }) : []
        }
      })
    },
    // 获取详情
    async showDetail() {
      const res = await this.classSearchBasic(this.id)
      const newResourceType = res.data.libId ? [`${res.data.libId}+${res.data.libName}`, `${res.data.categoryId}+${res.data.categoryName}`] : []
      this.cardInfo = {
        ...res.data,
        thumbnailUrl: [{ url: res.data.thumbnailUrl }],
        resourceType: newResourceType
      }
    },
    cancel() {
      this.$router.go(-1)
    },
    // 保存
    async save(e) {
      // e.preventDefault()
      this.form.validateFields((error, values) => {
        this.isLoad = false
        if (!error) {
          if (this.cardInfo.thumbnailUrl.length === 0) return this.$message.success('封面图不能为空')
          this.isLoad = true
          const req = {
            libId: Number(values.resourceType[0].split('+')[0]),
            libName: values.resourceType[0].split('+')[1],
            categoryId: Number(values.resourceType[1].split('+')[0]),
            categoryName: values.resourceType[1].split('+')[1],
            des: values.des,
            eduCode: '',
            sections: values.sections,
            name: values.name,
            schoolCode: this.userInfo.schoolCode,
            schoolName: this.userInfo.schoolName,
            source: '1',
            thumbnailUrl: this.cardInfo.thumbnailUrl[0].url
          }
          if (this.id) {
            this.classModifyBasic({ ...req, id: this.id })
              .then((res) => {
                this.$message.success('操作成功')
                this.$parent.isActive('2')
              })
              .catch((res) => {
                this.isLoad = false
              })
          } else {
            this.addClass(req)
              .then((res) => {
                this.$message.success('操作成功')
                this.$parent.isActive('2', res.data)
              })
              .catch((res) => {
                this.isLoad = false
              })
          }
        }
      })
    },
    // 校验
    submitOk() {
      let pass = false
      // e.preventDefault()
      this.form.validateFields((error, values) => {
        if (!error) {
          if (this.cardInfo.thumbnailUrl.length === 0) return this.$message.success('封面图不能为空')
          pass = true
        }
      })
      return pass
    }
  }
}
</script>
<style lang="less" scoped>
</style>
