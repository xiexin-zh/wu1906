<template>
  <div class="add-white">
    <a-modal
      title="课时设置"
      :visible="visible"
      @cancel="addWhiteCancel"
      :maskClosable="false"
      :destroyOnClose="true"
      :confirmLoading="confirmLoading"
      width="650px"
      @ok="addWhiteHandle"
    >
      <a-form :form="form">
        <a-form-item label="课程" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <div style="display: flex">
            <a-select
              v-decorator="['subject', { initialValue: subject, rules: [{ required: true, message: '请选择课程' }] }]"
              placeholder="请选择课程"
              @change="changeSubject"
            >
              <a-select-option v-for="item in subjectList" :key="item.id"> {{ item.subjectName }} </a-select-option>
            </a-select>
            <span>&nbsp;&nbsp;&nbsp;</span>
          </div>
        </a-form-item>
        <a-form-item label="周课时" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <div style="display: flex">
            <a-input
              placeholder="请输入周课时"
              type="number"
              min="0"
              :controls="false"
              v-decorator="[
                'count',
                {
                  initialValue: count,
                  rules: [{ required: true, message: '请输入周课时' }, { validator: handleConfirmNumber }]
                }
              ]"
            />节
          </div>
        </a-form-item>
        <a-form-item label="学期总课时" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <div style="display: flex">
            <a-input
              placeholder="学期总课时"
              type="number"
              :controls="false"
              min="0"
              v-decorator="[
                'allCount',
                {
                  initialValue: allCount,
                  rules: [{ required: true, message: '请输入学期总课时' }, { validator: handleConfirmNumber }]
                }
              ]"
            />节
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    subjectList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      confirmLoading: false,
      form: this.$form.createForm(this),
      count: '',
      subject: '',
      allCount: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {},
  methods: {
    ...mapActions('home', ['addType']),
    handleConfirmNumber(rule, value, callback) {
      if (value < 0) {
        callback('课时不能小于0')
      } else if (value.includes('.')) {
        callback('请输入整数')
      }
      callback()
    },
    addWhiteHandle(e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.$emit('submitClass', values)
        }
      })
    },
    addWhiteCancel() {
      this.$emit('cancelClass')
    },
    changeSubject(value) {
      this.form.setFieldsValue({
        subject: value
      })
    }
  }
}
</script>
<style lang="less" scoped>
.choose-input {
  border: 1px solid @bor-color;
  border-radius: @radius;
  width: 100%;
  min-height: 32px;
  line-height: 32px;
  padding: 0 10px;
  .p {
    height: 30px;
    line-height: 30px;
    color: @dark-color;
  }
}
</style>
