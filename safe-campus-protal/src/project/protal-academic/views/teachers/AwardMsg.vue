<template>
  <div class="students page-layout qui-fx">
    <sub-form
      ref="form"
      @submit-form="submitForm"
      @selectPanel="showSelectPanel"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    >
      <template slot="selectPanel">
        <a-input
          placeholder="请选择"
          :read-only="true"
          :disabled="selectDisabled"
          @focus="showSelectPanel"
          v-model="teacherName"
        >
          <a-icon slot="suffix" type="right" />
        </a-input>
      </template>
    </sub-form>
    <teacher-panel
      title="选择获奖教职工"
      v-if="panelStatus"
      v-model="panelStatus"
      @submit="confirmSelect"
    ></teacher-panel>
    <div class="qui-fx qui-fx-jsb" style="width: 100%">
      <div class="right qui-fx-ver qui-fx-f1" style="padding-right: 10px">
        <search-form isReset @search-form="searchForm" :search-label="searchLabel">
          <div slot="left">
            <a-button icon="plus" class="add-btn" @click="addAward(0)">添加</a-button>
          </div>
        </search-form>
        <table-list
          is-zoom
          @clickRow="clickRow"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          :table-list="awardList"
        >
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="编辑">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="addAward(1, action.record)"
              ></a-button>
            </a-tooltip>
            <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="deleteList(action.record)">
              <template slot="title"> 您确定删除吗? </template>
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
import PageNum from '@c/PageNum'
import SubForm from '../../component/SubForm'
import TeacherPanel from '../../component/TeacherPanel'
import SearchForm from '@c/SearchForm'
import Tools from '@u/tools'
import moment from 'moment'
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '教职工姓名',
    dataIndex: 'userName',
    width: '8%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '荣誉称号',
    dataIndex: 'honoraryTitle',
    width: '8%'
  },
  {
    title: '级别',
    dataIndex: 'levelName',
    width: '8%'
  },
  {
    title: '嘉奖单位',
    dataIndex: 'awardUnit',
    width: '8%'
  },
  {
    title: '获奖日期',
    dataIndex: 'awardDate',
    width: '15%',
    customRender: (text) => {
      return Tools.getDate(text, 1)
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
const searchLabel = [
  {
    value: 'time',
    type: 'rangeTime',
    label: '时间'
  },
  {
    value: 'keyword',
    type: 'input',
    label: '姓名/工号'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '国家级'
      },
      {
        key: 2,
        val: '省级'
      },
      {
        key: 3,
        val: '市级'
      },
      {
        key: 4,
        val: '区级'
      },
      {
        key: 5,
        val: '县级'
      },
      {
        key: 6,
        val: '校级'
      }
    ],
    value: 'level',
    type: 'select',
    label: '级别'
  }
]
const formData = [
  {
    value: 'userName',
    initValue: '',
    type: 'selectPanel',
    label: '教职工',
    readonly: true,
    placeholder: '请选择'
  },
  {
    value: 'honoraryTitle',
    initValue: '',
    type: 'input',
    label: '荣誉称号',
    max: 20,
    placeholder: '限20字内'
  },
  {
    value: 'levelType',
    initValue: '',
    list: [
      {
        key: 1,
        val: '国家级'
      },
      {
        key: 2,
        val: '省级'
      },
      {
        key: 3,
        val: '市级'
      },
      {
        key: 4,
        val: '区级'
      },
      {
        key: 5,
        val: '县级'
      },
      {
        key: 6,
        val: '校级'
      }
    ],
    type: 'select',
    label: '级别',
    placeholder: '请选择'
  },
  {
    value: 'awardUnit',
    initValue: '',
    type: 'input',
    label: '嘉奖单位',
    max: 20,
    placeholder: '限20字内'
  },
  {
    value: 'awardDate',
    initValue: '',
    type: 'singleTime',
    label: '奖励日期',
    placeholder: '年/月/日'
  }
]
export default {
  name: 'AwardMsg',
  components: {
    TableList,
    PageNum,
    SubForm,
    SearchForm,
    TeacherPanel
  },
  data() {
    return {
      columns,
      searchLabel,
      title: '添加',
      formStatus: false,
      panelStatus: false,
      formData,
      teacherName: '',
      chooseList: [],
      type: 0,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      awardList: [],
      userId: '',
      userCode: '',
      listId: '',
      selectDisabled: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {},
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getAllTeaAwardList', 'addTeacherAward', 'editTeaAward', 'delTeaAward']),
    searchForm(values) {
      const req = {
        keyWord: values.keyword || '',
        levelType: values.level,
        startDate: values.time[0],
        endDate: values.time[1]
      }
      this.showList(req)
    },
    async submitForm(values) {
      if (!this.teacherName) {
        this.$message.warning('请选择教职工')
        return
      }
      if (this.type === 0) {
        const res = await this.addTeacherAward({
          ...values,
          awardDate:Tools.getDate(new Date(values.awardDate).getTime(), 5),
          userName: this.teacherName,
          schoolCode: this.userInfo.schoolCode,
          userCode: this.userCode,
          userId: this.userId
        })
        if (res.code === 200) {
          this.formStatus = false
          this.showList()
        }
      } else {
        const res = await this.editTeaAward({
          ...values,
          awardDate:Tools.getDate(new Date(values.awardDate).getTime(), 5),
          userName: this.teacherName,
          id: this.listId
        })
        if (res.code === 200) {
          this.formStatus = false
          this.showList()
        }
      }
      this.formData = formData
      this.formData[0].initValue = ''
    },
    addAward(type, record) {
      this.formStatus = true
      if (type) {
        this.title = '编辑'
        this.formData = this.$tools.fillForm(formData, record)
        this.teacherName = record.userName
        this.formData[4].initValue = moment(record.awardDate)
        this.type = 1
        this.listId = record.id
        this.selectDisabled = true
      } else {
        this.title = '添加'
        this.formData = formData
        this.teacherName = ''
        this.type = 0
        this.selectDisabled = false
      }
    },
    async showList(obj) {
      const req = {
        keyWord: '',
        levelType: '',
        startDate: '',
        endDate: '',
        ...this.pageList,
        ...obj,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getAllTeaAwardList(req)
      if (!res.data.list) {
        this.awardList = []
        return
      }
      this.awardList = res.data.list
      this.total = res.data.total
    },
    async deleteList(record) {
      const res = await this.delTeaAward({ id: record.id })
      if (res.code === 200) {
        this.showList()
      }
    },
    clickRow(id) {
      console.log(id)
    },
    showSelectPanel() {
      this.panelStatus = true
    },
    confirmSelect(item) {
      this.panelStatus = false
      const { userName, id, userCode } = item
      this.teacherName = userName || ''
      this.userId = id
      this.userCode = userCode
    }
  }
}
</script>
<style lang="less" scoped>
.students {
  background: #fff;
  height: 100%;
  .left {
    padding: 10px;
  }
  .right {
    padding: 0 10px;
    border-left: 1px solid @bor-color;
    .action {
      div {
        cursor: pointer;
        margin: 4px 30px 0 0;
        img {
          width: 20px;
          height: 20px;
        }
        span {
          font-size: 12px;
        }
      }
    }
  }
}
.modal {
  padding: 0 40px;
  .line {
    margin-bottom: 20px;
  }
  .title {
    font-size: 14px;
    font-weight: bold;
    margin-right: 20px;
    min-width: 70px;
  }
  .download {
    color: #6882da;
    cursor: pointer;
  }
  /deep/ .ant-upload-list-item-info {
    padding: 0 22px 0 4px;
  }
}
</style>
