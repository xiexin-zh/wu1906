import { get, post } from '../../utils/fetch';
import axios from 'axios';

/**
 * 21. 文件上传
 * @param {File} file
 * @param {string} userId
 * @param {number} fileIndex
 * @param {number<0, 1>} type
 */
export function uploadFile({ file, userId, fileIndex, type }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);
  formData.append('fileIndex', fileIndex);
  formData.append('type', type);
  return post('/fs/newsfeed_upload', {
    data: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencode',
    },
  });
}

/**
 * WebChat 接口，获取文件上传的预设地址
 * @param {string<avatar, sticker, thumbnail, voice>} storeType
 * @return {object} result: { preview_download_url, preview_upload_url }
 */
export function getUploadUrl(storeType) {
  return get(`/api/teams/all/presigned_preview_url/${storeType}`);
}

/**
 * WebChat 接口，根据预设地址上传文件
 * @param {object} fileInfo
 * @param {string} fileInfo.uploadUrl
 * @param {string} fileInfo.name
 * @param {string} fileInfo.mime
 * @param {File} fileInfo.fileObj
 */
export function uploadFileByPreview(fileInfo) {
  const { uploadUrl, name, mime, fileObj } = fileInfo;
  if (!uploadUrl || !name || !mime) {
    console.info('upload file', fileInfo);
    throw new Error('上傳文件缺少參數');
  }
  //檔名帶中文不轉碼會出錯
  const fileDownloadName = encodeURIComponent(name);
  return axios({
    method: 'put',
    url: uploadUrl,
    data: fileObj,
    withCredentials: true,
    headers: {
      'Content-Disposition': `attachment;filename="${fileDownloadName}"`,
      'Content-Type': mime,
    },
  }).then((response) => response.status === 200);
}
