<template>
  <div class="page-layout daily-statis  qui-fx-ver">
    <div class="content pos-box u-fx-ver">
      <div class="search-form  u-padd-b10 u-tips-color u-fx-jsb">
        <div class="left">
          <a-month-picker
            :allowClear="false"
            v-model="startValue"
            placeholder="请选择月份"
            :disabled-date="disabledStartMonth"
          />&nbsp;&nbsp;-&nbsp;
          <a-month-picker
            :allowClear="false"
            v-model="endValue"
            placeholder="请选择月份"
            :disabled-date="disabledEndMonth"
          />
          <a-button class="u-mar-l10" type="primary" @click="search()">搜索</a-button>
        </div>
        <div class="right">
          <a-button class="u-mar-l10" type="primary" @click="preview()">预览</a-button>
          <a-button class="u-mar-l10" type="primary" @click="exportReport()">导出安全报告</a-button>
        </div>
      </div>
      <div class="conter">
        <div class="charts-box1 list u-fx u-bg-fff ">
          <div class="u-fx-f1  u-fx-ver ">
            <div class="title ">安全巡检统计
              <div class="line"></div>
            </div>
            <div class="u-fx u-fx-jsb  u-mar-t20">
              <div class="card u-fx-ac u-type-primary u-fx-jc">已巡查次数：<span class="u-font-3 ">{{ patrol.done }}</span></div>
              <div class="card u-fx-ac u-type-primary u-fx-jc">未巡查次数：<span class="u-font-3 ">{{ patrol.notDone }}</span></div>
            </div>
            <circle-one class="u-mar-t40" v-if="Object.keys(patrol).length" :total="total"></circle-one>
          </div>
        </div>
        <div class="charts-box2 list u-bg-fff  u-fx">
          <div class="u-fx-f1  u-fx-ver ">
            <div class="title ">安全隐患统计
              <div class="line"></div>
            </div>
            <div class="u-fx u-fx-jsb  u-mar-t20">
              <div class="card u-fx-ac u-type-primary u-fx-jc">隐患总数：<span class="u-font-3 ">{{ danger.all }}</span></div>
              <div class="card u-fx-ac u-type-primary u-fx-jc">整改率：<span class="u-font-3 ">{{ danger.rate }}%</span></div>
            </div>
            <pre-echarts
              id="DangerStatis1"
              :radius="false"
              :legendData="['已整改','逾期未整改','整改中']"
              v-if="danger.preData.length>0"
              :data="danger.preData"
            ></pre-echarts>
          </div>
        </div>
        <div class="charts-box3 u-bg-fff  list u-fx">
          <div class=" u-fx-f1 u-bg-fff u-fx-ver">
            <div class="title u-mar-10 u-mar-l30">安全演练统计
              <div class="line"></div>
            </div>
            <div class="numberOfDrills u-fx-ac-jc ">演练次数</div>
            <div class="img-box u-fx-jc">
              <div
                v-for="(item,index) in rehearsal.count"
                :key="index"
                class="img-1 u-mar-r10 u-fx-ac-jc">{{ item }}</div>
              <span class="ci">次</span>
            </div>
            <div class="img-box2 ">
              <img src="../assets/img/copy@2x.png" alt="">
            </div>
          </div>
        </div>
        <div class="charts-box4 u-bg-fff  list u-fx">
          <div class=" u-fx-f1  u-fx-ver ">
            <div class="title">安全事故统计
              <div class="line"></div>
            </div>
            <div class="row-card u-fx-ac  u-fx-jc">
              <img src="../assets/img/ic1@2x.png" alt="">
              事故发生次数：{{ accident.happenCount }}次
            </div>
            <div class="row-card u-fx-ac  u-fx-jc">
              <img src="../assets/img/ic2@2x.png" alt="">
              事故受伤人数：{{ accident.injuredCount }}次
            </div>
            <div class="row-card u-fx-ac  u-fx-jc">
              <img src="../assets/img/ic3@2x.png" alt="">
              事故死亡人数：{{ accident.deadCount }}次
            </div>
          </div>
        </div>
        <div class="charts-box5 list u-bg-fff  u-fx">
          <div class="zhexian u-fx-f1  u-fx-ver ">
            <div class="title ">值班上报统计
              <div class="line"></div>
            </div>
            <div class="row frist u-mar-t40">
              <div class="text u-fx-jsb">
                值班次数
                <div class="u-type-primary">{{ duty.dutyCount }}次</div>
              </div>
              <div class="row-bg ">
                <div class="bg"></div>
                <div class="check" :style="styleObj(duty.dutyCount)"></div>
              </div>
            </div>
            <div class="row second u-mar-t20">
              <div class="text u-fx-jsb">
                值班异常次数
                <div class="u-type-primary number">{{ duty.dutyAbnormalCount }}次</div>
              </div>
              <div class="row-bg ">
                <div class="bg"></div>
                <div class="check" :style="styleObj(duty.dutyAbnormalCount)"></div>
              </div>
            </div>
            <div class="row three u-mar-t20">
              <div class="text u-fx-jsb">
                巡查点次数
                <div class="u-type-primary number">{{ duty.pointCount }}次</div>
              </div>
              <div class="row-bg ">
                <div class="bg"></div>
                <div class="check" :style="styleObj(duty.pointCount)"></div>
              </div>
            </div>
            <div class="row four u-mar-t20">
              <div class="text u-fx-jsb">
                巡查点异常数
                <div class="u-type-primary number">{{ duty.pointAbnormalCount }}次</div>
              </div>
              <div class="row-bg">
                <div class="bg"></div>
                <div class="check" :style="styleObj(duty.pointAbnormalCount)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <preview-report
      v-if="Object.keys(previewData).length>0"
      :data="previewData"
      v-model="formStatus"></preview-report>
  </div>
