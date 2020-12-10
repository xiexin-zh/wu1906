import $tools from '@u/tools'
const route = {
  columns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'index'
      },
      width: '8%'
    },
    {
      title: '标题',
      dataIndex: 'name',
      width: '30%'
    },
    {
      title: '疏散路线图',
      dataIndex: 'photoUrl',
      width: '20%',
      scopedSlots: {
        customRender: 'photoPic'
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '20%',
      customRender: text => {
        return $tools.getDate(text, 6)
      }
    },
    {
      title: '操作',
      width: '20%',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ],
  searchLabel: [
    {
      value: 'name',
      type: 'input',
      label: '标题',
      placeholder: '请输入'
    }
  ]
}
export default route
