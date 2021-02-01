<template>
  <div class="school-year page-layout u-fx-ver">
    <div class="top u-fx u-mar-b20 u-border-radius u-type-white-bg">
      <div class="tip u-mar-r10 u-fx-ac">
        <a-icon class="u-mar-r10 u-type-primary u-font-1" type="info-circle" />
        <h3>请注意</h3>
      </div>
      <div>
        <p>1. 请及时添加需使用学年，学年创建后不可修改名称与起止日期，请谨慎添加！</p>
        <p>2. 在使用中学年后最多添加1个待启用学年，添加学年的起止日期必须首尾相连。</p>
        <p>3. 当前时刻在该学年的起止日期内才可切换为使用中，否则不可切换。</p>
        <p>4. 第一学期、第二学期的起止日期需在学年起止日期之内、且两者不可有交叉。</p>
      </div>
    </div>
    <u-space direction="vertical" class="layout-padd u-fx-je u-type-white-bg">
      <u-button icon="plus" @click="schoolYearAction(0)" type="primary">添加学年</u-button>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table :columns="columns" :table-list="schoolYearList">
        <template v-slot:slotOne="slotOne">
          <span
          >{{ slotOne.record.startTime | gmtToDate('date') }}~{{ slotOne.record.endTime | gmtToDate('date') }}</span
          >
        </template>
        <template v-slot:slotTwo="slotTwo">
          <span
          >{{ slotTwo.record.upStartTime | gmtToDate('date') }}~{{
            slotTwo.record.upEndTime | gmtToDate('date')
          }}</span
          >
        </template>
        <template v-slot:slotThree="slotThree">
          <span
          >{{ slotThree.record.downStartTime | gmtToDate('date') }}~{{
            slotThree.record.downEndTime | gmtToDate('date')
          }}</span
          >
        </template>
        <template v-slot:slotFour="slotFour">
          <a-switch
            :disabled="slotFour.record.enable"
            @click.native.stop
            @change="changeSchoolYear($event, slotFour.record)"
            v-model="slotFour.record.enable"
          />
        </template>
        <template v-slot:actions="actions">
          <u-button type="link" @click="schoolYearAction(1, actions.record)">编辑</u-button>
          <u-button type="link" delete @click="deleteSchoolYear(actions.record)">删除</u-button>
        </template>
      </u-table>
    </div>
    <add-year
      ref="addYear"
      v-model="formStatus"
      v-if="formStatus"
      :title="formTitle"
      :appForm="formData"
      @update="getSchoolYearList"
    ></add-year>
  </div>
</template>

<script>
import columns from '../../table-columns/schoolYear.js'
import AddYear from '../../component/AddYear.vue'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'SchoolYearManage',
  components: {
    AddYear
  },
  data() {
    return {
      columns,
      formTitle: '',
      formStatus: false,
      formData: {},
      schoolYearList: []
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this.getSchoolYearList()
  },
  methods: {
    ...mapActions('home', [
      'getSchoolYearListApi',
      'delSchoolYearApi',
      'enableSchoolYearApi'
    ]),
    // 获取学年列表
    async getSchoolYearList() {
      const req = {
        schoolCode: this.schoolCode
      }
      const res = await this.getSchoolYearListApi(req)
      this.schoolYearList = res.data
    },
    /**
     * 新增或添加学年
     */
    async schoolYearAction(type, record) {
      this.listId = type ? record.id : ''
      this.formTitle = type ? '编辑' : '添加'
      if (type) {
        for (const key in record) {
          if (typeof record[key] === 'number' && record[key].toString().length > 9) {
            record[key] = moment(new Date(record[key]), 'YYYY-MM-DD')
          }
        }
        this.formData = record
      } else {
        if (this.schoolYearList.length > 1 && this.schoolYearList[1].enable) {
          this.$message.warning(`只能添加一条待启用学年`)
          return
        }
        if (this.schoolYearList.length > 0) {
          const limit = this.schoolYearList[0].name.split('学年')[0].split('-')
          this.formData = {
            name: (parseInt(limit[0]) + 1) + '-' + (parseInt(limit[1]) + 1) + '学年',
            startTime: moment(new Date(this.schoolYearList[0].endTime + 24 * 3600 * 1000), 'YYYY-MM-DD'),
            upStartTime: moment(new Date(this.schoolYearList[0].endTime + 24 * 3600 * 1000), 'YYYY-MM-DD')
          }
        } else {
          this.formData = {}
        }
      }
      this.formStatus = true
    },
    // 删除学年
    async deleteSchoolYear(record) {
      await this.delSchoolYearApi({ id: record.id })
      this.$message.success(`删除成功`)
      this.$tools.goNext(this.getSchoolYearList)
    },
    // 切换使用中的学年
    async changeSchoolYear(value, item) {
      try {
        await this.enableSchoolYearApi({ id: item.id })
        this.$message.success(`切换成功`)
        this.$tools.goNext(this.getSchoolYearList)
      } catch (err) {
        this.getSchoolYearList()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.top {
    height: 120px;
    background: #fff url(../../assets/img/schoolyear_bg.png) no-repeat;
    background-size: 100% 120px;
    padding: 15px 0 20px 50px;
    .tip,
    .tip h3 {
      height: 21px;
      line-height: 25px;
    }
    p{
      margin-bottom: 0.5em;
      letter-spacing: 1.5px;
    }
  }</style>
