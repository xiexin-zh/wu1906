import React from 'react';
import { Checkbox, Select, DatePicker, Input, Button, message } from 'antd';
import {
  getDeptLists,
  centerAssignTo2,
  centerAssignTo1,
  deptAssignTo,
} from '@/services/workOrderManagement';
import { getLoginGroup } from '@/utils/constance';
import router from 'umi/router';
import moment from 'moment';
import SelectBox from '../../components/SelectBox';

import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;

const dateFormat = 'YYYY/MM/DD HH时';

const getNumArr = (begin, end) => {
  const arr = [];
  // eslint-disable-next-line no-plusplus
  for (let i = begin; i <= end; i++) {
    arr.push(i);
  }
  return arr;
};

class OrderAssign extends React.Component {
  state = {
    showLeaderSelect: false,
    showDepartmentSelect: false,
    showOrganize: false,
    // showCoOrganiser: false,
    leaderList: [],
    department: [],
    organizer: [],
    responsibleDepartment: '',
    mainDepartment: '',
    selectLeaderList: [],
    departmentList: [],
    organizerList: [],
    dealWithDay: '',
    dealWithHour: '',
    selectPickerTime: moment(),
    confirmLeader: '',
    dispatchLeader: '',
    leaderHasAccessConfirm: false,
    leaderHasAccessDispatch: false,
  };

  isDepartment = getLoginGroup() === 'department';

  componentDidMount() {
    Promise.all([
      getDeptLists({ type: 2 }),
      getDeptLists({ type: 3 }),
      getDeptLists({ type: 4 }),
    ]).then(([leaderRes, departmentRes, organizerRes]) => {
      this.setLeaderList(leaderRes?.data || []);
      this.setDepartment(departmentRes?.data || []);
      this.setOrganizer(organizerRes?.data || []);
    });
  }

  get levelsList() {
    const { showLeaderSelect, showDepartmentSelect, showOrganize } = this.state;
    return [
      { name: '添加主管领导', val: showLeaderSelect, handle: this.setShowLeaderSelect },
      { name: '添加协办部门', val: showDepartmentSelect, handle: this.setShowDepartmentSelect },
      { name: '添加承办单位', val: showOrganize, handle: this.setShowOrganize },
      // { name: '添加协办单位', val: showCoOrganiser, handle: this.setShowCoOrganiser },
    ];
  }

  get departmentLevelsList() {
    return [this.levelsList[0], this.levelsList[3]];
  }

  getComputedType = () => {
    const {
      mainDepartment,
      selectLeaderList,
      responsibleDepartment,
      departmentList,
      organizerList,
    } = this.state;
    const typeCheckArr = [
      mainDepartment,
      selectLeaderList,
      responsibleDepartment,
      departmentList,
      organizerList,
    ];
    const otherIsEmpty = sendIndex =>
      typeCheckArr
        .filter((item, index) => index !== sendIndex)
        .every(item => !item || JSON.stringify(item) === '[]');
    const mapList = [
      {
        key: Boolean(departmentList.length !== 0 && otherIsEmpty(3)),
        val: 'err',
        tip: '请先选择主责部门',
      },
      {
        key: Boolean(organizerList.length !== 0 && otherIsEmpty(4)),
        val: 'err',
        tip: '请先选择主责单位',
      },
      {
        key: Boolean(mainDepartment && otherIsEmpty(0)),
        val: 0,
      },
      {
        key: Boolean(selectLeaderList[0] && otherIsEmpty(1)),
        val: 1,
      },
      {
        key: Boolean(responsibleDepartment && otherIsEmpty(2)),
        val: 2,
      },
      {
        key: Boolean(departmentList.length !== 0 && organizerList.length === 0),
        val: 3,
      },
      {
        key: Boolean(organizerList.length !== 0 && departmentList.length === 0),
        val: 4,
      },
    ];

    for (let i = 0; i < mapList.length; i += 1) {
      const item = mapList[i];
      if (item.key) {
        return item.val === 'err' ? item : item.val;
      }
    }
    return true;
  };

