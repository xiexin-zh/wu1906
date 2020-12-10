const teacherOperate = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '时间',
    dataIndex: 'optTime',
    width: '22%',
    customRender: (text) => {
      if (text) {
        const d = new Date(text)
        return d.getFullYear() + '-' +
               ((d.getMonth() + 1) > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) + '-' +
               (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
               ' ' +
               (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
               ':' +
               (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()) +
               ':' +
               (d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds())
      }
    }
  },
  {
    title: '操作类型',
    dataIndex: 'type',
    width: '12%'
  },
  {
    title: '原状态',
    dataIndex: 'oldState',
    width: '10%',
    customRender: (text) => {
      if (text === 1) {
        return '迟到'
      } else if (text === 2) {
        return '早退'
      } else if (text === 3 || text === 6) {
        return '缺卡'
      } else if (text === 4) {
        return '请假'
      } else if (text === 5) {
        return '正常'
      } else if (text === 7) {
        return '缺勤'
      }
    }
  },
  {
    title: '更改后状态',
    dataIndex: 'newState',
    width: '15%',
    customRender: (text) => {
      if (text === 1) {
        return '迟到'
      } else if (text === 2) {
        return '早退'
      } else if (text === 3 || text === 6) {
        return '缺卡'
      } else if (text === 4) {
        return '请假'
      } else if (text === 5) {
        return '正常'
      } else if (text === 7) {
        return '缺勤'
      }
    }
  },
  {
    title: '操作人',
    dataIndex: 'optName',
    width: '10%'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '22%'
  }
]
export default teacherOperate
