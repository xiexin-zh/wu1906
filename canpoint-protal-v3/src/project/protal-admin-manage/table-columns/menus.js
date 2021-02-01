import $tools from '@u/libs/tools'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    width: '10%'
  },
  {
    title: '菜单路径',
    dataIndex: 'menuUrl',
    width: '20%'
  },
  {
    title: 'logo',
    dataIndex: 'menuIcon',
    width: '10%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '创建日期',
    dataIndex: 'createTime',
    width: '10%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '10%'
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]

export default columns
