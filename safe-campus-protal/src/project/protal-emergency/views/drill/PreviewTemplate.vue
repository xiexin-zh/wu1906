<template>
  <div class="task-add page-layout qui-fx-ver">
    <div class="content pos-box bg-fff">
      <div class="u-padd-10 u-padd-l20 u-padd-t20">
        <a-row type="flex" class="u-mar-t20" >
          <a-col :span="5"> </a-col>
          <a-col :span="16">
            <div class="stepBar u-fx">
              <div class="u-fx-ac-jc base">基本信息</div>
            </div>
          </a-col>
        </a-row>
        <div class="info qui-fx-ver">
          <div class="u-padd-10 u-padd-l20 u-padd-t40">
            <a-form :form="form">
              <a-form-item label="预案名称：" v-bind="formItemLayout">
                <a-input
                  disabled
                  v-decorator="[ 'name', { initialValue: cardInfo.name } ]"
                />
              </a-form-item>
              <a-form-item label="预案类型" v-bind="formItemLayout">
                <a-select
                  disabled
                  v-decorator="[
                    'type',
                    { initialValue: cardInfo.type },
                  ]">
                  <a-select-option value="01">地震应急预案</a-select-option>
                  <a-select-option value="02">火灾应急预案</a-select-option>
                  <a-select-option value="03">传染病应急预案</a-select-option>
                  <a-select-option value="04">食物中毒应急预案</a-select-option>
                  <a-select-option value="05">校园踩踏应急预案</a-select-option>
                  <a-select-option value="06">防恐防暴应急预案</a-select-option>
                  <a-select-option value="07">极端天气应急预案</a-select-option>
                  <a-select-option value="08">突发事件应急预案</a-select-option>
                  <a-select-option value="09">防汛应急预案</a-select-option>
                  <a-select-option value="10">其他预案</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="预案级别" v-bind="formItemLayout">
                <a-select
                  disabled
                  v-decorator="[ 'level', { initialValue: cardInfo.level}]">
                  <a-select-option value="1">一般级别</a-select-option>
                  <a-select-option value="2">较紧急级别</a-select-option>
                  <a-select-option value="3">非常紧急级别</a-select-option>
                  <a-select-option value="4">特别紧急级别</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="总指挥" v-bind="formItemLayout" required>
                <a-input
                  disabled
                  v-decorator="[ 'commandUsers']"
                />
              </a-form-item>
              <a-form-item label="副指挥" v-bind="formItemLayout">
                <a-input
                  disabled
                  v-decorator="[ 'deputyCommandUsers']"
                />
              </a-form-item>
              <a-form-item label="应急队伍" v-bind="formItemLayout" required>
                <a-input
                  disabled
                  v-decorator="[ 'users']"
                />
              </a-form-item>
              <a-form-item
                label="应急内容"
                v-bind="formItemLayout"
                :style="{ textAlign: 'center' }"
                required
              >
                <quill-editor
                  disabled
                  v-model="cardInfo.content"
                  ref="myQuillEditor"
                  :options="quillOption"
                  @focus="onEditorFocus($event)"
                  @change="onEditorChange($event)"
                ></quill-editor>
              </a-form-item>
            </a-form>
            <div class="u-tx-c u-mar-t20">
              <a-button @click="cancel" >返回列表</a-button>
              <a-button class="mar-l10" type="primary" @click="quote" :disabled="isLoad">引用</a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import quillConfig from '../../assets/js/quill-config'
import { mapActions } from 'vuex'
export default {
  name: 'PreviewTemplate',
  components: {
    quillEditor
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
      isLoad: false,
      form: this.$form.createForm(this),
      cardInfo: {
        type: '01'
      },
      teacherList: []
    }
  },
  async created() {
    this.tempId = this.$route.query.tempId
    this.eduCode = ''
    if (this.tempId) {
      this.showDetail()
    }
  },
  methods: {
    ...mapActions('home', [ 'getTemplateDetail' ]),
    // 富文本编辑器方法
    onEditorFocus(data) {},
    // 获得焦点事件
    onEditorChange(data) {
      this.text = data.text
      this.content = data.html
      this.roundup = data.text.substring(0, 120)
    },
    // 获取详情
    async showDetail() {
      const res = await this.getTemplateDetail(this.tempId)
      this.cardInfo = res.data
    },
    cancel() {
      this.$router.push({
        path: '/emergencyPlan',
        query: {
          activeTab: '2'
        }
      })
    },
    quote() {
      this.$router.push({
        path: '/emergencyPlan/addTemplate',
        query: {
          tempId: this.tempId
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.task-add {
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
.base {
  width: 169px;
  height: 38px;
  color:#fff;
  background-color: #4d4cac
}
</style>
