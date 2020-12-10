<template>
  <div class="home page-layout qui-fx-ver">
    <a-tabs default-active-key="1" @change="tabChange" v-model="tabValue">
      <a-tab-pane key="1" tab="学校资源">
      </a-tab-pane>
      <a-tab-pane key="2" tab="我的资源">
      </a-tab-pane>
    </a-tabs>
    <div class="qui-fx-jsb qui-fx-ac mar-b10">
      <div class="mar-l10">
        <search-form style="padding: 0 10px" is-reset @search-form="searchForm" :search-label="searchLabel">
          <!-- <template v-slot:place>
            <a-form-item label="资源发布">
              <a-cascader
                :options="classList"
                @click.stop="classOnFocus"
                :loadData="classLoadData"
                v-decorator="['clazz']"
                placeholder="请选择"
              />
            </a-form-item>
          </template> -->
        </search-form>
      </div>
      <div class="mar-r10">
        <a-button icon="plus" class="add-btn" @click.stop="addBooking('0')">上传资源</a-button>
      </div>
    </div>
    <div class="qui-fx-f1" style="overflow-y:scroll">
      <div class="pos-box">
        <div class="data-list">
          <no-data msg="暂无资源" v-if="studyList.length === 0"></no-data>
          <div class="data-card qui-fx-jsb qui-fx-ac" v-for="item in studyList" :key="item.id">
            <div class="data-info">
              <div class="title">{{ item.name }}</div>
              <div class="detail qui-fx-ac">
                <p>上传人：{{ item.ownerName }}</p>
                <p>上传时间：{{ item.createTime | getDate(5) }}</p>
                <p>
                  资源发布:<a-button type="link">{{ item.schoolGradeCode === '00' ? '全校' : item.classCount + '个班级' }}</a-button>
                </p>
              </div>
            </div>
            <div class="action qui-fx">
              <a-button class="add-btn" @click.stop="goDetail(item)">查看资源</a-button>
              <a-button v-if="tabValue === '2'" class="user-action-btn" @click.stop="addBooking('1', item)">编辑资源</a-button>
              <a-button class="export-all-btn" @click.stop="addBooking('2', item)">复用资源</a-button>
              <a-button v-if="tabValue === '2'" class="del-action-btn" @click="deleteList(item)">删除</a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <a-modal v-model="showTag" v-if="showTag" width="600px" title="查看资源" :footer="null">
      <div class="study-info">
        <div class="title">{{ studyInfo.name }}</div>
        <div class="detail" v-if="studyInfo.schoolGradeCode === '00'"><span class="mar-r10">资源发布:</span> <a-tag color="cyan">全校</a-tag></div>
        <div class="detail qui-fx" v-else>
          <span class="tip">资源发布:</span>
          <div class="class-list qui-fx-wp">
            <template v-for="tag in studyInfo.classList">
              <a-tag
                class="tag"
                color="cyan"
                :key="tag.classCode"
              >{{ tag.gradeName }} {{ userInfo.schoolType === '8' || userInfo.schoolType === '9' ? tag.subjectName : '' }} {{ tag.className }}</a-tag>
            </template>
          </div>
        </div>
        <div class="detail qui-fx-ac">
          <p class="mar-r10">上传人：{{ studyInfo.ownerName }}</p>
          <p>上传时间：{{ studyInfo.createTime | getDate(5) }}</p>
        </div>
      </div>
      <div class="study-list">
        <div class="title">资源列表</div>
        <div v-for="item in studyInfo.fileList" :key="item.id">
          <a-button type="link" @click="download(item.url)">{{ item.fileName }}</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NoData from '@c/NoData'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import Tools from '@u/tools'
