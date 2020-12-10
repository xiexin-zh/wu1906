const circle = {
  credits: {
    enabled: false, // 禁用版权信息
  },
  chart: {
    backgroundColor: null,
  },
  title: {
    text: '风险占比',
    style: {
      color: '#fff',
    },
    align: 'center',
    verticalAlign: 'middle',
    y: 50,
  },
  tooltip: {
    headerFormat: '{series.name}<br>',
    pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>',
  },
  plotOptions: {
    pie: {
      dataLabels: {
        enabled: true,
        distance: -50,
        style: {
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0px 1px 2px black',
        },
      },
      startAngle: -90, // 圆环的开始角度
      endAngle: 90, // 圆环的结束角度
      center: ['50%', '75%'],
    },
  },
  series: [
    {
      type: 'pie',
      name: '风险占比',
      innerSize: '50%',
      data: [
        ['有接触史', 45.0],
        ['去过医院', 26.8],
        ['有隔离经历', 12.8],
        ['疑似', 8.5],
        ['确证', 6.2],
      ],
    },
  ],
}
export default circle
