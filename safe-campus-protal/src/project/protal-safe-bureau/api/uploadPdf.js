/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const uploadPdfApi = {
  // 隐患管理
  uploadPdf: '/file/upload/doc#postJsonQuery' // 上传pdf
}
for (const val in uploadPdfApi) {
  uploadPdfApi[val] = `${hostEnv.protal_api_10050}${uploadPdfApi[val]}`
}
export default uploadPdfApi