  setShowLeaderSelect = showLeaderSelect =>
    this.setState({ showLeaderSelect, selectLeaderList: [] });

  setShowDepartmentSelect = showDepartmentSelect =>
    this.setState({ showDepartmentSelect, departmentList: [] });

  setShowOrganize = showOrganize => this.setState({ showOrganize, responsibleDepartment: '' });

  // setShowCoOrganiser = showCoOrganiser => this.setState({ showCoOrganiser, organizerList: [] });

  setInputRef = ref => {
    this.input = ref;
  };

  setToInput = ref => {
    this.topInput = ref;
  };

  setLeaderList = leaderList => this.setState({ leaderList });

  setDepartment = department => this.setState({ department });

  setOrganizer = organizer => this.setState({ organizer });

  onSelectDepartment = val => {
    this.setState({
      mainDepartment: val,
    });
  };

  onSetResponsibleDepartment = val => {
    const { organizerList } = this.state;
    if (organizerList.includes(val)) {
      message.error('主责单位和协办单位不能为同一单位');
      return;
    }
    this.setState({
      responsibleDepartment: val,
    });
  };

  onSelectDay = val => {
    const { dealWithHour } = this.state;
    this.setState({
      dealWithDay: val,
      selectPickerTime: moment(new Date())
        .add('day', val)
        .add('hour', dealWithHour),
    });
  };

  onSelectHour = val => {
    const { dealWithDay } = this.state;
    this.setState({
      dealWithHour: val,
      selectPickerTime: moment(new Date())
        .add('day', dealWithDay)
        .add('hour', val),
    });
  };

  onSelectDatePicker = val =>
    this.setState({
      selectPickerTime: val,
    });

  onSetSelectLeaderList = val => {
    const { selectLeaderList } = this.state;
    const hasItem = selectLeaderList.find(item => item.id === val.id);
    if (hasItem) {
      this.setState({
        selectLeaderList: selectLeaderList.filter(item => item.id === val.id),
      });
    } else {
      const newList = [...selectLeaderList, val];
      this.setState({
        selectLeaderList: newList,
      });
    }
  };

  onSetDepartmentList = val => {
    const { departmentList } = this.state;
    const hasItem = departmentList.find(item => item.id === val.id);
    if (hasItem) {
      this.setState({
        departmentList: departmentList.filter(item => item.id === val.id),
      });
    } else {
      const newList = [...departmentList, val];
      this.setState({
        departmentList: newList,
      });
    }
  };

  onSetOrganizerList = val => {
    const { organizerList } = this.state;
    const hasItem = organizerList.find(item => item.id === val.id);
    if (hasItem) {
      this.setState({
        organizerList: organizerList.filter(item => item.id === val.id),
      });
    } else {
      const newList = [...organizerList, val];
      this.setState({
        organizerList: newList,
      });
    }
  };

  getAssistStr = onlyOrganizeList => {
    const { organizerList, departmentList } = this.state;
    const assistArr = onlyOrganizeList ? [...organizerList] : [...departmentList, ...organizerList];
    let assistStr = '';
    assistArr.forEach(item => {
      assistStr += `${item},`;
    });
    return assistStr;
  };