</template>
<script>
import moment from 'moment'
import PreEcharts from '../component/PreEcharts'
import CircleEcharts from '../component/CircleEcharts'
import PageNum from '@c/PageNum'
import CircleOne from '../component/CircleOne'

// import JSZipUtils from 'jszip-utils'
// import docxtemplater from 'docxtemplater'
// import PizZip from 'pizzip'
// import ImageModule from 'docxtemplater-image-module-free'
// import { saveAs } from 'file-saver'
import PreviewReport from './PreviewReport'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'SafetyReport',
  components: {
    PreEcharts,
    PageNum,
    CircleEcharts,
    PreviewReport,
    CircleOne
  },
  data() {
    return {
      formStatus: false,
      previewData: {},
      startValue: moment(new Date()),
      endValue: moment(new Date()),
      pageList: {
        page: 1,
        size: 10
      },
      accident: [], // 安全事故统计
      danger: {
        all: '',
        rate: '',
        preData: []
      }, //	安全隐患统计
      duty: [], //	值班上报统计
      total: 0, // 巡查率
      patrol: {}, //	安全巡检统计
      rehearsal: {
        count: '',
        first: '0',
        seconed: '0'
      } //	安全演练统计
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async created() {
    await this.showList()
    await this.getPreviewData()
  },
  async mounted() {
  },
  methods: {
    ...mapActions('home', ['schAllStatis', 'schExportData', 'schExport']),
    // 月日期选择器
    disabledStartMonth(startValue) {
      if (startValue.valueOf() > new Date()) return true
      const endValue = this.endValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndMonth(endValue) {
      if (endValue.valueOf() > new Date()) return true
      const startValue = this.startValue
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    search() {
      this.showList()
      this.getPreviewData()
    },
    async showList() {
      const req = {
        startYear: Number(this.startValue.format('YYYY')),
        startMonth: Number(this.startValue.format('M')),
        endYear: Number(this.endValue.format('YYYY')),
        endMonth: Number(this.endValue.format('M')),
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.schAllStatis(req)
      const { accident, danger, duty, patrol, rehearsal } = res.data
      this.accident = accident
      this.danger.all = danger.all
      this.danger.rate = danger.rate
      this.danger.preData = [
        { name: '整改中', value: danger.doing },
        { name: '逾期未整改', value: danger.delay },
        { name: '已整改', value: danger.done }
      ]
      this.duty = duty
      this.patrol = patrol
      this.total = patrol.rate
      rehearsal.count = 54
      this.rehearsal.count = [...`${rehearsal.count}`].map(el => parseInt(el))
    },
    async getPreviewData() {
      const req = {
        startYear: Number(this.startValue.format('YYYY')),
        startMonth: Number(this.startValue.format('M')),
        endYear: Number(this.endValue.format('YYYY')),
        endMonth: Number(this.endValue.format('M')),
        schoolCode: this.userInfo.schoolCode,
        schoolName: this.userInfo.schoolName
      }
      const res = await this.schExportData(req)
      this.previewData = res.data
    },
    styleObj(count) {
      return { width: `${(count / 500) * 100}%` }
    },
    // 预览
    preview() {
      this.formStatus = true
    },
    // 导出报告
    async exportReport() {
      const req = {
        startYear: Number(this.startValue.format('YYYY')),
        startMonth: Number(this.startValue.format('M')),
        endYear: Number(this.endValue.format('YYYY')),
        endMonth: Number(this.endValue.format('M')),
        schoolCode: this.userInfo.schoolCode,
        schoolName: this.userInfo.schoolName
      }
      fetch('http://192.168.2.242:8091/statistics/export', {
        method: 'POST',
        body: JSON.stringify(req),
        mode: 'cors'
      })
        .then(function(response) {
          return response.text()
        })
        .then(function(myJson) {
          const blob = new Blob([myJson], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8' })
          const objectUrl = URL.createObjectURL(blob)
          window.location.href = objectUrl
        })
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.daily-statis{
  background-color: #f0f2f5;
  .content{
    height: calc(100% - 10px);
    .title{
      position: relative;
      padding-left: 15px;
      .line{
        position: absolute;
        left:2px;
        top: 50%;
        transform: translate(-50%,-50%);
        width: 4px;
        height: 13px;
        background: #9698D6;
      }
    }
    .conter{
      display: grid;
      grid-gap: 10px 10px;
      grid-template-columns:580px minmax(400px,580px) auto;
      grid-template-rows: 406px repeat(auto-fill, 380px);
      grid-template-areas:'a b c'
                          'd f c';
      .list{
        border: 1px solid #EBEBEB;
        box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
        border-radius: 5px;
        padding: 15px 30px;
        .card{
           width: 247px;
           height: 70px;
           box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
           opacity: 0.8;
           border-radius: 9px;
         }
         .row-card{
          margin-top: 20px;
          width: 100%;
          height: 95px;
          background: #FFFFFF;
          box-shadow: 0px -4px 6px 0px rgba(239, 239, 239, 0.5), 0px 4px 6px 0px rgba(239, 239, 239, 0.5);
          box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
          opacity: 0.8;
          border-radius: 9px;
          img{
            width:53px;
            margin-right: 60px;
          }
         }
      }
      .charts-box1{
        grid-area:a;
      }
      .charts-box2{
        grid-area:b;
      }
      .charts-box3{
        position: relative;
        grid-area:c;
         background-color: #8ca0ff;
         padding: 0;
         .numberOfDrills{
          margin-top: 100px;
          font-size: 16px;
          font-family: PingFangSC;
          font-weight: 400;
          color: #333333;
          margin-bottom:24px;
         }
         .img-1{
          width: 80px;
          height: 98px;
          background: #71A6EE;
          border-radius: 12px 12px 12px 12px;
          position: relative;
          font-size: 72px;
          font-family: DINAlternate;
          font-weight: bold;
          color: #FFFFFF;
          &:before{
            content: '';
            display: block;
            position: absolute;
            width: 80px;
            height: 2px;
            background: #FFFFFF;
          }
         }
         .img-box2{
           width: 100%;
           position: absolute;
           left: 0;
           bottom: 0;
           img{
            width: 100%;
           }
         }
         .ci{
           margin-top: 60px;
          font-size: 30px;
          font-family: Adobe Heiti Std;
          font-weight: normal;
          color: #333333;
         }

      }
      .charts-box4{
        grid-area:d;
      }
      .charts-box5{
        grid-area:f;
        .row{
          .row-bg{
            position: relative;
            .bg{
              margin-top: 10px;
              width: 100%;
              height: 20px;
              background: #71A6EE;
              opacity: 0.15;
            }
            .check{
              position:absolute;
              top: 0;
              left: 0;
              // width: 80%;
              height: 20px;
              background: #71A6EE;
              opacity: 0.95 ;
            }
          }
        }
        .second{
          .number{
            color: #F8D581;
          }
            .bg{
              background: #F8D581 !important;
            }
            .check{
              background: #F8D581FF !important;
              opacity: 0.95 !important;
            }
        }
        .three{
          .number{
            color: #71CBA6FF;
          }
            .bg{
              background: #71CBA6FF !important;
            }
            .check{
              background: #71CBA6FF !important;
            }
        }
         .four{
          .number{
            color: #FF9F9EFF;
          }
            .bg{
              background: #FF9F9EFF !important;
            }
            .check{
              background: #FF9F9EFF !important;
            }
        }
      }
    }

  }
}
</style>
