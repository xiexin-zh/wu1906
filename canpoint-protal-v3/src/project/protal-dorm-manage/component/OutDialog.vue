<template>
  <u-modal
    cancelText="关闭"
    :isOk="false"
    @confirm="confirm"
    :width="1000"
    v-if="status"
    :title="title"
    v-model="status"
    closable
  >
    <div style="height: 500px" class="u-fx">
      <u-table is-zoom :columns="tableColumn" :table-list="outList"></u-table>
    </div>
  </u-modal>
</template>

<script>
import $tools from '@u/libs/tools'
import { getDataState } from '@u/libs/data-state'
const tableColumn = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '学号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: '8%',
    customRender: text => {
      return getDataState('sex', text)
    }
  },
  {
    title: '班级',
    dataIndex: 'gradeName',
    width: '14%',
    customRender: (text, record) => {
      return record.gradeName + '' + record.className
    }
  },
  {
    title: '宿舍',
    dataIndex: 'roomName',
    width: '20%'
  },
  {
    title: '外出时间',
    dataIndex: 'updateTime',
    width: '15%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '抓怕照片',
    width: '15%',
    dataIndex: 'photoUrl',
    scopedSlots: {
      customRender: 'snapPic'
    }
  }
]
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    outList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      title: '',
      tag: true,
      tableColumn
    }
  },
  mounted() {
    this.title = `外出记录(${this.outList.length}人)`
  },
  methods: {
    confirm() {
      this.status = false
    }
  }
}
</script>
