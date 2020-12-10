<template>
  <div class="info qui-fx-ver">
    <div class="u-padd-10 u-padd-l20 u-padd-t40">
      <a-form :form="form">
        <a-form-item label="预案名称：" v-bind="formItemLayout">
          <a-input
            v-decorator="[
              'name',
              {
                initialValue: cardInfo.name,
                rules: [{ required: true, message: '请填写预案名称' }]
              }
            ]"
            placeholder="请填写预案名称"
          />
        </a-form-item>
        <a-form-item label="预案类型" v-bind="formItemLayout">
          <a-select
            v-decorator="[
              'type',
              { initialValue: cardInfo.type, rules: [{ required: true, message: '请选择预案类型' }] },
            ]"
            placeholder="请选择预案类型">
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
            v-decorator="[
              'level',
              { initialValue: cardInfo.level, rules: [{ required: true, message: '请选择预案级别' }] },
            ]"
            placeholder="请选择预案级别">
            <a-select-option value="1">一般级别</a-select-option>
            <a-select-option value="2">较紧急级别</a-select-option>
            <a-select-option value="3">非常紧急级别</a-select-option>
            <a-select-option value="4">特别紧急级别</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="总指挥" v-bind="formItemLayout" required>
          <div>
            <template v-for="tag in commandUsers">
              <a-tag :key="tag.userCode" :closable="true" :afterClose="() => userClose(tag)">
                {{ tag.userName }}
              </a-tag>
            </template>
            <a-tag @click="addTag(1, 'commandUsers')" style="background: #fff; borderStyle: dashed;"> <a-icon type="plus" />添加 </a-tag>
          </div>
        </a-form-item>
        <a-form-item label="副指挥" v-bind="formItemLayout">
          <div>
            <template v-for="tag in deputyCommandUsers">
              <a-tag :key="tag.userCode" :closable="true" :afterClose="() => userClose(tag)">
                {{ tag.userName }}
              </a-tag>
            </template>
            <a-tag @click="addTag(2, 'deputyCommandUsers')" style="background: #fff; borderStyle: dashed;"> <a-icon type="plus" />添加 </a-tag>
          </div>
        </a-form-item>
        <a-form-item label="应急队伍" v-bind="formItemLayout" required>
          <div>
            <template v-for="tag in users">
              <a-tag :key="tag.userCode" :closable="true" :afterClose="() => userClose(tag)">
                {{ tag.userName }}
              </a-tag>
            </template>
            <a-tag @click="addTag(0, 'users')" style="background: #fff; borderStyle: dashed;"> <a-icon type="plus" />添加 </a-tag>
          </div>
        </a-form-item>
        <a-form-item
          label="应急内容"
          v-bind="formItemLayout"
          :style="{ textAlign: 'center' }"
          required
        >
          <quill-editor
            v-model="cardInfo.content"
            ref="myQuillEditor"
            :options="quillOption"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          ></quill-editor>
        </a-form-item>
      </a-form>
      <div class="u-tx-c u-mar-t20">
        <a-button @click="cancel" >取消</a-button>
        <a-button class="mar-l10" type="primary" @click="save" :disabled="isLoad">保存</a-button>
      </div>
    </div>
    <choose-post
      ref="chooseUser"
      :is-check="isCheck"
      :is-radio="isRadio"
      v-if="userTag"
      v-model="userTag"
      @submit="chooseUser"
      title="选择人员"
    >
    </choose-post>
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
import ChoosePost from '@c/choose/ChoosePost'
export default {
  name: 'Info',
  components: {
    quillEditor,
    UploadMulti,
    ChoosePost
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
        type: '01',
        level: '1'
      },
      userTag: false,
      teacherList: [],
      isCheck: false,
      isRadio: false,
      commandUsers: [],
      deputyCommandUsers: [],
      users: [],
      string: '',
      show: true
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  watch: {
  },
  async created() {
    this.id = this.$route.query.id
    this.tempId = this.$route.query.tempId
    if (this.id || this.tempId) {
      this.showDetail()
    }
  },
  methods: {
    ...mapActions('home', [
      'addTemplateInfo',
      'getTemplateDetail',
      'updateTemplateInfo'
    ]),
    // 富文本编辑器方法
    onEditorFocus(data) {},
    // 获得焦点事件
    onEditorChange(data) {
      this.text = data.text
      this.content = data.html
      this.roundup = data.text.substring(0, 120)
    },
    addTag(type, string) {
      this.string = string
      if (type) {
        this.isRadio = true
        this.isCheck = false
      } else {
        this.isRadio = false
        this.isCheck = true
      }
      this.userTag = true
      setTimeout(() => {
        this.$refs.chooseUser.chooseList = this[string].map(el => {
          return el.userId ? el.userId : el.id
        })
        this.$refs.chooseUser.totalList = this[string].map(el => {
          return {
            ...el,
            detailId: el.id,
            id: el.userId ? el.userId : el.id
          }
        })
      }, 100)
    },
    // 授权查看人选择
    chooseUser(teacherList) {
      this[this.string] = teacherList
      this.$refs.chooseUser.reset()
    },
    // 获取详情
    async showDetail() {
      const res = await this.getTemplateDetail(this.id ? this.id : this.tempId)
      this.cardInfo = res.data
      this.commandUsers = res.data.commandUsers
      this.deputyCommandUsers = res.data.deputyCommandUsers
      this.users = res.data.users
    },
    cancel() {
      this.$router.push({
        path: '/emergencyPlan'
      })
    },
    // 保存
    async save(e) {
      // e.preventDefault()
      this.form.validateFields((error, values) => {
        this.isLoad = false
        if (!error) {
          if (this.commandUsers.length === 0) {
            this.$message.warning('请选择总指挥')
            return
          }
          if (this.users.length === 0) {
            this.$message.warning('请选择应急队伍')
            return
          }
          if (!this.cardInfo.content) {
            this.$message.warning('请填写应急内容')
            return
          }
          this.isLoad = true
          values.schoolCode = this.userInfo.schoolCode
          values.commandUsers = this.commandUsers
          values.deputyCommandUsers = this.deputyCommandUsers
          values.users = this.users
          values.content = this.cardInfo.content
          if (this.id) {
            this.updateTemplateInfo({ ...values, id: this.id })
              .then((res) => {
                this.$message.success('操作成功')
                if (this.show) {
                  this.$parent.isActive('2')
                }
              })
              .catch((res) => {
                this.isLoad = false
              })
          } else {
            this.addTemplateInfo(values)
              .then((res) => {
                this.$message.success('操作成功')
                if (this.show) {
                  this.$parent.isActive('2', res.data)
                }
                this.$router.replace({ query: { id: res.data } })
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
      this.show = false
      let pass = false
      this.form.validateFields((error, values) => {
        if (!error) {
          if (this.commandUsers.length !== 0 && this.users.length !== 0 && this.cardInfo.content) {
            pass = true
          }
        }
      })
      return pass
    }
  }
}
</script>
<style lang="less" scoped>
</style>
