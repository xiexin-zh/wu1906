import React from 'react';
import * as echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

function BarChart(props) {
  const getOption = () => {
    const { xAxisData, yAxisMax = 100, seriesData, color } = props;
    return {
      title: {
        text: '已办结案件情况(%)',
        left: '20px', // 标题位置
        // subtext: '副标题',
        subtextStyle: {}, // 副标题文本样式
        textStyle: {
          // 文字颜色
          color: '#000000',
          // 字体风格,'normal','italic','oblique'
          fontStyle: 'normal',
          // 字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
          fontWeight: '400',
          // 字体大小
          fontSize: 14,
        },
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: '#F0F0F0',
              width: 1,
            },
          },
          axisLabel: {
            color: '#000',
          },
        },
      ],
      yAxis: {
        type: 'value',
        max: yAxisMax,
        min: 0,
        minInterval: 1,
        boundaryGap: [0, 0.1],
        axisTick: {
          show: false, // 是否显示坐标轴刻度
        },
        axisLine: {
          lineStyle: {
            color: '#F0F0F0',
            width: 1,
          },
        },
        axisLabel: {
          color: '#000',
        },
        splitLine: {
          lineStyle: {
            color: '#F0F0F0',
          },
        },
      },
      grid: {
        x: 50,
        y: 50,
        x2: 50,
        y2: 50,
      },
      series: [
        {
          name: '',
          type: 'bar',
          barWidth: '40%',
          data: seriesData,
          label: {
            show: true,
            color: color.start,
            formatter(value) {
              const { data } = value;
              return `${data}%`;
            },
            position: 'top',
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: color.start,
                },
                {
                  offset: 1,
                  color: color.end,
                },
              ]),
            },
          },
        },
      ],
    };
  };
  return <ReactEcharts option={getOption()} />;
}

export default BarChart;
