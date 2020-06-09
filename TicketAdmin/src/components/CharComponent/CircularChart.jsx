import React from 'react';

import ReactEcharts from 'echarts-for-react';

const styles = {
  circularEchartsFontBox: {
    position: 'absolute',
    top: '35%',
    left: '40%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#fff',
  },
  circularEchartsFont: {
    fontWeight: 'blod',
    fontSize: '20px',
  },
};
function CircularChart(props) {
  const getOption = () => {
    const { colors } = props;
    const option = {
      color: colors,
      series: [
        {
          name: '来电主题',
          type: 'pie',
          legendHoverLink: true, // 联动高亮
          hoverAnimation: true, // 放大动画效果
          labelLine: {
            // 去掉圆周边延长线
            show: false,
          },
          data: [
            { value: 10 / 30, name: '个人' },
            { value: 20 / 30, name: '企业' },
          ],
        },
      ],
    };
    return option;
  };

  return (
    <div style={{ width: '160px', height: '160px', position: 'relative' }}>
      <ReactEcharts option={getOption()} style={{ width: '160px', height: '160px' }} />
      <div style={styles.circularEchartsFontBox}>
        <span>今日</span>
        <span style={styles.circularEchartsFont}>30</span>
      </div>
    </div>
  );
}

export default CircularChart;
