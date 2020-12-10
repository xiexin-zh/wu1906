const highClass = {
  columns: [
    {
      title: '序号',
      width: '8%',
      scopedSlots: {
        customRender: 'index'
      }
    },
    {
      title: '年级',
      dataIndex: 'gradeName',
      width: '12%',
      customRender: text => {
        return text + '级'
      }
    },
    {
      title: '专业',
      dataIndex: 'subjectName',
      width: '15%'
    },
    {
      title: '班级',
      dataIndex: 'className',
      width: '12%'
    },
    {
      title: '辅导员',
      dataIndex: 'teacherName',
      width: '15%',
      scopedSlots: { customRender: 'editClassTeacher' }
    },
    {
      title: '教室',
      dataIndex: 'placeName',
      width: '15%',
      scopedSlots: { customRender: 'editClassRoom' }
    },
    {
      title: '班级学生',
      width: '10%',
      scopedSlots: {
        customRender: 'totalNum1'
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
      value: 'teacherName',
      type: 'input',
      label: '辅导员姓名',
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
          val: '已绑定'
        },
        {
          key: '0',
          val: '未绑定'
        }
      ],
      value: 'hasTeacher',
      type: 'select',
      label: '辅导员'
    },
    {
      list: [
        {
          key: '',
          val: '全部'
        },
        {
          key: '1',
          val: '已绑定'
        },
        {
          key: '0',
          val: '未绑定'
        }
      ],
      value: 'hasPlace',
      type: 'select',
      label: '教室'
    }
  ],
  formData: [
    {
      value: 'gradeCode',
      list: [],
      type: 'select',
      label: '年级',
      placeholder: '请选择年级'
    },
    {
      value: 'subjectCode',
      list: [],
      type: 'select',
      label: '专业',
      placeholder: '请选择专业'
    },
    {
      value: 'className',
      initValue: '',
      type: 'input',
      label: '班级',
      placeholder: '建议输入:X班'
    },
    {
      value: 'remark',
      initValue: '',
      type: 'input',
      label: '备注',
      required: false,
      max: 100,
      placeholder: '限100字'
    }
  ],
  formDatas: [
    {
      value: 'gradeCode',
      list: [],
      type: 'select',
      label: '年级',
      placeholder: '请选择年级'
    },
    {
      value: 'subjectCode',
      list: [],
      type: 'select',
      label: '专业',
      placeholder: '请选择专业'
    },
    {
      value: 'count',
      initValue: '',
      type: 'number',
      label: '班级数量',
      placeholder: '请输入',
      min: 1,
      max: 100
    },
    {
      value: 'startSeq',
      initValue: '',
      type: 'number',
      label: '起始序号',
      placeholder: '请输入',
      min: 1,
      max: 100
    }
  ],
  roomData: [
    {
      value: 'placeName',
      initValue: [],
      type: 'siteChoose',
      label: '班级教室',
      placeholder: '请选择'
    }
  ]
}
export default highClass
