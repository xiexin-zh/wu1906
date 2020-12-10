const area = {
  credits: {
    enabled: false, // 禁用版权信息
  },
  chart: {
    spacing: [0, 0, 0, 20],
    type: 'variablepie',
    backgroundColor: null,
  },
  title: {
    text: '',
  },
  series: [
    {
      minPointSize: 10,
      innerSize: '20%',
      zMin: 0,
      name: 'countries',
      data: [
        {
          name: '武汉',
          y: 505370,
          z: 92.9,
        },
        {
          name: '天门',
          y: 551500,
          z: 118.7,
        },
        {
          name: '孝感',
          y: 312685,
          z: 124.6,
        },
        {
          name: '荆州',
          y: 78867,
          z: 137.5,
        },
        {
          name: '异常',
          y: 301340,
          z: 201.8,
        },
        {
          name: '潜江',
          y: 41277,
          z: 214.5,
        },
        {
          name: '仙桃',
          y: 357022,
          z: 235.6,
        },
      ],
    },
  ],
}

export default area
