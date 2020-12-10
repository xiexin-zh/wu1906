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
    <div class="mar-t10 bg-fff padd-l10 padd-r10">
      <a-tabs defaultActiveKey="1" @change="tabChange">
        <a-tab-pane tab="菜单配置" key="1"></a-tab-pane>
        <a-tab-pane tab="关联学校" key="2"></a-tab-pane>
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
    <div class="qui-fx-f1 qui-fx" v-if="tabActive === '1'">
      <div style="height: 500px; width: 400px" class="qui-fx">
        <config-menu
          v-if="category"
          :category="category"
          :plateformType="plateformType"
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
      <div style="margin-left: 30px;margin-bottom: 10px; background-color:#fffbe6">
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
    <div class="qui-fx-f1 qui-fx-ver" v-if="tabActive === '2'">
      <!-- <div class="qui-fx-ver" style="height:550px"> -->
      <table-list :page-list="pageList" :columns="columns" :table-list="userList"></table-list>
      <page-num v-model="pageList" :total="total" @change-page="schoolApply"></page-num>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import ConfigMenu from './ConfigMenu'
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
  name: 'AppDetail',
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
      category: ''
    }
  },
  mounted() {
    this.appId = this.$route.query.id
    this.category = this.$route.query.category
    this.plateformType = this.$route.query.plateformType
    this.showApply(this.appId)
  },
  methods: {
    ...mapActions('home', [
      'appDetail',
      'bindTopMenu',
      'bindLevelMenu',
      'getApplySchool',
      'addApplyMenu',
      'delAppMenu',
      'addSysMenu',
      'definitionApply'
    ]),
    async showApply(id) {
      const res = await this.appDetail({
        id
      })
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
          val: res.data.businessUrl
        },
        {
          key: '终端类型',
          val: parseInt(res.data.plateformType) === 1 ? '手机' : 'PC'
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
      this.pageList.appId = this.appId
      const res = await this.getApplySchool(this.pageList)
      this.userList = res.data.list
      this.total = res.data.total
    },
    tabChange(key) {
      this.tabActive = key
      if (this.tabActive === '2') {
        this.schoolApply()
      } else {
        if (this.$refs.menuTree) {
          this.$refs.menuTree.initMenu()
        }
      }
    },
    select(item) {
      this.selectItem = item
    },
    async iconClick() {
      if (this.chooseValue.length === 0) {
        this.$message.warning('请选择要添加的菜单')
        return false
      }
      if (this.selectItem.url) {
        this.$message.warning('当前菜单不可添加子菜单')
        return false
      }
      let parentId = ''
      if (JSON.stringify(this.selectItem) !== '{}' && !this.selectItem.url && this.selectItem.length !== 0) {
        parentId = this.selectItem.key
      }
      const params = this.chooseValue.map(item => {
        return {
          appId: this.appId,
          menuId: item.id,
          parentId: parentId
        }
      })
      try {
        await this.bindLevelMenu(params)
        this.$tools.goNext(() => {
          this.chooseValue = []
          this.$refs.menuTree.initMenu()
        })
      } catch (err) {}
    },
    del() {
      if (JSON.stringify(this.selectItem) === '{}' || (!this.selectItem.url && this.selectItem.length === 0)) {
        this.$message.warning('请选择要删除的菜单')
        return false
      }
      if (!this.selectItem.url && this.selectItem.children.length !== 0) {
        this.$message.warning('请选择子菜单删除')
        return false
      }
      this.delAppMenu({
        menuId: this.selectItem.id
      }).then(res => {
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
        appId: this.appId,
        icon: '',
        menuType: 1,
        remark: ''
      }
      this.bindTopMenu({
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
