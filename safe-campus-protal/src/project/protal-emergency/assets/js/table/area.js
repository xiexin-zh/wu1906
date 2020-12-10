import $tools from '@u/tools'
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '8%'
  },
  {
    title: '区域名称',
    dataIndex: 'areaName',
    width: '30%'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '30%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '操作',
    width: '30%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default columns
