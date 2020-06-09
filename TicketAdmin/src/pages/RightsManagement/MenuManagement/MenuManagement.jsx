import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Button, Switch, message, Modal, Input } from 'antd';
import { connect } from 'dva';
import { getMenuList, deleteMenu, setMenuStatus, editMenu } from '@/services/MenuManagement';
import stylesGlobal from '../rightsManagementGlobal.less';

// const { TextArea } = Input;

// const { Option } = Select;
class MenuManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      selectedRowKeys: [],
      visible: false,
      loading: false,
      pagination: {
        page_status: 1,
        page_size: 10,
        page_num: 1,
        status: 0,
        name: '',
        total: 0,
      },
      indexMenuData: {},
      // menuState: '否',
    };
    this.columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '菜单名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '上级菜单',
        dataIndex: 'level',
        key: 'level',
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'operation',
        render: data => (
          <>
            <Button
              type="primary"
              data-key="edit"
              style={{
                marginLeft: '5px',
                background: '#249FDE',
              }}
              onClick={() => {
                this.setState({
                  visible: true,
                  indexMenuData: data,
                });
              }}
            >
              编辑
            </Button>
            {/* <Button
              style={{
                color: 'red',
                border: '1px solid red',
                marginLeft: '5px',
              }}
              data-key="delete"
            >
              删除
            </Button> */}
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
    await this.getMenuLists();
  }

  getMenuLists = () => {
    const { pagination } = this.state;
    this.setState({
      loading: true,
    });
    getMenuList({
      ...pagination,
    }).then(res => {
      if (!res.state) {
        message.error(res.message);
        return;
      }
      message.success(res.message);
      const { list, all_data_num } = res.data;
      this.setState({
        lists: (list || []).filter(item => item.id !== 1),
        pagination: {
          ...pagination,
          total: all_data_num,
        },
        loading: false,
      });
    });
  };

  changeEdit = (record, checked) => {
    const { id } = record;
    setMenuStatus({
      menu_id: id,
      status: checked ? 1 : 2,
    }).then(res => {
      if (!res.state) {
        message.error(res.message);
        return;
      }
      this.props
        .dispatch({
          type: 'global/getMenuListHandle',
          payload: 0,
        })
        .then(() => {
          message.success(res.message);
        });
    });
  };

  secrchChange = e => {
    const val = e.target.value;
    const { pagination } = this.state;
    this.setState(
      {
        pagination: {
          ...pagination,
          page_num: val === '' ? 1 : pagination.page_num,
          name: val,
        },
      },
      () => {
        if (val === '') {
          this.getMenuLists();
        }
      },
    );
  };

  onTableChange = p => {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: {
          ...pagination,
          page_num: p.current,
        },
      },
      () => {
        this.getMenuLists();
      },
    );
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys }, () => {
      // eslint-disable-next-line no-console
      console.log(' 👌👌👌 --->>>', selectedRowKeys);
    });
  };

  tableClickEvent = (event, record) => {
    const currentClickState = event.target.getAttribute('data-key');
    const { id, name } = record;
    if (currentClickState === 'edit') {
      // eslint-disable-next-line no-console
      console.log(' 👌👌👌 --->>>', '编辑');
    } else if (currentClickState === 'delete') {
      Modal.confirm({
        // title: '删除',
        content: `是否确认删除 ${name} 菜单？`,
        onOk: () => {
          deleteMenu({
            menu_id: id,
          }).then(res => {
            if (!res.state) {
              message.error(res.message);
              return;
            }
            message.success(res.message);
          });
        },
        onCancel() {
          window.console.log(' 👌👌👌 --->>>', '取消删除');
        },
      });
    }
  };

  addMenuClick = () => {
    window.console.log(' 👌👌👌 --->>>', '添加菜单');
  };

  onModalVisible = () => this.setState({ visible: false });

  onSubmitChange = () => {
    const { indexMenuData } = this.state;
    editMenu({
      ...indexMenuData,
      menu_id: indexMenuData.id,
      name: this.menuNameRef.state.value,
      sort: 0,
      icon: '1',
    }).then(res => {
      if (res.state) {
        this.props
          .dispatch({
            type: 'global/getMenuListHandle',
            payload: 0,
          })
          .then(() => {
            this.onModalVisible();
            this.getMenuLists();
          });
      }
    });
  };

  setMenuNameRef = ref => {
    this.menuNameRef = ref;
  };

  // setMenuState = menuState =>{
  //   this.setState({
  //     menuState
  //   })
  // }

  render() {
    const { selectedRowKeys, loading, lists, pagination, visible, indexMenuData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const { name } = indexMenuData;
    return (
      <div className={stylesGlobal.managementBox}>
        <PageHeaderWrapper
          breadcrumb
          title="权限管理"
          content={
            <div style={{ color: 'rgba(36, 159, 222, 1)' }}>
              <img
                src={require('../images/menu.png')}
                alt=""
                style={{ verticalAlign: 'top', marginRight: '4px' }}
              />
              菜单管理
            </div>
          }
        >
          <div className={stylesGlobal.searchBox}>
            <div className={stylesGlobal.searchLeft}>
              <Input placeholder="请根据菜单名称搜索" onChange={this.secrchChange} />
              <Button
                type="primary"
                onClick={this.getMenuLists}
                style={{ background: 'rgba(36,159,222,1)' }}
              >
                查询
              </Button>
            </div>
            {/* <Button type="primary" onClick={this.addMenuClick}>
              添加菜单
            </Button> */}
          </div>
          <div className={stylesGlobal.tableBox}>
            <Table
              pagination={{
                current: pagination.page_num,
                pageSize: pagination.page_size,
                total: pagination.total,
              }}
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
        <Modal
          title="菜单编辑"
          visible={visible}
          onOk={this.onSubmitChange}
          onCancel={this.onModalVisible}
          centered
          destroyOnClose
          okText="提交"
          cancelText="取消"
        >
          <>
            <div className={stylesGlobal.flexBox}>
              <span className={stylesGlobal.menuName}>菜单名称</span>
              <Input placeholder="请输入" defaultValue={name} ref={this.setMenuNameRef} />
            </div>
            {/* <div className={stylesGlobal.flexBox}>
              <span className={stylesGlobal.menuName}>上级菜单</span>
              <Input placeholder="请输入" />
            </div>
            <div className={stylesGlobal.flexBox}>
              <span className={stylesGlobal.menuName}>菜单说明</span>
              <TextArea placeholder="请输入" />
            </div>
            <div className={stylesGlobal.flexBox}>
              <span className={stylesGlobal.menuName}>路由地址</span>
              <Input placeholder="请输入" />
            </div> */}
            {/* <div className={`${stylesGlobal.flexBox} ${stylesGlobal.noMargin}`}>
              <span className={stylesGlobal.menuName}>是否禁用</span>
              <Select
                defaultValue="否"
                onChange={this.setMenuState}
                style={{ width: 410, marginLeft: -10 }}
              >
                <Option value="是">是</Option>
                <Option value="否">否</Option>
              </Select>
            </div> */}
          </>
        </Modal>
      </div>
    );
  }
}

MenuManagement.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(MenuManagement);
