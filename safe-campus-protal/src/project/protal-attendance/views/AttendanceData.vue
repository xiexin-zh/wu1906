<template>
  <div class="page-layout attend-data qui-fx-ver">
    <div class="box">
      <div class="teacher-box">
        <div class="qui-fx-jsb qui-fx-ac u-padd-t20 u-padd-l20 u-padd-r20">
          <div class="qui-fx-ac">
            <img class="u-font-02" :src="kaoqin" alt="">
            <span class="u-mar-l10">教职工考勤数据统计</span>
          </div>
          <div>
            日期：<a-date-picker :default-value="moment(new Date(), 'YYYY-MM')" :disabled-date="disabledDate" @change="teacherChange" :allowClear="false"/>
          </div>
        </div>
        <div class="u-padd-l20 u-padd-r20">
          <div class="list" v-for="(item,index) in teacherList" :key="index">
            <div class="item qui-fx-ac">
              <div class="item-title u-tx-r">{{ item.title }}</div>
              <div class="attend-card qui-fx-ver" v-for="(teacher, i) in teacherData" :key="i" @click="teacherClick(1,item,teacher)">
                <ul>
                  <li class="tip">{{ ((item.key === '2' || item.key === '4') && i === 1) ? '早退' : teacher.title }}(人)</li>
                  <li
                    :class="['total',teacher.key === '1' ? 'u-type-success' : teacher.key === '2' ? 'u-type-error' : 'u-type-warning']"
                  >{{ index === 0 ? teacherTotal[i] : index === 1 ? teacherTotal[i + 3] : index === 2 ? teacherTotal[i + 6] : teacherTotal[i + 9] }}</li>
                </ul>
                <div class="list-icon"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="student-box">
        <div class="qui-fx-jsb qui-fx-ac u-padd-t20 u-padd-l20 u-padd-r20">
          <div class="qui-fx-ac">
            <img class="u-font-02" :src="kaoqin" alt="">
            <span class="u-mar-l10">学生考勤数据统计</span>
          </div>
          <div>
            日期：<a-date-picker :default-value="moment(new Date(), 'YYYY-MM')" :disabled-date="disabledDate" @change="studentChange" :allowClear="false"/>
          </div>
        </div>
        <div class="u-padd-l20 u-padd-r20">
          <div class="list" v-for="item in studentList" :key="item.key">
            <div class="item qui-fx-ac">
              <div class="item-title u-tx-r">{{ item.title }}</div>
              <div class="attend-card qui-fx-ver" v-for="(student, index) in teacherData" :key="index" @click="teacherClick(0,item,student)">
                <ul>
                  <li class="tip">{{ (item.key === '2' && index === 1) ? '早退' : student.title }}(人)</li>
                  <li :class="['total',student.key === '1' ? 'u-type-success' : student.key === '2' ? 'u-type-error' : 'u-type-warning' ]">
                    {{ item.key === '1' ? studentTotal[index] : studentTotal[index + 3] }}
                  </li>
                </ul>
                <div class="list-icon"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom"></div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import 'moment/locale/zh-cn'
