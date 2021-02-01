// import Tools from '@u/tools'
const institution = {
  search: [
    {
      value: 'schoolName',
      type: 'input',
      label: '机构名称',
      placeholder: '请输入'
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: 1,
          val: '开启'
        },
        {
          key: 2,
          val: '关闭'
        }
      ],
      value: 'schoolStage',
      type: 'select',
      label: '机构级别'
    }
  ],
  columns: [
    {
      title: '序号',
      width: '8%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '机构名称',
      dataIndex: 'schoolName',
      width: '12%'
    },
    {
      title: '机构编码',
      width: '12%',
      dataIndex: 'schoolCode'
    },
    {
      title: '机构级别',
      width: '12%',
      dataIndex: 'schoolStage'
      // customRender: text => {
      //   const arr = text.split(',')
      //   const newArr = []
      //   for (let i = 0; i < arr.length; i++) {
      //     if (arr[i] === '01') {
      //       newArr.push('小学')
      //     } else if (arr[i] === '02') {
      //       newArr.push('初中')
      //     } else if (arr[i] === '03') {
      //       newArr.push('高中')
      //     } else if (arr[i] === '00') {
      //       newArr.push('幼儿园')
      //     } else if (arr[i] === '04') {
      //       newArr.push('高校')
      //     } else if (arr[i] === '05') {
      //       newArr.push('中职')
      //     }
      //   }
      //   return newArr.join(',')
      // }
    },
    {
      title: '地区',
      width: '18%',
      dataIndex: 'detailAddress'
    },
    {
      title: '地址',
      width: '18%',
      dataIndex: 'adminMobile'
    },
    {
      title: '操作',
      width: '20%',
      scopedSlots: {
        customRender: 'actions'
      }
    }
  ],
  formData: [
    {
      value: 'userName',
      initValue: '',
      type: 'input',
      label: '机构名称',
      max: 30,
      placeholder: '请输入机构名称'
    },
    {
      value: 'userName1',
      initValue: '',
      type: 'input',
      label: '机构编码',
      max: 30,
      placeholder: '请输入机构编码'
    },
    {
      value: 'sex',
      initValue: [],
      list: [
        {
          key: 1,
          val: '省级'
        },
        {
          key: 2,
          val: '市级'
        },
        {
          key: 3,
          val: '区/县级'
        }
      ],
      type: 'select',
      label: '机构级别',
      placeholder: '请选择机构级别'
    },
    {
      type: 'slotOne',
      label: '地区'
    },
    {
      value: 'userName12',
      initValue: '',
      type: 'input',
      required: false,
      label: '详细地址',
      max: 200,
      placeholder: '请输入详细地址'
    },
    {
      value: 'userName333',
      initValue: '',
      type: 'textarea',
      label: '备注',
      required: false,
      max: 200,
      placeholder: '请输入备注'
    }
  ]
}
export default institution
