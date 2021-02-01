<template>
  <div class="check page-layout u-fx layout-padd u-type-white-bg">
    <div class="u-fx-f1 content">
      <u-button type="primary" icon="plus" class="u-mar-b" @click="add(0)">添加查寝组</u-button>
      <u-empty description="什么也没有~" v-if="noData"></u-empty>
      <a-collapse v-model="activeKey" expand-icon-position="left" v-else>
        <a-collapse-panel v-for="list in checkList" :key="list.code" :header="list.name">
          <div class="u-fx-ver u-fx-f1">
            <div class="u-fx">
              <div class="title">查寝对象：</div>
              <div class="u-fx-f1">
                <a-checkbox-group v-model="list.checkedList" :options="gradeLsit" @change="onChange($event,list)" />
              </div>
            </div>
            <div class="u-fx-f1 u-mar-t10">
              <a-table
                :columns="columns"
                :data-source="list.checkTimeDtoList"
                :pagination="false"
                :rowKey="record => record.id"
                bordered
              >
                <template slot="slotOne" slot-scope="text, record">
                  <div v-for="el in record.canpointDormPlanDtoList" :key="el.dormGroupCode">
                    {{ el.realSegment }} {{ moment(el.startTime).format('HH:mm') }}- {{ moment(el.endTime).format('HH:mm') }}
                  </div>
                </template>
                <template slot="slotTwo" slot-scope="text, record">
                  <div v-for="el in record.canpointDormPlanDtoList" :key="el.dormGroupCode">
                    <u-type>{{ getDataState('checkType', el.checkType) }}</u-type>
                  </div>
                </template>
              </a-table>
            </div>
          </div>
          <div slot="extra">
            <u-space>
              <u-button size="small" type="light" @click="add(1, list)">编辑</u-button>
              <u-button size="small" type="link" delete @click="del(list.groupId)">删除</u-button>
            </u-space>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <div class="right u-type-white-bg u-mar-l u-padd">
      <div>
        <a-icon class="u-type-primary u-font-3" type="exclamation-circle" />
        <span class="u-font-3 u-mar-l10">请注意</span>
        <p class="u-mar-t">1.每日统计周期固定24小时，默认自然日（00:00-次日0:00）；</p>
        <p>2.早查寝</p>
        <p>• 早查寝结束时间实时不在寝记为出寝；</p>
        <p>• 早查寝结束时间实时在寝记为未出寝。</p>
        <p>3.午查寝分为进宿舍和出宿舍2次查寝。</p>
        <p>• 午查寝（进）结束时间实时在寝记为归寝 ；</p>
        <p>• 午查寝（进）结束时间实时不在寝记为未归寝 ；</p>
        <p>• 午查寝（出）结束时间实时不在寝记为出寝；</p>
        <p>• 午查寝（出）结束时间实时在寝记为未出寝。</p>
        <p>4.晚查寝</p>
        <p>• 晚查寝结束时间实时在寝记为归寝 ；</p>
        <p>• 晚查寝结束时间实时不在寝记为未归寝。</p>
      </div>
      <div class="bottom"></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import { getDataState } from '@u/libs/data-state'
import user from '../../assets/img/user.png'

const columns = [
  {
    title: '查寝时间',
    colSpan: 2,
    dataIndex: 'weekNum',
    width: '20%',
    customRender: (text) => {
      return getDataState('weekNum', text)
    }
  },
  {
    title: '时间',
    colSpan: 0,
    dataIndex: 'time',
    width: '60%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '状态',
    dataIndex: 'state',
    width: '20%',
    scopedSlots: {
      customRender: 'slotTwo'
    }
  }
]
export default {
  name: 'Check',
  components: {},
  data() {
    return {
      moment,
      user,
      columns,
      getDataState,
      checkList: [],
      text: '122',
      activeKey: '1',
      checkedList: [],
      noData: false
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  async mounted() {
    await this._getOldSchoolYearList()
    await this._getCheckGroup()
  },
  methods: {
    ...mapActions('home', [
      'getCheckGroup', 'delCheckGroup', 'getOldSchoolYearList', 'getGradeClassList', 'updateClassCheck'
    ]),
    // 获取年级
    async _getOldSchoolYearList() {
      const res = await this.getOldSchoolYearList({ schoolCode: this.schoolCode })
      await this._getGradeClassList(res.data)
    },
    // 获取年级
    async _getGradeClassList(data) {
      const req = {
        schoolCode: this.schoolCode,
        gradeCode: data.enableSchoolYear.code,
        schoolYearCode: data.enableSchoolYear.code
      }
      const res = await this.getGradeClassList(req)
      this.gradeLsit = res.data.map(el => {
        return {
          gradeCode: el.gradeCode,
          gradeName: el.gradeName,
          label: el.gradeName,
          value: el.gradeCode
        }
      })
    },
    // 查寝组列表
    async _getCheckGroup() {
      const res = await this.getCheckGroup({ schoolCode: this.schoolCode })
      if (res.data === null || res.data.length === 0) {
        this.noData = true
        return
      } else {
        this.noData = false
      }
      this.activeKey = res.data[0].code
      this.checkList = res.data.map(el => {
        return {
          ...el,
          checkedList: el.outCanpointGradeDtoList.map(item => {
            return item.gradeCode
          })
        }
      })
    },
    // 查寝组添加和编辑
    add(type, record) {
      this.$router.push({
        path: '/addCheck',
        query: {
          id: type ? record.groupId : ''
        }
      })
    },
    // 查寝组删除
    async del(id) {
      await this.delCheckGroup({ groupId: id })
      this.$tools.message('succses', '删除成功')
      this.$tools.goNext(this._getCheckGroup)
    },
    async onChange(e, value) {
      const canpointGradeDtoList = e.map(el => {
        return {
          gradeCode: el
        }
      })
      const req = {
        canpointGradeDtoList: canpointGradeDtoList,
        groupCode: value.code
      }
      await this.updateClassCheck(req)
      this.$tools.message('succses', '操作成功')
      this.$tools.goNext(this._getCheckGroup)
    }
  }
}
</script>
<style lang="less" scoped>
.check {
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
    .title {
      color: #333;
    }
  }
  .right {
    width: 312px;
    color: #333;
    position: relative;
    .bottom {
      position: absolute;
      bottom: 50px;
      left: 20px;
      width: 80%;
      height: 200px;
      background: url(../../assets/img/user.png);
    }
  }
}
.ant-collapse {
  background-color: #e2effe;
}
/deep/ .ant-table-thead>tr>th {
  background-color: #f8f7f7;
}
</style>
