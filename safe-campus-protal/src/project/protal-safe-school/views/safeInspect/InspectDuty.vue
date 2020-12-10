<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="duty.searchLabel">
      <div slot="left">
        <a-button icon="delete" class="del-btn mar-l10" @click="dels">批量删除</a-button>
      </div>
    </search-form>
    <table-list
      is-check
      :page-list="pageList"
      :columns="duty.columns"
      :table-list="dutyList"
      v-model="chooseList"
    >
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="查看">
          <a-button
            size="small"
            class="detail-action-btn"
            icon="ellipsis"
            @click="goDetail(action.record)"
          ></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(action)">
          <template slot="title">确定删除该巡查值班吗?</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
      <template v-slot:other1="other1">
        <a-icon type="environment" style="font-size: 32px; color: #87d068" @click.stop="mapClick(other1)"/>
        <!-- <div id="other" style="width:120px;height:120px;" @click.stop="mapClick(other1)"></div> -->
      </template>
      <template v-slot:other2="other2">
        <a-tag color="cyan" @click.stop="pointClick(other2.record)">{{ other2.record.patrolPointNum }}</a-tag>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <a-modal
      title="值班轨迹"
      :visible="mapVisible"
      :footer="null"
      centered
      @cancel="mapVisible = false"
      width="1200px"
      :destroyOnClose="true"
    >
      <div>
        <div id="container" style="width:1160px;height:600px;"></div>
      </div>
    </a-modal>
    <a-modal
      :visible="pointVisible"
      :footer="null"
      centered
      @cancel="pointVisible = false"
      width="660px"
      :destroyOnClose="true"
      title="巡查点详情"
    >
      <table-list :columns="duty.inspectColumns" :table-list="inspectList"></table-list>
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import duty from '../../assets/js/table/dutyColumns'
export default {
  name: 'InspectDuty',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  data() {
    return {
      duty,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      dutyList: [],
      chooseList: [],
      pointVisible: false,
      bodyStyle: {
        padding: 0
      },
      inspectList: [],
      map: null,
      mapVisible: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getDuty', 'getDutyPoint', 'delDutyPoint', 'delsDutyPoint']),
    async showList() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getDuty(this.searchList)
      this.dutyList = res.data.records
      this.total = res.data.total
      // if (res.data.records.length > 0) {
      //   res.data.records.forEach((el, index) => {
      //     if (el.track.length > 0) {
      //       setTimeout(() => {
      //         el.map = new qq.maps.Map(document.getElementById('other'), {
      //           center: new qq.maps.LatLng(el.track[0].latitude, el.track[0].longitude),
      //           zoom: 16
      //         })
      //         const arr = el.track.map((item) => {
      //           return new qq.maps.LatLng(item.latitude, item.longitude)
      //         })
      //         const polyline = new qq.maps.Polyline({
      //           path: arr,
      //           strokeColor: '#3385ff',
      //           strokeWeight: 1,
      //           map: el.map
      //         })
      //         console.log(polyline)
      //       })
      //     }
      //   })
      // }
    },
    mapClick(record) {
      this.mapVisible = true
      setTimeout(() => {
        this.map = new qq.maps.Map(document.getElementById('container'), {
          center: new qq.maps.LatLng(record.record.track[0].latitude, record.record.track[0].longitude),
          zoom: 16
        })
        const arr = record.record.track.map((item) => {
          return new qq.maps.LatLng(item.latitude, item.longitude)
        })
        const polyline = new qq.maps.Polyline({
          path: arr,
          strokeColor: '#3385ff',
          strokeWeight: 4,
          map: this.map,
          isTrusted: true
        })
        console.log(polyline)
      })
    },
    searchForm(values) {
      this.searchList.reportTimeFrom = values.time[0] ? `${values.time[0]} 00:00:00` : ''
      this.searchList.reportTimeTo = values.time[1] ? `${values.time[1]} 23:59:59` : ''
      this.searchList = Object.assign(this.searchList, values)
      this.pageList.page = 1
      this.pageList.size = 20
      this.showList()
    },
    async pointClick(record) {
      const res = await this.getDutyPoint(record.id)
      this.inspectList = res.data
      this.pointVisible = true
    },
    goDetail(record) {
      this.$router.push({
        path: '/inspectDuty/detail',
        query: {
          id: record.id
        }
      })
    },
    del(record) {
      this.delDutyPoint(record.record.id).then((res) => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.showList()
          this.chooseList = []
        })
      })
    },
    dels() {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要删除的巡查值班')
        return false
      }
      this.$tools.delTip('确定删除选中的巡查值班吗？', () => {
        this.delsDutyPoint(this.chooseList).then((res) => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.chooseList = []
            this.showList()
          })
        })
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
