<template>
  <div class="page-layout u-fx u-type-white-bg">
    <div class="left-tree">
      <dorm-class-tree @changeTab="changeTab" @select="select"></dorm-class-tree>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd">
        <u-search-form :search-label="dormRecordSearchLabel" @search="search">
          <div slot="right" class="u-mar-l10">
            <u-download
              :reqObj="reqObj"
              title="导出"
              type="light"
              hasIcon
              fileName="住宿档案表"
              fileType="xls"
            ></u-download>
          </div>
        </u-search-form>
        <u-space class="u-fx-ac u-choose-item">
          已选择 {{ chooseList.length }} 项数据
          <u-button @click="batchDel" :disabled="chooseList.length === 0" type="danger" delete content="确定将选中人员批量退宿吗？">批量退宿</u-button>
        </u-space>
      </u-space>
      <div class="u-fx u-fx-f1">
        <u-table is-check v-model="chooseList" :page-list="pageList" :columns="dormRecordColumns" :table-list="recordList">
          <template
            v-slot:slotOne="slotOne"
          >{{ slotOne.record.gradeName }}{{ slotOne.record.specialName }}{{ slotOne.record.className }}</template>
        </u-table>
      </div>
      <u-pagination justify="end" v-model="pageList" :total="total" @change="getRecordList"></u-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { dormRecordSearchLabel, dormRecordColumns } from '../../table-columns/dormRecord'
import DormClassTree from '../../component/DormClassTree'
export default {
  name: 'DormRecord',
  components: {
    DormClassTree
  },
  data() {
    return {
      dormRecordSearchLabel,
      dormRecordColumns,
      reqObj: {
        url: '/protal_v3_11102/canpointDormArchives/export',
        method: 'post',
        params: {}
      },
      recordList: [],
      pageList: { page: 1, size: 20 },
      total: 0,
      chooseList: []
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'schoolYear'])
  },
  mounted() {},
  methods: {
    ...mapActions('home', ['queryUserArchives', 'batchLeaveDormByUserCode']),
    // 切换宿舍，班级 0宿舍，1班级
    changeTab(value) {
      this.isDorm = value === 0
      this.getRecordList()
    },
    // 切换宿舍，班级树菜单
    select(obj) {
      if (obj.type === '班级') {
        this.isDorm = false
        this.selectClassObj = {
          gradeCode: obj.data.gradeCode,
          classCode: obj.data.classCode,
          schoolYearCode: obj.data.schoolYearCode
        }
      } else {
        this.isDorm = true
        this.selectDormObj = {
          buildingCode: obj.data.buildCode,
          floorCode: obj.data.floorCode,
          roomCode: obj.data.roomCode
        }
      }
      this.getRecordList()
    },
    // 宿舍档案列表查询
    async getRecordList() {
      this.reqObj.params = {
        schoolCode: this.schoolCode,
        schoolYearCode: this.schoolYear.code,
        keyword: this.keyword,
        ...this.pageList
      }
      if (this.isDorm) {
        this.reqObj.params = Object.assign(this.reqObj.params, this.selectDormObj)
      } else {
        this.reqObj.params = Object.assign(this.reqObj.params, this.selectClassObj)
      }
      const res = await this.queryUserArchives(this.reqObj.params)
      this.recordList = res.data.records.map(ele => {
        return {
          ...ele,
          id: ele.userCode
        }
      })
      this.total = res.data.total
    },
    search(values) {
      this.keyword = values.keyword
      this.getRecordList()
    },
    // 批量退宿操作
    async batchDel() {
      await this.batchLeaveDormByUserCode({
          schoolCode: this.schoolCode,
          userCodeList: this.chooseList
        })
        this.$tools.message('success', '批量退宿成功')
        this.$tools.goNext(() => {
          this.getRecordList()
        })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
