// import Tools from '@u/tools'
const burDetail = {
  tabList: [
    {
      key: '1',
      title: 'PC应用'
    },
    {
      key: '2',
      title: '下属机构'
    },
    {
      key: '3',
      title: '管理员'
    }
  ],
  columns: [
    {
      title: '序号',
      width: '10%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '学校名称',
      dataIndex: 'schoolName',
      width: '15%'
    },
    {
      title: '学校编码',
      width: '15%',
      dataIndex: 'schoolCode'
    },
    {
      title: '办学层次',
      width: '15%',
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
      title: '学校类型',
      width: '15%',
      dataIndex: 'userName12'
    },
    {
      title: '地区',
      width: '15%',
      dataIndex: 'detailAddress'
    },
    {
      title: '地址',
      width: '15%',
      dataIndex: 'adminMobile'
    }
  ],
  userColumns: [
    {
      title: '姓名',
      dataIndex: 'userName',
      width: '33%'
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: '33%'
    },
    {
      title: '注册日期',
      dataIndex: 'registeDate',
      width: '33%',
      customRender: text => {
        return (
          new Date(text).getFullYear() +
          '-' +
          (new Date(text).getMonth() + 1 > 9 ? new Date(text).getMonth() + 1 : '0' + (new Date(text).getMonth() + 1)) +
          '-' +
          (new Date(text).getDate() > 9 ? new Date(text).getDate() : '0' + new Date(text).getDate())
        )
      }
    }
  ],
  formData: [
    {
      value: 'userName',
      initValue: '',
      type: 'input',
      label: '姓名',
      placeholder: '请输入姓名'
    },
    {
      value: 'mobile',
      initValue: '',
      type: 'input',
      label: '手机号',
      placeholder: '请输入手机号',
      regular: 'phone'
    }
  ],
  search: [
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
      label: '办学层次'
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
      value: 'status2',
      type: 'select',
      label: '学校类型'
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
      value: 'status1',
      type: 'select',
      label: '地区'
    }
  ]
}
export default burDetail
