<template>
  <div class="page-layout class-score qui-fx-ver">
    <no-data v-if="scoreList.length === 0" ></no-data>
    <div v-else class="qui-fx-f1 qui-fx-ver">
      <a-tabs default-active-key="1" @change="callback" style="height:50px;">
        <a-tab-pane v-for="item in scoreList" :key="`${item.name}+${item.id}`" :tab="item.name"></a-tab-pane>
      </a-tabs>
      <div class="qui-fx-f1 qui-fx">
        <div class="left-menu qui-fx-ver">
          <div class="qui-fx-f1 box-scroll">
            <major-tree
              v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'"
              @select="classSelect"
            ></major-tree>
            <div class="grade-tree" v-else>
              <a-skeleton v-if="treeData.length == 0 && !noData" active :paragraph="{rows: 10}" />
              <no-data v-if="noData" msg="暂无数据~"></no-data>
              <a-tree
                v-if="treeData.length > 0"
                @select="select"
                :treeData="treeData"
                :defaultSelectedKeys="defaultSelectedKeys"
                :defaultExpandedKeys="defaultExpandedKeys"
              >
              </a-tree>
            </div>
          </div>
        </div>
        <div class="qui-fx-f1 qui-fx-ver" style="margin-left:10px;">
          <div class="score-time">
            <div v-if="scoreType === 'D' ">{{ startTime }} 【日】</div>
            <div v-if="scoreType === 'W' "> {{ startTime }} 至 {{ endTime }}【周】</div>
            <div v-if="scoreType === 'M' "> {{ startTime }} 至 {{ endTime }}【月】</div>
            <div v-if="scoreType === 'Y' "> {{ startTime }} 至 {{ endTime }}【学期】</div>
          </div>
          <div id="total-bi" style="margin-top: -45px; z-index: 0" class="qui-fx-f1"></div>
          <div v-if="scoreInfo.list !== 0" class="box-scroll" style="height:500px;background-color:#fff; margin-top: 20px">
            <div class="box-border">
              <ul v-if="scoreInfo.list !== 0" class="score-title qui-fx act">
                <li style="width: 60px">序号</li>
                <li style="width: 200px">评分时间</li>
                <li v-if="socreList.length > 0" style="width: 60px">总分</li>
                <li v-else class="qui-fx-f1">总分</li>
                <li v-if="socreList.length > 0" style="width: 60px">基础分</li>
                <li class="qui-fx-f1" v-for="item in socreList" :key="item.id">{{ item }}</li>
              </ul>
              <ul class="score-title qui-fx" v-for="(score, index) in scoreInfo.list" :key="index">
                <!-- <ul @click="changeBi(score, index)" :class="['score-title qui-fx', {'act': index === scoreItem}]" class="score-title qui-fx" v-for="(score, index) in scoreDate" :key="index"> -->
                <li style="width: 60px">{{ getIndex(index) }}</li>
                <li style="width: 200px" v-if="scoreType === 'D'">{{ score.startTime | getDate(2) }}</li>
                <li style="width: 200px" v-if="scoreType !== 'D'">{{ score.startTime | getDate(2) }} 至 {{ score.endTime | getDate(2) }}</li>
                <li style="width: 60px" v-if="socreList.length > 0">{{ score.score }}</li>
                <li style="width: 60px" v-if="socreList.length > 0">{{ baseScore }}</li>
                <li class="qui-fx-f1" v-for="(item,ind) in (score.itemScoreSimpleDtoList.length > 0 ? score.itemScoreSimpleDtoList : length)" :key="ind">
                  {{ item.score }}
                </li>
              </ul>
            </div>
          </div>
          <page-num v-model="pageList" :total="total" @change-page="getScoreCategory"></page-num>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import MajorTree from '@c/MajorTree'
