import React from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './CaseAnalysis.less';
import DynamicAnalysis from './components/DynamicAnalysis';
import QuestionAnalysis from './components/QuestionAnalysis';

const { TabPane } = Tabs;
class CaseAnalysis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '1',
    };

    this.tabs = [
      {
        key: '1',
        tabHead: '动态分析',
        tabHeadImg: require('../images/fenxi@2x.png'),
        tabHeadImg1: require('../images/F.png'),
        renderContent: <DynamicAnalysis />,
      },
      {
        key: '2',
        tabHead: '总量分析',
        tabHeadImg: require('../images/D@2x.png'),
        tabHeadImg1: require('../images/D1@2x.png'),
        renderContent: <div>总量分析</div>,
      },
      {
        key: '3',
        tabHead: '问题分类',
        tabHeadImg: require('../images/A@2x.png'),
        tabHeadImg1: require('../images/question@2x.png'),
        renderContent: <QuestionAnalysis />,
      },
      {
        key: '4',
        tabHead: '重点诉求',
        tabHeadImg: require('../images/C@2x.png'),
        tabHeadImg1: require('../images/phone@2x.png'),
        renderContent: <div>重点诉求</div>,
      },
      {
        key: '5',
        tabHead: '工单区域',
        tabHeadImg: require('../images/E.png'),
        tabHeadImg1: require('../images/E.png'),
        renderContent: <div>工单区域</div>,
      },
      {
        key: '6',
        tabHead: '工单来源',
        tabHeadImg: require('../images/G.png'),
        tabHeadImg1: require('../images/G.png'),
        renderContent: <div>工单来源</div>,
      },
    ];
  }

  changeTab = key => {
    this.setState({
      activeKey: key,
    });
  };

  renderTabTitle = val => {
    const { activeKey } = this.state;
    return (
      <span>
        <img
          src={activeKey === val.key ? val.tabHeadImg1 : val.tabHeadImg}
          alt=""
          style={{ marginRight: '8px', width: '18px', height: '18px' }}
        />
        {val.tabHead}
      </span>
    );
  };

  render() {
    const { activeKey } = this.state;
    return (
      <div className={styles.CaseAnalysisBox}>
        <PageHeaderWrapper breadcrumb>
          <Tabs
            activeKey={activeKey}
            onChange={this.changeTab}
            tabBarGutter={0}
            tabBarStyle={{
              background: '#fff',
            }}
          >
            {this.tabs.map(val => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <TabPane tab={this.renderTabTitle(val)} key={val.key}>
                  <div className={styles.tabContentsBox}>{val.renderContent}</div>
                </TabPane>
              );
            })}
          </Tabs>
        </PageHeaderWrapper>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(CaseAnalysis);
