<template>
  <div class="apply-com page-layout u-fx-ver u-type-white-bg">
    <div class="u-mar-t5">
      <u-tabs v-model="currentKey" :tab-list="menuType">
        <u-space class="u-padd-r10">
          <u-search-form class="u-padd-r10" :search-label="searchColumns.apply" @search="search"></u-search-form>
          <u-button size="small" type="light" @click="sortApp(currentKey)">应用排序</u-button>
          <u-button size="small" type="primary" icon="plus" @click="editApp(false, '添加应用')">添加应用</u-button>
        </u-space>
      </u-tabs>
    </div>
    <div class="u-fx u-fx-f1">
      <u-table is-zoom :page-list="pageList" :columns="tableColumns.apply" :table-list="appList">
        <template v-slot:slotOne="slotOne">
          <u-tag type="primary-bd" pointer>{{ slotOne.record.relationSchoolNum }}</u-tag>
        </template>
        <template v-slot:actions="action">
          <u-button type="link" @click="goDetail(action.record)">详情</u-button>
          <u-button type="link" @click="editApp(true, '编辑应用', action.record)">编辑</u-button>
          <u-button type="link" delete @click="delApp(action.record)">删除</u-button>
        </template>
      </u-table>
    </div>
    <u-pagination justify="end" v-model="pageList" :total="total" @change="getAppList(tag = false)"></u-pagination>
    <!-- 表单提价 -->
    <u-submit-form
      v-if="appStatus"
      ref="app"
      :width="600"
      @submit="submitFormApp"
      :title="appTitle"
      v-model="appStatus"
      :form-data="submitColumns.apply"
    ></u-submit-form>
    <!-- 排序弹框 -->
    <u-drawer @confirm="sortOk" title="应用排序" v-model="isSort" :width="500" ref="uDrawer">
      <draggable @end="dragEnd" element="ul" v-model="sortList">
        <li v-for="(item, index) in sortList" :key="item.appCode" class="sort-list u-fx-ac">
          <div class="tip">{{ index + 1 }}</div>
          <div>{{ item.appName }}</div>
        </li>
      </draggable>
    </u-drawer>
  </div>
</template>

<script>
import searchColumns from '../search-columns/searchColumns.js'
import tableColumns from '../table-columns/tableColumns.js'
import submitColumns from '../submit-columns/submitColumns.js'
import draggable from 'vuedraggable'
import { mapActions } from 'vuex'
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
  name: 'ApplyCom',
  components: {
    draggable
  },
  props: {
    plateformType: {
      type: String || Number,
      required: true
    }
  },
  data() {
    return {
      searchColumns,
      tableColumns,
      submitColumns,
      sortList: [],
      isSort: false,
      menuType: parseInt(this.plateformType) === 1 ? menuAll.slice(0, 3) : menuAll.slice(3),
      currentKey: parseInt(this.plateformType) === 1 ? menuAll[0].key : menuAll[3].key,
      appTitle: '',
      appStatus: false,
      appList: [],
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      total: 0,
      schoolCode: ''
    }
  },
  watch: {
    currentKey: {
      handler(n, o) {
        this.pageList.page = 1
        this.pageList.size = 20
        this.getAppList()
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('home', ['searchAppList', 'delAppList', 'addAppList', 'updateAppList', 'appSort']),
    search(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.appName = values.appName
      this.getAppList()
    },
    // 应用排序
    sortApp() {
      this.isSort = true
      this.getAppList(true)
    },
    dragEnd(evt) {
      this.newSortList = this.sortList.map((item, index) => {
        return {
          id: item.id,
          orderNum: index
        }
      })
    },
    // 排序完成后刷新
    async sortOk() {
      if (!this.newSortList) {
        this.isSort = false
        return
      }
      try {
        await this.appSort(this.newSortList)
        this.isSort = false
        this.$refs.uDrawer.reset()
        this.$message.success('排序成功')
        this.$tools.goNext(() => {
          this.getAppList()
        })
      } catch (err) {
        this.$refs.uDrawer.error()
        this.isSort = false
      }
    },
    async getAppList(tag = false) {
      let pages
      if (tag) {
        pages = {
          page: 1,
          size: 50
        }
      } else {
        pages = this.pageList
      }
      this.searchList = Object.assign(this.searchList, pages)
      const res = await this.searchAppList({
        ...this.searchList,
        plateformType: this.plateformType - 0,
        appCategoryCode: this.currentKey
      })
      if (tag) {
        this.sortList = res.data.records.map((item, index) => {
          console.log('item', item)
          return {
            id: item.id,
            appCode: item.appCode,
            appName: item.appName
          }
        })
      } else {
        this.appList = res.data.records
        this.total = res.data.total
      }
    },
    // 应用弹框
    editApp(tag, title, item = {}) {
      this.isEdit = tag
      this.appTitle = title
      if (this.isEdit) {
        this.actionFun = 'updateAppList'
        this.submitColumns.apply = this.$tools.fillForm(this.submitColumns.apply, item)
        this.submitColumns.apply[4].initValue = [{ url: item.appLogo }]
        this.id = item.id
      } else {
        this.actionFun = 'addAppList'
        this.submitColumns.apply = this.$tools.fillForm(this.submitColumns.apply, {})
      }
      this.appStatus = true
    },
    // 删除应用
    async delApp(item) {
      try {
        await this.delAppList(item.id)
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.getAppList()
        })
      } catch (err) {}
    },
    // 添加提交
    async submitFormApp(values) {
      values.appLogo = values.photoUrl[0].url
      if (this.isEdit) values.id = this.id
      const plateformType = this.plateformType
      try {
        await this[this.actionFun]({
          ...values,
          plateformType,
          appCategoryCode: this.currentKey
        })
        this.$message.success('操作成功')
        this.$refs.app.reset()
        this.$tools.goNext(() => {
          this.getAppList()
        })
      } catch (err) {
        this.$refs.app.error()
      }
    },
    goDetail(item) {
      this.$router.push({
        path: '/apply/applyDetail',
        query: {
          id: item.id,
          appCode: item.appCode,
          plateformType: this.plateformType + '',
          category: this.currentKey
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.sort-list {
  height: 40px;
  line-height: 40px !important;
  border: 1px #eee solid;
  border-radius: 2px;
  cursor: move;
  margin-bottom: 5px;
  &:hover {
    background-color: #eee;
  }
  .tip {
    margin: 0 15px;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    color: #444;
    border-radius: 100%;
    background-color: #ddd;
  }
}
</style>
