import axios from 'axios';

/**
 *
 * @param {object} fileInfo
 * @param {string} fileInfo.upload_url
 * @param {string} fileInfo.name
 * @param {string} fileInfo.mime
 */
export function uploadFile(fileInfo) {
  const { upload_url, name, mime, fileObj } = fileInfo;
  if (!upload_url || !name || !mime) {
    console.info('upload file', fileInfo);
    throw new Error('上傳文件缺少參數');
  }
  return axios({
    method: 'put',
    url: upload_url,
    data: fileObj,
    withCredentials: true,
    headers: {
      'content-disposition': `attachment;filename="${encodeURIComponent(
        name
      )}"`, //檔名帶中文不轉碼會出錯
      'content-type': mime,
    },
    // onUploadProgress: function (event) {
    //   if (event.lengthComputable) {
    //     let complete = (event.loaded / event.total * 100 | 0);
    //     window.dispatch({
    //       type: "middleMain/updateUploadProgress",
    //       payload: {
    //         uploadLoaded: event.loaded,
    //         uploadTotal: event.total,
    //         uploadProgress: complete,
    //       }
    //     });
    //   }
    // },
  });
}
