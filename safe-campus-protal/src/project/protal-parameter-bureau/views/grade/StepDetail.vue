<template>
  <a-modal
    :destroyOnClose="true"
    v-model="status"
    width="1100px"
    title="流水详情"
    :footer="null"
    @cancel="close">
    <a-form-model
      v-for="(item,index) in operations"
      :key="index"
      ref="ruleForm"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <a-form-model-item label="操作人" >
        <div>
          {{ item.operatorName }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ item.operatedTime |gmtToDate }}
        </div>
        <div v-for="(item2,index2) in item.itemList" :key="index2">
          <span class="text-bg u-bg-color u-padd-l40 u-padd-r40 u-mar-r20 u-padd-t5 u-padd-b5">{{ item2.itemType }}</span>
          <span class="text-bg  u-bg-color  u-padd-l20 u-padd-r20 u-padd-t5 u-padd-b5 u-mar-r10">{{ item2.specificContent }}</span>
          <span class="text-bg  u-bg-color u-padd-l10 u-padd-r10 u-padd-t5 u-padd-b5 u-mar-r10">{{ item2.ruleDescription }}</span>
          <span class="text-bg  u-bg-color u-padd-l20 u-padd-r20 u-padd-t5 u-padd-b5 u-mar-r10">系统得分：{{ item2.sysGrade }}分</span>
          <span class="text-bg u-padd-l10 u-padd-r10  u-bg-color u-padd-t5 u-padd-b5 u-mar-r10">已加/减分:{{ item2.changeGrade }}</span>
        </div>
      </a-form-model-item>
      <a-form-model-item label="加/减分说明">
        <a-textarea disabled placeholder="非必填项" v-model="item.remark" :rows="4" />
      </a-form-model-item>
      <!-- <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit">
          确定
        </a-button>
        <a-button style="margin-left: 10px;">
          取消
        </a-button>
      </a-form-model-item> -->
    </a-form-model>
  </a-modal>
</template>
<script>
import PageNum from '@c/PageNum'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'PreviewReport',
  components: {
    PageNum
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    operations: {
      type: Array,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      highestCountState: false, // 上限input状态
      ruleType: '1', // 规则类型(1：累加型；2：完成率型；3：完成与否型)
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
      form: {
        des: 'dfdgf'
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
    status: {
      get() {
        // return true
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  watch: {
  },
  async created() {

  },
  methods: {
    ...mapActions('home', [
      'ruleModify'
    ]),
    async onSubmit() {

    },
    setData(record) {
      this.ruleType = record.ruleType
      this.form = record
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    close() {
      this.$emit('closeModal')
    },
    error() {
      this.confirmLoading = false
    }
  }
}
</script>
<style lang="less" scoped>
.text-bg{
  // padding-left: 10px;
}
</style>
