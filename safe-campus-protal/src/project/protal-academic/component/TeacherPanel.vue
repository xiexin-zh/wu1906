<template>
  <a-modal
    width="70%"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-row type="flex" justify="end" style="margin-bottom: 15px">
      <a-col>
        <span>姓名/手机号：</span>
        <a-input
          v-model="keyword"
          style="width: 130px; margin-right: 10px"
          :placeholder="placeholder"
        />
        <span>状态：</span>
        <a-select v-model="state" @change="changeState" style="width: 130px; margin-right: 10px">
          <a-select-option v-for="(item, index) in searchTypeList" :key="index" :value="item.val">{{
            item.title
          }}</a-select-option>
        </a-select>
        <a-button type="primary" style="margin-right: 10px" @click="getUserList">查询</a-button>
        <a-button type="default" style="background: #e8e8e8; color: #999" @click="resetSearch"
          >重置</a-button
        >
      </a-col>
    </a-row>
    <div class="choose-user qui-fx">
      <div class="org-box">
        <org-tree @select="select" :school="school"></org-tree>
      </div>
      <div class="qui-fx-ver qui-fx-f1">
        <table-list
          isCheck
          is-zoom
          :isRadio="isRadio"
          :scroll-h="500"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          @clickRow="clickRow"
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
    </div>
  </a-modal>
</template>

<script>
import PageNum from '@c/PageNum'
import TableList from '@c/TableList'
import OrgTree from '@c/OrgTree'
import { mapState, mapActions } from 'vuex'
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '18%'
  },
  {
    title: '状态',
    dataIndex: 'onJob',
    width: '10%',
    customRender: text => {
      return text === '1' ? '在职' : '离职'
    }
  },
  {
    title: '照片',
    dataIndex: 'photoUrl',
    width: '15%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  }
]
export default {
  name: 'TeacherPanel',
  components: {
    PageNum,
    TableList,
    OrgTree
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    school: {
      type: String,
      default: ''
    },
    isRadio: {
      type: Boolean,
      default: true
    },
    isCheck: {
      type: Boolean,
      default: false
    },
    selectList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState('home', ['schoolCode']),
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
      state: '',
      keyword: '',
      placeholder: '请输入姓名/手机号',
      searchTypeList: [
        {
          val: '',
          title: '全部'
        },
        {
          val: 1,
          title: '在职'
        },
        {
          val: 0,
          title: '离职'
        }
      ],
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
      searchList: {},
      searchObj: {}
    }
  },
  created() {},
  mounted() {
    this.chooseList = this.selectList
    this.getUserList()
  },
  methods: {
    ...mapActions('home', ['getTeacherList']),
    // 获取教师列表
    async getUserList(searchObj = {}) {
      const req = {
        ...this.pageList,
        ...searchObj,
        keyword: this.keyword,
        onJob: this.state,
        schoolCode: this.schoolCode,
        orgCode: this.orgCode
      }
      const res = await this.getTeacherList(req)
      if (!res.data) {
        return
      }
      this.userList = res.data.list
      this.total = res.data.total
    },
    select(item) {
      this.orgCode = item.code
      this.getUserList()
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
        const index = this.totalList.findIndex(list => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    },
    resetSearch() {
      this.keyword = ''
      this.state = ''
      this.getUserList()
    },
    changeState(val) {
      this.searchType = val
    },
    submitOk() {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择教职工')
        return
      }
      const list = this.userList.filter(item => {
        return this.chooseList.indexOf(item.id) !== -1
      })
      this.$emit('submit', this.isRadio ? list[0] : list)
    }
  }
}
</script>

<style lang="less" scoped>
.choose-user {
  height: 600px;
  .org-box {
    overflow-x: hidden;
    width: 240px;
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
