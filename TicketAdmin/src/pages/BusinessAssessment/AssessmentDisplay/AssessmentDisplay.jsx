import React from 'react';
import { connect } from 'dva';
import { DatePicker, Table } from 'antd';
import BarChart from '@/components/CharComponent/BarChart';
import moment from 'moment';
import styles from './AssessmentDisplay.less';

const dateFormat = 'YYYY-MM-DD';
class AssessmentDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      week: 'nowWeek',
      caseCount: 1190,
      caseProcess: [
        {
          key: '1',
          title: '已办结',
          now: 852,
          all: 9511,
          bgc: 'rgba(109,212,0,.1)',
          color: '#6DD400',
        },
        {
          key: '2',
          title: '办理中',
          now: 1852,
          all: 9511,
          bgc: 'rgba(247,181,0,.1)',
          color: '#F7B500',
        },
        {
          key: '3',
          title: '退回',
          now: 7233,
          all: 9511,
          bgc: 'rgba(250,100,0,.1)',
          color: '#FA6400',
        },
      ],
      xAxisData: ['响应率', '满意率', '解决率'],
      seriesData: [70, 80, 90],
      barColor: { start: '#6CAAEE', end: '#249FDE' },
      case_columns: [
        {
          title: '排名',
          dataIndex: 'sort',
          align: 'center',
          render: (value, data) => {
            const { sort } = data;
            if (sort === 1) {
              return (
                <img className={styles.thImg} src={require('@/assets/icon/sort1.png')} alt="" />
              );
            }
            if (sort === 2) {
              return (
                <img className={styles.thImg} src={require('@/assets/icon/sort2.png')} alt="" />
              );
            }
            if (sort === 3) {
              return (
                <img className={styles.thImg} src={require('@/assets/icon/sort3.png')} alt="" />
              );
            }
            return <span>{value}</span>;
          },
        },
        {
          title: '承办部门',
          dataIndex: 'class',
          align: 'center',
          render: value => {
            return <span className={styles.tableFont}>{value}</span>;
          },
        },
        {
          title: '接诉量',
          dataIndex: 'againstCount',
          align: 'center',
          render: (value, data) => {
            const { sort } = data;
            const color = this.getColor(sort);
            return <span style={{ color }}>{value}</span>;
          },
        },
        {
          title: '按时签收',
          dataIndex: 'sign',
          align: 'center',
          render: (value, data) => {
            const { sort } = data;
            const color = this.getColor(sort);
            return <span style={{ color }}>{value}</span>;
          },
        },
        {
          title: '按时处理',
          dataIndex: 'deal',
          align: 'center',
          render: (value, data) => {
            const { sort } = data;
            const color = this.getColor(sort);
            return <span style={{ color }}>{value}</span>;
          },
        },
        {
          title: '超时率',
          dataIndex: 'timeout',
          align: 'center',
          render: (value, data) => {
            const { sort } = data;
            const color = this.getColor(sort);
            return <span style={{ color }}>{value}</span>;
          },
        },
      ],
      sort_columns: [
        {
          title: '排名',
          dataIndex: 'sort',
          align: 'center',
          render: (value, data) => {
            const { sort } = data;
            if (sort === 1) {
              return (
                <img className={styles.thImg} src={require('@/assets/icon/sort1.png')} alt="" />
              );
            }
            if (sort === 2) {
              return (
                <img className={styles.thImg} src={require('@/assets/icon/sort2.png')} alt="" />
              );
            }
            if (sort === 3) {
              return (
                <img className={styles.thImg} src={require('@/assets/icon/sort3.png')} alt="" />
              );
            }
            return <span>{value}</span>;
          },
        },
        {
          title: '承办部门',
          dataIndex: 'class',
          align: 'center',
          render: value => {
            return <span className={styles.tableFont}>{value}</span>;
          },
        },
        {
          title: '接诉量',
          dataIndex: 'againstCount',
          align: 'center',
          render: (value, data) => {
            const { sort } = data;
            const color = this.getColor(sort);
            return <span style={{ color }}>{value}</span>;
          },
        },
        {
          title: '响应率',
          dataIndex: 'response',
          align: 'center',
          render: (value, data) => {
            const { sort } = data;
            const color = this.getColor(sort);
            return <span style={{ color }}>{value}</span>;
          },
        },
        {
          title: '解决率',
          dataIndex: 'resolve',
          align: 'center',
          render: (value, data) => {
            const { sort } = data;
            const color = this.getColor(sort);
            return <span style={{ color }}>{value}</span>;
          },
        },
        {
          title: '满意率',
          dataIndex: 'satisfaction',
          align: 'center',
          render: (value, data) => {
            const { sort } = data;
            const color = this.getColor(sort);
            return <span style={{ color }}>{value}</span>;
          },
        },
        {
          title: '综合成绩',
          dataIndex: 'score',
          align: 'center',
          render: (value, data) => {
            const { sort } = data;
            const color = this.getColor(sort);
            return <span style={{ color }}>{value}</span>;
          },
        },
      ],
    };
  }

  getColor = sort => {
    if (sort === 1) {
      return '#FF6845';
    }
    if (sort === 2) {
      return '#B7B7B7';
    }
    if (sort === 3) {
      return '#D8A20E';
    }

    return '#000';
  };

  render() {
    const {
      week,
      caseCount,
      caseProcess,
      xAxisData,
      seriesData,
      barColor,
      case_columns,
      sort_columns,
    } = this.state;
    const caseData = [];
    const sortData = [];
    for (let i = 0; i < 50; i += 1) {
      const data = {
        sort: i + 1,
        class: '这一个承办单位',
        againstCount: 467,
        sign: 400,
        deal: '100%',
        timeout: '100%',
      };
      const data1 = {
        sort: i + 1,
        class: '这一个承办单位',
        againstCount: 467,
        response: '100%',
        resolve: '100%',
        satisfaction: '100%',
        score: 90,
      };
      caseData.push(data);
      sortData.push(data1);
    }
    return (
      <div className={styles.assessmentDisplay}>
        <div className={styles.assessTop}>
          <div className={styles.assessTopTitle}>
            <div className={styles.title}>综合考核排名</div>
            <div className={styles.date}>
              <div className={styles.selectWeek}>
                <span
                  className={week === 'lastWeek' ? styles.active : ''}
                  onClick={() => {
                    this.setState({ week: 'lastWeek' });
                  }}
                >
                  上周
                </span>
                <span
                  className={week === 'nowWeek' ? styles.active : ''}
                  onClick={() => {
                    this.setState({ week: 'nowWeek' });
                  }}
                >
                  本周
                </span>
              </div>
              <DatePicker
                className={styles.dataPicker}
                defaultValue={moment('2015-01-01', dateFormat)}
                format={dateFormat}
              />
            </div>
          </div>
          <div className={styles.assessTopSpace} />
        </div>
        <div className={styles.assessMain}>
          <div className={styles.mainLeft}>
            <div className={styles.caseChart}>
              <div className={styles.caseBox}>
                <div className={styles.caseTitle}>
                  <div className={styles.title}>
                    <img src={require('@/assets/icon/file.png')} alt="" />
                    <span>接诉即办案件</span>
                  </div>
                  <div className={styles.caseNum}>{`${caseCount}件`}</div>
                </div>
                <div className={styles.echart}>
                  <div className={styles.chart_num}>
                    {caseProcess.map(item => {
                      return (
                        <div key={item.key} className={styles.caseProcess}>
                          <span className={styles.itemTitle}>{`${item.title}(件)`}</span>
                          <div className={styles.itemNum}>
                            <div
                              className={styles.itemProcess}
                              style={{ backgroundColor: item.bgc }}
                            >
                              <div
                                className={styles.process}
                                style={{
                                  backgroundColor: item.color,
                                  width: `${((item.now / item.all) * 100).toFixed(0)}%`,
                                }}
                              />
                            </div>
                            <span style={{ color: item.color }}>{`${item.now} / ${item.all}`}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className={styles.chart_point}>
                    <div className={styles.barChart}>
                      <BarChart
                        yAxisMax={100}
                        xAxisData={xAxisData}
                        seriesData={seriesData}
                        color={barColor}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.space} />
            </div>
            <div className={styles.caseList}>
              <div className={styles.listTitle}>
                <img src={require('@/assets/icon/file.png')} alt="" />
                <span>接诉即办案件</span>
              </div>
              <div className={styles.caseTable}>
                <Table
                  columns={case_columns}
                  dataSource={caseData}
                  rowKey={item => {
                    return item.sort;
                  }}
                />
              </div>
            </div>
          </div>
          <div className={styles.mainRight}>
            <div className={styles.space} />
            <div className={styles.ranklist}>
              <div className={styles.listTitle}>
                <img src={require('@/assets/icon/ranklist.png')} alt="" />
                <span>承办三率得分排名</span>
              </div>
              <div className={styles.caseTable}>
                <Table
                  columns={sort_columns}
                  dataSource={sortData}
                  rowKey={item => {
                    return item.sort;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AssessmentDisplay.propTypes = {};
function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(AssessmentDisplay);
