import React from 'react';
import { connect } from 'dva';
import { message, Modal } from 'antd';
import styles from './index.less';
import {
  getDepartmentLists,
  deleteDepartment,
  getDepartmentUserById,
} from '@/services/organizationStructure';
import StructureTree from './components/StructureTree'; // 一级 树形结构
import AddTreeSubclass from './components/AddTreeSubclass'; // 一级 树形结构
import ShareTable from '../../../../BasicDataManagement/components/ShareTable'; // 一级 树形结构

class OrganizationStructure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: {},
      loading: false,
      lists: [],
      departmentLists: [],
      addTreeVisible: false,
    };
    this.columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '部门',
        dataIndex: 'department',
        key: 'department',
        align: 'center',
      },
      {
        title: '手机',
        dataIndex: 'phone',
        key: 'phone',
        align: 'center',
      },
      {
        title: '工号',
        dataIndex: 'job',
        key: 'job',
        align: 'center',
      },
    ];
  }

  async componentDidMount() {
    await this.getDepartmentLists();
  }

  // 树形结构
  getDepartmentLists = () => {
    getDepartmentLists({ dataType: 1 }).then(results => {
      const { error_code, message: msg, data } = results;
      if (error_code !== 200) {
        message.warning(msg);
        return;
      }
      message.success(msg);
      this.setState(
        {
          selectedKeys: data[0],
          departmentLists: data,
        },
        () => {
          this.getDepartmentUserLists(this.state.selectedKeys.id);
        },
      );
    });
  };

  // 用户列表
  getDepartmentUserLists = departmentId => {
    this.setState({
      loading: true,
    });
    getDepartmentUserById({
      department_id: departmentId,
    }).then(res => {
      const { data, message: msg, error_code } = res;
      this.setState({
        loading: false,
      });
      if (error_code !== 200) {
        message.warning(msg);
        return;
      }
      // message.success(msg);
      this.setState({
        lists: data,
      });
    });
  };

  // 点击树节点触发
  onSelect = (selectedKeys, info) => {
    this.setState(
      {
        selectedKeys: info.node.props.dataRef,
      },
      () => {
        this.getDepartmentUserLists(this.state.selectedKeys.id);
      },
    );
  };

  onOperationTreeItem = (e, item) => {
    const type = e.target.getAttribute('data-type');
    if (type === 'deleteTreeP') {
      if (item.children) {
        message.warning('该组织下面有下级组织或人员，不能删除！');
        return;
      }
      Modal.confirm({
        content: `确认删除 ${item.name} 组织?`,
        onOk: () => {
          deleteDepartment({
            department_id: item.id,
          }).then(res => {
            const { error_code, message: msg } = res;
            if (error_code !== 200) {
              message.error(msg);
              return;
            }
            message.success(msg);
            this.cloneModal();
            this.getDepartmentLists();
          });
        },
      });
      return;
    }
    this.setState({
      addTreeVisible: true,
      operation: {
        type,
        item,
      },
    });
  };

  cloneModal = () => {
    this.setState({
      addTreeVisible: false,
    });
  };

  render() {
    const { loading, lists, selectedKeys, departmentLists, addTreeVisible, operation } = this.state;
    return (
      <div className={styles.OrganizationStructureBox}>
        <main className={styles.main}>
          <StructureTree
            treeData={departmentLists}
            selectedKeys={selectedKeys}
            onSelect={this.onSelect}
            onOperationTreeItem={this.onOperationTreeItem}
          />
          <div
            style={{
              width: '100%',
            }}
          >
            <header className={styles.header}>用户列表</header>
            <div
              style={{
                overflowY: 'auto',
                height: ' calc(100vh - 270px)',
              }}
            >
              <ShareTable
                loading={loading}
                columns={this.columns}
                lists={lists}
                rowSelection={false}
                tableClickEvent={this.tableClickEvent}
              />
            </div>
          </div>
          {addTreeVisible && (
            <AddTreeSubclass
              visible={addTreeVisible}
              operation={operation}
              cloneModal={this.cloneModal}
              refresh={this.getDepartmentLists}
            />
          )}
        </main>
      </div>
    );
  }
}

OrganizationStructure.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(OrganizationStructure);