import kaoqin from '../assets/img/kaoqin.png'
export default {
  name: 'AttendanceData',
  components: {},
  data() {
    return {
      kaoqin,
      moment,
      teacherData: [
        {
          key: '1',
          title: '正常',
          total: '0',
          tip: ''
        },
        {
          key: '2',
          title: '迟到',
          total: '0',
          tip: ''
        },
        {
          key: '3',
          title: '缺卡',
          total: '0',
          tip: ''
        }
      ],
      studentData: [
        {
          title: '正常',
          total: '0',
          tip: ''
        },
        {
          title: '迟到',
          total: '0',
          tip: ''
        },
        {
          title: '缺卡',
          total: '0',
          tip: ''
        }
      ],
      teacherList: [
        {
          key: '1',
          title: '上午上班'
        },
        {
          key: '2',
          title: '上午下班'
        },
        {
          key: '3',
          title: '下午上班'
        },
        {
          key: '4',
          title: '下午下班'
        }
      ],
      studentList: [
        {
          key: '1',
          title: '上学'
        },
        {
          key: '2',
          title: '放学'
        }
      ],
      studentDate: new Date(),
      teacherDate: new Date(),
      teacherTotal: [],
      studentTotal: [],
      value: 1
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showTeaData()
    this.showStuData()
  },
  methods: {
    ...mapActions('home', [
      'getTeaRecordStatic', 'getStuRecordStatic'
    ]),
    async showTeaData() {
      this.teacherTotal = []
      const req = {
        date: this.teacherDate,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getTeaRecordStatic(req)
      this.teacherTotal.push(res.data[0].morningOnNormalCount || 0)
      this.teacherTotal.push(res.data[0].morningOnLateCount || 0)
      this.teacherTotal.push(res.data[0].morningOnNoRecordCount || 0)
      this.teacherTotal.push(res.data[0].morningOffNormalCount || 0)
      this.teacherTotal.push(res.data[0].morningOffEarlyCount || 0)
      this.teacherTotal.push(res.data[0].morningOffNoRecordCount || 0)
      this.teacherTotal.push(res.data[0].noonOnNormalCount || 0)
      this.teacherTotal.push(res.data[0].noonOnLateCount || 0)
      this.teacherTotal.push(res.data[0].noonOnNoRecordCount || 0)
      this.teacherTotal.push(res.data[0].noonOffNormalCount || 0)
      this.teacherTotal.push(res.data[0].noonOffEarlyCount || 0)
      this.teacherTotal.push(res.data[0].noonOffNoRecordCount || 0)
    },
    async showStuData() {
      this.studentTotal = []
      const req = {
        date: this.studentDate,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getStuRecordStatic(req)
      this.studentTotal.push(res.data[0].onNormalCount || 0)
      this.studentTotal.push(res.data[0].lateCount || 0)
      this.studentTotal.push(res.data[0].onNoRecordCount || 0)
      this.studentTotal.push(res.data[0].offNormalCount || 0)
      this.studentTotal.push(res.data[0].earlyCount || 0)
      this.studentTotal.push(res.data[0].offNoRecordCount || 0)
    },
    disabledDate (current) {
      return current && current > moment().endOf('day')
    },
    teacherChange(e, string) {
      this.teacherDate = string
      this.showTeaData()
    },
    studentChange(e, string) {
      this.studentDate = string
      this.showStuData()
    },
    teacherClick(type, item, record) {
      const path = type ? 'teacherRecord' : 'studentRecord'
      this.$router.push({
        path: path,
        query: {
          date: type ? this.teacherDate : this.studentDate,
          type: item.key,
          state: record.title
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.attend-data {
  background-color: #fff;
  .title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .attend-card {
    padding: 10px 20px;
    margin-top: 20px;
    width: 28%;
    float: left;
    margin-left: 2%;
    height: 120px;
    background-color: #f1f6ff;
    position: relative;
    cursor: pointer;
    .tip {
      font-size: 16px;
    }
    .total {
      padding: 10px 0;
      font-size: 24px;
      font-weight: bold;
    }
    .list-icon {
      width: 60px;
      height: 60px;
      position: absolute;
      right: 0;
      bottom: 0;
      background-size: 100% 100%;
    }
    &:nth-child(2) .list-icon {
      background: url('../assets/img/icon_chidao.png') no-repeat center;
    }
    &:nth-child(3) .list-icon{
      background: url('../assets/img/icon_queka.png') no-repeat center;
    }
    &:nth-child(4) .list-icon{
      background: url('../assets/img/icon_zaotui.png') no-repeat center;
    }
  }
}

.bottom {
  position: fixed;
  bottom: 15px;
  height: 258px;
  width: calc(100% - 30px);
  background: url('../assets/img/dbct.png') no-repeat center;
  background-size: 100% 100%;
}
.teacher-box {
  max-height: 350px;
  overflow-y: scroll;
}
.item-title {
  width: 60px;
}
.item {
  float: left;
  width: 50%;
}
</style>
