<template>
  <a-modal
    width="940px"
    :title="title"
    v-model="studentTag"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <div class="choose-user qui-fx">
      <div class="org-box">
        <grade-tree @select="select" :isChoose="true"></grade-tree>
      </div>
      <div class="qui-fx-ver qui-fx-f1">
        <table-list
          is-check
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
          <a-skeleton style="padding: 0 15px;" v-if="totalList.length === 0" active :paragraph="{ rows: 40 }" />
          <ul style="padding-left:0">
            <li v-for="(item, index) in totalList" :key="item.id" class="qui-fx-jsb">
              <span>{{ item.gradeName }}{{ item.className }}</span>
              <a-tag @click="delUser(item.id, index)" color="#f50">删除</a-tag>
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
import GradeTree from '@c/GradeTree'
import $ajax from '@u/ajax-serve'
import { mapState } from 'vuex'
import hostEnv from '@config/host-env'
const columns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '年级',
    dataIndex: 'gradeName',
    width: '30%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '25%'
  },
  {
    title: '班主任',
    dataIndex: 'teacherName',
    width: '25%'
  }
]
export default {
  name: 'ChooseClass',
  components: {
    PageNum,
    TableList,
    GradeTree
  },
  props: {
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
    classList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    ...mapState('home', ['schoolCode']),
    studentTag: {
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
      schoolYearId: ''
    }
  },
  mounted() {},
  methods: {
    async getUserList(type) {
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_11002}/classManage/list`,
        params: {
          schoolYearId: this.schoolYearId,
          gradeCode: this.orgCode,
          schoolCode: this.schoolCode,
          ...this.pageList
        }
      })
      this.userList = res.data.list.map(item => {
        return {
          ...item,
          id: type ? item.userCode : item.id
        }
      })
      this.total = res.data.total
    },
    select(item) {
      this.pageList.page = 1
      this.orgCode = item.gradeCode
      this.schoolYearId = item.schoolYearId
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
      this.chooseList.splice(this.chooseList.indexOf(id), 1)
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.totalList.findIndex(list => {
            return list.id === item.id
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
        const index = this.totalList.findIndex(list => list.id === item.id)
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
  margin-top: 20px;
  .org-box {
    width: 200px;
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
