<template>
  <div class="klg-add page-layout qui-fx-ver">
    <div class="content pos-box bg-fff">
      <div class="u-padd-10 u-padd-l20 u-padd-t40">
        <a-form :form="form">
          <a-form-item label="资源名称：" v-bind="formItemLayout">
            <a-input
              :maxLength="30"
              v-decorator="[
                'name',
                {
                  initialValue: cardInfo.name,
                  rules: [{ required: true, message: '请填写资源名称' }]
                }
              ]"
              placeholder="请填写资源名称"
            />
          </a-form-item>
          <a-form-item label="资源类型" v-bind="formItemLayout">
            <a-cascader
              v-decorator="[
                'resourceType',
                {
                  initialValue: cardInfo.resourceType,
                  rules: [{ required: true, message: '请填写资源名称' }]
                }
              ]"
              placeholder="请填写资源类型"
              :options="options"
            />
          </a-form-item>
          <a-form-item label="文件类型" v-bind="formItemLayout">
            <a-select
              v-decorator="[
                'fileTypeId',
                { initialValue: cardInfo.fileTypeId, rules: [{ required: true, message: '请选择文件类型' }] }
              ]"
              placeholder="请选择文件类型"
            >
              <a-select-option value="1">看一看</a-select-option>
              <a-select-option value="2">玩一玩</a-select-option>
              <a-select-option value="3">读一读</a-select-option>
              <a-select-option value="4">听一听</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="封面图" v-bind="formItemLayout">
            <a-row>
              <a-col :span="24">
                <upload-multi :length="1" v-model="cardInfo.thumbnailUrl" :fileInfo="fileInfo"></upload-multi>
              </a-col>
              <a-col :span="8">
                备注：限上传1张照片
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item label="内容详情：" v-bind="formItemLayout" :style="{ textAlign: 'center' }" required>
            <quill-editor
              v-model="cardInfo.des"
              ref="myQuillEditor"
              :options="quillOption"
              @focus="onEditorFocus($event)"
              @change="onEditorChange($event)"
            ></quill-editor>
          </a-form-item>
        </a-form>
      </div>
      <div class="u-tx-c u-mar-t40">
        <a-button @click="cancel">取消</a-button>
        <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">保存</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import UploadMulti from '@c/UploadMulti'
import quillConfig from '../../assets/js/quill-config'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'AddKlg',
  components: {
    quillEditor,
    UploadMulti
  },
  data() {
    return {
      form: this.$form.createForm(this),
      options: [], // 资源树
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
      cardInfo: {
        thumbnailUrl: []
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  watch: {},
  async created() {
    this.id = this.$route.query.id
    await this._treeView()
    if (this.id) {
      this.showDetail()
    }
  },
  methods: {
    ...mapActions('home', [
      'treeView',
      'klgInfoEidt',
      'klgModify',
      'addKlg'
      // 'secondCategory',
    ]),
    moment,
    // 获取资源树
    async _treeView() {
      const res = await this.treeView()
      console.log(res)
      this.options = res.data.map(res => {
        return {
          label: res.categoryName,
          value: `${res.id}+${res.categoryName}`,
          isLeaf: false,
          children: res.children
            ? res.children.map(el => {
              return {
                label: el.categoryName,
                value: `${el.id}+${el.categoryName}`
              }
            })
            : []
        }
      })
    },
    // // 资源类型加载二级分类
    // async loadData(selectedOptions) {
    //   console.log(selectedOptions)
    //   const targetOption = selectedOptions[selectedOptions.length - 1]
    //   targetOption.loading = true
    //   const res = await this.secondCategory(selectedOptions[0].value.split('+')[0])
    //   targetOption.loading = false
    //   targetOption.children = res.data.map(res => {
    //     return {
    //       label: res.name,
    //       value: `${res.id}+${res.name}`
    //     }
    //   })
    //   this.firstData = [...this.firstData]
    // },
    // 获取详情
    async showDetail() {
      const res = await this.klgInfoEidt(this.id)
      const newResourceType = res.data.libId ? [`${res.data.libId}+${res.data.libName}`, `${res.data.categoryId}+${res.data.categoryName}`] : []
      this.cardInfo = {
        ...res.data,
        thumbnailUrl: [{ url: res.data.thumbnailUrl }],
        resourceType: newResourceType
      }
    },
    // 富文本编辑器方法
    onEditorFocus(data) {},
    // 获得焦点事件
    onEditorChange(data) {
      this.text = data.text
      this.content = data.html
      this.roundup = data.text.substring(0, 120)
    },
    cancel() {
      this.$router.go(-1)
    },
    // 提交
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        this.isLoad = false
        if (!error) {
          if (this.cardInfo.thumbnailUrl.length === 0) return this.$message.success('封面图不能为空')
          if (!this.cardInfo.des) return this.$message.success('内容详情不能为空')
          this.isLoad = true
          const req = {
            libId: values.resourceType[0].split('+')[0],
            libName: values.resourceType[0].split('+')[1],
            categoryId: values.resourceType[1].split('+')[0],
            categoryName: values.resourceType[1].split('+')[1],
            des: this.cardInfo.des,
            eduCode: '',
            fileTypeId: values.fileTypeId,
            name: values.name,
            publisherName: this.userInfo.userName,
            schoolCode: this.userInfo.schoolCode,
            schoolName: this.userInfo.schoolName,
            source: '1',
            thumbnailUrl: this.cardInfo.thumbnailUrl[0].url
          }
          if (this.id) {
            this.klgModify({ ...req, id: this.id })
              .then(res => {
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$router.go(-1)
                })
              })
              .catch(res => {
                this.isLoad = false
              })
          } else {
            this.addKlg(req)
              .then(res => {
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$router.go(-1)
                })
              })
              .catch(res => {
                this.isLoad = false
              })
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.klg-add {
  background-color: #f5f5fb;
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
    .input {
      width: 90%;
      border: 1px dashed #cfcfcf;
    }
  }
}
</style>
