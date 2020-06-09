import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Button, Switch, message, Modal, Input } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { getAllUserGroups, deleteUserGroup, setUserGroupStatus } from '@/services/RoleManagement';
import AddRole from './AddRole.jsx';
import stylesGlobal from '../rightsManagementGlobal.less';

class RoleManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pagination: {
        page_status: 1,
        page_size: 10,
        status: 0,
        dataType: 1,
        name: '',
        total: 0,
      },
      lists: [],
      selectedRowKeys: [],
      addEditRoleState: false,
      add_edit_role_state: 'add',
      recordData: {},
    };
    this.columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '描述信息',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'operation',
        render: () => (
          <>
            <Button
              data-key="grant"
              style={{
                color: '#249FDE',
                border: '1px solid #249FDE',
                marginLeft: '5px',
              }}
            >
              授权
            </Button>
            <Button
              data-key="role"
              style={{
                color: '#249FDE',
                border: '1px solid #249FDE',
                marginLeft: '5px',
              }}
            >
              用户
            </Button>
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
    await this.getRolesList();
  }

  getRolesList = ({ page_num = 1 } = {}) => {
    const { pagination } = this.state;
    this.setState({
      loading: true,
    });
    getAllUserGroups({
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

  changeEdit = (record, checked) => {
    const { id } = record;
    setUserGroupStatus({
      user_group_id: id,
      status: checked ? 1 : 2,
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
        if (val === '') this.getRolesList();
      },
    );
  };

  tableClickEvent = (event, record) => {
    const currentClickState = event.target.getAttribute('data-key');
    const { id, name } = record;
    if (currentClickState === 'grant') {
      // eslint-disable-next-line no-console
      console.log(' 👌👌👌 --->>>', '授权');
    } else if (currentClickState === 'role') {
      // eslint-disable-next-line no-console
      console.log(' 👌👌👌 --->>>', '用户角色');
    } else if (currentClickState === 'edit') {
      this.setState({
        recordData: record,
        addEditRoleState: true,
        add_edit_role_state: 'edit',
      });
    } else if (currentClickState === 'delete') {
      Modal.confirm({
        // title: '删除',
        content: `是否确认删除 ${name} 角色？`,
        onOk: () => {
          deleteUserGroup({
            user_group_id: id,
          }).then(res => {
            if (!res.state) {
              message.error(res.message);
              return;
            }
            message.success(res.message);
            this.getRolesList();
          });
        },
        // onCancel() {
        //   // eslint-disable-next-line no-console
        //   console.log(' 👌👌👌 --->>>', '取消删除');
        // },
      });
    }
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys }, () => {
      // eslint-disable-next-line no-console
      console.log(' 👌👌👌 --->>>');
    });
  };

  // 添加角色
  addRoleClick = () => {
    this.setState({
      addEditRoleState: true,
      add_edit_role_state: 'add',
    });
  };

  onModalVisible = () => {
    this.setState({
      addEditRoleState: false,
    });
  };

  render() {
    const {
      selectedRowKeys,
      loading,
      lists,
      pagination,
      addEditRoleState,
      add_edit_role_state,
      recordData,
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
              <div style={{ color: 'rgba(36, 159, 222, 1)' }}>
                <img
                  src={require('../images/role.png')}
                  alt=""
                  style={{ verticalAlign: 'text-top', marginRight: '4px' }}
                />
                角色管理
              </div>
            }
          >
            <div className={stylesGlobal.searchBox}>
              <div className={stylesGlobal.searchLeft}>
                <Input placeholder="请根据角色名称搜索" onChange={this.secrchChange} />
                <Button
                  type="primary"
                  onClick={this.getRolesList}
                  style={{ background: 'rgba(36,159,222,1)' }}
                >
                  查询
                </Button>
              </div>
              <Button
                type="primary"
                onClick={this.addRoleClick}
                style={{ background: 'rgba(36,159,222,1)' }}
              >
                <PlusSquareOutlined />
                添加角色
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
        {addEditRoleState && (
          <AddRole
            add_edit_role_state={add_edit_role_state}
            onModalVisible={this.onModalVisible}
            visible={addEditRoleState}
            recordData={recordData}
            getRolesLists={this.getRolesList}
          />
        )}
      </>
    );
  }
}

RoleManagement.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(RoleManagement);
