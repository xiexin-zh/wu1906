<template>
  <div class="accident-add page-layout  bg-fff qui-fx-ver">
    <div class="content pos-box">
      <div class="title u-fx-ac-jc u-mar-t10 u-bold u-font-1 u-mar-b10">《{{ name }}》检查情况报告</div>
      <div class="time u-fx-ac-jc u-font-01">{{ time }}</div>
      <div class="list-box  u-mar-20 ">
        <div class="list-title u-bold">
          一、检查总体情况
        </div>
        <div class="list-cont   u-fx-wp u-mar-t20">
          <div class="item  u-fx-ac">
            <div class="lf u-fx-ac-jc none_border_bom u-type-primary-light-bg">检查出动人次</div>
            <div class="rt u-fx-ac-jc none_border_bom">{{ general.personCount }}</div>
          </div>
          <div class="item  u-fx-ac">
            <div class="lf u-fx-ac-jc none_border_bom u-type-primary-light-bg">检查单位(个)</div>
            <div class="rt u-fx-ac-jc none_border_bom">{{ general.unitCount }}</div>
          </div>
          <div class="item  u-fx-ac">
            <div class="lf u-fx-ac-jc none_border_bom  u-type-primary-light-bg">检查学校(所)</div>
            <div class="rt u-fx-ac-jc none_border_bom">{{ general.schoolCount }}</div>
          </div>
          <div class="item  u-fx-ac">
            <div class="lf u-fx-ac-jc  u-type-primary-light-bg">检查幼儿园(所)</div>
            <div class="rt u-fx-ac-jc  border-rt">{{ general.kindergartenCount }}</div>
          </div>
          <div class="item  u-fx-ac">
            <div class="lf  u-fx-ac-jc  u-type-primary-light-bg">检查培训机构(所)</div>
            <div class="rt u-fx-ac-jc">{{ general.trainingCount }}</div>
          </div>
          <div class="item  u-fx-ac">
            <div class="lf  u-fx-ac-jc  u-type-primary-light-bg">发现安全隐患(个)</div>
            <div class="rt u-fx-ac-jc">{{ general.dangerCount }}</div>
          </div>
          <div class="item  u-fx-ac">
            <div class="lf u-fx-ac-jc  u-type-primary-light-bg">下达整改通知书(份)</div>
            <div class="rt u-fx-ac-jc u-bd-r">{{ general.notificationCount }}</div>
          </div>
        <!-- <div class="item  u-fx-ac">
          <div class="lf u-fx-ac-jc  u-type-primary-light-bg">造</div>
          <div class="rt u-fx-ac-jc border-rt">{{ general.personCount }}</div>
        </div> -->
        </div>
      </div>
      <div class="list-box  u-mar-20 ">
        <div class="list-title u-bold">
          二、发现隐患情况
        </div>
        <div class="list-cont  u-fx u-mar-t20">
          <div class="item u-bd-1px">
            <div class=" u-fx-ac-jc u-padd-10 u-bd-b u-type-primary-light-bg">安全隐患总数(个)</div>
            <div class=" u-fx-ac-jc u-padd-10 ">{{ dangerLevel.dangerCount }}</div>
          </div>
          <div class="item  u-bd-1px">
            <div class="u-line u-fx-ac-jc u-padd-10 u-bd-b u-type-primary-light-bg">重大风险(个)</div>
            <div class="u-line u-fx-ac-jc  u-padd-10">{{ dangerLevel.heavyCount }}</div>
          </div>
          <div class="item u-bd-1px">
            <div class=" u-fx-ac-jc u-padd-10 u-bd-b u-type-primary-light-bg">较大风险(个)</div>
            <div class=" u-fx-ac-jc u-padd-10">{{ dangerLevel.biggerCount }}</div>
          </div>
          <div class="item u-bd-1px">
            <div class=" u-fx-ac-jc u-padd-10 u-bd-b u-type-primary-light-bg">一般风险(个)</div>
            <div class=" u-fx-ac-jc u-padd-10">{{ dangerLevel.generalCount }}</div>
          </div>
          <div class="item u-bd-1px">
            <div class=" u-fx-ac-jc u-padd-10 u-bd-b u-type-primary-light-bg">低风险(个)</div>
            <div class=" u-fx-ac-jc u-padd-10">{{ dangerLevel.lowCount }}</div>
          </div>
        </div>
      </div>
      <div class="table-list-box  u-mar-20 ">
        <div class="list-title u-fx-ac-jc u-bold">
          一、安全隐患明细表
        </div>
        <div class="list-cont u-fx-wp u-mar-t20">
          <a-table
            :rowKey="(record, index) => index"
            :columns="columns"
            :pagination="false"
            :data-source="dangerDetail"
            bordered>
          </a-table>
        </div>
      </div>
      <div class="table-list-box  u-mar-20 ">
        <div class="list-title u-fx-ac-jc u-bold">
          隐患数量排名
        </div>
        <div class="list-cont set-td-heigth  u-fx-wp u-mar-t20">
          <table border="0" class="u-bd-1px" width="100%" cellspacing="0">
            <tr class=" u-type-primary-light-bg">
              <td class="u-bd-l u-bd-b " align="center" valign="middle" width="25%" >排行</td>
              <td class="u-bd-l u-bd-b " align="center" valign="middle" >学校</td>
              <td class="u-bd-l u-bd-b u-bd-r" align="center" valign="middle" width="25%" >数量</td>
            </tr>
            <tr
              class=""
              v-for="(item,index) in dangerSchool"
              :key="index">
              <td class="u-bd-l u-bd-b " align="center" valign="middle" >{{ index+1 }}</td>
              <td class="u-bd-l u-bd-b " align="center" valign="middle" >{{ item.schoolName }}</td>
              <td class="u-bd-l u-bd-b u-bd-r" align="center" valign="middle">{{ item.totalCount }}</td>
            </tr>
            <tr>
              <td class="u-bd-l u-bd-b " align="center" valign="middle" rowspan="4">图表</td>
              <td class="u-bd-l u-bd-b" align="center" valign="middle" colspan="2" rowspan="4">
                <pre-bar-echarts v-if="dangerSchool.length>0" :dataList="dangerSchool"></pre-bar-echarts>
                <a-empty v-else :image="simpleImage" />
              </td>
            </tr>
            <tr>
              <td ></td>
            </tr>
            <tr>
              <td ></td>
            </tr>
            <tr>
              <td ></td>
            </tr>
          </table>
        </div>
      </div>
      <div class="table-list-box  u-mar-20 ">
        <div class="list-title  u-bold">
          三、存在的主要问题
        </div>
        <div class="list-cont   u-fx-wp u-mar-t20">
          <table border="0" class="u-bd-1px" width="100% " cellspacing:="0">
            <tr class=" u-type-primary-light-bg">
              <!-- colspan="4" -->
              <td class="u-bd-l u-bd-b u-padd-10" align="center" valign="middle" width="15%" >排行</td>
              <td class="u-bd-l u-bd-b u-padd-10" align="center" valign="middle" width="60%" >存在的最多的{{ mainIssues.length }}项指标</td>
              <td class="u-bd-l u-bd-b u-padd-10" align="center" valign="middle" width="25%">数量</td>
            </tr>
            <tr
              class="u-padd-10"
              v-for="(item,index) in mainIssues"
              :key="index" >
              <td class="u-bd-l u-bd-b u-padd-10" align="center" valign="middle" width="15%" >{{ index+1 }}</td>
              <td class="u-bd-l u-bd-b u-padd-10" align="center" valign="middle" width="60%" >
                {{ item.target }}
              </td>
              <td class="u-bd-l u-bd-b u-padd-10" align="center" valign="middle" width="25%">{{ item.count }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="list-box  u-mar-20 ">
        <div class="list-title u-bold">
          四、隐患整改情况
        </div>
        <div class="list-cont wh  u-fx-wp u-mar-t20">
          <div class="item  u-fx-ac">
            <div class="lf u-fx-ac-jc  u-type-primary-light-bg">截至日期</div>
            <div class="rt u-fx-ac-jc ">{{ reform.deadLine }}</div>
          </div>
          <div class="item  u-fx-ac">
            <div class="lf u-fx-ac-jc  u-type-primary-light-bg">全区隐患整改(个)</div>
            <div class="rt u-fx-ac-jc ">{{ reform.dangerCount }}</div>
          </div>
          <div class="item  u-fx-ac">
            <div class="lf u-fx-ac-jc   u-type-primary-light-bg">共整改隐患(个)</div>
            <div class="rt u-fx-ac-jc ">{{ reform.hasReformCount }}</div>
          </div>
          <div class="item  u-fx-ac">
            <div class="lf u-fx-ac-jc  u-type-primary-light-bg">隐患整改中(个)</div>
            <div class="rt u-fx-ac-jc  border-rt">{{ reform.reformingCount }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NoData from '@c/NoData'
import { Empty } from 'ant-design-vue'
import PreBarEcharts from './PreBarEcharts'
const columns = [
  {
    title: '学校',
    align: 'center',
    dataIndex: 'schoolName',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '存在问题',
    align: 'center',
    width: '30%',
    className: 'column-money',
    dataIndex: 'issue'
  },
  {
    title: '上报时间',
    align: 'center',
    dataIndex: 'time'
  },
  {
    title: '问题评估',
    align: 'center',
    dataIndex: 'issueAssess'
  }
]
export default {
  name: 'ViewsReport',
  components: {
    NoData,
    PreBarEcharts
  },
  data() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      form: this.$form.createForm(this),
      columns,
      detailedData: {},
      dangerLevel: {}, // 隐患情况
      dangerDetail: [], // 隐患明细table
      dangerSchool: [
        // {
        //   schoolName: 'wewr',
        //   totalCount: '10',
        //   biggerCount: '2',
        //   generalCount: '3',
        //   heavyCount: '2',
        //   lowCount: '3'
        // }
      ], // 隐患数量排名图标数据
      general: {}, // 检查的总体情况
      mainIssues: [], // 存在的问题
      name: '',
      reform: {}, // 整改情况
      time: '' // 时间
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.code = this.$route.query.code
    this.getDetails()
  },
  methods: {
    ...mapActions('home', ['seeReport']),
    async getDetails() {
      const res = await this.seeReport(this.code)
      const { findDanger, general, mainIssues, name, reform, time } = res.data
      this.dangerLevel = findDanger.dangerLevel
      this.dangerDetail = findDanger.dangerDetail
      if (findDanger.dangerSchool.length > 0 && findDanger.dangerSchool.length <= 5) {
        this.dangerSchool = findDanger.dangerSchool
      } else if (findDanger.dangerSchool.length > 5) {
        findDanger.dangerSchool.length = 5
        this.dangerSchool = findDanger.dangerSchool
      }
      this.general = general
      this.mainIssues = mainIssues
      this.name = name
      this.reform = reform
      this.time = time
    },
    setBi() {
      // Highcharts.chart('backSchool', backSchool)
      // Highcharts.chart('area', area)
      // Highcharts.chart('circle', circle)
    },
    cancel() {
      this.$router.go(-1)
    }

  }
}
</script>
<style lang="less" scoped>
.accident-add {
  // padding: 20px;
  box-sizing: content-box;
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
  }
  .u-line50{
    line-height: 50px !important;
  }
  .list-box{
    .list-cont{
      .item{
        width: 25%;
        .lf{
          width: 70%;
          line-height: 40px;
          border: 1px solid #e8e8e8;
          // margin-left: 1px $u-border-color solid ;
        }
        .rt{
          border-top: 1px solid #e8e8e8;
          border-bottom: 1px solid #e8e8e8;
          width: 30%;
          line-height: 40px;
        }
        .border-rt{
          border-right: 1px solid #e8e8e8;
        }
        .none_border_bom{
          border-bottom: none;
        }
      }
    }
  }
  .table-list-box{
    .ant-table-wrapper{
      width: 100%;
    }
    .set-td-heigth{
      td{
        height: 40px;
      }
    }
  }
}

</style>
