<template>
  <div class="lessonPlan qui-fx-ver">
    <div class="u-padd-10 u-padd-l20 u-padd-t40">
      <a-row type="flex" justify="center">
        <a-col :span="18" class="u-tx-c">
          <a-button icon="plus" class="add-action-btn u-mar-b20" type="primary" @click="add">添加广播</a-button>
          <div>请先在【广播资源管理】内添加备选应急广播</div>
        </a-col>
      </a-row>
      <table-list
        class="u-mar-t20"
        :columns="columns"
        :table-list="findList">
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="试听">
            <a-button size="small" class="play-action-btn" icon="play-circle" @click="play(action.record)"></a-button>
          </a-tooltip>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete" @click="del(action.record)"></a-button>
          </a-tooltip>
        </template>
      </table-list>
      <div>
        <span>播放模式：</span>
        <a-radio-group v-model="value" @change="change">
          <a-radio value="1">自动播放</a-radio>
          <a-radio value="2">手动播放</a-radio>
        </a-radio-group>
      </div>
      <div class="u-tx-c u-mar-t20">
        <a-button type="primary" @click="previous">上一步</a-button>
        <a-button class="mar-l10" type="primary" @click="nextStep">下一步</a-button>
        <a-button class="mar-l10" @click="carryOut" >完成</a-button>
      </div>
    </div>
    <preview-audio v-model="previewTag" :url="url"></preview-audio>
    <add-radio v-model="addTag"></add-radio>
  </div>
</template>

<script>
import TableList from '@c/TableList'
import PreviewAudio from '../PreviewAudio'
import AddRadio from './AddRadio'
import { mapActions } from 'vuex'
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '20%'
  },
  {
    title: '广播名称',
    dataIndex: 'name',
    width: '40%'
  },
  {
    title: '操作',
    width: '40%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'Radio',
  components: {
    TableList,
    PreviewAudio,
    AddRadio
  },
  data() {
    return {
      columns,
      isLoad: false,
      value: '1',
      previewTag: false,
      addTag: false,
      url: '',
      findList: []
    }
  },
  async created() {
    this.id = this.$route.query.id
    if (this.id) {
      this.showDetail()
    }
  },
  methods: {
    ...mapActions('home', [ 'getTemplateRadio', 'addTemplateRadio' ]),
    // 添加教案
    add() {
      if (this.value === '1' && this.findList.length >= 1) {
        this.$message.warning('自动模式，仅支持1个广播！')
        return
      }
      this.addTag = true
    },
    change(e) {
      if (e.target.value === '1' && this.findList.length > 1) {
        this.$message.warning('自动模式，仅支持1个广播！')
        this.findList = [this.findList[0]]
      }
    },
    // 子组件选择的资源
    sonSelected(record) {
      if (this.findList.length === 0) {
        this.findList = this.findList.concat(record)
      } else {
        const chenckedArr = record.filter(v => this.findList.findIndex(i => i.code === v.code) === -1) // 去重
        this.findList = this.findList.concat(chenckedArr)
      }
    },
    // 试听
    play(record) {
      this.previewTag = true
      this.type = record.type
      this.url = record.url
    },
    // 删除
    del(record) {
      this.findList = this.findList.filter(v => v.code !== record.code) // 去重
    },
    // 获取详情
    async showDetail() {
      const res = await this.getTemplateRadio({ emergencyId: this.id })
      if (res.data.audioList.length === 0) return // 为空数组的时候不赋值
      this.findList = res.data.audioList
    },
    previous() {
      this.$parent.isActive('1')
    },
    // 完成
    carryOut() {
      this.submitOk().then(el => {
        this.$router.push('/emergencyPlan')
      })
    },
    // 下一步
    nextStep() {
      this.submitOk().then(el => {
        this.$parent.isActive('3')
      })
    },
    // 提交
    submitOk() {
      return new Promise((resolve, reject) => {
        const req = {
          broadcastMode: this.value,
          emergencyId: this.id,
          resourceIds: this.findList.length > 0 ? this.findList.map(el => el.id) : []
        }
        this.addTemplateRadio(req).then(res => {
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
