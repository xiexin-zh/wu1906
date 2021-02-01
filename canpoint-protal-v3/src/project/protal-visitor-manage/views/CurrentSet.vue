<template>
  <div class="visitor-record page-layout u-fx-ver u-type-white-bg">
    <u-choose-device
      url="/protal_v3_10162/setting/device/info/query"
      is-check
      ref="chooseDeviceRef"
      v-if="showTag"
      v-model="showTag"
      :bind-list="bindList"
      schoolCode="CANPOINTLIVE"
      @submit="submitDevice"
    ></u-choose-device>
    <div class="layout-padd">
      <u-search-form :search-label="currentSearch" @search="search">
        <div slot="left">
          <u-button type="primary" icon="plus" @click="bindDevice">绑定设备</u-button>
        </div>
      </u-search-form>
    </div>
    <u-table :columns="currentTable" :table-list="currentList">
      <template v-slot:slotOne="slotOne">
        <u-type>{{ getDataState('deviceType', slotOne.record.deviceType) }}</u-type>
      </template>
      <template v-slot:slotTwo="slotTwo">
        <u-type>{{ getDataState('inOrOut', slotTwo.record.inOrOut) }}</u-type>
      </template>
      <template v-slot:slotThree="slotThree">
        <u-type>{{ slotThree.record.controlType === 1 ? '是' : '否' }}</u-type>
      </template>
      <template v-slot:actions="actions">
        <u-button type="link" delete @click="_delCurrentDevice(actions.record.id)">删除</u-button>
      </template>
    </u-table>
  </div>
</template>

<script>
import { getDataState } from '@u/libs/data-state'
import { mapState, mapActions } from 'vuex'
import currentTable from '../table-columns/current'
import currentSearch from '../search-columns/current'
export default {
  name: 'CurrentSet',
  data() {
    return {
      getDataState,
      currentTable,
      currentSearch,
      currentList: [],
      showTag: false,
      bindList: []
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this._getCurrentList()
  },
  methods: {
    ...mapActions('home', ['getCurrentList', 'bindCurrentDevice', 'delCurrentDevice']),
    /**
     * 通行设备
     */
    async _getCurrentList(searchObj = {}) {
      const res = await this.getCurrentList({
        pageNum: 1,
        pageSize: 100,
        schoolCode: this.schoolCode,
        ...searchObj
      })
      this.currentList = res.data.list
    },
    /**
     * 搜索
     */
    search(values) {
      this._getCurrentList(values)
    },
    /**
     * 绑定设备
     */
    bindDevice() {
      this.bindList = this.currentList
      this.showTag = true
    },
    async submitDevice(values) {
      const result = values.map(item => {
        return {
          controlType: item.controlType,
          deviceIp: item.deviceIp,
          deviceName: item.deviceName,
          deviceSn: item.deviceSn,
          deviceStatus: item.deviceStatus,
          deviceType: item.deviceType,
          inOrOut: item.inOrOut,
          schoolCode: this.schoolCode,
          snapSite: item.snapSite
        }
      })
      try {
        await this.bindCurrentDevice(result)
        this.$tools.message('success', '绑定成功')
        this.$refs.chooseDeviceRef.reset()
        this.$tools.goNext(this._getCurrentList)
      } catch (err) {
        this.$refs.chooseDeviceRef.error()
      }
    },
    /**
     * 删除设备
     * @param { number } id 设备id
     */
    async _delCurrentDevice(id) {
      await this.delCurrentDevice([id])
      this.$tools.message('success', '删除成功')
      this.$tools.goNext(this._getCurrentList)
    }
  }
}
</script>
<style lang="less" scoped></style>
