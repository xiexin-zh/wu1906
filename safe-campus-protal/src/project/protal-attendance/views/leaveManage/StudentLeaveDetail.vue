<template>
  <div class="leave-detail page-layout qui-fx-ver">
    <a-menu :defaultSelectedKeys="['title']" mode="horizontal">
      <a-menu-item key="title">
        {{ title }}
      </a-menu-item>
    </a-menu>
    <div class="info qui-fx-wp">
      <p v-for="item in detailInfo" :key="item.key">
        <span>{{ item.key }}</span>
        <span>:</span>
        <span>{{ item.val }}</span>
      </p>
    </div>
    <div class="info">
      <p>
        <span>图片</span>
        <span>:</span>
        <span v-for="(elem, i) in photoList" :key="i">
          <img class="img" :src="elem" alt="">
        </span>
      </p>
    </div>
    <a-menu :defaultSelectedKeys="['title']" mode="horizontal">
      <a-menu-item key="title">审批流程</a-menu-item>
    </a-menu>
    <div class="title">
      <p>审批人</p>
    </div>
    <div class="process qui-fx-jsb qui-fx-ac" v-for="item in approveList" :key="item.id">
      <div class="qui-fx-ver">
        <img :src="item.photoUrl" alt="">
        <span class="process-name">{{ item.userName }}</span>
      </div>
      <div class="qui-fx-ver">
        <span>{{ item.state | getApprovalState }}</span>
        <span v-if="item.state === '0'"> -- </span>
        <span v-else>{{ item.updateTime | gmtToDate }}</span>
      </div>
    </div>
    <div class="title">
      <p>抄送人</p>
    </div>
    <div class="process qui-fx-jsb qui-fx-ac" v-for="item in copyList" :key="item.id">
      <div class="qui-fx-jsa qui-fx-ac">
        <img :src="item.photoUrl" alt="">
        <div class="qui-fx-ver">
          <span>{{ item.userName }}</span>
          <span>{{ item.state === '0' ? '未读' : '已读' }}</span>
        </div>
      </div>
      <span>{{ item.state === '0' ? '--' : item.readTime }}</span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'StudentLeaveDetail',
  components: {
  },
  data () {
    return {
      current: 'title',
      detailInfo: [
        {
          key: '姓名',
          val: ''
        },
        {
          key: '年级',
          val: ''
        },
        {
          key: '班级',
          val: ''
        },
        {
          key: '请假事由',
          val: ''
        },
        {
          key: '是否出校',
          val: ''
        },
        {
          key: '审批单号',
          val: ''
        },
        {
          key: '请假时间',
          val: ''
        },
        {
          key: '请假时长',
          val: ''
        },
        {
          key: '审批状态',
          val: ''
        }
      ],
      title: '基本信息',
      photoList: [],
      copyList: [],
      approveList: [],
      approveName: '',
      approveState: 0,
      approveTime: '',
      approveImg: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async mounted () {
    if ((this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9') && this.detailInfo[2].val !== 'gradeName') {
      this.detailInfo.splice(2, 0,
        {
          key: '专业',
          val: 'gradeName'
        })
    }
    this.showData()
  },
  methods: {
    ...mapActions('home', [
      'getStudentLeaveDetail'
    ]),
    async showData () {
      const res = await this.getStudentLeaveDetail(this.$route.query.id)
      const count = (this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9') ? 1 : 0
      this.detailInfo[0].val = res.data.userName
      this.detailInfo[1].val = (this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9') ? res.data.schoolYearId : res.data.gradeName
      this.detailInfo[1 + count].val = res.data.gradeName
      this.detailInfo[2 + count].val = res.data.className
      this.detailInfo[3 + count].val = res.data.reason
      this.detailInfo[4 + count].val = res.data.outSchool === 'Y' ? '是' : '否'
      this.detailInfo[5 + count].val = res.data.oddNumbers
      this.detailInfo[6 + count].val = this.$tools.getDate(new Date(res.data.startTime)) + ' ~ ' + this.$tools.getDate(new Date(res.data.endTime))
      this.detailInfo[7 + count].val = res.data.duration + '小时'
      this.detailInfo[8 + count].val = this.$tools.getState(res.data.state)
      this.approveName = res.data.leaveApprovalAddDto.userName
      this.approveTime = res.data.state === '0' ? '--' : this.$tools.getDate(new Date(res.data.initiationTime))
      this.approveImg = res.data.leaveApprovalAddDto.photoUrl
      this.approveState = this.$tools.getState(res.data.state)
      this.copyList = res.data.leaveCopyList
      this.approveList = res.data.leaveApprovalAddDto
      this.photoList = res.data.photoList
    }
  }
}
</script>
<style lang="less" scoped>
.leave-detail{
  background: #fff;
  .info,.pic{
    margin-top:20px;
    padding: 0 20px;
    p{
      margin-right: 50px;
      span{
        margin:0 5px;
      }
    }
  }
  .pic{
    margin-top:0;
  }
  .title{
    margin:10px;
    p{
      margin:0;
      font-weight: bold;
    }
  }
  .process{
    width: 400px;
    margin:10px;
    img{
      width: 60px;
      height: 60px;
      background: #ddd;
      border-radius: 100%;
      margin-right: 10px;
    }
    .process-name {
      margin: 10px;
    }
  }
  .img{
    width: 60px;
      height: 60px;
      background: #ddd;
      margin-right: 10px;
      margin: 0 10px;
  }
}
</style>
