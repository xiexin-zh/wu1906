import React from 'react';
import { Select } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
// import { format, getTimeOut } from '@/utils/tools';

import styles from './index.less';
import NewTable from '../NewTable';

const { Option } = Select;
class Whole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
    };
    this.orderSource = ['12315', '网格', '基层上报', '预警'];
    this.taskType = ['特殊人群', '突发事件', '日常'];
    this.orderStatus = ['待批示', '待分派'];
    this.organizer = ['主：分中心'];
    this.tags = ['环境问题', '交通问题', '审核未通过'];
    this.columns = [
      {
        title: () => {
          return (
            <Select
              className={styles.fontStyle}
              style={{ width: '100px' }}
              placeholder="工单来源"
              value="工单来源"
            >
              {this.orderSource &&
                this.orderSource.length > 0 &&
                this.orderSource.map(item => {
                  return (
                    <Option
                      key={item}
                      onClick={() => this.changeListSearch(item, 'source')}
                      value={item}
                    >
                      {item}
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
              {this.taskType &&
                this.taskType.length > 0 &&
                this.taskType.map(item => {
                  return (
                    <Option
                      key={item}
                      onClick={() => this.changeListSearch(item, 'task_type')}
                      value={item}
                    >
                      {item}
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
              {this.orderStatus &&
                this.orderStatus.length > 0 &&
                this.orderStatus.map(item => {
                  return (
                    <Option
                      key={item}
                      onClick={() => this.changeListSearch(item, 'ticket_state')}
                      value={item}
                    >
                      {item}
                    </Option>
                  );
                })}
            </Select>
          );
        },
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        fixed: 'left',
      },
      {
        title: '剔挂帐原因',
        dataIndex: 'reason',
        key: 'reason',
        align: 'center',
      },
      {
        title: '工单编号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '工单标题',
        dataIndex: 'operator',
        key: 'operator',
        align: 'center',
      },
      // {
      //   title: () => {
      //     return (
      //       <Select
      //         className={styles.fontStyle}
      //         style={{ width: '100px' }}
      //         placeholder="任务类型"
      //         value="任务类型"
      //       >
      //         {this.organizer &&
      //           this.organizer.length > 0 &&
      //           this.organizer.map(item => {
      //             return (
      //               <Option
      //                 key={item}
      //                 onClick={() => this.changeListSearch(item, 'office')}
      //                 value={item}
      //               >
      //                 {item}
      //               </Option>
      //             );
      //           })}
      //       </Select>
      //     );
      //   },
      //   dataIndex: 'organization',
      //   key: 'organization',
      //   align: 'center',
      // },
      {
        title: '办结时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        // fixed: 'right',
      },
      {
        title: '办理结果',
        dataIndex: 'handle',
        key: 'handle',
        align: 'center',
        // fixed: 'right',
      },
      {
        title: '回访结果',
        dataIndex: 'returnVisit',
        key: 'returnVisit',
        align: 'center',
        // fixed: 'right',
      },
      {
        title: '结案提醒',
        dataIndex: 'closeCase',
        key: 'closeCase',
        align: 'center',
        // fixed: 'right',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        align: 'center',
        fixed: 'right',
        width: '100px',
        render: (text, data) => {
          const { id, number } = data;
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
              操作
            </span>
          );
        },
      },
    ];
  }

  // 改变搜索列表内容
  changeListSearch = (value, type) => {
    const { changeListSearch } = this.props;
    changeListSearch(type, value);
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
        status: item.t_state,
        reason: item.reason,
        number: item.t_no,
        organization: '主：分中心',
        title: item.t_title,
        qsClass: item.t_type,
        caller: item.t_tel_name,
        mobile: item.t_tel_tel,
        createTime: item.t_create_at,
        operate: '操作',
        startTime: item.t_so_startime,
        endTime: item.t_so_endtime,
        timeOut: item.t_so_endtime - item.t_so_startime,
      };
    });
  };

  render() {
    const { lists } = this.state;
    const { filterData, closeListItemSearch, resetListSearch } = this.props;
    const { source, task_type, ticket_state, office, tag } = filterData;
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
          <span className={styles.conditionReset} onClick={resetListSearch}>
            重置
          </span>
        </div>
        <NewTable columns={this.columns} formatOrderList={lists} {...this.props} />
      </div>
    );
  }
}

export default Whole;
