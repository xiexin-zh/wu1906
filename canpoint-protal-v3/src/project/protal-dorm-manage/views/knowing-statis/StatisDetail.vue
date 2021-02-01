<template>
  <div class="class-detail page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-detail-show :detail-info="detailInfo" title="基本信息"></u-detail-show>
    </u-space>
    <u-tabs v-model="activeTab" @change="changeHasNomarl" :tab-list="tabList"></u-tabs>
    <div class="u-fx-ver u-fx-f1">
      <u-space direction="vertical" class="layout-padd u-bg-fff ">
        <div class="search-form ">
          <a-row type="flex" justify="space-between" align="middle">
            <a-col :span="1">
              <slot name="left"></slot>
            </a-col>
            <a-col :class="['u-fx u-fx-ac u-fx-je']">
              <a-form :form="form" layout="inline" class="u-fx">
                <a-form-item >
                  <choose-high-grade
                    ref="chooseHighGrade"
                    v-if="schoolType"
                    :school="schoolCode"
                    @choose="selectOrg"></choose-high-grade>
                  <choose-grade
                    v-else
                    ref="chooseGrade"
                    :school="schoolCode"
                    :schoolYearCode="schoolYear.code"
                    @choose="selectOrg"></choose-grade>
                </a-form-item>
                <a-form-item >
                  <choose-dorm
                    ref="chooseDorm"
                    :school="schoolCode"
                    @choose="selectDrom"></choose-dorm>
                </a-form-item>
              </a-form>
              <u-button type="light" @click="showDetail">搜索</u-button>
              <u-button type="default" @click="resetBtn">重置</u-button>
              <slot name="right"></slot>
            </a-col>
          </a-row>
        </div>
      </u-space>
      <u-table
        is-zoom
        :page-list="pageList"
        :columns="columnsDetail"
        :table-list="recordList"
      >
        <template v-slot:slotOne="slotOne">
          <u-tag type="primary-bd" pointer>{{ slotOne.record.studentCount }}</u-tag>
        </template>
        <template v-slot:slotThree="slotThree">
          <u-tag type="primary-bd" pointer>{{ slotThree.record.studentCount }}</u-tag>
        </template>
        <template v-slot:actions="actions">
          <u-button type="link" @click="detail(actions.record.classCode)">详情</u-button>
        </template>
      </u-table>
      <div class="u-type-white-bg">
        <u-pagination v-model="pageList" :total="total" @change="showDetail"></u-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { columnsDetail } from '../../table-columns/KnowingStatis'
import ChooseGrade from '../../component/ChooseGrade'
import ChooseHighGrade from '../../component/ChooseHighGrade'
import ChooseDorm from '../../component/ChooseDorm'
export default {
  name: 'ClassDetail',
  components: {
    ChooseGrade,
    ChooseHighGrade,
    ChooseDorm
  },
  data() {
    return {
      form: this.$form.createForm(this),
      recordList: [],
      columnsDetail,
      activeTab: '',
      hasNomarl: true, //	进出寝状态
      tabList: [
        {
          key: 'MO-1',
          title: '出寝'
        },
        {
          key: 'MO-0',
          title: '未出寝'
        }
      ],
      total: 0,
      pageList: { page: 1, size: 20 },
      detailInfo: {}
    }
  },
  computed: {
    ...mapState('home', ['loginInfo', 'schoolYear', 'schoolCode'])
  },
  created() {
    this.planCode = this.$route.query.planCodes
    this.activeTab = this.$route.query.activeTab
    this.infoKey = this.$route.query.infoKey
    this.schoolType = this.loginInfo.schoolType === '8' || this.loginInfo.schoolType === '9'
    const { buildingName, className, wdate } = JSON.parse(this.$route.query.record)
    this.date = wdate
    this.detailInfo = {}
    if (this.planCode === 'MO') {
      this.detailInfo['类型'] = '早查寝'
    } else if (this.planCode === 'EI') {
      this.detailInfo['类型'] = '晚查寝'
      this.tabList = [
        {
          key: 'EI-1',
          title: '归寝'
        },
        {
          key: 'EI-0',
          title: '未归寝'
        }
      ]
    } else {
      this.detailInfo['类型'] = '午查寝'
      this.tabList = [
        {
          key: 'NI-1',
          title: '归寝'
        },
        {
          key: 'NI-0',
          title: '未归寝'
        },
        {
          key: 'NO-1',
          title: '出寝'
        },
        {
          key: 'NO-0',
          title: '未出寝'
        }
      ]
    }
    this.detailInfo[this.infoKey] = this.infoKey === '宿舍' ? buildingName : className
    this.detailInfo['统计日期'] = this.$tools.getDate(Number(wdate), 1)
  },
  async mounted() {
    await this.showDetail()
  },
  methods: {
    ...mapActions('home', ['statiDetail']),
    // 获取数据列表
    async showDetail() {
      const req = {
        date: this.date,
        hasNomarl: !!Number(this.activeTab.split('-')[1]), // MO早查寝出宿舍  true 出宿舍，false未出宿舍NI午查寝进宿舍    true 进宿舍，false未进宿舍 NO午查寝出宿舍 true 出宿舍，false未出宿舍 EI晚查寝进宿舍    true 进宿舍，false未进宿舍
        planCodes: [this.activeTab.split('-')[0]],
        schoolCode: this.schoolCode,
        buildingCode: this.buildingCode,
        floorCode: this.floorCode,
        gradeCode: this.gradeCode,
        roomCode: this.roomCode,
        classCode: this.classCode,
        specilaCode: this.specilaCode
      }
      const res = await this.statiDetail(req)
      this.recordList = res.data.records
      this.total = res.data.total
    },
    // 选择班级
    selectOrg(value) {
      value.forEach(el => {
        this[el.valueName] = el.value
      })
    },
    // 选择宿舍
    selectDrom(value) {
      value.forEach(el => {
        this[el.valueName] = el.value
      })
    },
    resetBtn() {
      this.buildingCode = ''
      this.classCode = ''
      this.floorCode = ''
      this.gradeCode = ''
      this.roomCode = ''
      if (this.schoolType) {
      this.$refs.chooseHighGrade.value = []
      } else {
      this.$refs.chooseGrade.value = []
      }
      this.$refs.chooseDorm.value = []
      this.showDetail()
    },
    changeHasNomarl(value) {
      this.showDetail()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
