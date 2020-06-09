/* eslint-disable prefer-template */
// 去除文本中标签
export function transformText(txt) {
  return txt.replace(/<\/?.+?>/g, '').replace(/ /g, '');
}

// 手机号验证
export function regTel(str) {
  return /^1[3456789]\d{9}$/.test(str);
}

// 微信号验证
export function regWx(str) {
  return /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/.test(str);
}

// 座机号验证
export function regPhone(str) {
  return /^\d{3}-\d{8}$|^\d{4}-\d{7}$/.test(str);
}

// 验证生日
export function regBirthday(str) {
  const reg = /^(18|19|20)\d{2}-(1[0-2]|0?[1-9])-(0?[1-9]|[1-2][0-9]|3[0-1])$/;
  return reg.test(str);
}

// 身份证验证
export function regIdCard(str) {
  const reg = /^(\d{6})(18|19|20)?(\d{2})([01]\d)([0123]\d)(\d{3})(\d|X)?/;
  return reg.test(str);
}

// 访问码验证
export function regCode(str) {
  const reg = /^[A-Z0-9]{6}$/;
  return reg.test(str);
}

function add0(m) {
  return m < 10 ? '0' + m : m;
}
export function format(shijianchuo) {
  // shijianchuo是整数，否则要parseInt转换
  const time = new Date(shijianchuo);
  const y = time.getFullYear();
  const m = time.getMonth() + 1;
  const d = time.getDate();
  const h = time.getHours();
  const mm = time.getMinutes();
  const s = time.getSeconds();
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
export function formatDay(shijianchuo) {
  // shijianchuo是整数，否则要parseInt转换
  const time = new Date(shijianchuo);
  const y = time.getFullYear();
  const m = time.getMonth() + 1;
  const d = time.getDate();
  return y + '-' + add0(m) + '-' + add0(d);
}

export function formatTime(shijianchuo) {
  // 时间戳转换为秒
  const time = new Date(shijianchuo);
  const y = time.getFullYear();
  const m = time.getMonth() + 1;
  const d = time.getDate();
  const temp = y + '-' + add0(m) + '-' + add0(d);
  const newTime = new Date(temp).getTime() / 1000;
  return newTime;
}

// 邮箱验证
export function regEmail(str) {
  const reg = /^[0-9a-z_]+@(([0-9a-z]+)[.]){1,2}[a-z]{2,3}$/;
  return reg.test(str);
}

// 密码验证
export function regPwd(str) {
  const reg = /^[0-9A-Za-z]{5,12}$/;
  return reg.test(str);
}

// 倒计时计算
export function getTimeOut(startTime, endTIme) {
  if (!startTime || !endTIme || startTime > endTIme) {
    return '0时0分';
  }
  const gapTime = new Date(endTIme - startTime);
  const d = parseInt(gapTime / 60 / 60 / 24, 0);
  const h = parseInt((gapTime / 60 / 60) % 24, 0);
  const m = parseInt((gapTime / 60) % 60, 0);
  // let s = parseInt(gapTime % 60, 0);
  // s = s < 10 ? '0' + s : s;
  if (d > 0) {
    return d + '天' + h + '时';
  }
  if (d < 0 && h > 0) {
    return h + '时' + m + '分';
  }
  return h + '时' + m + '分';
}

// 下载文件
export function downloadFile(url, filename) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function() {
    if (this.status === 200) {
      const blob = this.response;
      const $a = document.createElement('a');
      // blob.type = 'application/octet-stream';
      const file_url = URL.createObjectURL(blob);
      $a.href = file_url;
      $a.download = filename;
      $a.click();
      window.URL.revokeObjectURL(url);
    }
  };
  xhr.send();
}

// 随机获取16进制颜色
export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// 随机获取rgb颜色
export function getRandomRgbColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return r + ',' + g + ',' + b;
}
