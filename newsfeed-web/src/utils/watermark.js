import watermark from 'watermarkjs';
import { downloadImg, downloadFile } from './utils';
// 单个水印是宽高短的一边的三分之一长的正方形
const rotate = (watermarkText, orientation) => {
  watermarkText = watermarkText + '';
  return function(target) {
    let regNum = -45;
    const markWidth = Math.min(target.width, target.height);
    const fontSize =
      ((markWidth / 3) * Math.sqrt(2)) / (watermarkText.length + 2);
    var mark = document.createElement('canvas');
    mark.width = markWidth / 3;
    mark.height = markWidth / 3;
    var markCtx = mark.getContext('2d');

    var x = fontSize;
    var y = markWidth / 3 - fontSize;
    if (orientation === 3) {
      regNum += 180;
      x = markWidth / 3 - fontSize;
      y = fontSize;
    } else if (orientation === 6) {
      x = markWidth / 3 - fontSize;
      regNum += -90;
    } else if (orientation === 8) {
      y = fontSize;
      regNum += 90;
    }

    markCtx.translate(x, y);
    markCtx.width = markWidth;
    markCtx.height = markWidth;
    markCtx.font = `${fontSize}px Josefin Slab`;
    markCtx.rotate((regNum * Math.PI) / 180);
    markCtx.fillStyle = 'rgba(170,170,170,0.4)';
    markCtx.fillText(watermarkText, 0, 0);

    var context = target.getContext('2d');
    var pat = context.createPattern(mark, 'repeat'); //在指定的方向上重复指定的元素
    context.fillStyle = pat;
    context.fillRect(0, 0, target.width, target.height);
    return target;
  };
};

export function getWatermarkDataURL(options) {
  const { src, watermarkText, callback, error, orientation } = options;
  watermark([src])
    .image(rotate(watermarkText, orientation))
    .then(function(img) {
      callback && callback(img.src);
    })
    .catch((e) => {
      error && error(e);
    });
}

//给遮罩层增加水印
export function addWaterMaskForMask(target, watermarkText) {
  const { clientWidth: width, clientHeight: height } = target;
  let regNum = -45;
  const markWidth = Math.min(width, height);
  if (!markWidth) {
    return null;
  }
  const fontSize =
    ((markWidth / 3) * Math.sqrt(2)) / (watermarkText.length + 2);
  let mark = document.createElement('canvas');
  mark.width = markWidth / 3;
  mark.height = markWidth / 3;
  let markCtx = mark.getContext('2d');
  let x = fontSize;
  let y = markWidth / 3 - fontSize;
  markCtx.translate(x, y);
  markCtx.width = markWidth;
  markCtx.height = markWidth;
  markCtx.font = `${fontSize}px Josefin Slab`;
  markCtx.rotate((regNum * Math.PI) / 180);
  markCtx.fillStyle = 'rgba(170,170,170,0.4)';
  markCtx.fillText(watermarkText, 0, 0);
  let resultContent = document.createElement('canvas');
  resultContent.width = width;
  resultContent.height = height;
  let context = resultContent.getContext('2d');
  let pat = context.createPattern(mark, 'repeat'); //在指定的方向上重复指定的元素
  context.fillStyle = pat;
  context.fillRect(0, 0, width, height);
  let resultImgsrc = resultContent.toDataURL('image/png', 1);
  return resultImgsrc;
}

//图片下载函数
export function addWaterMaskAndDownload(urlForDownload, imgName, fileType) {
  if (fileType === 3) {
    const filename = `${Date.now()}.gif`;
    downloadFile(urlForDownload, filename);
    return;
  }
  if (urlForDownload.indexOf('data:image') !== -1) {
    var image_data = atob(urlForDownload.split(',')[1]);
    var arraybuffer = new ArrayBuffer(image_data.length);
    var view = new Uint8Array(arraybuffer);
    for (var i = 0; i < image_data.length; i++) {
      view[i] = image_data.charCodeAt(i) & 0xff;
    }
    let blob;
    try {
      blob = new Blob([arraybuffer], { type: 'application/octet-stream' });
    } catch (e) {
      var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder)();
      bb.append(arraybuffer);
      blob = bb.getBlob('application/octet-stream');
    }
    urlForDownload = (window.URL || window.webkitURL).createObjectURL(blob);
  }
  downloadImg(urlForDownload, fileType);
}
