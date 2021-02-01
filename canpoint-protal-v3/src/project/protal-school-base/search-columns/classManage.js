const searchLabel = [
  {
    value: 'headTeacherName',
    type: 'input',
    label: '班主任姓名',
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
    value: 'hasHeadTeacher',
    type: 'select',
    label: '班主任'
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
    value: 'hasClassroom',
    type: 'select',
    label: '教室'
  }
]

export default searchLabel
