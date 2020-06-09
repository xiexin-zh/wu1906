import React from 'react';
import { connect } from 'dva';
import { DatePicker, Progress, Table, Radio } from 'antd';
import moment from 'moment';
import { formatDay } from '@/utils/tools';
import styles from './DynamicAnalysis.less';

import SelectDay from '../../../../WorkOrderManagement/WorkOrderDisposal/components/SelectDay';
import CircularChart from '../../../../../components/CharComponent/CircularChart.jsx';
import LineChart from '../../../../../components/CharComponent/LineChart.jsx';

const { RangePicker } = DatePicker;

class DynamicAnalysis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      btnVal: 'added',
      days: [
        { type: 0, name: '今天' },
        { type: 3, name: '本周' },
        { type: 7, name: '月' },
      ],
      so_startime_type: 0,
      so_startime1: moment(),
      so_startime2: moment().add(1, 'day'),
      progressLists: [
        {
          color: '#249FDE',
          font: '事件总量(件)',
          num: 27,
        },
        {
          color: '#6DD400',
          font: '已办结(件)',
          num: 18,
        },
        {
          color: '#F7B500',
          font: '办理中(件)',
          num: 10,
        },
        {
          color: '#FA6400',
          font: '已退回(件)',
          num: 27,
        },
      ],
      percentageBar: [
        {
          color: '#FA6400',
          font: '不计入考核件(件)',
          num: 18,
          numTotal: 27,
        },
        {
          color: '#F7B500',
          font: '申请挂件(件)',
          num: 10,
          numTotal: 27,
        },
      ],
      datas: [
        {
          type: '诉求',
          num: '26',
          proportion: '90%',
        },
        {
          type: '建议',
          num: '4',
          proportion: '10%',
        },
        {
          type: '咨询',
          num: '',
          proportion: '',
        },
      ],
    };
    this.columns = [
      {
        id: '1',
        title: '类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        id: '2',
        title: '数量',
        dataIndex: 'num',
        key: 'num',
      },
      {
        id: '3',
        title: '占比',
        dataIndex: 'proportion',
        key: 'proportion',
      },
    ];
  }

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

  // 工单分析
  renderProgressContent = () => {
    const { progressLists, percentageBar } = this.state;

    return (
      <div className={styles.proBox}>
        <div className={styles.proBoxLeft}>
          {progressLists.map((item, index) => {
            return (
              <>
                <div key={item.font} className={styles.itemProBox}>
                  <Progress
                    type="circle"
                    percent={item.num}
                    format={percent => percent}
                    strokeColor={item.color}
                  />
                  <span>{item.font}</span>
                </div>
                <i
                  style={{
                    display: `${index === progressLists.length - 1 ? 'none' : 'inline-block'}`,
                  }}
                />
              </>
            );
          })}
        </div>
        <div className={styles.proBoxRight}>
          {percentageBar.map((item, index) => {
            return (
              <div
                className={styles.itemBoxs}
                key={item.font}
                style={{ marginBottom: `${index === 0 ? '32px' : '0'} ` }}
              >
                <span>{item.font}</span>
                <Progress
                  percent={item.num}
                  strokeColor={item.color}
                  format={percent => `${item.num} / ${item.numTotal} ${percent}%`}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 来电主题
  renderCallSubject = () => {
    return (
      <div className={styles.callTheme}>
        <p>来电主题</p>
        <div className={styles.callThemeContent}>
          <CircularChart colors={['#80D8FF', '#8C9EFF']} />
          <div className={styles.callThemeCategory}>
            <span className={styles.personal}>
              <i style={{ background: 'rgba(140, 158, 255, 1)' }} />
              个人 <span>20</span>
              <span>90%</span>
            </span>
            <span className={styles.enterprise}>
              <i style={{ background: 'rgba(128, 216, 255, 1)' }} />
              企业 <span>10</span>
              <span>10%</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  // 工单渠道
  renderWorkOrderChannel = () => {
    return (
      <div className={styles.callTheme} style={{ marginLeft: '25px' }}>
        <p>工单渠道</p>
        <div className={styles.callThemeContent}>
          <CircularChart colors={['#F7B500', '#FA6400']} />
          <div className={styles.callThemeCategory}>
            <span className={styles.personal}>
              <i style={{ background: 'rgba(250,100,0,1)' }} />
              热线 <span>20</span>
              <span>60%</span>
            </span>
            <span className={styles.enterprise}>
              <i style={{ background: 'rgba(247,181,0,1)' }} />
              网络 <span>10</span>
              <span>40%</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  // 工单类型
  renderJobType = () => {
    const { datas } = this.state;
    return (
      <div className={styles.jobTypeBox}>
        <p>工单类型</p>
        <Table
          align="center"
          className={styles.processContentTable}
          rowKey={row => row.id}
          pagination={false}
          columns={this.columns}
          dataSource={datas}
        />
      </div>
    );
  };

  handleSizeChange = e => {
    this.setState({ btnVal: e.target.value });
  };

  // 变化趋势
  renderTrends = () => {
    const { btnVal } = this.state;
    return (
      <div
        style={{
          marginTop: '8px',
          position: 'relative',
          borderTop: '8px solid rgba(36,159,222,0.05)',
        }}
      >
        <LineChart
          xAxisData={[
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月',
          ]}
          seriesData={[100, 200, 300, 600, 300, 700, 500, 300, 600, 200, 800, 100]}
        />
        <Radio.Group value={btnVal} onChange={this.handleSizeChange} className={styles.btnState}>
          <Radio.Button value="added" size="small">
            新增
          </Radio.Button>
          <Radio.Button value="return" size="small">
            退回
          </Radio.Button>
          <Radio.Button value="closing" size="small">
            办结
          </Radio.Button>
        </Radio.Group>
      </div>
    );
  };

  render() {
    const { days, so_startime_type, so_startime1, so_startime2 } = this.state;
    return (
      <div className={styles.DynamicAnalysisBox}>
        <header>
          <span>工单分析</span>
          <div className={styles.createTime}>
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
        </header>
        <main>
          {this.renderProgressContent()}
          <div className={styles.roundCake}>
            {this.renderCallSubject()}
            {this.renderWorkOrderChannel()}
            {this.renderJobType()}
          </div>
          {this.renderTrends()}
        </main>
      </div>
    );
  }
}

DynamicAnalysis.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(DynamicAnalysis);
