<template>
  <div class="impower page-layout qui-fx-ver">
    <choose-user
      type="edu"
      is-check
      ref="form"
      v-if="userTag"
      v-model="userTag"
      @submit="submit"
      title="添加用户">
    </choose-user>
    <no-data msg="暂无用户列表" v-if="false">
      <div slot="btn">
        <a-button type="primary" @click="dialogTag = true"><a-icon type="plus" />添加用户</a-button>
      </div>
    </no-data>
    <div v-else class="qui-fx-ver qui-fx-f1">
      <search-form isReset @search-form="searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button type="primary" @click="userTag = true"><a-icon type="plus" />添加用户</a-button>
        </div>
      </search-form>
      <table-list
        is-zoom
        :page-list="pageList"
        :columns="columns"
        :table-list="userList">
        <template v-slot:actions="action">
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="deleteUser(action.record)">
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
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SubmitForm from '@c/SubmitForm'
import NoData from '@c/NoData'
import SearchForm from '@c/SearchForm'
import ChooseUser from '@c/ChooseUser'
import Tools from '@u/tools'

const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '员工姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '10%',
    customRender: (text) => {
      return Tools.getSex(text)
    }
  },
  {
    title: '手机号码',
    dataIndex: 'mobile',
    width: '10%'
  },
  {
    title: '组织机构',
    dataIndex: 'orgName',
    width: '20%'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: (text) => {
      return Tools.getDate(text).substring(0, 10)
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '10%'
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'keyWord',
    initValue: '',
    type: 'selectInput',
    selectType: [
      {
        key: 1,
        val: '姓名'
      },
      {
        key: 2,
        val: '手机号'
      },
      {
        key: 3,
        val: '工号'
      }
    ],
    placeholder: '请输入'
  }
]
export default {
  name: 'Impower',
  components: {
    NoData,
    TableList,
    PageNum,
    SubmitForm,
    ChooseUser,
    SearchForm
  },
  data () {
    return {
      userTag: false,
      title: '新增应用',
      searchLabel,
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      userList: [],
      keyWord: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted () {
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getRoleUserList', 'addRoleUser', 'deleteRoleUser'
    ]),
    submit (value) {
      if (value.length > 0) {
        const req = {
          roleId: this.$route.query.id,
          roleName: this.$route.query.name,
          schoolCode: this.userInfo.eduCode,
          userIdList: value.map(ele => {
            return ele.id
          })
        }
        this.addRoleUser(req).then(res => {
          this.$message.success('添加成功')
          this.$tools.goNext(() => {
            this.showList(this.keyWord)
            this.$refs.form.reset()
          })
        }).catch(() => {
          this.$refs.form.error()
        })
      }
    },
    onSelect (value) {
      this.searchKey = value
      if (value === 'teaname') {
        this.searchTitle = '请输入教职工姓名'
      } else if (value === 'teaphone') {
        this.searchTitle = '请输入手机号码'
      } else if (value === 'teanum') {
        this.searchTitle = '请输入工号'
      }
    },
    searchForm (values) {
      this.keyWord = values.keyWord
      this.showList(values.keyWord)
    },
    submitForm (values) {
      console.log(values)
    },
    async deleteUser (record) {
      const req = {
        schoolCode: this.userInfo.eduCode,
        roleId: this.$route.query.id,
        userId: record.id
      }
      await this.deleteRoleUser(req)
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList(this.keyWord)
      })
    },
    async showList (keyWord = '') {
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.eduCode,
        roleId: this.$route.query.id,
        keyWord
      }
      const res = await this.getRoleUserList(req)
      if (!res.data) {
        this.userList = []
        return
      }
      this.userList = res.data.list
      this.total = res.data.total
      this.$nextTick(() => {
        this.userList.forEach(ele => {
          this.$set(ele, 'roleName', this.$route.query.name)
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.impower{
  .action{
    div{
      cursor: pointer;
      img{
        width: 20px;
        height: 20px;
      }
      span{
        font-size:12px;
      }
    }
  }
}
</style>
