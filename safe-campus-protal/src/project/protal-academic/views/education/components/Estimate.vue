<template>
  <a-modal
    width="50%"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    okText="提交"
  >
    <div class="title">
      <span class="name"><i>* </i>选择教师</span>
      <span
        @click="selectClick"
        class="selectPanel"
        :style="{ background: type === 1 ? '#fff' : '#f5f5f5' }"
      >
        <i>{{ userMsg.userName }}</i>
        <a-icon type="right" />
      </span>
    </div>
    <div class="table">
      <table-list isBorder isFooter :columns="columns" :table-list="userList">
        <template slot="footer">
          <div style="text-align: right">总分：{{ totalScore }}</div>
        </template>
        <template v-slot:actions="action">
          <a-input
            v-model="action.record.score"
            :readonly="type === 2"
            type="number"
            :min="0"
            :max="action.record.levelTwoTotal"
            @change="(e) => changeScore(e, action.record)"
          />
        </template>
      </table-list>
    </div>
    <teacher-panel
      title="选择教师"
      v-if="panelStatus"
      v-model="panelStatus"
      @submit="confirmSelect"
    ></teacher-panel>
  </a-modal>
</template>

<script>
import TeacherPanel from '../../../component/TeacherPanel'
import TableList from '../../../component/TableList'
import { mapState, mapActions } from 'vuex'
const columns = [
  {
    title: '评议指标',
    dataIndex: 'title',
    key: 'title',
    align: 'center',
    children: [
      {
        title: '一级指标',
        dataIndex: 'levelOne',
        width: 100,
        align: 'center',
        customRender: (value, row, index) => {
          const { indexArr } = row
          const obj = {
            children: value,
            attrs: {}
          }
          indexArr.forEach((item) => {
            if (index !== item) {
              obj.attrs.rowSpan = 0
            }
          })
          indexArr.forEach((item, i) => {
            if (index === item) {
              if (i < indexArr.length) {
                obj.attrs.rowSpan = indexArr[i + 1] - indexArr[i]
              }
            }
          })
          return obj
        }
      },
      {
        title: '二级指标',
        dataIndex: 'levelTwo',
        width: 100,
        align: 'center'
      }
    ]
  },
  {
    title: '评审标准',
    dataIndex: 'text',
    key: 'text',
    align: 'center'
  },
  {
    title: '得分',
    dataIndex: 'score',
    key: 'score',
    width: 150,
    align: 'center',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'Estimate',
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    userMsg: {
      type: Object,
      default: { userName: '', userId: '', userCode: '' }
    },
    type: {
      type: Number,
      default: 1
    }
  },
  components: {
    TeacherPanel,
    TableList
  },
  data() {
    return {
      form: this.$form.createForm(this),
      panelStatus: false,
      columns,
      userList: [],
      totalScore: 0
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  created() {},
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getEduIndexList', 'getTeacherScore']),
    async showList() {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        teacherId: this.userMsg.id
      }
      if (this.type === 1) {
        delete req.teacherId
      }
      const res = await this.getTeacherScore(req)
      const dataList = res.data.map((item) => {
        return {
          id: item.id,
          levelOne: item.name,
          total: item.score,
          children: item.childrenList.map((el) => {
            return {
              id: el.id,
              levelTwo: el.name,
              total: el.score,
              text: el.remark,
              score: el.realScore || 0
            }
          })
        }
      })
      // 计算
      const list = []
      let indexArr = [0]
      let totalScore = 0
      dataList.forEach((item, index) => {
        item.children.forEach((el, i) => {
          totalScore = totalScore + el.score
          const obj = {
            levelOneId: item.id,
            id: `${index}-${i}`,
            levelOne: `${item.levelOne}(${item.total}分)`,
            levelOneTotal: item.total,
            levelTwoId: el.id,
            levelTwo: `${el.levelTwo}(${el.total}分)`,
            levelTwoTotal: el.total,
            levelTwoLength: item.children.length || 0,
            text: el.text,
            score: el.score
          }
          list.push(obj)
        })
      })
      const arrSingle = dataList.map((item) => item.id)
      const typeArr = list.map((item) => item.levelOneId)
      arrSingle.forEach((item) => {
        const res = this.searchRange(typeArr, item)
        if (res[0] === -1 || res[1] === -1) {
          return
        }
        indexArr.push(res[1] + 1)
      })
      console.log(indexArr)
      this.totalScore = totalScore
      this.userList = list.map((item) => {
        return {
          ...item,
          indexArr
        }
      })
    },
    searchRange(nums, target) {
      var targetRange = [-1, -1]
      for (let i = nums.length - 1; i >= 0; i--) {
        if (nums[i] == target) {
          targetRange[0] = i
        }
      }
      if (targetRange[0] == -1) {
        return targetRange
      }
      for (let j = 0; j < nums.length; j++) {
        if (nums[j] == target) {
          targetRange[1] = j
        }
      }
      return targetRange
    },
    changeScore(e, record) {
      const { levelOneId, levelTwoId, levelTwoTotal } = record
      const value = Number(e.target.value)
      let score = value ? Number(value.toFixed(2)) : 0
      if (score > levelTwoTotal) {
        score = levelTwoTotal
      }
      this.userList = this.userList.map((item) => {
        if (levelOneId === item.levelOneId && levelTwoId === item.levelTwoId) {
          return {
            ...item,
            score
          }
        }
        return item
      })
      this.$nextTick(() => {
        let totalScore = 0
        this.userList.forEach((item) => {
          totalScore = totalScore + item.score
        })
        this.totalScore = totalScore
      })
    },
    submitOk() {
      if (this.type === 2) {
        return
      }
      if (!this.userMsg.id) {
        this.$message.warning('请选择教师')
        return
      }
      if (this.userList.length === 0) {
        return
      }
      const list = this.userList.map((item) => {
        return {
          quotaId: item.levelTwoId,
          realScore: item.score || 0
        }
      })
      this.$emit('submitForm', list)
    },
    selectClick() {
      if (this.type === 1) {
        this.panelStatus = true
      }
    },
    confirmSelect(item) {
      this.$emit('changeUserInfo', item)
      this.panelStatus = false
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .name {
    width: 15%;

    i {
      font-style: normal;
      color: red;
    }
  }
  .selectPanel {
    width: 85%;
    height: 90%;
    border: 1px solid #ccc;
    border-radius: 2px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;

    i {
      font-style: normal;
    }
  }
}
.table {
  padding: 20px 10px;
  box-sizing: border-box;
}
</style>