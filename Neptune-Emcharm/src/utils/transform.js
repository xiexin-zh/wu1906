/* eslint-disable */

// 去除文本中标签
export function transformText(txt) {
  return txt.replace(/<\/?.+?>/g, "").replace(/ /g, "");
}

// 计算中英文字符长度
export function getLength(str) {
  if (str == null) return 0;
  if (typeof str != "string") {
    str += "";
  }
  return str.replace(/[^\x00-\xff]/g, "01").length;
}
// 姓名验证
export function regName(str) {
  return /^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$/.test(str);
}

// 手机号验证
export function regTel(str) {
  return /^1[3456789]\d{9}$/.test(str);
}

// 参与者编号验证
export function regNumber(str) {
  const reg = new RegExp("^[\u4E00-\u9FA5A-Z0-9a-z_-]{1,10}$");
  return reg.test(str);
}

// 验证组织单元
export function regClass(str) {
  const reg = /^[A-Za-z0-9\(\)\u4e00-\u9fa5]{1,50}$/;
  return reg.test(str);
}

// 验证生日
export function regBirthday(str) {
  const reg = /^(18|19|20)\d{2}-(1[0-2]|0?[1-9])-(0?[1-9]|[1-2][0-9]|3[0-1])$/;
  return reg.test(str);
}

//身份证验证
export function regIdCard(str) {
  const reg = /^(\d{6})(18|19|20)?(\d{2})([01]\d)([0123]\d)(\d{3})(\d|X)?/;
  return reg.test(str);
}

//访问码验证
export function regCode(str) {
  const reg = /^[A-Z0-9]{6}$/;
  return reg.test(str);
}

function add0(m) {
  return m < 10 ? "0" + m : m;
}
export function format(shijianchuo) {
  //shijianchuo是整数，否则要parseInt转换
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return (
    y + "-" + add0(m) + "-" + add0(d)
    // +
    // " " +
    // add0(h) +
    // ":" +
    // add0(mm) +
    // ":" +
    // add0(s)
  );
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

// 排序-数组对象-数字
export function compare(prop) {
  return function(obj1, obj2) {
    var val1 = obj1[prop];
    var val2 = obj2[prop];
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0;
    }
  };
}

// 获取随机颜色
export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
