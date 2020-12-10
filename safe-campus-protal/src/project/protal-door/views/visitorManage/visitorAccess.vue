<template>
  <div class="page-layout qui-fx">
    <choose-user
      ref="user"
      v-if="chooseTag"
      @submit="submitUser"
      is-check
      v-model="chooseTag"
      title="可访问的教职工"
    ></choose-user>
    <div class="page-left">
      <org-tree @select="select"></org-tree>
    </div>
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button icon="plus" class="add-btn" @click.stop="addUser">添加</a-button>
        </div>
      </search-form>
      <table-list :page-list="pageList" :columns="columns" :table-list="userList">
        <template v-slot:actions="action">
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm.stop="del(action.record)">
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
</template>
<script>
import { mapState, mapActions } from 'vuex'
import hostEnv from '@/config/host-env'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import OrgTree from '@c/OrgTree'
import Tools from '@u/tools'
import ChooseUser from '@c/ChooseUser'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '教职工姓名',
    dataIndex: 'respondentName',
    width: '15%'
  },
  {
    title: '性别',
    dataIndex: 'respondentGender',
    width: '15%',
    customRender: text => {
      if (text === '1') {
        return '男'
      } else if (text === '2') {
        return '女'
      } else {
        return '未知'
      }
    }
  },
  {
    title: '组织机构',
    dataIndex: 'orgName',
    width: '15%'
  },
  {
    title: '手机号码',
    dataIndex: 'respondentMobile',
    width: '15%'
  },
  {
    title: '人脸照片',
    dataIndex: 'photoUrl',
    width: '15%',
    scopedSlots: {
      customRender: 'snapPic'
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
const searchLabel = [
  {
    value: 'keyword',
    type: 'selectInput',
    label: '可被访/可发出邀约的教职工',
    selectType: [
      {
        key: 'visitorName',
        val: '教职工姓名'
      },
      {
        key: 'visitorMobile',
        val: '手机号码'
      }
    ],
    placeholder: '请输入'
  }
]
export default {
  name: 'VisitorAccess',
  components: {
    TableList,
    SearchForm,
    PageNum,
    OrgTree,
    ChooseUser
  },
  data() {
    return {
      columns,
      searchLabel,
      searchList: {
        schoolCode: '',
        orgCode: ''
      },
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      userList: [],
      chooseTag: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getRespondentinfo', 'addRespondentinfo', 'delrespondentinfo', 'getrespondentinfoDetail']),
    addUser() {
      this.chooseTag = true
    },
    submitUser(item) {
      if (item.length === 0) {
        this.$message.warning('请选择')
        this.$refs.user.error()
        return false
      }
      const respondentInfoDtoList = item.map(el => {
        return {
          orgCode: el.orgCode.split(',')[1],
          orgName: el.orgName,
          photoUrl: el.photoUrl,
          respondentCode: el.userCode,
          respondentGender: el.sex,
          respondentMobile: el.mobile,
          respondentName: el.userName,
          schoolCode: this.userInfo.schoolCode,
          schoolName: this.userInfo.schoolName
        }
      })
      this.addRespondentinfo({ respondentInfoDtoList }).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.$refs.user.reset()
          this.showList()
        })
      })
    },
    async showList(searchObj = {}) {
      this.searchList.orgCode = this.orgCode
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList, searchObj)
      const res = await this.getRespondentinfo(this.searchList)
      this.userList = res.data.list
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.page = 1
      const searchObj = {
        keyword: values.keyword
      }
      this.showList(searchObj)
    },
    select(item) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.orgCode = item.code
      this.showList()
    },
    async del(item) {
      const req = {
        id: item.id
      }
      await this.delrespondentinfo(req)
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.top {
  margin-bottom: 10px;
}
</style>
