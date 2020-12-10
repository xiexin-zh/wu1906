import Tools from '@u/tools'
const highDetail = {
  columns: [
    {
      title: '序号',
      width: '10%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '学生姓名',
      dataIndex: 'userName',
      width: '10%'
    },
    {
      title: '学号',
      dataIndex: 'workNo',
      width: '10%'
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: '10%',
      customRender: text => {
        return Tools.getSex(text)
      }
    },
    {
      title: '入学年份',
      dataIndex: 'admissionTime',
      width: '15%',
      customRender: text => {
        return new Date(text).getFullYear()
      }
    },
    {
      title: '走住读',
      dataIndex: 'hasDorm',
      width: '10%',
      customRender: (text) => {
        switch (parseInt(text)) {
          case 1:
            return '住读'
          case 0:
            return '走读'
        }
      }
    },
    {
      title: '照片',
      dataIndex: 'photoUrl',
      width: '10%',
      scopedSlots: {
        customRender: 'photoPic'
      }
    },
    {
      title: '加入班级时间',
      dataIndex: 'createTime',
      width: '15%',
      customRender: text => {
        return Tools.getDate(text)
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
      value: 'keyword',
      type: 'input',
      label: '姓名/学号',
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
          val: '住读'
        },
        {
          key: 0,
          val: '走读'
        }
      ],
      value: 'hasDorm',
      type: 'select',
      label: '走住读'
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: 1,
          val: '有照片'
        },
        {
          key: 0,
          val: '无照片'
        }
      ],
      value: 'hasPhoto',
      type: 'select',
      label: '照片'
    }
  ],
  formData: [
    {
      value1: 'gradeCode',
      value2: 'subject',
      value3: 'class',
      initValue1: [],
      initValue2: [],
      initValue3: [],
      type: 'threeLinkSelect',
      required: false,
      label: '班级',
      placeholder1: '请选择年级',
      placeholder2: '请选择专业',
      placeholder3: '请选择班级',
      firstList: [],
      secondList: [],
      threeList: []
    }
  ]
}
export default highDetail
