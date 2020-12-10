<template>
  <div class="page-layout qui-fx-ver">
    <upload-score v-if="uploadTag" :plan-id="planId" :subject-name="subjectName" v-model="uploadTag"></upload-score>
    <search-form isReset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="plus" class="add-btn" @click="modify(0)">创建考试计划</a-button>
      </div>
    </search-form>
    <table-list :page-list="pageList" :columns="columns" :table-list="dataList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="查看">
          <a-button
            size="small"
            class="detail-action-btn"
            icon="ellipsis"
            @click="goDetail(action.record.id)"
          ></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="编辑">
          <a-button
            v-if="parseInt(action.record.state) !== 2"
            size="small"
            class="edit-action-btn"
            icon="form"
            @click.stop="modify(1, action.record.id)"
          ></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm.stop="del(action.record.id)">
          <template slot="title">您确定删除吗?</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button
              v-if="parseInt(action.record.state) === 0"
              size="small"
              class="del-action-btn"
              icon="delete"
            ></a-button>
          </a-tooltip>
        </a-popconfirm>
        <a-tag v-if="action.record.state === '2'" color="#2db7f5" @click="uploadScore(action.record)">录入成绩</a-tag>
      </template>
      <template v-slot:other1="other1">
        <a-tag color="blue" v-if="parseInt(other1.record.state) === 0">未开始</a-tag>
        <a-tag color="green" v-else-if="parseInt(other1.record.state) === 1">进行中</a-tag>
        <a-tag color="red" v-else>已结束</a-tag>
      </template>
      <template v-slot:other2="other2">
        <a-tag v-if="other2.record.ifEnter === '1'" color="#2db7f5" @click="seeScore(other2.record)">查看成绩</a-tag>
        <div v-if="other2.record.ifEnter === '0'" class="u-content-color">未录入</div>
      </template>
      <template v-slot:other4="action">
        <div>{{ action.record.roomNumber }}个场地</div>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import UploadScore from './UploadScore'
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
    title: '计划名称',
    dataIndex: 'name',
    width: '10%'
  },
  {
    title: '考试年级',
    dataIndex: 'gradeName',
    width: '10%'
  },
  {
    title: '考试学科',
    dataIndex: 'subjectName',
    width: '20%'
  },
  {
    title: '考试场地',
    width: '10%',
    scopedSlots: {
      customRender: 'other4'
    }
  },
  {
    title: '考试状态',
    dataIndex: 'state',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '考试成绩',
    dataIndex: 'score',
    width: '10%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    width: '10%',
    customRender: text => {
      return Tools.getDate(text).substr(5, 11)
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
    value: 'name',
    initValue: '',
    type: 'input',
    label: '计划名称',
    placeholder: '请输入计划名称'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '0',
        val: '未开始'
      },
      {
        key: '1',
        val: '进行中'
      },
      {
        key: '2',
        val: '已结束'
      }
    ],
    value: 'state',
    type: 'select',
    label: '考试状态'
  }
]
export default {
  name: 'ExamPlan',
  components: {
    TableList,
    PageNum,
    SearchForm,
    UploadScore
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      planId: '',
      subjectName: [],
      uploadTag: false,
      timeList: [],
      columns,
      searchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      dataList: [],
      searchList: {}
    }
  },
  mounted() {
    this.showList()
    this.add(true, '00:00', '23:59')
  },
  methods: {
    ...mapActions('home', ['getplanList', 'delPlan', 'getplanDetail']),
    getTime() {
      console.log(this.timeList)
    },
    changeTime([a, b, index]) {
      if (index === 3) {
        this.timeList[index].endTime = '23:59'
        return
      }
      if (b !== '23:59') {
        if (index === this.timeList.length - 1) {
          this.add(true, this.timeList[index].endTime, '23:59')
        } else {
          this.modifyTime(index)
        }
      }
    },
    modifyTime(index) {
      this.timeList[index + 1].startTime = this.timeList[index].endTime
    },
    add(tag, sTime, eTime) {
      if (tag) {
        this.timeList.push({
          startTime: sTime,
          endTime: eTime
        })
      } else {
        this.timeList.splice(this.timeList.length - 1)
        this.timeList[this.timeList.length - 1].endTime = '23:59'
      }
      this.editTag()
    },
    editTag() {
      this.timeList = this.timeList.map(item => {
        return {
          ...item,
          startTime: moment(item.startTime, 'HH:mm'),
          endTime: moment(item.endTime, 'HH:mm')
        }
      })
    },
    goDetail(id) {
      this.$router.push({
        path: '/examPlan/Addexamplan',
        query: {
          id,
          isDetail: 'true'
        }
      })
    },
    async showList() {
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        ...this.searchList
      }
      const res = await this.getplanList(req)
      if (!res.data) {
        return
      }
      this.dataList = res.data.list
      this.total = res.data.total
    },
    async del(id) {
      await this.delPlan(id)
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    searchForm(values) {
      this.searchList = values
      this.showList()
    },
    modify(type, id = '') {
      this.$router.push({
        path: '/examPlan/Addexamplan',
        query: {
          id,
          isDetail: 'false'
        }
      })
    },
    /**
     * @des 查看考试成绩
     */
    seeScore(item) {
      this.$router.push({
        path: '/examPlan/scoreDetail',
        query: {
          planId: item.id
        }
      })
    },
    /**
     * @des 录入成绩
     */
    uploadScore(item) {
      this.subjectName = item.subjectName.split(',')
      this.planId = item.id
      this.uploadTag = true
    }
  }
}
</script>
<style lang="less" scoped></style>
