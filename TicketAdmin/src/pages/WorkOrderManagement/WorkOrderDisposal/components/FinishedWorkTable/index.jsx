import React, { Component } from 'react';
import { connect } from 'dva';
// import router from 'umi/router';
import { Table, Select, Checkbox, Icon } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { format } from '@/utils/tools';

import styles from './index.less';

const { Option } = Select;

class FinishedWorkTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.sendSelectAllHandle(this.onToggleSelectAll, this.props.orderList.length);
  }

  get selectedRowLen() {
    const { selectedRowKeys } = this.props;
    return selectedRowKeys.length;
  }

  renderColumns = () => {
    const { baseData, orderStatus } = this.props;
    const { source, task_type, organizer } = baseData;
    const columns = [
      {
        title: () => {
          return (
            <Select
              className={styles.fontStyle}
              style={{ width: '100px' }}
              placeholder="工单来源"
              value="工单来源"
            >
              {source &&
                source.length > 0 &&
                source.map(item => {
                  return (
                    <Option
                      key={item.id}
                      onClick={() => this.changeListSearch(item.name, 'source')}
                      value={item.name}
                    >
                      {item.name}
                    </Option>
                  );
                })}
            </Select>
          );
        },
        dataIndex: 'from',
        key: 'id',
        align: 'center',
        fixed: 'left',
      },
      {
        title: () => {
          return (
            <Select
              className={styles.fontStyle}
              style={{ width: '100px' }}
              placeholder="任务类型"
              value="任务类型"
            >
              {task_type &&
                task_type.length > 0 &&
                task_type.map(item => {
                  return (
                    <Option
                      key={item.id}
                      onClick={() => this.changeListSearch(item.name, 'task_type', item.id)}
                      value={item.name}
                    >
                      {item.name}
                    </Option>
                  );
                })}
            </Select>
          );
        },
        dataIndex: 'class',
        key: 'class',
        align: 'center',
        fixed: 'left',
      },
      {
        title: () => {
          return (
            <Select
              className={styles.fontStyle}
              style={{ width: '80px' }}
              placeholder="状态"
              value="状态"
            >
              {orderStatus &&
                orderStatus.length > 0 &&
                orderStatus.map(item => {
                  return (
                    <Option
                      key={item.id}
                      onClick={() => this.changeListSearch(item.id, 'ticket_state')}
                      value={item.name}
                      title={item.name}
                    >
                      {item.name}
                    </Option>
                  );
                })}
            </Select>
          );
        },
        width: '110px',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        fixed: 'left',
        render: value => {
          if (value) {
            return (
              <span title={value}>{value.length > 6 ? `${value.substr(0, 6)}...` : value}</span>
            );
          }
          return <span>{value}</span>;
        },
      },
      {
        title: '',
        dataIndex: 'space',
        key: 'space',
        align: 'center',
      },
      {
        title: '工单编号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
        width: '160px',
      },
      {
        title: () => {
          return (
            <Select
              className={styles.fontStyle}
              style={{ width: '100px' }}
              placeholder="承办单位"
              value="承办单位"
            >
              {organizer &&
                organizer.length > 0 &&
                organizer.map(item => {
                  return (
                    <Option
                      key={item}
                      onClick={() => this.changeListSearch(item, 'office')}
                      value={item}
                    >
                      {item}
                    </Option>
                  );
                })}
            </Select>
          );
        },
        dataIndex: 'organization',
        key: 'organization',
        align: 'center',
        width: '150px',
      },
      {
        title: '工单标题',
        dataIndex: 'title',
        key: 'title',
        align: 'center',
        width: '150px',
        render: value => {
          const val = value && value.length > 9 ? `${value.substr(0, 9)}...` : value;
          return <span title={value}>{val}</span>;
        },
      },
      {
        title: '来电人',
        dataIndex: 'caller',
        key: 'caller',
        align: 'center',
        width: '100px',
      },
      {
        title: '来电电话',
        dataIndex: 'mobile',
        key: 'mobile',
        align: 'center',
        width: '150px',
      },
      {
        title: '办结时间',
        dataIndex: 'finishTime',
        key: 'finishTime',
        align: 'center',
        width: '180px',
        render: value => {
          return value ? format(value * 1000) : '';
        },
        sorter: (a, b) => a.createTime - b.createTime,
      },
      {
        title: '办理结果',
        dataIndex: 'result',
        key: 'result',
        width: '100px',
        align: 'center',
        render: (avlue, data) => {
          const { result } = data;
          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '0 15px',
                boxSizing: 'border-box',
              }}
            >
              <Icon
                type="check-circle"
                theme="filled"
                style={{ color: result[0] ? '#249fde' : '#ccc' }}
              />
              {result[1] ? (
                <Icon type="like" theme="filled" style={{ color: '#249fde' }} />
              ) : (
                <Icon type="dislike" theme="filled" style={{ color: '#249fde' }} />
              )}
            </div>
          );
        },
      },
      {
        title: '回访结果',
        dataIndex: 'returnResult',
        key: 'returnResult',
        align: 'center',
        width: '100px',
        render: (avlue, data) => {
          const { returnResult } = data;
          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '0 15px',
                boxSizing: 'border-box',
              }}
            >
              <Icon
                type="check-circle"
                theme="filled"
                style={{ color: returnResult[0] ? '#249fde' : '#ccc' }}
              />
              {returnResult[1] ? (
                <Icon type="like" theme="filled" style={{ color: '#249fde' }} />
              ) : (
                <Icon type="dislike" theme="filled" style={{ color: '#249fde' }} />
              )}
            </div>
          );
        },
      },
      {
        title: '结案提醒',
        dataIndex: 'remind',
        key: 'remind',
        width: '100px',
        align: 'center',
        render: (avlue, data) => {
          const { remind } = data;
          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '0 15px',
                boxSizing: 'border-box',
              }}
            >
              <Icon
                type="check-circle"
                theme="filled"
                style={{ color: remind[0] ? '#249fde' : '#ccc' }}
              />
              {remind[1] ? (
                <Icon type="like" theme="filled" style={{ color: '#249fde' }} />
              ) : (
                <Icon type="dislike" theme="filled" style={{ color: '#249fde' }} />
              )}
            </div>
          );
        },
      },
      {
        title: '',
        dataIndex: 'space1',
        key: 'space1',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        align: 'center',
        fixed: 'right',
        render: (text, data) => {
          const { id, number } = data;
          return (
            <span
              style={{
                width: '50px',
                height: '25px',
                backgroundColor: '#249FDE',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                borderRadius: '5px',
              }}
              onClick={() => this.routeToDetails(id, number)}
            >
              处理
            </span>
          );
        },
      },
    ];
    return columns;
  };

  routeToDetails = (id, number) => {
    const { addNewOrderTab, getNewOrderList, dispatch } = this.props;
    dispatch({
      type: 'order/setIndexOrderState',
      payload: 'finish',
    });
    addNewOrderTab(id, number, getNewOrderList);
  };

  onSelectChange = keys => {
    this.props.onSelectToggle(keys);
  };

  onToggleSelectAll = () => {
    const isNoSelectAll = this.selectedRowLen === 0;
    const { orderList } = this.props;
    const keys = orderList.map(item => item.id);
    this.props.onSelectToggle(isNoSelectAll ? keys : []);
  };

  onGetNewOrderSelectAllRef = ref => {
    this.selectAllRef = ref;
  };

  // 改变搜索列表内容
  changeListSearch = (value, type, id) => {
    const { changeListSearch } = this.props;
    changeListSearch(type, value, id);
  };

  // 跳转工单详情
  routeToDetails = () => {};

  // 格式化工单列表
  formatOrderList = () => {
    const { orderList } = this.props;
    if (orderList.length === 0) {
      return [];
    }
    return orderList.map(item => {
      return {
        id: item.id,
        from: item.t_source,
        class: item.t_task_type,
        status: item.stag_name,
        number: item.t_no,
        organization: '主：分中心',
        title: item.t_title,
        qsClass: item.t_type,
        caller: item.t_tel_name,
        mobile: item.t_tel_tel,
        createTime: item.t_create_at,
        response: '0时0分',
        tags: '吹哨',
        remind: [0, 1],
        operate: '操作',
        startTime: item.t_so_startime,
        endTime: item.t_so_endtime,
        timeOut: item.t_so_endtime - item.t_so_startime,
        result: [0, 1],
        returnResult: [1, 1],
      };
    });
  };

  render() {
    const {
      orderList,
      closeListItemSearch,
      resetListSearch,
      selectedRowKeys,
      filterData,
    } = this.props;
    const checkedAll = this.selectedRowLen === orderList.length && orderList.length > 0;
    const { source, task_type, ticket_state, office, tag } = filterData;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      columnTitle: () => (
        <Checkbox
          checked={checkedAll}
          ref={this.onGetNewOrderSelectAllRef}
          onChange={this.onToggleSelectAll}
        />
      ),
    };

    return (
      <div className={styles.newTableList}>
        <div
          className={styles.condition}
          style={{
            display: source || task_type || ticket_state || office || tag ? 'flex' : 'none',
          }}
        >
          {source && (
            <div className={styles.conditionItem}>
              <span>{`工单来源="${source}"`}</span>
              <span onClick={() => closeListItemSearch('source')}>
                <CloseCircleOutlined />
              </span>
            </div>
          )}
          {task_type && (
            <div className={styles.conditionItem}>
              <span>{`任务类型="${task_type}"`}</span>
              <span onClick={() => closeListItemSearch('task_type')}>
                <CloseCircleOutlined />
              </span>
            </div>
          )}
          {ticket_state && (
            <div className={styles.conditionItem}>
              <span>{`状态="${ticket_state}"`}</span>
              <span onClick={() => closeListItemSearch('ticket_state')}>
                <CloseCircleOutlined />
              </span>
            </div>
          )}
          {office && (
            <div className={styles.conditionItem}>
              <span>{`承办单位="${office}"`}</span>
              <span onClick={() => closeListItemSearch('office')}>
                <CloseCircleOutlined />
              </span>
            </div>
          )}
          {tag && (
            <div className={styles.conditionItem}>
              <span>{`标签="${tag}"`}</span>
              <span onClick={() => closeListItemSearch('tag')}>
                <CloseCircleOutlined />
              </span>
            </div>
          )}
          <span className={styles.conditionReset} onClick={resetListSearch}>
            重置
          </span>
        </div>
        <Table
          className={styles.tableList}
          columns={this.renderColumns()}
          dataSource={this.formatOrderList()}
          rowSelection={rowSelection}
          pagination={false}
          scroll={{ x: this.formatOrderList().length > 0 ? 1800 : 0 }}
          rowKey={item => {
            return item.id;
          }}
        />
      </div>
    );
  }
}

FinishedWorkTable.propTypes = {};
function mapStateToProps(state) {
  return {
    baseData: state.login.baseData,
  };
}

export default connect(mapStateToProps)(FinishedWorkTable);
