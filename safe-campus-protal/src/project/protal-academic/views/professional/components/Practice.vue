<template>
  <div class="teaching-activity">
    <sub-form
      ref="form"
      @submit-form="submitForm"
      :title="formTitle"
      v-model="formStatus"
      :form-data="formData"
      :yearCount="yearCount"
      :scoreList="scoreList"
      yearTitle="周数"
    ></sub-form>
    <div class="btn-add">
      <a-button type="primary" @click="addTask(1)"> 添加 </a-button>
    </div>
    <div class="table">
      <table-list isBorder :table-list="dataList" :columns="columns">
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="编辑">
            <a-button
              size="small"
              class="edit-action-btn"
              icon="form"
              @click.stop="addTask(0, action.record)"
            ></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="left"
            okText="确定"
            cancelText="取消"
            @confirm="deleteList(action.record)"
          >
            <template slot="title"> 您确定删除吗? </template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </table-list>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SubForm from '../../../component/SubForm.vue'
import Tools from '@/utils/tools'
const columns = [
  {
    title: '实践任务',
    dataIndex: 'taskName',
    key: 'taskName',
    width: 150,
    align: 'center'
  },
  {
    title: '教学活动',
    dataIndex: 'activityName',
    key: 'activityName',
    width: 150,
    align: 'center'
  },
  {
    title: '学期(周学时)',
    dataIndex: 'semester',
    key: 'semester',
    align: 'center',
    children: []
  },
  {
    title: '总计',
    dataIndex: 'totalNum',
    key: 'totalNum',
    width: 80,
    align: 'center'
  },
  {
    title: '操作',
    width: 100,
    align: 'center',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const formData = [
  {
    value: 'taskId',
    initValue: '',
    type: 'select',
    label: '实践任务',
    placeholder: '请选择实践任务',
    list: []
  },
  {
    value: 'activityId',
    initValue: '',
    type: 'select',
    label: '教学活动',
    placeholder: '请选择教学活动',
    list: []
  },
  {
    value: 'timeList',
    type: 'yearPanel',
    placeholder: '',
    list: []
  }
]
export default {
  name: 'Practice',
  components: {
    TableList,
    SubForm
  },
  props: {
    yearCount: {
      type: Number,
      default: 0
    },
    programId: {
      required: true
    },
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns,
      formData,
      formTitle: '',
      formStatus: false,
      taskId: '',
      scoreList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    if (this.yearCount > 0) {
      const children = []
      for (let i = 0; i < this.yearCount * 2; i++) {
        const obj = {
          title: `第${Tools.getLargeNumber(i + 1)}学期`,
          dataIndex: `item${i + 1}`,
          align: 'center'
        }
        children.push(obj)
      }
      this.columns[2].children = children
    }
    this.getActivity()
    this.getTaskList()
  },
  methods: {
    ...mapActions('home', [
      'getPracticeTask',
      'getSchemeActivity',
      'getSchemeTask',
      'addSchemeTask',
      'editSchemeTask',
      'delSchemeTask'
    ]),
    async getTaskList() {
      const req = {
        page: 1,
        size: 9999,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getPracticeTask(req)
      if (!res.data.records) {
        this.taskList = []
        return
      }
      this.formData[0].list = res.data.records.map(item => {
        return {
          key: item.id,
          val: item.name
        }
      })
    },
    async getActivity() {
      const res = await this.getSchemeActivity({ schemeId: this.programId })
      if (res && res.code === 200) {
        this.formData[1].list = res.data
          .filter(item => item.title !== '合计')
          .map(item => {
            return {
              key: item.id,
              val: item.title
            }
          })
      }
    },
    addTask(type, record) {
      console.log(record)
      this.formTitle = type ? '添加实践任务' : '编辑实践任务'
      this.formData[0].initValue = type ? '' : record.taskId
      this.formData[1].initValue = type ? '' : String(record.activityId)
      this.taskId = record ? record.id : ''
      if (type) {
        const list = []
        for (let i = 0; i < this.yearCount; i++) {
          list.push(0)
        }
        this.scoreList = list
      } else {
        const scoreList = []
        for (let val in record.itemObj) {
          scoreList.push(record.itemObj[val])
        }
        this.scoreList = scoreList
      }
      this.formStatus = true
    },
    async deleteList(record) {
      await this.delSchemeTask(record.id)
      this.$emit('showList')
    },
    async submitForm(values) {
      console.log(values)
      const { yearTimeList } = values
      const numList = []
      yearTimeList.forEach(item => {
        item.list.forEach(el => {
          numList.push(el.count)
        })
      })
      const req = {
        activityId: values.activityId,
        numList,
        schemeId: this.programId,
        taskId: values.taskId
      }
      if (this.taskId) {
        req.id = this.taskId
        delete req.schemeId
      }
      const res = this.taskId ? await this.editSchemeTask(req) : await this.addSchemeTask(req)
      if (res && res.code === 200) {
        this.$emit('showList')
        this.formStatus = false
      }
    }
  }
}
</script>

<style scoped>
.teaching-activity {
  padding-right: 20px;
  box-sizing: border-box;
}
.btn-add {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 20px;
}
</style>
