const pie = {
  title: {
    text: '2014 年某网站各浏览器访问量占比',
  },
  tooltip: {
    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        style: {},
      },
    },
  },
  series: [
    {
      type: 'pie',
      name: '浏览器占比',
      data: [
        ['Firefox', 45.0],
        ['IE', 26.8],
        {
          name: 'Chrome',
          y: 12.8,
          sliced: true,
          selected: true,
        },
        ['Safari', 8.5],
        ['Opera', 6.2],
        ['其他', 0.7],
      ],
    },
  ],
}
export default pie
