const levelFormData = [
  {
    value: 'menuName',
    initValue: '',
    type: 'input', // numberInput: 纯数字文本框
    label: '菜单名称',
    placeholder: '请输入菜单分类名称，最大长度为8个字符'
  }
]
const menuFormData = [
  {
    value: 'menuName',
    initValue: '',
    type: 'input', // numberInput: 纯数字文本框
    label: '菜单名称',
    placeholder: '请输入菜单分类名称，最大长度为8个字符'
  },
  {
    value: 'menuUrl',
    initValue: '',
    type: 'input', // numberInput: 纯数字文本框
    label: '菜单路径',
    max: 300,
    placeholder: '请输入菜单路径'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'input', // numberInput: 纯数字文本框
    label: '备注',
    required: false,
    max: 20, // 最大长度
    placeholder: '请输入备注'
  }
]
const appmenuFormData = [
  {
    value: 'menuName',
    initValue: '',
    type: 'input', // numberInput: 纯数字文本框
    label: '菜单名称',
    placeholder: '请输入菜单分类名称，最大长度为8个字符'
  },
  {
    value: 'menuUrl',
    initValue: '',
    type: 'input', // numberInput: 纯数字文本框
    label: '菜单路径',
    max: 300,
    placeholder: '请输入菜单路径'
  },
  {
    value: 'photoUrl',
    initValue: [],
    label: '菜单Logo',
    type: 'uploadImg',
    length: 1,
    required: true
  },
  {
    value: 'remark',
    initValue: '',
    type: 'input', // numberInput: 纯数字文本框
    label: '备注',
    required: false,
    max: 20, // 最大长度
    placeholder: '请输入备注'
  }
]

export default {
  levelFormData,
  menuFormData,
  appmenuFormData
}
