import { getDataState } from '@u/libs/data-state'
import $tools from '@u/libs/tools'
const columns = [{
  title: '序号',
  width: '10%',
  scopedSlots: {
    customRender: 'index'
  }
},
{
  title: '姓名',
  dataIndex: 'parentName',
  width: '10%'
},
{
  title: '手机号',
  dataIndex: 'parentMobile',
  width: '20%'
},
{
  title: '关系',
  dataIndex: 'relationship',
  width: '10%',
  customRender: (text) => {
    return getDataState('parentType', text)
  }
},
{
  title: '注册时间',
  dataIndex: 'createTime',
  width: '20%',
  customRender: (text) => {
    return $tools.getDate(text)
  }
},
{
  slots: { title: 'customTitle' },
  dataIndex: 'hasMainParent',
  width: '15%',
  scopedSlots: {
    customRender: 'slotTwo'
  }
},
{
  title: '操作',
  width: '15%',
  scopedSlots: {
    customRender: 'actions'
  }
}]

export default columns
