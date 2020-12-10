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
        <a-input v-model="keyword" style="width: 120px; margin-right: 10px" placeholder="请输入姓名" />
        <a-button type="primary" @click="getUserList">查询</a-button>
      </a-col>
    </a-row>
    <div class="choose-user qui-fx">
      <div class="org-box u-auto">
        <org-tree @select="select" @defaultCode="defaultCode"></org-tree>
      </div>
      <div class="qui-fx-ver qui-fx-f1">
        <table-list
          :is-check="isCheck"
          :is-radio="isRadio"
          :minHeight="500"
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
          <ul style="padding-left: 0">
            <li v-for="(item, index) in totalList" :key="item.userCode" class="qui-fx-jsb">
              <span>{{ item.userName }}</span>
              <a-tag v-if="!item.disabled" @click="delUser(item.userCode, index)" color="#f50">删除</a-tag>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import PageNum from '@c/PageNum'
import TableList from '@c/TableList'
import OrgTree from '@c/OrgTree'
import $ajax from '@u/ajax-serve'
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
    width: '20%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '20%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '20%'
  },
  {
    title: '部门',
    dataIndex: 'orgName',
    width: '20%'
  }
]
export default {
  name: 'ChooseUser',
  components: {
    PageNum,
    TableList,
    OrgTree
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
    value: {
      type: Boolean,
      default: false
    },
    chooseorgList: {
      type: Array,
      default: () => {
        return []
      }
    },
    teacherList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
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
      totalList: []
    }
  },
  created() {},
  mounted() {
    /* let list = []
    this.chooseorgList.forEach(async (ele) => {
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_11031}/accountInfo/listTeacher`,
        params: {
          orgCode: ele.value,
          index: 1,
          size: 999999
        }
      })
      if (res.rows && res.rows.length > 0) {
        list = list.concat(res.rows.map(el => {
          return {
            ...el,
            disabled: true
          }
        }))
      }
    })
    list = list.concat(this.teacherList)
    this.$tools.goNext(() => {
      list = list.concat(this.teacherList)
      console.log(list)
      this.teacherList.forEach((item) => {
        this.chooseList.push(item.userCode)
        this.totalList.push({
          ...item,
          id: item.userCode
        })
      })
      this.getUserList()
    }) */
    this.teacherList.forEach(item => {
      this.chooseList.push(item.userCode)
      this.totalList.push({
        ...item,
        id: item.userCode
      })
    })
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_11031}/accountInfo/listTeacher`,
        params: {
          orgCode: this.orgCode,
          keyword: this.keyword,
          ...this.pageList,
          flag: '1'
        }
      })
      if (!res.rows || res.rows.length === 0) {
        this.userList = []
        return
      }
      const arr = this.chooseorgList.map(el => {
        return el.value
      })
      this.userList = res.rows.map(item => {
        return {
          ...item,
          id: item.userCode,
          disabled:
            arr.length > 0 &&
            item.orgCode.split(',').find(i => arr.includes(i)) &&
            item.orgCode.split(',').find(i => arr.includes(i)).length > 0
        }
      })
      this.total = res.total
    },
    defaultCode(item) {
      this.orgCode = item.code[0]
    },
    select(item) {
      this.pageList.page = 1
      console.log(item)
      this.orgCode = item.code
      this.getUserList()
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    error() {
      this.confirmLoading = false
    },
    delUser(id, index) {
      this.totalList.splice(index, 1)
      console.log(this.chooseList.indexOf(id))
      this.chooseList.splice(this.chooseList.indexOf(id), 1)
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = item.concat(this.totalList)
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
          this.totalList.unshift(item)
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
    width: 250px;
  }
  .user-box {
    border: 1px #f5f5f5 solid;
    margin-left: 15px;
    width: 250px;
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
