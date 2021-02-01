const searchColumns = {
  apply: [
    {
      value: 'appName',
      type: 'input',
      label: '应用名称',
      placeholder: '请输入'
    }
  ],
  school: [
    {
      value: 'schoolName',
      type: 'input',
      label: '学校名称',
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
          val: '幼儿园'
        },
        {
          key: '2',
          val: '小学'
        },
        {
          key: '3',
          val: '初中'
        },
        {
          key: '4',
          val: '高中'
        },
        {
          key: '5',
          val: '中职'
        },
        {
          key: '6',
          val: '高校'
        }
      ],
      value: 'sectionType',
      type: 'select',
      label: '办学层次'
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: '1',
          val: '幼儿园'
        },
        {
          key: '2',
          val: '小学'
        },
        {
          key: '3',
          val: '初中'
        },
        {
          key: '4',
          val: '高中'
        },
        {
          key: '5',
          val: '九年制'
        },
        {
          key: '6',
          val: '十二年制'
        },
        {
          key: '7',
          val: '完全中学'
        },
        {
          key: '8',
          val: '中职'
        },
        {
          key: '9',
          val: '高校'
        }
      ],
      value: 'schoolType',
      type: 'select',
      label: '学校类型'
    },
    {
      value: 'areaList',
      type: 'area',
      label: '地区'
    }
  ],
  edu: [
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
          key: '1',
          val: '省级'
        },
        {
          key: '2',
          val: '市级'
        },
        {
          key: '3',
          val: '区/县级'
        }
      ],
      value: 'level',
      type: 'select',
      label: '机构级别'
    },
    {
      value: 'areaList',
      type: 'area',
      label: '地区',
      placeholder: '请选择'
    }
  ],
  subEdu: [
    {
      value: 'schoolName',
      type: 'input',
      label: '机构名称',
      placeholder: '请输入'
    },
    {
      value: 'areaList',
      type: 'area',
      label: '地区',
      placeholder: '请选择'
    }
  ]
}
export default searchColumns
