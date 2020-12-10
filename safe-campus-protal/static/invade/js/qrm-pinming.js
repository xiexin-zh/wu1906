$(function () {
  // 控制边框高亮
  $('.qrm-input-border').click(function () {
    if ($('.qrm-input').val() == '') {
      $('.qrm-pinming').css('border', '1px solid #409EFF')
      $('.qrm-border1').show()
    } else {
      $('.qrm-border1').show()
      $('.qrm-border2').show()
      $('.qrm-pinming').css('border', '1px solid #409EFF')
    }
  })
  // 第一层
  var lev1
  var lev2
  // 第一层 事件代理
  $('body').on('click', '.qrm-lev-1>li', function () {
    // 控制背景颜色高亮
    $(this)
      .addClass('active')
      .siblings('li')
      .removeClass('active')
    // 先将input中的值置空
    lev1 = ''
    lev2 = ''
    // 获取当前点击的li的子元素的HTML节点 将获取的节点放到页面显示的第二级中
    var html1 = $(this)
      .children('.li-zi-1')
      .html()
    $('.qrm-lev-2').html(html1)
    $('.qrm-border2').show()
    $('.qrm-border3').hide()
    $('.qrm-lev-3').html('')
    //      $(".qrm-lev-4").html("");
    // 获取当前点击的li的span中的值 将值传到input中
    lev1 = $(this)
      .children('span')
      .html()
    $('.qrm-input').val('')
    $('.qrm-input').val(lev1)
  })
  // 第二层 事件代理

  $('body').on('click', '.qrm-lev-2>li', function () {
    $(this)
      .addClass('active')
      .siblings('li')
      .removeClass('active')
    //      console.log($(this).children(".li-zi-2").html())
    if (
      $(this)
        .children('.li-zi-2')
        .html() == undefined
    ) {
      lev2 = $(this)
        .children('span')
        .html()
      $('.qrm-input').val(lev1 + '/' + lev2)
      $('.qrm-border1').hide()
      $('.qrm-border2').hide()
      $('.qrm-pinming').css('border', '1px solid #ddd')
    } else {
      var html2 = $(this)
        .children('.li-zi-2')
        .html()
      lev2 = $(this)
        .children('span')
        .html()
    }
    if (
      $(this)
        .parent()
        .parent()
        .next()
        .children('.qrm-lev')
        .html() == ''
    ) {
      // 去掉输入框的高亮状态
      $('.qrm-border1').hide()
      $('.qrm-border2').hide()
      $('.qrm-pinming').css('border', '1px solid #ddd')
    }
  })

  // 给四个区域绑定点击事件 判断当前的下一个区域 如果为空 点击当前区域 qrm-pinming-panel 隐藏 并且把input高亮去掉
  $('body').on('click', '.qrm-lev>li', function () {
    if (
      $(this)
        .parent()
        .parent()
        .next()
        .children('.qrm-lev')
        .html() == ''
    ) {
      // 去掉输入框的高亮状态
      $('.qrm-border1').hide()
      $('.qrm-border2').hide()
      $('.qrm-pinming').css('border', '1px solid #ddd')
    }
  })
})
// 点击空白处隐藏div
$(document).click(function (event) {
  var x1 = $('.box') // 设置目标区域
  if (!x1.is(event.target) && x1.has(event.target).length === 0) {
    // Mark 1
    $('.qrm-border1').hide()
    $('.qrm-border2').hide()
    $('.qrm-pinming').css('border', '1px solid #ddd')
  }
})
