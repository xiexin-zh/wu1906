// **** 首页中的 本考核周期内 日期处理  ****

import moment from 'moment';

// 根据当前日期 获取到 当前星期的 周一 至 周日 以及 所对应的 日期
export function week_day_time(strDay = new Date().toLocaleDateString()) {
  const startOfWeek = moment(strDay).startOf('week');
  const endOfWeek = moment(strDay).endOf('week');
  const days = [];
  let day = startOfWeek;
  while (day <= endOfWeek) {
    days.push(day.format('MM.DD,dddd'));
    day = day.clone().add(1, 'd');
  }
  return days;
}

// 判断日期是否相同
export function dateIsSame(m1, m2) {
  const moment1 = moment(m1, 'MM.DD,dddd');
  const moment2 = moment(m2, 'MM.DD,dddd');
  // console.log(moment1.isSame(moment2, 'day')); // true
  // console.log(moment1.isSame(moment2, 'date')); // true
  return moment1.isSame(moment2, 'date');
}
