import React from 'react';
import { Button, message, Modal, Collapse, Checkbox } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getAllRejectType, delBasicData } from '@/services/basicDataManagement';
import styles from './RejectCategory.less';
import AddDebarmentType from '../components/AddDebarmentType';

const { Panel } = Collapse;
class RejectCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      visible: false,
      category: 'reject',
    };
  }

  async componentDidMount() {
    await this.getAllRejectTypeLists();
  }

  getAllRejectTypeLists = () => {
    getAllRejectType().then(result => {
      const { error_code, message: msg, data } = result;
      if (error_code !== 200) {
        message.error(msg);
        return;
      }
      message.success(msg);
      this.setState({ lists: data });
    });
  };

  // 添加/编辑/删除
  tableClickEvent = (event, record = {}) => {
    event.stopPropagation();
    const currentClickState = event.target.getAttribute('data-key');
    const { category } = this.state;
    if (currentClickState === 'deleteC') {
      if (record.children) {
        message.warning('该类别下面包含子类别，不能删除！');
        return;
      }
      Modal.confirm({
        content: `是否确认删除 ${record.name} 类别?`,
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
            this.getAllRejectTypeLists();
          });
        },
      });
      return;
    }
    this.setState({
      visible: true,
      operation: {
        category,
        type: currentClickState,
        data: record,
      },
    });
  };

  cloneModal = () => {
    this.setState({
      visible: false,
    });
  };

  renderExtra = () => {
    return (
      <Button
        type="primary"
        onClick={event => this.tableClickEvent(event, { pid: 0 })}
        data-key="addP"
      >
        <PlusSquareOutlined />
        添加类别
      </Button>
    );
  };

  renderRightExtra = data => {
    const hasAddBtn = data.pid === 0;
    return (
      <div>
        {hasAddBtn && (
          <Button
            style={{
              color: 'rgba(36,159,222,1)',
              border: '1px solid rgba(36,159,222,1)',
              marginLeft: '5px',
            }}
            data-key="addC"
            onClick={event => this.tableClickEvent(event, data)}
          >
            添加子级
          </Button>
        )}
        <Button
          type="primary"
          data-key="edit"
          onClick={event => this.tableClickEvent(event, data)}
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
          data-key="deleteC"
          onClick={event => this.tableClickEvent(event, data)}
        >
          删除
        </Button>
      </div>
    );
  };

  renderPanelHeader = (list, index) => {
    return (
      <div className={styles.contentItem} title={`${index + 1}. ${list.name}`}>{`${index + 1}. ${
        list.name
      }`}</div>
    );
  };

  render() {
    const { lists, visible, operation } = this.state;

    return (
      <div className={styles.RejectCategoryBox}>
        <PageHeaderWrapper breadcrumb extra={this.renderExtra()}>
          <main>
            <Collapse expandIconPosition="left" bordered={false}>
              {lists.map((list, index) => {
                const { children } = list;
                return (
                  <Panel
                    showArrow={!!children}
                    header={this.renderPanelHeader(list, index)}
                    key={list.id}
                    extra={this.renderRightExtra(list)}
                  >
                    {children &&
                      children.map(item => {
                        return (
                          <div key={item.id} className={styles.childrenItem}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Checkbox
                                style={{
                                  marginRight: '8px',
                                }}
                              />
                              <div className={styles.contentItem} title={item.name}>
                                {item.name}
                              </div>
                            </div>
                            {this.renderRightExtra(item)}
                          </div>
                        );
                      })}
                  </Panel>
                );
              })}
            </Collapse>
          </main>
          {visible && (
            <AddDebarmentType
              visible={visible}
              cloneModal={this.cloneModal}
              operation={operation}
              refreshTable={this.getAllRejectTypeLists}
            />
          )}
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default RejectCategory;
