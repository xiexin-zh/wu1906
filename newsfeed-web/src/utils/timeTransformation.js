export default function getTime(time) {
  time = +time;
  if (isNaN(time) || time === 0) {
    return '';
  }

  const date = new Date(time);
  const year = date.getFullYear(); //年
  const month = date.getMonth() + 1; //月
  const day = date.getDate(); //日
  const hour = date.getHours(); //時
  const min = date.getMinutes(); //分
  const sec = date.getSeconds(); //秒
  //判斷是否滿10
  const arr = [month, day, hour, min, sec];
  const arr1 = [];
  arr.forEach((item) => {
    arr1.push(item < 10 ? '0' + item : item);
  });
  return `${year}-${arr1[0]}-${arr1[1]}`;
  // return `${year}-${arr1[0]}-${arr1[1]}  ${arr1[2]}:${arr1[3]}:${arr1[4]}`;
}
