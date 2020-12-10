import $tools from '@u/tools'
const plan = {
  columns: [
    {
      title: '序号',
      scopedSlots: {
        customRender: 'index'
      },
      width: '8%'
    },
    {
      title: '预案名称',
      width: '15%',
      scopedSlots: {
        customRender: 'other1'
      }
    },
    {
      title: '预案类型',
      dataIndex: 'type',
      width: '15%',
      customRender: text => {
        if (text === '01') {
          return '地震应急预案'
        } else if (text === '02') {
          return '火灾应急预案'
        } else if (text === '03') {
          return '传染病应急预案'
        } else if (text === '04') {
          return '食物中毒应急预案'
        } else if (text === '05') {
          return '校园踩踏应急预案'
        } else if (text === '06') {
          return '防恐防暴应急预案'
        } else if (text === '07') {
          return '极端天气应急预案'
        } else if (text === '08') {
          return '突发事件应急预案'
        } else if (text === '09') {
          return '防汛应急预案'
        } else if (text === '10') {
          return '其他预案'
        } else {
          return ''
        }
      }
    },
    {
      title: '预案级别',
      dataIndex: 'level',
      width: '15%',
      customRender: text => {
        if (text === '1') {
          return '一般级别'
        } else if (text === '2') {
          return '较紧急级别'
        } else if (text === '3') {
          return '非常紧急级别'
        } else if (text === '4') {
          return '特别紧急级别'
        } else {
          return ''
        }
      }
    },
    {
      title: '广播模式',
      dataIndex: 'radioMode',
      width: '15%',
      customRender: text => {
        if (text === '1') {
          return '自动播放'
        } else if (text === '2') {
          return '手动播放'
        } else {
          return ''
        }
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '15%',
      customRender: text => {
        return $tools.getDate(text, 6)
      }
    },
    {
      title: '操作',
      width: '18%',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ],
  searchLabel: [
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: '1',
          val: '地震应急预案'
        },
        {
          key: '2',
          val: '火灾应急预案'
        },
        {
          key: '3',
          val: '传染病应急预案'
        },
        {
          key: '4',
          val: '食物中毒应急预案'
        },
        {
          key: '5',
          val: '校园踩踏应急预案'
        },
        {
          key: '6',
          val: '防恐防暴应急预案'
        },
        {
          key: '7',
          val: '极端天气应急预案'
        },
        {
          key: '8',
          val: '突发事件应急预案'
        },
        {
          key: '9',
          val: '其他预案'
        },
        {
          key: '10',
          val: '突发事件应急预案'
        }
      ],
      value: 'type',
      type: 'select',
      label: '预案类型'
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: '1',
          val: '一般级别'
        },
        {
          key: '2',
          val: '较紧急级别'
        },
        {
          key: '3',
          val: '非常紧急级别'
        },
        {
          key: '4',
          val: '特别紧急级别'
        }
      ],
      value: 'level',
      type: 'select',
      label: '预案级别'
    },
    {
      value: 'name',
      type: 'input',
      label: '预案名称',
      placeholder: '请输入'
    }
  ]
}
export default plan
