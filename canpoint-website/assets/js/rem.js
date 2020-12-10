;
(function () {
  let screenW = document.documentElement.clientWidth || document.body.clientWidth
  const hDom = document.getElementsByTagName('html')[0]
  if (screenW < 767) {
    if (screenW <= 375) screenW = 480
    hDom.style.fontSize = screenW / 12 + 'px'
  } else if (screenW >= 767 && screenW < 1024) {
    hDom.style.fontSize = screenW / 16 + 'px'
  } else {
    hDom.style.fontSize = screenW / 19.2 + 'px'
  }
})()
