const unReport = (data) => {
  const categories = []
  const yesReport = []
  const noReport = []
  data.forEach(item => {
    categories.push(item.date)
    yesReport.push(0)
    noReport.push(item.userCount)
  })
  return {
    credits: {
      enabled: false, // 禁用版权信息
    },
    title: {
      text: '',
      style: {
        color: '#fff',
      },
    },
    yAxis: {
      gridLineColor: '#999',
      gridLineDashStyle: 'longdash',
      splitLine: {
        show: true,
      },
      labels: {
        style: {
          color: '#fff',
        },
      },
      title: {
        text: '人数',
        style: {
          color: '#fff',
        },
      },
    },
    chart: {
      backgroundColor: null,
      type: 'areaspline',
    },
    plotOptions: {
      areaspline: {
        dataLabels: {
          enabled: true,
          color: '#fff',
        },
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
      categories: categories,
      crosshair: true,
    },
    series: [
      {
        name: '已上报',
        color: 'rgb(0, 186, 255)',
        data: yesReport,
      },
      {
        name: '未上报',
        color: '#fff',
        data: noReport,
      },
    ],
    legend: {
      align: 'right',
      verticalAlign: 'top',
      borderColor: '#fff',
      y: 0,
      itemStyle: {
        color: '#fff',
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
            },
          },
        },
      ],
    },
  }
}

export default unReport
