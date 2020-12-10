<template>
  <a-modal
    :title="title"
    v-model="addVisible"
    :destroyOnClose="true"
    :maskClosable="false"
    width="940px"
    @ok="addSubmit"
    :okButtonProps="{ props: { disabled: isLoad } }"
    :cancel-button-props="{ props: { disabled: isView } }"
  >
    <a-form :form="form">
      <div>
        <a-form-item label="收费项" v-bind="formItemLayout">
          <a-select @change="chooseCharge" placeholder=" 请选择收费项">
            <a-select-option
              v-for="(item, i) in chargeList"
              :key="i"
              :value="`${item.itemName}+${item.itemCode}+${item.itemPrice}`"
              >{{ item.itemName }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="收费标准" v-bind="formItemLayout"
          >{{ this.unitPrice == '' ? '0' : this.unitPrice }}元/期</a-form-item
        >
      </div>
      <a-form-item v-bind="formItemLayout" label="数量">
        <a-input-number
          v-model="value"
          style="width: 50%;"
          :min="1"
          :formatter="value => (value + '').replace(/^(0+)|[^\d]+/g, '')"
          :parser="value => value.replace(/^(0+)|[^\d]+/g, '')"
        />
      </a-form-item>
      <a-form-item label="总金额" v-bind="formItemLayout"
        >{{ this.totalPrice == '' ? '0' : this.totalPrice }}元</a-form-item
      >
    </a-form>
  </a-modal>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'AddCount',
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 }
      },
      isLoad: false,
      addVisible: false,
      form: this.$form.createForm(this),
      isView: false,
      chargeList: [],
      pageList: {
        pageNum: 1,
        pageSize: 20
      },
      value: 1,
      type: 1,
      itemVOList: [],
      totalPrice: '',
      unitPrice: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  watch: {
    value(val) {
      this.totalPrice = Number(this.unitPrice) * Number(val)
    }
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getSelect']),
    chooseCharge(value) {
      this.unitPrice = value.split('+')[2]
      this.itemCode = value.split('+')[1]
      this.itemName = value.split('+')[0]
    },
    async showList() {
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getSelect(req)
      this.chargeList = res.data.records
    },
    addSubmit(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        if (!error) {
          this.itemVOList.push({
            itemCode: this.itemCode,
            itemName: this.itemName,
            itemNum: this.value,
            itemPrice: this.unitPrice,
            totalMoneySum: this.totalPrice
          })
          console.log(this.itemVOList)
          this.addVisible = false
          this.isLoad = false
          this.$message.success('添加成功')
          this.$emit('getList', this.itemVOList)
          this.$tools.goNext(() => {
            this.$emit('update')
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
