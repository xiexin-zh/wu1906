<template>
  <div class="circle-one pos-box u-fx-ac-jc">
    <div class="ring" style="width: 150px; height: 150px">
      <canvas id="tutorial"></canvas>
      <span class="fraction">
        <span class="number">0</span>
        <span class="small">%</span>
      </span>
      <span class="title">巡查率</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CircleOne',
  props: {
    total: {
      type: Number || String,
      default: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      let radius = 60 //外环半径
      let thickness = 10 //圆环厚度
      let innerRadius = radius - thickness //内环半径
      let startAngle = -90 //开始角度
      let endAngle = 180 //结束角度
      let x = 0 //圆心x坐标
      let y = 0 //圆心y坐标
      let canvas = document.getElementById('tutorial')
      canvas.width = 150
      canvas.height = 150

      let ctx = canvas.getContext('2d')
      ctx.translate(canvas.width / 2, canvas.height / 2) //将绘图原点移到画布中央
      ctx.rotate(angle2Radian(225)) //将画布旋转225度
      ctx.fillStyle = '#eee' //初始填充颜色
      renderRing(startAngle, endAngle)

      //渲染函数
      function renderRing(startAngle, endAngle) {
        ctx.beginPath()

        //绘制外环
        ctx.arc(x, y, radius, angle2Radian(startAngle), angle2Radian(endAngle))

        //计算外环与内环第一个连接处的中心坐标
        let oneCtrlPoint = calcRingPoint(x, y, innerRadius + thickness / 2, endAngle)

        //绘制外环与内环第一个连接处的圆环
        ctx.arc(oneCtrlPoint.x, oneCtrlPoint.y, thickness / 2, angle2Radian(-90), angle2Radian(270))

        // //绘制内环
        ctx.arc(x, y, innerRadius, angle2Radian(endAngle), angle2Radian(startAngle), true)

        //计算外环与内环第二个连接处的中心坐标
        let twoCtrlPoint = calcRingPoint(x, y, innerRadius + thickness / 2, startAngle)

        //绘制外环与内环第二个连接处的圆环
        ctx.arc(twoCtrlPoint.x, twoCtrlPoint.y, thickness / 2, angle2Radian(-90), angle2Radian(270))

        ctx.fill()
        // ctx.stroke()
      }

      //计算圆环上点的坐标
      function calcRingPoint(x, y, radius, angle) {
        let res = {}
        res.x = x + radius * Math.cos((angle * Math.PI) / 180)
        res.y = y + radius * Math.sin((angle * Math.PI) / 180)
        return res
      }

      //角度转弧度
      function angle2Radian(angle) {
        return (angle * Math.PI) / 180
      }

      //进度条颜色
      var lingrad = ctx.createLinearGradient(0, 0, 150, 0)
      lingrad.addColorStop(0, '#71A6EEFF')
      lingrad.addColorStop(1, '#fff')
      ctx.fillStyle = lingrad

      //开始绘画
      let tempAngle = startAngle
      let total = 1000 //总分
      let now = 800 //当前分数
      // let percent = now / total //百分比
      let percent =this.total/100 //百分比
      let twoEndAngle = percent * 270 + startAngle
      let step = (twoEndAngle - startAngle) / 80
      let numberSpan = document.querySelector('.number')
      let inter = setInterval(() => {
        if (tempAngle > twoEndAngle) {
          clearInterval(inter)
        } else {
          numberSpan.innerText = percent * 100
          tempAngle += step
        }
        renderRing(startAngle, tempAngle)
      }, 20)
    })
  }
}
</script>

<style lang="less" scoped>
.ring {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
}

.fraction {
  position: absolute;
  font-size: 30px;
  font-weight: bold;
  color: #71A6EEFF;
}

.small {
  font-size: 12px;
  font-weight: lighter;
}

.title {
  font-size: 20px;
  bottom: 10px;
  color: #71A6EEFF;
  position: absolute;
}
</style>
