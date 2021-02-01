import { getDataSet } from '@u/libs/data-state'
const placeFormData = [
  {
    value: 'placeName',
    initValue: '',
    type: 'input',
    label: '场地名称',
    max: 10,
    placeholder: '请输入场地名称(限10字内)'
  },
  {
    value: 'category',
    initValue: [],
    list: getDataSet('placeType'),
    type: 'select',
    label: '场地类型',
    placeholder: '请选择场地类型'
  }
]
const floorFormData = [
  {
    value: 'floorNum',
    initValue: '',
    type: 'numberInput',
    label: '楼层数量',
    min: 1,
    max: 999,
    placeholder: '请输入楼层数量(1-999)',
    isInt: true
  }
]
const roomFormData = [
  {
    value: 'floorNum',
    initValue: '',
    type: 'numberInput',
    label: '房间数量',
    min: 1,
    max: 999,
    placeholder: '请输入房间数量(1-999)',
    isInt: true
  }
]
const editRoomFormData = [
  {
    value: 'placeName',
    initValue: '',
    type: 'numberInput',
    label: '房间号',
    min: 1,
    max: 99999,
    placeholder: '请输入房间号(1-999)',
    isInt: true
  }
]

export default {
  placeFormData,
  floorFormData,
  roomFormData,
  editRoomFormData
}
