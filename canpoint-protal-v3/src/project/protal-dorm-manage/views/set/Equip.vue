<template>
  <div class="teacher page-layout u-fx u-type-white-bg">
    <u-choose-device
      is-check
      ref="chooseDeviceRef"
      v-if="showTag"
      v-model="showTag"
      schoolCode="CANPOINTLIVE"
      :bindList="bindList"
      @submit="submitDevice"
    ></u-choose-device>
    <div class="left-tree layout-padd-t">
      <u-place-tree :school="schoolCode" @select="select" is-choose></u-place-tree>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd">
        <u-search-form :search-label="searchLabel" @search="search" ref="searchForm">
          <div slot="left">
            <u-space>
              <u-button icon="plus" @click="_getAllDevice" type="primary">添加设备</u-button>
            </u-space>
          </div>
          <div slot="right"></div>
        </u-search-form>
      </u-space>
      <div class="u-fx u-fx-f1">
        <u-table :page-list="pageList" :columns="columns" :table-list="equipList">
          <template v-slot:slotOne="slotOne">
            <u-type type="deviceType">{{ getDataState('deviceType', slotOne.record.deviceType) }}</u-type>
          </template>
          <template v-slot:slotTwo="slotTwo">
            <u-type>{{ getDataState('inOrOut', slotTwo.record.inOrOut) }}</u-type>
          </template>
          <template v-slot:actions="actions">
            <u-button type="link" delete @click="_delDormEquip(actions.record.id)">删除</u-button>
          </template>
        </u-table>
      </div>
      <u-pagination v-model="pageList" :total="total" @change="_getDormEquip"></u-pagination>
    </div>
  </div>
</template>

<script>
import { getDataState } from '@u/libs/data-state'
import { mapState, mapActions } from 'vuex'
import columns from '../../table-columns/equip'
import searchLabel from '../../search-columns/equip'
export default {
  name: 'Equip',
  components: {},
  data() {
    return {
      getDataState,
      searchLabel,
      columns,
      pageList: { page: 1, size: 20 },
      total: 0,
      bindList: [],
      showTag: false,
      equipList: [],
      searchList: {}
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'schoolYear'])
  },
  methods: {
    ...mapActions('home', ['getDormEquip', 'updateDormEquip', 'delDormEquip']),
    async _getDormEquip() {
      this.searchList.schoolCode = this.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getDormEquip(this.searchList)
      this.equipList = res.data.records
      this.total = res.data.total
    },
    select(value) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.buildingCode = value.parentId ? value.parentId : value.currentCode
      this.floorCode = value.parentId ? value.currentCode : ''
      this.searchList.buildingCode = this.buildingCode
      this.searchList.floorCode = this.floorCode
      console.log(value)
      this._getDormEquip()
    },
    search(value) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList = Object.assign(this.searchList, value)
      this._getDormEquip()
    },
    /**
     * 查询已绑定的所有设置
     */
    async _getAllDevice() {
      const res = await this.getDormEquip({
        schoolCode: this.schoolCode
      })
      this.bindList = res.data.records.map(item => {
        return {
          deviceSn: item.deviceSn,
          deviceName: item.deviceName
        }
      })
      this.showTag = true
    },
    /**
     * 绑定设备
     */
    async submitDevice(values) {
      try {
        const req = {
          buildingCode: this.buildingCode,
          schoolCode: this.schoolCode,
          floorCode: this.floorCode,
          deviceManageDtoList: values.map(item => {
            return {
              address: item.snapSite,
              deviceName: item.deviceName,
              deviceSn: item.deviceSn,
              deviceType: item.deviceType,
              inOrOut: item.inOrOut
            }
          })
        }
        await this.updateDormEquip(req)
        this.$tools.message('success', '绑定成功')
        this.$refs.chooseDeviceRef.reset()
        this.$tools.goNext(this._getDormEquip)
      } catch (err) {
        this.$refs.chooseDeviceRef.error()
      }
    },
    /**
     * 删除设备
     */
    async _delDormEquip(id) {
      await this.delDormEquip({ id: id })
      this.$tools.message('succses', '删除成功')
      this.$tools.goNext(this._getDormEquip)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
