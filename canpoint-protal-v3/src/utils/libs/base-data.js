/**
 * @deprecated 云平台基础数据
 * @author 贺飞
 */
import $http from '@u/libs/ajax-serve'
import { Modal } from 'ant-design-vue'
const baseData = {
  /**
   * 获取班级列表
   * @param { string } schoolCode 学校code
   * @param { schoolYearCode } schoolCode 学年code
   */
  async getGradeList(schoolCode, schoolYearCode) {
    try {
      const res = await $http.post({
        url: '/protal_v3_11101/canpointClass/menu/second/third/tree',
        params: {
          schoolCode: schoolCode || window.sessionStorage.getItem('schoolCode'),
          schoolYearCode
        }
      })
      return res.data
    } catch (err) {
      return []
    }
  },
  /**
   * 获取运维端角色管理列表
   * @param { schoolCode } string 学校code
   */
  async getAdminRoleList(schoolCode) {
    try {
      const res = await $http.post({
        url: '/protal_v3_11101/canpointRole/list',
        params: {
          page: 1,
          size: 100,
          schoolCode: schoolCode || window.sessionStorage.getItem('schoolCode'),
          roleName: ''
        }
      })
      return res.data.records
    } catch (err) {
      return []
    }
  },
  /**
   * 获取局端职务管理列表
   * @param { schoolCode } string 学校code
   */
  async getDutyManageList(schoolCode) {
    try {
      const res = await $http.post({
        url: '/protal_v3_11101/canpointStation/page',
        params: {
          page: 1,
          size: 100,
          schoolCode: schoolCode || window.sessionStorage.getItem('schoolCode'),
          stationName: ''
        }
      })
      return res.data.records
    } catch (err) {
      return []
    }
  },
  /**
   * @description 获取启用中的学年
   * @param { schoolCode } string 学校code
   * @param { onOk } function 跳转到基础数据学年管理
   */
  async getUsingSchoolYear(schoolCode, onOk) {
    try {
      const res = await $http.get({
        url: '/protal_v3_11101/canpointSchoolYear/enable/info',
        params: {
          schoolCode: schoolCode || window.sessionStorage.getItem('schoolCode')
        }
      })
      if (!res.data && onOk) {
        Modal.warning({
          title: '提示',
          okText: '确定',
          content: '请设置学年',
          onOk
        })
        return
      }
      sessionStorage.setItem('schoolYear', JSON.stringify(res.data))
      return res.data
    } catch (err) {
      return {}
    }
  }
}

export default baseData
