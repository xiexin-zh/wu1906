/* eslint-disable space-infix-ops */
<template>
  <div class="classpraisec page-layout qui-fx">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    ></submit-form>
    <no-data msg="暂无学生" v-if="false">
      <div slot="btn">
        <a-button type="primary" @click="_addPraise(0)"> <a-icon type="plus" />新增 </a-button>
      </div>
    </no-data>
    <div class="qui-fx qui-fx-jsb" style="width:100%; " v-else>
      <div class=" qui-fx-ver qui-fx-f1">
        <search-form isReset @search-form="searchForm" :search-label="searchLabel">
          <div slot="left">
            <a-button icon="plus" class="add-btn" @click="_addPraise(0)">新增</a-button>
            <a-button icon="delete" class="del-btn" @click.stop="deleteList(0)">批量删除</a-button>
          </div>
        </search-form>
        <table-list
          is-check
          is-zoom
          @clickRow="clickRow"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          :table-list="recordList"
        >
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="编辑">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="_addPraise(1, action.record)"
              ></a-button>
            </a-tooltip>
            <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="deleteList(1, action.record)">
              <template slot="title">
                您确定删除吗?
              </template>
              <a-tooltip placement="topLeft" title="删除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import NoData from '@c/NoData'
import PageNum from '@c/PageNum'
import SubmitForm from '@c/SubmitForm'
import SearchForm from '@c/SearchForm'
import $tools from '@u/tools'
const columns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '表扬语',
    dataIndex: 'label',
    width: '20%'
  },
  {
    title: '表扬类型',
    dataIndex: 'category',
    width: '15%',
    customRender: text => {
      if (text === 1) {
        return '班级表扬'
      } else if (text === 2) {
        return '个人表扬'
      }
    }
  },
  {
    title: '发布人',
    dataIndex: 'createUsername',
    width: '15%'
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    width: '15%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '班级表扬'
      },
      {
        key: 2,
        val: '个人表扬'
      }
    ],
    value: 'category',
    type: 'select',
    label: '表扬类型'
  }
]
const formData = [
  {
    value: 'label',
    initValue: '',
    type: 'input',
    label: '表扬语',
    max: 5,
    placeholder: '请输入表扬语，最大长度为5个字符'
  },
  {
    value: 'category',
    initValue: 1,
    list: [
      {
        key: 1,
        val: '班级表扬'
      },
      {
        key: 2,
        val: '个人表扬'
      }
    ],
    type: 'radio',
    label: '表扬类型',
    placeholder: '请选择表扬类型'
  }
]
export default {
  name: 'Compliments',
  components: {
    TableList,
    PageNum,
    SubmitForm,
    SearchForm,
    NoData
  },
  data() {
    return {
      columns,
      searchLabel,
      title: '新增',
      formStatus: false,
      formData,
      chooseList: [],
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      recordList: [],
      searchList: {
        schoolCode: ''
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
    console.log(this.userInfo)
  },
  methods: {
    ...mapActions('home', ['praiseList', 'updatePraise', 'delPraise', 'addPraise']),
    async showList(searchObj = {}) {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList, searchObj)
      const res = await this.praiseList(this.searchList)
      if (!res.data.list) {
        this.recordList = []
        return
      }
      this.recordList = res.data.list
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.page = 1
      const searchObj = {
        category: values.category
      }
      this.showList(searchObj)
    },
    _addPraise(type, record) {
      this.formStatus = true
      if (type) {
        this.title = '编辑'
        this.formData = this.$tools.fillForm(formData, record)
        this.type = 1
        this.id = record.id
      } else {
        this.title = '新增'
        this.formData = formData
        this.type = 0
      }
    },
    submitForm(values) {
      const req = {
        ...values,
        schoolCode: this.userInfo.schoolCode,
        createUsercode: this.userInfo.userCode,
        createUsername: this.userInfo.userName
      }
      let res = null
      if (this.type === 0) {
        res = this.addPraise(req)
      } else {
        req.id = this.id
        res = this.updatePraise(req)
      }
      res
        .then(() => {
          this.$message.success(this.type === 0 ? '添加成功' : '编辑成功')
          this.$tools.goNext(() => {
            this.showList()
            this.$refs.form.reset()
          })
        })
        .catch(() => {
          this.$refs.form.error()
        })
    },
    async deleteList(type, record) {
      if (type) {
        const req = {
          ids: [record.id]
        }
        await this.delPraise(req)
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      } else {
        if (this.chooseList.length === 0) {
          this.$message.warning('请选择删除项')
          return
        }
        const req = {
          ids: this.chooseList
        }
        this.$tools.delTip('您确定删除吗?', () => {
          this.delPraise(req).then(res => {
            this.$message.success('删除成功')
            this.chooseList = []
            this.$tools.goNext(() => {
              this.showList()
            })
          })
        })
      }
    },
    clickRow(id) {}
  }
}
</script>
<style lang="less" scoped></style>
