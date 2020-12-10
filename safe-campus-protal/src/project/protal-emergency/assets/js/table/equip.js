import $tools from '@u/tools'
const equip = {
  columns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'index'
      },
      width: '8%'
    },
    {
      title: '器材名称',
      dataIndex: 'name',
      width: '15%'
    },
    {
      title: '器材数量',
      dataIndex: 'amount',
      width: '12%'
    },
    {
      title: '存放位置',
      dataIndex: 'address',
      width: '15%'
    },
    {
      title: '器材现状',
      dataIndex: 'state',
      width: '15%',
      customRender: text => {
        if (text === '1') {
          return '全新'
        } else if (text === '2') {
          return '完好'
        } else if (text === '3') {
          return '已损坏'
        } else if (text === '4') {
          return '已报废'
        } else {
          return ''
        }
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
      width: '15%',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ],
  searchLabel: [
    {
      value: 'name',
      type: 'input',
      label: '器材名称',
      placeholder: '请输入'
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: '1',
          val: '全新'
        },
        {
          key: '2',
          val: '完好'
        },
        {
          key: '3',
          val: '已损坏'
        },
        {
          key: '4',
          val: '已报废'
        }
      ],
      value: 'state',
      type: 'select',
      label: '器材现状'
    }
  ]
}
export default equip
