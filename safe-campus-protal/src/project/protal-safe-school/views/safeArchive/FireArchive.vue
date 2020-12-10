<template>
  <div class="fire-archive page-layout bg-fff qui-fx-ver">
    <a-tabs type="card" @change="callback" v-model="deviceType">
      <a-tab-pane key="1" tab="灭火器档案"></a-tab-pane>
      <a-tab-pane key="2" tab="灭火毯档案"></a-tab-pane>
      <a-tab-pane key="3" tab="消火栓档案"></a-tab-pane>
      <a-tab-pane key="4" tab="安全通道档案"></a-tab-pane>
      <a-tab-pane key="5" tab="其他消防设施"></a-tab-pane>
    </a-tabs>
    <div class="tip" v-if="deviceType !== '4'">
      <a-icon type="exclamation-circle" />
      温馨提示：保质期前30天之内的专项档案字体显示橙色，超过保质期的专项档案字体显示红色
    </div>
    <search-form is-reset @search-form="searchForm" :search-label="deviceType === '4' ? safeLabel : searchLabel ">
      <div slot="left">
        <a-button type="primary" icon="plus" @click="addApp(0)">新增档案</a-button>
        <a-button icon="delete" class="del-btn mar-l10" @click="dels">批量删除</a-button>
      </div>
    </search-form>
    <table-list
      is-check
      :page-list="pageList"
      :columns="deviceType === '4' ? columns.aqtdColumns :deviceType === '5' ? columns.qtColumns :deviceType === '2' ? columns.mhtColumns: columns.mhqColumns"
      :table-list="userList"
      v-model="chooseList"
      @clickRow="clickRow"
      @selectAll="selectAll">
      <template v-slot:other2="other2">
        <div :style="[{'color': (other2.record.validDate - validDate < 0) ? 'red' : other2.record.validDate - endDate < 0 ? 'orange' : 'black'}]">
          {{ other2.record.name ? other2.record.name:other2.record.type }}
        </div>
      </template>
      <template v-slot:other3="other3">
        <div :style="[{'color': (other3.record.validDate - validDate < 0) ? 'red' : other3.record.validDate - endDate < 0 ? 'orange' : 'black'}]">
          {{ other3.record.address }}
        </div>
      </template>
      <template v-slot:other4="other4">
        <div v-if="deviceType === '5'" :style="[{'color': (other4.record.validDate - validDate < 0) ? 'red' : other4.record.validDate - endDate < 0 ? 'orange' : 'black'}]">
          {{ other4.record.num }}
        </div>
        <div v-else :style="[{'color': (other4.record.validDate - validDate < 0) ? 'red' : other4.record.validDate - endDate < 0 ? 'orange' : 'black'}]">
          {{ other4.record.deviceName }}
        </div>
      </template>
      <template v-slot:other5="other5">
        <div :style="[{'color': (other5.record.validDate - validDate < 0) ? 'red' : other5.record.validDate - endDate < 0 ? 'orange' : 'black'}]">
          {{ other5.record.validDate | gmtToDate('date') }}
        </div>
      </template>
      <template v-slot:totalNums="totalNums">
        <div :style="[{'color': (totalNums.record.validDate - validDate < 0) ? 'red' : totalNums.record.validDate - endDate < 0 ? 'orange' : 'black'}]">
          {{ totalNums.record.createTime | gmtToDate('date') }}
        </div>
      </template>
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="编辑">
          <a-button size="small" class="edit-action-btn" icon="form" @click.stop="addApp(1, action)"></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(action)">
          <template slot="title"> 确定删除该安全通道的档案记录吗? </template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
        <!-- <a-tooltip placement="topLeft" title="生产隐患">
          <a-button size="small" class="power-action-btn" icon="lock" @click.stop="create(action)"></a-button>
        </a-tooltip> -->
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import columns from '../../assets/js/table/fireColumns'
const searchLabel = [
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '完好'
      },
      {
        key: '0',
        val: '损坏'
      }
    ],
    value: 'hasTorn',
    type: 'select',
    label: '存放状态'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '未过期'
      },
      {
        key: '0',
        val: '已过期'
      }
    ],
    value: 'hasValid',
    type: 'select',
    label: '保存状态'
  },
  {
    value: 'keyword',
    type: 'input',
    label: '型号',
    placeholder: '请输入'
  }
]
const safeLabel = [
  {
    value: 'address',
    type: 'input',
    label: '所在位置',
    placeholder: '请输入'
  }
]
export default {
  name: 'FireArchive',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  data() {
    return {
      safeLabel,
      searchLabel,
      columns,
      deviceType: '1',
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      userList: [],
      chooseList: [],
      title: '添加档案',
      total: 0,
      validDate: new Date().getTime(),
      endDate: new Date().getTime() + 1000 * 60 * 60 * 24 * 30
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.deviceType = this.$route.query.deviceType ? this.$route.query.deviceType : '1'
    this.showList()
  },
  methods: {
    ...mapActions('home',
      [
        'getFireArchive', 'delFireArchive', 'delFireArchives', 'getSafeArchive', 'delSafeArchive',
        'delSafeArchives', 'getOtherArchive', 'delOtherArchive', 'delOtherArchives'
      ]),
    async showList() {
      this.searchList.type = this.deviceType === '5' ? '1' : this.searchList.keyword
      this.searchList.name = this.deviceType === '5' ? this.searchList.keyword : undefined
      this.searchList.deviceType = this.deviceType
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      if (this.deviceType === '4') {
        const res = await this.getSafeArchive(this.searchList)
        this.userList = res.data.records
        this.total = res.data.total
      } else if (this.deviceType === '5') {
        const res = await this.getOtherArchive(this.searchList)
        this.userList = res.data.records
        this.total = res.data.total
      } else {
        const res = await this.getFireArchive(this.searchList)
        this.userList = res.data.records
        this.total = res.data.total
      }
    },
    callback(key) {
      this.deviceType = key
      if (this.deviceType === '4') {
        this.searchList = {}
      }
      this.showList()
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.totalList.findIndex(list => {
            return list.id === item.id
          })
          this.totalList.splice(index, 1)
        })
      }
    },
    // 监听选中或取消
    clickRow(item, type) {
      if (type) {
        if (this.isCheck) {
          this.totalList.push(item)
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex(list => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    },
    searchForm(values) {
      values.hasValid = values.hasValid === '1' ? true : values.hasValid === '0' ? false : undefined
      values.hasTorn = values.hasTorn === '' ? undefined : values.hasTorn
      this.searchList = Object.assign(this.searchList, values)
      this.pageList.page = 1
      this.pageList.size = 20
      this.showList()
    },
    addApp(type, record) {
      this.$router.push({
        path: '/fireArchive/fireAdd',
        query: {
          deviceType: this.deviceType,
          id: record ? record.record.id : ''
        }
      })
    },
    async del(record) {
      if (this.deviceType === '4') {
        await this.delSafeArchive(record.record.id)
      } else if (this.deviceType === '5') {
        await this.delOtherArchive(record.record.id)
      } else {
        await this.delFireArchive(record.record.id)
      }
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this.showList()
        this.chooseList = []
      })
    },
    dels(record) {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要删除的档案记录')
        return false
      }
      const _this = this
      this.$confirm({
        title: '确定删除选中的档案记录吗?',
        async onOk() {
          if (_this.deviceType === '4') {
            await _this.delSafeArchives(_this.chooseList)
          } else if (_this.deviceType === '5') {
            await _this.delOtherArchives(_this.chooseList)
          } else {
            await _this.delFireArchives(_this.chooseList)
          }
          _this.$message.success('操作成功')
          _this.$tools.goNext(() => {
            _this.showList()
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.fire-archive {
  .tip {
    height: 30px;
    line-height: 30px;
    background-color: #FFFFCD;
    color: @tip-color;
    margin: 0 5px;
    padding: 0 5px;
  }
}
</style>
