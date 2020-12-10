<template>
  <div class="student-detail page-layout qui-fx-ver">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="基本信息"> </a-tab-pane>
    </a-tabs>
    <div class="top">
      <div class="qui-fx-ver">
        <p class="info qui-fx">
          <span>姓名： {{ teacherInfo.userName }}</span>
          <span>性别： {{ teacherInfo.sex | getSex() }}</span>
          <span>工号： {{ teacherInfo.workNo }}</span>
          <span>手机号： {{ teacherInfo.mobile }}</span>
          <span>邮箱： {{ teacherInfo.email }}</span>
          <span>组织机构： {{ teacherInfo.orgName }}</span>
          <span>状态： {{ teacherInfo.onJob | getJodStatus() }}</span>
        </p>
        <p class="phone qui-fx">
          <span class="qui-fx-ac">人脸照片：</span>
          <a-popover placement="right">
            <template slot="content">
              <img
                :src="teacherInfo.photoUrl"
                style="max-width: 200px; max-height: 220px; display: block"
                alt=""
              />
            </template>
            <img
              :src="teacherInfo.photoUrl"
              style="max-width: 80px; max-height: 80px; display: block"
              alt=""
            />
          </a-popover>
        </p>
        <span>备注： {{ teacherInfo.remark }}</span>
      </div>
    </div>
    <a-tabs default-active-key="1" @change="tabChange" v-model="tabValue">
      <a-tab-pane key="0" tab="个人简介">
        <no-data msg="暂无数据~" v-if="noDataTag"></no-data>
        <div v-else class="content qui-fx-ver qui-fx-f1 u-auto" :style="{ height: height + 'px' }">
          <div class="table intro qui-fx-ver qui-fx-f1">
            <div class="u-fx-ac u-mar-b10">
              <img class="line" src="http://canpointtest.com/mobile-img/line.png" />
              <span class="u-mar-l20 u-font-01 u-bold">个人简介：</span>
            </div>
            <div class="u-mar-b20">
              <span class="content">{{ introduction }}</span>
            </div>
            <div v-if="photoList.length > 0" class="u-fx-ac u-mar-b10">
              <img class="line" src="http://canpointtest.com/mobile-img/line.png" />
              <span class="u-mar-l20 u-font-01 u-bold">个人风采：</span>
            </div>
            <div class="">
              <div class="photo-list" v-for="(item, i) in photoList" :key="i">
                <img class="intro-img" :src="item.url" />
                <div class="u-fx-ac-jc u-te">{{ item.photoDes }}</div>
              </div>
            </div>
          </div>
        </div>
      </a-tab-pane>
      <!-- <a-tab-pane key="1" tab="详细信息">
        <div class="content qui-fx-ver qui-fx-f1">
          <div class="table qui-fx-ver qui-fx-f1">
            <div class="teacher-status">
              <div class="table-list">
                <div class="msg-item" v-for="item in teacherMsg" :key="item.id">
                  <div class="name common">{{ item.name }}</div>
                  <div class="text common">{{ item.text }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="获奖信息">
        <div class="content qui-fx-ver qui-fx-f1">
          <div class="table qui-fx-ver qui-fx-f1">
            <table-list :columns="awardColumns" :table-list="awardList"> </table-list>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="课题及论文">
        <div class="content qui-fx-ver qui-fx-f1">
          <div class="table qui-fx-ver qui-fx-f1">
            <table-list :columns="paperColumns" :table-list="paperList"> </table-list>
          </div>
        </div>
      </a-tab-pane> -->
    </a-tabs>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NoData from '@c/NoData'
import TableList from '@c/TableList'
import Tools from '@/utils/tools'
const awardColumns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '荣誉称号',
    dataIndex: 'honoraryTitle'
  },
  {
    title: '级别',
    dataIndex: 'levelName'
  },
  {
    title: '嘉奖单位',
    dataIndex: 'awardUnit'
  },
  {
    title: '获奖时间',
    dataIndex: 'awardDate',
    customRender: (text) => {
      return Tools.getDate(text, 1)
    }
  }
]
const paperColumns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '论文(课题)题目',
    dataIndex: 'thesisTitle'
  },
  {
    title: '发表刊物',
    dataIndex: 'journal'
  },
  {
    title: '发表时间',
    dataIndex: 'publishDate',
    customRender: (text) => {
      return Tools.getDate(text, 1)
    }
  },
  {
    title: '独立或合作',
    dataIndex: 'channelType',
    customRender: (text) => {
      return text === 1 ? '合作' : '独立'
    }
  },
  {
    title: '级别',
    dataIndex: 'levelName'
  }
]
export default {
  name: 'TeacherDetail',
  components: {
    NoData,
    TableList
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      userCode: '',
      userId: '',
      teacherInfo: {},
      tabValue: '0',
      photoList: [],
      introduction: '',
      noDataTag: false,
      height: 0,
      awardColumns,
      paperColumns,
      awardList: [],
      paperList: [],
      teacherMsg: [
        {
          id: '1',
          name: '籍贯',
          text: ''
        },
        {
          id: '2',
          name: '民族',
          text: ''
        },
        {
          id: '3',
          name: '身份证号',
          text: ''
        },
        {
          id: '4',
          name: '政治面貌',
          text: ''
        }
      ]
    }
  },
  mounted() {
    this.height = window.innerHeight - 460
    this.userCode = this.$route.query.userCode
    this.userId = this.$route.query.id
    this.showInfo()
  },
  methods: {
    ...mapActions('home', ['detailInfo', 'getIntro', 'getTeacherAwardList', 'getTeacherPaperList']),
    tabChange() {
      console.log(this.tabValue)
      this.showList()
    },
    async showInfo() {
      const res = await this.detailInfo({
        userCode: this.userCode,
        schoolCode: this.userInfo.schoolCode
      })
      this.teacherInfo = res.data
      this.showList()
    },
    async showList() {
      if (this.tabValue === '0') {
        const res = await this.getIntro({
          schoolCode: this.userInfo.schoolCode,
          userCode: this.userCode,
          userType: '4'
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
        const { nativePlace, publicFace, nation, idNumber } = this.teacherInfo
        const msgArr = [nativePlace, nation, idNumber, this.$tools.getPoliticsStatus(publicFace)]
        this.teacherMsg = this.teacherMsg.map((item, index) => {
          return {
            ...item,
            text: msgArr[index]
          }
        })
      } else if (this.tabValue === '2') {
        const req = {
          schoolCode: this.userInfo.schoolCode,
          userId: this.userId
        }
        const res = await this.getTeacherAwardList(req)
        this.awardList = res.data
      } else if (this.tabValue === '3') {
        const req = {
          schoolCode: this.userInfo.schoolCode,
          userId: this.userId
        }
        const res = await this.getTeacherPaperList(req)
        this.paperList = res.data
      }
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
  .intro {
    .line {
      width: 2px;
      height: 14px;
    }
    .content {
      text-indent: 2em;
    }
    .photo-list {
      margin-bottom: 10px;
      border-radius: 4px;
      overflow: hidden;
      width: 240px;
      height: 200px;
      background-color: #fff;
      float: left;
      margin-right: 20px;
      position: relative;
      & > img {
        width: 240px;
        height: 180px;
        display: block;
      }
    }
  }
  .teacher-status {
    padding: 30px;
    box-sizing: border-box;

    .table-list {
      display: flex;
      flex-wrap: wrap;
      flex: 1;

      .msg-item {
        display: flex;
        width: 50%;
        border: 1px solid #ccc;

        .common {
          box-sizing: border-box;
          height: 40px;
          padding: 0 8px;
        }

        .name {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          width: 30%;
          background-color: rgba(242, 242, 242, 1);
        }
        .text {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 70%;
        }
      }
      .msg-item {
        border-top: 0;
        border-left: 0;
      }
      .msg-item:nth-child(2n + 1) {
        border-top: 0;
        border-left: 1px solid #ccc;
      }
      .msg-item:nth-child(1) {
        border-top: 1px solid #ccc;
      }
      .msg-item:nth-child(2) {
        border-top: 1px solid #ccc;
      }
    }
  }
}
</style>
