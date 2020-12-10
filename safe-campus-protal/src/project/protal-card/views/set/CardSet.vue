<template>
  <div class="card-set page-layout qui-fx-ver">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData">
    </submit-form>
    <no-data msg="暂无数据" v-if="dataList.length === 0">
      <div slot="btn">
        <a-button type="primary" @click="add(0)"> <a-icon type="plus" />添加</a-button>
      </div>
    </no-data>
    <div v-else class="qui-fx qui-fx-ver qui-fx-f1">
      <div class="top-btn-group qui-fx">
        <a-button type="primary" @click="add(0)"> <a-icon type="plus" />添加</a-button>
      </div>
      <table-list
        :page-list="pageList"
        :columns="columns"
        :table-list="dataList"
      >
        <template v-slot:other1="other1">
          <div>
            <a-switch :defaultChecked="other1.record.status" checked-children="已启用" un-checked-children="已停用" v-model="other1.record.status" />
          </div>
        </template>
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="编辑">
            <a-button size="small" class="edit-action-btn" icon="form" @click.stop="add(1, action.record)"></a-button>
          </a-tooltip>
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(action.record)">
            <template slot="title">
              您确定删除吗?
            </template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SubmitForm from '@c/SubmitForm'
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
    title: '名称',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '优惠类型',
    dataIndex: 'mobile',
    width: '15%',
    customRender: (text) => {
      return text
    }
  },
  {
    title: '每日消费限额',
    dataIndex: 'workNo',
    width: '15%'
  },
  {
    title: '每次消费限额',
    dataIndex: 'sex',
    width: '15'
  },
  {
    title: '状态',
    dataIndex: 'email',
    width: '15%',
    scopedSlots: {
      customRender: 'other1'
    }
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
    value: 'userName',
    initValue: '',
    type: 'input',
    label: '卡名称',
    placeholder: '请输入卡名称'
  },
  {
    value: 'mobile',
    initValue: '',
    type: 'numberInput',
    label: '每日消费限额',
    regular: 'phone',
    placeholder: '请输入每日消费限额'
  },
  {
    value: 'workNo',
    initValue: '',
    type: 'numberInput',
    label: '每次消费限额',
    placeholder: '请输入每次消费限额'
  },
  {
    value: 'sex',
    initValue: [],
    list: [
      {
        key: 1,
        val: '无优惠'
      },
      {
        key: 2,
        val: '折扣'
      },
      {
        key: 3,
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
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      columns,
      formData,
      formStatus: false,
      title: '添加卡类型',
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      type: 0,
      dataList: []
    }
  },
  mounted() {
    // this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getTeacherList'
    ]),
    async showList (keyword = '') {
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        orgCode: this.orgCode,
        keyword
      }
      const res = await this.getTeacherList(req)
      if (!res.data) {
        return
      }
      this.teacherList = res.data.list
      this.total = res.data.total
    },
    add(type, record) {
      this.formStatus = true
      if (type) {
        this.type = 1
        this.title = '编辑卡类型'
        this.formData = this.$tools.fillForm(formData, record)
      } else {
        this.type = 0
        this.title = '添加卡类型'
        this.formData = formData
      }
    },
    submitForm (values) {
      const req = {
        ...values
      }
      let res = null
      if (this.type === 0) {
        res = this.addTeacher(req)
      } else {
        res = this.editTeacher(req)
      }
      res.then(() => {
        if (this.type === 0) {
          this.$message.success('添加成功')
        } else {
          this.$message.success('编辑成功')
        }
        this.$tools.goNext(() => {
          this.showList()
          this.$refs.form.reset()
        })
      }).catch(() => {
        this.$refs.form.error()
      })
    },
    del(record) {
    }
  }
}
</script>
<style lang="less" scoped></style>