  onSubmit = () => {
    const {
      leaderHasAccessConfirm,
      leaderHasAccessDispatch,
      confirmLeader,
      dispatchLeader,
      mainDepartment,
      selectLeaderList,
      responsibleDepartment,
      organizerList,
      dealWithDay,
      dealWithHour,
      selectPickerTime,
    } = this.state;
    const { id } = this.props;
    const isLeaderSubmit = leaderHasAccessConfirm || leaderHasAccessDispatch;
    const computedLeaderId = confirmLeader || dispatchLeader;
    const getComputedTypeResult = this.getComputedType();
    if (typeof getComputedTypeResult === 'object') {
      message.error(getComputedTypeResult.tip);
      return;
    }
    if (this.isDepartment) {
      deptAssignTo({
        ticket_id: id,
        to_deptid: mainDepartment || selectLeaderList[0] || responsibleDepartment,
        type: organizerList.length !== 0 ? 1 : 0,
        assistDept: this.getAssistStr(true),
        process_txt: this.input?.state?.value || '',
        process_day: dealWithDay,
        process_hour: dealWithHour,
        process_endtime: Math.ceil(selectPickerTime.valueOf() / 1000),
      }).then(res => {
        if (res.state) {
          router.push('/WorkOrderManagement/WorkOrderDisposal/');
        }
      });
      return;
    }

    if (isLeaderSubmit) {
      if (!Number.isFinite(computedLeaderId)) {
        return;
      }
      const computedType = leaderHasAccessConfirm ? 0 : 1;
      centerAssignTo1({
        ticket_id: id,
        to_deptid: computedLeaderId,
        type: computedType,
      }).then(res => {
        if (res.state) {
          router.push('/WorkOrderManagement/WorkOrderDisposal/');
        }
      });
    } else {
      centerAssignTo2({
        ticket_id: id,
        to_deptid: mainDepartment || selectLeaderList[0] || responsibleDepartment,
        type: getComputedTypeResult,
        assistDept: this.getAssistStr(),
        process_txt: this.input?.state?.value || '',
        process_day: dealWithDay,
        process_hour: dealWithHour,
        process_endtime: Math.ceil(selectPickerTime.valueOf() / 1000),
      }).then(res => {
        if (res.state) {
          router.push('/WorkOrderManagement/WorkOrderDisposal/');
        }
      });
    }
  };

  renderLeaderList = (handle, val, condition) => (
    <Select className={styles.selectLeader} value={val} disabled={!condition} onChange={handle}>
      {this.state.leaderList.map(item => (
        <Option value={item.id} key={item.id}>
          {item.name}
        </Option>
      ))}
    </Select>
  );

  onSetLeaderHasAccessConfirm = e => {
    this.setState({
      leaderHasAccessConfirm: !e.target.value,
      confirmLeader: '',
    });
  };

  onSetLeaderHasAccessDispatch = e => {
    this.setState({
      leaderHasAccessDispatch: !e.target.value,
      dispatchLeader: '',
    });
  };

  onSelectConfirmLeader = val => {
    this.setState({
      // confirmLeader: this.state.leaderList.find(item=>((item||[]).id === val))['name']
      confirmLeader: val,
    });
  };

  onSelectDispatchLeader = val => {
    this.setState({
      // dispatchLeader: this.state.leaderList.find(item=>((item||[]).id === val))['name']
      dispatchLeader: val,
    });
  };

