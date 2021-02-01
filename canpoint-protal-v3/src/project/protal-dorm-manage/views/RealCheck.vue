<template>
  <div class="home page-layout u-fx-ver">
    <u-space direction="vertical" class="u-fx-ver u-fx-f1 u-mar-r10">
      <div class="layout-padd u-type-white-bg u-border-radius u-padd-b10">
        <div class="u-mar-l10 u-fx-ac">
          <span>统计数据截止时间：{{ createTime | gmtToDate }}</span>
          <img @click="refresh" class="refresh-img u-mar-l10" :src="RefreshImg" title="刷新" />
        </div>
        <div class="check-info u-fx-jsa">
          <div
            :class="[
              { 'colorone-bg': item.key === 'staySum' },
              { 'colortwo-bg': item.key === 'sleepingSum' },
              { 'colorthree-bg': item.key === 'notSum' },
              { 'colorfour-bg': item.key === 'dataSum' },
              'list u-fx-ac-jc u-mar-10 u-border-radius'
            ]"
            v-for="item in checkInfo"
            :key="item.key"
          >
            <div class="u-fx">
              <div class="icon u-border-radius-all u-padd-20 u-type-white-bg u-fx-ac-jc u-mar-r20">
                <img :src="item.icon" alt="" />
              </div>
              <div class="u-fx-ac-jc u-type-white">
                <span class="u-font-3 u-bold">{{ item.count }}</span>
                <span class="u-font-1">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="real-check u-fx u-fx-f1 u-scroll-y u-type-white-bg u-border-radius u-padd-b0"
        :style="{ height: autoHeight + 'px' }"
      >
        <dorm-class-tree
          :maxHeight="maxHeight - 30"
          isChoose
          isOnlyNewSchoolYear
          showAllTag="2"
          :hasAllDorm="false"
          defaultChooseFloor
          @changeTab="changeTab"
          @select="select"></dorm-class-tree>
        <div class="u-fx-f1 u-fx-ver u-padd-t20 u-padd-r20">
          <div class="u-fx-jsb u-mar-b10 u-fx-ac u-padd-l20">
            <a-radio-group @change="stateChange" v-model="state" name="radioGroup" :default-value="state">
              <a-radio :value="item.key" v-for="item in radioList" :key="item.key">
                {{ item.name }}
              </a-radio>
            </a-radio-group>
            <u-space class="u-fx-ac">
              <div class="tips u-type-primary-bg u-border-radius-all"></div>
              <span>在寝</span>
              <div class="tips u-type-error-bg u-border-radius-all u-mar-l10"></div>
              <span>不在寝</span>
              <u-button class="u-mar-l10" type="light" @click="fullScreen">全屏</u-button>
            </u-space>
          </div>
          <div class="u-fx-f1 u-fx-ac-jc" v-if="isDorm && roomList.length === 0">
            <u-empty description="暂无数据~"> </u-empty>
          </div>
          <div class="u-fx-f1 u-fx-ac-jc" v-if="!isDorm && studentList.length === 0">
            <u-empty description="暂无数据，请选择班级查询~"> </u-empty>
          </div>
          <room-list
            realCheckTag
            v-if="isDorm && roomList.length !== 0"
            :maxHeight="maxHeight - 30"
            ref="roomList"
            :roomList="roomList"
            @studentAction="studentAction"
          ></room-list>
          <div class="u-fx u-fx-wp u-scroll-y u-mar-t10" v-if="!isDorm && studentList.length !== 0" :style="{ maxHeight: (maxHeight - 60) + 'px' }">
            <u-tag
              pointer
              v-for="student in studentList"
              :key="student.userCode"
              :class="[
                { 'u-type-primary-light-bg u-type-primary': student.state === 1 },
                { 'u-type-error-light-bg u-type-error': student.state === 0 },
                'u-border-radius'
              ]"
            >
              <student-card
                :realCheckTag="student.state === 0"
                :student="student"
                ref="studentCard"
                @studentAction="studentAction">
                <div slot="button">{{ student.userName }}</div>
              </student-card>
            </u-tag>
          </div>
        </div>
      </div>
    </u-space>
    <repair-card-form
      ref="form"
      v-model="formStatus"
      v-if="formStatus"
      @submit="checkSubmit"
    >
    </repair-card-form>
  </div>
</template>

