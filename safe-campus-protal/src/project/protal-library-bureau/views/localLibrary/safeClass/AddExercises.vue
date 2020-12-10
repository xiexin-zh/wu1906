<template>
  <div class="add-exercises page-layout qui-fx-ver">
    <div class="content pos-box bg-fff">
      <div class="u-mar-t40 u-padd-t20">
        <a-form :form="form" >
          <a-form-item label="习题类型：" v-bind="formItemLayout">
            <a-select
              v-decorator="[
                'topicType',
                { initialValue: cardInfo.topicType, rules: [{ required: true, message: '请选择习题类型' }] },
              ]"
              placeholder="请选择习题类型"
              @change="handleSelectChange"
            >
              <a-select-option value="1">单选题</a-select-option>
              <a-select-option value="2">判断题</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="难易程度：" v-bind="formItemLayout">
            <a-select
              v-decorator="[
                'degreeDifficulty',
                { initialValue: cardInfo.degreeDifficulty, rules: [{ required: true, message: '请选择难易程度' }] },
              ]"
              placeholder="请选择难易程度"
            >
              <a-select-option value="1">容易</a-select-option>
              <a-select-option value="2">一般</a-select-option>
              <a-select-option value="3">困难</a-select-option>
            </a-select>
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
          <a-form-item label="习题内容：" v-bind="formItemLayout">
            <a-textarea
              v-decorator="[
                'content',
                {
                  initialValue: cardInfo.content,
                  rules: [{ required: true, message: '请填写习题内容' }]
                }
              ]"
              placeholder="请填写习题内容"
              :rows="4" />
          </a-form-item>
          <!-- {{ form.getFieldValue('keys') }}---{{ radioList }} -->
          <template v-if="isRadio&&showRadio">
            <a-form-item
              required
              v-for="(k, index) in form.getFieldValue('keys')"
              :key="k"
              v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
              :label="index === 0 ? '习题答案：' : ''"
            >
              <a-input
                v-decorator="[
                  `names[${k}]`,
                  {
                    validateTrigger: ['change', 'blur'],
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '请填写答案内容',
                      },
                    ],
                  },
                ]"

                placeholder="请填写答案内容"
                style="width: 60%; margin-right: 8px"
              />
              <a-checkbox v-model="radioList[index].selected" @change="changeSelected(index)">是否为正确答案</a-checkbox>
              <a-icon
                v-if="form.getFieldValue('keys').length > 1"
                :disabled="form.getFieldValue('keys').length === 1"
                class="dynamic-delete-button"
                type="minus-circle-o"
                @click="() => remove(k)"
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayoutWithOutLabel" label="">
              <a-button type="dashed" style="width: 20%" @click="add">
                <a-icon type="plus" /> 添加答案
              </a-button>
            </a-form-item>
          </template>
          <a-form-item v-else label="习题答案：" required v-bind="formItemLayout">
            <a-radio-group
              v-decorator="[
                'judgeAnswer',
                {
                  initialValue: cardInfo.judgeAnswer,
                  rules: [{ required: true, message: '请填写资源名称' }]
                }
              ]"
            >
              <a-radio value="1">
                正确
              </a-radio>
              <a-radio value="2">
                错误
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="习题预设分数：" v-bind="formItemLayout">
            <a-input-number
              id="inputNumber"
              v-decorator="[
                'fraction',
                {
                  initialValue: cardInfo.fraction,
                  rules: [{ required: true, message: '请输入0-50之间的整数' }]
                }
              ]"
              placeholder="请输入0-50之间的整数"
              :min="1"
              :max="50"
            />
            <!-- <a-input/> -->
          </a-form-item>
          <a-form-item label="是否加入安全评测：" v-bind="formItemLayout">
            <a-radio-group
              v-decorator="[
                'hasEvaluation',
                {
                  initialValue: cardInfo.hasEvaluation,
                  rules: [{ required: true, message: '请填写资源名称' }]
                }
              ]"
            >
              <a-radio :value="true">
                是
              </a-radio>
              <a-radio :value="false">
                否
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            label="备注："
            v-bind="formItemLayout"
            :style="{ textAlign: 'center' }"
          >
            <a-textarea
              v-decorator="[
                'remark',
                {
                  initialValue: cardInfo.remark,
                  rules: [{ required: false, message: '请输入' }]
                }
              ]"
              placeholder="请输入"
              :rows="4" />
          </a-form-item>
        </a-form>
      </div>
      <div class="u-tx-c u-mar-t20 u-mar-b40">
        <a-button @click="cancel">取消</a-button>
        <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">保存</a-button>
      </div>
    </div>
  </div>
