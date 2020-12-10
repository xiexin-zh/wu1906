<template>
  <div class="accident-add page-layout bg-fff qui-fx-ver">
    <div class="content pos-box">
      <a-form :form="form">
        <a-form-item v-bind="formItemLayout" label="巡查点状态">
          <a-radio-group
            v-decorator="['patrolStatus', {initialValue: detailInfo.patrolStatus }]"
            disabled
          >
            <a-radio :value="item.id" v-for="(item, ind) in list" :key="ind">{{ item.val }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="值班员" >
          <div class="item">{{ detailInfo.watch }}</div>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="值班员电话" >
          <div class="item">{{ detailInfo.watchPhone }}</div>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="带班领导" >
          <div class="item">{{ detailInfo.leader }}</div>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="带班领导电话" >
          <div class="item">{{ detailInfo.leaderPhone }}</div>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="巡查点数量">
          <a-tag color="cyan" @click="look">{{ detailInfo.patrolPointNum }}</a-tag>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="值班轨迹">
          <div @click="check(detailInfo.track)" id="track" style="width:150px;height:150px;"></div>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="上传图片">
          <img :src="url" alt v-for="(url, index) in detailInfo.pictureList" :key="index" />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="问题描述">
          <div>{{ detailInfo.reportContent }}</div>
        </a-form-item>
      </a-form>
    </div>
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
      :visible="visible"
      :footer="null"
      centered
      @cancel="visible = false"
      width="750px"
      :destroyOnClose="true"
      title="巡查点详情"
    >
      <table-list :columns="duty.inspectColumns" :table-list="inspectList"></table-list>
    </a-modal>
  </div>
</template>

<script>
import TableList from '@c/TableList'
import { mapState, mapActions } from 'vuex'
import duty from '../../assets/js/table/dutyColumns'
export default {
  name: 'Detail',
  components: {
    TableList
  },
  data() {
    return {
      duty,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      detailId: '',
      detailInfo: {},
      visible: false,
      bodyStyle: {
        padding: 0
      },
      inspectList: [],
      mapVisible: false,
      // 腾讯地图
      map: null,
      getAddress: null,
      getAddCode: null,
      addressKeyword: '',
      list: [
        {
          id: '1',
          val: '正常'
        },
        {
          id: '0',
          val: '异常'
        }
      ]
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.detailId = this.$route.query.id
    this.showDetail(this.detailId)
  },
  methods: {
    ...mapActions('home', ['getDutyPoint', 'getDutyDetail']),
    check(data) {
      this.mapVisible = true
      setTimeout(() => {
        this.init(data, 'container')
      })
    },
    async look() {
      const res = await this.getDutyPoint(this.detailId)
      this.inspectList = res.data
      this.visible = true
    },
    init(data, id) {
      this.map = new qq.maps.Map(document.getElementById(id), {
        center: new qq.maps.LatLng(data[0].latitude, data[0].longitude),
        zoom: 16
      })
      const arr = data.map((item) => {
        return new qq.maps.LatLng(item.latitude, item.longitude)
      })
      var polyline = new qq.maps.Polyline({
        path: arr,
        strokeColor: '#3385ff',
        strokeWeight: 4,
        map: this.map
      })
    },
    async showDetail() {
      const res = await this.getDutyDetail(this.detailId)
      const data = res.data
      this.detailInfo = data
      if (data.track.length > 0) {
        this.init(data.track, 'track')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.accident-add {
  padding: 20px;
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
    img {
      width: 100px;
      height: 100px;
      margin-right: 20px;
    }
    .title {
      height: 40px;
      background-color: #f2f2f2;
    }
  }
}
.item {
  width: 100%;
  height: 38px;
  background-color: #eee;
  padding-left: 10px;
  color: #555;
}
</style>
