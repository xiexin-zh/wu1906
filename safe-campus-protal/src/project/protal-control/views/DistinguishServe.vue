<template>
  <div class="class page-layout qui-fx">
    <submit-form ref="form" @submit-form="submitForm" :title="title" v-model="formStatus" :form-data="formData">
    </submit-form>
    <div class="qui-fx qui-fx-jsb" style="width:100%" >
      <div class="left">
        <div class="control-tab">
          <service-list @change="changeTab"></service-list>
        </div>
      </div>
      <div class="right qui-fx-ver qui-fx-f1">
        <div class="qui-fx-jsb qui-fx-ac mar-b10">
          <div class="tip-banner qui-fx-f2">
            <a-row>
              <a-col :span="8">服务IP：{{ detailInfo.serverIp }}</a-col>
              <a-col :span="8">服务ID：{{ detailInfo.serverCode }}</a-col>
              <a-col :span="8">状态：{{ detailInfo.status === 1 ? '在线' : '不在线' }}</a-col>
            </a-row>
          </div>
          <div class="qui-fx-je qui-fx-f1">
            <a-button style="margin-right: 5px;" type="primary" icon="plus" @click="addServerInfo(false, '新增消息队列')" >新增消息队列</a-button>
          </div>
        </div>
        <table-list
          :page-list="pageList"
          :columns="distinguishServeColumns"
          :table-list="ServerinfoList">
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="编辑">
              <a-button @click="addServerInfo(true, '编辑消息队列', action.record)" size="small" class="edit-action-btn" icon="form"></a-button>
            </a-tooltip>
            <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="delServerInfo(action)">
              <template slot="title">
                您确定删除吗?
              </template>
              <a-tooltip placement="topLeft" title="删除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="getServerInfoList"></page-num>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import DetailShow from '@c/DetailShow'
import SubmitForm from '@c/SubmitForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import ServiceList from '../component/ServiceList'
import distinguishServeColumns from '../assets/js/table/distinguishServeColumns'
const formData = [
  {
    value: 'queueType',
    initValue: [],
    type: 'select',
    label: '队列类型',
    list: [
      {
        key: 1,
        val: 'rabbitMQ'
      },
      {
        key: 2,
        val: 'mqtt'
      }
    ],
    placeholder: '请选择队列类型'
  },
  {
    value: 'exchange',
    initValue: '',
    type: 'input',
    label: '交换机名称',
    placeholder: '请输入交换机名称'
  },
  {
    value: 'queueName',
    initValue: '',
    type: 'input',
    label: '队列名称',
    placeholder: '请输入队列名称'
  },
  {
    value: 'remarks',
    initValue: '',
    type: 'input',
    label: '备注',
    placeholder: '请输入备注'
  }
]
export default {
  name: 'FaceRecord',
  components: {
    TableList,
    PageNum,
    SubmitForm,
    ServiceList,
    DetailShow
  },
  computed: {
    ...mapState('home', [
      'schoolCode'
    ])
  },
  data () {
    return {
      title: '添加识别服务',
      total: 0,
      formData,
      distinguishServeColumns,
      formStatus: false,
      pageList: {
        page: 1,
        size: 20
      },
      ServerinfoList: [],
      searchText: {
        serverName: '',
        status: ''
      },
      detailInfo: {}

    }
  },
  methods: {
    ...mapActions('home', [
      'getRelationList',
      'updateRelationServerInfo',
      'addRelationServerInfo',
      'delRelationServerInfo'
    ]),
    async changeTab (item) {
      this.code = item.key
      this.detailInfo = item
      this.getServerInfoList()
    },
    async getServerInfoList () {
      this.getRelationList({
        ...this.pageList,
        relationCode: this.code,
        schoolCode: this.schoolCode
      }).then(res => {
        this.ServerinfoList = res.data.list
        this.total = res.data.total
      })
    },
    addServerInfo (type, title, record) {
      this.title = title
      this.isEdit = type
      if (type) {
        this.id = record.id
        this.queueCode = record.queueCode
        this.formData = this.$tools.fillForm(formData, record)
      } else {
        this.formData = formData
      }
      this.formStatus = true
    },
    async submitForm (values) {
      try {
        if (this.isEdit) {
          await this.updateRelationServerInfo({
            id: this.id,
            queueCode: this.queueCode,
            relationCode: this.code,
            schoolCode: this.schoolCode,
            ...values
          })
        } else {
          await this.addRelationServerInfo({
            relationCode: this.code,
            schoolCode: this.schoolCode,
            ...values
          })
        }
        this.$refs.form.reset()
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.getServerInfoList()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    async delServerInfo (action) {
      this.delRelationServerInfo({
        id: action.record.id,
        schoolCode: this.schoolCode,
        relationCode: action.record.relationCode,
        relationType: action.record.relationType
      })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.getServerInfoList()
      })
    }
  }
}

</script>

<style lang="less" scoped>
.qui-fx-f1{
  padding-left: 10px;
}
.add-msg{
  padding: 8px 0 15px 0;
  text-align: right;
}
.control-tab{
  width: 250px;
background-color: #fff;}
</style>
