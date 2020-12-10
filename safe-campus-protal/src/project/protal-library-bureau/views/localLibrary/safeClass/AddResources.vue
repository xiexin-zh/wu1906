<template>
  <div class="add-resources page-layout qui-fx-ver">
    <div class="content pos-box bg-fff">
      <div class="u-mar-t40 u-padd-t20">
        <a-form :form="form">
          <a-form-item label="资源名称：" v-bind="formItemLayout">
            <a-input
              :maxLength="30"
              v-decorator="[
                'name',
                { initialValue: cardInfo.name, rules: [{ required: true, message: '请选择习题类型' }] }
              ]"
              placeholder="请输入资源名称"
            />
          </a-form-item>
          <a-form-item required label="上传资源：" v-bind="formItemLayout">
            <a-upload
              name="file"
              :multiple="false"
              :showUploadList="true"
              :fileList="fileList"
              :beforeUpload="beforeUpload"
              :customRequest="customRequest"
            >
              <a-button> <a-icon type="upload" /> 上传资源 </a-button>
              <span style="color:'#f5222d'">(上传资源最大不超过100M)</span>
            </a-upload>
          </a-form-item>
          <a-form-item label="资源类型：" v-bind="formItemLayout">
            <a-cascader
              v-decorator="[
                'resourceType',
                {
                  initialValue: cardInfo.resourceType,
                  rules: [{ required: true, message: '请填写资源类型' }]
                }
              ]"
              placeholder="请选择资源类型"
              :options="options"
            />
          </a-form-item>
          <a-form-item label="适用学段：" v-bind="formItemLayout">
            <a-select
              mode="multiple"
              v-decorator="[
                'sections',
                { initialValue: cardInfo.sections, rules: [{ required: true, message: '请选择文件类型' }] }
              ]"
              placeholder="请选择适用学段"
            >
              <a-select-option :value="1">幼儿园</a-select-option>
              <a-select-option :value="2">小学低年级</a-select-option>
              <a-select-option :value="4">小学高年级</a-select-option>
              <a-select-option :value="8">初中</a-select-option>
              <a-select-option :value="16">高中</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
      <div class="u-tx-c u-mar-t20">
        <a-button @click="cancel">取消</a-button>
        <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">保存</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'AddResources',
  components: {},
  data() {
    this.type = this.$route.query.type + ''
    return {
      // 上传资源
      docSize: '',
      docName: '',
      docType: '',
      fileList: [
        // {
        //   uid: '-1',
        //   name: 'xxx.png',
        //   status: 'done',
        //   url: 'http://www.baidu.com/xxx.png'
        // }
      ],
      options: [], // 资源树
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      isLoad: false,
      cardInfo: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  watch: {},
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'dynamic_form_item' })
  },
  async created() {
    this.id = this.$route.query.id
    await this._treeView()
    if (this.id) {
      await this.showDetail()
    }
  },
  async mounted() {},
  methods: {
    ...mapActions('home', ['treeView', 'infoResource', 'addResource', 'modifyResource']),
    moment,
    // 获取资源树
    async _treeView() {
      const res = await this.treeView()
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
    // 上传文件
    beforeUpload(file) {
      const isLt100M = file.size / 1024 / 1000 < 100
      if (!isLt100M) {
        this.$message.error('文件不能超过100M')
      }
      return isLt100M
    },
    async customRequest(data) {
      console.log(data)
      const { name, size, type } = data.file
      this.docName = name
      this.docSize = size
      // this.docType = type.split('/')[1]
      const arr = name.split('.')
      const length = arr.length
      this.docType = arr[length - 1]
      this.$tools.ossUpload(this.userInfo.schoolCode, data.file, type, this.callBack)
    },
    callBack(value) {
      value = value.data
      this.fileList = [
        {
          docSize: this.docSize,
          docType: this.docType,
          uid: value.id,
          url: value.url,
          name: this.docName,
          status: 'done'
        }
      ]
    },
    // 获取详情
    async showDetail() {
      const res = await this.infoResource(Number(this.id))
      const newResourceType = res.data.libId ? [`${res.data.libId}+${res.data.libName}`, `${res.data.categoryId}+${res.data.categoryName}`] : []
      this.cardInfo = {
        ...res.data,
        resourceType: newResourceType
      }
      this.fileList = [
        {
          uid: '1',
          url: res.data.resourceUrl,
          name: res.data.docName,
          status: 'done',
          docType: res.data.docType,
          docSize: res.data.docSize
        }
      ]
    },
    cancel() {
      this.$tools.goNext(() => {
        this.$router.push({
          path: '/safeClassLocal',
          query: {
            activeKey: '3'
          }
        })
      })
    },

    // 提交
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        this.isLoad = false
        if (!error) {
          // this.isLoad = true
          console.log(this.fileList)
          if (this.fileList.length === 0) return this.$message.success('请上传资源')
          const req = {
            name: values.name,
            docSize: this.fileList[0].docSize,
            docType: this.fileList[0].docType,
            docName: this.fileList[0].name,
            resourceUrl: this.fileList[0].url,
            sections: values.sections,
            publishName: this.userInfo.userName,
            libId: Number(values.resourceType[0].split('+')[0]),
            libName: values.resourceType[0].split('+')[1],
            categoryId: Number(values.resourceType[1].split('+')[0]),
            categoryName: values.resourceType[1].split('+')[1],
            schoolCode: this.userInfo.schoolCode,
            source: '2'
          }
          console.log(req)
          if (this.id) {
            this.modifyResource({ ...req, id: this.id })
              .then(res => {
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$tools.goNext(() => {
                    this.$router.push({
                      path: '/safeClassLocal',
                      query: {
                        activeKey: '3'
                      }
                    })
                  })
                })
              })
              .catch(res => {
                this.isLoad = false
              })
          } else {
            this.addResource(req)
              .then(res => {
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$tools.goNext(() => {
                    this.$router.push({
                      path: '/safeClassLocal',
                      query: {
                        activeKey: '3'
                      }
                    })
                  })
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
@deep: ~'>>>';
.add-resources {
  background-color: #f5f5fb;
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
    .input {
      width: 90%;
      border: 1px dashed #cfcfcf;
    }
    @{deep} .ant-upload-list-item-card-actions {
      display: none;
    }
  }
  /deep/.ant-input-number {
    width: 100%;
  }
}
</style>
