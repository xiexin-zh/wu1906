<template>
  <div class="page-layout daily-statis  qui-fx-ver">
    <div class="content pos-box  u-fx-ver">
      <div class="search-form u-padd-t10 u-padd-b10 u-tips-color">
        <a-month-picker
          v-model="monthValue"
          placeholder="请选择月份"
          :disabled-date="disabledStartMonth"
        />
        <a-button class="u-mar-l10" type="primary" @click="search()">搜索</a-button>
      </div>
      <div class="numbers u-mar-t10 u-fx wh" >
        <div class="list u-bg-fff u-fx-jc  u-mar-r10  u-fx-ac">
          <img src="../../assets/img/xuexiao@2x.png" alt="">
          <div class="text u-mar-l20 v-fx-ver u-fx-ac-jc">学校总数
            <div class="number u-font-3 u-bold">
              {{ count.schoolCount }}
            </div>
          </div>
        </div>
        <div class="list u-bg-fff u-fx-jc  u-mar-r10  u-fx-ac">
          <img src="../../assets/img/pingjunfen@2x.png" alt="">
          <div class="text u-mar-l20 v-fx-ver u-fx-ac-jc">平均分
            <div class="number u-font-3 u-bold">
              {{ count.averageGrade }}
            </div>
          </div>
        </div>
        <div class="list u-bg-fff u-fx-jc u-mar-r10 u-fx-ac">
          <img src="../../assets/img/fenshijuan@2x.png" alt="">
          <div class="text u-mar-l20 v-fx-ver u-fx-ac-jc">最高分
            <div class="number u-font-3 u-bold">
              {{ count.maxGrade }}
            </div>
          </div>
        </div>
        <div class="list u-bg-fff u-fx-jc  u-fx-ac">
          <img src="../../assets/img/zuidifen@2x.png" alt="">
          <div class="text u-mar-l20 v-fx-ver u-fx-ac-jc">最低分
            <div class="number u-font-3 u-bold">
              {{ count.minGrade }}
            </div>
          </div>
        </div>
      </div>
      <div class="three-row  u-mar-b10 u-fx  u-mar-t10 ">
        <div class="left u-fx-f2 u-bg-fff u-padd-20 u—fx u-mar-r10">
          <div class="good-school  u-bd-1px u-fx-f1 ">
            <div class="u-fx-jsb">
              <div class="title u-padd-l10 u-mar-10">最优秀学校排行
                <div class="line"></div>
              </div>
              <a-button class="u-mar-10" size="small" @click="seeAll('正序')" type="primary">查看全部</a-button>
            </div>
            <div class="list u-bd-b  u-fx-jc u-fx-ac u-fx-f1  u-border-radius">
              <div class="img-box u-fx-f1 u-fx-je">
                <img src="../../assets/img/trophy1@2x.png" alt="">
              </div>
              <div class="text  v-fx-ver u-fx-ac-jc  u-fx-f2 " >
                <div v-if="rank.frontFirstSchool" class="number u-font-2 u-bold" style="color:#F39C1AFF">
                  {{ rank.frontFirstSchool.schoolName }}
                </div>
                <div v-if="rank.frontFirstSchool" class="number">
                  {{ rank.frontFirstSchool.ultimateGrade }}&nbsp;分
                </div>
              </div>
            </div>
            <div class="list u-bd-b  u-fx-jc u-fx-ac u-fx-f1  u-border-radius">
              <div class="img-box u-fx-f1 u-fx-je">trophy
                <img src="../../assets/img/trophy2@2x.png" alt="">
              </div>
              <div class="text  v-fx-ver u-fx-ac-jc  u-fx-f2 " >
                <div v-if="rank.frontSecondSchool" class="number u-font-2 u-bold" style="color:#F39C1AFF">
                  {{ rank.frontSecondSchool.schoolName }}
                </div>
                <div v-if="rank.frontSecondSchool" class="number">
                  {{ rank.frontSecondSchool.ultimateGrade }}&nbsp;分
                </div>
              </div>
            </div>
            <div class="list u-bd-b  u-fx-jc u-fx-ac u-fx-f1  u-border-radius">
              <div class="img-box u-fx-f1 u-fx-je">
                <img src="../../assets/img/trophy3@2x.png" alt="">
              </div>
              <div class="text  v-fx-ver u-fx-ac-jc  u-fx-f2 " >
                <div v-if="rank.frontThirdSchool" class="number u-font-2 u-bold" style="color:#F39C1AFF">
                  {{ rank.frontThirdSchool.schoolName }}
                </div>
                <div v-if="rank.frontThirdSchool" class="number">
                  {{ rank.frontThirdSchool.ultimateGrade }}&nbsp;分
                </div>
              </div>
            </div>
          </div>
          <div class="behind-school u-mar-l20 u-bd-1px u-fx-f1 ">
            <div class="u-fx-jsb">
              <div class="title u-padd-l10 u-mar-10">最差学校排名
                <div class="line"></div>
              </div>
              <a-button class="u-mar-10" size="small" @click="seeAll('倒序')" type="primary">查看全部</a-button>
            </div>
            <div class="list u-bd-b  u-fx-jc u-fx-ac u-fx-f1  u-border-radius">
              <div class="img-box u-fx-f1 u-fx-je">
                <img src="../../assets/img/1@2x.png" alt="">
              </div>
              <div class="text  v-fx-ver u-fx-ac-jc  u-fx-f2 " >
                <div v-if="rank.behindFirstSchool" class="number u-font-2 u-bold" style="color:#F39C1AFF">
                  {{ rank.behindFirstSchool.schoolName }}
                </div>
                <div v-if="rank.behindFirstSchool" class="number">
                  {{ rank.behindFirstSchool.ultimateGrade }}&nbsp;分
                </div>
              </div>
            </div>
            <div class="list u-bd-b  u-fx-jc u-fx-ac u-fx-f1  u-border-radius">
              <div class="img-box u-fx-f1 u-fx-je">
                <img src="../../assets/img/2@2x.png" alt="">
              </div>
              <div class="text  v-fx-ver u-fx-ac-jc  u-fx-f2 " >
                <div v-if="rank.behindSecondSchool" class="number u-font-2 u-bold" style="color:#F39C1AFF">
                  {{ rank.behindSecondSchool.schoolName }}
                </div>
                <div v-if="rank.behindSecondSchool" class="number">
                  {{ rank.behindSecondSchool.ultimateGrade }}&nbsp;分
                </div>
              </div>
            </div>
            <div class="list u-bd-b  u-fx-jc u-fx-ac u-fx-f1  u-border-radius">
              <div class="img-box u-fx-f1 u-fx-je">
                <img src="../../assets/img/3@2x.png" alt="">
              </div>
              <div class="text  v-fx-ver u-fx-ac-jc  u-fx-f2 " >
                <div v-if="rank.behindThirdSchool" class="number u-font-2 u-bold" style="color:#F39C1AFF">
                  {{ rank.behindThirdSchool.schoolName }}
                </div>
                <div v-if="rank.behindThirdSchool" class="number">
                  {{ rank.behindThirdSchool.ultimateGrade }}&nbsp;分
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right u-padd-20 u-fx-f1 u-bg-fff">
          <div class="title u-padd-l10  ">最优秀学校排行
            <div class="line"></div>
          </div>
          <pre-echarts
            id="DailyStatis2"
            v-if="rate.length>0"
            :data="rate"
          ></pre-echarts>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import PreEcharts from '../../component/PreEcharts'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'AssessStatis',
  components: {
    PreEcharts
  },
  data() {
    return {
      monthValue: moment(new Date()),
      count: {}, // 总体数量统计
      rate: [], // 饼图
      rank: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async created() {
    await this.getSchools()
    await this.showList()
  },
  async mounted() {
  },
  methods: {
    ...mapActions('home', ['gradeStatis', 'getEduCode', 'underSchoolList', 'treeView', 'statistics', 'pageStatistics']),
    // 月日期选择器
    disabledStartMonth(startValue) {
      if (startValue.valueOf() > new Date()) return true
    },
    search() {
      this.showList()
    },
    // 获取教育下面的schoolCode集合
    async getSchools() {
      const req = {
        eduCode: this.userInfo.schoolCode,
        areas: [],
        keyWord: '',
        page: 1,
        schoolStage: '',
        size: 30
      }
      const res = await this.underSchoolList(req)
      this.schoolList = res.data.list.map(v => {
        return {
          schoolName: v.schoolName,
          schoolCode: v.schoolCode
        }
      })
    },
    async showList() {
      const req = {
        'eduCode': this.userInfo.schoolCode,
        'month': this.monthValue.format('M'),
        'schoolList': this.schoolList,
        'year': this.monthValue.format('YYYY')
      }
      const res = await this.gradeStatis(req)
      const { count, rank, rate } = res.data
      this.count = count
      this.rank = rank
      this.rate = [
        { name: '基础建设', value: rate.baseBuild },
        { name: '安全管理', value: rate.securityManage },
        { name: '专项治理', value: rate.specialGovern },
        { name: '主动防御', value: rate.initiativeDefend }
      ]
    },
    // 查看详情
    seeAll() {
      this.$router.push(`/assessStatis/seeAll`)
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
    .numbers{
      height: 100px;
      .list{
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.06);
        opacity: 0.8;
        border-radius: 5px;
        width: 25%;
        img{
          width:48px
        }
      }
    }
    .three-row{
      height: 100%;
      padding-top: 10px;
      .list{
        height: 33%;
        img{
          width: 40px;
        }
      }
      .left{
        display: flex !important;
      }
    }
  }
}
</style>
