import $http from '@u/libs/ajax-serve'

/**
 * 点击应用模块获取菜单列表
 * @param { object } appInfo 应用信息
 * @param { number } index 当前应用的索引
 * @param { component } vm 组件实例
 * @param { Document} object iframe对象
 */
const entryApp = async (appInfo, index, vm, callback) => {
  const { appCode, appCategoryCode, plateformType } = appInfo
  const res = await $http.get({
    url: '/protal_v3_11101/canpointMenu/menu/list',
    params: {
      appCode,
      menuCategroy: appCategoryCode,
      plateformType,
      schoolCode: window.sessionStorage.getItem('schoolCode')
    }
  })
  // 存储当前点击的应用菜单项和索引
  vm.setState({
    currentAppName: appInfo.appName,
    appIndex: index,
    menuList: res.data
  })
  // 获取菜单列表第一项
  if (res.data.length === 0) {
    vm.$message.warning('该应用暂未分配菜单权限')
    return
  }
  const menuInfo = res.data[0].children.length > 0 ? res.data[0].children[0] : res.data[0]
  if (callback) callback(menuInfo.menuUrl, menuInfo.id)
}

/**
 * 点击菜单进入到对应的路由界面
 * @param { string } path 菜单项url地址
 * @param { Document} object iframe对象
 */

const entrySystem = (path, dom) => {
  if (process.env.NODE_ENV === 'production') {
    const url = path.split('#/')
    const urlPath = `/pc-protal-v3${url[0]}#/${url[1]}`
    dom.src = `${urlPath}`
  } else {
    const params = path.split('#/')
    dom.src = `${window.location.origin}${params[0]}.html#/${params[1]}`
  }
}

export { entryApp, entrySystem }
