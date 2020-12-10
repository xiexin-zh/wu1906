<template>
  <table-list
    :minHeight="tableList.length > 0 ? 250 : 200"
    :scrollH="tableList.length > 0 ? 160 : 0"
    isBorder
    :table-list="tableList"
    :columns="columns"
  >
    <template v-slot:actions="action">
      <a-tooltip placement="topLeft" title="课程设置">
        <a-button
          size="small"
          class="edit-action-btn"
          icon="form"
          @click.stop="setCourse(action.record)"
        ></a-button>
      </a-tooltip>
      <a-popconfirm
        placement="left"
        okText="确定"
        cancelText="取消"
        @confirm="deleteList(action.record.id)"
      >
        <template slot="title"> 您确定删除吗? </template>
        <a-tooltip placement="topLeft" title="删除">
          <a-button size="small" class="del-action-btn" icon="delete"></a-button>
        </a-tooltip>
      </a-popconfirm>
    </template>
  </table-list>
</template>

<script>
import TableList from '../../../component/TableList'
import Tools from '@/utils/tools'
const columns = [
  {
    title: '课程名称',
    dataIndex: 'subjectName',
    key: 'subjectName',
    width: 100,
    align: 'center'
  },
  {
    title: '教学活动',
    dataIndex: 'activityName',
    key: 'activityName',
    width: 100,
    align: 'center'
  },
  {
    title: '课程性质',
    dataIndex: 'subjectType',
    key: 'subjectType',
    width: 100,
    align: 'center'
  },
  {
    title: '考查类型',
    dataIndex: 'testType',
    key: 'testType',
    width: 100,
    align: 'center'
  },
  {
    title: '周学时安排',
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
export default {
  name: 'CourseTable',
  components: {
    TableList
  },
  props: {
    tableList: {
      type: Array,
      default: () => []
    },
    yearCount: {
      type: Number,
      default: 0
    },
    courseType: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      columns
    }
  },
  mounted() {
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
      this.columns[4].children = children
    }
  },
  methods: {
    setCourse(record) {
      this.$emit('courseSet', this.courseType, record.id, record)
    },
    deleteList(id) {
      this.$emit('delCourse', id)
    }
  }
}
</script>