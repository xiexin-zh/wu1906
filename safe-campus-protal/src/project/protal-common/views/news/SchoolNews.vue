<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="plus" class="add-btn" @click="addnews(0)">发布新闻</a-button>
      </div>
    </search-form>
    <div class="qui-fx-f1" style="overflow-y:scroll">
      <div class="pos-box">
        <div class="notice-list">
          <no-data msg="暂无新闻" v-if="recordList.length === 0">
            <div slot="btn">
              <a-button icon="plus" class="add-btn" @click="addnews(0)">发布新闻</a-button>
            </div>
          </no-data>
          <div class="notice-card qui-fx u-bd-1px u-mar-b20 u-shadow" v-for="item in recordList" :key="item.id">
            <div class="notice-img u-padd-20">
              <img :src="item.imgUrl" alt />
            </div>
            <div class="qui-fx-f1 qui-fx-ver u-padd-20">
              <p class="notice-title">{{ item.title }}</p>
              <div class="qui-fx-f1 notice-info" v-if="item.content.length < 60" v-html="item.content">
                {{ item.content }}
              </div>
              <div class="qui-fx-f1 notice-info" v-if="item.content.length >= 60" v-html="item.content">
                {{ item.content.substring(0, 90) }}...
              </div>
              <div class="qui-fx-jsb notice-action">
                <span>{{ item.createBy }}&nbsp;发布于：{{ getDateTime(item.createTime) }}</span>
                <div>
                  <a-button
                    size="small"
                    class="edit-action-btn"
                    icon="form"
                    v-if="item.creatorCode === userCode"
                    @click="addnews(1, item)"
                  ></a-button>
                  <a-button
                    size="small"
                    class="del-action-btn"
                    icon="delete"
                    v-if="item.creatorCode === userCode"
                    @click="deleteNews(item.id)"
                  ></a-button>
                  <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="newsDetail(item)"></a-button>
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
                <p class="ql-editor img_" v-html="newsForm.content">
                  {{ newsForm.content }}
                </p>
              </div>
            </div>
          </a-modal>
        </div>
      </div>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
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
  name: 'SchoolNews',
  components: {
    SearchForm,
    PageNum,
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
      userName: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.userCode = this.userInfo.userCode
    this.showList()
  },
  methods: {
    ...mapActions('home', ['newsList', 'delNews']),
    async showList(searchObj = {}) {
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        ...searchObj
      }
      const res = await this.newsList(req)
      this.recordList = res.data.list
      this.total = res.data.total
    },
    addnews(type, item) {
      if (type) {
        this.$router.push({
          path: '/schoolNews/Addnews',
          query: {
            type,
            id: item.id
          }
        })
      } else {
        this.$router.push({
          path: '/schoolNews/Addnews'
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
    deleteNews(id) {
      this.$tools.delTip('确认要删除吗？', () => {
        this.delNews(id).then(res => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      })
    },
    newsDetail(record) {
      this.newsForm = record
      this.previewVisible = true
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
    font-size: 18px;
    font-weight: bold;
    height: 54px;
    margin-bottom: 5px;
  }
  .u-padd-20 {
    padding: 20px;
  }
  .notice-info {
    overflow: hidden;
  }
  .notice-action {
    margin-top: 20px;
    span {
      color: #c0c0c0;
      font-size: 13px;
    }
  }
  .notice-img {
    width: 300px;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
.img_ /deep/ img {
  width: 600px;
  margin: 10px 0;
}
</style>
