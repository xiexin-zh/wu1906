<template>
  <div class="data-view qui-page qui-fx-ver">
    <div class="pos-box qui-fx-ver" style="padding: 0 30px 30px;">
      <div class="data-top"></div>
      <div class="data-menu qui-fx">
        <div class="data-tab qui-fx-f1" v-for="(menu, index) in menuList" :key="index">
          <dv-border-box-10 :color="borderColor">
            <div class="pos-box qui-fx-ac-jc">
              <div class="qui-fx-jc">
                <img :src="menu.icon" class="icon" alt="" />
                <div class="title">{{ menu.title }}</div>
              </div>
              <div class="qui-fx">
                <dv-border-box-10
                  v-for="(text, ind) in menu.total.split('')"
                  :key="ind"
                  class="total-text"
                  :color="['#0f439b', '#0a7cb9']"
                  >{{ text }}</dv-border-box-10
                >
              </div>
            </div>
          </dv-border-box-10>
        </div>
      </div>
      <div class="data-bi qui-fx-f1 qui-fx">
        <div class="qui-fx-f1">
          <dv-border-box-10 :color="borderColor">
            <div class="pos-box qui-fx-ver" style="padding: 0 20px 20px;">
              <div class="title-img">风险学校排名</div>
              <div class="qui-fx-f1 mar-t20">
                <div class="pos-box" v-if="this.sortConfig.data.length > 0">
                  <dv-scroll-ranking-board :config="sortConfig" />
                </div>
              </div>
            </div>
          </dv-border-box-10>
        </div>
        <div class="qui-fx-f2" style="margin: 0 20px;">
          <dv-border-box-10 :color="borderColor">
            <div class="pos-box qui-fx-ver">
              <div class="title-img">体温异常态势</div>
              <div class="qui-fx-f1">
                <div class="pos-box">
                  <div class="pos-box box-padd" id="yichang"></div>
                </div>
              </div>
            </div>
          </dv-border-box-10>
        </div>
        <div class="qui-fx-f1">
          <dv-border-box-10 :color="borderColor">
            <div class="pos-box qui-fx-ver">
              <div class="title-img">返校时间分布</div>
              <div class="qui-fx-f1 mar-t20">
                <div class="pos-box">
                  <div class="pos-box box-padd" id="backSchool"></div>
                </div>
              </div>
            </div>
          </dv-border-box-10>
        </div>
      </div>
      <div class="data-bi qui-fx-f1 qui-fx">
        <div class="qui-fx-f1">
          <dv-border-box-10 :color="borderColor">
            <div class="pos-box qui-fx-ver">
              <div class="title-img">疫情档案分布</div>
              <div class="qui-fx-f1 mar-t20">
                <div class="pos-box box-padd" id="circle"></div>
              </div>
            </div>
          </dv-border-box-10>
        </div>
        <div class="qui-fx-f2" style="margin: 0 20px;">
          <dv-border-box-10 :color="borderColor">
            <div class="pos-box qui-fx-ver">
              <div class="title-img">疫情上报态势</div>
              <div class="qui-fx-f1">
                <div class="pos-box box-padd" id="unReport"></div>
              </div>
            </div>
          </dv-border-box-10>
        </div>
        <div class="qui-fx-f1">
          <dv-border-box-10 :color="borderColor">
            <div class="pos-box qui-fx-ver">
              <div class="title-img">疫情返校分布</div>
              <div class="qui-fx-f1 mar-t20">
                <div class="pos-box box-padd" id="area"></div>
              </div>
            </div>
          </dv-border-box-10>
        </div>
      </div>
    </div>
    <dv-border-box-11 :titleWidth="400" class="qui-fx-f1 qui-fx-ver" style="letter-spacing: 2px; font-weight: 600" :title="orgName"></dv-border-box-11>
  </div>
</template>

