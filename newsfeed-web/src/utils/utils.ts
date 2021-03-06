import { func } from 'prop-types';

/**
 * 本地開發連接 UAT 數據、 UAT 部署，均存在資源跨域，現行處理方法為 nginx 代理，所以需要處理資源路徑，走本機代理
 * ⚠️ 頭像資源允許跨域訪問，故無此問題，該問題主要存在與會話中的圖片、檔案
 *
 * @param {string} url 原始 url
 */
export function getUrl(url: string): string {
  if (typeof url !== 'string') {
    return '';
    // throw new Error('error type')
  }
  //兼容移动端发布的网络图片
  if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
    return url;
  }
  return url
    .replace(/^(https?:)?\/\/[\a-zA-Z0-9\-\.]+(\/|$)/, '/')
    .replace(/^\/download\/newsfeed/, '/nf_api/download/newsfeed');
}

export function setCookie(cname: string, cvalue: string, exdays: number) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + '; ' + expires;
}

export function getCookie(cname: string) {
  var name = cname + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(name) !== -1) return c.substring(name.length, c.length);
  }
  return '';
}

export function clearCookie(name: string) {
  setCookie(name, '', -1);
}

export function isString(data: any): boolean {
  return Object.prototype.toString.call(data) === '[object String]';
}

export function isObject(data: any): boolean {
  return Object.prototype.toString.call(data) === '[object Object]';
}

/**
 *
 * @param {File} file
 * @return {object} imageInfo
 * @return {number} imageInfo.width
 * @return {number} imageInfo.height
 */
export function getImgSize(file) {
  return new Promise(function(resolve, reject) {
    try {
      let image = new Image();
      image.onload = () => {
        const imageInfo = {
          width: image.width,
          height: image.height,
        };
        resolve(imageInfo);
        URL.revokeObjectURL(image.src);
      };
      image.onerror = function(e) {
        reject(e);
        URL.revokeObjectURL(image.src);
      };
      image.src = URL.createObjectURL(file);
    } catch (error) {
      reject(error);
    }
  });
}
export function removeElement(_element) {
  var _parentElement = _element.parentNode;
  if (_parentElement) {
    _parentElement.removeChild(_element);
  }
}
/**
 *
 * @param {File} file
 * @return {object} imageInfo
 * @return {number} imageInfo.width
 * @return {number} imageInfo.height
 */
export function getVideoSize(file) {
  let video = document.createElement('video');
  video.muted = true;
  video.setAttribute('crossorigin', 'anonymous');
  // video.setAttribute("style", "position: absolute; top: -10000em");
  video.setAttribute(
    'style',
    'position: fixed; bottom: 0; right: 0; z-index: -10'
  );
  video.setAttribute('src', URL.createObjectURL(file));
  document.body.appendChild(video);
  return new Promise(function(resolve, reject) {
    video.addEventListener('loadeddata', (_) => {
      setTimeout(() => {
        let canvas = document.createElement('canvas');
        canvas.width = video.videoWidth * 1;
        canvas.height = video.videoHeight * 1;
        canvas
          .getContext('2d')
          .drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          const thumbnailData = {
            width: canvas.width,
            height: canvas.height,
            mime: 'image/jpeg',
            thumbnailImage: blob,
          };
          resolve(thumbnailData);
        }, 'image/jpeg');
        removeElement(video);
      }, 1000);
    });
    video.addEventListener('error', (error) => {
      reject(error);
      removeElement(video);
    });
    video.load();
  });
}

// Generated by https://quicktype.io

export interface SpecialType {
  start: number;
  end: number;
  type: string;
  data?: Data;
  text: string;
}

export interface Data {}

export function matchPostTop(txt: string): SpecialType[] {
  let text = txt;
  // 匹配到的項
  let pattArr = [];
  // 目標數組
  let resultArr = [];
  // 存儲匹配結果，result 的 index 為 key 用於判斷之前是否匹配到此數據
  let startMap = {};

  // const mdLink = RegExp(/\[([^\[\]]+)\]\(((assistant|rollsmary|crm|user|http|https|css):\/\/[^\(\)]+)\)/g);
  const mdLink = RegExp(/\[([^\[\]]+)\]\(((newsfeed):\/\/[^\(\)]+)\)/g);

  let result;
  let markdownResults = [];

  while (((result = mdLink.exec(text)), result)) {
    const protocol = result[3];
    if (isNewResult(result.index, result.index + result[0].length)) {
      const resultItem = {
        start: result.index,
        end: result.index + result[0].length,
        type: 'link',
        data: {
          text: result[1],
          url: result[2],
          protocol,
        },
        text: result[0],
      };
      startMap[result.index] = resultItem;
      markdownResults.push({
        start: result.index,
        end: result.index + result[0].length,
      });
      pattArr.push(resultItem);
    }
  }
  function isNewResult(start, end) {
    if (startMap[result.index]) {
      return false;
    }
    for (let index = 0; index < markdownResults.length; index++) {
      const item = markdownResults[index];
      if (start >= item.start && start < item.end) {
        return false;
      }
      if (end > item.start && end <= item.end) {
        return false;
      }
    }
    return true;
  }

  // 無匹配項，返回整個文字
  if (pattArr.length === 0) {
    return [
      {
        start: 0,
        end: text.length,
        type: 'normal',
        text: text,
      },
    ];
  }
  // 根據開始位置排序匹配項
  pattArr.sort((a, b) => a.start - b.start);

  // 迴圈匹配項，在匹配項的中間補上其他未匹配到到普通文字，結果放於 resultArr
  pattArr.forEach((item, index) => {
    // 第一匹配項前還有文字
    if (index === 0 && item.start !== 0) {
      resultArr.push({
        start: 0,
        end: item.start,
        type: 'normal',
        text: text.slice(0, item.start),
      });
    }
    resultArr.push(item);
    // 此匹配項和後一匹配項中間有文字
    if (index < pattArr.length - 1 && item.end !== pattArr[index + 1].start) {
      resultArr.push({
        start: item.end,
        end: pattArr[index + 1].start,
        type: 'normal',
        text: text.slice(item.end, pattArr[index + 1].start),
      });
    }
    // 最後一個匹配項後還有文字
    if (index === pattArr.length - 1 && item.end !== text.length) {
      resultArr.push({
        start: item.end,
        end: text.length,
        type: 'normal',
        text: text.slice(item.end),
      });
    }
  });
  return resultArr;
}

/**
 * 獲取分頁時請求數據的頁碼
 * @param {array} list
 * @param {number} rows
 */
export function getPage(list: Array<any>, rows: number) {
  return Math.floor(list.length / rows) + 1;
}

export function downloadImg(url: string, fileType: number) {
  let filename;

  if (fileType === 3) {
    filename = `${Math.random()}.gif`;
  } else {
    filename = `${Math.random()}.jpg`;
  }
  downloadFile(url, filename);
}

export function downloadFile(url: string, filename: string) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function() {
    if (this.status == 200) {
      let blob = this.response;
      let $a = document.createElement('a');
      // blob.type = 'application/octet-stream';
      let url = URL.createObjectURL(blob);
      $a.href = url;
      $a.download = filename;
      $a.click();
      window.URL.revokeObjectURL(url);
    }
  };
  //发送请求
  xhr.send();
}

export function getUsername(member: any) {
  if (!member) {
    return '';
  }
  return (
    member.get('givenName') ||
    member.get('given_name') ||
    member.get('full_name') ||
    member.get('fullName') ||
    member.get('name') ||
    member.get('nickname') ||
    ''
  );
}
