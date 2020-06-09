/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-template */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  CloudUploadOutlined,
  SearchOutlined,
  PlusSquareOutlined,
  DownOutlined,
  UpOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { DatePicker, Select, Checkbox, Button, Radio, Pagination, Input, message } from 'antd';
import { getLoginGroup } from '@/utils/constance';
import moment from 'moment';
import { formatDay, formatTime } from '@/utils/tools';
import { getTicketStateOption } from '@/services/order';
import SelectDay from '../SelectDay';
import SearchValue from '../SearchValue';
import NewWorkTable from '../NewWorkTable';
import DealWorkTable from '../DealWorkTable';
import StayWorkTable from '../StayWorkTable';
import FinishedWorkTable from '../FinishedWorkTable';

import styles from './index.css';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;

class WorkOrderDisposal extends Component {
  // eslint-disable-next-line no-empty-pattern

  isCenterGroup = getLoginGroup() === 'centerGroup';

  constructor(props) {
    super(props);
    this.state = {
      tabList: [
        {
          id: '0',
          tabName: '新工单',
          count: 0,
          icon: require('../../../../../assets/icon/work_new.png'),
          icon1: require('../../../../../assets/icon/work_new1.png'),
        },
        {
          id: '1',
          tabName: '处理中',
          count: 0,
          icon: require('../../../../../assets/icon/work_inhand.png'),
          icon1: require('../../../../../assets/icon/work_inhand1.png'),
        },
        {
          id: '2',
          tabName: '待审核',
          count: 0,
          icon: require('../../../../../assets/icon/work_stay.png'),
          icon1: require('../../../../../assets/icon/work_stay1.png'),
        },
        {
          id: '3',
          tabName: '已办结',
          count: 0,
          icon: require('../../../../../assets/icon/work_finish.png'),
          icon1: require('../../../../../assets/icon/work_finish1.png'),
        },
      ],
      activeTab: '0', // 0:新工单  1:处理中  2:待审核  3:已办结
      superSearch: false,
      days: [
        { type: 0, name: '今天' },
        { type: 3, name: '3天' },
        { type: 7, name: '7天' },
      ],
      pageTypeSize: [10, 20, 30, 40, 50],
      pageSize: 10,
      currentPage: 1,
      orderList: [],
      all_data_num: 0,
      all_page_num: 0,
      current_page_num: 1,
      current_page_size: 10,
      firstPage: 'start',

      // 搜索选项
      create_time_type: 0,
      create_time: moment(new Date()),
      sendTime: [moment(new Date()), moment(new Date()).add(1, 'day')],
      so_startime_type: 0,
      so_startime1: new Date().getTime(),
      so_startime2: new Date(moment(new Date()).add(1, 'day')).getTime(),
      condition: '', // 高级搜索-条件1（and、or）

      searchKey: [], // 自定义搜索条件
      h_source: '', // 高级搜索 工单来源
      h_task_type: '', // 高级搜索 工单类型
      h_ticket_state: '', // 高级搜索 来电主体

      source: '', // 列表头搜索-工单来源
      task_type: '', // 列表头搜索-问题分类
      ticket_state: '', // 列表头搜索-工单状态
      ticket_state_id: '',
      office: '', // 列表头搜索-承办单位
      tag: '', // 列表头搜索-单位标签
      selectedRowKeys: [], // 处理全选id列表

      orderStatus: [], // 列表搜索-工单状态数据
    };
  }

  componentDidMount() {
    this.getNewOrderList();
    this.getTicketStateOption();
  }

  // get isInListDiffDay(){
  //   const {create_time:end} = this.state;
  //   const now = moment(new Date());
  //   console.log(moment.duration(now.diff(end)).asDays);
  // }

  // 获取工单状态
  getTicketStateOption = async () => {
    const { activeTab } = this.state;
    const { groupId } = this.props;
    if (groupId) {
      getTicketStateOption({
        role: groupId,
        state: activeTab,
        category: 'source', // 无效参数，但是不能删除
      }).then(res => {
        this.setState({
          orderStatus: res ? res.data : [],
        });
      });
    }
  };

