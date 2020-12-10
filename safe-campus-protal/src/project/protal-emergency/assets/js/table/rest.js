import $tools from '@u/tools'
const rest = {
  columns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'index'
      },
      width: '8%'
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      width: '15%'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: '18%'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '18%',
      customRender: text => {
        return $tools.getDate(text)
      }
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: '18%',
      scopedSlots: {
        customRender: 'other1'
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
  formData: [
    {
      value: 'name',
      initValue: '',
      type: 'input',
      max: 20,
      label: '分类名称',
      placeholder: '请输入分类名称'
    },
    {
      value: 'remark',
      initValue: '',
      type: 'textarea',
      label: '备注',
      max: 200,
      minRows: 5,
      maxRows: 10,
      placeholder: '请输入备注, 不超过200个字符',
      required: false
    }
  ]
}
export default rest
