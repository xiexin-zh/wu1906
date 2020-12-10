<template>
  <div class="page-layout qui-fx-ver">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    ></submit-form>
    <div class="bg-fff padd-l10 padd-r10" style="height:185px">
      <detail-show :detail-info="detailInfo" :title="infoTitle"></detail-show>
    </div>
    <div class="qui-fx-f1 mar-t10 bg-fff padd-l10 padd-r10">
      <a-tabs defaultActiveKey="1" @change="callback">
        <a-tab-pane tab="关联应用" key="1">
          <div class="app-list">
            <no-data v-if="applyList.length === 0" msg="暂无关联应用~"></no-data>
            <div
              v-else
              :class="['qui-fx-ac-jc app-check',{'app-choose':item.check}]"
              v-for="(item, index) in applyList"
              :key="item.id"
              @click="appClick('1', index)"
            >
              <img class="right-img" :src="item.icon" alt />
              <div class="title qui-te">{{ item.name }}</div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="管理员" key="2">
          <div v-if="userList.length !== 0">
            <table-list v-model="chooseList" :columns="userColumns" :table-list="userList"></table-list>
          </div>
          <no-data msg="暂无人员列表" v-else>
            <a-button type="primary" slot="btn" @click="tabAdd">添加管理员</a-button>
          </no-data>
        </a-tab-pane>
        <a-tab-pane tab="下属机构" key="3">
          <table-list v-model="chooseList" :columns="columns" :table-list="schoolList"></table-list>
        </a-tab-pane>
        <span slot="tabBarExtraContent" v-if="activeTab === '1'">
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del">
            <template slot="title">您确定解绑选中的应用吗?</template>
            <a-tooltip placement="topLeft" title="解绑">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </span>
        <a-tooltip
          placement="topLeft"
          title="绑定"
          slot="tabBarExtraContent"
          @click="showDrawer(activeTab)"
          v-if="activeTab === '1' || activeTab === '3' "
        >
          <a-button size="small" class="add-action-btn" icon="plus"></a-button>
        </a-tooltip>
      </a-tabs>
    </div>
    <bind-apply
      ref="bindApply"
      :schoolInfo="schoolInfo"
      :bindList="applyList"
      :visible="visible"
      @update="update"
      @close="close"
    ></bind-apply>
    <bind-institute
      v-if="userTag"
      ref="bindInstitute"
      is-check
      v-model="userTag"
      @submit="chooseUser"
      :schoolInfo="schoolInfo"
    ></bind-institute>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import SubmitForm from '@c/SubmitForm'
