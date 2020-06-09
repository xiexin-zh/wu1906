import React from 'react';
import { Modal, Input, Select, message, Cascader } from 'antd';
import { connect } from 'dva';
import styles from './AddUser.less';
import { getAllUserGroups } from '@/services/RoleManagement';
import { getDepartmentLists } from '@/services/organizationStructure';
import { createAddUser, editUserInfo } from '@/services/userManagement';

const { Option } = Select;

class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        page_status: 0,
        status: 1,
        name: '',
      },
      lists: [],
      departmentGroupingLists: [],
      inputVal: {
        name: '',
        sex: '',
        phone: '',
        idno: '',
        email: '',
        user_group_id: '',
        status: 1,
        // group_id: '',
        department_id: '',
      },
    };
    this.modalTitle = {
      add: '添加用户',
      edit: '用户编辑',
    };
  }

  async componentDidMount() {
    const { editRecord, add_user_state } = this.props;
    if (add_user_state === 'edit') {
      this.setState({
        inputVal: {
          cascaderVal: [editRecord.department.pid, editRecord.department.id], // 部门/分组默认值
          group_id: editRecord.type,
          ...editRecord,
        },
      });
    }
    const { pagination } = this.state;
    await Promise.all([
      getAllUserGroups({ ...pagination }),
      getDepartmentLists({ dataType: 1 }),
    ]).then(([userGroupsRes, departmentListsRes]) => {
      this.getAllUserGroupsFun(userGroupsRes);
      this.getDepartmentListsFun(departmentListsRes);
    });
  }

  getAllUserGroupsFun = res => {
    if (!res.state) {
      message.error(res.message);
      return;
    }
    // message.success(res.message);
    const { data } = res;
    this.setState({
      lists: data,
    });
  };

  getDepartmentListsFun = res => {
    if (!res.state) {
      message.error(res.message);
      return;
    }
    // message.success(res.message);
    const { data } = res;
    const lists = data.map(item => {
      return {
        label: item.name,
        value: item.id,
        group_id: item.type,
        children: item.children.map(cItem => {
          return {
            label: cItem.name,
            value: cItem.id,
          };
        }),
      };
    });

    this.setState({
      departmentGroupingLists: lists,
    });
  };

  inputChange = e => {
    const { inputVal } = this.state;
    const key = e.target.getAttribute('data-key');
    const val = e.target.value;
    this.setState({
      inputVal: {
        ...inputVal,
        [key]: val,
      },
    });
  };

  onChangeGender = val => {
    const { inputVal } = this.state;
    this.setState({
      inputVal: {
        ...inputVal,
        sex: val,
      },
    });
  };

  onChangeRole = val => {
    const { inputVal } = this.state;
    this.setState({
      inputVal: {
        ...inputVal,
        user_group_id: val,
      },
    });
  };

  cascaderOnChange = (value, selectedOptions) => {
    const { inputVal } = this.state;
    this.setState({
      inputVal: {
        ...inputVal,
        group_id: selectedOptions[0].group_id,
        department_id: value[1],
      },
    });
  };

  onSubmitChange = () => {
    const { inputVal } = this.state;
    const { onModalVisible, getUserLists, add_user_state } = this.props;
    console.log(' 👂👂👂 --->>>', inputVal);
    const validataList = [
      {
        // eslint-disable-next-line no-useless-escape
        result: inputVal.name.length === 0,
        tip: '用户名不能为空',
      },
      {
        // eslint-disable-next-line no-useless-escape
        result: inputVal.user_group_id !== 0 && !inputVal.user_group_id,
        tip: '角色不能为空',
      },
      {
        // eslint-disable-next-line no-useless-escape
        result: inputVal.department_id !== 0 && !inputVal.department_id,
        tip: '部门不能为空',
      },
      {
        result: !/^1(3|4|5|6|7|8|9)\d{9}$/.test(inputVal.phone),
        tip: '请输入正确手机号',
      },
      {
        // eslint-disable-next-line no-useless-escape
        result: !/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(inputVal.email),
        tip: '请输入正确邮箱',
      },
    ];
    // eslint-disable-next-line no-restricted-syntax
    for (const i in validataList) {
      if (validataList[i].result) {
        message.error(validataList[i].tip);
        return;
      }
    }
    const request = {
      add: createAddUser,
      edit: editUserInfo,
    };
    request[add_user_state]({
      department_id: inputVal.department_id,
      email: inputVal.email,
      group_id: inputVal.group_id,
      idno: inputVal.idno,
      name: inputVal.name,
      phone: inputVal.phone,
      sex: inputVal.sex,
      status: inputVal.status,
      user_group_id: inputVal.user_group_id,
      user_id: inputVal.id,
    }).then(result => {
      if (!result.state) {
        message.error(result.message);
        return;
      }
      message.success(result.message);
      onModalVisible();
      getUserLists();
    });
  };

  render() {
    const { visible, onModalVisible, add_user_state } = this.props;
    const { lists, inputVal, departmentGroupingLists } = this.state;
    // 选择性别下拉默认值
    const selectSex = add_user_state === 'edit' ? inputVal.sex : undefined;
    // 选择角色下拉默认值
    const selectRole = add_user_state === 'edit' ? inputVal.user_group_id : undefined;
    return (
      <Modal
        title={this.modalTitle[add_user_state]}
        visible={visible}
        onOk={this.onSubmitChange}
        onCancel={onModalVisible}
        centered
        destroyOnClose
        okText="提交"
        cancelText="取消"
        // footer={null}
      >
        <>
          <div className={styles.addContentItem}>
            <span>用户名</span>
            <Input
              placeholder="请输入"
              className={styles.inputArea}
              onChange={this.inputChange}
              defaultValue={inputVal.name}
              data-key="name"
            />
          </div>
          <div className={styles.addContentItem}>
            <span>性别</span>
            <Select
              placeholder="请选择性别"
              className={styles.inputArea}
              onChange={this.onChangeGender}
              defaultValue={selectSex}
            >
              <Option value={1}>男</Option>
              <Option value={2}>女</Option>
            </Select>
          </div>
          <div className={styles.addContentItem}>
            <span>角色</span>
            <Select
              placeholder="请选择角色"
              className={styles.inputArea}
              onChange={this.onChangeRole}
              defaultValue={selectRole}
            >
              {lists.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className={styles.addContentItem}>
            <span>部门</span>
            <Cascader
              className={styles.inputArea}
              expandTrigger="hover"
              options={departmentGroupingLists}
              onChange={this.cascaderOnChange}
              defaultValue={inputVal.cascaderVal}
              allowClear={false}
              placeholder="请选择"
            />
          </div>
          <div className={styles.addContentItem}>
            <span>手机号</span>
            <Input
              placeholder="请输入"
              className={styles.inputArea}
              onChange={this.inputChange}
              defaultValue={inputVal.phone}
              data-key="phone"
            />
          </div>
          <div className={styles.addContentItem}>
            <span>工号</span>
            <Input
              placeholder="请输入"
              className={styles.inputArea}
              onChange={this.inputChange}
              defaultValue={inputVal.idno}
              data-key="idno"
            />
          </div>
          <div className={styles.addContentItem}>
            <span>邮箱</span>
            <Input
              defaultValue={inputVal.email}
              placeholder="请输入"
              className={styles.inputArea}
              onChange={this.inputChange}
              data-key="email"
            />
          </div>
        </>
      </Modal>
    );
  }
}

AddUser.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(AddUser);
