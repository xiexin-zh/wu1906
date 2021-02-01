import { getDataSet } from '@u/libs/data-state'
const searchLabel = [
  {
    list: getDataSet('placeType'),
    value: 'category',
    type: 'select',
    label: '场地类型'
  }
]

export default searchLabel
