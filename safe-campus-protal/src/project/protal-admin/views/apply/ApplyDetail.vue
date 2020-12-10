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
      <a-tabs defaultActiveKey="1" @change="tabChange">
        <a-tab-pane tab="菜单配置" key="1">
          <div class="qui-fx">
            <div style="height: 500px; width: 400px" class="qui-fx">
              <config-menu
                v-if="platTag"
                :plat-type="platType"
                v-model="chooseValue"
                ref="configMenu"
              ></config-menu>
            </div>
            <div>
              <div style="margin-left: 30px; margin-top: 8px">
                <a-button type="primary" @click="iconClick">
                  <a-icon type="right" />
                </a-button>
              </div>
            </div>
            <div style="margin-left: 30px; background-color:#fffbe6">
              <menu-tree @select="select" ref="menuTree"></menu-tree>
            </div>
            <div style="margin-left: 30px">
              <a-alert message="请先勾选左侧的菜单项，然后添加到菜单模块配置中，" banner />
              <a-alert
                v-if="plateformType == '2'"
                message="如果需要配置二级目录，请点击右侧新增按钮添加一级菜单，在此菜单下新增二级菜单"
                banner
              />
              <a-alert message="配置完的菜单可以拖动排序（只限定同一级）" banner />
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="关联学校" key="2" v-if="isPlat">
          <div>
            <table-list :page-list="pageList" :columns="columns" :table-list="userList"></table-list>
            <page-num v-model="pageList" :total="total" @change-page="schoolApply"></page-num>
          </div>
        </a-tab-pane>
        <div slot="tabBarExtraContent" v-if="tabActive === '1'">
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del">
            <template slot="title">您确定要删除菜单吗?</template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
          <a-tooltip
            placement="topLeft"
            title="新增一级菜单，此菜单可继续添加二级目录"
            slot="tabBarExtraContent"
            v-if="tabActive === '1' && plateformType == '2'"
            @click="addClick"
          >
            <a-button size="small" class="add-action-btn" icon="plus"></a-button>
          </a-tooltip>
        </div>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import ConfigMenu from '@c/ConfigMenu'
import PageNum from '@c/PageNum'
import MenuTree from './MenuTree'
import SubmitForm from '@c/SubmitForm'
import DetailShow from '@c/DetailShow'
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
    dataIndex: 'schoolName',
    width: '30%'
  },
  {
    title: '管理员',
    dataIndex: 'userName',
    width: '30%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '30%'
  }
]
const formData = [
  {
    value: 'name',
    initValue: '',
    type: 'input',
    label: '菜单名称',
    placeholder: '请输入菜单名称'
  }
]
export default {
  name: 'ApplyDetail',
  components: {
    TableList,
    PageNum,
    MenuTree,
    ConfigMenu,
    SubmitForm,
    DetailShow
  },
  data() {
    return {
      detailInfo: [],
      infoTitle: '基础信息',
      note: '1',
      columns,
      pageList: {
        page: 1,
        size: 20
      },
      userList: [],
      tabActive: '1',
      chooseValue: [],
      applyInfo: {},
      applyId: '',
      total: 0,
      selectItem: {},
      formStatus: false,
      formData,
      title: '新增',
      plateformType: '',
      isPlat: false,
      platType: 0,
      platTag: false
    }
  },
  mounted() {
    this.applyId = this.$route.query.id
    this.platType = this.$route.query.platform
    this.platTag = true
    this.plateformType = this.$route.query.plateformType
    this.showApply(this.applyId)
  },
  methods: {
    ...mapActions('home', [
      'applyDetail',
      'getApplySchool',
      'addApplyMenu',
      'delApplyMenu',
      'addSysMenu',
      'definitionApply'
    ]),
    async showApply(id) {
      const res = await this.applyDetail(id)
      this.applyInfo = res.data
      this.isPlat = this.applyInfo.platform === 0
      this.detailInfo = [
        {
          key: '应用名称',
          val: res.data.appName
        },
        {
          key: '应用路径',
          val: res.data.linkUrl
        },
        {
          key: '业务地址',
          val: res.data.bussUrl
        },
        {
          key: '终端类型',
          val: res.data.plateformType === 1 ? '手机' : 'PC'
        },
        {
          key: '创建时间',
          val: this.$tools.getDate(res.data.createTime)
        },
        {
          key: '备注',
          val: res.data.remark
        }
      ]
    },
    async schoolApply() {
      this.pageList.appId = this.applyId
      const res = await this.getApplySchool(this.pageList)
      this.userList = res.data.list
      this.total = res.data.total
    },
    tabChange(key) {
      this.tabActive = key
      if (this.tabActive === '2') {
        this.schoolApply()
      } else {
        this.$refs.menuTree.initMenu()
      }
    },
    select(item) {
      this.selectItem = item
    },
    iconClick() {
      if (this.chooseValue.length === 0) {
        this.$message.warning('请选择要添加的菜单')
        return false
      }
      if (this.selectItem.url) {
        this.$message.warning('当前菜单不可添加子菜单')
        return false
      }
      if (JSON.stringify(this.selectItem) !== '{}' && !this.selectItem.url && this.selectItem.length !== 0) {
        this.chooseValue = this.filterModule(this.chooseValue, 0)
        this.definitionApply(this.chooseValue).then(res => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.chooseValue = []
            this.$refs.menuTree.initMenu()
          })
        })
      } else {
        this.chooseValue = this.filterModule(this.chooseValue, 1)
        this.addApplyMenu(this.chooseValue).then(res => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.chooseValue = []
            this.$refs.menuTree.initMenu()
          })
        })
      }
    },
    filterModule(data, type) {
      if (type) {
        data.forEach((el, index) => {
          this.$set(el, 'appId', this.applyId)
          this.$set(el, 'moduleId', el.id)
        })
      } else {
        data.forEach((el, index) => {
          this.$set(el, 'appId', this.applyId)
          this.$set(el, 'menuId', el.id)
          this.$set(el, 'moduleId', this.selectItem.id)
        })
      }
      return data
    },
    del() {
      if (JSON.stringify(this.selectItem) === '{}' || (!this.selectItem.url && this.selectItem.length === 0)) {
        this.$message.warning('请选择要删除的菜单')
        return false
      }
      const req = {
        appId: this.applyId
      }
      if (!this.selectItem.url && this.selectItem.children.length !== 0) {
        this.$message.warning('请选择子菜单删除')
        return false
      }
      if (this.selectItem.nodeId) {
        req.menuId = this.selectItem.id
        req.moduleId = this.selectItem.nodeId
      } else {
        req.moduleId = this.selectItem.id
      }
      this.delApplyMenu([req]).then(res => {
        this.$message.success('删除成功')
        this.selectItem = {}
        this.$tools.goNext(() => {
          this.$refs.menuTree.initMenu()
        })
      })
    },
    addClick() {
      this.formStatus = true
    },
    submitForm(values) {
      const req = {
        appId: this.applyId,
        menuType: '1',
        plateformType: this.plateformType
      }
      this.addSysMenu({
        ...values,
        ...req
      })
        .then(res => {
          this.$refs.form.error()
          this.formStatus = false
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.$refs.menuTree.initMenu()
          })
        })
        .catch(() => {
          this.$refs.form.error()
        })
    }
  }
}
</script>
<style lang="less" scoped>
.ant-form-inline .ant-form-item {
  width: 100%;
}
.circle {
  font-size: 22px;
  margin-left: 30px;
  margin-top: 50px;
  cursor: pointer;
}
</style>