  // 设置工单数量
  getOrderCount = () => {
    const { tabList } = this.state;
    const { orderTotal } = this.props;
    const { Total0, Total1, Total2, Total3 } = orderTotal;
    return tabList.map((item, index) => {
      if (index === 0) {
        return {
          ...item,
          count: Total0,
        };
      }
      if (index === 1) {
        return {
          ...item,
          count: Total1,
        };
      }
      if (index === 2) {
        return {
          ...item,
          count: Total2,
        };
      }
      return {
        ...item,
        count: Total3,
      };
    });
  };

  // 点击创建新工单
  createNewOrder = () => {
    router.push('/WorkOrderManagement/WorkOrderDisposal/CreateWorkOrder');
  };

  // 切换tab
  changeActiveTab = tabId => {
    this.setState(
      {
        activeTab: tabId,
      },
      () => {
        this.getTicketStateOption();
      },
    );
    // 其他操作
    this.initState();
  };

  // 初始化state
  initState = () => {
    this.setState(
      {
        orderList: [],
        all_data_num: 0,
        all_page_num: 0,
        current_page_num: 1,
        current_page_size: 10,
        firstPage: 'start',
        // create_time_type: 0,
        // so_startime_type: 0,
        selectedRowKeys: [],
        pageSize: 10,
        // create_time: moment(new Date()),
        // so_startime1: new Date().getTime(),
        // so_startime2: new Date(moment(new Date()).add(1, 'day')).getTime(),
        orderStatus: [],
        ticket_state: '',
        ticket_state_id: '',
      },
      () => {
        this.getNewOrderList();
      },
    );
  };

  // 切换table
  renderTable = () => {
    const { addNewOrderTab } = this.props;
    const {
      activeTab,
      orderList,
      selectedRowKeys,
      source,
      task_type,
      ticket_state,
      tag,
      office,
      orderStatus,
    } = this.state;
    const filterData = { source, task_type, ticket_state, office, tag };
    const parmas = {
      orderList,
      selectedRowKeys,
      addNewOrderTab,
      filterData,
      orderStatus,
      changeListSearch: this.changeListSearch,
      selectMultiple: this.selectMultiple,
      resetListSearch: this.resetListSearch,
      sendSelectAllHandle: this.onGetSelectAllHandle,
      onSelectToggle: this.onSelectToggle,
      closeListItemSearch: this.closeListItemSearch,
      getNewOrderList: this.getNewOrderList,
    };
    if (activeTab === '2') {
      return <StayWorkTable {...parmas} />;
    }
    if (activeTab === '3') {
      return <FinishedWorkTable {...parmas} />;
    }
    if (activeTab === '0') {
      return <NewWorkTable {...parmas} />;
    }
    return <DealWorkTable {...parmas} />;
  };

  onGetSelectAllHandle = (handle, totalLen) => {
    this.onSelectAllHandle = handle;
    this.totalLen = totalLen;
  };

  // 获取新工单列表
  getNewOrderList = async () => {
    const { dispatch } = this.props;
    const {
      currentPage,
      pageSize,
      create_time,
      so_startime1,
      so_startime2,
      condition,
      source,
      task_type,
      activeTab,
      searchKey,
      ticket_state_id,
      h_source,
      h_task_type,
      h_ticket_state,
    } = this.state;

    const searchValue =
      searchKey.length === 0
        ? ''
        : searchKey
            .filter(item => {
              return item.value.trim() !== '';
            })
            .map(ele => {
              return ele.value;
            })
            .join(',');
    const params = {
      ticketState: activeTab,
      page_size: pageSize,
      page_num: currentPage,

      s_create_time: formatTime(new Date(create_time).getTime()), // 创建时间
      s_so_startime1: formatTime(so_startime1), // 派单开始时间
      s_so_startime2: formatTime(so_startime2), // 派单截止时间

      h_source, // 高级搜索
      h_task_type, // 高级搜索
      h_ticket_state, // 高级搜索
      h_value: searchValue, // 高级搜索自定义值
      h_condition: condition, // 高级搜索-条件1（and、or）

      t_source: source, // 列表头搜索-工单来源
      t_task_type: task_type, // 列表头搜索-问题分类
      t_ticket_state: ticket_state_id, // 列表头搜索-工单状态
    };

    const res = await dispatch({
      type: 'order/getNewOrderList',
      payload: {
        ...params,
      },
    });
    if (res && res.state) {
      const { all_data_num, all_page_num, current_page_num, current_page_size, list } = res.data;
      this.setState({
        orderList: list,
        all_data_num,
        all_page_num,
        current_page_num,
        current_page_size,
        currentPage: current_page_num,
      });
    } else {
      message.error('数据获取失败');
    }
  };

