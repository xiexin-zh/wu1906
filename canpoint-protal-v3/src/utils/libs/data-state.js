/* eslint-disable */
/**
 * @description 数据字典集合
 * @author 田程
 */
import visitor from './state/visitor'
import attendance from './state/attendance'
import door from './state/door'
const dataSet = {
  ...door,
  ...visitor,
  ...attendance,
  sex: { 1: '男', 2: '女', 3: '未知' }, // 性别
  hasJob: { 1: '在职', 0: '离职' }, // 在职离职
  eduLevel: { 1: '省级', 2: '市级', 3: '区/县级', '': '未知' }, // 机构级别
  personType: { 4: '老师', 16: '家长', 8: '学生', 32: '访客', '': '未知' },
  schoolType: {
    1: '幼儿园',
    2: '小学',
    3: '初中',
    4: '高中',
    5: '九年制',
    6: '十二年制',
    7: '完全中学',
    8: '中职',
    9: '高校'
  }, // 学校类型
  sectionType: { 1: '幼儿园', 2: '小学', 3: '初中', 4: '高中', 5: '中职', 6: '高校' }, //办学层次
  parentType: { 1: '爸爸', 2: '妈妈', 3: '爷爷', 4: '奶奶', 5: '其他' }, // 家长关系
  placeType: { 1: '教室', 2: '宿舍', 3: '食堂', 4: '出入口', 5: '其他' }, // 场地类型
  deviceType: { 1: '相机', 2: '面板机', 3: '班牌' }, // 设备类型
  hasDorm: { 1: '住读', 0: '走读' }, // 走住读类型
  hasPhoto: { 1: '是', 0: '否' }, // 是否有照片
  annualSystem: { 3: '三年制', 4: '四年制', 5: '五年制' }, // 年制
  checkType: { 1: '进', 2: '出', 3: '不分进出' }, // 查寝类型
  inOrOut: { 1: '进', 2: '出', 3: '未知' }, // 出入类型
  recordType: { 1: '抓拍', 2: '班牌签到', 4: '补卡' }, // 记录类型
  annualSystem: { 3: '三年制', 4: '四年制', 5: '五年制' }, // 年制
  checkType: { 1: '进', 2: '出', 3: '不分进出' }, // 查寝类型
  weekNum: { 1: '周天', 2: '周一', 3: '周二', 4: '周三', 5: '周四', 6: '周五', 7: '周六' }, // 星期
  // enableFever: { 1: '男', 2: '女', 3: '未知' }, // 是否发热
}

/**
 * @description 根据数据集的一个值获取对应的值
 * @param { type } String 数据字典名称
 * @param { val } String 数据字典的一个值（任意值）
 */
export const getDataState = (type, val) => {
  const patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi
  // 判断是否为中文，则返回对应的key值
  if (patrn.exec(val)) {
    return getDataSet(type).filter(item => {
      return item.val === val
    })[0].key
  } else {
    if (typeof val === 'boolean') {
      val = Number(val)
      console.log(val)
    }
    return dataSet[type][val + '']
  }
}

/**
 * @description 根据数据字典类型获取对应的数据字典集合
 * @param { type } String 数据字典名称
 */
export const getDataSet = type => {
  return Object.keys(dataSet[type]).map(item => {
    return {
      key: item,
      val: dataSet[type][item]
    }
  })
}
