<template>
  <div class="card-set page-layout qui-fx-ver">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
      @radioChange="radioChange"
    ></submit-form>
    <no-data msg="暂无数据" v-if="dataList.length === 0">
      <!-- <div slot="btn">
        <a-button type="primary" @click="add(0)"> <a-icon type="plus" />添加 </a-button>
      </div> -->
    </no-data>
    <div v-else class="qui-fx qui-fx-ver qui-fx-f1">
      <!-- <div class="top-btn-group qui-fx">
        <a-button type="primary" @click="add(0)"> <a-icon type="plus" />添加 </a-button>
      </div> -->
      <table-list :page-list="pageList" :columns="columns" :table-list="dataList">
        <template v-slot:other1="other1">
          <div>
            {{ other1.record.preferType === '0' ? '无优惠' : other1.record.preferType === '1' ? '折扣' : '减免' }}
            ({{ other1.record.preferType === '1' ? other1.record.discount + '折' : other1.record.remit }})
          </div>
        </template>
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="编辑">
            <a-button size="small" class="edit-action-btn" icon="form" @click.stop="add(1, action.record)"></a-button>
          </a-tooltip>
          <!-- <a-popconfirm v-if="action.record.userType !== '1' && action.record.userType !== '2'" placement="left" okText="确定" cancelText="取消" @confirm="del(action.record)">
            <template slot="title">您确定删除吗?</template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm> -->
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SubmitForm from '../../component/SubmitForm'
import { Switch } from 'ant-design-vue'
import NoData from '@c/NoData'
import PageNum from '@c/PageNum'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '身份',
    dataIndex: 'userType',
    width: '20%'
  },
  {
    title: '优惠类型',
    dataIndex: 'preferType',
    width: '20%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '每日消费限额',
    dataIndex: 'everydayConsume',
    width: '20%'
  },
  {
    title: '单次消费限额',
    dataIndex: 'singleConsume',
    width: '20%'
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const formData = [
  {
    value: 'userType',
    initValue: '3',
    list: [],
    disabled: true,
    type: 'radio',
    label: '身份',
    placeholder: '请选择身份'
  },
  {
    value: 'everydayConsume',
    initValue: '',
    type: 'numberInput',
    label: '每日消费限额',
    regular: 'phone',
    placeholder: '请输入每日消费限额'
  },
  {
    value: 'singleConsume',
    initValue: '',
    type: 'numberInput',
    label: '单次消费限额',
    placeholder: '请输入单次消费限额'
  },
  {
    value: 'preferType',
    initValue: [],
    list: [
      {
        key: '0',
        val: '无优惠'
      },
      {
        key: '1',
        val: '折扣'
      },
      {
        key: '2',
        val: '减免'
      }
    ],
    type: 'radio',
    label: '优惠类型',
    placeholder: '请选择优惠类型'
  }
]
export default {
  name: 'CardSet',
  components: {
    TableList,
    PageNum,
    NoData,
    SubmitForm,
    ASwitch: Switch
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  data() {
    return {
      columns,
      formData,
      formStatus: false,
      title: '添加消费规则',
      total: 0,
      pageList: {
        page: 1,
        size: 9999
      },
      type: 0,
      dataList: []
    }
  },
  mounted() {
    this._getDictList('user_type', 'userType')
  },
  methods: {
    ...mapActions('home', ['getRuleList', 'editRule', 'addRule', 'delRule', 'getDictList']),
    async _getDictList(type, text) {
      this.formData[0].list = []
      const res = await this.getDictList(type)
      res.data.forEach((ele) => {
        this.formData[0].list.push({
          key: ele.dictValue,
          val: ele.dictLabel
        })
      })
      const index = this.columns.findIndex(list => list.dataIndex === text)
      this.columns[index].customRender = (text) => {
        return res.data.filter(ele => ele.dictValue === text).length > 0 ? res.data.filter(ele => ele.dictValue === text)[0].dictLabel : ''
      }
      this.showList()
    },
    async showList(keyword = '') {
      const res = await this.getRuleList({
        ...this.pageList,
        schoolCode: this.schoolCode
      })
      this.dataList = res.data.records
      this.total = res.total
    },
    add(type, record) {
      this.formStatus = true
      if (type) {
        this.type = 1
        this.record = record
        this.title = '编辑消费规则'
        this.formData = this.$tools.fillForm(formData, record)
        this.radioChange(record.preferType, record)
      } else {
        this.type = 0
        this.title = '添加消费规则'
        this.formData = formData
        if (this.formData.length === 5) {
          this.formData.splice(4, 1)
        }
      }
    },
    radioChange(value, record) {
      if (value === '0') {
        this.formData.splice(4, 1)
      } else if (value === '1') {
        this.formData[4] = {
          value: 'discount',
          initValue: record ? record.discount : '',
          type: 'numberInput',
          label: '折扣比例',
          placeholder: '请输入折扣比例'
        }
      } else if (value === '2') {
        this.formData[4] = {
          value: 'remit',
          initValue: record ? record.remit : '',
          type: 'numberInput',
          label: '减免金额',
          placeholder: '请输入减免金额'
        }
      }
    },
    submitForm(values) {
      const req = {
        ...values,
        schoolCode: this.schoolCode
      }
      let res = null
      if (this.type === 0) {
        res = this.addRule(req)
      } else {
        req.id = this.record.id
        res = this.editRule(req)
      }
      res
        .then(() => {
          if (this.type === 0) {
            this.$message.success('添加成功')
          } else {
            this.$message.success('编辑成功')
          }
          this.$tools.goNext(() => {
            this.showList()
            this.$refs.form.reset()
          })
        })
        .catch(() => {
          this.$refs.form.error()
        })
    },
    del(record) {
      this.delRule(record.id).then((res) => {
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