  // 选择创建时间
  chooseCreateDay = day => {
    this.setState({
      create_time_type: day,
      create_time: moment(new Date()).subtract(day, 'days'),
    });
  };

  // 获取时间选择器时间 - 创建时间
  getCreateDay = (day, time) => {
    const now = moment(new Date());
    this.setState({
      create_time: formatDay(new Date(time).getTime()),
      create_time_type: Math.ceil(moment.duration(day.diff(now)).asDays()),
    });
  };

  // 选择派单时间
  chooseSendDay = day => {
    this.setState({
      so_startime_type: day,
      so_startime1: new Date(
        moment(new Date())
          .subtract(day + 1, 'days')
          .format(dateFormat),
      ).getTime(),
      so_startime2: new Date(moment(new Date()).format(dateFormat)).getTime(),
    });
  };

  // 获取时间选择器时间 - 派单时间
  getSendDay = (days, time) => {
    const now = moment(new Date());
    this.setState({
      so_startime1: new Date(time[0]).getTime(),
      so_startime2: new Date(time[1]).getTime(),
      so_startime_type: Math.ceil(moment.duration(days[0].diff(now)).asDays()),
    });
  };

  // 添加搜索条件
  addSearchKey = () => {
    const { searchKey } = this.state;
    const key = new Date().getTime();
    const item = { key, value: '' };
    this.setState({
      searchKey: [...searchKey, item],
    });
    return true;
  };

  // 删除搜索关键字
  deleteSearch = index => {
    const { searchKey } = this.state;
    this.setState({
      searchKey: searchKey.filter(item => {
        return item.key !== index;
      }),
    });
  };

  // 输入搜索内容
  changeSearchValue = (key, value) => {
    const { searchKey } = this.state;
    this.setState({
      searchKey: searchKey.map(item => {
        if (item.key === key) {
          return {
            ...item,
            value,
          };
        }
        return item;
      }),
    });
  };

  // 高级搜索 工单来源
  handleChangeSearch = value => {
    this.setState({
      h_source: value,
    });
  };

  // 高级搜索 工单类型
  handleChangeClass = value => {
    this.setState({
      h_task_type: value,
    });
  };

  // 高级搜索 来电主体
  handleChangeCaller = value => {
    this.setState({
      h_ticket_state: value,
    });
  };

  // change or/and
  onChangeRadio = value => {
    const condition = value.target.value;
    this.setState({
      condition,
    });
  };

  // 列表搜索
  // 删除搜索选项
  closeListItemSearch = type => {
    if (type === 'source') {
      this.setState({
        source: '',
      });
    }
    if (type === 'task_type') {
      this.setState({
        task_type: '',
      });
    }
    if (type === 'ticket_state') {
      this.setState({
        ticket_state: '',
        ticket_state_id: '',
      });
    }
    if (type === 'office') {
      this.setState({
        office: '',
      });
    }
    if (type === 'tag') {
      this.setState({
        tag: '',
      });
    }
    setTimeout(() => {
      this.getNewOrderList();
    }, 0);
  };

