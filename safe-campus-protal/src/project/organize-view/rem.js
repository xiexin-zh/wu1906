;(function(doc, win) {
  const fn = () => {
    const docEl = doc.documentElement
    const clientWidth = docEl.clientWidth
    if (!clientWidth) return
    alert(100 * (clientWidth / 1920))
    docEl.style.fontSize = 100 * (clientWidth / 1920) + 'px'
  }
  if (!doc.addEventListener) return
  win.addEventListener('resize', fn)
  doc.addEventListener('DOMContentLoaded', fn)
})(document, window)
