<template>
  <div class="record page-layout qui-fx-ver">
    <search-form :search-label="searchLabel" @search-form="search">
      <a-button type="primary" slot="left" @click.stop="addHandle">添加场地</a-button>
    </search-form>
    <div id="table" class="qui-fx-f1">
      <div style="position: absolute; width: 100%; height: 100%;">
        <a-table
          :scroll="{y: this.$tools.setScroll('table')}"
          :pagination="false"
          :rowKey="(record) => record.id"
          :columns="columns"
          :dataSource="alarmList"
        >
          <template slot="index" slot-scope="text, record, index">
            <span>{{ (pageList.page - 1) * (pageList.size) + (index + 1) }}</span>
          </template>
          <template slot="buildingName" slot-scope="text, record">
            <span>{{ record.buildingName }} {{ record.floorName }}</span>
          </template>
          <template slot="state" slot-scope="text, record">
            <a-switch v-model="record.state" @change="delList(1,record)"/>
            <!-- <a-tag color="#108ee9" v-if="!record.state" @click="delList(1,record)">开启</a-tag>
            <a-tag color="#ccc" v-if="record.state" @click="delList(1,record)">关闭</a-tag> -->
          </template>
          <template slot="action" slot-scope="text, record">
            <a-tag color="#f50" @click="delList(0,record)">删除</a-tag>
          </template>
        </a-table>
      </div>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="showTableList"></page-num>
    <add-warning ref="addWarning" @updata="showTableList"></add-warning>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import SearchForm from '../components/common/SearchForm'
import PageNum from '../components/common/PageNum'
import AddWarning from '../components/AddWarning'
import { Switch } from 'ant-design-vue'
import mixins from '@u/mixins'
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    scopedSlots: {
      customRender: 'index'
    },
    width: '20%'
  },
  {
    title: '入侵场地',
    dataIndex: 'buildingName',
    width: '40%',
    scopedSlots: {
      customRender: 'buildingName'
    }
  },
  {
    title: '是否推送',
    dataIndex: 'state',
    width: '20%',
    scopedSlots: {
      customRender: 'state'
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'AlarmPush',
  components: {
    ASwitch: Switch,
    PageNum,
    SearchForm,
    AddWarning
  },
  mixins: [mixins],
  data () {
    return {
      columns,
      searchLabel: [
        {
          value: 'areaKey',
          type: 'input',
          label: '场地名称',
          placeholder: '请输入场地名称'
        }],
      pageList: {
        page: 1,
        size: 20,
        schoolCode: ''
      },
      total: 0,
      alarmList: []
    }
  },
  computed: {
    ...mapState('home', 'userInfo')
  },
  methods: {
    ...mapActions('invadeRecord', [
      'getAlarmList', 'delAlarmList', 'addAlarmList'
    ]),
    addHandle () {
      this.$refs.addWarning.addVisible = true
    },
    delList (type, text) {
      if (type) {
        text.state = !!text.state
        this.addAlarmList(text).then(res => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.showTableList()
          })
        })
      } else {
        this.$tools.delTip('确定要删除吗？', () => {
          this.delAlarmList(text.id).then(res => {
            this.$message.success('删除成功')
            this.$tools.goNext(() => {
              this.showTableList()
            })
          })
        })
      }
    },
    search (obj) {
      this.pageList.areaKey = obj.areaKey
      this.showTableList()
    },
    async showTableList () {
      this.pageList.schoolCode = sessionStorage.getItem('schoolScheme')
      const res = await this.getAlarmList({
        ...this.pageList
      })
      this.total = res.data.total
      this.alarmList = res.data.list
    }
  },
  mounted () {
    this.showTableList()
  }
}
</script>
<style lang="less" scoped>
  .record{
    height: 100%;
  }
  .search-form {
    margin-top: 0px;
    height: auto;
  }
  .pagination-com {
    padding: 0
  }
</style>
