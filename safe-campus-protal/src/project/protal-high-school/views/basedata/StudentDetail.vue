<template>
  <div class="student-detail page-layout qui-fx-ver">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="基本信息">
      </a-tab-pane>
    </a-tabs>
    <div class="top">
      <div class="qui-fx-ver">
        <p class="info qui-fx">
          <span>学年： {{ year }}学年</span>
          <span>姓名： {{ studentInfo.userName }}</span>
          <span>学号： {{ studentInfo.workNo }}</span>
          <span>年级： {{ studentInfo.gradeName }}</span>
          <span>班级： {{ studentInfo.className }}</span>
          <span>入学年份： {{ studentInfo.admissionTime }}</span>
          <span>性别： {{ studentInfo.sex | getSex() }}</span>
          <span>走住读类型： {{ studentInfo.hasDorm | getDorm() }}</span>
        </p>
        <p class="phone qui-fx">
          <span class="qui-fx-ac">人脸：</span>
          <a-popover placement="right">
            <template slot="content">
              <img :src="studentInfo.photoUrl" style="max-width: 200px; max-height: 220px; display: block;" alt="">
            </template>
            <img :src="studentInfo.photoUrl" style="max-width: 80px; max-height: 80px; display: block;" alt="">
          </a-popover>
        </p>
        <span>备注： {{ studentInfo.remark }}</span>
      </div>
    </div>
    <a-tabs default-active-key="1" @change="tabChange" v-model="tabValue">
      <a-tab-pane key="0" tab="个人简介">
        <no-data msg="暂无数据~" v-if="noDataTag"></no-data>
        <div v-else class="content qui-fx-ver qui-fx-f1 u-auto" :style="{ height: height + 'px' }">
          <div class="table intro qui-fx-ver qui-fx-f1">
            <div class="u-fx-ac u-mar-b10">
              <img class="line" src="http://canpointtest.com/mobile-img/line.png"/>
              <span class="u-mar-l20 u-font-01 u-bold">个人简介：</span>
            </div>
            <div class="u-mar-b20">
              <span class="content">{{ introduction }}</span>
            </div>
            <div v-if="photoList.length > 0" class="u-fx-ac u-mar-b10">
              <img class="line" src="http://canpointtest.com/mobile-img/line.png"/>
              <span class="u-mar-l20 u-font-01 u-bold">个人风采：</span>
            </div>
            <div class="">
              <div class="photo-list" v-for="(item, i) in photoList" :key="i">
                <img class="intro-img" :src="item.url"/>
                <div class="u-fx-ac-jc u-te">{{ item.photoDes }}</div>
              </div>
            </div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="1" tab="学生家长">
        <div class="content qui-fx-ver qui-fx-f1">
          <div class="table qui-fx-ver qui-fx-f1">
            <table-list
              :columns="columns"
              :table-list="parentsList">
              <template v-slot:other1="other1">
                <div>
                  <a-switch
                    :disabled="other1.record.hasMainParent"
                    @click.native.stop
                    @change="changeMain($event,other1.record)"
                    v-model="other1.record.hasMainParent"
                  />
                </div>
              </template>
            </table-list>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="异动记录">
        <div class="content qui-fx-ver qui-fx-f1">
          <div class="table qui-fx-ver qui-fx-f1">
            <table-list
              :columns="changeColumns"
              :table-list="changeList">
              <template v-slot:other1="other1">
                {{ other1.record.oldGradeName }}{{ other1.record.oldClassName }}
              </template>
              <template v-slot:other2="other2">
                {{ other2.record.newGradeName }}{{ other2.record.newClassName }}
              </template>
            </table-list>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="调宿记录">
        <div class="content qui-fx-ver qui-fx-f1">
          <div class="table qui-fx-ver qui-fx-f1">
            <table-list
              :columns="dormColumns"
              :table-list="dormList">
              <template v-slot:other1="other1">
                {{ other1.record.oldBuildingName }}{{ other1.record.oldFloorName }}{{ other1.record.oldRoomName }}
              </template>
              <template v-slot:other2="other2">
                {{ other2.record.newBuildingName }}{{ other2.record.newFloorName }}{{ other2.record.newRoomName }}
              </template>
            </table-list>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import { Switch } from 'ant-design-vue'
import Tools from '@u/tools'
import NoData from '@c/NoData'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '家长姓名',
    dataIndex: 'parentName',
    width: '10%'
  },
  {
    title: '家长电话',
    dataIndex: 'mobile',
    width: '20%'
  },
  {
    title: '亲属关系',
    dataIndex: 'relationship',
    width: '20%',
    customRender: (text) => {
      return Tools.relationship(text)
    }
  },
  {
    title: '注册时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: (text) => {
      return Tools.getDate(text, 1)
    }
  },
  {
    title: '是否主要家长',
    dataIndex: 'hasMainParent',
    width: '20%',
    scopedSlots: {
      customRender: 'other1'
    }
  }
]
const changeColumns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '异动类型',
    dataIndex: 'type',
    width: '20%',
    customRender: (text) => {
      switch (parseInt(text)) {
        case 1:
          return '入学'
        case 2:
          return '移出班级'
        case 3:
          return '加入班级'
        case 4:
          return '休学'
        case 5:
          return '退学'
        case 6:
          return '复学'
        case 7:
          return '升级'
        case 8:
          return '毕业'
        case 9:
          return '转班'
      }
    }
  },
  {
    title: '异动前',
    dataIndex: 'oldClassName',
    width: '20%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '异动后',
    dataIndex: 'newClassName',
    width: '20%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '异动时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: (text) => {
      return Tools.getDate(text)
    }
  } /* ,
  {
    title: '操作人',
    dataIndex: 'optName',
    width: '15%'
  } */
]
const dormColumns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '调宿类型',
    dataIndex: 'status',
    width: '20%',
    customRender: (text) => {
      switch (parseInt(text)) {
        case 1:
          return '入住'
        case 2:
          return '退宿'
        case 3:
          return '调宿'
      }
    }
  },
  {
    title: '调宿前',
    dataIndex: 'oldBuildingName',
    width: '20%'
  },
  {
    title: '调宿后',
    dataIndex: 'newBuildingName',
    width: '20%'
  },
  {
    title: '调宿时间',
    dataIndex: 'updateTime',
    width: '20%',
    customRender: (text) => {
      return Tools.getDate(text)
    }
  } /* ,
  {
    title: '操作人',
    dataIndex: 'optName',
    width: '15%'
  } */
]
const statusList = [
  {
    name: '在读',
    key: '1'
  },
  {
    name: '休学',
    key: '2'
  },
  {
    name: '退学',
    key: '3'
  },
  {
    name: '复学',
    key: '4'
  }
]

