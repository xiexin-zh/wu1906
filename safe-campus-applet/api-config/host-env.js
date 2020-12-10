/**
 * @description 多环境接口配置
 * @author zhangli
 */
// const host = ''
const ConfigEnv = process.env.NODE_ENV
let host = ''
if (ConfigEnv === 'production') {
  host = 'https://canpointtest.com'
} else if (ConfigEnv === 'development') {
	host = 'https://canpointtest.com'
}
let protal_api_11009 = host + '/protal_api_11009'
let protal_api_10050 = host + '/protal_api_10050'
let protal_api_18090 = host + '/protal_api_18090'
let protal_api_10166 = host + '/protal_api_10166'
let protal_api_11002 = host + '/protal_api_11002'
let protal_api_11031 = host + '/protal_api_11031'
let hpb_face = '/hpb_face'
export default {
	host,
	protal_api_11009,
	protal_api_10050,
	protal_api_18090,
	protal_api_10166,
	protal_api_11002,
	protal_api_11031,
	hpb_face
}