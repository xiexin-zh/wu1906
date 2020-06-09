/* eslint-disable no-nested-ternary */
import React from 'react';
import { connect } from 'dva';
import {
  // CloudUploadOutlined,
  SearchOutlined,
  // PlusSquareOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { DatePicker, Input, Select, Button, Radio, message, Pagination, Checkbox } from 'antd';
import moment from 'moment';
import { formatDay, formatTime } from '@/utils/tools';
import styles from './WorkOrderAccount.css';
import SelectDay from '../WorkOrderDisposal/components/SelectDay';
import SearchValue from '../WorkOrderDisposal/components/SearchValue';

import Whole from './components/Whole'; // 全部工单
import Eliminate from './components/Eliminate'; // 剔除工单
import Register from './components/Register'; // 挂帐工单
import Enclosure from './components/Enclosure'; // 附件工单

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
class WorkOrderAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'whole',
      tabList: [
        {
          id: 'whole',
          tabName: '全部工单',
          count: 0,
          icon: require('@/assets/icon/work_new.png'),
          icon1: require('@/assets/icon/work_new1.png'),
        },
        {
          id: 'eliminate',
          tabName: '剔除工单',
          count: 0,
          icon: require('@/assets/icon/work_inhand.png'),
          icon1: require('@/assets/icon/work_inhand1.png'),
        },
        {
          id: 'register',
          tabName: '挂帐工单',
          count: 0,
          icon: require('@/assets/icon/work_stay.png'),
          icon1: require('@/assets/icon/work_stay1.png'),
        },
        {
          id: 'enclosure',
          tabName: '附件管理',
          count: 0,
          icon: require('@/assets/icon/work_finish.png'),
          icon1: require('@/assets/icon/work_finish1.png'),
        },
      ],
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
      // current_page_num: 1,
      // current_page_size: 10,
      firstPage: 'start',

      selectedRowKeys: [],
      create_time_type: 0,
      so_startime_type: 0,
      so_deadline_type: 0,
      create_time: moment(),
      so_startime1: new Date().getTime(),
      so_startime2: new Date(moment(new Date()).add(1, 'day')).getTime(),
      so_deadline1: new Date().getTime(),
      so_deadline2: new Date(moment(new Date()).add(1, 'day')).getTime(),
      searchKey: [], // 自定义搜索条件

      condition: '', // 高级搜索-条件1（and、or）
      h_source: '', // 高级搜索 工单来源
      h_task_type: '', // 高级搜索 工单类型
      h_caller: '', // 高级搜索 来电主体

      source: '', // 列表头搜索-工单来源
      task_type: '', // 列表头搜索-问题分类
      ticket_state: '', // 列表头搜索-工单状态
      office: '', // 列表头搜索-工单状态
      tag: '', // 列表头搜索-承办单位
    };
  }

  // 切换table
  renderTable = () => {
    const {
      activeTab,
      source,
      task_type,
      office,
      tag,
      ticket_state,
      orderList,
      selectedRowKeys,
    } = this.state;
    const filterData = { source, task_type, ticket_state, office, tag };
    const params = {
      orderList,
      filterData,
      selectedRowKeys,
      changeListSearch: this.changeListSearch,
      selectMultiple: this.selectMultiple,
      sendSelectAllHandle: this.onGetSelectAllHandle,
      onSelectToggle: this.onSelectToggle,
      closeListItemSearch: this.closeListItemSearch,
      getNewOrderList: this.getNewOrderList,
      resetListSearch: this.resetListSearch,
    };
    return (
      <>
        {
          {
            whole: <Whole {...params} />,
            eliminate: <Eliminate {...params} />,
            register: <Register {...params} />,
            enclosure: <Enclosure {...params} />,
          }[activeTab]
        }
      </>
    );
  };

  // 切换tab
  changeActiveTab = tabId => {
    this.setState({
      activeTab: tabId,
    });
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
    const time1 = new Date(
      moment(new Date())
        .subtract(day + 1, 'days')
        .format(dateFormat),
    ).getTime();
    const time2 = new Date(moment(new Date()).format(dateFormat)).getTime();

    this.setState({
      so_startime_type: day,
      so_startime1: time1,
      so_startime2: time2,
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

  // 选择截止时间
  chooseDeadlineDay = day => {
    const time1 = new Date(
      moment(new Date())
        .subtract(day + 1, 'days')
        .format(dateFormat),
    ).getTime();
    const time2 = new Date(moment(new Date()).format(dateFormat)).getTime();

    this.setState({
      so_deadline_type: day,
      so_deadline1: time1,
      so_deadline2: time2,
    });
  };

  // 获取时间选择器时间 - 截止时间
  getDeadline = (days, time) => {
    const now = moment(new Date());
    this.setState({
      so_deadline1: new Date(time[0]).getTime(),
      so_deadline2: new Date(time[1]).getTime(),
      so_deadline_type: Math.ceil(moment.duration(days[0].diff(now)).asDays()),
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
      h_caller: value,
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
      });
    }
    setTimeout(() => {
      this.getNewOrderList();
    }, 0);
  };

  // 改变搜索列表内容
  changeListSearch = (type, value) => {
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
      // this.getNewOrderList();
    }, 0);
  };

  // 重置搜索选项
  resetListSearch = () => {
    this.setState(
      {
        source: '',
        task_type: '',
        ticket_state: '',
        office: '',
        tag: '',
      },
      () => {
        // this.getNewOrderList();
      },
    );
  };

  onGetSelectAllHandle = (handle, totalLen) => {
    this.onSelectAllHandle = handle;
    this.totalLen = totalLen;
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
  changeList = page => {
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
    page = page || 1;
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
      h_source,
      h_task_type,
      h_caller,
    } = this.state;
    console.log(h_caller);

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

      h_source, // 高级搜索 工单来源
      h_task_type, // 高级搜索 工单类型
      // h_caller: '', // 高级搜索 来电主体

      h_ticket_state: '',
      h_value: searchValue, // 高级搜索自定义值
      h_condition: condition, // 高级搜索-条件1（and、or）

      t_source: source, // 列表头搜索-工单来源
      t_task_type: task_type, // 列表头搜索-问题分类
      t_ticket_state: '', // 列表头搜索-工单状态
    };
    const res = await dispatch({
      type: 'order/getNewOrderList',
      payload: {
        ...params,
      },
    });
    if (res && res.state) {
      const { all_data_num, all_page_num, current_page_num, list } = res.data;
      this.setState({
        orderList: list,
        all_data_num,
        all_page_num,
        // current_page_num,
        // current_page_size,
        currentPage: current_page_num,
      });
    } else {
      message.error('数据获取失败');
    }
  };

  // 初始化state
  initState = () => {
    this.setState(
      {
        orderList: [],
        all_data_num: 0,
        all_page_num: 0,
        // current_page_num: 1,
        // current_page_size: 10,
        firstPage: true,
        create_time_type: 0,
        so_startime_type: 0,
        selectedRowKeys: [],
        pageSize: 10,
        create_time: moment(new Date()),
        so_startime1: new Date().getTime(),
        so_startime2: new Date(moment(new Date()).add(1, 'day')).getTime(),
      },
      () => {
        this.getNewOrderList();
      },
    );
  };

  render() {
    const {
      activeTab,
      tabList,
      superSearch,
      days,
      create_time,
      so_startime1,
      so_startime2,
      so_deadline1,
      so_deadline2,
      create_time_type,
      so_startime_type,
      so_deadline_type,
      searchKey,
      orderList,
      selectedRowKeys,
      pageTypeSize,
      firstPage,
      all_data_num,
      currentPage,
      all_page_num,
    } = this.state;
    return (
      <div className={styles.WorkOrderAccountBox}>
        <div className={styles.statusTab}>
          <div className={styles.tabMenu}>
            <div className={styles.tabItems}>
              {tabList.map(item => {
                return (
                  <li
                    className={activeTab === item.id ? styles.activeTab : ''}
                    key={item.id}
                    onClick={() => this.changeActiveTab(item.id)}
                  >
                    <img src={activeTab === item.id ? item.icon1 : item.icon} alt="" />
                    <span>{item.tabName}</span>
                    {item.id !== 'enclosure' && <span>({item.count})</span>}
                  </li>
                );
              })}
            </div>
            <div className={styles.createWork}>
              <div className={styles.search_all}>
                <SearchOutlined />
                <input type="text" placeholder="工单/诉求人/电话/地点" />
              </div>
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
            <div className={styles.createTimeBox}>
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
              <div className={styles.createTime}>
                <span className={styles.timeTitle}>截止时间：</span>
                <SelectDay
                  days={days}
                  chooseDay={this.chooseDeadlineDay}
                  value={so_deadline_type}
                />
                <RangePicker
                  allowClear={false}
                  className={styles.rangePicker}
                  value={[
                    moment(formatDay(so_deadline1), dateFormat),
                    moment(formatDay(so_deadline2), dateFormat),
                  ]}
                  placeholder="请选择时间"
                  onChange={this.getDeadline}
                />
              </div>
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
                  this.setState({ superSearch: !superSearch });
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
              <Option value="12315">12315</Option>
              <Option value="基层上报">基层上报</Option>
              <Option value="网格">网格</Option>
              <Option value="预警">预警</Option>
            </Select>
            <Select
              className={styles.selectOption}
              style={{ width: '110px' }}
              onChange={this.handleChangeClass}
              placeholder="工单类型"
            >
              <Option value="2">工单类型</Option>
            </Select>
            <Select
              className={styles.selectOption}
              style={{ width: '110px' }}
              onChange={this.handleChangeCaller}
              placeholder="来电主体"
            >
              <Option value="2">来电主体</Option>
            </Select>
            <span style={{ marginRight: '10px', color: '#666' }}>关键字查询:</span>
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
          {/* 表格 */}
          <div className={styles.orderTable}>{this.renderTable()}</div>
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
                style={{ width: '70px' }}
                defaultValue={pageTypeSize[0]}
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
                  color: firstPage === 'start' ? '#ccc' : '#333',
                }}
              >
                首页
              </span>
              <Pagination
                className={styles.footerSpace}
                total={all_data_num}
                itemRender={this.paginationRender}
                onChange={this.changeList}
                current={currentPage}
              />
              <span
                className={styles.toEndStart}
                onClick={() => this.toStartAndEnd(false)}
                style={{
                  color: firstPage === 'end' ? '#ccc' : '#333',
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
    );
  }
}

WorkOrderAccount.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(WorkOrderAccount);
