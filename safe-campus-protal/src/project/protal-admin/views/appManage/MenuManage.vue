<template>
  <div class="qui-fx-f1 qui-bg-fff qui-fx">
    <submit-form
      ref="level"
      @submit-form="submitFormLevel"
      :title="title"
      v-model="levelStatus"
      :form-data="levelFormData"
    ></submit-form>
    <submit-form
      ref="menu"
      @submit-form="submitFormMenu"
      :title="menuTitle"
      v-model="menuStatus"
      :form-data="menuFormData"
    >
      <div slot="upload">
        <upload-multi :length="1" v-model="fileList" :fileInfo="fileInfo"></upload-multi>
      </div>
    </submit-form>
    <div class="menu-left qui-fx-ver">
      <div>
        <a-radio-group v-model="currentKey" button-style="solid">
          <a-radio-button v-for="menu in menuType" :key="menu.key" :value="menu.key">{{ menu.val }}</a-radio-button>
        </a-radio-group>
      </div>
      <div class="qui-fx-f1">
        <ul class="menu-type">
          <li
            :class="[{ act: currentIndex === index }, 'qui-fx-ac']"
            @click="chooseLevel(level, index)"
            v-for="(level, index) in levelList"
            :key="level.id"
          >
            <div style="width: 120px">{{ level.menuName }}</div>
            <div v-if="currentIndex === index">
              <a-button
                @click.stop="editLevel(true, '编辑菜单分类', level)"
                size="small"
                class="edit-action-btn"
                icon="form"
              ></a-button>
              <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm.stop="delLevel(level)">
                <template slot="title">您确定删除吗?</template>
                <a-tooltip placement="topLeft" title="删除">
                  <a-button @click.stop size="small" class="del-action-btn" icon="delete"></a-button>
                </a-tooltip>
              </a-popconfirm>
            </div>
          </li>
          <li class="add-menu">
            <a-button icon="plus" @click="editLevel(false, '新增菜单')">新增分类</a-button>
          </li>
        </ul>
      </div>
    </div>
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form isReset @search-form="searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button icon="plus" type="primary" @click="editMenu(false, '新增菜单')">新增菜单</a-button>
        </div>
      </search-form>
      <div class="qui-fx-f1 qui-fx">
        <table-list :page-list="pageList" :columns="columns" :table-list="menuList">
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="编辑">
              <a-button
                size="small"
                @click="editMenu(true, '编辑菜单', action.record)"
                class="edit-action-btn"
                icon="form"
              ></a-button>
            </a-tooltip>
            <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="delMenu(action.record)">
              <template slot="title">您确定删除吗?</template>
              <a-tooltip placement="topLeft" title="删除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </table-list>
      </div>
      <page-num v-model="pageList" :total="total" @change-page="getMenuList"></page-num>
    </div>
  </div>
</template>

