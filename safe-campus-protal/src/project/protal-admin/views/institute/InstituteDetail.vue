<template>
  <div class="page-layout qui-fx-ver qui-fx-f1">
    <bind-apply
      ref="bindApply"
      :plateformType="plateformType"
      :category="defaultActiveKey"
      :schoolInfo="schoolInfo"
      :bindList="bindList"
      :visible="visible"
      v-if="visible"
      @update="update"
      @close="close"
    ></bind-apply>
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    ></submit-form>
    <div class="bg-fff padd-l10 padd-r10">
      <detail-show :detail-info="detailInfo" :title="infoTitle"></detail-show>
    </div>
    <div class="qui-fx-f1 mar-t10 padd-l10 padd-r10">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane tab="pc端应用" key="1">
          <div class="app-list">
            <no-data v-if="applyList.length === 0" msg="暂无关联应用~"></no-data>
            <div
              v-else
              :class="['qui-fx-ac-jc app-check', { 'app-choose': item.check }]"
              v-for="(item, index) in applyList"
              :key="item.id"
              @click="appClick('1', index)"
            >
              <img class="right-img" :src="item.icon" alt />
              <div class="title qui-te">{{ item.name }}</div>
              <!-- <a-tooltip placement="bottomLeft" :title="item.name" v-if="item.name.length > 8">
                <div class="title">{{ item.name.substring(0,8) }}...</div>
              </a-tooltip>-->
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="移动端应用" key="2">
          <a-radio-group v-model="typeKey" button-style="solid">
            <a-radio-button value="04">教职工</a-radio-button>
            <a-radio-button value="05">家长</a-radio-button>
          </a-radio-group>
          <div class="app-list">
            <no-data v-if="mobileList.length === 0" msg="暂无关联应用~"></no-data>
            <div
              v-else
              :class="['qui-fx-ac-jc app-check', { 'app-choose': item.check }]"
              v-for="(item, index) in mobileList"
              :key="item.id"
              @click="appClick('2', index)"
            >
              <img class="right-img" :src="item.icon" alt />
              <div class="title qui-te">{{ item.name }}</div>
              <!-- <a-tooltip placement="bottomLeft" :title="item.name" v-if="item.name.length > 8">
                <div class="title">{{ item.name.substring(0,8) }}...</div>
              </a-tooltip>-->
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="管理员" key="3">
          <div v-if="userList.length !== 0">
            <table-list v-model="chooseList" :columns="userColumns" :table-list="userList">
              <!-- <template v-slot:actions="action">
                <a-tooltip placement="topLeft" title="编辑">
                  <a-button size="small" class="edit-action-btn" icon="form" @click="modifyUser(action)"></a-button>
                </a-tooltip>
              </template>-->
            </table-list>
          </div>
          <no-data msg="暂无人员列表" v-else>
            <a-button type="primary" slot="btn" @click="tabAdd">添加管理员</a-button>
          </no-data>
        </a-tab-pane>
        <span slot="tabBarExtraContent" v-if="activeTab !== '3'">
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
          @click="showDrawer"
          v-if="activeTab !== '3'"
        >
          <a-button size="small" class="add-action-btn" icon="plus"></a-button>
        </a-tooltip>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import SubmitForm from '@c/SubmitForm'
import NoData from '@c/NoData'
import DetailShow from '@c/DetailShow'
import BindApply from './BindApply'
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
  // {
  //   title: '操作',
  //   width: '25%',
  //   scopedSlots: {
  //     customRender: 'action'
  //   }
  // }
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
  name: 'InstituteDetail',
  components: {
    TableList,
    SubmitForm,
    NoData,
    DetailShow,
    BindApply
  },
  data() {
    return {
      typeKey: '04',
      defaultActiveKey: '03',
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
      bindList: [],
      applyList: [],
      mobileList: [],
      schoolInfo: {},
      chooseValue: [],
      adminId: '',
      visible: false,
      plateformType: '2'
    }
  },
  watch: {
    typeKey(n) {
      this.defaultActiveKey = n
      this.getMobileList(n)
    }
  },
  mounted() {
    this.instituteId = this.$route.query.id
    this.showInstitute(this.instituteId)
  },
  methods: {
    ...mapActions('home', [
      'searchBindApp',
      'schoolDetail',
      'queryApply',
      'delBindApp',
      'addAdmin',
      'getAdmin',
      'updateAdmin'
    ]),
    appClick(type, index) {
      if (type === '1') {
        this.applyList[index].check = !this.applyList[index].check
        this.appFilter('applyList')
      } else {
        this.mobileList[index].check = !this.mobileList[index].check
        this.appFilter('mobileList')
      }
    },
    appFilter(list) {
      this.chooseValue = this[list].filter(el => {
        return el.check
      })
    },
    showDrawer() {
      this.visible = true
      if (this.plateformType === '2') {
        this.bindList = this.applyList
      } else {
        this.bindList = this.mobileList
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
      const res = await this.schoolDetail(id)
      this.schoolInfo = res.data
      const arr = res.data.schoolStage.split(',')
      const newArr = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '01') {
          newArr.push('小学')
        } else if (arr[i] === '02') {
          newArr.push('初中')
        } else if (arr[i] === '03') {
          newArr.push('高中')
        }
      }
      this.detailInfo = [
        {
          key: '学校名称',
          val: res.data.schoolName
        },
        {
          key: '学校编码',
          val: res.data.schoolCode
        },
        {
          key: '学段',
          val: newArr.join(',')
        },
        {
          key: '创建时间',
          val: this.$tools.getDate(res.data.createTime)
        },
        {
          key: '学校地址',
          val: res.data.mergerName
            ? res.data.mergerName.substring(3).replace(/,/g, '/') + ' ' + res.data.detailAddress
            : ''
        },
        {
          key: '备注',
          val: res.data.remark
        }
      ]
      this.showList()
      this.adminGet()
    },
    // 已关联的应用
    async showList() {
      const web = await this.searchBindApp({ schoolCode: this.schoolInfo.schoolCode, plateformType: '2' })
      this.applyList = web.data.list.map(el => {
        return {
          ...el,
          check: false
        }
      })
      this.getMobileList(this.typeKey)
    },
    // 获取移动端管理应用
    async getMobileList(category) {
      const mobile = await this.searchBindApp({
        schoolCode: this.schoolInfo.schoolCode,
        plateformType: '1',
        category: category,
        page: 1,
        size: 100
      })
      this.mobileList = mobile.data.list.map(el => {
        return {
          ...el,
          check: false
        }
      })
    },
    // 管理员列表
    async adminGet() {
      const res = await this.getAdmin({ schoolCode: this.schoolInfo.schoolCode })
      if (res.data) {
        this.userList = [res.data]
      }
    },
    callback(key) {
      this.plateformType = parseInt(key) === 1 ? '2' : '1'
      this.defaultActiveKey = parseInt(key) === 1 ? '03' : this.typeKey
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
        values.schoolCode = this.schoolInfo.schoolCode
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
        schoolCode: this.schoolInfo.schoolCode
      }
      this.delBindApp(req).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.app-list {
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
