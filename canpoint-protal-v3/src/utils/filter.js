/**
 * @des 注册全局过滤器
 */

import Vue from 'vue'

const filters = {
  // 获取表格索引
  pageIndex: (val, obj) => {
    if (JSON.stringify(obj) === '{}') {
      return val + 1
    } else {
      return (obj.page - 1) * obj.size + val + 1
    }
  },
  // 日期转化
  gmtToDate(date, type = 'dateTime') {
    if (!date) {
      return '--'
    }
    const d = new Date(date)
    const time =
      d.getFullYear() +
      '-' +
      (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
      '-' +
      (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
      ' ' +
      (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
      ':' +
      (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()) +
      ':' +
      (d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds())
    if (type === 'dateTime') {
      return time
    } else if (type === 'date') {
      return time.substring(0, 10)
    } else if (type === 'time') {
      return time.substring(11, 15)
    }
  },
  // 去掉秒时间
  getTimeString(time) {
    if (!time) {
      return '--'
    }
    return time.split(':')[0] + ':' + time.split(':')[1]
  },
  getDate: function(val, type) {
    if (val === '' || val === null) {
      return '--'
    }
    // 时间戳和gmt转日期
    const d = new Date(val)
    if (type === 1) {
      return (
        d.getFullYear() +
        '-' +
        (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
        '-' +
        (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
        ' ' +
        (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
        ':' +
        (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()) +
        ':' +
        (d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds())
      )
    } else if (type === 2) {
      return (
        d.getFullYear() +
        '-' +
        (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
        '-' +
        (d.getDate() > 9 ? d.getDate() : '0' + d.getDate())
      )
    } else if (type === 3) {
      return (
        (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
        ':' +
        (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes())
      )
    } else if (type === 4) {
      return (
        (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
        '-' +
        (d.getDate() > 9 ? d.getDate() : '0' + d.getDate())
      )
    } else if (type === 5) {
      return (
        d.getFullYear() +
        '-' +
        (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
        '-' +
        (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
        ' ' +
        (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
        ':' +
        (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes())
      )
    } else if (type === 6) {
      return (
        (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
        ':' +
        (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()) +
        ':' +
        (d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds())
      )
    }
  },
  getSiteCategory: val => {
    // 场地分类(100教室,101宿舍,102食堂,103出入口,104其他)
    if (val === 100) {
      return '教室'
    } else if (val === 101) {
      return '宿舍'
    } else if (val === 102) {
      return '食堂'
    } else if (val === 103) {
      return '出入口'
    } else if (val === 104 || '') {
      return '其他'
    }
  },
  getStudentStatus: val => {
    if (val === '1' || val === '4') {
      return '在读'
    } else if (val === '2') {
      return '休学'
    } else if (val === '3') {
      return '退学'
    }
  },
  getApprovalState: val => {
    if (val === '0') {
      return '待审批'
    } else if (val === '1') {
      return '审批通过'
    } else if (val === '2') {
      return '审批不通过'
    } else if (val === '3') {
      return '撤销'
    } else if (val === '4') {
      return '审批中'
    }
  },
  getWeekDay: val => {
    const week = parseInt(val)
    if (week === 2) {
      return '周一'
    } else if (week === 3) {
      return '周二'
    } else if (week === 4) {
      return '周三'
    } else if (week === 5) {
      return '周四'
    } else if (week === 6) {
      return '周五'
    } else if (week === 7) {
      return '周六'
    } else if (week === 1) {
      return '周日'
    }
  },
  getWeek: val => {
    const week = parseInt(val)
    if (week === 1) {
      return '周一'
    } else if (week === 2) {
      return '周二'
    } else if (week === 3) {
      return '周三'
    } else if (week === 4) {
      return '周四'
    } else if (week === 5) {
      return '周五'
    } else if (week === 6) {
      return '周六'
    } else if (week === 7) {
      return '周日'
    }
  },
  getWeeks: val => {
    val = val
      .map(el => {
        if (el === '1') {
          return '周日'
        } else if (el === '2') {
          return '周一'
        } else if (el === '3') {
          return '周二'
        } else if (el === '4') {
          return '周三'
        } else if (el === '5') {
          return '周四'
        } else if (el === '6') {
          return '周五'
        } else if (el === '7') {
          return '周六'
        }
      })
      .join(',')
    return val
  },
  onState: val => {
    const text = parseInt(val)
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
    } else {
      return '暂无'
    }
  },
  pState: val => {
    if (val === '0') {
      return '未开始'
    } else if (val === '1') {
      return '进行中'
    } else {
      return '已结束'
    }
  },
  getSex: val => {
    const text = parseInt(val)
    if (text === 1) {
      return '男'
    } else if (text === 2) {
      return '女'
    } else {
      return '未知'
    }
  },
  getDorm: val => {
    const text = parseInt(val)
    if (text === 0) {
      return '走读'
    } else if (text === 1) {
      return '住读'
    } else {
      return '未知'
    }
  },
  getJodStatus: val => {
    const text = parseInt(val)
    if (text === 0) {
      return '离职'
    } else if (text === 1) {
      return '在职'
    } else {
      return '未知'
    }
  },
  getSourceDanger: val => {
    const text = parseInt(val)
    if (parseInt(text) === 1) {
      return '隐患排查'
    } else if (parseInt(text) === 2) {
      return '日常巡查'
    } else if (parseInt(text) === 3) {
      return '专项检查'
    } else if (parseInt(text) === 4) {
      return '社会监督'
    }
  },
  getDangerLevel: val => {
    const text = parseInt(val)
    if (parseInt(text) === 4) {
      return '低风险'
    } else if (parseInt(text) === 3) {
      return '一般风险'
    } else if (parseInt(text) === 2) {
      return '较大风险'
    } else if (parseInt(text) === 1) {
      return '重大风险'
    }
  },
  getDangerState: val => {
    const text = parseInt(val)
    if (parseInt(text) === 1) {
      return '已上报'
    } else if (parseInt(text) === 2) {
      return '已指派'
    } else if (parseInt(text) === 3) {
      return '已处理'
    } else if (parseInt(text) === 4) {
      return '已验收'
    } else if (parseInt(text) === 5) {
      return '已撤销'
    }
  },
  // 任务状态
  taskStatus(text) {
    text = parseInt(text)
    if (text === 1) {
      return '未检查'
    } else if (text === 2) {
      return '检查待审核'
    } else if (text === 3) {
      return '小组已审核'
    } else if (text === 4) {
      return '督查完成'
    }
  },
  // 安全任务状态
  safetyTaskStatus(text) {
    text = parseInt(text)
    if (text === 1) {
      return '未完成'
    } else if (text === 2) {
      return '未完成'
    } else if (text === 3) {
      return '已完成'
    } else if (text === 4) {
      return '逾期填报'
    } else if (text === 5) {
      return '已打回未重报'
    } else if (text === 6) {
      return '已重报未提交'
    } else if (text === 7) {
      return '已重报已提交'
    } else if (text === 8) {
      return '已重报已补交'
    }
  },
  // 题目类型
  questionType(text) {
    text = parseInt(text)
    if (text === 1) {
      return '单选题'
    } else if (text === 2) {
      return '多选题'
    } else if (text === 3) {
      return '填空题'
    } else if (text === 4) {
      return '附件'
    }
  },
  getSimpleText: html => {
    var re1 = new RegExp(/<img.src\s=\s*(.?)[^>]?>/g)
    var msg = html.replace(re1, '')
    return msg
  },
  // 风险等级
  levelType(text) {
    text = parseInt(text)
    if (text === 1) {
      return 'Ⅰ级'
    } else if (text === 2) {
      return 'Ⅱ级'
    } else if (text === 3) {
      return 'Ⅲ级'
    } else if (text === 4) {
      return 'Ⅳ级'
    }
  },
  // 管控层级
  controlType(text) {
    text = parseInt(text)
    if (text === 1) {
      return '校级'
    } else if (text === 2) {
      return '副校级'
    } else if (text === 3) {
      return '处级（科级、科室级、处科级）'
    } else if (text === 4) {
      return '岗位责任人（责任人）'
    } else if (text === 5) {
      return '园级'
    } else if (text === 6) {
      return '副园级'
    }
  },
  majorState: val => {
    if (val === '1') {
      return '未开始'
    } else if (val === '2') {
      return '使用中'
    } else {
      return '已结束'
    }
  },
  dosizeformat(text) {
    text = Number(text)
    if (text < 1024) {
      return `${text}B`
    } else if (text < 1024 * 1024) {
      return `${parseInt(text / 1024)}K`
    } else if (text < 1024 * 1024 * 1024) {
      return `${parseInt(text / (1024 * 1024))}M`
    } else if (text < 1024 * 1024 * 1024 * 1024) {
      return `${parseInt(text / (1024 * 1024 * 1024))}G`
    }
  }
}

for (const key in filters) {
  Vue.filter(key, filters[key])
}
