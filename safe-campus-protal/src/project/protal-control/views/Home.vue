<template>
  <div class="home page-layout qui-fx-ver" style="padding: 0 10px">
    <a-tabs v-if="false" defaultActiveKey="1" @change="callback">
      <a-tab-pane tab="全部" key="1"></a-tab-pane>
      <a-tab-pane tab="教学楼1栋" key="2"></a-tab-pane>
      <a-tab-pane tab="教学楼2栋" key="3"></a-tab-pane>
      <a-tab-pane tab="宿舍" key="4"></a-tab-pane>
      <a-select slot="tabBarExtraContent" defaultValue="1" style="width: 120px">
        <a-select-option value="1">1楼</a-select-option>
        <a-select-option value="2">2楼</a-select-option>
        <a-select-option value="3">3楼</a-select-option>
        <a-select-option value="4">4楼</a-select-option>
      </a-select>
    </a-tabs>
    <div v-if="false">
      <a-row>
        <a-col :span="6">
          <div class="box-area on qui-fx-ver qui-fx-jsb">
            <div class="qui-fx-jsb qui-fx-ac">
              <span class="out-text">32</span>
              <span class="out-bg">离线</span>
            </div>
            <div>识别服务</div>
          </div>
        </a-col>
        <a-col :span="6">
          <div class="box-area on mar-l10 qui-fx-ver qui-fx-jsb">
            <div class="qui-fx-jsb qui-fx-ac">
              <span class="out-text">32</span>
              <span class="out-bg">离线</span>
            </div>
            <div>面板机</div>
          </div>
        </a-col>
        <a-col :span="6">
          <div class="box-area out mar-l10 qui-fx-ver qui-fx-jsb">
            <div class="qui-fx-jsb qui-fx-ac">
              <span class="out-text on-text">32</span>
              <span class="out-bg on-bg on-text">在线</span>
            </div>
            <div>识别服务</div>
          </div>
        </a-col>
        <a-col :span="6">
          <div class="box-area out mar-l10 qui-fx-ver qui-fx-jsb">
            <div class="qui-fx-jsb qui-fx-ac">
              <span class="out-text  on-text">32</span>
              <span class="out-bg on-bg on-text">在线</span>
            </div>
            <div>面板机</div>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="tip-info">实时告警</div>
    <div>
      <table-list
        :page-list="pageList"
        :columns="columns"
        :table-list="dataList">
      </table-list>
    </div>
  </div>
</template>

<script>
import Tools from '@u/tools'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '告警信息',
    dataIndex: 'warnName',
    width: '60%'
  },
  {
    title: '告警时间',
    dataIndex: 'recordTime',
    width: '15%',
    customRender: (text) => {
      return Tools.getDate(text)
    }
  },
  {
    title: 'IP地址',
    dataIndex: 'ipAddress',
    width: '15%'
  }
]
export default {
  name: 'Home',
  components: {
    TableList
  },
  data () {
    return {
      dataList: [],
      columns,
      pageList: {
        page: 1,
        size: 20
      }
    }
  },
  computed: {
    ...mapState('home', [
      'schoolCode'
    ])
  },
  async mounted () {
    const res = await this.getWarnList({
      schoolCode: this.schoolCode,
      page: 1,
      size: 20
    })
    this.dataList = res.data.list
  },
  methods: {
    ...mapActions('home', [
      'getWarnList'
    ]),
    callback () {}
  }
}
</script>
<style lang="less" scoped>
  .box-area {
    height: 250px;
    margin-bottom: 15px;
    padding: 30px;
    font-size: 18px;
    background-color:#f5f5f5;
    border-radius: @radius;
    .out-text {
      font-size: 50px;
      color: #999;
      font-weight: bold
    }
    .on-text {
      color: @main-color
    }
    .out-bg {
      position: relative;
    }
    .out-bg::before {
      position: absolute;
      content: '';
      width: 15px;
      height: 15px;
      left: -20px;
      top: 6px;
      color: #999;
      background-color: #999;
      border-radius: 100%;
    }
    .on-bg::before {
      background-color: @main-color
    }
    &.on {
      background:#f5f5f5 url('../assets/img/onLine.png') right bottom no-repeat;
    }
    &.out {
      background:#f5f5f5 url('../assets/img/outLine.png') right bottom no-repeat;
    }

  }
  .tip-info {
    margin-top: 15px;
    margin-bottom: 15px;
    font-weight: bold;
    height: 16px;
    line-height: 16px;
    padding-left: 10px;
    border-left: 3px @main-color solid
  }
</style>
