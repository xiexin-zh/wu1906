import React from 'react';
import { connect } from 'dva';
import { Tabs, Table } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styles from './WorkOrderReminder.less';

const { TabPane } = Tabs;

class WorkOrderReminder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      lists: [
        { id: '1', number: '标题占位', state: '新工单', ts: '2020-01-03 09:10:00' },
        { id: '2', number: '标题占位', state: '新工单', ts: '2020-01-03 09:10:00' },
        { id: '3', number: '标题占位', state: '新工单', ts: '2020-01-03 09:10:00' },
      ],
    };
    this.columns = [
      {
        title: '工单编号',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
      },
      {
        title: '更改时间',
        dataIndex: 'ts',
        key: 'ts',
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'operation',
        render: record => (
          <span className={styles.operation}>
            <a className="ant-dropdown-link">操作{record.id}</a>
            <i className={styles.line} />
            <a className="ant-dropdown-link">
              更多 <DownOutlined />
            </a>
          </span>
        ),
      },
    ];
  }

  onSelectChange = selectedRowKeys => {
    window.console.log(' 👌👌👌 --->>>', selectedRowKeys);
  };

  renderWorkOrder = () => {
    const { selectedRowKeys, lists } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <Table
        size="small"
        bordered={false}
        pagination={false}
        rowKey={row => row.id}
        rowSelection={rowSelection}
        columns={this.columns}
        dataSource={lists}
        // onRow={record => {
        //   return {
        //     onClick: event => {
        //       this.tableClickEvent(event, record);
        //     }, // 点击行
        //   };
        // }}
      />
    );
  };

  render() {
    return (
      <div className={styles.WorkOrderReminderBox}>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <img src={require('../../images/tit_gdtx.png')} alt="" />
                工单提醒
              </span>
            }
            key="1"
          >
            {this.renderWorkOrder()}
          </TabPane>
          <TabPane
            tab={
              <span>
                <img src={require('../../images/tit_tz.png')} alt="" />
                通知
              </span>
            }
            key="2"
          >
            通知
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

WorkOrderReminder.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(WorkOrderReminder);
