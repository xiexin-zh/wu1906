import React from 'react';
import ReactEcharts from 'echarts-for-react';

function LineChart(props) {
  const getOption = () => {
    const { xAxisData, yAxisMax = 1000, seriesData, showTitle = true } = props;
    return {
      title: {
        show: showTitle,
        text: '变化趋势(本月)',
        // left:'left',// 标题位置
        // subtext: '副标题',
        subtextStyle: {}, // 副标题文本样式
        textStyle: {
          // 文字颜色
          color: 'rgba(51, 51, 51, 1)',
          // 字体风格,'normal','italic','oblique'
          fontStyle: 'normal',
          // 字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
          fontWeight: '400',
          // 字体大小
          fontSize: 16,
        },
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        // boundaryGap: false,// 左边从头开始画
        axisTick: {
          show: false, // 是否显示坐标轴刻度
        },
        data: xAxisData,
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
          type: 'line',
          data: seriesData,
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#6E84FC',
                },
                {
                  offset: 0.5,
                  color: '#98A7F6',
                },
                {
                  offset: 1,
                  color: '#FFF',
                },
              ],
            },
          },
          lineStyle: {
            normal: {
              color: '#6E84FC',
            },
          },
          itemStyle: {
            normal: {
              color: '#6E84FC',
            },
          },
          z: 2,
        },
      ],
    };
  };
  return <ReactEcharts option={getOption()} />;
}

export default LineChart;
