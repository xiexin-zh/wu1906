<template>
  <div class="home page-layout qui-fx-ver">
    <poster v-model="showTag" :record="record"></poster>
    <meet-record ref="form" @submit-form="submitForm" title="活动心得" v-model="editTag" :id="editId">
    </meet-record>
    <sign-record
      title="签到统计"
      type="activity"
      ref="signRecord"
      :id="id"
      v-model="signTag"
      v-if="signTag"
    ></sign-record>
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="plus" class="add-btn" @click.stop="addBooking('0')">发布</a-button>
      </div>
    </search-form>
    <table-list :page-list="pageList" :columns="columns" :table-list="bookingList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="查看" v-if="action.record.status !== '未使用'">
          <a-button
            size="small"
            class="detail-action-btn"
            icon="ellipsis"
            @click.stop="addBooking('1', action.record)"
          ></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="编辑" v-if="action.record.status === '未使用'">
          <a-button
            size="small"
            class="edit-action-btn"
            icon="form"
            @click.stop="addBooking('2', action.record)"
          ></a-button>
        </a-tooltip>
        <!-- <a-tooltip placement="topLeft" title="活动心得" v-if="action.record.status !== '未使用'">
          <a-button
            size="small"
            class="copy-action-btn"
            icon="edit"
            @click.stop="editMeeting(action.record)"
          ></a-button>
        </a-tooltip> -->
        <a-tooltip placement="topLeft" title="查看海报">
          <a-button
            size="small"
            class="play-action-btn"
            icon="export"
            @click.stop="showPoster(action.record)"
          ></a-button>
        </a-tooltip>
        <!-- <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="deleteList(action.record)" v-if="action.record.status !== '使用中'">
          <template slot="title">
            确定删除吗?
          </template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm> -->
      </template>
      <template v-slot:other3="other3">
        <span>{{ other3.record.reserveDate | gmtToDate('date') }} {{ other3.record.startTime }}-{{ other3.record.endTime }}</span>
      </template>
      <template v-slot:other4="other4">
        <a-popover>
          <template slot="content">
            <p>{{ other4.record.content }}</p>
          </template>
          <span>{{ other4.record.content.length > 10 ? (other4.record.content.substring(0, 20) + '...') : other4.record.content }}</span>
        </a-popover>
      </template>
      <template v-slot:other2="other2">
        <a-tag v-if="other2.record.openSign === '1'" color="green" @click="showRecord(other2.record)">{{ other2.record.signNum }} / {{ other2.record.totalNum }}</a-tag>
        <span v-else>--</span>
      </template>
      <template v-slot:other1="other1">
        <a-tag
          :color="other1.record.status === '使用中' ? '#87d068' : other1.record.status === '未使用' ? '#2db7f5' : 'purple'"
        >{{ other1.record.status === '使用中' ? '进行中' : other1.record.status === '未使用' ? '未开始' : '已结束' }}</a-tag>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import Poster from '../../component/siteBooking/Poster'
import MeetRecord from '../../component/siteBooking/MeetRecord'
import UploadMulti from '@c/UploadFace'
import SignRecord from '../../component/siteBooking/SignRecord'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import Tools from '@u/tools'
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '活动主题',
    dataIndex: 'description',
    width: '10%'
  },
  {
    title: '活动地点',
    dataIndex: 'placeName',
    width: '10%'
  },
  {
    title: '活动时间',
    dataIndex: 'reserveDate',
    width: '10%',
    scopedSlots: {
      customRender: 'other3'
    }
  },
  {
    title: '活动内容',
    dataIndex: 'content',
    width: '10%',
    ellipsis: true,
    scopedSlots: {
      customRender: 'other4'
    }
  },
  {
    title: '发起人',
    dataIndex: 'createName',
    width: '10%'
  },
  {
    title: '活动状态',
    dataIndex: 'status',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '签到统计',
    dataIndex: 'openSign',
    width: '10%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '操作',
    width: '12%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '活动日期',
    customRender: text => {
      return Tools.getDate(text)
    }
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '未开始'
      },
      {
        key: '2',
        val: '进行中'
      },
      {
        key: '3',
        val: '已结束'
      }
    ],
    value: 'status',
    type: 'select',
    label: '活动状态'
  },
  {
    value: 'description',
    type: 'input',
    label: '活动主题',
    placeholder: '请输入活动主题'
  }
]
export default {
  name: 'PublishActivity',
  components: {
    SearchForm,
    UploadMulti,
    MeetRecord,
    PageNum,
    TableList,
    SignRecord,
    Poster
  },
  data() {
    return {
      columns,
      searchLabel,
      searchList: {},
      fileList: [],
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      bookingList: [],
      title: '活动发布',
      signTag: false,
      editTag: false,
      showTag: false,
      searchObj: {},
      record: {},
      id: 0,
      editId: 0
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getReserveList', 'delReserve', 'addMeetRecord', 'getMeetRecordById']),
    async showList() {
      const req = {
        ...this.searchObj,
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        type: '3'
      }
      const res = await this.getReserveList(req)
      this.bookingList = res.data.list
      this.bookingList.map(el => {
        el.placeName = el.placeName.replace(/,/g, '-')
      })
      this.total = res.data.total
    },
    searchForm(values) {
      console.log(values)
      this.searchObj = {
        startDate: values.rangeTime ? values.rangeTime[0] : undefined,
        endDate: values.rangeTime ? values.rangeTime[1] : undefined,
        status: values.status,
        description: values.description
      }
      this.showList()
    },
    addBooking(type, record) {
      if (type !== '0') {
        this.$router.push({ path: '/activityBooking/addActivityBooking', query: { id: record.id, type } })
      } else {
        this.$router.push({ path: '/activityBooking/addActivityBooking', query: { type } })
      }
    },
    goDetail(record) {
    },
    async deleteList(record) {
      await this.delReserve(record.id)
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    showRecord(record) {
      this.id = record.id
      this.signTag = true
    },
    editMeeting(record) {
      this.editId = record.id
      this.editTag = true
    },
    showPoster(record) {
      this.record = record
      this.showTag = true
    },
    async submitForm(values) {
      console.log(values)
      const req = {
        placeReserveId: this.editId,
        content: values.content,
        attachList: values.fileList.concat(values.otherList)
      }
      await this.addMeetRecord(req)
      this.$message.success('发布成功')
      this.$tools.goNext(() => {
        this.$refs.form.appForm = {
          content: '',
          fileList: [],
          otherList: []
        }
        this.$refs.form.showData()
        this.$refs.form.reset()
        this.showList()
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
