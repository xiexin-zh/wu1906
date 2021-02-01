<template>
  <div class="knowing-statis page-layout u-fx">
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd u-bg-fff ">
        <u-search-form ref="searchForm" :search-label="otherSearchLabel" @search="search">
          <div slot="left">
            <u-space>
              <u-button icon="plus" type="primary" @click="addApp">上报</u-button>
              <u-download :reqObj="reqObj" title="导出" fileName="教职工" type="light"></u-download>
            </u-space>
          </div>
        </u-search-form>
      </u-space>
      <div class="u-fx u-fx-f1 ">
        <u-table
          is-zoom
          :page-list="pageList"
          :columns="otherColums"
          :table-list="userList"
        >
          <template v-slot:slotOne="slotOne">
            <u-type type="sex">{{ getDataState('sex',slotOne.record.sex) }}</u-type>
          </template>
          <template v-slot:slotTwo="slotTwo">
            <div v-if="slotTwo.record.enableFever === false">{{ slotTwo.record.enableFever ? '发热' : '未发热' }}</div>
            <a-tag color="#e80000" v-else>{{ slotTwo.record.enableFever ? '发热' : '未发热' }}</a-tag>
          </template>
          <template v-slot:actions="actions">
            <u-button type="link" @click="goDetial(actions.record)">详情</u-button>
          </template>
        </u-table>
      </div>
      <div class="u-type-white-bg">
        <u-pagination
          justify="end"
          v-model="pageList"
          :total="total"
          @change="showList"
        ></u-pagination>
      </div>
    </div>
    <u-submit-form
      ref="form"
      @submit="submitForm"
      :title="title"
      v-model="formStatus"
      v-if="formStatus"
      :formData="otherformData"
    ></u-submit-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getDataState } from '@u/libs/data-state'
import { otherColums } from '../../table-columns/outInRecord'
import { otherSearchLabel } from '../../search-columns/ncovDaily'
import { otherformData } from '../../submit-columns/submitColumns'
export default {
  name: 'OtherReport',
  components: {
  },
  data() {
    return {
      formStatus: false,
      otherformData,
      otherSearchLabel,
      date: this.$tools.getDate(new Date(), 1),
      getDataState,
      maxHeight: document.body.clientHeight - 180,
      searchObj: {
        userType: '64', //	用户类型（4：教职工 ，8：学生，64:陌生人）
        schoolCode: 'CANPOINTLIVE',
        orgCode: ''
      },
      reqObj: {
        url: '/protal_v3_11005/day/record/download',
        method: 'post'
      },
      userList: [],
      otherColums,
      pageList: { page: 1, size: 20 },
      total: 0,
      title: ''
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'userInfo', 'loginInfo', 'schoolYear'])
  },
  created() {
    this.searchObj.schoolCode = this.schoolCode
    this.searchObj.schoolCode = 'CANPOINTLIVE'
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getReportInfoList', 'addReport']),
    // 获取列表
    async showList() {
      const req = {
        ...this.searchObj,
        ...this.pageList
      }
      const res = await this.getReportInfoList(req)
      this.userList = res.data.list.map((el, index) => {
        return {
          ...el,
          id: index
        }
      })
      this.total = res.data.total
    },
    search(values) {
      this.searchObj.startDate = values.rangeTime[0]
      this.searchObj.endDate = values.rangeTime[1]
      this.searchObj = Object.assign(this.searchObj, values)
      this.reqObj.params = Object.assign(this.searchObj, this.pageList)
      this.showList()
    },
    addApp(type, record) {
      this.formStatus = true
      this.title = '上报疫情'
      this.otherformData = otherformData
    },
    // 提交疫情
    async submitForm(values) {
      const req = {
        ...values,
        schoolCode: this.schoolCode,
        reportName: this.userInfo.userName,
        userType: '64'
      }
      try {
        await this.addReport(req)
        this.$message.success('操作成功')
        this.$tools.goNext(this.showList)
        this.$refs.form.reset()
      } catch (err) {
        this.$refs.form.error()
      }
    }
  }

}
</script>
<style lang="less" scoped>
</style>