import NoData from '@c/NoData'
import DetailShow from '@c/DetailShow'
import BindApply from './BindApply'
import BindInstitute from './BindInstitute'
const columns = [
  {
    title: '机构名称',
    dataIndex: 'eduName',
    width: '15%'
  },
  {
    title: '机构编码',
    dataIndex: 'eduCode',
    width: '15%'
  },
  {
    title: '机构层级',
    dataIndex: 'level',
    width: '15%',
    customRender: text => {
      if (text === '1') {
        return '省级'
      } else if (text === '2') {
        return '市级'
      } else {
        return '区/县级'
      }
    }
  },
  {
    title: '地区',
    dataIndex: 'mergerName',
    width: '20%'
  },
  {
    title: '详细地址',
    dataIndex: 'detailAddress',
    width: '20%'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '15%'
  }
]
const userColumns = [
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '33%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '33%'
  },
  {
    title: '注册日期',
    dataIndex: 'registeDate',
    width: '33%',
    customRender: text => {
      return (
        new Date(text).getFullYear() +
        '-' +
        (new Date(text).getMonth() + 1 > 9 ? new Date(text).getMonth() + 1 : '0' + (new Date(text).getMonth() + 1)) +
        '-' +
        (new Date(text).getDate() > 9 ? new Date(text).getDate() : '0' + new Date(text).getDate())
      )
    }
  }
]
const formData = [
  {
    value: 'userName',
    initValue: '',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  },
  {
    value: 'mobile',
    initValue: '',
    type: 'input',
    label: '手机号',
    placeholder: '请输入手机号',
    regular: 'phone'
  }
]
export default {
  name: 'BureauDetail',
  components: {
    TableList,
    SubmitForm,
    NoData,
    DetailShow,
    BindApply,
    BindInstitute
  },
  data() {
    return {
      columns,
      note: '1',
      chooseList: [],
      userColumns,
      userList: [],
      title: '',
      formStatus: false,
      formData,
      activeTab: '1',
      instituteId: '',
      detailInfo: [],
      infoTitle: '基本信息',
      applyList: [],
      schoolInfo: {},
      chooseValue: [],
      adminId: '',
      visible: false,
      plateformType: '2',
      schoolList: [],
      userTag: false
    }
  },
  mounted() {
    this.instituteId = this.$route.query.id
    this.showInstitute(this.instituteId)
  },
  methods: {
    ...mapActions('home', [
      'searchBindApp',
      'eduDetail',
      'queryApply',
      'unbindApply',
      'addAdmin',
      'getAdmin',
      'updateAdmin',
      'bindEdu',
      'getBindEdu'
    ]),
    appClick(type, index) {
      if (type === '1') {
        this.applyList[index].check = !this.applyList[index].check
        this.appFilter('applyList')
      }
    },
    appFilter(list) {
      this.chooseValue = this[list].filter(el => {
        return el.check
      })
    },
    showDrawer(type) {
      if (type === '1') {
        this.visible = true
        this.$refs.bindApply.searchValue = ''
        this.$refs.bindApply.chooseList = []
        this.$refs.bindApply.applyGetList(this.plateformType)
      } else {
        this.userTag = true
      }
    },
    update() {
      this.visible = false
      this.showList()
      this.chooseValue = []
    },
    close() {
      this.visible = false
    },
    async showInstitute(id) {
      const res = await this.eduDetail({ id: id })
      this.schoolInfo = res.data
      this.detailInfo = [
        {
          key: '机构名称',
          val: res.data.eduName
        },
        {
          key: '机构编码',
          val: res.data.eduCode
        },
        {
          key: '机构级别',
          val: res.data.level === '1' ? '省级' : res.data.level === '2' ? '市级' : '区级'
        },
        {
          key: '地区',
          val: res.data.mergerName
        },
        {
          key: '详细地址',
          val: res.data.detailAddress
        },
        {
          key: '备注',
          val: res.data.remark
        }
      ]
      this.showList()
      this.adminGet()
      this.eduGet()
    },
    // 已关联的应用
    async showList() {
      const web = await this.queryApply({ schoolCode: this.schoolInfo.schoolCode, plateformType: '2', category: '02' })
      this.applyList = web.data.list.map(el => {
        return {
          ...el,
          check: false
        }
      })
    },
    // 管理员列表
    async adminGet() {
      const res = await this.getAdmin({ schoolCode: this.schoolInfo.eduCode })
      if (res.data) {
        this.userList = [res.data]
      }
    },
    // 下属机构列表
    async eduGet() {
      const res = await this.getBindEdu({ id: this.instituteId })
      if (res.data) {
        this.schoolList = res.data
      }
    },
    callback(key) {
      this.plateformType = key === '1' ? '2' : '1'
      this.activeTab = key
    },
    tabAdd() {
      this.formStatus = true
      this.title = '添加管理员'
    },
    modifyUser(record) {
      this.formData = this.$tools.fillForm(formData, record.record)
      this.adminId = record.record.id
      this.formStatus = true
      this.title = '编辑管理员'
    },
    async submitForm(values) {
      try {
        values.schoolCode = this.schoolInfo.eduCode
        if (this.title === '编辑管理员') {
          values.id = this.adminId
          await this.updateAdmin(values)
        } else {
          await this.addAdmin(values)
        }
        this.$refs.form.reset()
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.adminGet()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    del(record) {
      if (this.chooseValue.length === 0) {
        this.$message.warning('请选择要解绑的应用')
        return
      }
      const appIdList = this.chooseValue.map(el => {
        return el.id
      })
      const req = {
        appIdList: appIdList.join(','),
        plateformType: this.plateformType,
        schoolCode: this.schoolInfo.eduCode
      }
      this.unbindApply(req).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    },
    // 添加设备
    async chooseUser(value) {
      const codes = value
        .map(el => {
          return el.eduCode
        })
        .join(',')
      const req = {
        codes: codes,
        parentId: this.instituteId
      }
      await this.bindEdu(req)
      this.$message.success('添加成功')
      this.$tools.goNext(() => {
        this.eduGet()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.app-list {
  max-height: 80vh;
  overflow: auto;
}
.app-check {
  width: 125px;
  height: 125px;
  margin: 25px 0 5px 25px;
  font-size: 14px;
  float: left;
  text-align: center;
  cursor: pointer;
  border-radius: @radius;
  -webkit-box-shadow: 2px 2px 4px #eee;
  box-shadow: 2px 2px 4px #eee;
  background: #4d4cac;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  .title {
    margin-top: 10px;
    overflow: hidden;
  }
  .right-img {
    width: 62px;
    height: 62px;
  }
}
.app-choose {
  background: #b31800 url('../../assets/img/choose-red.png') no-repeat right top;
  background-size: 25px 25px;
  border: 2px #b31800 solid;
}
</style>