export default {
  name: 'StudentDetail',
  components: {
    NoData,
    TableList,
    ASwitch: Switch
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      changeTag: false,
      changeTitle: '变更',
      columns,
      changeColumns,
      dormColumns,
      userCode: '',
      year: '',
      parentsList: [],
      changeList: [],
      dormList: [],
      selectedParent: '',
      studentInfo: {},
      childCode: '',
      yearId: '',
      status: '1',
      tabValue: '0',
      statusList,
      photoList: [],
      introduction: '',
      noDataTag: false,
      height: 0
    }
  },
  mounted() {
    console.log(window.innerHeight)
    this.height = window.innerHeight - 460
    this.userCode = this.$route.query.userCode
    this.year = this.$route.query.year
    this.yearId = this.$route.query.yearId
    console.log(this.userCode)
    this.showStudentInfo()
  },
  methods: {
    ...mapActions('home', [
      'queryStudentInfoById',
      'queryParents',
      'setParents',
      'getChangeList',
      'getDormChangeList',
      'getIntro'
    ]),
    tabChange() {
      console.log(this.tabValue)
      this.showList()
    },
    changeMain(value, e) {
      console.log(value, e)
      this.parentsList.map((ele) => {
        ele.hasMainParent = false
      })
      const index = this.parentsList.findIndex((list) => list.id === e.id)
      if (index !== -1) {
        this.parentsList[index].hasMainParent = value
      }
      const req = {
        childCode: e.studentCode,
        parentCode: e.parentCode
      }
      this.setParents(req).then((res) => {
        this.$message.success('设置成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    },
    async showStudentInfo() {
      const res = await this.queryStudentInfoById({ userCode: this.userCode, schoolYearId: this.yearId })
      this.studentInfo = res.data
      this.childCode = res.data.userCode
      this.showList()
    },
    async showList() {
      if (this.tabValue === '0') {
        const res = await this.getIntro({
          schoolCode: this.userInfo.schoolCode,
          userCode: this.childCode,
          userType: '8'
        })
        if (!res.data || res.data.introduction === '') {
          this.introduction = ''
          this.photoList = []
          this.noDataTag = true
          return
        }
        this.introduction = res.data.introduction
        if (res.data.outUserStyleDtoList.length === 0) {
          return
        }
        this.photoList = res.data.outUserStyleDtoList.map((el) => {
          return {
            url: el.photoUrl,
            id: el.id,
            photoDes: el.photoDes
          }
        })
      } else if (this.tabValue === '1') {
        const res = await this.queryParents({ childCode: this.childCode })
        this.parentsList = res.data
        this.parentsList.map((ele) => {
          ele.hasMainParent = ele.hasMainParent === '1'
        })
      } else if (this.tabValue === '2') {
        const res = await this.getChangeList({ schoolCode: this.userInfo.schoolCode, userCode: this.userCode })
        this.changeList = res.data
      } else if (this.tabValue === '3') {
        const res = await this.getDormChangeList({ schoolCode: this.userInfo.schoolCode, userCode: this.userCode })
        this.dormList = res.data
      }
    },
    parentChange(value) {
      this.selectedParent = value
    },
    save() {
      console.log(this.selectedParent)
    }
  }
}
</script>
<style lang="less" scoped>
.student-detail {
  height: 100%;
  padding-top: 10px;
  .tit {
    margin-bottom: 20px;
    p {
      border-left: 3px solid #6882da;
      padding-left: 10px;
      font-weight: bold;
      margin: 0 0 0 10px;
      line-height: 25px;
      height: 25px;
      font-size: 16px;
    }
  }
  .top {
    background: #fff;
    padding: 10px 20px;
    margin-bottom: 10px;
    .info {
      margin-bottom: 20px;
      flex-wrap: wrap;
      span {
        margin-right: 50px;
        padding: 10px 0;
      }
    }
    .phone {
      margin-bottom: 20px;
      img {
        width: 80px;
        height: 80px;
        margin-right: 20px;
        border-radius: 4px;
      }
    }
  }
  .content {
    background: #fff;
    padding: 0 20px;
    .table {
      margin-bottom: 20px;
    }
  }
  .intro{
    .line {
      width: 2px;
      height: 14px;
    }
    .content{
      text-indent: 2em;
    }
    .photo-list {
      margin-bottom: 10px;
      border-radius: 4px;
      overflow: hidden;
      width: 240px;
      height: 200px;
      background-color:#fff;
      float: left;
      margin-right: 1.5%;
      position: relative;
      & > img {
        width: 240px;
        height: 180px;
        display: block;
      }
    }
  }
}
</style>
