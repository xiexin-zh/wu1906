<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="plus" class="add-btn" @click="modify(0)">创建</a-button>
      </div>
    </search-form>
    <div class="qui-fx-f1" style="overflow-y:scroll">
      <no-data msg="暂无数据" v-if="noticeList.length === 0">
        <div slot="btn">
          <a-button icon="plus" class="add-btn" @click="modify(0)">创建</a-button>
        </div>
      </no-data>
      <div class="qui-fx qui-fx-wp mar-20" style="    max-height: 400px;">
        <div class="notice-card u-bd-1px u-shadow" v-for="item in noticeList" :key="item.id">
          <div class="qui-fx-f1 qui-fx-ver qui-fx-jsb">
            <div class="qui-fx">
              <a-popover>
                <template slot="content" v-for="(cl, index) in item.outCountDownClassDtoList">
                  {{ (userInfo.schoolType === '8' || userInfo.schoolType === '9') ? (cl.gradeName + cl.subjectName + cl.className) : (cl.gradeName + cl.className) }}
                  {{ index === item.outCountDownClassDtoList. length - 1 ? '' : ',' }}
                </template>
                <span class="content">应用于 {{ item.outCountDownClassDtoList.length }}个班级</span>
              </a-popover>
            </div>
            <div class="notice-state qui-fx-ac-jc" v-if="item.endTime >= new Date().getTime()">
              <h2>
                距离
                <span>{{ item.name }}</span>
                {{ item.tips }}
              </h2>
              <h1
                v-if="Math.round((item.endTime - new Date().getTime()) / (1000 * 60 * 60 * 24)) > 1"
              >{{ Math.round((item.endTime - new Date().getTime()) / (1000 * 60 * 60 * 24)) }}天</h1>
              <h1 v-else>{{ formatDuring(item.endTime - new Date().getTime()) }}</h1>
            </div>
            <div class="notice-unstate qui-fx-ac-jc" v-if="item.endTime < new Date().getTime()">
              <h2>距离{{ item.name }}{{ item.tips }}</h2>
              <h1>0天</h1>
            </div>
            <div class="qui-fx-jsb qui-fx-ac">
              <div>
                <a-tag
                  color="#90d2f2"
                  class="content-state"
                  v-if="item.endTime >= new Date().getTime()"
                >进行中</a-tag>
                <a-tag
                  color="#c1c1c1"
                  class="content-state"
                  v-if="item.endTime < new Date().getTime()"
                >已过期</a-tag>
              </div>
              <div class="qui-fx" v-if="item.endTime >= new Date().getTime()">
                <a-tooltip placement="topLeft" title="编辑">
                  <a-button
                    size="small"
                    class="edit-action-btn"
                    icon="form"
                    @click="modify(1, item)"
                  ></a-button>
                </a-tooltip>
                <a-tooltip placement="topLeft" title="删除">
                  <a-button
                    size="small"
                    class="del-action-btn"
                    icon="delete"
                    @click="deleteCount(item.id)"
                  ></a-button>
                </a-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <add-count ref="addCount" :title="title" @update="showList"></add-count>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import moment from 'moment'
import AddCount from '../../component/AddCount'
import NoData from '@c/NoData'
const searchLabel = [
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '进行中'
      },
      {
        key: 2,
        val: '已过期'
      }
    ],
    value: 'type',
    type: 'select',
    label: '类型'
  }
]
export default {
  name: 'CountDown',
  components: {
    SearchForm,
    PageNum,
    AddCount,
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
      noticeList: [],
      title: '创建倒数日',
      type: ''
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
    ...mapActions('home', ['getcountList', 'getcountDetail', 'delCount']),
    moment,
    async showList(type = '') {
      const req = {
        ...this.pageList,
        type,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getcountList(req)
      this.noticeList = res.data.list
      console.log(this.$tools.getDate(this.noticeList[2].endTime).substring(0, 10))
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.page = 1
      this.type = values.type

      this.showList(values.type)
    },
    async modify(type, item) {
      if (type) {
        const res = await this.getcountDetail(item.id)
        const data = res.data
        this.$refs.addCount.appForm = data
        this.$refs.addCount.id = data.id
        this.$refs.addCount.name = data.name
        this.$refs.addCount.tips = data.tips
        this.$refs.addCount.appForm.endTime = moment(new Date(data.endTime), 'YYYY-MM-DD')
        this.$refs.addCount.classList = data.outCountDownClassDtoList
        if (type === 1) {
          this.title = '编辑倒数日'
          this.$refs.addCount.isView = false
          this.$refs.addCount.isLoad = false
        }
      } else {
        this.title = '创建倒数日'
        this.$refs.addCount.classList = []
        this.$refs.addCount.appForm = {}
      }
      this.$refs.addCount.addVisible = true
    },
    deleteCount(id) {
      this.$tools.delTip('确认要删除吗？', () => {
        this.delCount(id).then(res => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.showList(this.type)
          })
        })
      })
    },
    formatDuring(mss) {
      var days = parseInt(mss / (1000 * 60 * 60 * 24))
      var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
      var seconds = ((mss % (1000 * 60)) / 1000).toFixed(0)
      return hours + ' 小时 ' + minutes + ' 分钟 '
    }
  }
}
</script>
<style lang="less" scoped>
.mar-20 {
  margin: 0 10px;
}
.notice-card {
  padding: 20px;
  width: calc(20% - 20px);
  margin: 0 10px;
  overflow: hidden;
  margin-bottom: 20px;
  min-height: 200px;
  border-radius: 4px;

  .title {
    font-size: 16px;
    font-weight: bold;
    margin-right: 10px;
  }
  .content {
    color: #666;
  }
  .useNum {
    color: @main-color;
  }
  .disable {
    color: #ccc;
  }
}
.notice-state {
  width: 100%;
  height: 200px;
  text-align: center;
  background: url(./img/bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-bottom: 10px;
  margin-top: 10px;
  h1 {
    color: #117fc5;
    font-size: 25px;
  }
}
.notice-unstate {
  width: 100%;
  height: 200px;
  text-align: center;
  background: url(./img/bg1.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-bottom: 10px;
  margin-top: 10px;
  h1 {
    color: #c1c1c1;
    font-size: 25px;
  }
}
</style>
