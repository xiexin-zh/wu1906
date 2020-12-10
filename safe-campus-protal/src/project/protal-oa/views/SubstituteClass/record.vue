<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel"> </search-form>
    <table-list isZoom :page-list="pageList" :columns="columns" :table-list="recordList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="查看详情">
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="detail(action.record.id)"></a-button>
        </a-tooltip>
      </template>
      <template v-slot:other5="other5">
        <a-tag :color="$tools.appState(other5.record.approvalState)">{{
          $tools.appStateType(other5.record.approvalState)
        }}</a-tag>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <a-modal v-model="previewVisible" width="900px" :footer="null">
      <p>
        <a-tag :color="$tools.appState(substituteForm.approvalState)">{{
          $tools.appStateType(substituteForm.approvalState)
        }}</a-tag>
      </p>
      <div style="text-align:center">
        <div style="background-color:#EBEEF5;height:1px;border:none;"></div>
        <div style="min-height:300px;">
          <p style="text-align:left;margin-top:10px;text-indent:30px;">申请人：{{ substituteForm.createUsername }}</p>
          <p style="text-align:left;margin-top:10px;text-indent:30px;">
            开始时间：{{ substituteForm.startTime | getDate(1) }}
          </p>
          <p style="text-align:left;margin-top:10px;text-indent:30px;">
            结束时间：{{ substituteForm.stopTime | getDate(1) }}
          </p>
          <p style="text-align:left;margin-top:10px;text-indent:30px;">调代课原因：{{ substituteForm.description }}</p>
          <p style="text-align:left;margin-top:10px;text-indent:30px;">
            上传图片：
            <span v-for="(item, i) in detailList.substituteFileList" :key="i">
              <img :src="item.url" style="width: 80px; height: 80px;    margin-left: 10px;" alt="" />
            </span>
          </p>
          <div v-for="(item, i) in detailList.substituteInfoList" :key="i" class="u-mar-b20 u-mar-t20 ">
            <div class="qui-fx" v-if="item.category !== null">
              <div>
                <span>
                  {{ item.fromGradeName }}{{ item.fromClassName }}第{{ item.fromLesson }}节{{ item.fromSubjectName
                  }}{{ item.fromCourseTime | gmtToDate('date') }}星期{{ convertToChinese(item.fromWeek) }}</span
                  >
                <span class="u-padd-l40">{{ item.fromTeacherName }}</span>
              </div>
              <div v-if="item.category === 2">
                <span class="u-padd-40">
                  <a-tag color="blue">
                    调课
                  </a-tag></span
                  >
                <span
                >{{ item.toGradeName }}{{ item.toClassName }}第{{ item.toLesson }}节{{ item.toSubjectName
                }}{{ item.toCourseTime | gmtToDate('date') }}星期{{ convertToChinese(item.toWeek) }}</span
                >
                <span class="u-padd-l40">{{ item.toTeacherName }}</span>
              </div>
              <div c v-if="item.category === 1">
                <span class="u-padd-40">
                  <a-tag color="blue"> {{ item.toTeacherName }}代课 </a-tag></span
                >
              </div>
              <div v-if="item.category === 3">
                <span class="u-padd-40">
                  <a-tag color="blue">
                    自修
                  </a-tag></span
                >
              </div>

              <div v-if="item.category === 4">
                <span class="u-padd-40">
                  <a-tag color="blue">
                    教务处理
                  </a-tag></span
                >
              </div>
            </div>
          </div>
          <template>
            <a-timeline mode="alternate">
              <a-timeline-item v-for="(item, index) in detailList.substituteApproversList" :key="index">
                审批人： {{ item.approverName }}&nbsp;&nbsp;{{ item.createTime | getDate(1)
                }}{{ $tools.appStateType(item.approvalState) }}
                <div>{{ item.remarks }}</div>
              </a-timeline-item>
            </a-timeline>
          </template>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import $tools from '@u/tools'
const columns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '申请人',
    dataIndex: 'createUsername',
    width: '20%'
  },
  {
    title: '申请时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '申请状态',
    width: '20%',
    scopedSlots: {
      customRender: 'other5'
    }
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'createUsername',
    type: 'input',
    label: '申请人',
    placeholder: '请输入申请人'
  },
  {
    value: 'createTime',
    type: 'singleTime',
    label: '申请时间'
  },
  {
    list: [
      {
        key: '',
        val: '全部状态'
      },
      {
        key: '1',
        val: '待审批'
      },
      {
        key: '2',
        val: '已同意'
      },
      {
        key: '3',
        val: '未同意'
      },
      {
        key: '4',
        val: '已撤回'
      }
    ],
    value: 'approvalState',
    type: 'select',
    label: '申请状态'
  }
]
export default {
  name: 'Record',
  components: {
    TableList,
    SearchForm,
    PageNum
  },
  data() {
    return {
      columns,
      searchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      recordList: [],
      searchList: {
        schoolCode: ''
      },
      previewVisible: false,
      detailList: {},
      substituteForm: {},
      weekday: ['零', '一', '二', '三', '四', '五', '六', '七']
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getsubstituteList', 'getsubstituteDetail']),
    async showList(searchObj = {}) {
      this.searchList.page = this.pageList.page
      this.searchList.size = this.pageList.size
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, searchObj)
      const res = await this.getsubstituteList(this.searchList)
      this.recordList = res.data.list
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.page = 1
      this.createTime = values.createTime
      this.createUsername = values.createUsername
      this.approvalState = values.approvalState
      const searchObj = {
        approvalState: this.approvalState,
        createUsername: this.createUsername,
        createTime: this.createTime
      }
      this.showList(searchObj)
    },
    async detail(id) {
      this.previewVisible = true
      const res = await this.getsubstituteDetail(id)
      this.detailList = res.data
      this.substituteForm = res.data.substituteForm
    },
    convertToChinese(num) {
      var str = num.toString()
      var len = num.toString().length
      var C_Num = []
      for (var i = 0; i < len; i++) {
        C_Num.push(this.weekday[str.charAt(i)])
      }
      return C_Num.join('')
    }
  }
}
</script>
<style lang="less" scoped></style>
