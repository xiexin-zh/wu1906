// 添加宿舍楼栋
export const buildFormData = [
  {
    value: 'name',
    initValue: '',
    type: 'input',
    label: '楼栋名称',
    placeholder: '请输入楼栋名称'
  },
  {
    value: 'floorNum',
    initValue: '',
    type: 'numberInput',
    label: '楼层数量',
    min: 1,
    max: 99,
    placeholder: '请输入楼层数量(1-99)',
    isInt: true
  },
  {
    value: 'roomNum',
    initValue: '',
    type: 'numberInput',
    label: '每层房间数量',
    min: 1,
    max: 99,
    placeholder: '请输入每层房间数量(1-99)',
    isInt: true
  },
  {
    value: 'bedNum',
    initValue: '',
    type: 'numberInput',
    label: '每间床位数量',
    min: 1,
    max: 20,
    placeholder: '请输入每间床位数量(1-20)',
    isInt: true
  },
  {
    value: 'roomPrefix',
    initValue: '',
    type: 'input',
    label: '房间前缀',
    placeholder: '请输入房间前缀',
    required: false
  }
]
// 添加宿舍房间
export const roomFormData = [
  {
    value: 'roomNum',
    initValue: '',
    type: 'numberInput',
    label: '房间数量',
    min: 1,
    max: 99,
    placeholder: '请输入房间数量(1-99)',
    isInt: true
  },
  {
    value: 'bedNum',
    initValue: '',
    type: 'numberInput',
    label: '每间床位数量',
    min: 1,
    max: 20,
    placeholder: '请输入每间床位数量(1-20)',
    isInt: true
  },
  {
    value: 'roomPrefix',
    initValue: '',
    type: 'input',
    label: '房间前缀',
    placeholder: '请输入房间前缀',
    required: false
  }
]
// 编辑宿舍房间
export const editRoomFormData = [
  {
    value: 'name',
    initValue: '',
    type: 'input',
    label: '房间名称',
    placeholder: '请输入房间名称'
  },
  {
    value: 'bedNum',
    initValue: '',
    type: 'numberInput',
    label: '床位数量',
    min: 1,
    max: 20,
    placeholder: '请输入床位数量(1-20)',
    isInt: true
  }
]
// 实时查寝补卡
export const checkFormData = [
  {
    value: 'repairCardTime',
    type: 'singleTime',
    label: '归寝时间',
    initValue: '',
    placeholder: '归寝时间'
  }
]
