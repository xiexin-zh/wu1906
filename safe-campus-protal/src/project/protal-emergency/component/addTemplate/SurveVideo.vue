<template>
  <div class="lessonPlan qui-fx-ver">
    <!-- <div class="content pos-box bg-fff"> -->
    <div class="u-padd-10 u-padd-l20 u-padd-t40">
      <a-row type="flex" justify="center">
        <a-col :span="18" class="u-tx-c">
          <a-button icon="plus" class="add-action-btn u-mar-b20" type="primary" @click="add">添加监控视频</a-button>
          <div>请在【控制中心】内添加备选监控摄像头</div>
        </a-col>
      </a-row>
      <table-list
        class="u-mar-t20"
        :columns="columns"
        :table-list="radioList">
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete" @click="del(action.record)"></a-button>
          </a-tooltip>
        </template>
      </table-list>
      <div class="u-tx-c u-mar-t20">
        <a-button type="primary" @click="previous">上一步</a-button>
        <a-button class="mar-l10" type="primary" @click="nextStep">下一步</a-button>
        <a-button class="mar-l10" @click="carryOut" >完成</a-button>
      </div>
    </div>
    <add-video v-model="addTag"></add-video>
    <!-- </div> -->
  </div>
</template>

<script>
import TableList from '@c/TableList'
import AddVideo from './AddVideo'
import { mapState, mapActions } from 'vuex'
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '10%'
  },
  {
    title: '设备SN码',
    dataIndex: 'deviceSn',
    width: '30%'
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '30%'
  },
  {
    title: '操作',
    width: '30%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'SurveVideo',
  components: {
    TableList,
    AddVideo
  },
  data() {
    return {
      columns,
      isLoad: false,
      cardInfo: {
        taskType: '1'
      },
      radioList: [],
      addTag: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  watch: {
  },
  async created() {
    this.id = this.$route.query.id
    if (this.id) {
      this.showDetail()
    }
  },
  methods: {
    ...mapActions('home', [
      'getTemplateVideo',
      'addTemplateVideo'
    ]),
    // 添加教案
    add() {
      if (this.radioList.length === 4) {
        this.$message.warning('一个预案最多只能绑定4个摄像头')
        return
      }
      this.addTag = true
    },
    // 获取详情
    async showDetail() {
      const res = await this.getTemplateVideo({ emergencyId: this.id })
      console.log('res.data.list',res.data)
      if (res.data.length === 0) return // 为空数组的时候不赋值
      this.radioList = res.data.map(el => {
        return {
          ...el,
          deviceName: el.name,
          deviceSn: el.deviceId
        }
      })
    },
    // 子组件选择的资源
    sonSelected(record) {
      if (this.radioList.length === 0) {
        this.radioList = this.radioList.concat(record)
      } else {
        const chenckedArr = record.filter(v => this.radioList.findIndex(i => i.code === v.code) === -1) // 去重
        this.radioList = this.radioList.concat(chenckedArr)
      }
    },
    // 删除
    del(record) {
      this.radioList = this.radioList.filter(v => v.code !== record.code) // 去重
    },
    previous() {
      this.$parent.isActive('2')
    },
    // 完成
    carryOut() {
      this.submitOk().then(el => {
        this.$router.push('/safeClassLocal')
      })
    },
    // 下一步
    nextStep() {
      this.submitOk().then(el => {
        this.$parent.isActive('4')
      })
    },
    // 提交
    submitOk(e) {
      return new Promise((resolve, reject) => {
        const req = {
          devices: this.radioList.map(el => {
            return {
              deviceId: el.deviceSn,
              id: el.id,
              name: el.deviceName,
              streamUrl: el.rtspUrl
            }
          }),
          emergencyId: this.id,
          schoolCode: this.userInfo.schoolCode
        }
        this.addTemplateVideo(req).then(res => {
          return resolve(res)
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.lessonPlan {
  .ant-collapse{
    background-color: #fff;
    border: none;
    .ant-collapse-item{
      border: 1px solid #f5f5f5;
      margin-bottom: 20px;
      @{deep} .header{
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