  render() {
    const {
      mainDepartment,
      department,
      showLeaderSelect,
      leaderList,
      showDepartmentSelect,
      showOrganize,
      responsibleDepartment,
      organizer,
      selectPickerTime,
      leaderHasAccessConfirm,
      leaderHasAccessDispatch,
      confirmLeader,
      dispatchLeader,
      departmentList,
      organizerList,
      selectLeaderList,
      // showCoOrganiser,
    } = this.state;
    const {
      orderDetails,
      orderDetails: { reject_reason },
    } = this.props;
    return (
      <div className={styles.orderAssign}>
        {this.isDepartment && (
          <div className={`${styles.fromItem} ${styles.bottomBorder}`}>
            <span className={styles.title}>处理意见：</span>
            <TextArea
              className={styles.textArea}
              value={orderDetails.process_txt}
              disabled
              maxLength={300}
              rows={4}
              ref={this.setToInput}
            />
          </div>
        )}
        {reject_reason && (
          <div className={`${styles.fromItem} ${styles.bottomBorder}`}>
            <span className={styles.title}>驳回原因：</span>
            <TextArea
              className={styles.textArea}
              value={reject_reason}
              disabled
              maxLength={300}
              rows={4}
            />
          </div>
        )}
        <div className={styles.assignTitle}>
          <span>选择承办单位</span>
          <div className={styles.checkBoxWrapper}>
            {(this.isDepartment ? this.departmentLevelsList : this.levelsList).map(item => {
              if (!item) {
                return null;
              }
              return <Checkbox onChange={() => item.handle(!item.val)}>{item.name}</Checkbox>;
            })}
          </div>
        </div>
        <div className={styles.selectBox}>
          {!this.isDepartment && (
            <div className={styles.fromItem}>
              <span className={styles.title}>主责部门：</span>
              <Select
                className={styles.selectInput}
                value={mainDepartment}
                onChange={this.onSelectDepartment}
              >
                {department.map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>
          )}
          {showLeaderSelect && (
            <div className={styles.fromItem}>
              <span className={styles.title}>主管领导：</span>
              <SelectBox
                data={leaderList}
                onlyOne={1}
                valData={selectLeaderList}
                getSelectData={this.onSetSelectLeaderList}
              />
            </div>
          )}
          {!this.isDepartment && showDepartmentSelect && (
            <div className={styles.fromItem}>
              <span className={styles.title}>协办部门：</span>
              <SelectBox
                data={department}
                getSelectData={this.onSetDepartmentList}
                valData={departmentList}
                compareData={mainDepartment}
                errTip="主责部门和协办部门不能为同一部门"
              />
            </div>
          )}
          {(showOrganize || this.isDepartment) && (
            <div className={styles.fromItem}>
              <span className={styles.title}>主责单位：</span>
              <Select
                className={styles.selectInput}
                value={responsibleDepartment}
                onChange={this.onSetResponsibleDepartment}
              >
                {organizer.map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>
          )}
          {(showOrganize || this.isDepartment) && (
            <div className={styles.fromItem}>
              <span className={styles.title}>协办单位：</span>
              <SelectBox
                data={organizer}
                getSelectData={this.onSetOrganizerList}
                errTip="主责单位和协办单位不能为同一单位"
                compareData={responsibleDepartment}
                valData={organizerList}
              />
            </div>
          )}
          <div className={styles.fromItem}>
            <span className={styles.title}>处理时限：</span>
            <div className={styles.selectTime}>
              <Select className={styles.selectInput1} onChange={this.onSelectDay}>
                {getNumArr(0, 365).map(item => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>
              <span>天</span>
              <Select className={styles.selectInput1} onChange={this.onSelectHour}>
                {getNumArr(0, 23).map(item => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>
              <span>小时</span>
            </div>
            <div className={styles.assignTime}>
              <span>承办单位截止日期：</span>
              <DatePicker
                disabled
                value={selectPickerTime}
                format={dateFormat}
                onChange={this.onSelectDatePicker}
              />
            </div>
          </div>
          <div className={styles.fromItem}>
            <span className={styles.title}>处理意见：</span>
            <TextArea className={styles.textArea} maxLength={300} rows={4} ref={this.setInputRef} />
          </div>
          {!this.isDepartment && (
            <div className={styles.leader}>
              <Checkbox
                value={leaderHasAccessConfirm}
                disabled={leaderHasAccessDispatch}
                onChange={this.onSetLeaderHasAccessConfirm}
              />
              <span className={styles.leaderTitle}>请领导批示</span>
              {this.renderLeaderList(
                this.onSelectConfirmLeader,
                confirmLeader,
                leaderHasAccessConfirm,
              )}
            </div>
          )}
          {!this.isDepartment && (
            <div className={styles.leader}>
              <Checkbox
                value={leaderHasAccessDispatch}
                disabled={leaderHasAccessConfirm}
                onChange={this.onSetLeaderHasAccessDispatch}
              />
              <span className={styles.leaderTitle}>请领导分派</span>
              {this.renderLeaderList(
                this.onSelectDispatchLeader,
                dispatchLeader,
                leaderHasAccessDispatch,
              )}
            </div>
          )}
          <div className={styles.saveForm}>
            <Button className={styles.submitForm} onClick={this.onSubmit}>
              提交
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderAssign;