<script>
import Highcharts from 'highcharts/highstock'
import HighchartsVariablepie from 'highcharts/modules/variable-pie'
import { actions } from '../../store'
import xx from '../../images/xx.png'
import xs from '../../images/xs.png'
import jzg from '../../images/jzg.png'
import zs from '../../images/zs.png'
import zfx from '../../images/zfx.png'
import yichang from './yichang'
import backSchool from './backSchool'
import unReport from './unReport'
import area from './area'
import pie from './pie'
import circle from './circle'
HighchartsVariablepie(Highcharts)
export default {
  name: 'Home',
  components: {},
  computed: {},
  data() {
    return {
      orgName: '',
      borderColor: ['#204486', '#00ffff'],
      organizeTotal: {
        school: 0,
        student: 0,
        teacher: 0
      },
      menuList: [
        {
          icon: xx,
          title: '下属学校(所)',
          total: '0',
        },
        {
          icon: xs,
          title: '学生总数(人)',
          total: '0',
        },
        {
          icon: jzg,
          title: '教职工总数(人)',
          total: '0',
        },
        {
          icon: zfx,
          title: '中高风险总数(人)',
          total: '0',
        },
        {
          icon: zs,
          title: '今日上报总数(人)',
          total: '0',
        },
      ],
      sortConfig: {
        data: [],
        unit: '人',
        waitTime: 2500,
      },
    }
  },
  mounted() {
    var url = window.location.href
    const paramsArr = url.substring(url.indexOf('?') + 1, url.indexOf('#/')).split('&')
    const paramsObj = {}
    paramsArr.forEach((item) => {
      const arr = item.split('=')
      paramsObj[arr[0]] = arr[1]
    })
    const phone = paramsObj.phone || '12486571549'
    this.orgName = decodeURI(paramsObj.orgName || '武汉全品教育科技有限公司')
    // this.getBaseData(phone)
    // this.getTemperatureChart(phone)
    // this.getDailyList(phone, '2020-04-10')
    // this.getReportChart('12486571549')
    // this.setBi()
  },
  methods: {
    // 获取机构下的学校，人员数
    async getBaseData (phone) {
      const res = await actions.getBaseData({
        phone
      })
      this.menuList[0].total = res.result.schoolCount + ''
      this.menuList[1].total = res.result.studentCount + ''
      this.menuList[2].total = res.result.teacherCount + ''
    },
    // 获取体温异常态势
    async getTemperatureChart (phone) {
      const res = await actions.getTemperatureChart({
        phone
      })
      Highcharts.chart('yichang', yichang(res.result))
    },
    // 疫情日报
    async getDailyList (phone, date) {
      const res = await actions.getDailyList({
        phone,
        date
      })
      this.sortConfig.data = res.result.map(item => {
        return {
          name: item.schoolName,
          value: item.excStudentCount + item.excTeacherCount
        }
      })
      this.$forceUpdate()
    },
    // 疫情上报记录
    async getReportChart (phone) {
      const res = await actions.getReportChart({
        phone
      })
      Highcharts.chart('unReport', unReport(res.result))
    },
    setBi() {
      Highcharts.chart('backSchool', backSchool)
      Highcharts.chart('area', area)
      Highcharts.chart('circle', circle)
    },
  },
}
</script>

<style lang="less" scoped>
.qui-page {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.title-img {
  margin: 0 auto;
  height: .4rem;
  width: 3.64rem;
  text-align: center;
  color: #fff;
  letter-spacing: 2px;
  font-size: 16px;
  line-height: .4rem;
  background: url('../../images/box-title1.png') no-repeat center;
  background-size: 3.64rem 100%;
}
.data-view {
  font-size: .16rem;
  background-color: #041e49;
}
.mar-t20 {
  padding-top: 10px;
}
.data-top {
  height: 80px;
}
.data-menu {
  height: 160px;
  .data-tab {
    color: #fff;
    margin-left: 30px;
    &:first-child {
      margin-left: 0;
    }
    .icon {
      width: 32px;
      height: 32px;
      display: block;
      margin-right: 10px;
    }
    .title {
      color: #03f7fc;
      font-size: 18px;
      padding-top: 1px;
      letter-spacing: 1px;
      margin-bottom: 20px;
    }
    .total-text {
      width: .5rem;
      height: .5rem;
      text-align: center;
      line-height: .5rem;
      font-size: .24rem;
      margin-left: 8px;
      &:first-child {
        margin-left: 0px;
      }
    }
  }
}
.data-bi {
  margin-top: 20px;
  .box-padd {
    padding: 0px 5px 5px;
  }
}
</style>
