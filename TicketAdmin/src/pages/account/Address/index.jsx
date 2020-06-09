import React from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import OrganizationStructure from './components/OrganizationStructure';

const { TabPane } = Tabs;

class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.tabs = [
      {
        tabHead: '通讯录管理',
        tabHeadImg: require('./images/F.png'),
        renderContent: <div>通讯录管理</div>,
      },
      {
        tabHead: '组织结构',
        tabHeadImg: require('./images/F.png'),
        renderContent: <OrganizationStructure />,
      },
    ];
  }

  renderTabTitle = val => {
    return (
      <span>
        <img src={val.tabHeadImg} alt="" style={{ marginRight: '8px' }} />
        {val.tabHead}
      </span>
    );
  };

  render() {
    return (
      <div className={styles.AddressBox}>
        <PageHeaderWrapper breadcrumb title="通讯录管理">
          <Tabs
            defaultActiveKey="0"
            tabBarGutter={0}
            tabBarStyle={{
              background: '#fff',
            }}
          >
            {this.tabs.map((val, key) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <TabPane tab={this.renderTabTitle(val)} key={key}>
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

Address.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(Address);
