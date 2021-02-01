<template>
  <div class="knowing-statis page-layout u-fx">
    <div class="left-tree u-type-white-bg">
      <dorm-class-tree :maxHeight="maxHeight" @changeTab="changeTab" @select="select" class=""></dorm-class-tree>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd u-bg-fff ">
        <u-search-form ref="searchForm" :search-label="searchLabel" @search="search">
          <div slot="left">
            类型：
            <u-space>
              <u-radio
                v-model="type"
                button-style="solid"
                :item-list="itemList"
                @change="changeType"
              ></u-radio>
            </u-space>
          </div>
          <div slot="right" class="u-mar-l10">
            <u-download :reqObj="reqObj" title="导出" fileName="学生" type="light"></u-download>
          </div>
        </u-search-form>
      </u-space>
      <div class="u-fx u-fx-f1 ">
        <u-table
          :width="40"
          :height="40"
          is-zoom
          :page-list="pageList"
          :columns="personColumns"
          :table-list="userList"
        >
          <template v-slot:slotFour="slotFour">
            <u-tag type="primary">{{ slotFour.record.total }}</u-tag>
          </template>
          <template v-slot:slotOne="slotOne">
            <u-tag type="primary-bd" pointer @change="detail('MO-1',slotOne.record)">{{ slotOne.record.outNum }}</u-tag>
          </template>
          <template v-slot:slotTwo="slotTwo">
            <u-tag type="warning-bd" pointer @change="detail('MO-0',slotTwo.record)">{{ slotTwo.record.unOutNum }}</u-tag>
          </template>
        </u-table>
      </div>
      <div class="u-type-white-bg">
        <u-pagination
          justify="end"
          v-model="pageList"
          :total="total"
          @change="getList"
        ></u-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { personColumns } from '../../table-columns/KnowingStatis'
import LineRbga from '@/components/echarts/line/LineRbga'
import DormClassTree from '../../component/DormClassTree'
const searchLabel = [
  {
    value: 'userName', // 表单属性
    type: 'input', // 表单类型
    label: '姓名', // 表单label值
    placeholder: '请输入姓名' // 表单默认值(非必选字段)
  },
  {
    value: 'workNo', // 表单属性
    type: 'input', // 表单类型
    label: '学号', // 表单label值
    placeholder: '请输入工号' // 表单默认值(非必选字段)
  },
  {
    value: 'rangeTime', // 日期区间
    type: 'rangeTime',
    label: '日期'
  }
]
export default {
  name: 'KnowingStatis',
  components: {
    DormClassTree,
    LineRbga
  },
  data() {
    return {
      searchLabel,
      currentActiveTab: '0',
      maxHeight: document.body.clientHeight - 180,
      type: 'MO',
      itemList: [
        {
          label: '早查寝',
          value: 'MO'
        },
        {
          label: '午查寝',
          value: 'NI,NO',
          disables: true
        },
        {
          label: '晚查寝',
          value: 'EI'
        }
      ],
      searchObj: {
        buildingCode: '', // 楼栋编码
        classCode: '', // 班级编码
        floorCode: '', // 楼层编码
        gradeCode: '', //	年级编码
        planCodes: ['MO'], // 计划编码 MO早查寝出宿舍 NI午查寝进宿舍 NO午查寝出宿舍 EI晚查寝进宿舍
        roomCode: '', //	房间编码
        specilaCode: '', // 专业编码
        schoolCode: '',
        startDate: this.$tools.getDate(new Date() - (86400000 * 31), 1),
        endDate: this.$tools.getDate(new Date(), 1)
      },
      reqObj: {
        url: '/protal_v3_11102/canpointCheckStatic/person/list/export',
        method: 'post'
      },
      lineChart: [], // 统计图
      userList: [],
      personColumns,
      pageList: { page: 1, size: 20 },
      total: 0
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'loginInfo', 'schoolYear'])
  },
  created() {
    // this.$tools(new Date(), 1)
    this.searchObj.schoolCode = this.schoolCode
  },
  mounted() {
    this.$refs.searchForm.form.setFieldsValue({ 'rangeTime': [this.$tools.getDate(new Date() - (86400000 * 31), 1), this.$tools.getDate(new Date(), 1)] })
  },
  methods: {
    ...mapActions('home', [ 'personList' ]),
    // 切换早，午，晚查寝
    changeType(value) {
      this.type = value.target.value
      this.searchObj.planCodes = this.type.split(',')
      this.reqObj.params = Object.assign(this.searchObj, this.pageList)
      this.getList()
    },
    // 切换宿舍，班级树
    changeTab(value) {
      this.currentActiveTab = value
    },
    // 切换宿舍，班级树菜单
    select(obj) {
      this.searchObj = Object.assign(this.searchObj, obj.data)
      this.reqObj.params = Object.assign(this.searchObj, this.pageList)
      this.getList()
    },
    async getList() {
      const req = {
        ...this.searchObj,
        ...this.pageList
      }
      const res = await this.personList(req)
      this.userList = res.data.records
      this.total = res.data.total
    },
    search(values) {
      console.log(values)
      this.searchObj.startDate = values.rangeTime && values.rangeTime[0]
      this.searchObj.endDate = values.rangeTime && values.rangeTime[1]
      this.searchObj = Object.assign(this.searchObj, values)
      this.reqObj.params = Object.assign(this.searchObj, this.pageList, values)
      this.getList()
    },
    // 详情
    detail(type, record) {
      this.$router.push({
        path: '/personStatis/personStatisDetail',
        query: {
          activeTab: type,
          record: JSON.stringify(record),
          planCodes: this.type,
          endDate: this.searchObj.endDate,
          startDate: this.searchObj.startDate
          }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.knowing-statis{
  //  @{deep} .ant-radio-button-wrapper:nth-of-type(1){
  //   border-radius: 4px 0px 0px 4px;
  // }
  //  @{deep} .ant-radio-button-wrapper:nth-of-type(3){
  //   border-radius: 0px 4px 4px 0px;
  // }
}
</style>
