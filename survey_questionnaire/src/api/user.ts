import request from '@/utils/request'
import { IApiUserInfo, IApiClassItem } from '@/api/types'

/**
 * 查找用户
 * @param data
 */
export const getId = (data: {
  n_id: string,
  name: string,
  identity: string
}) => {
  return request.post<IApiUserInfo>('/user/getId', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 添加用户
 * @param data
 */
export const addUser = (data: {
  u_name: string,
  u_class: string,
  u_number: string,
  u_birthday: string,
  u_nation: string,
  u_tel: string,
  u_identity: string,
  u_sex: string
}) => {
  return request.post<any>('/participant/edit', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 编辑用户
 * @param data
 */
export const updateUser = (data: {
  u_id: string,
  u_name: string,
  u_class: string,
  u_number: string,
  u_birthday: string,
  u_nation: string,
  u_tel: string,
  u_email: string,
  u_identity: string,
  u_sex: string
}) => {
  return request.post<any>('/user/updateUser', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 获取部门信息
 */
export const getClass = (data: {
  n_id: string
}) => {
  return request.get<any>('/statistics/getClass', data)
}

/**
 * 用户列表
 * @param data
 */
export const list = (data: {
  keyword: string,
  type: string,
  offset: number,
  limit: number
}) => {
  return request.post<any>('/participant/lists', data)
}

/**
 * 删除用户
 * @param data
 */
export const del = (data: {
  pId: string
}) => {
  return request.post<any>('/participant/del', data)
}

/**
 * 批量删除用户
 * @param data
 */
export const delUserBatch = (data: {
  pIds: string
}) => {
  return request.post<any>('/participant/batchDel', data)
}

/**
 * 清空用户
 */
export const clear = () => {
  return request.post<any>('/user/clear')
}

/**
 *  获取发布用户列表
 */
export const getPublishUser = (data: {
  surveyId: string,
  offset: number,
  limit: number
}) => {
  return request.post<any>('/sParticipant/lists', data)
}

/**
 *  获取分享状态
 */
export const getPublishStatus = (data: {
  surveyId: string
}) => {
  return request.post<any>('/survey/getPermission', data)
}
/**
 *  获取分享状态
 */
export const setPublishStatus = (data: {
  surveyId: string
}) => {
  return request.post<any>('/survey/setPermission', data)
}

/**
 * 增加/编辑分享者
 */
export const addPublishUser = (data: {
  surveyId: string,
  u_name: string,
  u_sex: string,
  u_class: string,
  u_number: string,
  u_birthday: string,
  u_identity: string,
  u_nation: string,
  u_mobile: string,
  u_visitcode: string,
  u_id: string
}) => {
  return request.post<any>('/sParticipant/edit', data)
}

/**
 * 单独删除参与者
 */
export const delSingle = (data: {
  pId: string
}) => {
  return request.post<any>('/sParticipant/del', data)
}

/**
 * 批量删除参与者
 * @param data
 */
export const delBatch = (data: {
  pIds: string
}) => {
  return request.post<any>('/sParticipant/batchDel', data)
}

/**
 * 设置访问码 多选
 */
export const setCodeBath = (data: {
  pIds: string
}) => {
  return request.post<any>('/sParticipant/batchSetVisitCode', data)
}

/**
 * 设置访问码 单个
 */
export const setCodeSingle = (data: {
  pId: string
}) => {
  return request.post<any>('/sParticipant/setVisitCode', data)
}

/**
 * 获取系统参与者
 */
export const getSystemUser = (data: {
  surveyId: string,
  type: string,
  keyword: string,
  offset: string,
  limit: string
}) => {
  return request.post<any>('/sParticipant/syslists', data)
}

/**
 * 保存已选参与者
 */
export const saveSystemUser = (data: {
  surveyId: string,
  pIds: string
}) => {
  return request.post<any>('/sParticipant/copyBySys', data)
}

/**
 * 访问码验证
 */
export const regCode = (data: {
  surveyId: string,
  visitCode: string
}) => {
  return request.post<any>('/show/checkVisitCode', data)
}
