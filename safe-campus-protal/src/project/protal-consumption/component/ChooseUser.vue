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
    <div class="choose-user qui-fx">
      <div class="qui-fx-ver qui-fx-f1">
        <a-tabs v-model="activeKey" @change="tabChange">
          <a-tab-pane tab="学生" key="1" class="">
            <div class="qui-fx-f1">
              <search-form isReset @search-form="classSearch" :search-label="searchLabel"></search-form>
            </div>
            <div class="qui-fx">
              <div class="org-box u-auto">
                <grade-tree @select="classSelect"></grade-tree>
              </div>
              <div class="qui-fx-ver qui-fx-f1">
                <table-list
                  :minHeight="460"
                  :scroll-h="430"
                  is-radio
                  :page-list="pageList"
                  v-model="classChooseList"
                  :columns="columns1"
                  @clickRow="clickRow"
                  :table-list="classTableList"
                >
                  <template v-slot:other2="record">{{ record.record.gradeName }}{{ record.record.className }}</template>
                </table-list>
                <page-num
                  :jumper="false"
                  v-model="pageList"
                  :mar-top="20"
                  :mar-bot="0"
                  size="small"
                  :total="total"
                  @change-page="showList('class')"
                ></page-num>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="教职工" key="2" class="">
            <div class="qui-fx-f1">
              <search-form isReset @search-form="teaSearch" :search-label="searchLabel"></search-form>
            </div>
            <div class="qui-fx">
              <div class="org-box u-auto">
                <org-tree @select="teaSelect" @defaultCode="defaultCode"></org-tree>
              </div>
              <div class="qui-fx-f1">
                <table-list
                  :minHeight="460"
                  :scroll-h="430"
                  is-radio
                  :page-list="pageList"
                  v-model="teaChooseList"
                  :columns="columns2"
                  @clickRow="clickRow"
                  :table-list="teaTableList"
                >
                </table-list>
                <page-num
                  :jumper="false"
                  v-model="pageList"
                  :mar-top="20"
                  :mar-bot="0"
                  size="small"
                  :total="total"
                  @change-page="showList('teachers')"
                ></page-num>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </a-modal>
</template>

<script>
import PageNum from '@c/PageNum'
import GradeTree from '@c/GradeTree'
import OrgTree from '@c/OrgTree'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import { mapState } from 'vuex'
import $ajax from '@u/ajax-serve'
import hostEnv from '@config/host-env'
const searchLabel = [
  {
    value: 'userName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  }
]
const columns1 = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '30%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '25%'
  },
  {
    title: '学号',
    dataIndex: 'workNo',
    width: '25%'
  }
]
const columns2 = [
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
const columns3 = [
  {
    title: '序号',
    width: '25%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '绑定场地',
    dataIndex: 'placeName',
    width: '25%'
  },
  {
    title: '安装位置',
    dataIndex: 'site',
    width: '25%',
    customRender: text => {
      return parseInt(text) === 1 ? '室内' : '室外'
    }
  },
  {
    title: '关联数据',
    dataIndex: 'className',
    width: '25%',
    scopedSlots: {
      customRender: 'other2'
    }
  }
]
export default {
  name: 'ChooseUser',
  components: {
    TableList,
    SearchForm,
    GradeTree,
    OrgTree,
    PageNum
  },
  props: {
    isCheck: {
      type: Boolean,
      default: true
    },
    chooseType: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    bindObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
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
      confirmLoading: false,
      activeKey: '1',
      keyword: '',
      classChooseList: [],
      teaChooseList: [],
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      searchLabel,
      columns1,
      columns2,
      columns3,
      searchList: {},
      classTableList: [],
      deviceTableList: [],
      teaTableList: [],
      classTotalList: [],
      teaTotalList: [],
      deviceTotalList: [],
      buildList: [],
      classList: []
    }
  },
  created() {},
  async mounted() {
    this.showList('class')
  },
  methods: {
    tabChange(val) {
      if (val === '1') {
        this.showList('class')
      } else if (val === '2') {
        this.showList('teachers')
      }
    },
    async showList(type) {
      if (type === 'class') {
        const res = await $ajax.get({
          url: `${hostEnv.protal_api_11031}/accountInfo/listStudent`,
          params: {
            gradeId: this.gradeCode,
            classId: this.classCode,
            keyword: this.keyword,
            schoolYearId: this.schoolYearId,
            ...this.pageList,
            flag: '0'
          }
        })
        this.total = res.total
        this.classTableList = res.rows
      } else if (type === 'teachers') {
        const res = await $ajax.get({
          url: `${hostEnv.protal_api_11031}/accountInfo/listTeacher`,
          params: {
            orgCode: this.orgCode,
            keyword: this.keyword,
            ...this.pageList,
            flag: '0'
          }
        })
        this.total = res.total
        this.teaTableList = res.rows.map(item => {
          return {
            ...item,
            id: item.userCode
          }
        })
      }
      this.classChooseList = []
      this.teaChooseList = []
      this.chooseUser = ''
    },
    teaSearch(values) {
      this.keyword = values.userName
      this.showList('teachers')
    },
    classSearch(values) {
      this.keyword = values.userName
      this.showList('class')
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    error() {
      this.confirmLoading = false
    },
    /**
     * @description 点击选中人员
     */
    clickRow(item) {
      this.chooseUser = item
    },
    submitOk() {
      if (!this.chooseUser) {
        this.$message.warning('请选择用户')
        return
      }
      this.$emit('submit', { userType: this.activeKey, ...this.chooseUser })
    },
    classSelect(item) {
      this.gradeCode = item.gradeCode
      this.classCode = item.classCode
      this.schoolYearId = item.schoolYearId
      this.showList('class')
    },
    teaSelect(item) {
      this.orgCode = item.code
      this.showList('teachers')
    },
    defaultCode(item) {
      this.orgCode = item.code[0]
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
    .choose-list {
      height: 520px;
    }
    li {
      border-bottom: 1px #f5f5f5 solid;
      padding: 6px 0px 6px 8px;
    }
  }
}
/deep/ .ant-modal-body {
  padding: 14px;
}
/deep/ .ant-tabs-bar {
  margin-bottom: 0;
}
.search-form {
  padding-bottom: 5px;
}
</style>
