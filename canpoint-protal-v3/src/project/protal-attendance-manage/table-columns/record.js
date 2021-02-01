import Tools from '@u/libs/tools'
const columns = [
  {
    title: '序号',
    width: '10%',
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
    dataIndex: 'sex',
    width: '10%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '部门',
    dataIndex: 'orgName',
    width: '15%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '15%'
  },
  {
    title: '外出时间',
    dataIndex: 'outTime',
    width: '15%',
    customRender: text => {
      if (!text) {
        return '未记录'
      } else {
        return Tools.getDate(text)
      }
    }
  },
  {
    title: '回归时间',
    dataIndex: 'returnTime',
    width: '15%',
    customRender: text => {
      if (!text) {
        return '未归'
      } else {
        return Tools.getDate(text)
      }
    }
  }
]
export default columns
