// 格式化字符串时间
export function formatDate(date) {
  if (!date || date === "N/A") {
    return "N/A";
  }
  // 常量
  const NOW_DAY = "今天";
  const YESTERDAY = "昨天";
  const THE_DAY_BEFORE_YESTERDAY = "前天";
  const WEEK_HOURS = "凌晨";
  const MORNING = "早晨";
  const AM = "上午";
  const NOONING = "中午";
  const AFTERNOON = "下午";
  const AT_DUSK = "傍晚";
  const NIGHT = "晚上";
  const LATE_AT_NIGHT = "深夜";

  // 当前时间
  let nowDate = new Date();
  // let nowYear = nowDate.getFullYear();
  // let nowMonth = nowDate.getMonth() + 1;
  let nowDay = nowDate.getDate();
  // let nowHours = nowDate.getHours();
  // let nowMinutes = nowDate.getMinutes();
  // let nowSeconds = nowDate.getSeconds();

  // card 领取时间
  let cardDate = new Date(date);
  // let cardYear = cardDate.getFullYear();
  let cardMonth = cardDate.getMonth() + 1;
  let cardDay = cardDate.getDate();
  let cardHours = cardDate.getHours();
  // let cardMinutes = cardDate.getMinutes();
  // let cardSeconds = cardDate.getSeconds();

  // 计算得到结果
  let showDate = ""; //显示的日期
  let showTime = ""; //显示的时段

  let dayGap = nowDay - cardDay; // 当前时间与任务领取时间差
  // 大于2 显示日期
  if (dayGap > 2) {
    showDate =
      (cardMonth < 10 ? "0" + cardMonth : cardMonth) +
      "-" +
      (cardDay < 10 ? "0" + cardDay : cardDay);
  }
   // 等于2 显示前天
  if (dayGap === 2) {
    showDate = THE_DAY_BEFORE_YESTERDAY;
  }
  // 等于1 显示昨天天
  if (dayGap === 1) {
    showDate = YESTERDAY;
  }
  // 等于0 显示前天
  if (dayGap === 0) {
    showDate = NOW_DAY;
  }

  // 时间断判断
  if (cardHours >= 3 && cardHours < 6) {
    showTime = WEEK_HOURS;
  } else if (cardHours >= 6 && cardHours < 8) {
    showTime = MORNING;
  } else if (cardHours >= 8 && cardHours < 11) {
    showTime = AM;
  } else if (cardHours >= 11 && cardHours < 13) {
    showTime = NOONING;
  } else if (cardHours >= 13 && cardHours < 17) {
    showTime = AFTERNOON;
  } else if (cardHours >= 17 && cardHours < 19) {
    showTime = AT_DUSK;
  } else if (cardHours >= 19 && cardHours < 23) {
    showTime = NIGHT;
  } else {
    showTime = LATE_AT_NIGHT;
  }
  return showDate + showTime;
}
