<template>
  <div class="page-layout qui-fx-ver">
    <div class="bg-fff padd-l10 padd-r10" style="height:215px">
      <a-tabs defaultActiveKey="1" @change="callback">
        <a-tab-pane tab="基本信息" key="1">
          <a-form :form="form" layout="inline">
            <a-row>
              <a-col :span="8" >
                <a-form-item label="面板机编号" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                  <a-input disabled v-decorator="['note',{ initialValue: note }]" />
                </a-form-item>
              </a-col>
              <a-col :span="8" >
                <a-form-item label="面板机型号" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                  <a-input disabled v-decorator="['note',{ initialValue: note }]" />
                </a-form-item>
              </a-col>
              <a-col :span="8" >
                <a-form-item label="学校名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                  <a-input disabled v-decorator="['note',{ initialValue: note }]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="mar-t10">
              <a-col :span="8" >
                <a-form-item label="安装日期" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                  <a-input disabled v-decorator="['note',{ initialValue: note }]" />
                </a-form-item>
              </a-col>
              <a-col :span="8" >
                <a-form-item label="安装位置" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                  <a-input disabled v-decorator="['note',{ initialValue: note }]" />
                </a-form-item>
              </a-col>
              <a-col :span="8" >
                <a-form-item label="IP地址" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                  <a-input disabled v-decorator="['note',{ initialValue: note }]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="mar-t10">
              <a-col :span="8" >
                <a-form-item label="在线状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                  <a-input disabled v-decorator="['note',{ initialValue: note }]" />
                </a-form-item>
              </a-col>
              <a-col :span="8" >
                <a-form-item label="学校管理员" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                  <a-input disabled v-decorator="['note',{ initialValue: note }]" />
                </a-form-item>
              </a-col>
              <a-col :span="8" >
                <a-form-item label="运维人员" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                  <a-input disabled v-decorator="['note',{ initialValue: note }]" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="qui-fx-f1 mar-t10 bg-fff padd-l10 padd-r10">
      暂无
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import OrgTree from '@c/OrgTree'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学校名称',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '管理员',
    dataIndex: 'marry',
    width: '10%'
  },
  {
    title: '手机号',
    dataIndex: 'birthday',
    width: '10%'
  }
]
export default {
  name: 'PanelDetail',
  components: {
    TableList,
    PageNum,
    OrgTree
  },
  data () {
    return {
      note: '1',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      chooseList: [],
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      userList: [],
      tabActive: '1'
    }
  },
  mounted () {
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getIndex'
    ]),
    async showList () {
      const res = await this.getIndex()
      this.userList = res.data
      this.total = res.total
    },
    callback (key) {
      console.log(key)
    },
    tabChange (key) {
      console.log(key)
      this.tabActive = key
    },
    handleSelectChange (value) {
      console.log(value)
      this.form.setFieldsValue({
        note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`
      })
    },
    select (item) {
      console.log(item)
    }

  }
}
</script>
<style lang="less">
.ant-form-inline .ant-form-item{
  width: 100%;
}
</style>
