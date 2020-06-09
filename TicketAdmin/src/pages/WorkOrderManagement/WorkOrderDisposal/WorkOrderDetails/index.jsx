/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import { connect } from 'dva';
// import router from 'umi/router';
import { Tabs } from 'antd';
import OrderList from '../components/OrderList';
import DetailsPage from './DetailsPage';
// import OrderList from '../components/OrderList';
import styles from './index.less';

const { TabPane } = Tabs;

class WorkOrderDetails extends Component {
  // eslint-disable-next-line no-empty-pattern
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    this.state = {
      activeKey: '0',
      panes: [],
    };
  }

  // 添加工单详情页标签
  addNewOrderTab = (id, number, getNewOrderList) => {
    const { panes } = this.state;
    const activeKey = `newTab${this.newTabIndex++}`;
    let addStop = false;
    if (panes.length > 0) {
      panes.forEach(item => {
        if (item.id === id) {
          this.setState({
            activeKey: item.key,
          });
          addStop = true;
          return true;
        }
        return true;
      });
    }

    if (!addStop) {
      panes.push({ title: number, key: activeKey, id, getNewOrderList });
      this.setState({ panes, activeKey });
    }
  };

  onChange = activeKey => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  remove = targetKey => {
    let { activeKey } = this.state;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = '0';
      }
    } else {
      activeKey = '0';
    }
    this.setState({ panes, activeKey });
  };

  render() {
    const { panes } = this.state;
    return (
      <div className={styles.wordorderDeatils}>
        <div className={styles.details_header}>
          <div className={styles.headTab}>
            <Tabs
              hideAdd
              onChange={this.onChange}
              activeKey={this.state.activeKey}
              type="editable-card"
              onEdit={this.onEdit}
            >
              <TabPane className={styles.orderListTitle} tab="工单列表">
                <OrderList addNewOrderTab={this.addNewOrderTab} />
              </TabPane>
              {panes.length > 0 &&
                panes.map(pane => {
                  return (
                    <TabPane tab={pane.title} key={pane.key}>
                      <DetailsPage
                        id={pane.id}
                        remove={this.remove}
                        panes={panes}
                        targetKey={pane.key}
                        getNewOrderList={pane.getNewOrderList}
                      />
                    </TabPane>
                  );
                })}
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}
WorkOrderDetails.propTypes = {};
function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(WorkOrderDetails);