<script>
import DataImg from '../assets/img/check_data.png'
import NotImg from '../assets/img/check_not.png'
import RefreshImg from '../assets/img/check_refresh.png'
import SleepingImg from '../assets/img/check_sleeping.png'
import StayImg from '../assets/img/check_stay.png'
import DormClassTree from '../component/DormClassTree'
import RoomList from '../component/RoomList.vue'
import StudentCard from '../component/StudentCard.vue'
import RepairCardForm from '../component/RepairCardForm.vue'
import { mapState, mapActions } from 'vuex'
import UButton from '@/ucan-ui/components/u-button/u-button.vue'
import moment from 'moment'
export default {
  name: 'RealCheck',
  components: { DormClassTree, RoomList, UButton, StudentCard, RepairCardForm },
  data() {
    return {
      formData: [],
      formStatus: false,
      RefreshImg,
      autoHeight: document.body.clientHeight - 245,
      createTime: new Date(),
      checkInfo: [
        {
          key: 'staySum',
          name: '住宿总数（人）',
          icon: StayImg,
          count: 0
        },
        {
          key: 'sleepingSum',
          name: '在寝人数（人）',
          icon: SleepingImg,
          count: 0
        },
        {
          key: 'notSum',
          name: '不在寝人数（人）',
          icon: NotImg,
          count: 0
        },
        {
          key: 'dataSum',
          name: '实时在寝率',
          icon: DataImg,
          count: 0
        }
      ],
      roomList: [],
      studentList: [],
      maxHeight: document.body.clientHeight - 280,
      radioList: [
        {
          key: 2,
          name: '全部'
        },
        {
          key: 1,
          name: '只看在寝'
        },
        {
          key: 0,
          name: '只看不在寝'
        }
      ],
      isDorm: true,
      state: 2
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'schoolYear'])
  },
  mounted() {
    this.refresh()
  },
  methods: {
    ...mapActions('home', ['getStaticNum', 'getRoomUsers', 'chooseDormState', 'getRoomUsersByClass', 'repairCard']),
    // 刷新数据
    async refresh() {
      const res = await this.getStaticNum({
        schoolCode: this.schoolCode
      })
      this.createTime = new Date()
      this.checkInfo[0].count = res.data.allCount
      this.checkInfo[1].count = res.data.inBedCount
      this.checkInfo[2].count = res.data.outBedCount
      this.checkInfo[3].count = res.data.ratio
    },
    // 切换宿舍，班级 0宿舍，1班级
    changeTab(value) {
      console.log(value)
      this.isDorm = value === 0
      if (value) {
        this.getStudentList()
      } else {
        this.getRoomList()
      }
    },
    // 切换在寝不在寝 状态 0-不在寝 1-在寝 2-全部
    async stateChange(e) {
      console.log(e)
      this.state = e.target.value
      if (this.isDorm) {
        this.getRoomList()
      } else {
        this.getStudentList()
      }
    },
    // 切换宿舍，班级树菜单
    select(obj) {
      console.log(obj)
      if (obj.type === '班级') {
        this.isDorm = false
        if (!obj.data.classCode) {
          this.$message.warning('请按班级查询')
          return
        }
        this.classCode = obj.data.classCode
        this.getStudentList()
      } else {
        this.isDorm = true
        if (!obj.data.floorCode) {
          this.$message.warning('请按楼层查询')
          return
        }
        this.floorCode = obj.data.floorCode
        this.getRoomList()
      }
    },
    // 按宿舍查寝
    async getRoomList() {
      if (!this.floorCode) return
      if (this.state === 2) {
        const res = await this.getRoomUsers({
          schoolCode: this.schoolCode,
          parentCode: this.floorCode
        })
        this.roomList = res.data
      } else {
        const res = await this.chooseDormState({
          schoolCode: this.schoolCode,
          floorCode: this.floorCode,
          state: this.state
        })
        this.roomList = res.data
      }
    },
    // 按班级查寝
    async getStudentList() {
      if (!this.classCode) return
      const res = await this.getRoomUsersByClass({
        schoolCode: this.schoolCode,
        classCode: this.classCode,
        state: this.state === 2 ? null : this.state
      })
      this.studentList = res.data
    },
    /**
     * 学生操作
     * @param { type } Number 操作类型： 0.退宿 1.调宿 2.补卡
     * @param { item } Object 操作对象
     */
    studentAction(type, item) {
      console.log(type, item)
      this.studentInfo = item
      this.formStatus = true
    },
    // 补卡
    async checkSubmit(value) {
      const req = {
        repairCardTime: moment(value.repairCardDate).format('YYYY-MM-DD') + ' ' + moment(value.repairCardTime).format('HH:mm'),
        schoolCode: this.schoolCode,
        userCode: this.studentInfo.userCode
      }
      console.log(req)
      try {
        await this.repairCard(req)
        this.$tools.message('success', `补卡成功`)
        this.$refs.form.reset()
        this.$tools.goNext(() => {
          if (!this.isDorm) {
            this.getStudentList()
          } else {
            this.getRoomList()
          }
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    // 全屏
    fullScreen() {

    }
  }
}
</script>
<style lang="less" scoped>
.refresh-img {
  width: 14px;
  height: 14px;
  cursor: pointer;
}
.check-info {
  .colorone-bg {
    background-color: #00acac;
  }
  .colortwo-bg {
    background-color: #727cb6;
  }
  .colorthree-bg {
    background-color: #da6b75;
  }
  .colorfour-bg {
    background-color: #348fe2;
  }
  .list {
    height: 110px;
    width: 25%;
    .icon {
      width: 60px;
      height: 60px;
      img {
        width: 30px;
        height: 30px;
      }
    }
  }
}
.real-check {
  .tips {
    width: 4px;
    height: 4px;
  }
  /deep/ .ant-tag {
      margin: 3px 5px 5px 5px;
      padding: 5px 10px;
      min-width: 50px;
      min-height: 30px;
    }
}
.u-padd-b0 {
  padding-bottom: 0;
}
</style>