<script>
import SearchForm from '@c/SearchForm'
import SubmitForm from '@c/SubmitForm'
import PageNum from '@c/PageNum'
import TableList from '@c/TableList'
import $tools from '@u/tools'
import UploadMulti from '@c/UploadMulti'
import { mapActions } from 'vuex'
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
const searchLabel = [
  {
    value: 'menuName', // 表单属性
    type: 'input', // 表单类型
    label: '菜单名称', // 表单label值
    placeholder: '请输入名称' // 表单默认值(非必选字段)
  }
]
const levelFormData = [
  {
    value: 'menuName',
    initValue: '',
    type: 'input', // numberInput: 纯数字文本框
    label: '菜单名称',
    max: 8, // 最大长度
    placeholder: '请输入菜单分类名称，最大长度为8个字符'
  }
]
const menuFormData = [
  {
    value: 'menuName',
    initValue: '',
    type: 'input', // numberInput: 纯数字文本框
    label: '菜单名称',
    max: 8, // 最大长度
    placeholder: '请输入菜单分类名称，最大长度为8个字符'
  },
  {
    value: 'linkUrl',
    initValue: '',
    type: 'input', // numberInput: 纯数字文本框
    label: '菜单路径',
    max: 300,
    placeholder: '请输入菜单路径'
  },
  {
    type: 'upload',
    label: '上传图像'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'input', // numberInput: 纯数字文本框
    label: '备注',
    required: false,
    max: 20, // 最大长度
    placeholder: '请输入备注'
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
    title: '菜单名称',
    dataIndex: 'menuName',
    width: '15%'
  },
  {
    title: '菜单路径',
    dataIndex: 'linkUrl',
    width: '24%'
  },
  {
    title: '菜单图标',
    dataIndex: 'icon',
    width: '10%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '18%'
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
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'MenuManage',
  components: { SearchForm, SubmitForm, PageNum, TableList, UploadMulti },
  props: {
    plateFormType: {
      type: String || Number,
      default: 2
    }
  },
  data() {
    return {
      menuType: parseInt(this.plateFormType) === 2 ? menuAll.slice(0, 3) : menuAll.slice(3),
      currentKey: parseInt(this.plateFormType) === 2 ? menuAll[0].key : menuAll[3].key,
      fileInfo: {
        tip: '上传图标',
        h: 120, // 高度
        w: 120 // 宽度
      },
      fileList: [],
      levelList: [],
      columns,
      menuList: [],
      title: '',
      searchLabel,
      searchText: {},
      currentLevel: '',
      currentIndex: 0,
      levelFormData,
      levelStatus: false,
      menuStatus: false,
      menuFormData,
      menuTitle: '',
      pageList: {
        page: 1,
        size: 20
      },
      total: 0
    }
  },
  mounted() {},
  watch: {
    currentKey: {
      handler(n, o) {
        this.levelAllList()
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('home', [
      'addLevelType',
      'updateLevel',
      'getLevelList',
      'delLevelList',
      'getLevelMenuList',
      'delLevelMenuList',
      'updateLevelMenuList',
      'addLevelMenuList'
    ]),
    searchForm(values = {}) {
      this.searchText = values
      this.pageList.page = 1
      this.getMenuList()
    },
    editLevel(tag, title, item = {}) {
      this.isEdit = tag
      this.title = title
      if (this.isEdit) {
        this.actionFun = 'updateLevel'
        this.levelFormData = this.$tools.fillForm(levelFormData, item)
        this.id = item.id
      } else {
        this.actionFun = 'addLevelType'
        this.levelFormData = levelFormData
      }
      this.levelStatus = true
    },
    editMenu(tag, title, item = {}) {
      this.isEdit = tag
      this.menuTitle = title
      if (this.isEdit) {
        this.actionFun = 'updateLevelMenuList'
        this.fileList = [{ url: item.icon }]
        this.menuFormData = this.$tools.fillForm(menuFormData, item)
        this.id = item.id
      } else {
        if (!this.currentLevel) {
          this.$message.warning('请选择左侧菜单分类')
          return
        }
        this.fileList = []
        this.actionFun = 'addLevelMenuList'
        this.menuFormData = menuFormData
      }
      this.menuStatus = true
    },
    async levelAllList() {
      const res = await this.getLevelList({
        category: this.currentKey,
        plateFormType: this.plateFormType,
        ...this.pageList
      })
      this.levelList = res.data
      if (this.levelList.length === 0) {
        this.menuList = []
        this.currentLevel = ''
      } else {
        this.currentIndex = 0
        this.currentLevel = this.levelList[0]
        this.getMenuList()
      }
    },
    chooseLevel(item, index) {
      this.pageList = {
        page: 1,
        size: 20
      }
      this.currentLevel = item
      this.currentIndex = index
      this.getMenuList()
    },
    async getMenuList() {
      const res = await this.getLevelMenuList({
        menuName: this.searchText.menuName || '',
        ...this.pageList,
        parentId: this.currentLevel.id
      })
      this.menuList = res.data.list
      this.total = res.data.total
    },
    async delLevel(item) {
      try {
        await this.delLevelList({
          id: item.id
        })
        this.$message.success('删除成功')
        this.levelList.splice(
          this.levelList.findIndex(val => val.id === item.id),
          1
        )
        this.$tools.goNext(() => {
          if (this.levelList.length === 0) return
          this.chooseLevel(this.levelList[0], 0)
        })
      } catch (err) {}
    },
    async submitFormLevel(values) {
      if (this.isEdit) values.id = this.id
      try {
        await this[this.actionFun]({
          category: this.currentKey,
          ...values,
          plateFormType: this.plateFormType
        })
        this.$message.success('操作成功')
        this.$refs.level.reset()
        this.$tools.goNext(() => {
          this.levelAllList()
        })
      } catch (err) {
        this.$refs.level.error()
      }
    },
    async delMenu(item) {
      try {
        await this.delLevelMenuList({
          id: item.id
        })
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.getMenuList()
        })
      } catch (err) {}
    },
    async submitFormMenu(values) {
      if (this.fileList.length === 0) {
        this.$message.warning('请上传图片')
        this.$refs.menu.error()
        return
      }
      if (this.isEdit) values.id = this.id
      try {
        await this[this.actionFun]({
          icon: this.fileList[0].url,
          ...values,
          parentId: this.currentLevel.id
        })
        this.$message.success('操作成功')
        this.$refs.menu.reset()
        this.$tools.goNext(() => {
          this.getMenuList()
        })
      } catch (err) {
        this.$refs.menu.error()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.menu-left {
  width: 220px;
  margin: 5px;
  text-align: center;
  padding: 5px;
  .menu-type {
    padding-top: 10px;
    li {
      cursor: pointer;
      height: 40px;
      line-height: 40px;
      border-radius: 2px;
      border-bottom: 1px #f5f5f5 solid;
      &.act {
        background-color: #eee;
        color: #999;
      }
    }
    .add-menu {
      margin-top: 30px;
      color: #999;
      height: 35px;
      line-height: 35px;
      border-bottom: none;
    }
  }
}
</style>