</template>
<script>
import UploadMulti from '@c/UploadMulti'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'AddExercises',
  components: {
    UploadMulti
  },
  data() {
    return {

      options: [], // 资源树
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: { span: 16, offset: 6 }
      },
      isLoad: false,
      cardInfo: {
        topicType: '1'
      },
      // 单选项数据
      showRadio: false,
      isRadio: true,
      setKeys: false,
      addRadioTd: 0,
      radioList: [
        {
          option: '',
          selected: true
        }
      ],
      setRadioList: {
        keys: [],
        names: []
      }
      // radioList: {
      //   keys: [0, 1],
      //   names: ['fgfg', 'zhangsan']
      // },
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  watch: {
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'dynamic_form_item' })
  },
  async created () {
    this.id = this.$route.query.id
    await this._treeView()
    if (this.id) {
      await this.showDetail()
      return
    }
    if (this.cardInfo.topicType === '1') {
      this.addKeySetRadioList()
    }
  },
  async mounted() {
  },
  methods: {
    ...mapActions('home', [
      'treeView',
      'ecsInfo',
      'Addexercises',
      'ecsModify'
    ]),
    moment,
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
    // 表单联动
    handleSelectChange(value) {
      if (value === '1') {
        this.isRadio = true
        if (this.setKeys) return
        this.addKeySetRadioList()
      } else {
        this.isRadio = false
      }
    },
    // 初始化单选项设置添加key，再赋值setRadioList
    addKeySetRadioList() {
      this.radioList.forEach((el, index) => {
        this.setRadioList.keys.push(index)
        this.setRadioList.names.push(el.option)
      })
      // 每一次调用都会新增keys,不会覆盖只有调用一次重复调用key重复报错
      this.form.getFieldDecorator('keys', { initialValue: this.setRadioList.keys, preserve: true })
      this.addRadioTd = this.setRadioList.keys.length
      this.showRadio = true
      this.$nextTick(() => {
        this.form.setFieldsValue(this.setRadioList)
      })
      this.setKeys = true
    },
    // 动态增减单选表单项
    add() {
      this.radioList.push({
        option: '',
        selected: false
      })
      const keys = this.form.getFieldValue('keys')
      const nextKeys = keys.concat(this.addRadioTd++)
      this.form.setFieldsValue({
        keys: nextKeys
      })
    },
    remove(k) {
      const keys = this.form.getFieldValue('keys')
      if (keys.length === 1) return
      this.radioList = this.radioList.filter((v, index) => index !== k)
      this.form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      })
    },
    // 排他单选按钮
    changeSelected(index) {
      this.radioList.forEach((el, count) => {
        if (count !== index) {
          el.selected = false
        }
      })
    },
    // 获取详情
    async showDetail() {
      const res = await this.ecsInfo(this.id)
      const newResourceType = res.data.libId ? [`${res.data.libId}+${res.data.libName}`, `${res.data.categoryId}+${res.data.categoryName}`] : []
      this.cardInfo = {
        ...res.data,
        resourceType: newResourceType
      }
      // 为单选题的时候始值赋初
      if (res.data.topicType === '1') {
        this.radioList = res.data.answer
      } else {
        // 判断题
        const ischecked = res.data.answer.find(el => el.selected).option
        this.cardInfo.judgeAnswer = ischecked === '正确' ? '1' : '2'
      }
      this.handleSelectChange(res.data.topicType)
    },
    cancel() {
      this.$tools.goNext(() => {
        this.$router.push({
          path: '/safeClassLocal',
          query: {
            activeKey: '2'
          }
        })
      })
    },
    // 提交
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        if (!error) {
          let answer = []
          if (values.topicType === '1') {
            if (this.radioList.length < 2) return this.$message.success('单选题不能小于2项')
            answer = this.radioList.map((el, index) => {
              el.option = values.names[index]
              return {
                ...el
              }
            })
          } else {
            const istrue = values.judgeAnswer === '1'
            answer.push({ option: '正确', selected: istrue })
            answer.push({ option: '错误', selected: !istrue })
          }
          this.isLoad = true
          const req = {
            answer: answer,
            content: values.content,
            degreeDifficulty: values.degreeDifficulty,
            fraction: values.fraction,
            hasEvaluation: values.hasEvaluation,
            remark: values.remark,
            sections: values.sections,
            topicType: values.topicType,
            libId: Number(values.resourceType[0].split('+')[0]),
            libName: values.resourceType[0].split('+')[1],
            categoryId: Number(values.resourceType[1].split('+')[0]),
            categoryName: values.resourceType[1].split('+')[1],
            schoolCode: this.userInfo.schoolCode,
            schoolName: this.userInfo.schoolName,
            source: '2'
          }
          if (this.id) {
            this.ecsModify({ ...req, id: this.id })
              .then((res) => {
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$router.push({
                    path: '/safeClassLocal',
                    query: {
                      activeKey: '2'
                    }
                  })
                })
              })
              .catch((res) => {
                this.isLoad = false
              })
          } else {
            this.Addexercises(req)
              .then((res) => {
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$tools.goNext(() => {
                    this.$router.push({
                      path: '/safeClassLocal',
                      query: {
                        activeKey: '2'
                      }
                    })
                  })
                })
              })
              .catch((res) => {
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
.add-exercises {
  background-color: #f5f5fb;
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
    .input {
      width: 90%;
      border: 1px dashed #cfcfcf;
    }
   }
   /deep/.ant-input-number{
     width:100%
   }
}
</style>
