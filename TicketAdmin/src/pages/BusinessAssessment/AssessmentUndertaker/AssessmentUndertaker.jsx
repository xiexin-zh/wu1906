import React from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import styles from './AssessmentUndertaker.less';

class AssessmentUndertaker extends React.Component {
  organization_column = [
    {
      title: '排名',
      dataIndex: 'sort',
      align: 'center',
      render: (value, datas) => {
        const { sort } = datas;
        if (sort === 1) {
          return <img className={styles.thImg} src={require('@/assets/icon/sort1.png')} alt="" />;
        }
        if (sort === 2) {
          return <img className={styles.thImg} src={require('@/assets/icon/sort2.png')} alt="" />;
        }
        if (sort === 3) {
          return <img className={styles.thImg} src={require('@/assets/icon/sort3.png')} alt="" />;
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
      title: '接件量',
      dataIndex: 'againstCount',
      align: 'center',
      render: (value, datas) => {
        const { sort } = datas;
        const color = this.getColor(sort);
        return <span style={{ color }}>{value}</span>;
      },
    },
    {
      title: '回访量',
      dataIndex: 'back',
      align: 'center',
      render: (value, datas) => {
        const { sort } = datas;
        const color = this.getColor(sort);
        return <span style={{ color }}>{value}</span>;
      },
    },
    {
      title: '响应率',
      dataIndex: 'response',
      align: 'center',
      render: (value, datas) => {
        const { sort } = datas;
        const color = this.getColor(sort);
        return <span style={{ color }}>{value}</span>;
      },
    },
    {
      title: '解决率',
      dataIndex: 'resolve',
      align: 'center',
      render: (value, datas) => {
        const { sort } = datas;
        const color = this.getColor(sort);
        return <span style={{ color }}>{value}</span>;
      },
    },
    {
      title: '满意率',
      dataIndex: 'satisfaction',
      align: 'center',
      render: (value, datas) => {
        const { sort } = datas;
        const color = this.getColor(sort);
        return <span style={{ color }}>{value}</span>;
      },
    },
    {
      title: '综合成绩',
      dataIndex: 'score',
      align: 'center',
      render: (value, datas) => {
        const { sort } = datas;
        const color = this.getColor(sort);
        return <span style={{ color }}>{value}</span>;
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        {
          key: '1',
          title: '承办单位考核',
          icon1: require('@/assets/icon/check.png'),
          icon2: require('@/assets/icon/check1.png'),
        },
        {
          key: '2',
          title: '基层队伍考核',
          icon1: require('@/assets/icon/check.png'),
          icon2: require('@/assets/icon/check1.png'),
        },
      ],
      tab: '1',
      tableData: [],
    };
  }

  componentDidMount() {
    const organization_data = [];

    for (let i = 0; i < 20; i += 1) {
      const data1 = {
        sort: i + 1,
        class: '这是单位名称',
        againstCount: 12,
        back: 12,
        response: '100%',
        resolve: '100%',
        satisfaction: '100%',
        score: '100.00',
      };
      organization_data.push(data1);
    }
    this.setState({
      tableData: organization_data,
    });
  }

  changeTab = key => {
    this.setState({
      tab: key,
    });
  };

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
    const { tabs, tab, tableData } = this.state;
    return (
      <div className={styles.AssessmentUndertakerBox}>
        <div className={styles.checkTitle}>
          <span className={styles.title}>绩效考核</span>
          <div className={styles.tabs}>
            {tabs.map(item => {
              return (
                <li
                  className={tab === item.key ? styles.titleItem : ''}
                  key={item.key}
                  onClick={() => this.changeTab(item.key)}
                >
                  <img src={tab === item.key ? item.icon2 : item.icon1} alt="" />
                  <span>{item.title}</span>
                </li>
              );
            })}
          </div>
        </div>
        <div className={styles.checkList}>
          <div className={styles.title}>业务绩效考核系统</div>
          <div className={styles.tableList}>
            <Table
              columns={this.organization_column}
              pagination={false}
              dataSource={tableData}
              rowKey={item => {
                return item.sort;
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

AssessmentUndertaker.propTypes = {};
function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(AssessmentUndertaker);
