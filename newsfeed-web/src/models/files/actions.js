import { namespace } from './constants';

/**
 *
 * @param {File} fileObj
 * @return {string} download_url
 */
export const uploadAvatar = (fileObj) => {
  return {
    type: `${namespace}/uploadFileByPreview`,
    payload: {
      fileObj,
      storeType: 'avatar',
    },
  };
};

/**
 *
 * @param {File} file
 * @param {1 | 2} type 文件类型 1: 图片 2: 视频
 * @param {number} fileIndex 上传文件的位置
 * @return {object} { fileIndex, originUrl, thumbnailUrl }
 */
export const uploadFile = (file, type, fileIndex = 0) => {
  return {
    type: `${namespace}/uploadFile`,
    payload: {
      file,
      type,
      fileIndex,
    },
  };
};
