<template>
  <a-modal
    :destroyOnClose="true"
    v-model="status"
    width="600px"
    title="积分规则修改"
    :footer="null"
    @cancel="close">
    <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item v-if="ruleType==='1'" label="积分规则：">
        从&nbsp; <a-input-number
          v-model.number="form.startCount"
          :formatter="value=>(value+'').replace(/^(0+)|[^\d]+/g, '')"
          :parser="value=>value.replace(/^(0+)|[^\d]+/g, '')"
          style="width:80px" />&nbsp;调开始累加，每记录一条信息得&nbsp;<a-input-number
            v-model.number="form.grade"
            :formatter="value=>(value+'').replace(/^(0+)|[^\d]+/g, '')"
            :parser="value=>value.replace(/^(0+)|[^\d]+/g, '')"
            style="width:80px" />&nbsp;分
      </a-form-model-item>
      <a-form-model-item v-if="ruleType==='1'" label="计分范围：">
        累计上限数量&nbsp;<a-input-number
          :disabled="form.highestCount===-1"
          v-model.number="form.highestCount"
          :formatter="value=>(value+'').replace(/^(0+)|[^\d]+/g, '')"
          :parser="value=>value.replace(/^(0+)|[^\d]+/g, '')"
          style="width:100px" />
        <a-button class="u-mar-l10" @click="setDisabled" type="primary">不设上限</a-button>
      </a-form-model-item>
      <a-form-model-item v-if="ruleType!=='1'" label="项目分值：">
        <a-input-number
          style="width:80%"
          v-model="form.grade"
          :formatter="value=>(value+'').replace(/^(0+)|[^\d]+/g, '')"
          :parser="value=>value.replace(/^(0+)|[^\d]+/g, '')"
        />
        <div v-if="ruleType==='2'">
          说明：按学校完成率计分，实际得分=完成率*项目分值<br>
          举例：若学校完成率为90%，项目分值为10分，则学校实际得分为9分（90%*10=9）
        </div>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit">
          确定
        </a-button>
        <a-button @click="reset" style="margin-left: 10px;">
          取消
        </a-button>
      </a-form-model-item>
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
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      leijia: false,
      ruleType: '1', // 规则类型(1：累加型；2：完成率型；3：完成与否型)
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      form: {
        startCount: '',
        grade: '',
        highestCount: ''
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
    setDisabled() {
      this.form.highestCount = -1
      this.form.highestGrade = '不限'
    },
    async onSubmit() {
      const req = {
        'eduCode': this.userInfo.schoolCode,
        ...this.form
      }
      await this.ruleModify(req)
      this.$message.success('操作成功')
      this.$parent.showList()
      this.reset()
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
