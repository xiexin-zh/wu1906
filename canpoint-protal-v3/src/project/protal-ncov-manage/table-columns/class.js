import { getDataState } from '@u/libs/data-state'
const columns = {
  class: [
    {
      title: '序号',
      width: '10%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '班次名称',
      dataIndex: 'orderName',
      width: '25%'
    },
    {
      title: '查寝时间',
      width: '45%',
      scopedSlots: {
        customRender: 'slotOne'
      }
    },
    {
      title: '操作',
      width: '20%',
      scopedSlots: {
        customRender: 'actions'
      }
    }
  ],
  time: [
    {
      title: '查寝计划',
      width: '15%',
      dataIndex: 'planName',
      customRender: (value, row, index) => {
        const obj = {
          children: value,
          attrs: {}
        }
        if (index === 1) {
          obj.attrs.rowSpan = 2
        }
        if (index === 2) {
          obj.attrs.rowSpan = 0
        }
        if (index === 4) {
          obj.attrs.colSpan = 0
        }
        return obj
      }
    },
    {
      title: '查寝时段',
      dataIndex: 'realSegment',
      width: '15%'
    },
    {
      title: '查寝时间范围',
      width: '40%',
      scopedSlots: {
        customRender: 'slotOne'
      }
    },
    {
      title: '查寝类型',
      width: '15%',
      dataIndex: 'checkType',
      customRender: (text) => {
        return `${getDataState('checkType', text)}宿舍`
      }
    },
    {
      title: '是否启用',
      width: '15%',
      scopedSlots: {
        customRender: 'slotTwo'
      }
    }
  ]
}

export default columns
