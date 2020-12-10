<template>
  <a-modal
    width="650px"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    @cancel="closeModal"
    :confirmLoading="confirmLoading"
    :footer="null"
  >
    <div class="content u-font-2 u-bold u-mar-b10 u-tips-color">
      {{ formData.label }}。&nbsp;({{ formData.type }})
    </div>
    <div v-if="formData.type==='单选题'" class="options">
      <a-radio-group v-model="formData.checkedValue[0]" >
        <a-radio v-for="(item,index) in formData.options" :key="index" :style="radioStyle" :value="item.key">
          {{ item.val }}
        </a-radio>
      </a-radio-group>
    </div>
    <div v-else class="options">
      <a-checkbox-group v-model="formData.checkedValue" >
        <a-row v-for="(item,index) in formData.options" :key="index">
          <a-col :span="24">
            <a-checkbox :value="item.key" v-model="item.selected">
              {{ item.val }}
            </a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group>
    </div>
  </a-modal>
</template>
<script>
import moment from 'moment'
export default {
  name: 'SubmitForm',
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formItemLayout: {
      type: Object,
      default: () => {
        return {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        }
      }
    }
  },
  computed: {
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      moment,
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    closeModal() {
      this.$emit('closeModal')
    },
    error() {
      this.confirmLoading = false
    },
    onSearch(value) {
      this.$emit('onSearch', value)
    },
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log(values)
          for (const key in values) {
            if (values[key]._f === 'HH:mm') {
              values[key] = moment(values[key]).format('HH:mm')
            }
            if (values[key]._f === 'YYYY-MM-DD') {
              values[key] = moment(values[key]).format('YYYY-MM-DD')
            }
            if (values[key] instanceof Array && values[key][0]._isAMomentObject) {
              values[key] = [moment(values[key][0]).format('YYYY-MM-DD'), moment(values[key][1]).format('YYYY-MM-DD')]
            }
          }
          this.confirmLoading = true
          this.$emit('submit-form', values)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
