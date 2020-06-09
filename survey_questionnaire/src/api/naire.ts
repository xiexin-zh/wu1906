import request from '@/utils/request'
import { IApiNaireSourceData, IApiNaireStatisticResult, IApiNaireItem } from './types'

/**
 * 问卷列表
 */
export const list = (data:{
  offset: number,
  limit: number
}) => {
  return request.post<any>('/survey', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 创建问卷
 * @param data
 */
export const create = (data: {
  naire: Questionnaire.INaire,
  status: string
}) => {
  return request.post<any>('/naire/save', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 问卷统计
 * @param data
 */
export const statis = (data: {
  n_id: string
}) => {
  return request.post<IApiNaireStatisticResult>('/statistics/statis', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 样本数据
 * @param data
 */

export const sourceData = (data: {
  n_id: string
  current: number,
  page_size: number
}) => {
  return request.get<IApiNaireSourceData>('/statistics/sourcedata', data)
}

/**
 * 交叉分析
 * @param data
 */

export const crossanalysis = (data: {
  n_id: string
  x_id: number | string,
  y_id: number | string
}) => {
  return request.post<any>('/statistics/crossanalysis', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 交叉分析
 * @param data
 */
export const questions = (data: {
  n_id: string
}) => {
  return request.post<any>('/statistics/questions', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 问卷详情
 * @param data
 */
export const detail = (data: {
  n_id: string
}) => {
  return request.post<any>('/show/detail', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 模板问卷详情
 * @param data
 */
export const detailTem = (data: {
  n_id: string
}) => {
  return request.post<any>('/templates/detail', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 提交问卷
 * @param data
 */
export const submit = (data: {
  nId: string,
  result: any,
  userId: string
}) => {
  return request.post<any>('/show/submit', data, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 * 发布/停止发布
 * @param data
 */
export const changeStatus = (data: {
  n_id: string,
  n_state: boolean
}) => {
  return request.get<any>('/survey/changeStatus', data)
}

/**
 * 回收情况
 * @param data
 */
export const submitStatistic = (data: {
  n_id: string,
  current: number,
  page_size: number,
  status: number,
  u_class:string
}) => {
  return request.get<any>('/statistics/submitStatis', data)
}

/**
 * 修改截止时间
 * @param data
 */
export const changeTime = (data: {
  n_id: string
  n_deadline: number
}) => {
  return request.post<any>('/naire/changeTime', data)
}

/**
 * 单个删除问卷
 * @param data
 */
export const delSingle = (data: {
  n_id: string
}) => {
  return request.get<any>('/survey/del', data)
}

/**
 * 批量删除问卷
 * @param data
 */
export const delBatch = (data: {
  surveyIds: string
}) => {
  return request.post<any>('/survey/batchDel', data)
}

/**
 * 另存为模板
 * @param data
 */
export const saveAs = (data: {
  surveyId: string
}) => {
  return request.post<any>('/survey/saveToTemplate', data)
}

/**
 * 复制问卷
 */
export const copy = (data: {
  surveyId: string
}) => {
  return request.post<any>('/survey/copy', data)
}

/**
 * 问卷基本信息获取
*/
export const getBase = (data: {
  n_id: string
}) => {
  return request.post<any>('/survey/getBase', data)
}

/**
 * 问卷基本设置(信息添加)
*/
export const setBase = (data: {
  n_id: string,
  n_title: string,
  n_intro: string,
  n_welcometxt: string,
  n_endtxt: string,
  n_starttime: string,
  n_deadline: string
}) => {
  return request.post<any>('/survey/setBase', data)
}

/**
 * 问卷创建
 */
export const createQs = (data: {
  status: string,
  naire: any
}) => {
  return request.post<any>('/survey/save', data)
}

/**
 * 获取问卷题目类型
 */
export const getNaireClass = (data: {
  n_id: string
}) => {
  return request.post<any>('/show/detail', data)
}

/**
 * 问卷模板列表
 */
export const getTemplate = (data: {
  isSys: boolean,
  offset: number,
  limit: number
}) => {
  return request.post<any>('/templates/lists', data)
}

/**
 * 模板问卷复制
 */
export const copyTemplate = (data: {
  surveyId: string
}) => {
  return request.post<any>('/templates/copyToSurvey', data)
}

/**
 * 回收站列表
 */
export const getRecyleList = (data: {
  offset: number,
  limit: number
}) => {
  return request.post<any>('/recycle/lists', data)
}

/**
 * 回收站恢复问卷
 */
export const recoverNaire = (data: {
  surveyId: string
}) => {
  return request.post<any>('/recycle/renew', data)
}

/**
 * 回收站单独删除问卷
 */
export const singleDel = (data: {
  surveyId: string
}) => {
  return request.post<any>('/recycle/del', data)
}

/**
 * 回收站清空问卷
 */
export const clearAll = () => {
  return request.post<any>('/recycle/delAll')
}