  // 改变搜索列表内容
  changeListSearch = (type, value, id) => {
    if (type === 'source') {
      this.setState({
        source: value,
      });
    }
    if (type === 'task_type') {
      this.setState({
        task_type: value,
      });
    }
    if (type === 'ticket_state') {
      this.setState({
        ticket_state: value,
        ticket_state_id: id,
      });
    }
    if (type === 'office') {
      this.setState({
        office: value,
      });
    }
    if (type === 'tag') {
      this.setState({
        tag: value,
      });
    }

    setTimeout(() => {
      this.getNewOrderList();
    }, 0);
  };

  // 重置搜索选项
  resetListSearch = () => {
    this.setState(
      {
        source: '',
        task_type: '',
        ticket_state: '',
        ticket_state_id: '',
        office: '',
        tag: '',
      },
      () => {
        this.getNewOrderList();
      },
    );
  };

  selectMultiple = () => {
    if (this.onSelectAllHandle) {
      this.onSelectAllHandle();
    }
  };

  onSelectToggle = keys => {
    this.setState({
      selectedRowKeys: keys,
    });
  };

  changeFrom = data => {};

  // 分页操作
  paginationRender = (current, type, originalElement) => {
    if (type === 'prev') {
      return <a>上一页</a>;
    }
    if (type === 'next') {
      return <a>下一页</a>;
    }
    return originalElement;
  };

  // 分页
  changeList = (page, pageSize) => {
    const { all_page_num } = this.state;
    this.setState(
      {
        currentPage: page,
        firstPage: page === 1 ? 'start' : page === all_page_num ? 'end' : '',
      },
      () => {
        this.getNewOrderList();
      },
    );
  };

  // 跳转到指定页面
  skipPage = e => {
    const { all_page_num } = this.state;
    let page = Number(e.target.value);
    page = page ? page : 1;
    page = page > all_page_num ? all_page_num : page;
    this.setState(
      {
        currentPage: page,
        firstPage: page === 1 ? 'start' : page === all_page_num ? 'end' : '',
      },
      () => {
        this.pageInput.state.value = '';
        this.getNewOrderList();
      },
    );
  };

  // 修改当前显示数量
  changePageSize = page => {
    const { all_page_num } = this.state;
    this.setState(
      {
        pageSize: page,
        firstPage: page === 1 ? 'start' : page === all_page_num ? 'end' : '',
      },
      () => {
        this.getNewOrderList();
      },
    );
  };

  // 首页/尾页
  toStartAndEnd = first => {
    const { all_page_num, firstPage } = this.state;
    if (firstPage === 'start' || firstPage === 'end')
      this.setState(
        {
          firstPage: first ? 'start' : 'end',
          currentPage: first ? 1 : all_page_num,
        },
        () => {
          this.getNewOrderList();
        },
      );
  };

  onInitSearchContinue = () => {
    this.setState({
      create_time: moment(new Date()),
      sendTime: [moment(new Date()), moment(new Date()).add(1, 'day')],
      create_time_type: 0,
      so_startime_type: 0,
    });
  };

