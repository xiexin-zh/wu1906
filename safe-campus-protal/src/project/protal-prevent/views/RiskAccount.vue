<template>
  <div class="page-layout bg-fff qui-fx-ver u-padd">
    <div class="qui-fx-f1" id="tableList">
      <a-table
        style="height: 400px"
        :scroll="{ y: '400px' || this.$tools.setScroll('tableList') }"
        :columns="columns"
        :data-source="dataSource"
        bordered
        size="middle"
        :pagination="false"
      >
        <template
          slot="index"
          slot-scope="text, record, index">{{
            index | getPageIndex(pageList)
          }}</template>
        <template v-slot:other1="other1">
          <a-tag
            :color="other1.riskLevel === '1' ? '#ff5454'
              : other1.riskLevel === '2' ? '#f5772d'
                : other1.riskLevel === '3' ? '#f5b111'
                  :other1.riskLevel === '4' ? '#0084ff' :
                    ''">{{ other1.riskLevel | levelType }}</a-tag>
        </template>
        <template v-slot:other3="other3">
          <a-tag
            :color="other3.riskLevel === '1' ? '#ff5454'
              : other3.riskLevel === '2' ? '#f5772d'
                : other3.riskLevel === '3' ? '#f5b111'
                  :other3.riskLevel === '4' ? '#0084ff' :
                    ''">{{ other3.riskLevel | getDangerLevel }}</a-tag>
        </template>
        <template v-slot:other4="other4">
          {{ other4.controlLevel | controlType }}
        </template>
        <template v-slot:other2="other2">
          <div v-if="other2.show" class="qui-fx">
            <div>{{ other2.frequency }}次/{{ other2.frequencyUnit === '1' ? '天' : other2.frequencyUnit === '2' ? '周' : '月' }}</div>
            <a-button size="small" class="edit-action-btn u-mar-l10" icon="form" @click="modify(0,other2)"></a-button>
          </div>
          <div v-else class="qui-fx-ac">
            <a-input-number style="width:40%" v-model="other2.frequency"/>
            <a-select
              v-model="other2.frequencyUnit"
              style="width:60%;margin-left:5px">
              <a-select-option v-for="work in numList" :value="work.key" :key="work.key">
                {{ work.val }}
              </a-select-option>
            </a-select>
            <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="save(other2)" @cancel="modify(1,other2)">
              <template slot="title">
                您确定修改吗?
              </template>
              <a-tooltip placement="topLeft" title="保存">
                <a-button size="small" class="add-action-btn u-mar-l10" icon="save"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </div>
        </template>
      </a-table>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import PageNum from '@c/PageNum'
import { mapState, mapActions } from 'vuex'
const columns = [
  {
    title: '风险点',
    children: [
      {
        title: '序号',
        width: '4%',
        scopedSlots: {
          customRender: 'index'
        }
      },
      {
        title: '风险分类',
        dataIndex: 'categoryName',
        width: '6%'
      },
      {
        title: '检查对象',
        dataIndex: 'checkObject',
        width: '6%'
      }
    ]
  },
  {
    title: '潜在风险',
    dataIndex: 'riskContent',
    width: '6%'
  },
  {
    title: '风险等级',
    width: '4%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '风险分级',
    width: '6%',
    scopedSlots: {
      customRender: 'other3'
    }
  },
  {
    title: '事故类型',
    dataIndex: 'accidentType',
    width: '6%'
  },
  {
    title: '管控措施',
    children: [
      {
        title: '科学技术',
        dataIndex: 'scientificMeasures',
        width: '6%'
      },
      {
        title: '管理措施',
        dataIndex: 'manageMeasures',
        width: '6%'
      },
      {
        title: '培训教育',
        dataIndex: 'trainingMeasures',
        width: '6%'
      },
      {
        title: '个人防护',
        dataIndex: 'protectiveMeasures',
        width: '6%'
      },
      {
        title: '应急处置',
        dataIndex: 'emergencyMeasure',
        width: '6%'
      }
    ]
  },
  {
    title: '管控层级',
    width: '6%',
    scopedSlots: {
      customRender: 'other4'
    }
  },
  {
    title: '责任人',
    dataIndex: 'responsibilityUserName',
    width: '4%'
  },
  {
    title: '检查频次',
    width: '12%',
    scopedSlots: {
      customRender: 'other2'
    }
  }
]

export default {
  name: 'RiskAccount',
  components: {
    PageNum
  },
  data() {
    return {
      columns,
      dataSource: [],
      pageList: {
        page: 1,
        size: 20
      },
      searchText: {},
      total: 0,
      numList: [
        {
          key: '1',
          val: '次/天'
        }, {
          key: '2',
          val: '次/周'
        }, {
          key: '3',
          val: '次/月'
        }
      ]
    }
  },
  filters: {
    // 获取表格索引
    getPageIndex: (val, obj) => {
      if (JSON.stringify(obj) === '{}') {
        return val + 1
      } else {
        return (obj.page - 1) * obj.size + val + 1
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['riskAccount', 'modifyRiskAccount']),
    async showList () {
      this.searchText.schoolCode = this.userInfo.schoolCode
      this.searchText = Object.assign(this.searchText, this.pageList)
      const res = await this.riskAccount(this.searchText)
      this.dataSource = res.data.records.map(el => {
        return {
          ...el,
          show: true
        }
      })
      this.total = res.data.total
    },
    modify(type, other2) {
      other2.show = type
    },
    save(other2) {
      other2.show = true
      const req = {
        frequency: other2.frequency,
        frequencyUnit: other2.frequencyUnit,
        id: other2.id
      }
      this.modifyRiskAccount(req).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.pageList.size = 20
          this.pageList.page = 1
          this.showList()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
