<template>
  <div class="apply-detail page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-detail-show :detail-info="detailInfo" title="基础信息"></u-detail-show>
    </u-space>
    <u-tabs @change="tabChange" :tab-list="tabList">
      <u-space class="u-padd-r10">
        <u-button v-if="tabActive === '1' && plateformType == '1'" type="danger" @click="del">删除</u-button>
        <u-button
          type="primary"
          icon="plus"
          v-if="tabActive === '1' && plateformType == '1'"
          @click="addClick"
        >添加</u-button>
      </u-space>
    </u-tabs>
    <u-space class="layout-padd">
      <div class="u-fx-f1 u-fx" v-if="tabActive === '1'">
        <div class="menu u-fx">
          <config-menu
            v-if="category"
            :category="category"
            :plateformType="plateformType"
            v-model="chooseValue"
            ref="configMenu"
          ></config-menu>
        </div>
        <div class="u-mar">
          <u-button type="primary" @click="iconClick">
            <a-icon type="right" />
          </u-button>
        </div>
        <div class="tree">
          <menu-tree @select="select" ref="menuTree"></menu-tree>
        </div>
        <div class="u-mar-l20">
          <a-alert message="请先勾选左侧的菜单项，然后添加到菜单模块配置中，" banner />
          <a-alert
            v-if="plateformType == '1'"
            message="如果需要配置二级目录，请点击右侧新增按钮添加一级菜单，在此菜单下新增二级菜单"
            banner
          />
          <a-alert message="配置完的菜单可以拖动排序（只限定同一级）" banner />
        </div>
      </div>
    </u-space>
    <div class="u-fx-f1 u-fx-ver" v-if="tabActive === '2'">
      <u-table :page-list="pageList" :columns="tableColumns.applyDetail" :table-list="userList"></u-table>
      <u-pagination justify="end" v-model="pageList" :total="total" @change="schoolApply"></u-pagination>
    </div>
    <u-submit-form
      ref="form"
      :width="600"
      @submit="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="submitColumns.applyDetail"
    ></u-submit-form>
  </div>
</template>

<script>
import tableColumns from '../../table-columns/tableColumns.js'
import submitColumns from '../../submit-columns/submitColumns.js'
import { mapActions } from 'vuex'
import ConfigMenu from '../../component/ConfigMenu'
import MenuTree from '../../component/MenuTree'
const tabList = [
  {
    key: '1',
    title: '菜单配置'
  },
  {
    key: '2',
    title: '关联学校'
  }
]
export default {
  name: 'ApplyDetail',
  components: {
    MenuTree,
    ConfigMenu
  },
  data() {
    return {
      tableColumns,
      submitColumns,
      tabList,
      detailInfo: {},
      note: '1',
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
      title: '新增',
      plateformType: '',
      category: ''
    }
  },
  mounted() {
    this.appId = this.$route.query.id
    this.appCode = this.$route.query.appCode
    this.category = this.$route.query.category
    this.plateformType = this.$route.query.plateformType
    this.showApply(this.appId)
  },
  methods: {
    ...mapActions('home', ['appDetail', 'bindTopMenu', 'bindLevelMenu', 'getApplySchool', 'delAppMenu']),
    async showApply(id) {
      const res = await this.appDetail({
        id
      })
      this.applyInfo = res.data
      this.isPlat = this.applyInfo.platform === 0
      this.detailInfo = {
        应用名称: res.data.appName,
        应用路径: res.data.appUrl,
        业务地址: res.data.appBusinessUrl,
        终端类型:
          parseInt(res.data.plateformType) === 1 ? 'PC' : parseInt(res.data.plateformType) === 2 ? '小程序' : '公众号',
        创建时间: this.$tools.getDate(res.data.createTime),
        备注: res.data.remark
      }
    },
    async schoolApply() {
      this.pageList.id = this.appId
      const res = await this.getApplySchool(this.pageList)
      this.userList = res.data.records
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
      const params = {
        appCode: this.appCode,
        relyMenuIdList: this.chooseValue.map(el => el.id),
        parentId: parentId
      }
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
      this.delAppMenu(this.selectItem.id).then(res => {
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
        appCode: this.appCode,
        plateformType: this.plateformType,
        menuCategory: this.category
      }
      this.bindTopMenu({
        ...values,
        ...req
      })
        .then(res => {
          this.$refs.form.reset()
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
.apply-detail {
  .menu {
    width: 400px;
  }
  .tree {
    background-color: #fffbe6;
  }
  .circle {
    font-size: 22px;
    margin-left: 30px;
    margin-top: 50px;
    cursor: pointer;
  }
}
.ant-form-inline .ant-form-item {
  width: 100%;
}
</style>
