import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Button, Switch, message, Modal, Input } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import stylesGlobal from '../rightsManagementGlobal.less';
import { getUserList, deleteUser, setStatus, getGroupInfo } from '@/services/userManagement';
import AddUser from './AddUser.jsx';

class UserManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        name: '',
        status: 0,
        page_size: 10,
      },
      selectedRowKeys: [],
      lists: [],
      loading: false,
      showAddUser: false,
      add_edit_role: 'add',
      editRecord: {},
    };
    this.columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '用户名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '性别',
        dataIndex: 'sex_str',
        key: 'sex_str',
      },
      {
        title: '角色',
        dataIndex: 'user_group[name]',
        key: 'user_group[name]',
      },
      {
        title: '部门',
        dataIndex: 'department[name]',
        key: 'department[name]',
      },
      {
        title: '分组',
        dataIndex: 'type',
        key: 'type',
        render: text => <>{this.state.grouping.find(item => item.type === String(text))?.name}</>,
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '工号',
        dataIndex: 'idno',
        key: 'idno',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'operation',
        render: () => (
          <>
            <Button
              type="primary"
              data-key="edit"
              style={{
                marginLeft: '5px',
                background: '#249FDE',
              }}
            >
              编辑
            </Button>
            <Button
              style={{
                color: 'red',
                border: '1px solid red',
                marginLeft: '5px',
              }}
              data-key="delete"
            >
              删除
            </Button>
          </>
        ),
      },
      {
        title: '停用开关',
        dataIndex: '',
        key: 'deactivationSwitch',
        render: record => (
          <Switch
            defaultChecked={record.status === 1}
            onChange={checked => this.changeEdit(record, checked)}
          />
        ),
      },
    ];
  }

  async componentDidMount() {
    await this.getUserAdministrationList();
  }

  getUserAdministrationList = async ({ page_num = 1 } = {}) => {
    await getGroupInfo().then(r => {
      this.setState({
        grouping: r,
      });
    });
    const { pagination } = this.state;
    this.setState({ loading: true });
    getUserList({
      ...pagination,
      page_num,
    }).then(res => {
      if (!res.state) {
        message.error(res.message);
        return;
      }
      message.success(res.message);
      const { list, all_data_num } = res.data;
      this.setState({
        lists: list,
        pagination: {
          ...pagination,
          total: all_data_num,
        },
        loading: false,
      });
    });
  };

  onTableChange = pagination => {
    this.getRolesList({ page_num: pagination.current });
  };

  tableClickEvent = (event, record) => {
    const currentClickState = event.target.getAttribute('data-key');
    const { id, name } = record;
    if (currentClickState === 'edit') {
      this.setState({
        editRecord: record,
        add_edit_role: 'edit',
        showAddUser: true,
      });
    } else if (currentClickState === 'delete') {
      Modal.confirm({
        // title: '删除',
        content: `是否确认删除 ${name} 用户？`,
        onOk: () => {
          deleteUser({
            user_id: id,
          }).then(res => {
            if (!res.state) {
              message.error(res.message);
              return;
            }
            message.success(res.message);
            this.getUserAdministrationList();
          });
        },
        // onCancel() {
        //   console.log(' 👌👌👌 --->>>', '取消删除');
        // },
      });
    }
  };

  changeEdit = (record, checked) => {
    const { type, id } = record;
    setStatus({
      user_id: id,
      status: checked ? 1 : 2,
      user_type: type,
    }).then(res => {
      if (!res.state) {
        message.error(res.message);
        return;
      }
      message.success(res.message);
    });
  };

  secrchChange = e => {
    const val = e.target.value;
    const { pagination } = this.state;
    this.setState(
      {
        pagination: {
          ...pagination,
          name: val,
        },
      },
      () => {
        if (val === '') {
          this.getUserAdministrationList();
        }
      },
    );
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  addUserClick = () => {
    this.setState({
      add_edit_role: 'add',
      showAddUser: true,
    });
  };

  onModalVisible = () => {
    this.setState({
      showAddUser: false,
    });
  };

  render() {
    const {
      selectedRowKeys,
      lists,
      loading,
      pagination,
      showAddUser,
      add_edit_role,
      editRecord,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <>
        <div className={stylesGlobal.managementBox}>
          <PageHeaderWrapper
            breadcrumb
            title="权限管理"
            content={
              <div style={{ color: 'rgba(36,159,222,1)' }}>
                <img
                  src={require('../images/user.png')}
                  alt=""
                  style={{ verticalAlign: 'text-top', marginRight: '4px' }}
                />
                用户管理
              </div>
            }
          >
            <div className={stylesGlobal.searchBox}>
              <div className={stylesGlobal.searchLeft}>
                <Input placeholder="请根据用户名/手机号搜索" onChange={this.secrchChange} />
                <Button
                  type="primary"
                  onClick={this.getUserAdministrationList}
                  style={{ background: 'rgba(36,159,222,1)' }}
                >
                  查询
                </Button>
              </div>
              <Button
                type="primary"
                onClick={this.addUserClick}
                style={{ background: 'rgba(36,159,222,1)' }}
              >
                <PlusSquareOutlined />
                添加用户
              </Button>
            </div>
            <div className={stylesGlobal.tableBox}>
              <Table
                pagination={{ pageSize: pagination.page_size, total: pagination.total }}
                loading={loading}
                rowKey={row => row.id}
                rowSelection={rowSelection}
                columns={this.columns}
                dataSource={lists}
                onChange={this.onTableChange}
                onRow={record => {
                  return {
                    onClick: event => {
                      this.tableClickEvent(event, record);
                    }, // 点击行
                  };
                }}
              />
            </div>
          </PageHeaderWrapper>
        </div>
        {showAddUser && (
          <AddUser
            visible={showAddUser}
            onModalVisible={this.onModalVisible}
            add_user_state={add_edit_role}
            getUserLists={this.getUserAdministrationList}
            editRecord={editRecord}
          />
        )}
      </>
    );
  }
}

UserManagement.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(UserManagement);
