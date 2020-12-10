<template>
  <table-list
    :minHeight="tableList.length > 0 ? 250 : 200"
    :scrollH="tableList.length > 0 ? 160 : 0"
    isBorder
    :table-list="tableList"
    :columns="columns"
  >
    <template v-slot:actions="action">
      <a-tooltip placement="topLeft" title="编辑">
        <a-button
          size="small"
          class="edit-action-btn"
          icon="form"
          @click.stop="setCourse(action.record.id, action.record)"
        ></a-button>
      </a-tooltip>
      <a-popconfirm
        placement="left"
        okText="确定"
        cancelText="取消"
        @confirm="deleteIndexTwo(action.record.id)"
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
    title: '序号',
    width: '5%',
    align: 'center',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '二级指标',
    dataIndex: 'name',
    key: 'name',
    width: '10%',
    align: 'center'
  },
  {
    title: '评审标准',
    dataIndex: 'remark',
    key: 'remark'
  },
  {
    title: '分值',
    dataIndex: 'score',
    key: 'score',
    width: '5%',
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
  mounted() {},
  methods: {
    setCourse(id, record) {
      this.$emit('courseSet', this.courseType, id, record)
    },
    deleteIndexTwo(id) {
      this.$emit('deleteIndexTwo', id)
    }
  }
}
</script>