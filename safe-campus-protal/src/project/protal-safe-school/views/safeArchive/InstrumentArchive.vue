<template>
  <div class="instrument-archive page-layout bg-fff qui-fx-ver">
    <div class="tip">
      <a-icon type="exclamation-circle" />
      温馨提示：保质期前30天之内的专项档案字体显示橙色，超过保质期的专项档案字体显示红色
    </div>
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button type="primary" icon="plus" @click="add(0)">新增档案</a-button>
        <a-button icon="delete" class="del-btn mar-l10" @click="dels">批量删除</a-button>
      </div>
    </search-form>
    <table-list
      is-check
      :page-list="pageList"
      :columns="columns"
      :table-list="userList"
      v-model="chooseList"
      @clickRow="clickRow"
      @selectAll="selectAll">
      <template v-slot:other2="other2">
        <div :style="[{'color': (other2.record.validDate - validDate < 0) ? 'red' : other2.record.validDate - endDate < 0 ? 'orange' : 'black'}]">
          {{ other2.record.name }}
        </div>
      </template>
      <template v-slot:other3="other3">
        <div :style="[{'color': (other3.record.validDate - validDate < 0) ? 'red' : other3.record.validDate - endDate < 0 ? 'orange' : 'black'}]">
          {{ other3.record.address }}
        </div>
      </template>
      <template v-slot:other4="other4">
        <div :style="[{'color': (other4.record.validDate - validDate < 0) ? 'red' : other4.record.validDate - endDate < 0 ? 'orange' : 'black'}]">
          {{ other4.record.num }}
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
          <a-button size="small" class="edit-action-btn" icon="form" @click.stop="add(1, action)"></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(action)">
          <template slot="title"> 确定删除该器材的档案记录吗？ </template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
        <!-- <a-tooltip placement="topLeft" title="生产隐患">
          <a-button size="small" class="power-action-btn" icon="lock" @click.stop="create(action)"></a-button>
        </a-tooltip> -->
      </template>
    </table-list>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
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
    value: 'name',
    type: 'input',
    label: '型号',
    placeholder: '请输入'
  }
]
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'number'
    },
    width: '10%'
  },
  {
    title: '器械名称',
    width: '13%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '数量',
    width: '13%',
    scopedSlots: {
      customRender: 'other4'
    }
  },
  {
    title: '存放地点',
    width: '12%',
    scopedSlots: {
      customRender: 'other3'
    }
  },
  {
    title: '有效期',
    width: '15%',
    scopedSlots: {
      customRender: 'other5'
    }
  },
  {
    title: '发布时间',
    width: '15%',
    scopedSlots: {
      customRender: 'totalNum'
    }
  },
  {
    title: '操作',
    key: 'action',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'InstrumentArchive',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  data() {
    return {
      columns,
      searchLabel,
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      userList: [],
      chooseList: [],
      title: '添加档案',
      archiveId: '',
      searchList: {},
      validDate: new Date().getTime(),
      endDate: new Date().getTime() + 1000 * 60 * 60 * 24 * 30
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getOtherArchive', 'delOtherArchive', 'delOtherArchives']),
    async showList() {
      this.searchList.type = '2'
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getOtherArchive(this.searchList)
      this.userList = res.data.records
      this.total = res.data.total
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
    add(type, record) {
      if (type) {
        this.title = '编辑档案'
      } else {
        this.title = '添加档案'
      }
      this.$router.push({
        path: '/instrumentArchive/instrumentAdd',
        query: {
          id: record ? record.record.id : ''
        }
      })
    },
    // 删除单条记录
    async del(record) {
      await this.delOtherArchive(record.record.id)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this.showList()
        this.chooseList = []
      })
    },
    // 批量删除
    dels(record) {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要删除的档案记录')
        return false
      }
      this.$tools.delTip('确定删除选中的档案记录吗？', () => {
        this.delOtherArchives(this.chooseList).then(res => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.instrument-archive {
  .tip {
    height: 30px;
    line-height: 30px;
    background-color: #FFFFCD;
    color: @tip-color;
    margin: 10px 5px 0 5px;
    padding: 0 5px;
  }
}
</style>
