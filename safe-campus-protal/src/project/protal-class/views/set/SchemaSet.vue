<template>
  <div class="page-layout qui-fx-ver">
    <a-tabs v-model="autoKey" @change="tabChange">
      <a-tab-pane tab="欢迎模式" key="1">
        <no-data msg="暂无数据" v-if="noticeList.length === 0"></no-data>
        <div class="qui-fx-ver">
          <div class="box-scroll" :style="{ height: scrollH - 50 + 'px' }">
            <div
              class="notice-card qui-fx"
              v-for="item in noticeList"
              :key="item.id"
              style="position: relative"
            >
              <div class="pic qui-fx-f1 qui-fx-ver qui-fx-jsb">
                <div
                  class="notice-img qui-fx-ac-jc"
                  :style="{ backgroundImage: 'url(' + item.imgUrl + ')' }"
                >
                  <div class="title">
                    <h2 class="qui-te">{{ item.title }}</h2>
                    <h3 class="qui-te">{{ item.content }}</h3>
                  </div>
                  <div class="mask qui-fx-ac-jc" style="flex-wrap: wrap">
                    范围：{{ item.showType === '1' ? '全校班牌' : '指定班牌' }}
                    <span v-if="item.showType === '2'">
                      <span v-for="(elem, index) in item.outClasscardDtoList" :key="index">
                        {{ elem ? elem.deviceName : '' }}
                      </span>
                    </span>
                  </div>
                </div>
                <div class="qui-fx-jsa qui-fx-ac">
                  <div>
                    <a-tag :color="$tools.getApprovalColor(item.status)" class="content-state">{{
                      item.status
                    }}</a-tag>
                  </div>
                  <div>
                    <div class="time qui-te">开始：{{ item.startTime | getDate(5) }}</div>
                    <div class="time qui-te">结束：{{ item.endTime | getDate(5) }}</div>
                  </div>
                  <div class="notice-action qui-fx" v-if="item.status !== '已失效'">
                    <a-tooltip placement="topLeft" title="编辑">
                      <a-button
                        size="small"
                        class="edit-action-btn"
                        icon="form"
                        @click.stop="add(1, item)"
                      ></a-button>
                    </a-tooltip>
                    <a-tooltip placement="topLeft" title="删除">
                      <a-button
                        size="small"
                        class="del-action-btn"
                        icon="delete"
                        @click.stop="delClick(item)"
                      ></a-button>
                    </a-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <page-num :total="total" v-model="pageList" @change-page="welcomeGet"></page-num>
      </a-tab-pane>
      <a-tab-pane tab="测温模式" key="2">
        <div class="top-btn-group qui-fx mar-l10">
          <a-button class="export-all-btn" @click="batchSetSwitch('1')">
            <a-icon type="plus" />批量开启测温模式</a-button
          >
          <a-button class="del-btn" @click="batchSetSwitch('2')">
            <a-icon type="delete" />批量关闭测温模式</a-button
          >
        </div>
        <table-list
          :style="{ height: scrollH - 110 + 'px' }"
          is-check
          is-zoom
          :page-list="temperPageList"
          v-model="chooseList"
          :columns="columns"
          :table-list="temList"
        >
          <template v-slot:actions="action">
            <div>
              <a-switch
                @click.native.stop
                @change="switchChange(action.record.temperatureSwitch, action.record.id)"
                :defaultChecked="action.record.temperatureSwitch"
                v-model="action.record.temperatureSwitch"
              />
            </div>
          </template>
        </table-list>
        <page-num
          :total="temperTotal"
          v-model="temperPageList"
          @change-page="welcomeGet"
        ></page-num>
      </a-tab-pane>
      <a-tab-pane tab="考场模式" key="3">
        <div class="top-btn-group qui-fx mar-l10">
          <a-button class="export-all-btn" @click="batchSetSwitch('3')">
            <a-icon type="plus" />批量开启考场模式</a-button
          >
          <a-button class="del-btn" @click="batchSetSwitch('4')">
            <a-icon type="delete" />批量关闭考场模式</a-button
          >
        </div>
        <table-list
          :style="{ height: scrollH - 110 + 'px' }"
          is-check
          is-zoom
          :page-list="temperPageList"
          v-model="chooseList"
          :columns="columns"
          :table-list="temList"
        >
          <template v-slot:actions="action">
            <div>
              <a-switch
                @click.native.stop
                @change="switchChange(action.record.testSwitch, action.record.id)"
                :defaultChecked="action.record.testSwitch"
                v-model="action.record.testSwitch"
              />
            </div>
          </template>
        </table-list>
        <page-num
          :total="temperTotal"
          v-model="temperPageList"
          @change-page="welcomeGet"
        ></page-num>
      </a-tab-pane>
      <div
        slot="tabBarExtraContent"
        :class="autoKey === '1' ? 'qui-fx-ac mar-r10 u-mar-t10' : 'qui-fx-ac mar-r10'"
      >
        <a-radio-group
          v-if="autoKey === '1'"
          v-model="weleState"
          @change="stateChange"
          buttonStyle="solid"
        >
          <a-radio-button value="">全部</a-radio-button>
          <a-radio-button value="1">未开始</a-radio-button>
          <a-radio-button value="2">使用中</a-radio-button>
          <a-radio-button value="3">已失效</a-radio-button>
        </a-radio-group>
        <a-button v-if="autoKey === '1'" type="primary" class="mar-l10" @click="add(0)">发布欢迎模式</a-button
        >
        <search-form v-else is-reset @search-form="searchForm" :search-label="searchLabel">
          <template v-slot:place>
            <a-form-item label="班级">
              <a-cascader
                v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'"
                :options="highOptions"
                placeholder="请选择班级"
                v-decorator="['className']"
                @change="onChange"
              />
              <a-cascader
                v-else
                :options="classList"
                @click.stop="onFocus"
                :loadData="loadData"
                placeholder="请选择班级"
                v-decorator="['className']"
                @change="onChange"
              />
            </a-form-item>
          </template>
        </search-form>
      </div>
    </a-tabs>
  </div>
