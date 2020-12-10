const set = {
  columns: [
    {
      title: '工作日',
      align: 'center',
      dataIndex: 'weekDay'
    },
    {
      title: '考勤时间',
      align: 'center',
      scopedSlots: {
        customRender: 'action'
      }
    },
    {
      title: '操作',
      align: 'center',
      scopedSlots: {
        customRender: 'other1'
      }
    }
  ],
  deviceColumns: [
    {
      title: '序号',
      width: '10%',
      scopedSlots: {
        customRender: 'index'
      },
      align: 'center'
    },
    {
      title: '安装位置',
      dataIndex: 'snapSite',
      width: '20%',
      align: 'center'
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      width: '20%',
      align: 'center'
    },
    {
      title: '设备SN码',
      dataIndex: 'deviceSn',
      width: '20%',
      align: 'center'
    },
    {
      title: '设备类型',
      dataIndex: 'deviceType',
      width: '15%',
      customRender: text => {
        return parseInt(text) === 1 ? '网络相机' : parseInt(text) === 2 ? '面板机' : '班牌'
      },
      align: 'center'
    },
    {
      title: '控制类型',
      dataIndex: 'inOrOut',
      width: '15%',
      align: 'center',
      customRender: text => {
        return parseInt(text) === 1 ? '进' : parseInt(text) === 2 ? '出' : '无'
      }
    },
    {
      title: '操作',
      width: '25%',
      align: 'center',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ],
  stuDeviceColumns: [
    {
      title: '序号',
      width: '10%',
      scopedSlots: {
        customRender: 'index'
      },
      align: 'center'
    },
    {
      title: '安装位置',
      dataIndex: 'snapSite',
      width: '20%',
      align: 'center'
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      width: '20%',
      align: 'center'
    },
    {
      title: '设备SN码',
      dataIndex: 'deviceSn',
      width: '20%',
      align: 'center'
    },
    {
      title: '设备类型',
      dataIndex: 'deviceType',
      width: '10%',
      customRender: text => {
        return parseInt(text) === 1 ? '网络相机' : parseInt(text) === 2 ? '面板机' : '班牌'
      },
      align: 'center'
    },
    {
      title: '控制类型',
      dataIndex: 'inOrOut',
      width: '10%',
      align: 'center',
      customRender: text => {
        return parseInt(text) === 1 ? '进' : parseInt(text) === 2 ? '出' : '无'
      }
    },
    {
      title: '用途',
      dataIndex: 'id',
      width: '10%',
      scopedSlots: {
        customRender: 'action'
      },
      align: 'center'
    }
  ],
  specialColumns: [
    {
      title: '日期',
      align: 'center',
      dataIndex: 'current'
    },
    {
      title: '考勤时间',
      align: 'center',
      scopedSlots: {
        customRender: 'action'
      }
    },
    {
      title: '操作',
      align: 'center',
      scopedSlots: {
        customRender: 'other1'
      }
    }
  ]
}
export default set
