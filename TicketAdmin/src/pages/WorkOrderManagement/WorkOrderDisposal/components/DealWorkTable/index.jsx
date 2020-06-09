import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Select, Checkbox } from 'antd';
// import router from 'umi/router';
import { CloseCircleOutlined } from '@ant-design/icons';
import { format, getTimeOut } from '@/utils/tools';

import styles from './index.less';

const { Option } = Select;

class NewWorkTable extends Component {
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
    const { source, task_type, organizer, tags } = baseData;
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
                      onClick={() => this.changeListSearch(item.name, 'task_type')}
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
                      onClick={() => this.changeListSearch(item.name, 'ticket_state', item.id)}
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
        title: '接线员',
        dataIndex: 'operator',
        key: 'operator',
        align: 'center',
        width: '100px',
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
        title: '问题分类',
        dataIndex: 'qsClass',
        key: 'qsClass',
        align: 'center',
        width: '100px',
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
        width: '150px',
        align: 'center',
      },
      {
        title: () => {
          return (
            <Select
              className={styles.fontStyle}
              style={{ width: '90px' }}
              placeholder="标签"
              value="标签"
            >
              {tags &&
                tags.length > 0 &&
                tags.map(item => {
                  return (
                    <Option
                      key={item}
                      onClick={() => this.changeListSearch(item, 'tag')}
                      value={item}
                    >
                      {item}
                    </Option>
                  );
                })}
            </Select>
          );
        },
        width: '120px',
        dataIndex: 'tags',
        align: 'center',
        key: 'tags',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        defaultSortOrder: 'descend',
        width: '180px',
        align: 'center',
        render: value => {
          return value ? format(value * 1000) : '';
        },
        sorter: (a, b) => a.createTime - b.createTime,
      },
      {
        title: '',
        dataIndex: 'space1',
        key: 'space1',
        align: 'center',
      },
      {
        title: '倒计时',
        dataIndex: 'response',
        key: 'response',
        align: 'center',
        width: '100px',
        defaultSortOrder: 'descend',
        fixed: 'right',
        sorter: (a, b) => a.timeOut - b.timeOut,
        render: (value, data) => {
          const { startTime, endTime } = data;
          return getTimeOut(startTime, endTime);
        },
      },
      {
        title: '提醒',
        dataIndex: 'remind',
        key: 'remind',
        align: 'center',
        width: '100px',
        fixed: 'right',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        align: 'center',
        fixed: 'right',
        render: (text, data) => {
          const { id, number, opt_disabled } = data;
          if (opt_disabled === 1) {
            return null;
          }
          return (
            <span
              onClick={() => this.routeToDetails(id, number)}
              style={{
                width: '45px',
                height: '25px',
                backgroundColor: '#249FDE',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              处理
            </span>
          );
        },
      },
    ];
    return columns;
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

  onGetSelectAllRef = ref => {
    this.selectAllRef = ref;
  };

  // 改变搜索列表内容
  changeListSearch = (value, type, id) => {
    const { changeListSearch } = this.props;
    changeListSearch(type, value, id);
  };

  // 跳转工单详情
  routeToDetails = (id, number) => {
    const { addNewOrderTab, getNewOrderList, dispatch } = this.props;
    dispatch({
      type: 'order/setIndexOrderState',
      payload: 'ing',
    });
    addNewOrderTab(id, number, getNewOrderList);
  };

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
        remind: '领导督办',
        operate: '操作',
        startTime: item.t_so_startime,
        endTime: item.t_so_endtime,
        timeOut: item.t_so_endtime - item.t_so_startime,
        opt_disabled: item.opt_disabled,
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
          ref={this.onGetSelectAllRef}
          onChange={this.onToggleSelectAll}
        />
      ),
    };
    return (
      <>
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
          scroll={{ x: this.formatOrderList().length > 0 ? 2000 : 0 }}
          rowKey={msg => {
            return msg.id;
          }}
        />
      </>
    );
  }
}

NewWorkTable.propTypes = {};
function mapStateToProps(state) {
  return {
    baseData: state.login.baseData,
  };
}

export default connect(mapStateToProps)(NewWorkTable);