  render() {
    const {
      activeTab,
      superSearch,
      days,
      create_time,
      create_time_type,
      so_startime_type,
      pageTypeSize,
      all_data_num,
      all_page_num,
      currentPage,
      firstPage,
      searchKey,
      source,
      task_type,
      ticket_state,
      selectedRowKeys,
      sendTime,
      orderList,
      so_startime1,
      so_startime2,
      totalOrder,
      pageSize,
    } = this.state;
    const { baseData } = this.props;

    const { source: orderSource, task_type: taskType, type: callerData } = baseData;

    const { timeOutData } = this.props;
    const { willOverNum, overtimeNum } = timeOutData;

    const newTabList = this.getOrderCount();

    return (
      <div className={styles.WorkOrderDisposalBox}>
        <div className={styles.listMain}>
          <div className={styles.statusTab}>
            {/* <div className={styles.tabTop}>
            <div className={styles.workTitle}>工单管理</div>
          </div> */}
            <div className={styles.tabMenu}>
              <div className={styles.tabItems}>
                {newTabList.map(item => {
                  return (
                    <li
                      className={activeTab === item.id ? styles.activeTab : ''}
                      key={item.id}
                      onClick={() => this.changeActiveTab(item.id)}
                    >
                      <img src={activeTab === item.id ? item.icon1 : item.icon} alt="" />
                      <span>{item.tabName}</span>
                      <span>({item.count})</span>
                    </li>
                  );
                })}
              </div>
              <div className={styles.createWork}>
                <div className={styles.search_all}>
                  <SearchOutlined />
                  <input type="text" placeholder="工单/诉求人/电话/地点" />
                </div>
                {this.isCenterGroup && (
                  <div className={styles.importBtn}>
                    <CloudUploadOutlined />
                    <span className={styles.importWork}>批量导入</span>
                  </div>
                )}
                {this.isCenterGroup && (
                  <div className={styles.importBtn}>
                    <CloudUploadOutlined />
                    <span className={styles.importWork}>导入</span>
                  </div>
                )}
                {this.isCenterGroup && (
                  <div className={styles.createBtn} onClick={this.createNewOrder}>
                    <PlusSquareOutlined />
                    <span className={styles.createText}>创建</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className={styles.workSearch}
            style={{
              height: superSearch ? '145px' : '72px',
            }}
          >
            <div
              className={styles.workSearchTop}
              style={{ borderBottom: superSearch ? '1px solid #ccc' : '0' }}
            >
              <div className={styles.createTime}>
                <span className={styles.timeTitle}>创建时间：</span>
                <SelectDay days={days} chooseDay={this.chooseCreateDay} value={create_time_type} />
                <DatePicker
                  allowClear={false}
                  className={styles.datePicker}
                  value={moment(formatDay(create_time), dateFormat)}
                  placeholder="请选择时间"
                  onChange={this.getCreateDay}
                />
              </div>
              <div className={styles.createTime}>
                <span className={styles.timeTitle}>派单时间：</span>
                <SelectDay days={days} chooseDay={this.chooseSendDay} value={so_startime_type} />
                <RangePicker
                  allowClear={false}
                  className={styles.rangePicker}
                  value={[
                    moment(formatDay(so_startime1), dateFormat),
                    moment(formatDay(so_startime2), dateFormat),
                  ]}
                  placeholder="请选择时间"
                  onChange={this.getSendDay}
                />
              </div>
              <div className={styles.timeOut}>
                <span>即将超时：</span>
                <span className={styles.willTimeOut}>{willOverNum}</span>
              </div>
              <div className={styles.timeOut}>
                <span>已经超时：</span>
                <span className={styles.hasTimeOut}>{overtimeNum}</span>
              </div>
              <div className={styles.startSearch}>
                <span className={styles.hover} onClick={this.getNewOrderList}>
                  查询
                </span>
                <span
                  onClick={this.onInitSearchContinue}
                  className={`${styles.reset} ${styles.hover}`}
                >
                  重置
                </span>
                <div
                  className={styles.superSearch}
                  onClick={() => {
                    this.setState({ superSearch: !this.state.superSearch });
                  }}
                >
                  <span>高级搜索</span>
                  <span>{superSearch ? <UpOutlined /> : <DownOutlined />}</span>
                </div>
              </div>
            </div>
            <div
              className={styles.workSearchBottom}
              style={{ display: superSearch ? 'flex' : 'none' }}
            >
              <Select
                className={styles.selectOption}
                style={{ width: '110px' }}
                onChange={this.handleChangeSearch}
                placeholder="工作来源"
              >
                {orderSource &&
                  orderSource.length > 0 &&
                  orderSource.map(item => {
                    return (
                      <Option key={item.id} value={item.name}>
                        {item.name}
                      </Option>
                    );
                  })}
              </Select>
              <Select
                className={styles.selectOption}
                style={{ width: '110px' }}
                onChange={this.handleChangeClass}
                placeholder="工单类型"
              >
                {taskType &&
                  taskType.length > 0 &&
                  taskType.map(item => {
                    return (
                      <Option key={item.id} value={item.name}>
                        {item.name}
                      </Option>
                    );
                  })}
              </Select>
              <Select
                className={styles.selectOption}
                style={{ width: '110px' }}
                onChange={this.handleChangeCaller}
                placeholder="来电主体"
              >
                {callerData &&
                  callerData.length > 0 &&
                  callerData.map(item => {
                    return (
                      <Option key={item.id} value={item.name}>
                        {item.name}
                      </Option>
                    );
                  })}
              </Select>
              <span style={{ marginRight: '10px' }}>关键字查询:</span>
              {searchKey.length > 0 &&
                searchKey.map(item => {
                  return (
                    <SearchValue
                      deleteSearch={this.deleteSearch}
                      changeSearchValue={this.changeSearchValue}
                      key={item.key}
                      index={item.key}
                    />
                  );
                })}
              <Button onClick={this.addSearchKey} className={styles.addBtn} icon="plus-square">
                添加条件
              </Button>

              <Radio.Group
                className={styles.fontStyle}
                onChange={this.onChangeRadio}
                defaultValue={this.state.condition}
              >
                <Radio value="and">并且</Radio>
                <Radio value="or">或者</Radio>
              </Radio.Group>
            </div>
          </div>
          <div className={styles.workList}>
            <div className={styles.orderTable}>
              {/* 表格 */}
              {this.renderTable()}
            </div>
            <div className={styles.listFooter}>
              <div className={styles.footerLeft}>
                <Checkbox
                  onChange={this.selectMultiple}
                  checked={orderList?.length > 0 && orderList?.length === selectedRowKeys?.length}
                  className={styles.checkBox}
                >
                  全选/取消全选
                </Checkbox>
                <span>已选择{selectedRowKeys.length}项</span>
                <div className={styles.exportBtns}>
                  <span className={styles.footerBtn}>excel导出</span>
                  <span className={styles.footerBtn}>word导出</span>
                  <span className={styles.footerBtn}>全部excel导出</span>
                </div>
              </div>
              <div className={styles.footerRight}>
                <span className={styles.footerSpace}>当前显示</span>
                <Select
                  className={styles.footerSpace}
                  style={{ width: '60px' }}
                  value={pageSize}
                  onChange={this.changePageSize}
                >
                  {pageTypeSize.map(item => {
                    return (
                      <Option key={item} value={item}>
                        {item}
                      </Option>
                    );
                  })}
                </Select>
                <span className={styles.footerSpace}>工单</span>
                <span
                  className={styles.toEndStart}
                  onClick={() => this.toStartAndEnd(true)}
                  style={{
                    color: firstPage === 'start' || pageSize >= all_data_num ? '#ccc' : '#333',
                  }}
                >
                  首页
                </span>
                <Pagination
                  pageSize={pageSize}
                  className={styles.footerSpace}
                  total={all_data_num}
                  itemRender={this.paginationRender}
                  onChange={this.changeList}
                  current={currentPage}
                  showLessItems
                />
                <span
                  className={styles.toEndStart}
                  onClick={() => this.toStartAndEnd(false)}
                  style={{
                    color: firstPage === 'end' || pageSize >= all_data_num ? '#ccc' : '#333',
                  }}
                >
                  尾页
                </span>
                <span>转到</span>
                <Input
                  ref={input => {
                    this.pageInput = input;
                  }}
                  style={{ width: '40px', height: '32px', margin: '0 4px' }}
                  onPressEnter={this.skipPage}
                />
                <span className={styles.footerSpace}>页</span>
                <span>
                  共{all_page_num}页/{all_data_num}条记录
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
WorkOrderDisposal.propTypes = {};
function mapStateToProps(state) {
  return {
    orderTotal: state.order.orderTotal,
    timeOutData: state.order.timeOutData,
    baseData: state.login.baseData,
    groupId: state.user.currentUser.group_id,
  };
}
export default connect(mapStateToProps)(WorkOrderDisposal);
