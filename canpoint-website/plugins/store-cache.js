export default function (ctx) {
  // 离开页面 刷新前 将store中的数据存到localStorage
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('storeCache', JSON.stringify(ctx.store.state))
  })
  // 获取localStorage中的store数据
  const storeCache = sessionStorage.getItem('storeCache')
  if (storeCache) {
    // 将localStorage中的store数据替换到store中
    ctx.store.replaceState(JSON.parse(storeCache))
  }
}
