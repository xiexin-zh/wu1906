import { getDataSet, getDataState } from '@u/libs/data-state'
import $tools from '@u/libs/tools'
export const doorRecordSearchLabel = [
  {
    value: 'keyword',
    initValue: '',
    type: 'selectInput',
    selectType: [
      {
        key: 'userName',
        val: '姓名'
      },
      {
        key: 'mobile',
        val: '手机号'
      }
    ],
    placeholder: '请输入'
  },
  {
    list: getDataSet('userType'),
    value: 'userType',
    type: 'select',
    label: '人员类型'
  },
  {
    list: getDataSet('accessType'),
    value: 'accessType',
    type: 'select',
    label: '出入类型'
  },
  {
    value: 'placeName',
    type: 'input',
    label: '出入地点',
    placeholder: '请输入出入地点'
  },
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '出入时间'
  }
]
export const doorRecordColumns = [
  {
    title: '序号',
    width: '5%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: '5%',
    customRender: text => getDataState('sex', text)
  },
  {
    title: '人员类型',
    dataIndex: 'userType',
    width: '10%',
    customRender: text => {
      let arr = text.split(',')
      arr = arr.map(el => {
        return getDataState('userType', el)
      })
      return arr.join(',')
    }
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '10%'
  },
  {
    title: '体温（℃）',
    dataIndex: 'temperature',
    width: '10%'
  },
  {
    title: '出入地点',
    dataIndex: 'accessPlace',
    width: '10%'
  },
  {
    title: '出入类型',
    width: '10%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '出入时间',
    dataIndex: 'accessTime',
    width: '10%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '底照',
    dataIndex: 'userPhoto',
    width: '10%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '抓拍照',
    dataIndex: 'snapPhoto',
    width: '10%',
    scopedSlots: {
      customRender: 'snapPic'
    }
  }
]
