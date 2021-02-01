<template>
  <view class="real-su u-page u-fx u-fx-ver">
    <u-popup v-model="dialogTag" mode="center" length="70%">
      <student-info ref="studentInfo" :current-student="currentStudent">
      </student-info>
    </u-popup>
    <view class="banner-img banner-sscq"></view>
    <no-data v-if="dataList.length === 0"></no-data>
    <view class="u-fx-ver u-fx-f1 u-mar-t20" v-else>
      <view class="build-scroll u-fx u-mar-l20 u-mar-r20">
        <view @click="changeFloor(menu, index)" v-for="(menu, index) in buildList" :key="index" :class="['build u-padd-l20 u-padd-r20 ', {'act': current === index}]">
          {{ menu.value }}
        </view>
      </view>
      <view class="u-fx-f1 u-fx u-mar-t20">
        <scroll-view scroll-y="true" class="scroll-h">
          <view
            @click="showPerson(item, getStatus(item.personId))"
            v-for="(item, index) in studentList"
            :key="index"
            :class = "['student-btn student-list', {
            'bzq_sjx_icon': getStatus(item.userCode) === '5',
          }]"
          >{{ item.userName }}</view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import NoData from '../../../components/no-data/no-data'
import TopMenu from '../component/TopMenu'
import StudentInfo from '../component/StudentInfo'
import CheckStatus from '../component/CheckStatus'
import SignCard from '../component/SignCard'
import { setTimeout } from 'timers'
import { store, actions } from '../store/index.js'
export default {
  name: 'RealCheckS',
  components: {
    TopMenu,
    StudentInfo,
    CheckStatus,
    SignCard,
    NoData
  },
  data () {
    return {
      dialogTag: false,
      studentList: [],
      currentStudent: {},
      statusList: [],
      info: {},
      floorList: [],
      buildList: [],
      dataList: [],
      current: 0
    }
  },
  mounted () {
    console.log(123)
    // this.getStudentList()
    this._getTeaClass()
  },
  methods: {
    // 获取班级
    async _getTeaClass () {
      const req = {
        userCode: store.userInfo.userCode,
        schoolCode: store.userInfo.schoolCode
      }
      const res = await actions.getTeaClass(req)
      this.dataList = res.data
      if (res.data.length === 0) return
      this.buildList = res.data.map(item => {
        return {
          key: item.clazzCode,
          value: item.gradeName + item.clazzName
        }
      })
      this.classCode = this.buildList[0].key
      this.getStudentList()
    },
    showPerson (item, status) {
      this.dialogTag = true
      this.currentStudent = {
        userStatus: status === '5' ? '1' : '2',
        userCode: item.userCode,
        userName: item.userName
      }
      setTimeout(() => {
        this.$refs.studentInfo.loadInfo(item.userCode)
      })
    },
    getStudentList () {
      actions.getStatusByClass({
        gender: '',
        schoolCode: store.userInfo.schoolCode,
        classCode: this.classCode
      }).then(res => {
        this.statusList = res.data
        actions.getStudentByClass({
          gender: '',
          schoolCode: store.userInfo.schoolCode,
          classCode: this.classCode
        }).then(res => {
          this.studentList = res.data
        })
      })
    },
    getStatus (id) {
      if (this.statusList === null) {
        this.statusList = []
      }
      let status = this.statusList.find(item => {
        return item.userCode === id
      })
      return typeof status === 'object' ? status.stateValue : '5'
    },
     changeFloor (item, index) {
      this.current = index
      this.currentIndex = 0
      this.classCode = item.key
      this.getStudentList(item.key)
    },
  }
}
</script>

<style lang="scss" scoped>
.student-list {
  margin-top: 30rpx;
  float: left;
  width: 30%;
  margin-left: 2.5%;
  color: #666;
  height: 60rpx;
  line-height: 60rpx;
  background-color: $u-border-color;
  text-align: center;
  border-radius: 8px;
}
.real-su {
  .banner-sscq {
    background: url('http://canpointtest.com/mobile-img/sg-sscq.png') no-repeat;
  }
  .banner-img {
    width: 100%;
    height: 240rpx;
    background-size: 100% 240rpx;
  }
  .scroll-h {
    height: calc(100vh - 330rpx);
    background-color: #fff;
  }
}
/deep/ .u-mode-center-box{
  border-radius: 12rpx;
}
/deep/ .u-section-title:after{
  height: 40rpx;
}
/deep/ .u-size-default{
  height: 74rpx;
  margin-top: 16rpx;
}
.build-scroll {
  width: calc(100vw - 40rpx);
  height: 50rpx;
  line-height: 50rpx;
  overflow-x: scroll;
  white-space: nowrap;
  .build {
    // box-shadow: 1rpx 0rpx 6rpx $u-border-color-dark;
    // background-color:#fff;
    color: $u-content-color;
    &.act {
      // font-size: 30rpx;
      // background-color:$u-bg-color;
      color: $u-type-primary;
    }
  }
}
</style>
