<template>
  <div class="apply-com page-layout u-fx-ver u-type-white-bg">
    <div class="u-mar-t5">
      <u-tabs v-model="currentKey" :tab-list="tabList">
        <u-space class="u-padd-r10">
          <u-search-form
            :search-label="searchLabel"
            @search="search"
            class="layout-padd-l layout-padd-r"
          ></u-search-form>
          <u-button type="primary" icon="plus" @click="editMenu(false, '添加菜单')">添加菜单</u-button>
        </u-space>
      </u-tabs>
    </div>
    <div class="u-fx u-fx-f1">
      <menu-manage
        :menuCategory="currentKey"
        :plateformType="plateformType"
        @choose="chooseOneMenu"
      ></menu-manage>
      <div class="u-fx-ver u-fx-f1">
        <u-table :page-list="pageList" :columns="columns" :table-list="menuList">
          <template v-slot:actions="action">
            <u-button type="link" @click="editMenu(true, '编辑菜单', action.record)">编辑</u-button>
            <u-button type="link" delete @click="delMenu(action.record)">删除</u-button>
          </template>
        </u-table>
        <u-pagination justify="end" v-model="pageList" :total="total" @change="getMenuList"></u-pagination>
      </div>
    </div>
    <!-- 表单 -->
    <u-submit-form
      ref="form"
      @submit="submit"
      :title="menuTitle"
      v-if="menuStatus"
      v-model="menuStatus"
      :form-data="plateformType === '1' ? formData.menuFormData : formData.appmenuFormData"
    ></u-submit-form>
  </div>
</template>

<script>
import columns from '../table-columns/menus'
import formData from '../submit-columns/menus'
import searchLabel from '../search-columns/menus'
import MenuManage from './MenuManage'
import { mapState, mapActions } from 'vuex'
const menuAll = [
  {
    key: '1',
    title: '校端'
  },
  {
    key: '2',
    title: '局端'
  },
  {
    key: '3',
    title: '运营端'
  },
  {
    key: '4',
    title: '教职工'
  },
  {
    key: '5',
    title: '家长'
  }
]
export default {
  name: 'MenuCom',
  components: {
    MenuManage
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  props: {
    plateformType: {
      //	终端类型（1-pc端，2-小程序端，3-公众号端）
      type: String || Number,
      default: '1',
      required: true
    }
  },
  data() {
    return {
      columns,
      formData,
      searchLabel,
      tabList: parseInt(this.plateformType) === 1 ? menuAll.slice(0, 3) : menuAll.slice(3),
      currentKey: parseInt(this.plateformType) === 1 ? menuAll[0].key : menuAll[3].key,
      menuTitle: '',
      menuStatus: false,
      menuList: [],
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      searchList: {}
    }
  },
  created() {
    console.log('plateformType', this.plateformType)
    if (parseInt(this.plateformType) === 1) {
      this.columns = columns.filter(item => item.dataIndex !== 'menuIcon')
    }
  },
  methods: {
    ...mapActions('home', ['getTwoMenuList', 'addMenu', 'updateMenu', 'removeMenu']),
    // 切换一级菜单
    chooseOneMenu(value) {
      if (!value) {
        this.menuList = []
        this.total = 0
        return
      }
      console.log(value)
      this.pageList.page = 1
      this.pageList.size = 20
      this.parentId = value.id
      this.getMenuList()
    },
    // 搜索菜单
    search(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.menuName = values.menuName
      this.getMenuList()
    },
    // 查询菜单列表
    async getMenuList() {
      const res = await this.getTwoMenuList({
        ...this.searchList,
        ...this.pageList,
        parentId: this.parentId
      })
      this.menuList = res.data.records
      this.total = res.data.total
    },
    // 编辑菜单
    editMenu(tag, title, item = {}) {
      this.isEdit = tag
      this.menuTitle = title
      if (this.isEdit) {
        this.actionFun = 'updateMenu'
        if (parseInt(this.plateformType) === 1) {
          this.formData.menuFormData = this.$tools.fillForm(this.formData.menuFormData, item)
        } else {
          this.formData.appmenuFormData = this.$tools.fillForm(this.formData.appmenuFormData, item)
          this.formData.appmenuFormData[2].initValue = [{ url: item.menuIcon }]
        }
        this.id = item.id
      } else {
        if (!this.parentId) {
          this.$message.warning('请先添加分类')
          return
        }
        this.actionFun = 'addMenu'
        if (parseInt(this.plateformType) === 1) {
          this.formData.menuFormData = this.$tools.fillForm(this.formData.menuFormData, {})
        } else {
          this.formData.appmenuFormData = this.$tools.fillForm(this.formData.appmenuFormData, {})
        }
      }
      this.menuStatus = true
    },
    // 删除菜单
    async delMenu(item) {
      try {
        await this.removeMenu(item.id)
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.getMenuList()
        })
      } catch (err) {}
    },
    async submit(values) {
      if (this.isEdit) values.id = this.id
      try {
        await this[this.actionFun]({
          ...values,
          menuCategory: this.currentKey,
          menuIcon: parseInt(this.plateformType) === 3 ? values.photoUrl[0].url : undefined,
          menuType: 2,
          parentId: this.parentId,
          plateformType: this.plateformType
        })
        this.$message.success('操作成功')
        this.$refs.form.reset()
        this.$tools.goNext(() => {
          this.getMenuList()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
