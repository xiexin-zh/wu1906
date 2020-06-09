import React from 'react';
import { connect } from 'dva';
import { DatePicker, Select } from 'antd';
import html2canvas from 'html2canvas';
import moment from 'moment';
import { formatDay, getRandomColor, downloadFile } from '@/utils/tools';
import SelectDay from '@/components/SelectDay';
import QuestionClassChart from '@/components/CharComponent/QuestionClassChart';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

class QuestionAnalysis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      days: [
        { type: 0, name: '今天' },
        { type: 3, name: '本周' },
        { type: 7, name: '月' },
      ],
      so_startime_type: 0,
      so_startime1: moment(),
      so_startime2: moment().add(1, 'day'),

      classLevel: [
        { level: '1', name: '一级分类' },
        { level: '2', name: '二级分类' },
        { level: '3', name: '三级分类' },
      ],
      currentLevel: '一级分类',
      levelList: [
        { id: '1', name: '市场管理', count: 40655 },
        { id: '2', name: '农村管理', count: 6952 },
        { id: '3', name: '供暖', count: 31168 },
        { id: '4', name: '公共安全', count: 6488 },
        { id: '5', name: '物业管理', count: 13272 },
        { id: '6', name: '小区配套+房屋权属', count: 7141 },
        { id: '7', name: '市容环卫', count: 9736 },
        { id: '8', name: '拆迁+群租房', count: 7100 },
        { id: '9', name: '交通管理', count: 9197 },
        { id: '10', name: '供水+供电', count: 6935 },
        { id: '11', name: '市政', count: 8183 },
        { id: '12', name: '施工管理+城市绿化', count: 5883 },
        { id: '13', name: '违法建设', count: 7577 },
        { id: '14', name: '其他', count: 26398 },
        { id: '15', name: '环境保护', count: 7275 },
      ],
    };
  }

  downImg = () => {
    const ele = document.getElementById('chartRef');
    html2canvas(ele).then(canvas => {
      const imgUri = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      downloadFile(imgUri, '问题分类.png');
    });
  };

  // 今天/本周/月 method
  chooseSendDay = day => {
    const starT1 = {
      0: moment(),
      3: moment().startOf('isoweek'),
      7: moment().startOf('month'),
    };
    const starT2 = {
      0: moment().add(1, 'day'),
      3: moment().endOf('week'),
      7: moment().endOf('month'),
    };
    this.setState({
      so_startime_type: day,
      so_startime1: starT1[day],
      so_startime2: starT2[day],
    });
  };

  // DatePicker change method
  getSendDay = (days, time) => {
    this.setState({
      so_startime1: new Date(time[0]).getTime(),
      so_startime2: new Date(time[1]).getTime(),
      so_startime_type: Math.ceil(moment.duration(days[0].diff(moment())).asDays()),
    });
  };

  render() {
    const {
      days,
      so_startime_type,
      so_startime1,
      so_startime2,
      classLevel,
      currentLevel,
      levelList,
    } = this.state;

    let allCount = 0;
    levelList.forEach(item => {
      allCount += item.count;
    });
    const list =
      levelList.length > 0
        ? levelList.map(item => {
            return {
              ...item,
              color: getRandomColor(),
              point: `${((item.count / allCount) * 100).toFixed(2)}%`,
            };
          })
        : [];

    const gap = parseInt(list.length / 2, 0) + 1;
    const list1 = list.length > 2 ? list.slice(0, gap) : list;
    const list2 = list.length > 2 ? list.slice(gap, list.length) : [];

    return (
      <div className={styles.questionAnalysis}>
        <div className={styles.header}>
          <div className={styles.selectClass}>
            <div className={styles.leftBox}>
              <span className={styles.title}>集中问题(前十位)</span>
              <Select
                className={styles.selectOption}
                value={currentLevel}
                onChange={value => {
                  this.setState({
                    currentLevel: value,
                  });
                }}
              >
                {classLevel.map(item => {
                  return (
                    <Option key={item.level} value={item.level}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>
          <div className={styles.createTime}>
            <div className={styles.selectTime}>
              <SelectDay days={days} chooseDay={this.chooseSendDay} value={so_startime_type} />
              <RangePicker
                allowClear={false}
                className={styles.rangePicker}
                value={[
                  moment(formatDay(so_startime1), 'YYYY-MM-DD'),
                  moment(formatDay(so_startime2), 'YYYY-MM-DD'),
                ]}
                placeholder="请选择时间"
                onChange={this.getSendDay}
              />
            </div>
            <span className={styles.downImg} onClick={this.downImg}>
              下载图片
            </span>
          </div>
        </div>
        <main id="chartRef">
          <div className={styles.echarts}>
            <QuestionClassChart data={list} hoverOffset={10} />
          </div>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              {list1.length > 0 &&
                list1.map(item => {
                  return (
                    <li key={item.id}>
                      <span className={styles.circle} style={{ backgroundColor: item.color }} />
                      <span className={styles.levelName}>{item.name}</span>
                      <span className={styles.levelPoint}>{`，${item.point}`}</span>
                      <span className={styles.levelCount}>&nbsp;{`(${item.count})`}</span>
                    </li>
                  );
                })}
            </div>
            <div className={styles.legendItem}>
              {list2.length > 0 &&
                list2.map(item => {
                  return (
                    <li key={item.id}>
                      <span className={styles.circle} style={{ backgroundColor: item.color }} />
                      <span className={styles.levelName}>{item.name}</span>
                      <span className={styles.levelPoint}>{`，${item.point}`}</span>
                      <span className={styles.levelCount}>&nbsp;{`(${item.count})`}</span>
                    </li>
                  );
                })}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

QuestionAnalysis.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(QuestionAnalysis);