</template>
<script>
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import TableList from '@c/TableList'
import { Switch } from 'ant-design-vue'
import NoData from '@c/NoData'
const searchLabel = []
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '10%'
  },
  {
    title: 'SN码',
    dataIndex: 'deviceSn',
    width: '10%'
  },
  {
    title: '测温模式开关',
    dataIndex: 'bindStatus',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  },
  {
    title: '年级专业',
    dataIndex: 'gradeName',
    width: '10%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '10%'
  },
  {
    title: '教室',
    dataIndex: 'placeName',
    width: '30%'
  }
]
export default {
  name: 'SchemaSet',
  components: {
    PageNum,
    SearchForm,
    TableList,
    NoData,
    ASwitch: Switch
  },
  data() {
    return {
      columns,
      searchLabel,
      autoKey: '1',
      noticeList: [],
      pageList: {
        page: 1,
        size: 10
      },
      temperPageList: {
        page: 1,
        size: 20
      },
      chooseList: [],
      total: 0,
      temperTotal: 0,
      scrollH: 0,
      weleState: '',
      gradeList: [],
      classList: [],
      gradeId: '',
      classCode: '',
      searchTemInfo: {},
      temList: [],
      schoolYearId: '',
      highOptions: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'schoolYear'])
  },
  created() {
    this.scrollH = document.documentElement.offsetHeight - 180
    if (this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9') {
      this.schoolYearId = JSON.parse(window.sessionStorage.getItem('schoolYear')).schoolYearId
      this._getHighSchoolClass()
    } else {
      this.getSchoolYearId()
    }
  },
  mounted() {
    this.welcomeGet()
  },
  methods: {
    ...mapActions('home', [
      'updateWelComeInfo',
      'getWelcomeList',
      'getHighSchoolClass',
      'delWelcomeById',
      'getTemList',
      'getSchoolYear',
      'getGradeData',
      'getClassData',
      'setTemSwitch'
    ]),
    tabChange() {
      if (this.autoKey === '1') {
        this.welcomeGet()
      }
      if (this.autoKey === '2') {
        this.chooseList = []
        this.columns[3].title = '测温模式开关'
        this.columns[3].dataIndex = 'temperatureSwitch'
        this.temListGet()
      }
      if (this.autoKey === '3') {
        this.chooseList = []
        this.columns[3].title = '考场模式开关'
        this.columns[3].dataIndex = 'testSwitch'
        this.temListGet()
      }
    },
    async getSchoolYearId() {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getSchoolYear(req)
      if (!res.data.list) {
        return
      }
      this.schoolYearId = res.data.list[0].id
    },
    async _getHighSchoolClass() {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getHighSchoolClass(req)
      this.highOptions = this.newTreeData(res.data)
    },
    // 深层递归
    newTreeData(data) {
      data.forEach((item) => {
        if (item.gradeName) {
          item.gradeName = item.gradeName + '级'
        }
        item.children = item.subjectNodeDtos || item.classNodeDtos || []
        item.isLeaf = !item.subjectNodeDtos && !item.classNodeDtos
        item.label = item.classCode
          ? item.className
          : item.subjectCode
            ? item.subjectName
            : item.gradeName
        item.value = item.classCode
          ? item.classCode
          : item.subjectCode
            ? item.subjectCode
            : item.gradeCode
        if (item.subjectNodeDtos && item.subjectNodeDtos.length > 0) {
          this.newTreeData(item.subjectNodeDtos)
        }
        if (item.classNodeDtos && item.classNodeDtos.length > 0) {
          this.newTreeData(item.classNodeDtos)
        }
      })
      return data
    },
    async onFocus(value) {
      this.classList = []
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getGradeData(req)
      this.classList = res.data.list
      this.classList.forEach((el) => {
        el.label = el.name
        el.value = el.code
        el.isLeaf = false
      })
    },
    loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      const req = {
        gradeCode: targetOption.code,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: this.schoolYearId
      }
      this.getClassData(req).then((res) => {
        targetOption.loading = false
        targetOption.children = res.data.list
        targetOption.children.forEach((el) => {
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
    onChange(value, selectedOptions) {
      this.chooseSite = ''
      if (selectedOptions) {
        this.chooseSite += selectedOptions.map((ele) => {
          return ele.label
        })
      }
      console.log(this.chooseSite)
    },
    async welcomeGet() {
      this.pageList.schoolCode = this.userInfo.schoolCode
      this.pageList.status = this.weleState
      const res = await this.getWelcomeList(this.pageList)
      this.total = res.data.total
      this.noticeList = res.data.list
    },
    async temListGet() {
      this.searchTemInfo.schoolCode = this.userInfo.schoolCode
      const res = await this.getTemList({
        ...this.searchTemInfo,
        ...this.temperPageList,
        bindStatus: '1'
      })
      this.temperTotal = res.data.total
      this.temList = res.data.list
      this.temList.map((ele) => {
        ele.temperatureSwitch = ele.temperatureSwitch === '1'
        ele.testSwitch = ele.testSwitch === '1'
      })
    },
    add(type, record) {
      let path = ''
      if (type) {
        record.startTime = moment(new Date(record.startTime), 'YYYY-MM-DD HH:ss')
        record.endTime = moment(new Date(record.endTime), 'YYYY-MM-DD HH:ss')
        this.updateWelComeInfo(record)
        path = `/schemaSet/welCome?type=${type}&id=${record.id}`
      } else {
        this.updateWelComeInfo({
          showType: '1',
          imgUrl: ''
        })
        path = `/schemaSet/welCome?type=${type}`
      }
      this.$router.push({ path })
    },
    stateChange() {
      console.log(this.weleState)
      this.welcomeGet()
    },
    searchForm(value) {
      console.log(value)
      this.searchTemInfo.gradeCode = this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9' ? '' : (value.className[0] || '')
      this.searchTemInfo.classCode = this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9' ? (value.className[2] || '') : (value.className[1] || '')
      this.temListGet()
    },
    delClick(record) {
      this.$tools.delTip('确认要删除该欢迎模式吗?', () => {
        this.delWelcomeById(record.id).then((res) => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.welcomeGet()
          })
        })
      })
    },
    switchChange(val, id) {
      console.log(val)
      console.log(this.chooseList)
      const req = { ids: [id] }
      if (this.autoKey === '2') {
        req.temperatureSwitch = val ? '1' : '2'
      } else if (this.autoKey === '3') {
        req.testSwitch = val ? '1' : '2'
      }
      this.setTemSwitch(req).then((res) => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.temListGet()
        })
      })
    },
    batchSetSwitch(type) {
      console.log(this.chooseList)
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择班牌')
        return
      }
      const req = { ids: this.chooseList }
      if (type === '1') {
        req.temperatureSwitch = '1'
      } else if (type === '2') {
        req.temperatureSwitch = '2'
      } else if (type === '3') {
        req.testSwitch = '1'
      } else if (type === '4') {
        req.testSwitch = '2'
      }
      this.setTemSwitch(req).then((res) => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.temListGet()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.box-scroll {
  overflow: auto;
}
.notice-card {
  border-radius: 4px;
  background-color: #f5f5f5;
  padding: 10px;
  float: left;
  width: 18.88%;
  margin-left: 1%;
  overflow: hidden;
  margin-bottom: 20px;
  min-height: 200px;
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
.notice-img:hover .mask {
  opacity: 1;
}
.notice-img {
  margin: 0 15px 10px 0;
  width: 100%;
  height: 200px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
  .mask {
    position: absolute;
    height: 200px;
    width: 100%;
    top: 0;
    left: 0;
    padding: 6px 0px;
    background: rgba(0, 0, 0, 0.6);
    opacity: 0;
    z-index: 999;
    transition: 1s;
    color: #fff;
  }
  .title {
    width: 80%;
    margin: 0 auto;
    text-align: center;
  }
}
.time {
  font-size: 14px;
  line-height: 21px;
  height: 21px;
}
</style>
