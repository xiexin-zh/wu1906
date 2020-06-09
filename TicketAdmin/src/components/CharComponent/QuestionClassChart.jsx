import React from 'react';
import ReactEcharts from 'echarts-for-react';

function QuestionClassChart(props) {
  const getOption = () => {
    const { data, hoverOffset } = props;
    const seriesData =
      data.length > 0
        ? data.map(item => {
            return {
              value: item.count,
              name: item.name,
              itemStyle: {
                borderWidth: 10,
                borderColor: '#ffffff',
                color: item.color,
              },
            };
          })
        : [];
    return {
      backgroundColor: '#fff',
      tooltip: {
        trigger: 'item',
        // formatter: '{b}: {c} ({d}%)',
        formatter(datas) {
          const { name, percent, value } = datas;
          const str = `${datas.marker}${name}，${percent}%(${value})`;
          return str;
        },
        backgroundColor: '#fff',
        borderColor: 'rgba(36,159,222,0.19)',
        borderWidth: 1,
        padding: 10,
        textStyle: {
          color: '#333',
          fontSize: 14,
        },
      },
      series: [
        {
          name: '',
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['70%', '97%'],
          avoidLabelOverlap: false,
          hoverOffset,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: seriesData,
        },
      ],
    };
  };
  return <ReactEcharts option={getOption()} />;
}

export default QuestionClassChart;
