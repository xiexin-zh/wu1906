<template>
  <a-modal
    width="1200px"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-row type="flex" justify="end" style="margin-bottom: 15px; margin-right: 215px">
      <a-col>
        <span>姓名/工号：</span>
        <a-input v-model="keyword" style="width: 120px;margin-right: 10px" placeholder="请输入姓名" />
        <a-button type="primary" @click="getUserList">查询</a-button>
      </a-col>
    </a-row>
    <div class="choose-user qui-fx">
      <div class="org-box">
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane key="1" tab="部门">
            <org-tree @select="select" @defaultCode="defaultCode" :type="type"></org-tree>
          </a-tab-pane>
          <a-tab-pane key="2" tab="职务">
            <a-tree
              v-if="postList.length > 0"
              @select="postSelect"
              :treeData="postList"
              :defaultExpandedKeys="defaultKey"
              :defaultSelectedKeys="defaultKey"
              showLine
            >
            </a-tree>
            <no-data v-else msg="暂无职务~"></no-data>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="qui-fx-ver qui-fx-f1">
        <table-list
          :is-check="isCheck"
          :is-radio="isRadio"
          :scroll-h="500"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          @clickRow="clickRow"
          @selectAll="selectAll"
          :table-list="userList"
        ></table-list>
        <page-num
          :jumper="false"
          v-model="pageList"
          :mar-top="20"
          :mar-bot="0"
          size="small"
          :total="total"
          @change-page="getUserList"
        ></page-num>
      </div>
      <div class="user-box qui-fx-ver">
        <div class="title qui-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}人</span>
        </div>
        <div class="qui-fx-f1" style="overflow: auto">
          <ul style="padding-left:0">
            <li v-for="(item, index) in totalList" :key="item.userCode" class="qui-fx-jsb">
              <span>{{ item.userName }}</span>
              <a-tag @click="delUser(item.userCode, index)" color="#f50">删除</a-tag>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import NoData from '@c/NoData'
import PageNum from '@c/PageNum'
import TableList from '@c/TableList'
import OrgTree from '@c/OrgTree'
import $ajax from '@u/ajax-serve'
import { mapState } from 'vuex'
import hostEnv from '@config/host-env'
const columns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '15%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '30%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '30%'
  }
]
export default {
  name: 'ChoosePost',
  components: {
    PageNum,
    TableList,
    OrgTree,
    NoData
  },
  props: {
    chooseType: {
      type: String,
      default: ''
    },
    isRadio: {
      type: Boolean,
      default: false
    },
    isCheck: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    teacherList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'eduCode']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      keyword: '',
      confirmLoading: false,
      orgCode: '',
      chooseList: [],
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      columns,
      userList: [],
      totalList: [],
      code: '',
      postList: [],
      defaultKey: [],
      postPage: {
        pageNum: 1,
        pageSize: 20
      }
    }
  },
  created() {
    this.code = this.type === 'edu' ? this.eduCode : this.schoolCode
  },
  async mounted() {
    this.teacherList.forEach(item => {
      this.chooseList.push(item.userCode)
      this.totalList.push({
        ...item,
        detailId: item.id,
        id: item.userCode
      })
    })
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_11002}/userinfo/teacher/user/queryTeacherInfo`,
        params: {
          orgCode: this.orgCode,
          keyword: this.keyword,
          schoolCode: this.code,
          ...this.pageList
        }
      })
      this.userList = res.data.list.map(item => {
        return {
          ...item,
          detailId: item.id,
          id: item.userCode
        }
      })
      this.total = res.data.total
    },
    async getPostList() {
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_10050}/edu/job/manage/queryjob/by/educode`,
        params: {
          category: '03',
          keyword: this.keyword,
          eduCode: this.code,
          pageNum: 1,
          pageSize: 999999
        }
      })
      this.postList = res.data.list.map(el => {
        return {
          ...el,
          key: el.jobCode,
          title: el.jobName
        }
      })
      this.defaultKey = [this.postList[0].key]
      this.getPostUser()
    },
    async getPostUser() {
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_11002}/userjob/query/by/schoolcode/and/jobcode`,
        params: {
          jobCode: this.defaultKey[0],
          keyword: this.keyword,
          schoolCode: this.code,
          ...this.postPage
        }
      })
      this.userList = res.data.map(item => {
        return {
          ...item,
          detailId: item.id,
          id: item.userCode
        }
      })
      this.total = res.data.total
    },
    callback(tab) {
      if (tab === '1') {
        this.getUserList()
      } else {
        this.getPostList()
      }
    },
    defaultCode(item) {
      this.orgCode = item.code[0]
    },
    select(item) {
      this.pageList.page = 1
      this.orgCode = item.code
      this.getUserList()
    },
    postSelect(item, e) {
      this.defaultKey = item
      this.postPage.pageNum = 1
      this.getPostUser()
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    delUser(id, index) {
      this.totalList.splice(index, 1)
      console.log(this.chooseList.indexOf(id))
      this.chooseList.splice(this.chooseList.indexOf(id), 1)
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.totalList.findIndex(list => {
            return list.userCode === item.userCode
          })
          this.totalList.splice(index, 1)
        })
      }
    },
    // 监听选中或取消
    clickRow(item, type) {
      if (type) {
        if (this.isCheck) {
          this.totalList.push(item)
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex(list => list.userCode === item.userCode)
        this.totalList.splice(index, 1)
      }
    },
    submitOk() {
      if (this.totalList.length === 0 && this.bindId === -1) {
        this.$message.warning('请选择人员')
        return
      }
      this.confirmLoading = true
      this.$emit('submit', this.totalList)
    }
  }
}
</script>

<style lang="less" scoped>
.choose-user {
  height: 600px;
  .org-box {
    width: 220px;
    margin-right: 20px;
  }
  .user-box {
    border: 1px #f5f5f5 solid;
    margin-left: 15px;
    width: 200px;
    .title {
      padding: 0 10px;
      background-color: #f5f5f5;
      height: 41px;
      line-height: 41px;
      border-bottom: 1px #f5f5f5 solid;
    }
    li {
      border-bottom: 1px #f5f5f5 solid;
      padding: 6px 0px 6px 8px;
    }
  }
}
</style>
