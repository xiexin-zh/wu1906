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
    <a-alert message="温馨提示：一个学科只能选择一位任课教师。" banner style="margin-bottom:10px" />
    <a-row type="flex" justify="end" style="margin-bottom: 15px; margin-right: 215px">
      <a-col>
        <span>姓名：</span>
        <a-input v-model="teacherName" style="width: 120px;margin-right: 10px" placeholder="请输入姓名" />
        <a-button style="margin-right: 10px" type="primary" @click="getTeacherList()">查询</a-button>
      </a-col>
    </a-row>
    <div class="choose-user qui-fx">
      <no-data v-if="noData" msg="暂无学科~"></no-data>
      <div class="org-box u-auto">
        <a-tree
          v-if="subjectList.length > 0"
          @select="select"
          :treeData="subjectList"
          :defaultSelectedKeys="defaultKey"
          showLine
        >
        </a-tree>
      </div>
      <div class="qui-fx-ver qui-fx-f1">
        <table-list
          :is-radio="isRadio"
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
          @change-page="getTeacherList"
        ></page-num>
      </div>
      <div class="user-box qui-fx-ver">
        <div class="title qui-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}人</span>
        </div>
        <div class="qui-fx-f1" style="overflow: auto">
          <ul style="padding-left:0">
            <li v-for="(item, index) in totalList" :key="item.subjectName + '^' + item.teacherCode" class="qui-fx-jsb">
              <span>{{ item.subjectName }} - {{ item.teacherName }}</span>
              <a-tag @click="delUser(item.subjectName + '^' + item.teacherCode, index)" color="#f50">删除</a-tag>
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
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'teacherName',
    width: '10%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '20%'
  },
  {
    title: '工号',
    dataIndex: 'userNo',
    width: '20%'
  },
  {
    title: '人脸照片',
    dataIndex: 'photoSrc',
    width: '30%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  }
]
export default {
  name: 'ChooseSubteacher',
  components: {
    PageNum,
    TableList,
    OrgTree,
    NoData
  },
  props: {
    bindObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    chooseType: {
      type: String,
      default: ''
    },
    isRadio: {
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
    checkData: {
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
      teacherName: '',
      confirmLoading: false,
      noData: false,
      subjectCode: '',
      subjectName: '',
      chooseList: [],
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      columns,
      userList: [],
      totalList: [],
      subjectList: [],
      defaultKey: ''
    }
  },
  watch: {
    subjectName: {
      handler(newValue, oldValue) {
        if (oldValue === '') {
          this.totalList.forEach(ele => {
            if (ele.subjectName === this.subjectName) {
              this.chooseList = [ele.teacherCode]
            }
          })
        }
      },
      deep: true
    }
  },
  created() {
    this.showSubList()
  },
  async mounted() {},
  methods: {
    async showSubList() {
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_10050}/school/subject/list`,
        params: {
          schoolCode: this.schoolCode,
          enable: '1'
        }
      })
      if (res.data === null || res.data.length === 0) {
        this.noData = true
        return
      } else {
        this.noData = false
      }
      this.defaultKey = [res.data[0].subjectCode]
      this.subjectCode = res.data[0].subjectCode
      this.subjectName = res.data[0].subjectName
      this.getTeacherList()
      res.data.forEach(ele => {
        this.subjectList.push({
          key: ele.subjectCode,
          title: ele.subjectName
        })
      })
      this.teacherList.forEach((ele, i) => {
        const index = res.data.findIndex(list => list.subjectName === ele.subjectName)
        if (index === -1) {
          this.teacherList.splice(i, 1)
        }
      })
      this.teacherList.forEach((ele, index) => {
        if (ele.subjectName.split(',').length > 1) {
          ele.subjectName.split(',').forEach((item, i) => {
            this.totalList.push({
              ...ele,
              subjectName: item,
              subjectCode: ele.subjectCode.split(',')[i]
            })
          })
        } else {
          this.totalList.push(ele)
        }
      })
    },
    async getTeacherList(type = false) {
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_10050}/subject/teacher/list`,
        params: {
          pageNum: this.pageList.page,
          pageSize: this.pageList.size,
          schoolCode: this.schoolCode,
          subjectCode: this.subjectCode,
          teacherName: this.teacherName
        }
      })
      this.userList = res.data.list.map(item => {
        return {
          ...item,
          id: item.teacherCode,
          subjectName: this.subjectName,
          subjectCode: this.subjectCode
        }
      })
      this.total = res.data.total
    },
    select(item, info) {
      if (info.selected) {
        this.pageList.page = 1
        this.subjectCode = item[0]
        this.subjectName = info.selectedNodes[0].data.props.title
        this.getTeacherList()
        let chooseArr = []
        chooseArr = this.totalList.filter(item => {
          return item.subjectName === this.subjectName
        })
        this.chooseList = chooseArr.length > 0 ? [chooseArr[0].teacherCode] : []
      }
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
      if (id.split('^')[0] === this.subjectName) {
        this.chooseList = []
      }
    },
    // 监听选中或取消
    clickRow(item, type) {
      if (type) {
        const index = this.totalList.findIndex(list => list.subjectName === item.subjectName)
        if (index !== -1) {
          this.totalList.splice(index, 1)
        }
        this.totalList.push(item)
      } else {
        const index = this.totalList.findIndex(list => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    },
    submitOk() {
      if (this.totalList.length === 0) {
        this.$message.warning('请选择人员')
        return
      }
      this.totalList.forEach(ele => {
        if (!ele.subjectCode) {
          ele.subjectCode = this.subjectList.filter(item => {
            return item.title === ele.subjectName
          })[0].key
        }
      })
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
