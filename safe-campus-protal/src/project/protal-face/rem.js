;(function() {
  var screenW = document.documentElement.clientWidth || document.body.clientWidth
  var hDom = document.getElementsByTagName('html')[0]
  if (screenW < 420) screenW = 420
  hDom.style.fontSize = screenW / 19.2 + 'px'
})()
