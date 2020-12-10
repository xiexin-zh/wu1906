import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'
/**
 * @param ele要生成 pdf 的DOM元素（容器）
 * @param pdfFileName     PDF文件生成后的文件名字
 * @param type     类型（download：下载到本地）upload:上传到服务器
 * @param callback     接收返回的文件流函数,因为是异步的
 * */
export const getPdfFromHtml = function(ele, pdfFileName, type, callback) {
  const eleW = ele.offsetWidth// 获得该容器的宽
  //   let eleH = ele.offsetHeight // 获得该容器的高
  const eleH = ele.scrollHeight// 获得该容器的高
  const eleOffsetTop = ele.offsetTop// 获得该容器到文档顶部的距离
  const eleOffsetLeft = ele.offsetLeft// 获得该容器到文档最左的距离
  var canvas = document.createElement('canvas')
  var abs = 0
  const winIn = document.documentElement.clientWidth || document.body.clientWidth// 获得当前可视窗口的宽度（不包含滚动条）
  const winOut = window.innerWidth// 获得当前窗口的宽度（包含滚动条）
  if (winOut > winIn) {
    // abs = (win_o - win_i)/2;    // 获得滚动条长度的一半
    abs = (winOut - winIn) / 2// 获得滚动条宽度的一半
  }
  canvas.width = eleW * 2// 将画布宽&&高放大两倍
  canvas.height = eleH * 2
  var context = canvas.getContext('2d')
  context.scale(2, 2) // 增强图片清晰度
  context.translate(-eleOffsetLeft - abs, -eleOffsetTop)
  html2canvas(ele, {
    dpi: 300,
    useCORS: true// 允许canvas画布内可以跨域请求外部链接图片, 允许跨域请求。
  }).then(canvas => {
    var contentWidth = canvas.width
    var contentHeight = canvas.height
    // 一页pdf显示html页面生成的canvas高度;
    var pageHeight = (contentWidth / 400) * 841.89 // 这样写的目的在于保持宽高比例一致 pageHeight/canvas.width = a4纸高度/a4纸宽度// 宽度和canvas.width保持一致
    // 未生成pdf的html页面高度
    var leftHeight = contentHeight
    // 页面偏移
    var position = 0
    // a4纸的尺寸[595.28,841.89],单位像素，html页面生成的canvas在pdf中图片的宽高
    var imgWidth = 595.28
    var imgHeight = (595.28 / contentWidth) * contentHeight
    var pageData = canvas.toDataURL('image/jpeg', 1.0)
    var pdf = new JsPDF('', 'pt', 'a4')
    // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
    // 当内容未超过pdf一页显示的范围，无需分页
    if (leftHeight < pageHeight) {
      // 在pdf.addImage(pageData, 'JPEG', 左，上，宽度，高度)设置在pdf中显示；
      pdf.addImage(pageData, 'JPEG', 5, 0, imgWidth, imgHeight)
      // pdf.addImage(pageData, 'JPEG', 20, 40, imgWidth, imgHeight);
    } else {
      // 分页
      while (leftHeight > 0) {
        pdf.addImage(pageData, 'JPEG', 5, position, imgWidth, imgHeight)
        leftHeight -= pageHeight
        position -= 841.89
        // 避免添加空白页
        if (leftHeight > 0) {
          pdf.addPage()
        }
      }
    }
    if (type === 'download') {
      pdf.save(pdfFileName + '.pdf')
    } else if (type === 'upload') {
      const dataUrl = pdf.output('dataurlstring')
      callback(dataUrl)
      // callback(dataUrl.split(',')[1])
    }
  })
}

export const htmlToImg = function(ele, name, type, imgCallback) {
  // const self = this
  event.preventDefault()
  const canvas2 = document.createElement('canvas')
  const _canvas = ele
  const w = parseInt(window.getComputedStyle(_canvas).width)
  const h = parseInt(window.getComputedStyle(_canvas).height)
  // 放大canvas画布，然后放在较小的容器内，像素会升高
  canvas2.width = w * 2
  canvas2.height = h * 2
  canvas2.style.width = w + 'px'
  canvas2.style.height = h + 'px'
  const context = canvas2.getContext('2d')
  context.scale(2, 2)
  const a = document.createElement('a')
  html2canvas(ele, {
    canvas: canvas2
  }).then(function (canvas) {
    const fileName = `${name}.jpg`
    const imgUri = canvas.toDataURL('image/jpeg', 2) // 获取生成的图片的url
    // console.log(imgUri)
    // 下载方法
    const blob = dataURLToBlob(imgUri)
    if (type === 'download') {
      a.setAttribute('href', URL.createObjectURL(blob))
      // 这块是保存图片操作  可以设置保存的图片的信息
      a.setAttribute('download', fileName + '.png')
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(blob)
      document.body.removeChild(a)
    } else if (type === 'upload') {
      this.uploadFiles(blob)
    }
  })
}
// base转换为流的方法
function dataURLToBlob(dataurl) {
  // console.log(dataurl)
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}