const searchLabel = [
  {
    value: 'name',
    type: 'input',
    label: '资源名称',
    placeholder: '请输入资源名称'
  },
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '上传时间',
    customRender: text => {
      return Tools.getDate(text)
    }
  }
]
export default {
  name: 'StudyGround',
  components: {
    SearchForm,
    PageNum,
    NoData
  },
  data() {
    return {
      searchLabel,
      showTag: false,
      searchList: {},
      tabValue: '1',
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      studyList: [],
      title: '添加预订',
      searchObj: {},
      classList: [],
      schoolYearId: '',
      id: 0,
      studyInfo: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.getSchoolYearId()
  },
  methods: {
    ...mapActions('home', ['getStudyList', 'detailStudy', 'delStudy', 'getGradeData', 'getSchoolYear', 'getClassData']),
    async getSchoolYearId () {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getSchoolYear(req)
      if (!res.data.list) {
        return
      }
      this.schoolYearId = res.data.list[0].id
      this.showList()
    },
    async classOnFocus(value) {
      this.classList = []
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getGradeData(req)
      this.classList = res.data.list
      this.classList.forEach(el => {
        el.label = el.name
        el.value = el.code
        el.isLeaf = false
      })
      this.classList.unshift({
        label: '全部',
        value: '00',
        isLeaf: true
      })
    },
    classLoadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      const req = {
        gradeCode: targetOption.code,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: this.schoolYearId
      }
      this.getClassData(req).then(res => {
        targetOption.loading = false
        targetOption.children = res.data.list
        targetOption.children.forEach(el => {
          el.label = el.className
          el.value = el.classCode
          el.isLeaf = true
        })
        targetOption.children.unshift({
          label: '全部',
          value: ''
        })
        this.classList = [...this.classList]
      })
    },
    tabChange() {
      console.log(this.tabValue)
      this.showList()
    },
    async showList() {
      const req = {
        ...this.searchObj,
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: this.schoolYearId,
        ownerCode: this.tabValue === '2' ? this.userInfo.userCode : undefined
      }
      const res = await this.getStudyList(req)
      this.studyList = res.data.list
      this.total = res.data.total
    },
    searchForm(values) {
      console.log(values)
      this.searchObj = {
        startTime: values.rangeTime ? values.rangeTime[0] : undefined,
        endTime: values.rangeTime ? values.rangeTime[1] : undefined,
        name: values.name
      }
      /* if (values.clazz) {
        if (values.clazz.length === 1) {
          this.searchObj.classCode = undefined
          this.searchObj.schoolGradeCode = values.clazz[0]
        } else if (values.clazz.length === 2) {
          this.searchObj.schoolGradeCode = values.clazz[1] === '' ? values.clazz[0] : undefined
          this.searchObj.classCode = values.clazz[1]
        }
      } else {
        this.searchObj.schoolGradeCode = undefined
        this.searchObj.classCode = undefined
      } */
      this.showList()
    },
    addBooking(type, record) {
      if (type !== '0') {
        this.$router.push({ path: '/studyGround/addStudy', query: { id: record.id, type } })
      } else {
        this.$router.push({ path: '/studyGround/addStudy', query: { type } })
      }
    },
    download(url) {
      window.open(url, '_blank')
    },
    async goDetail(record) {
      const res = await this.detailStudy(record.id)
      this.studyInfo = res.data
      this.showTag = true
    },
    deleteList(record) {
      this.$tools.delTip('确定删除吗', () => {
        this.delStudy(record.id).then(res => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.title{
    font-size: 18px;
    font-weight: bold;
    margin: 5px 0;
  }
.data-list {
  .data-card {
    border-radius: @radius;
    background-color: @white-color;
    padding: 10px 20px;
    float: left;
    width: 98%;
    overflow: hidden;
    margin: 0 1% 20px 1%;
    background-color: @bor-color;
  }
  .data-info{
    .detail{
      p{
        margin-right: 10px;
        color: @des-color;
      }
    }
  }
}
.study-info{
  border-bottom: 1px solid @bor-color;
  margin-bottom: 15px;
  .title{
    margin: 0 0 10px 0;
  }
  .detail{
    color: @des-color;
    margin: 5px 0;
    .tag{
      margin-bottom: 5px;
    }
    .class-list{
      width: calc(100% - 70px);
    }
    span.tip{
      width: 70px;
    }
  }
}
</style>
