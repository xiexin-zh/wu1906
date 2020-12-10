/**
 * @description 公共函数模块
 */
import uniRequest from "uni-request";
import hostEnv from "@api/host-env";
const tools = {
  // 轻提示
  toast(title, cb = "none") {
    uni.showToast({
      title: title,
      icon: cb,
    });
  },
  // 加载提示
  showLoading(title = "加载中...") {
    uni.showLoading({
      title: title,
    });
  },
  // 弹出确认框
  confirm(content, cb, isCancle = true) {
    uni.showModal({
      title: "提示",
      content: content,
      showCancel: isCancle,
      success: function (res) {
        if (res.confirm) {
          if (cb) cb();
        }
      },
    });
  },
  // 删除提示
  delTip(msg = "确认进行此操作吗?", cb) {
    uni.showModal({
      title: "温馨提示",
      content: msg,
      success: function (res) {
        if (res.confirm) {
          cb();
        }
      },
    });
  },
  // 路由跳转
  navTo({ url, title = "智慧校园" }) {
    uni.navigateTo({
      url,
    });
    // #ifdef H5
    setTimeout(() => {
      document.title = title.split("-")[0] || "智慧校园";
    });
    // #endif
  },
  // 路由跳转关闭当前页面
  redirectTo({ url, title = "智慧校园" } = params) {
    uni.redirectTo({
      url,
    });
    // #ifdef H5
    setTimeout(() => {
      document.title = title.split("-")[0] || "智慧校园";
    });
    // #endif
  },
  // 路由返回
  goBack(delta = 1) {
    uni.navigateBack({
      delta,
    });
  },
  // html图片转换格式的方法
  dataURLToBlob(dataurl) {
    // console.log(dataurl)
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime,
    });
  },
  // 图片上传
  ossUpload(code, file, fileType = "jpg", callback) {
    this.showLoading("上传中...");
    var requestTask = uni.request({
      url: `${hostEnv.host}/ossSign?schoolCode=${code}&fileType=${fileType}`, //请求后台签名地址。
      complete: (res) => {
        console.log(res.data.data);
        var aliyunOssToken = res.data.data;
        uni.uploadFile({
          url: "https://canpoint-photo.oss-cn-beijing.aliyuncs.com", //后台给的阿里云存储给的上传地址
          filePath: file,
          fileType: fileType,
          name: "file",
          formData: {
            key: aliyunOssToken.startsWith,
            OSSAccessKeyId: aliyunOssToken.OSSAccessKeyId,
            policy: aliyunOssToken.policy,
            callback: aliyunOssToken.callback,
            Signature: aliyunOssToken.signature,
            success_action_status: 200,
          },
          success: (res) => {
            if (res.statusCode === 200) {
              uni.hideLoading();
              uni.showToast({
                title: "上传成功",
                icon: "none",
              });
              const data = JSON.parse(res.data);
              callback(data.data.url);
            } else {
              uni.hideLoading();
              uni.showToast({
                title: "上传失败",
                icon: "none",
              });
            }
          },
          fail: (err) => {
            uni.hideLoading();
            uni.showToast({
              title: "上传失败",
              icon: "none",
            });
          },
        });
      },
    });
  },
  //函数节流
  throttle(func, wait) {
    let previous = 0;
    return function () {
      let now = Date.now();
      let context = this;
      let args = arguments;
      if (now - previous > wait) {
        func.apply(context, args);
        previous = now;
      }
    };
  },
  // 获取url传到参数
  getQuery() {
    const url = window.location.href;
    const params = url.substr(url.lastIndexOf("?")).replace("#/", "");
    return new URLSearchParams(params);
  },
  // 延迟执行
  goNext: (fn) => {
    setTimeout(() => {
      fn();
    }, 1200);
  },
  // 获取周几
  getWeek() {
    let msg;
    const day = new Date().getDay();
    switch (day) {
      case 1:
        msg = "星期一";
        break;
      case 2:
        msg = "星期二";
        break;
      case 3:
        msg = "星期三";
        break;
      case 4:
        msg = "星期四";
        break;
      case 5:
        msg = "星期五";
        break;
      case 6:
        msg = "星期六";
        break;
      case 0:
        msg = "星期日";
        break;
    }
    return msg;
  },
  // 时间转化
  getDateTime(t = new Date().getTime(), type = "dateTime") {
    let d = new Date(t);
    const date =
      d.getFullYear() +
      "-" +
      (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)) +
      "-" +
      (d.getDate() > 9 ? d.getDate() : "0" + d.getDate()) +
      " " +
      (d.getHours() > 9 ? d.getHours() : "0" + d.getHours()) +
      ":" +
      (d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes()) +
      ":" +
      (d.getSeconds() > 9 ? d.getSeconds() : "0" + d.getSeconds());

    if (type === "dateTime") {
      return date;
    } else if (type === "dateTimeWithOutSecond") {
      return date.substring(0, 16);
    } else if (type === "date") {
      return date.substring(0, 10);
    } else if (type === "time") {
      return date.substring(11, 16);
    } else if (type === "noSecond") {
      return date.substring(0, 16);
    } else if (type === "second") {
      return date.substring(11, 19);
    } else if (type === "month") {
      return date.substring(0, 7);
    }
  },
  inputScroll() {
    // 处理界面错位问题
    document.body.addEventListener("focusin", () => {
      this.isReset = false;
    });
    document.body.addEventListener("focusout", () => {
      this.isReset = true;
      setTimeout(() => {
        if (this.isReset) {
          window.scrollTo(0, 0);
        }
      }, 100);
    });
	},
	// 获取一个月中几周及时间区间
  getWeeks(now_month) {
    let week_array = [];
    let today = new Date(Date.parse(now_month));
    let year = today.getFullYear();
    let month = today.getMonth();
    let i = 0;

    let start = new Date(year, month, 1); // 得到当月第一天
    let end = new Date(year, month + 1, 0); // 得到当月最后一天
    let start_day = start.getDay(); // 当月第一天是周几
    switch (start_day) {
      case 3:
        i = 0 - 1;
        break;
      case 4:
        i = 0 - 2;
        break;
      case 5:
        i = 0 - 3;
        break;
      case 6:
        i = 0 - 4;
        break;
      case 0:
        i = 0 - 5;
        break;
      case 1:
        i = 1;
        break;
      case 2:
        i = 0;
        break;
    }

    while (new Date(year, month, i + 6) <= end) {
      week_array.push([
        new Date(year, month, i).format("yyyy-MM-dd"),
        new Date(year, month, i + 6).format("yyyy-MM-dd"),
      ]);
      i += 7;
    }
    return week_array;
  },
  // 获取当周开始及结束时间
  getNowWeekDate(time) {
    const date = time || new Date();
    const zero = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      "00",
      "00",
      "00"
    );
    const full = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      "23",
      "59",
      "59"
    );
    //今天是这周的第几天
    const today = date.getDay();
    //上周日距离今天的天数（负数表示）
    let stepSunDay = -today + 1;
    // 如果今天是周日
    if (today == 0) {
      stepSunDay = -7;
    }
    // 周一距离今天的天数（负数表示）
    const stepMonday = 7 - today;
    const monday = new Date(zero.getTime() + stepSunDay * 24 * 3600 * 1000);
    const sunday = new Date(full.getTime() + stepMonday * 24 * 3600 * 1000);
    return [monday, sunday];
  },
  // 获取当前月的开始及结束时间
  getNowWMonthDate(time) {
    const date1 = time || new Date();
    const start = new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate(),
      "00",
      "00",
      "00"
    );
    start.setDate(1);
    // 获取当前月的最后一天
    const date2 = time || new Date();
    let currentMonth = date2.getMonth();
    const nextMonth = ++currentMonth;
    const nextMonthFirstDay = new Date(
      date2.getFullYear(),
      nextMonth,
      1,
      "23",
      "59",
      "59"
    );
    const oneDay = 1000 * 60 * 60 * 24;
    const end = new Date(nextMonthFirstDay - oneDay);
    return [start, end];
  },
};

export default tools;
