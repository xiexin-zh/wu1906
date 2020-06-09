import React from 'react';
import { connect } from 'dva';
import { DatePicker, Button, Table, Radio } from 'antd';
import moment from 'moment';
import { getRandomColor, formatDay, getRandomRgbColor } from '@/utils/tools';
import QuestionClassChart from '@/components/CharComponent/QuestionClassChart';
import LineChart from '@/components/CharComponent/LineChart';
import styles from './WeeklyAndMonthlyReport.less';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
// const { RangePicker } = DatePicker;

class WeeklyAndMonthlyReport extends React.Component {
  month = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        {
          key: 'day',
          tabHead: '日报',
          tabHeadImg: require('../images/D.png'),
          tabHeadImg1: require('../images/D1@2x.png'),
        },
        {
          key: 'week',
          tabHead: '周报',
          tabHeadImg: require('../images/fenxi@2x.png'),
          tabHeadImg1: require('../images/F.png'),
        },
        {
          key: 'month',
          tabHead: '月报',
          tabHeadImg: require('../images/B.png'),
          tabHeadImg1: require('../images/office@2x.png'),
        },
      ],
      activeKey: 'day',
      countList: [
        {
          key: '1',
          name: '新工单',
          count: 0,
          bgColor: 'rgba(224,32,32,0.1)',
          color: '#E02020',
          icon: require('../images/count1.png'),
        },
        {
          key: '2',
          name: '已办结',
          count: 0,
          bgColor: 'rgba(36,159,222,0.1)',
          color: '#249FDE',
          icon: require('../images/count2.png'),
        },
        {
          key: '3',
          name: '办理中',
          count: 0,
          bgColor: 'rgba(37,188,124,0.1)',
          color: '#25BC7C',
          icon: require('../images/count3.png'),
        },
        {
          key: '4',
          name: '已退回',
          count: 0,
          bgColor: '(250,100,0,0.1)',
          color: '#FA6400',
          icon: require('../images/count4.png'),
        },
      ],
      orderClass: [
        {
          key: '1',
          title: '日常',
          bgColor: 'rgba(109,212,0,0.1)',
          color1: '#A6EC00',
          color2: '#6DD400',
          nowCount: 188,
          allCount: 213,
        },
        {
          key: '2',
          title: '疫情',
          bgColor: 'rgba(250,100,0,0.1)',
          color1: '#FD9D00',
          color2: '#FA6400',
          nowCount: 94,
          allCount: 213,
        },
      ],
      day_columns: [
        {
          title: '编号',
          dataIndex: 'id',
          align: 'center',
        },
        {
          title: '工单号',
          dataIndex: 'orderId',
          align: 'center',
        },
        {
          title: '承办单位',
          dataIndex: 'dept',
          align: 'center',
        },
        {
          title: '问题分类(一级)',
          dataIndex: 'quesClass',
          align: 'center',
        },
      ],
      day_data: [],
      week_columns: [
        {
          title: '日期',
          dataIndex: 'date',
          align: 'center',
        },
        {
          title: '时间段',
          dataIndex: 'timeRange',
          align: 'center',
        },
        {
          title: '总量',
          dataIndex: 'count',
          align: 'center',
        },
        {
          title: '日常',
          dataIndex: 'daily',
          align: 'center',
        },
        {
          title: '京东',
          dataIndex: 'jd',
          align: 'center',
        },
        {
          title: '疫情',
          dataIndex: 'epidemic',
          align: 'center',
        },
      ],
      week_data: [
        {
          id: '1',
          date: '2020/05/18',
          timeRange: '05/02 09:00-05/16 18:00',
          count: 1320,
          daily: 3120,
          jd: 1320,
          epidemic: 20,
        },
        {
          id: '2',
          date: '2020/05/18',
          timeRange: '05/02 09:00-05/16 18:00',
          count: 1320,
          daily: 3120,
          jd: 1320,
          epidemic: 20,
        },
        {
          id: '3',
          date: '2020/05/18',
          timeRange: '05/02 09:00-05/16 18:00',
          count: 1320,
          daily: 3120,
          jd: 1320,
          epidemic: 20,
        },
        {
          id: '4',
          date: '2020/05/18',
          timeRange: '05/02 09:00-05/16 18:00',
          count: 1320,
          daily: 3120,
          jd: 1320,
          epidemic: 20,
        },
      ],
      quesList: [],
      companyList: [],
      allClassCount: 0,
      btnVal: 'added',
      appealCount: 182,
      centerName: '',
      time1: new Date(moment(`${formatDay(new Date())} 00:00:00`, dateFormat)).getTime(),
      time2: new Date(moment(`${formatDay(new Date())} 23:59:59`, dateFormat)).getTime(),
    };
  }

  componentDidMount() {
    this.getReportData();
  }

  getReportData = () => {
    this.getDayTotalNum();
    this.getDayTypeTotal();
    this.getDayQuesTypeTotal();
    this.getDayCompanyTotal();
    this.getDayTicketLists();
    this.getDayTotalInfo();
  };

  // 日报-工单状态
  getDayTotalNum = async () => {
    const { time1, time2, countList } = this.state;
    const { dispatch } = this.props;
    const params = {
      star_time: parseInt(time1 / 1000, 0),
      end_time: parseInt(time2 / 1000, 0),
    };
    const res = await dispatch({
      type: 'analysis/getDayTotalNum',
      payload: {
        ...params,
      },
    });
    if (res.state) {
      const { dayTotal, dayTotal1, dayTotal2, dayTotal3 } = res.data;
      this.setState({
        countList: countList.map(item => {
          if (item.key === '1') {
            return {
              ...item,
              count: dayTotal,
            };
          }
          if (item.key === '2') {
            return {
              ...item,
              count: dayTotal1,
            };
          }
          if (item.key === '3') {
            return {
              ...item,
              count: dayTotal2,
            };
          }
          return {
            ...item,
            count: dayTotal3,
          };
        }),
      });
    }
  };

  // 日报-工单类别
  getDayTypeTotal = async () => {
    const { time1, time2 } = this.state;
    const { dispatch } = this.props;
    const params = {
      star_time: parseInt(time1 / 1000, 0),
      end_time: parseInt(time2 / 1000, 0),
    };
    const res = await dispatch({
      type: 'analysis/getDayTypeTotal',
      payload: {
        ...params,
      },
    });
    if (res.state) {
      const { data } = res;
      this.setState({
        orderClass:
          data && data.length > 0
            ? data.map(item => {
                return {
                  ...item,
                  bgColor: `rgba(${getRandomRgbColor()},0.1)`,
                  color1: `rgba(${getRandomRgbColor()})`,
                  color2: `rgba(${getRandomRgbColor()})`,
                };
              })
            : [],
        allClassCount: data && data.length > 0 ? data[0].allCount : 0,
      });
    }
  };

  // 日报-问题分类
  getDayQuesTypeTotal = async () => {
    const { time1, time2 } = this.state;
    const { dispatch } = this.props;
    const params = {
      star_time: parseInt(time1 / 1000, 0),
      end_time: parseInt(time2 / 1000, 0),
    };
    const res = await dispatch({
      type: 'analysis/getDayQuesTypeTotal',
      payload: {
        ...params,
      },
    });
    if (res.state) {
      const { data } = res;
      this.setState({
        quesList:
          data && data.length > 0
            ? data.map(item => {
                return {
                  ...item,
                  color: `rgba(${getRandomRgbColor()})`,
                  point: `${((item.count / item.allCount) * 100).toFixed(2)}%`,
                };
              })
            : [],
      });
    }
  };

  // 日报-承办单位
  getDayCompanyTotal = async () => {
    const { time1, time2 } = this.state;
    const { dispatch } = this.props;
    const params = {
      star_time: parseInt(time1 / 1000, 0),
      end_time: parseInt(time2 / 1000, 0),
    };
    const res = await dispatch({
      type: 'analysis/getDayCompanyTotal',
      payload: {
        ...params,
      },
    });
    if (res.state) {
      const { data } = res;
      this.setState({
        companyList:
          data && data.length > 0
            ? data.map(item => {
                return {
                  ...item,
                  color: `rgba(${getRandomRgbColor()})`,
                  point: `${((item.count / item.allCount) * 100).toFixed(2)}%`,
                };
              })
            : [],
      });
    }
  };

  // 日报-工单概要
  getDayTotalInfo = async () => {
    const { time1, time2 } = this.state;
    const { dispatch } = this.props;
    const params = {
      star_time: parseInt(time1 / 1000, 0),
      end_time: parseInt(time2 / 1000, 0),
    };
    const res = await dispatch({
      type: 'analysis/getDayTotalInfo',
      payload: {
        ...params,
      },
    });
    if (res.state) {
      const { allCount, centerName } = res.data;
      this.setState({
        centerName,
        appealCount: allCount,
      });
    }
  };

  // 日报-工单详情
  getDayTicketLists = async () => {
    const { time1, time2 } = this.state;
    const { dispatch } = this.props;
    const params = {
      star_time: parseInt(time1 / 1000, 0),
      end_time: parseInt(time2 / 1000, 0),
    };
    const res = await dispatch({
      type: 'analysis/getDayTicketLists',
      payload: {
        ...params,
      },
    });
    if (res.state) {
      const { list } = res.data;
      this.setState({
        day_data:
          list && list.length > 0
            ? list.map(item => {
                return {
                  ...item,
                  orderId: item.t_no,
                  dept: item.deptName,
                  quesClass: item.ques_type,
                };
              })
            : 0,
      });
    }
  };

  changeTab = key => {
    this.setState({
      activeKey: key,
    });
  };

  // 时间切换
  changeDate = date => {
    const time2 = new Date(date).getTime();
    const time1 = new Date(moment(date).subtract(1, 'days')).getTime();
    this.setState(
      {
        time1,
        time2,
      },
      () => {
        this.getReportData();
      },
    );
  };

  getDateRange = time => {
    return moment(new Date(time)).format('M月D日HH时');
  };

  renderTitle = () => {
    const { activeKey } = this.state;
    if (activeKey === 'day') {
      return '工单详情';
    }
    if (activeKey === 'week') {
      return '每日详情';
    }
    if (activeKey === 'month') {
      return '变化趋势';
    }
    return '';
  };

  renderTableData = () => {
    const { activeKey, day_data, week_data } = this.state;
    if (activeKey === 'day') {
      return day_data;
    }
    if (activeKey === 'week') {
      return week_data;
    }
    return [];
  };

  renderTableColums = () => {
    const { activeKey, day_columns, week_columns } = this.state;
    if (activeKey === 'day') {
      return day_columns;
    }
    if (activeKey === 'week') {
      return week_columns;
    }
    return [];
  };

  handleSizeChange = e => {
    this.setState({ btnVal: e.target.value });
  };

  render() {
    const {
      tabs,
      activeKey,
      countList,
      orderClass,
      quesList,
      companyList,
      btnVal,
      appealCount,
      time1,
      time2,
      allClassCount,
      centerName,
    } = this.state;

    const newQuesList = quesList.map(item => {
      return {
        ...item,
        color: getRandomColor(),
      };
    });
    const newComList = companyList.map(item => {
      return {
        ...item,
        color: getRandomColor(),
      };
    });

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    return (
      <div className={styles.WeeklyAndMonthlyReportBox}>
        <div className={styles.report_header}>
          <div className={styles.header_top}>
            <div className={styles.title}>周月报</div>
            <div className={styles.operate}>
              {/* <RangePicker
                className={styles.datePicker}
                showTime={{ format: 'HH:mm:ss' }}
                format="YYYY-MM-DD HH:mm:ss"
                defaultValue={[
                  moment(`${formatDay(new Date())} 00:00:00`, dateFormat),
                  moment(`${formatDay(new Date())} 23:59:59`, dateFormat),
                ]}
                onOk={this.changeDate}
              /> */}
              <DatePicker
                className={styles.datePicker}
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{ format: 'HH:mm:ss' }}
                defaultValue={moment(`${formatDay(new Date())} 23:59:59`, dateFormat)}
                onOk={this.changeDate}
              />
              {/* <Button className={styles.exportBtn} icon="cloud-download">
                导出
              </Button> */}
            </div>
          </div>
          <div className={styles.header_tab}>
            {tabs.map(item => {
              return (
                <li
                  onClick={() => this.changeTab(item.key)}
                  key={item.key}
                  className={activeKey === item.key ? styles.activeTab : ''}
                >
                  <img src={activeKey === item.key ? item.tabHeadImg1 : item.tabHeadImg} alt="" />
                  <span>{item.tabHead}</span>
                </li>
              );
            })}
          </div>
        </div>
        <div className={styles.report_status}>
          <div className={styles.statusTitle}>
            <li />
            <span>市民服务热线接诉情况</span>
          </div>
          <div className={styles.statusText}>
            <span>
              {this.getDateRange(time1)}至{this.getDateRange(time2)}，{centerName}转派诉求
            </span>
            <span className={styles.caseNum}>{appealCount}</span>
            <span>件</span>
          </div>
        </div>
        <div className={styles.report_count}>
          {countList.map(item => {
            return (
              <div key={item.key} className={styles.countItem}>
                <div className={styles.leftIcon} style={{ backgroundColor: item.bgColor }}>
                  <img src={item.icon} alt="" />
                </div>
                <div className={styles.rightCount}>
                  <div className={styles.orderName}>{item.name}</div>
                  <div className={styles.orderCount} style={{ color: item.color }}>
                    <span className={styles.count}>{item.count}</span>件
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.report_classify}>
          <div className={styles.classItem}>
            <div className={styles.classTitle}>
              <div className={styles.titleLeft}>
                <i />
                <span className={styles.orderClassTitle}>工单类别</span>
              </div>
              <span className={styles.titleCount}>{allClassCount}件</span>
            </div>
            <div className={`${styles.classContent} ${styles.classContentSp}`}>
              {orderClass.map(item => {
                return (
                  <div key={item.key} className={styles.contentItem}>
                    <div className={styles.itemName}>{item.title}</div>
                    <div className={styles.itemProcess}>
                      <div className={styles.process} style={{ backgroundColor: item.bgColor }}>
                        <div
                          className={styles.nowProcess}
                          style={{
                            width: `${(item.nowCount / item.allCount) * 100}%`,
                            background: `linear-gradient(to right,${item.color1} 0%,${item.color2} 100%)`,
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className={styles.itemCount}
                      style={{ color: item.color2 }}
                    >{`${item.nowCount} / ${item.allCount}`}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={`${styles.classItem} ${styles.classItem_charts}`}>
            <div className={styles.classTitle}>
              <div className={styles.titleLeft}>
                <i />
                <span className={styles.orderClassTitle}>问题分类</span>
              </div>
              {/* <span className={styles.titleCount}>213件</span> */}
            </div>
            <div className={styles.classContent}>
              <div className={styles.echarts}>
                <QuestionClassChart data={newQuesList} hoverOffset={2} />
              </div>
              <div className={styles.lists}>
                {newQuesList.length > 0 &&
                  newQuesList.map(item => {
                    return (
                      <li key={item.id} title={`${item.name}，${item.point}(${item.count})`}>
                        <span className={styles.circle} style={{ backgroundColor: item.color }} />
                        <span className={styles.levelName}>{item.name}</span>
                        <span className={styles.levelPoint}>{`，${item.point}`}</span>
                        <span className={styles.levelCount}>&nbsp;{`(${item.count})`}</span>
                      </li>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className={`${styles.classItem} ${styles.classItem_charts}`}>
            <div className={styles.classTitle}>
              <div className={styles.titleLeft}>
                <i />
                <span className={styles.orderClassTitle}>承办单位</span>
              </div>
              {/* <span className={styles.titleCount}>213件</span> */}
            </div>
            <div className={styles.classContent}>
              <div className={styles.echarts}>
                <div className={styles.chartParent}>
                  <QuestionClassChart data={newComList} hoverOffset={2} />
                </div>
              </div>
              <div className={styles.lists}>
                {newComList.length > 0 &&
                  newComList.map(item => {
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
          </div>
        </div>

        <div className={styles.report_footer}>
          <div className={styles.classTitle}>
            <div className={styles.titleLeft}>
              <i />
              <span className={styles.titles}>{this.renderTitle()}</span>
              {activeKey === 'month' && (
                <Radio.Group
                  value={btnVal}
                  onChange={this.handleSizeChange}
                  className={styles.btnState}
                >
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
              )}
            </div>
            <div className={styles.tableExport}>
              {activeKey === 'month' ? (
                <Button className={styles.nowMonth}>本月</Button>
              ) : (
                <Button className={styles.exportBtn} icon="cloud-download">
                  导出
                </Button>
              )}
            </div>
          </div>
          <div className={styles.footerTable}>
            {activeKey === 'month' ? (
              <LineChart
                showTitle={false}
                xAxisData={this.month}
                seriesData={[100, 200, 300, 600, 300, 700, 500, 300, 600, 200, 800, 100]}
              />
            ) : (
              <Table
                columns={this.renderTableColums()}
                dataSource={this.renderTableData()}
                rowSelection={rowSelection}
                pagination={false}
                rowClassName={(record, index) => {
                  if (index % 2 === 0) {
                    return styles.rowWhite;
                  }
                  return styles.rowGray;
                }}
                rowKey={item => {
                  return item.id;
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

WeeklyAndMonthlyReport.propTypes = {};
function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(WeeklyAndMonthlyReport);
