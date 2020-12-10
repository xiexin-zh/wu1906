<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="plus" class="add-btn" @click="addnotice(0)">发布公告</a-button>
      </div>
    </search-form>
    <div class="qui-fx-f1" style="overflow-y:scroll">
      <div class="pos-box">
        <div class="notice-list">
          <no-data msg="暂无公告" v-if="recordList.length === 0">
            <div slot="btn">
              <a-button icon="plus" class="add-btn" @click="addnotice(0)">发布公告</a-button>
            </div>
          </no-data>
          <div class="notice-card qui-fx u-bd-1px u-mar-b20 u-shadow" v-for="item in recordList" :key="item.id">
            <div class="qui-fx-f1 qui-fx-ver u-padd-20">
              <p class="notice-title">{{ item.title }}</p>
              <div class="qui-fx-f1 notice-info" v-if="item.content.length < 60">
                {{ item.content }}
              </div>
              <div class="qui-fx-f1 notice-info" v-if="item.content.length >= 60">
                {{ item.content.substring(0, 90) }}...
              </div>
              <div class="qui-fx-jsb notice-action">
                <span>
                  {{ item.createBy }}&nbsp;&nbsp;&nbsp;&nbsp;发布于：{{ getDateTime(item.createTime) }}&nbsp;&nbsp;
                  <a-button size="small" class="user-action-btn" @click="readStatus(item)">阅读状态</a-button>
                </span>
                <div>
                  <a-button
                    v-if="item.creatorCode === userCode"
                    size="small"
                    class="edit-action-btn"
                    icon="form"
                    @click="addnotice(1, item)"
                  ></a-button>
                  <a-button
                    v-if="item.creatorCode === userCode"
                    size="small"
                    class="del-action-btn"
                    icon="delete"
                    @click="deleteNotice(item.id)"
                  ></a-button>
                  <a-button
                    size="small"
                    class="detail-action-btn"
                    icon="ellipsis"
                    @click="noticeDetail(item)"
                  ></a-button>
                </div>
              </div>
            </div>
          </div>
          <a-modal v-model="previewVisible" width="900px" :footer="null">
            <div style="text-align:center">
              <h2>{{ newsForm.title }}</h2>
              <p>发布人：{{ newsForm.createBy }} &nbsp;&nbsp;发布时间 : {{ getDateTime(newsForm.createTime) }}</p>
              <div style="background-color:#EBEEF5;height:1px;border:none;"></div>
              <div style="min-height:300px;">
                <p style="text-align:left;margin-top:10px;text-indent:30px" v-html="newsForm.content">
                  {{ newsForm.content }}
                </p>
              </div>
            </div>
          </a-modal>
        </div>
      </div>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <Read-Status v-model="readstaus" :title="title" :id="id"></Read-Status>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import ReadStatus from '../../component/ReadStatus'
import NoData from '@c/NoData'
const searchLabel = [
  {
    value: 'title',
    type: 'input',
    label: '标题',
    placeholder: '请输入标题'
  },
  {
    value: 'createBy',
    type: 'input',
    label: '发布者',
    placeholder: '请输入发布者'
  }
]
export default {
  name: 'SchoolNotice',
  components: {
    SearchForm,
    PageNum,
    ReadStatus,
    NoData
  },
  data() {
    return {
      searchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      recordList: [],
      previewVisible: false,
      newsForm: {},
      title: '阅读状态',
      id: 0,
      readstaus: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
    this.userCode = this.userInfo.userCode
  },
  methods: {
    ...mapActions('home', ['noticeList', 'delNotice']),
    async showList(searchObj = {}) {
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        ...searchObj
      }
      const res = await this.noticeList(req)
      this.recordList = res.data.list
      this.total = res.data.total
    },
    addnotice(type, item) {
      if (type) {
        this.$router.push({
          path: '/schoolNotice/Addnotice',
          query: {
            type,
            id: item.id
          }
        })
      } else {
        this.$router.push({
          path: '/schoolNotice/Addnotice'
        })
      }
    },
    searchForm(values) {
      this.pageList.page = 1
      const searchObj = {
        title: values.title,
        createBy: values.createBy
      }
      this.showList(searchObj)
    },
    deleteNotice(id) {
      this.$tools.delTip('确认要删除吗？', () => {
        this.delNotice([id]).then(res => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      })
    },
    noticeDetail(record) {
      this.newsForm = record
      this.previewVisible = true
    },
    readStatus(record) {
      this.readstaus = true
      this.id = record.id
      this.title = '阅读状态'
    },
    getDateTime(date) {
      if (date === '' || date === null) {
        return '--'
      }
      const d = new Date(date)
      return (
        d.getFullYear() +
        '-' +
        (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
        '-' +
        (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
        ' ' +
        (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
        ':' +
        (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes())
      )
    }
  }
}
</script>
<style lang="less" scoped>
.notice-list {
  .notice-card {
    border-radius: 4px;
    float: left;
    width: 48.5%;
    margin-left: 1%;
    height: 230px;
  }
  .notice-title {
    font-size: 22px;
    font-weight: bold;
    height: 54px;
    margin-bottom: 5px;
  }
  .notice-info {
    overflow: hidden;
    font-size: 18px;
  }
  .notice-action {
    margin-top: 20px;
    span {
      color: #c0c0c0;
      font-size: 13px;
    }
  }
  .u-padd-20 {
    padding: 20px;
  }
}
</style>
