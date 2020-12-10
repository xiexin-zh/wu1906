/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const praisecApi = {
  // 表扬语
  addPraise: '/praise/label/set/add#post', // 添加表扬语
  delPraise: '/praise/label/set/delete#delForm', // 删除
  praiseList: '/praise/label/set/list#post', // 表扬语列表
  updatePraise: '/praise/label/set/update#putJson', // 更新表扬语
  //表扬栏
  addsetPraise: '/praise/add#post', // 添加
  delsetPraise: '/praise/delete#delForm', // 删除
  praisesetList: '/praise/list#post', // 列表
  updatesetPraise: '/praise/update#putJson', // 更新
  getpraiseDetail: '/praise/detail#getUrl'
}
for (const val in praisecApi) {
  praisecApi[val] = `${hostEnv.protal_api_11009}${praisecApi[val]}`
}

export default praisecApi
