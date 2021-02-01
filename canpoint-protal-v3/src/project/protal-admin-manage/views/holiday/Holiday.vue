<template>
  <div class="holiday page-layout u-fx-ver u-type-white-bg">
    <u-submit-form
      ref="form"
      :width="600"
      @submit="submitForm"
      title="编辑放假时间"
      v-model="formStatus"
      :form-data="submitColumn"
    ></u-submit-form>
    <div class="layout-padd">
      <u-alert message :description="info" :showIcon="true"></u-alert>
    </div>
    <div class="u-fx u-fx-f1">
      <u-table :columns="columns" :table-list="dayList">
        <template v-slot:slotOne="slotOne">
          {{ $tools.getDate(slotOne.record.startDate, 1) }} 至 {{ $tools.getDate(slotOne.record.endDate, 1) }}
          <a-icon type="edit" class="u-mar-l u-pointer" @click="_editHoliday(slotOne.record)" />
        </template>
        <template v-slot:slotTwo="slotTwo">
          <u-tag type="primary">{{ getDay(slotTwo.record) }} 天</u-tag>
        </template>
      </u-table>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import columns from '../../table-columns/holiday'
const submitColumn = [
  {
    value: 'holidayDay',
    type: 'rangeTime',
    label: '放假时间',
    initValue: '',
    placeholder: '请选择放假时间'
  }
]
const info =
  '预置7个节日名称，设置节假日日期以后，业务系统的法定节假日从运营端节假日管理获取，如果运营端进行修改，不影响已生效的节假日，业务系统同步更新节假日日期。'
export default {
  name: 'Holiday',
  components: {},
  data() {
    return {
      submitColumn,
      formStatus: false,
      dayList: [],
      columns,
      info
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    ...mapActions('home', ['getHolidayList', 'modifyHoliday', 'isHoliday']),
    async getList() {
      const res = await this.getHolidayList()
      this.dayList = res.data
    },
    getDay(item) {
      const day = (item.endDate - item.startDate) / (1000 * 60 * 60 * 24)
      return day + 1
    },
    _editHoliday(item) {
      this.formStatus = true
      this.id = item.id
      var params = {
        startTime: this.$tools.getDate(item.startDate, 1),
        endTime: this.$tools.getDate(item.endDate, 1)
      }
      this.submitColumn = this.$tools.fillForm(submitColumn, params)
    },
    async submitForm(values) {
      try {
        await this.modifyHoliday({
          id: this.id,
          startDate: values.holidayDay[0],
          endDate: values.holidayDay[1]
        })
        this.$tools.message('success', '修改成功')
        this.$tools.goNext(this.getList)
        this.$refs.form.reset()
      } catch (err) {
        this.$refs.form.error()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.time-range {
  display: flex;
  .show-date {
    display: flex;
    align-items: center;
    flex: 1;
  }
  .opt-btns {
    display: flex;
    align-items: center;
    width: 40%;
    font-size: 14px;
  }
}
</style>
