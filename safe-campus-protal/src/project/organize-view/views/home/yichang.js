const yichang = (data) => {
  const categories = []
  const studentData = []
  const teacherData = []
  data.forEach(item => {
    categories.push(item.date)
    studentData.push(item.studentCount)
    teacherData.push(item.teacherCount)
  })
  return {
    credits: {
      enabled: false, // 禁用版权信息
    },
    chart: {
      showAxes: true,
      borderColor: '#fff',
      plotBorderColor: '#fff',
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
      align: 'right',
      verticalAlign: 'top',
      borderColor: '#fff',
      y: 0,
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
      categories: categories,
      crosshair: true,
    },
    yAxis: {
      gridLineColor: '#999',
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
    tooltip: {
      // head + 每个 point + footer 拼接成完整的 table
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} 人</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          color: '#fff',
        },
        borderWidth: 2,
      },
    },
    series: [
      {
        name: '学生',
        color: 'rgb(0, 186, 255)',
        data: studentData,
      },
      {
        name: '教职工',
        color: '#fff',
        data: teacherData,
      },
    ],
  }
}

export default yichang
