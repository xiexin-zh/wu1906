import EXIF from 'exif-js';
import { removeElement } from './utils';
import { getVideoSize, getImgSize } from './utils';
/**
 *
 * @param {string [ base64 data url ]}} url
 * @return {object} imageInfo
 * @return {number} imageInfo.width
 * @return {number} imageInfo.height
 * @return {orientation} imageInfo.orientation 旋转参数(显示时旋转参数会影响宽高互换，且需要获取宽高的地方都需要上传旋转参数，所以放在一起)
 */
export function getImgInfo(url) {
  return new Promise(function(resolve, reject) {
    try {
      let image = new Image();
      const { width, height, name } = image;
      image.onload = () => {
        const imageInfo = {
          width,
          height,
          name,
          image,
        };
        EXIF.getData(image, function() {
          imageInfo.orientation = EXIF.getTag(this, 'Orientation') || 0;
          resolve(imageInfo);
        });
      };
      image.onerror = function(e) {
        reject(e);
      };
      image.src = url;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 *
 * @param {File} file
 * @return {File} tranformed image
 */
export function transformImage(file) {
  return new Promise(function(resolve, reject) {
    const imgBlobUrl = URL.createObjectURL(file);
    try {
      let result = file;
      let image = new Image();
      image.onload = () => {
        const { width, height } = image;
        EXIF.getData(image, function() {
          const orientation = EXIF.getTag(this, 'Orientation') || 0;
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          switch (orientation) {
            case 6:
              canvas.width = height;
              canvas.height = width;
              ctx.rotate(Math.PI / 2);
              ctx.drawImage(this, 0, -height, width, height);
              break;
            case 3:
              ctx.rotate(Math.PI);
              ctx.drawImage(this, -width, -height, width, height);
              break;
            case 8:
              canvas.width = height;
              canvas.height = width;
              ctx.rotate((3 * Math.PI) / 2);
              ctx.drawImage(this, -width, 0, width, height);
              break;
            default:
              resolve(result);
              break;
          }
          canvas.toBlob(resolve, 'image/jpeg');
          URL.revokeObjectURL(imgBlobUrl);
        });
      };
      image.onerror = function(e) {
        throw e;
      };
      image.src = imgBlobUrl;
    } catch (error) {
      reject(error);
      URL.revokeObjectURL(imgBlobUrl);
    }
  });
}

export function getVideoDuration(file) {
  return new Promise(function(resolve, reject) {
    try {
      let video = document.createElement('video');
      video.muted = true;
      video.setAttribute('crossorigin', 'anonymous');
      video.setAttribute(
        'style',
        'position: fixed; bottom: 0; right: 0; z-index: -10'
      );
      const blobUrl = URL.createObjectURL(file);
      video.setAttribute('src', blobUrl);
      document.body.appendChild(video);
      video.addEventListener('loadedmetadata', (_) => {
        console.log(video.duration);
        resolve(video.duration);
        URL.revokeObjectURL(blobUrl);
        removeElement(video);
      });
      video.addEventListener('error', (error) => {
        reject(error);
        URL.revokeObjectURL(blobUrl);
        removeElement(video);
      });
      video.load();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 *
 * @param {File} filelist
 * @param {function} 傳入獲取視頻第一幀uploadThumbnail方法
 */

export async function getFileImg({ fileList, uploadThumbnail }) {
  if (!fileList) {
    return;
  }
  let file = await Promise.all(
    fileList.map((item) => {
      const {
        originFileObj,
        size,
        response: { data },
      } = item;
      if (/video/.test(item.type)) {
        return getVideoSize(originFileObj)
          .then(({ width, height, thumbnailImage }) => {
            return [
              {
                width,
                height,
              },
              thumbnailImage,
            ];
          })
          .then(async ([param, thumbnailImage]) => {
            const thumbnailUrl = await uploadThumbnail(thumbnailImage);
            return {
              ...data,
              ...param,
              size,
              thumbnailUrl,
              type: 2,
            };
          });
      }
      return getImgSize(originFileObj).then(({ width, height }) => {
        return {
          size,
          width,
          height,
          type: /image\/gif/.test(item.type) ? 3 : 1,
          ...data,
        };
      });
    })
  );
  return file;
}
