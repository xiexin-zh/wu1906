import Tools from '@u/tools'
const subsidyColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '8%'
  },
  {
    title: '补助名称',
    dataIndex: 'subsidyName',
    width: '10%'
  },
  {
    title: '补助对象',
    dataIndex: 'userType',
    width: '10%',
    customRender: text => {
      const num = parseInt(text)
      if (num === 1) {
        return '学生'
      } else if (num === 2) {
        return '教职工'
      }
    }
  },
  {
    title: '发放人数',
    dataIndex: 'grantNumber',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '状态',
    dataIndex: 'grantStatus',
    width: '10%'
  },
  {
    title: '每人发放金额',
    dataIndex: 'grantBalance',
    width: '10%'
  },
  {
    title: '总发放金额',
    dataIndex: 'grantTotalBalance',
    width: '10%'
  },
  {
    title: '发放时间',
    dataIndex: 'grantTime',
    width: '10%',
    customRender: text => {
      return text ? Tools.getDate(text) : '--'
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '10%',
    customRender: text => {
      return Tools.getDate(text)
    }
  },
  {
    title: '操作',
    key: 'action',
    width: '12%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default subsidyColumns
