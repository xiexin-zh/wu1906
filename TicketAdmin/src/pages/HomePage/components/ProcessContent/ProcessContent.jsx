import React from 'react';
import { connect } from 'dva';
import { DatePicker, Table } from 'antd';
import moment from 'moment';
import styles from './ProcessContent.less';
import { week_day_time, dateIsSame } from '@/utils/weekTime';

class ProcessContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWeek: 'week',
      // eslint-disable-next-line react/no-unused-state
      currentWeekDay: moment(),
      data: [
        {
          title: '新工单',
          imgSrc: require('../../images/ico_xgd.png'),
          key0: 20,
          key1: 20,
          key2: 20,
        },
        {
          title: '已办结',
          imgSrc: require('../../images/ico_ybj.png'),
          key0: 15,
          key1: 3,
          key2: 0,
        },
        {
          title: '办理中',
          imgSrc: require('../../images/ico_blz.png'),
          key0: 2,
          key1: 17,
          key2: 18,
        },
        {
          title: '退回',
          imgSrc: require('../../images/ico_th.png'),
          key0: 3,
          key1: '-',
          key2: 2,
        },
      ],
      tableHeadTime: [],
    };
    this.tableInfoKey = {
      key0: 'key0',
      key1: 'key1',
      key2: 'key2',
      key3: 'key3',
      key4: 'key4',
      key5: 'key5',
      key6: 'key6',
    };
  }

  componentDidMount() {
    this.setWeekDay();
  }

  setWeekDay = st => {
    const t = week_day_time(st);
    const timeArr = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < t.length; i++) {
      timeArr.push({
        title: t[i].split(',')[1],
        time: t[i].split(',')[0],
        key: `key${i}`,
      });
    }
    this.setState({
      tableHeadTime: timeArr,
    });
  };

  get columns() {
    const { tableHeadTime } = this.state;

    const columns = [
      {
        title: '',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <div style={{ textAlign: 'left' }}>
            <img src={record.imgSrc} alt="" style={{ marginRight: '12px' }} />
            <span>{text}</span>
          </div>
        ),
      },
    ];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < tableHeadTime.length; i++) {
      columns.push({
        title: <> {this.headerTrStyle(tableHeadTime[i])}</>,
        dataIndex: this.tableInfoKey[tableHeadTime[i].key],
        key: tableHeadTime[i].key,
      });
    }

    return columns;
  }

  headerTrStyle = times => {
    const { currentWeekDay } = this.state;

    return (
      <div
        className={`${styles.tableHeadTr} ${
          dateIsSame(currentWeekDay, times.time) ? styles.headActive : ''
        }`}
      >
        <span>{times.title}</span>
        <span>{times.time}</span>
      </div>
    );
  };

  changeWeek = e => {
    const weeks = e.target.getAttribute('data-week');
    const wk = {
      lastWeek: moment().weekday(-7),
      week: moment(),
    };
    this.setState(
      {
        currentWeekDay: wk[weeks],
        currentWeek: weeks,
      },
      () => {
        this.setWeekDay(wk[weeks]);
      },
    );
  };

  onPickerChange = (d, st) => {
    this.setState(
      {
        currentWeekDay: moment(d),
        currentWeek: '',
      },
      () => {
        this.setWeekDay(st);
      },
    );
  };

  renderProcessHead = () => {
    const { currentWeek, currentWeekDay } = this.state;

    return (
      <div className={styles.agencyTotalBox}>
        <span className={styles.agencyTotalFont}>
          <img src={require('../../images/handle.png')} alt="" />
          办理进程
        </span>
        <div className={styles.datePickerBox}>
          <div className={styles.selectWeek}>
            <span
              className={currentWeek === 'lastWeek' ? styles.spanActive : ''}
              onClick={this.changeWeek}
              data-week="lastWeek"
            >
              上周
            </span>
            <span
              className={currentWeek === 'week' ? styles.spanActive : ''}
              onClick={this.changeWeek}
              data-week="week"
            >
              本周
            </span>
          </div>
          <DatePicker value={currentWeekDay} onChange={this.onPickerChange} allowClear={false} />
        </div>
      </div>
    );
  };

  renderProcessContent = () => {
    const { data } = this.state;
    return (
      <Table
        className={styles.processContentTable}
        rowKey={row => row.title}
        pagination={false}
        columns={this.columns}
        dataSource={data}
        scroll={{ x: 800 }}
        rowClassName={record => `${record.title === '办理中' ? styles.thFontColor : ''}`}
      />
    );
  };

  render() {
    return (
      <div className={styles.ProcessContentBox}>
        {this.renderProcessHead()}
        {this.renderProcessContent()}
      </div>
    );
  }
}

ProcessContent.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(ProcessContent);
