<template>
  <div class="home page-layout u-fx">
    <u-space direction="vertical" class="left u-fx-ver u-fx-f1 u-mar-r10">
      <div class="layout-padd u-type-white-bg u-border-radius">
        <h2 class>学校概况</h2>
        <div class="school-info u-fx-jsa">
          <div
            :class="[
              { 'colorone-bg': item.key === 'teacher' },
              { 'colortwo-bg': item.key === 'student' },
              { 'colorthree-bg': item.key === 'class' },
              'list u-fx-ac-jc u-mar-10 u-border-radius'
            ]"
            v-for="item in schoolInfo"
            :key="item.key"
          >
            <div class="u-fx">
              <div class="icon u-border-radius-all u-padd-20 u-type-white-bg u-fx-ac-jc u-mar-r20">
                <img :src="item.icon" alt />
              </div>
              <div class="u-fx-ac-jc u-type-white">
                <span class="u-font-3 u-bold">{{ item.count }}</span>
                <span class="u-font-1">{{ item.name }}总数({{ item.key === 'class' ? '个' : '人' }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="layout-padd u-type-white-bg u-border-radius">
        <h2>快捷功能</h2>
        <div class="school-fun u-fx-jsa">
          <div
            class="list u-fx-ac-jc u-mar-10 u-border-radius u-type-white-bg u-bd-1px u-shadow"
            v-for="item in schoolInfo"
            :key="item.key"
            @click="fastAction(item.path)"
          >
            <div class="u-fx">
              <div class="icon u-border-radius u-fx-ac-jc u-mar-r20 u-type-primary-light-bg">
                <img :src="item.fasticon" alt />
              </div>
              <div class="u-fx-ac-jc">
                <span class="u-font-1">快速{{ item.key === 'class' ? '创建' : '添加' }}{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="layout-padd u-type-white-bg u-border-radius u-padd-b0">
        <h2>待完善信息</h2>
        <div
          class="school-wait u-fx-f1 u-scroll-y u-padd-r40 u-padd-t30"
          :style="{ height: autoHeight + 'px' }"
        >
          <h3 class="u-mar-l10 u-fx-ac u-bold">
            <span class="marker u-mar-r10 colortwo-bg u-border-radius-all"></span>学生
          </h3>
          <div class="u-fx u-mar-b40">
            <div
              class="list u-padd-10 u-padd-l20 u-padd-r10 u-fx-ver u-mar-10 u-border-radius u-type-white-bg u-bd-1px u-shadow"
              v-for="(item, index) in waitStudentInfo"
              :key="index"
              @click="fastAction(item.path)"
            >
              <h3 class="u-font-2">{{ item.name }}</h3>
              <div class="u-fx-jsb u-fx-ac">
                <span class="u-font-3 u-bold colortwo">{{ item.count }}</span>
                <a-icon class="arrow-icon colortwo u-font-2" type="arrow-right" />
              </div>
            </div>
          </div>
          <div class="u-fx">
            <div class="u-fx-ver">
              <h3 class="u-mar-l10 u-fx-ac u-bold">
                <span class="marker u-mar-r10 colorone-bg u-border-radius-all"></span>教职工
              </h3>
              <div
                class="list u-padd-10 u-padd-l20 u-padd-r10 u-fx-ver u-mar-10 u-border-radius u-type-white-bg u-bd-1px u-shadow"
                v-for="(item, index) in waitTeacherInfo"
                :key="index"
                @click="fastAction(item.path)"
              >
                <h3 class="u-font-2">{{ item.name }}</h3>
                <div class="u-fx-jsb u-fx-ac">
                  <span class="u-font-3 u-bold colorone">{{ item.count }}</span>
                  <a-icon class="arrow-icon colorone u-font-2" type="arrow-right" />
                </div>
              </div>
            </div>
            <div class="u-fx-ver">
              <h3 class="u-mar-l10 u-fx-ac u-bold">
                <span class="marker u-mar-r10 colorthree-bg u-border-radius-all"></span>班级
              </h3>
              <div
                class="list u-padd-10 u-padd-l20 u-padd-r10 u-fx-ver u-mar-10 u-border-radius u-type-white-bg u-bd-1px u-shadow"
                v-for="(item, index) in waitClassInfo"
                :key="index"
                @click="fastAction(item.path)"
              >
                <h3 class="u-font-2">{{ item.name }}</h3>
                <div class="u-fx-jsb u-fx-ac">
                  <span class="u-font-3 u-bold colorthree">{{ item.count }}</span>
                  <a-icon class="arrow-icon colorthree u-font-2" type="arrow-right" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </u-space>
    <u-space direction="vertical" class="right u-fx-ver u-fx-f1">
      <div class="layout-padd u-type-white-bg u-border-radius school-year">
        <div class="u-fx-ac-jc u-mar-t40">
          <h1 class="u-bold">{{ schoolYearInfo.schoolYear }}</h1>
          <h1 class="u-bold">第{{ schoolYearInfo.semester }}学期</h1>
        </div>
      </div>
      <div
        class="layout-padd u-type-white-bg u-border-radius"
        :style="{ height: autoHeight + 133 + 'px' }"
      >
        <u-space direction="vertical" class="u-fx-ac-jc u-pos-box" :vSize="30">
          <h1 class>平安校园注册二维码</h1>
          <img class="QRcode" :src="appQrCode || QRcode" alt />
          <u-button v-if="appQrCode" type="primary" icon="download" @click="download">下载</u-button>
          <div class="u-fx-ac-jc">
            <span class="colortwo u-font-2 u-mar-b10">使用微信扫描二维码</span>
            <span class="colortwo u-font-2">关注后进入移动端</span>
          </div>
        </u-space>
      </div>
    </u-space>
  </div>
</template>

<script>
import QRcode from '../assets/img/QRcode.png'
import ClassImg from '../assets/img/class.png'
import FastClassImg from '../assets/img/fast_class.png'
import StudentImg from '../assets/img/student.png'
import FastStudentImg from '../assets/img/fast_student.png'
import TeacherImg from '../assets/img/teacher.png'
import FastTeacherImg from '../assets/img/fast_teacher.png'
import { mapState, mapActions } from 'vuex'
import baseData from '@u/libs/base-data'
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      QRcode,
      appQrCode: '',
      baseData,
      autoHeight: document.body.clientHeight - 503,
      schoolInfo: [
        {
          key: 'teacher',
          name: '教职工',
          icon: TeacherImg,
          fasticon: FastTeacherImg,
          count: 0,
          path: '/teacher?type=fastAction'
        },
        {
          key: 'student',
          name: '学生',
          icon: StudentImg,
          fasticon: FastStudentImg,
          count: 0,
          path: '/student?type=fastAction'
        },
        {
          key: 'class',
          name: '班级',
          icon: ClassImg,
          fasticon: FastClassImg,
          count: 0,
          path: '/classManage?type=fastAction'
        }
      ],
      waitStudentInfo: [
        {
          name: '未登记人像(人)',
          count: 0,
          path: '/student?type=waitInfo&info=photo'
        },
        {
          name: '未注册家长(人)',
          count: 0,
          path: '/student?type=waitInfo&info=parent'
        },
        {
          name: '待分配班级(人)',
          count: 0,
          path: '/student?type=waitInfo&info=unclass'
        }
      ],
      waitTeacherInfo: [
        {
          name: '未登记人像(人)',
          count: 0,
          path: '/teacher?type=waitInfo&info=photo'
        }
      ],
      waitClassInfo: [
        {
          name: '未设置班主任(个)',
          count: 0,
          path: '/classManage?type=waitInfo&info=unBZR'
        }
      ],
      schoolYearInfo: {
        schoolYear: '--学年',
        semester: '一'
      }
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'schoolYear'])
  },
  async created() {
    if (!this.schoolYear.code) {
      const schoolYear = await baseData.getUsingSchoolYear(this.schoolCode, () => {
        this.$router.push('/schoolYear')
      })
      if (!schoolYear) return
    }
    this.schoolYearInfo.schoolYear = this.schoolYear.name
    this.schoolYearInfo.semester = this.schoolYear.currentSemester === 1 ? '一' : '二'
    this._getIndexData()
  },
  methods: {
    ...mapActions('home', ['getIndexData']),
    // 下载二维码
    download() {
      if (!this.appQrCode) return
      window.location.href = this.appQrCode
    },
    // 快捷功能
    fastAction(path) {
      const url = path.split('?')[0]
      const menuList = JSON.parse(window.sessionStorage.getItem('protal-entry')).menuList
      const current = menuList.filter(item => {
        return item.menuUrl.indexOf(url) > -1
      })
      if (current.length > 0) {
        window.parent.setMenu(current[0].id)
        this.$router.push(path)
      } else {
        this.$tools.message('warning', '暂无操作权限')
      }
    },
    // 查询首页数据
    async _getIndexData() {
      const res = await this.getIndexData({
        schoolCode: this.schoolCode,
        schoolYearCode: this.schoolYear.code
      })
      this.appQrCode = res.data.appQrCode
      this.schoolInfo[0].count = res.data.teaALLNum
      this.schoolInfo[1].count = res.data.stuAllNum
      this.schoolInfo[2].count = res.data.classAllNum
      this.waitStudentInfo[0].count = res.data.noPhotoStuNum
      this.waitStudentInfo[1].count = res.data.noParentStuNum
      this.waitStudentInfo[2].count = res.data.noClassStuNum
      this.waitTeacherInfo[0].count = res.data.noPhotoTeaNum
      this.waitClassInfo[0].count = res.data.noHeadmasterClassNum
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  .left {
    width: calc(100% - 310px);
    .colorone-bg {
      background-color: #00acac;
    }
    .colortwo-bg {
      background-color: #348fe2;
    }
    .colorthree-bg {
      background-color: #727cb6;
    }
    .school-info {
      .list {
        height: 110px;
        width: 33.3%;
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
    .school-fun {
      .list {
        cursor: pointer;
        height: 90px;
        width: 33.3%;
        .icon {
          width: 50px;
          height: 50px;
          img {
            width: 25px;
            height: 25px;
          }
        }
      }
    }
    .school-wait {
      background: url(../assets/img/bottom_bg.png) no-repeat right bottom;
      background-origin: content-box;
      background-size: 280px 200px;
      .marker {
        width: 8px;
        height: 8px;
      }
      .list {
        width: 200px;
        cursor: pointer;
        .arrow-icon {
          transition: all 0.5s;
          transform: translateX(0px);
        }
      }
      .list:hover {
        .arrow-icon {
          transform: translateX(5px);
        }
      }
    }
  }
  .right {
    max-width: 300px;
    .school-year {
      height: 300px;
      background: url(../assets/img/right_bg.png) no-repeat center bottom;
      background-size: 255px 155px;
      h1 {
        font-size: 22px;
        letter-spacing: 3px;
      }
    }
    .QRcode {
      width: 178px;
      height: 178px;
    }
  }
  .colorone {
    color: #00acac;
  }
  .colortwo {
    color: #348fe2;
  }
  .colorthree {
    color: #727cb6;
  }
  .u-padd-b0 {
    padding-bottom: 0;
  }
}
</style>
