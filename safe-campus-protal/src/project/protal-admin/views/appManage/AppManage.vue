<template>
  <div class="qui-fx-f1 app-manage qui-bg-fff qui-fx-ver">
    <a-drawer
      width="500"
      title="应用排序"
      placement="right"
      :closable="false"
      :visible="isSort"
      @close="isSort = false"
    >
      <div style="padding-bottom: 20px; overflow:auto">
        <draggable @end="dragEnd" element="ul" v-model="sortList">
          <li v-for="(item, index) in sortList" :key="item.appCode" class="sort-list qui-fx-ac">
            <div class="tip">{{ index + 1 }}</div>
            <div>{{ item.appName }}</div>
          </li>
        </draggable>
      </div>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="isSort = false">取消</a-button>
        <a-button type="primary" @click="sortOk">确定</a-button>
      </div>
    </a-drawer>
    <submit-form ref="app" @submit-form="submitFormApp" :title="appTitle" v-model="appStatus" :form-data="appFormData">
      <div slot="upload">
        <upload-multi :length="1" v-model="fileList" :fileInfo="fileInfo"></upload-multi>
      </div>
    </submit-form>
    <a-tabs v-model="currentKey">
      <a-tab-pane v-for="menu in menuType" :key="menu.key" :tab="menu.val"></a-tab-pane>
      <div slot="tabBarExtraContent">
        <a-button icon="export" class="export-btn" @click="sortApp(currentKey)">应用排序</a-button>
        <a-button icon="plus" class="add-btn" @click="editApp(false, '添加应用')">添加应用</a-button>
      </div>
    </a-tabs>
    <div class="qui-fx-f1 qui-fx">
      <table-list :page-list="pageList" :columns="columns" :table-list="appList">
        <template v-slot:other1="other1">
          <a-tag color="green">{{ other1.record.schoolCount }}</a-tag>
        </template>
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="详情">
            <a-button
              size="small"
              class="detail-action-btn"
              icon="ellipsis"
              @click="goDetail(action.record)"
            ></a-button>
          </a-tooltip>
          <a-tooltip placement="topLeft" title="编辑">
            <a-button
              @click="editApp(true, '编辑应用', action.record)"
              size="small"
              class="edit-action-btn"
              icon="form"
            ></a-button>
          </a-tooltip>
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="delApp(action.record)">
            <template slot="title">您确定删除吗?</template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </table-list>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="getAppList"></page-num>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapActions } from 'vuex'
import SubmitForm from '@c/SubmitForm'
import PageNum from '@c/PageNum'
import $tools from '@u/tools'
import TableList from '@c/TableList'
import UploadMulti from '@c/UploadMulti'
const menuAll = [
  {
    key: '01',
    val: '运维端'
  },
  {
    key: '02',
    val: '局端'
  },
  {
    key: '03',
    val: '校端'
  },
  {
    key: '04',
    val: '教职工'
  },
  {
    key: '05',
    val: '家长'
  }
]
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '应用名称',
    dataIndex: 'appName',
    width: '10%'
  },
  {
    title: '应用编码',
    dataIndex: 'appCode',
    width: '8%'
  },
  {
    title: '业务地址',
    dataIndex: 'businessUrl',
    width: '24%'
  },
  {
    title: '应用logo',
    dataIndex: 'logoUrl',
    width: '10%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '关联学校',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '创建日期',
    dataIndex: 'createTime',
    width: '15%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const appFormData = [
  {
    value: 'appName',
    initValue: '',
    type: 'input', // numberInput: 纯数字文本框
    label: '应用名称',
    max: 8, // 最大长度
    placeholder: '请输入应用名称，最大长度为8个字符'
  },
  {
    value: 'appCode',
    initValue: '',
    type: 'input', // numberInput: 纯数字文本框
    label: '应用编码',
    placeholder: '请输入应用编码'
  },
  {
    value: 'linkUrl',
    initValue: '',
    type: 'input', // numberInput: 纯数字文本框
    label: '应用路径',
    max: 300,
    placeholder: '请输入应用路径'
  },
  {
    value: 'businessUrl',
    initValue: 'http://127.0.0.1',
    type: 'input', // numberInput: 纯数字文本框
    label: '业务地址',
    placeholder: '请输入业务地址'
  },
  {
    type: 'upload',
    label: '上传图标'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'input', // numberInput: 纯数字文本框
    label: '备注',
    required: false,
    placeholder: '请输入备注'
  }
]
export default {
  name: 'AppManage',
  components: { SubmitForm, PageNum, TableList, UploadMulti, draggable },
  props: {
    plateformType: {
      type: String || Number,
      default: 2
    }
  },
  data() {
    return {
      sortList: [],
      isSort: false,
      menuType: parseInt(this.plateformType) === 2 ? menuAll.slice(0, 3) : menuAll.slice(3),
      currentKey: parseInt(this.plateformType) === 2 ? menuAll[0].key : menuAll[3].key,
      appTitle: '',
      fileInfo: {
        tip: '上传图标',
        h: 120, // 高度
        w: 120 // 宽度
      },
      fileList: [],
      columns,
      appFormData,
      appStatus: false,
      appList: [],
      pageList: {
        page: 1,
        size: 20
      },
      total: 0
    }
  },
  watch: {
    currentKey: {
      handler(n, o) {
        this.getAppList()
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    ...mapActions('home', ['searchAppList', 'delAppList', 'addAppList', 'updateAppList', 'appSort']),
    // 应用排序
    sortApp() {
      this.isSort = true
      this.getAppList(true)
    },
    dragEnd(evt) {
      this.newSortList = this.sortList.map((item, index) => {
        return {
          appCode: item.appCode,
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
        this.$message.success('排序成功')
        this.$tools.goNext(() => {
          this.getAppList()
        })
      } catch (err) {
        this.isSort = false
      }
    },
    goDetail(item) {
      this.$router.push({
        path: '/app/detail',
        query: {
          id: item.id,
          plateformType: this.plateformType + '',
          category: this.currentKey
        }
      })
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
      const res = await this.searchAppList({
        ...pages,
        keyword: '',
        plateformType: this.plateformType - 0,
        category: this.currentKey
      })
      if (tag) {
        this.sortList = res.data.list.map((item, index) => {
          return {
            appCode: item.appCode,
            appName: item.appName
          }
        })
      } else {
        this.appList = res.data.list
        this.total = res.data.total
      }
    },
    editApp(tag, title, item = {}) {
      this.isEdit = tag
      this.appTitle = title
      if (this.isEdit) {
        this.actionFun = 'updateAppList'
        this.fileList = [{ url: item.logoUrl }]
        this.appFormData = this.$tools.fillForm(appFormData, item)
        this.id = item.id
      } else {
        this.fileList = []
        this.actionFun = 'addAppList'
        this.appFormData = appFormData
      }
      this.appStatus = true
    },
    async delApp(item) {
      try {
        await this.delAppList({
          appId: item.id
        })
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.getAppList()
        })
      } catch (err) {}
    },
    async submitFormApp(values) {
      if (this.fileList.length === 0) {
        this.$message.warning('请上传图片')
        this.$refs.app.error()
      }
      if (this.isEdit) values.id = this.id
      const plateformType = this.plateformType
      try {
        await this[this.actionFun]({
          plateformType,
          logoUrl: this.fileList[0].url,
          ...values,
          category: this.currentKey
        })
        this.$message.success('操作成功')
        this.$refs.app.reset()
        this.$tools.goNext(() => {
          this.getAppList()
        })
      } catch (err) {
        this.$refs.app.error()
      }
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
