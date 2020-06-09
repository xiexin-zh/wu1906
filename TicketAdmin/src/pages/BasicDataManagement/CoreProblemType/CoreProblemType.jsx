import React from 'react';
import { connect } from 'dva';
import { Button, message, Modal } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProblemTypeTree from '../components/ProblemTypeTree'; // 一级 树形结构
import ShareTable from '../components/ShareTable'; // 二级 table
import publicStyle from '../publicStyle.less';
import { getChildrenById, delBasicData, getAllQuesType } from '@/services/basicDataManagement';
import BasicDataBackup from '../components/BasicDataBackup';
import AddCoreCityTree from '../components/AddCoreCityTree';

class CoreProblemType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: {},
      allCoreLists: [],
      selectedRowKeys: [],
      loading: false,
      lists: [],
      category: 'ques_type',
      visible: false,
      addTreeVisible: false,
    };
    this.columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        // align: 'center',
      },
      {
        title: '中心问题分类',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'operation',
        align: 'center',
        render: () => (
          <>
            <Button
              type="primary"
              data-key="edit"
              style={{
                marginLeft: '5px',
              }}
            >
              编辑
            </Button>
            <Button
              style={{
                color: '#FA6400',
                border: '1px solid #FA6400',
                marginLeft: '5px',
              }}
              data-key="delete"
            >
              删除
            </Button>
          </>
        ),
      },
    ];
  }

  async componentDidMount() {
    await this.getAllCoreTypeLists();
  }

  // 市级左侧 tree 数据
  getAllCoreTypeLists = () => {
    this.setState({
      loading: true,
    });
    getAllQuesType().then(res => {
      const { error_code, message: msg, data } = res;
      if (error_code !== 200) {
        message.warning(msg);
        return;
      }

      message.success(msg);
      this.setState(
        {
          selectedKeys: data[0],
          allCoreLists: data,
        },
        () => {
          this.getTicketOptionLists(this.state.selectedKeys.id);
        },
      );
    });
  };

  // 市级右侧 table 列表
  getTicketOptionLists = id => {
    this.setState({
      loading: true,
    });
    getChildrenById({
      id,
    }).then(result => {
      const { data, message: msg, error_code } = result;
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

  // 添加/编辑/删除
  tableClickEvent = (event, record = {}) => {
    const currentClickState = event.target.getAttribute('data-key');
    const { category, selectedKeys } = this.state;
    if (!currentClickState) {
      return;
    }
    if (currentClickState === 'delete') {
      Modal.confirm({
        content: `是否确认删除 ${record.name} 中心问题子类型?`,
        onOk: () => {
          delBasicData({
            id: record.id,
            category,
          }).then(res => {
            const { error_code, message: msg } = res;
            if (error_code !== 200) {
              message.error(msg);
              return;
            }
            message.success(msg);
            this.cloneModal();
            this.getAllCoreTypeLists();
          });
        },
      });
      return;
    }
    this.setState({
      visible: true,
      operation: {
        category,
        selectedKeys,
        type: currentClickState,
        data: record,
      },
    });
  };

  cloneModal = () => {
    this.setState({
      visible: false,
      addTreeVisible: false,
    });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  // 点击树节点触发
  onSelect = (selectedKeys, info) => {
    this.setState(
      {
        selectedKeys: info.node.props.dataRef,
      },
      () => {
        this.getTicketOptionLists(this.state.selectedKeys.id);
      },
    );
  };

  onOperationTreeItem = (e, item) => {
    const { category } = this.state;
    const type = e.target.getAttribute('data-type');
    if (type === 'deleteTreeP') {
      if (item.children) {
        message.warning('该类别包含有子类，不可以直接删除!');
        return;
      }
      Modal.confirm({
        content: `确认删除 ${item.name} 类别?`,
        onOk: () => {
          delBasicData({
            id: item.id,
            category,
          }).then(res => {
            const { error_code, message: msg } = res;
            if (error_code !== 200) {
              message.error(msg);
              return;
            }
            message.success(msg);
            this.cloneModal();
            this.getAllCoreTypeLists();
          });
        },
      });
      return;
    }
    this.setState({
      addTreeVisible: true,
      operation: {
        category,
        type,
        item,
      },
    });
  };

  render() {
    const {
      selectedRowKeys,
      loading,
      lists,
      visible,
      addTreeVisible,
      operation,
      selectedKeys,
      allCoreLists,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={publicStyle.pageContent}>
        <PageHeaderWrapper breadcrumb>
          <main className={publicStyle.problemTypeMain}>
            <ProblemTypeTree
              treeData={allCoreLists}
              selectedKeys={selectedKeys}
              onSelect={this.onSelect}
              onOperationTreeItem={this.onOperationTreeItem}
            />
            <div
              style={{
                width: '100%',
              }}
            >
              <header
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  width: '100%',
                  height: '56px',
                }}
              >
                <Button type="primary" onClick={this.tableClickEvent} data-key="add">
                  <PlusSquareOutlined />
                  添加子分类
                </Button>
              </header>
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
                  rowSelection={rowSelection}
                  tableClickEvent={this.tableClickEvent}
                />
              </div>
            </div>
          </main>
          {visible && (
            <BasicDataBackup
              visible={visible}
              cloneModal={this.cloneModal}
              operation={operation}
              refreshTable={this.getAllCoreTypeLists}
            />
          )}
          {addTreeVisible && (
            <AddCoreCityTree
              visible={addTreeVisible}
              operation={operation}
              cloneModal={this.cloneModal}
              refresh={this.getAllCoreTypeLists}
            />
          )}
        </PageHeaderWrapper>
      </div>
    );
  }
}

CoreProblemType.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(CoreProblemType);
