Math.easeOutBounce = function (pos) {
  if (pos < 1 / 2.75) {
    return 7.5625 * pos * pos
  }
  if (pos < 2 / 2.75) {
    return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75
  }
  if (pos < 2.5 / 2.75) {
    return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375
  }
  return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375
}
const backSchool = {
  credits: {
    enabled: false, // 禁用版权信息
  },
  chart: {
    showAxes: true,
    backgroundColor: null,
    type: 'column',
  },
  title: {
    text: '',
    style: {
      color: '#fff',
    },
  },
  legend: {
    enabled: false,
    borderColor: '#fff',
    itemStyle: {
      color: '#fff',
    },
  },
  xAxis: {
    labels: {
      style: {
        color: '#fff',
      },
    },
    splitLine: {
      show: true,
    },
    categories: ['0301', '0302', '0304', '0305', '0306', '0307', '0308', '0309', '0310', '0311', '0312'],
    crosshair: true,
  },
  yAxis: {
    gridLineWidth: 1,
    gridLineColor: '#fff',
    gridLineDashStyle: 'longdash',
    splitLine: {
      show: true,
    },
    min: 0,
    labels: {
      style: {
        color: '#fff',
      },
    },
    title: {
      text: '数量 (人)',
      style: {
        color: '#fff',
      },
    },
  },
  plotOptions: {
    column: {
      dataLabels: {
        enabled: true,
        color: '#fff',
      },
      borderWidth: 1,
      animation: {
        duration: 2000,
        easing: 'easeOutBounce',
      },
    },
  },
  series: [
    {
      name: '人数',
      color: 'rgb(0, 186, 255)',
      data: [49, 271, 206, 129, 244, 176, 135, 148, 216, 194, 305],
    },
  ],
}

export default backSchool