import PageNum from '@c/PageNum'
import GradeTree from '@c/GradeTree'
import NoData from '@c/NoData'
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
export default {
  name: 'ScoreStatistics',
  components: {
    GradeTree,
    NoData,
    PageNum,
    MajorTree
  },
  data () {
    return {
      scoreList: [],
      isShow: false,
      scoreItem: 0,
      classItem: [{
        name: '1',
        id: '1'
      }],
      itemData: [],
      scoreType: 'D',
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      treeData: [],
      gradeList: [],
      defaultExpandedKeys: [],
      defaultSelectedKeys: [],
      categoryId: '',
      noData: false,
      searchList: {
        classCode: '',
        gradeCode: '',
        categoryName: '',
        categoryId: '',
        schoolYearId: ''
      },
      time: '',
      dayNumber: '',
      date: this.$tools.getDate(new Date()),
      scoreInfo: {},
      socreList: [],
      startTime: this.$tools.getDate(new Date()),
      endTime: this.$tools.getDate(new Date()),
      baseScore: '',
      length: 0
    }
  },
  computed: {
    ...mapState('home', [ 'userInfo' ])
  },
  async mounted () {
    this.categoryGet()
  },
  methods: {
    ...mapActions('home', [
      'getItemsList', 'getStatistics', 'getCategory',
      'getScoreRecord', 'getScoreClass', 'getScoreItem', 'getScoreList'
    ]),
    // 评分项tab
    async categoryGet () {
      this.pageList.schoolCode = this.userInfo.schoolCode
      const res = await this.getCategory(this.pageList)
      if (res.data.list.length > 0) {
        this.scoreList = res.data.list
        this.categoryId = this.scoreList[0].id
        this.categoryName = this.scoreList[0].name
        this.scoreType = this.scoreList[0].cycle
        this.baseScore = this.scoreList[0].baseScore
        this.time = this.scoreList[0].time
        this.dayNumber = this.scoreList[0].dayNumber
        this.initMenu()
      } else {
        this.scoreList = []
      }
    },
    // 初始化年级班级
    async initMenu () {
      const res = await this.getScoreClass(this.categoryId)
      if (res.data === null || res.data.length === 0) {
        this.noData = true
      } else {
        this.noData = false
      }
      this.gradeList = res.data
      if (this.gradeList.length > 0) {
        this.treeData = this.gradeList
          .map(item => {
            return {
              title: item.gradeName,
              code: item.gradeCode,
              key: item.gradeCode,
              children: item.classDtoList.map(el => {
                return {
                  title: el.className,
                  code: el.classCode,
                  key: el.classCode,
                  schoolYearId: el.schoolYearId
                }
              })
            }
          })
        this.defaultExpandedKeys = [this.gradeList[0].gradeCode]
        if (this.treeData[0].children.length > 0) {
          this.defaultSelectedKeys = [this.treeData[0].children[0].code]
        } else {
          this.defaultSelectedKeys = [this.treeData[0].code]
        }
        this.select(this.defaultSelectedKeys, this.treeData[0].children[0])
      } else {
        this.treeData = []
      }
    },
    classSelect(value) {
      if (!value.classCode) {
        this.itemData = []
        this.scoreInfo = {}
        this.total = 0
        this.scoreData = []
        this.typeData = []
        this.socreList = []
        this.showBI()
      } else {
        this.searchList.beAssessedCode = value.classCode
        this.searchList.beAssessedName = value.clazzName
        this.searchList.schoolYearId = value.schoolYearId
        this.searchList.schoolCode = this.userInfo.schoolCode
        this.searchList.categoryId = this.categoryId
        this.searchList.categoryName = this.categoryName
        this.getScoreCategory()
      }
    },
    // 年级选择
    select (obj, tree) {
      const gradeIds = []
      this.gradeList.forEach(el => {
        return gradeIds.push(el.gradeCode)
      })
      if (obj.length > 0) {
        if (gradeIds.indexOf(obj[0]) === -1) {
          this.searchList.beAssessedCode = obj[0]
          this.searchList.beAssessedName = tree.code ? tree.code : tree.selectedNodes[0].data.props.title
          this.searchList.schoolYearId = tree.schoolYearId ? tree.schoolYearId : tree.selectedNodes[0].data.props.schoolYearId
          this.searchList.schoolCode = this.userInfo.schoolCode
          this.searchList.categoryId = this.categoryId
          this.searchList.categoryName = this.categoryName
          this.getScoreCategory()
        } else {
          this.itemData = []
          this.scoreInfo = {}
          this.total = 0
          this.scoreData = []
          this.typeData = []
          this.socreList = []
          this.showBI()
        }
      }
    },
    getIndex (index) {
      return (this.pageList.page - 1) * this.pageList.size + index + 1
    },
    // tab切换事件
    callback(item) {
      this.categoryId = item.split('+')[1]
      this.categoryName = item.split('+')[0]
      this.scoreList.forEach((el, index) => {
        if (el.id === Number(this.categoryId)) {
          this.scoreType = el.cycle
          this.baseScore = el.baseScore
        }
      })
      this.treeData = []
      this.initMenu()
    },
    // 获取评分类别
    async getScoreCategory (id) {
      const req = {
        categoryId: this.categoryId,
        classCode: this.searchList.beAssessedCode,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: this.searchList.schoolYearId,
        cycle: this.scoreType
      }
      const item = await this.getScoreItem(req)
      // 清空BI数据
      this.typeData = []
      this.scoreData = []
      this.itemData = item.data.itemList
      this.startTime = this.$tools.getDate(item.data.startTime, 1)
      this.endTime = this.$tools.getDate(item.data.endTime, 1)
      this.changeBi(item.data || [], 0)
      const params = {
        categoryId: this.categoryId,
        classCode: this.searchList.beAssessedCode,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: this.searchList.schoolYearId,
        page: this.pageList.page,
        size: this.pageList.size,
        cycle: this.scoreType
      }
      const res = await this.getScoreList(params)
      this.scoreInfo = res.data
      this.total = res.data.total
      if (res.data.list.length > 0) {
        res.data.list.map(el => {
          if (el.itemScoreSimpleDtoList.length > 0) {
            this.length = el.itemScoreSimpleDtoList.length
            this.socreList = el.itemScoreSimpleDtoList.map(el => {
              return el.itemName
            })
          }
        })
      }
    },
    // 切换BI数据
    changeBi (score, index) {
      this.scoreItem = index
      this.typeData = this.itemData.map(item => {
        return item.itemName
      })
      this.scoreData = this.itemData.map(item => {
        return item.score
      })
      this.showBI()
    },
    showBI () {
      const myChart = echarts.init(document.getElementById('total-bi'))
      // 绘制图表
      myChart.setOption({
        color: ['#82b3ff'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '1%',
          right: '1%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.typeData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: '40%',
            data: this.scoreData
          }
        ]
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .class-score {
    overflow-y: auto;
    .box-scroll {
      overflow-y:scroll;
      overflow-x: hidden;
      .box-border {
        overflow-y: auto;
        border-left: 1px #ccc solid;
        border-bottom: 1px #ccc solid;
      }
    }
    .grade-tree {
      padding: 0 10px;
      width: 200px;
      min-height: 400px;
      max-height: 800px;
      overflow-y: auto
    }
  .score-time {
      height: 30px;
      line-height: 35px;
      text-align: center;
      font-size: 22px;
    }
    .score-title {
      &.act {
        background-color: #ddd;
        color:#333
      }
      margin: 0px;
      li {
        height: 44px;
        line-height: 44px;
        text-align: center;
        border: 1px #ccc solid;
        border-bottom: none;
        border-left: none
      }
    }
  }
</style>
