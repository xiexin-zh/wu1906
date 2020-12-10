import Tools from '@u/tools'
const faceRecordColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '5%'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '5%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: '5%',
    customRender: text => {
      return Tools.getSex(text)
    }
  },
  {
    title: '人员类型',
    dataIndex: 'personType',
    width: '8%',
    customRender: text => {
      return Tools.getPersonType(text)
    }
  },
  {
    title: '进出标识',
    dataIndex: 'inOrOut',
    width: '8%',
    customRender: text => {
      return Tools.inOrOut(text)
    }
  },
  {
    title: '记录类型',
    dataIndex: 'recordType',
    width: '8%',
    customRender: text => {
      if (parseInt(text) === 1) {
        return '识别服务'
      } else {
        return '面板机'
      }
    }
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '18%'
  },
  {
    title: 'IP地址',
    dataIndex: 'ipAddress',
    width: '8%'
  },
  {
    title: '抓拍位置',
    dataIndex: 'snapSite',
    width: '8%'
  },
  {
    title: '通过时间',
    dataIndex: 'recordTime',
    width: '8%',
    customRender: text => {
      return Tools.getDate(text)
    }
  },
  {
    title: '底库照片',
    dataIndex: 'photoSrc',
    width: '8%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '抓拍照片',
    dataIndex: 'snapSrc',
    width: '8%',
    scopedSlots: {
      customRender: 'snapPic'
    }
  }
]
export default faceRecordColumns
