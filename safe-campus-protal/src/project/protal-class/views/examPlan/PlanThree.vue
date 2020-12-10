<template>
  <div class="plan-three qui-fx-ver qui-fx-f1">
    <a-drawer
      width="650"
      title="考试场地"
      placement="right"
      :closable="false"
      v-if="placeTag"
      :visible="placeTag"
      @close="placeTag = false"
    >
      <div>
        <table-list is-check v-model="chooseList" :columns="tableC" :table-list="placeList">
          <template v-slot:other3="other3">
            {{ other3.record.startNumber }}
            <span style="padding: 0 2px">~</span>
            {{ other3.record.endNumber }}
          </template>
        </table-list>
      </div>
      <div
        :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px'
        }"
      >
        <a-button style="marginRight: 8px" @click="placeTag = false">关闭</a-button>
        <a-button type="primary" @click="setPlace">设置</a-button>
      </div>
    </a-drawer>
    <ul class="qui-fx table-title">
      <li style="width: 150px">考试学科</li>
      <li class="qui-fx-f1">考试日期</li>
      <li class="qui-fx-f1">考试时间</li>
      <li style="width: 150px">考试场地</li>
    </ul>
    <div class="qui-fx-f1">
      <ul class="qui-fx" v-for="test in subjectList" :key="test.id">
        <li style="width: 150px">{{ test.subjectName }}</li>
        <li class="qui-fx-f1">
          <a-date-picker
            :disabled="isDetail"
            v-model="test.testDate"
            @change="onChange([...arguments, test, 'testDate'])"
          />
        </li>
        <li class="qui-fx-f1">
          <a-time-picker
            :disabled="isDetail"
            @change="onChange([...arguments, test, 'startTime'])"
            v-model="test.startTime"
            format="HH:mm"
          />
          <span style="padding: 0 8px">至</span>
          <a-time-picker
            :disabled="isDetail"
            @change="onChange([...arguments, test, 'endTime'])"
            v-model="test.endTime"
            format="HH:mm"
          />
        </li>
        <li style="width: 150px">
          <a-tag color="#87d068" @click="showPlace(test)">场地分配</a-tag>
        </li>
      </ul>
      <div v-if="!isDetail" style="margin-top: 30px; text-align: right">
        <a-button @click="viewTest" type="primary">预览考试</a-button>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import TableList from '@c/TableList'
import { mapState, mapActions } from 'vuex'
const tableC = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '考试场地',
    dataIndex: 'placeName',
    width: '35%'
  },
  {
    title: '考场号',
    dataIndex: 'testRoomName',
    width: '20%'
  },
  {
    title: '考号范围',
    width: '20%',
    scopedSlots: {
      customRender: 'other3'
    }
  }
]
export default {
  name: 'PlanThree',
  props: {
    isDetail: {
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      default: ''
    }
  },
  components: { TableList },
  data() {
    return {
      placeTag: false,
      moment,
      tableC,
      chooseList: [],
      placeList: [],
      subjectList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async mounted() {
    const res = await this.getSubjectById(this.id)
    this.subjectList = res.data.map(item => {
      return {
        ...item,
        testDate: item.testDate
          ? moment(this.$tools.getDate(item.testDate || new Date().getTime(), 1), 'YYYY-MM-DD')
          : null,
        // startTime: null,
        // endTime: null
        startTime: moment(this.$tools.getDate(item.startTime || new Date().getTime(), 4), 'HH:mm'),
        endTime: moment(this.$tools.getDate(item.endTime || new Date().getTime(), 4), 'HH:mm')
      }
    })
  },
  methods: {
    ...mapActions('home', ['getSubjectById', 'updateSubject', 'getPlaceById', 'getBindPlace', 'bindTest']),
    onChange([a, b, c, d]) {
      if (!b) {
        this.$message.warning('请选择时间')
        return
      }
      this.uppateList(b, c, d)
    },
    viewTest() {
      const tag = this.subjectList.some(item => {
        return !item.testDate || !item.startTime || !item.endTime
      })
      if (tag) {
        this.$message.warning('请录入考试时间信息')
        return
      }
      this.$emit('goNext', 3, this.id)
    },
    async uppateList(date, item, type) {
      if (type === 'endTime') {
        if (item.endTime < item.startTime) {
          this.$message.warning('结束时间不能小于开始时间')
          return
        }
      } else {
        if (item.startTime > item.endTime) {
          this.$message.warning('开始时间不能大于结束时间')
          return
        }
      }
      const params = {
        ...item
      }
      params[type] = date
      if (type !== 'testDate') params[type] = date + ':00'
      await this.updateSubject(params)
      this.$message.success('操作成功')
    },
    async setPlace() {
      const params = {
        id: '',
        planRoomIdList: this.chooseList,
        testId: this.currentTest.id,
        testName: this.currentTest.subjectName
      }
      await this.bindTest(params)
      this.$message.success('设置成功')
      this.$tools.goNext(() => {
        this.placeTag = false
      })
    },
    async showPlace(item) {
      this.currentTest = item
      this.placeTag = true
      const bindRes = await this.getBindPlace(item.id)
      this.chooseList = bindRes.data.filter(item => {
        return item
      })
      const placeRes = await this.getPlaceById(this.id)
      this.placeList = placeRes.data
    }
  }
}
</script>

<style lang="less">
.plan-three {
  padding: 0 30px;
  ul {
    margin-bottom: 0;
  }
  li {
    text-align: center;
    height: 40px;
    line-height: 40px;
    border: 1px #f5f5f5 solid;
  }
  .table-title {
    background-color: #eee;
  }
}
</style>
