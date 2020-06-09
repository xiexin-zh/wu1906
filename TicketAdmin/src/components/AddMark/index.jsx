/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Modal, Input, message } from 'antd';
import styles from './index.less';

class AddMark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      tags: [],
    };
  }

  addClick = () => {
    this.setState({
      visible: true,
    });
  };

  // 保存标签
  saveTag = () => {
    const { tags } = this.state;
    const { value } = this.textInput.state;
    if (!value || value.trim().length === 0) {
      return message.error('请输入标记名称');
    }
    if (value.trim().length > 6) {
      return message.error('标签长度为1-6位');
    }

    let has = false;
    if (tags.length > 0) {
      tags.forEach(item => {
        if (item.name === value.trim()) {
          has = true;
          return false;
        }
      });
    }
    if (has) {
      message.error('已存在该标记');
      return false;
    }

    const arr = [];
    const obj = { name: value, show: false };
    arr.push(obj);

    const newArr = tags.concat(arr);

    this.setState({
      visible: false,
      tags: newArr,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  reduceTag = name => {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter(item => {
        return item.name !== name;
      }),
    });
  };

  clickTag = name => {
    const { tags } = this.state;
    this.setState({
      tags: tags.map(item => {
        if (item.name === name) {
          return {
            ...item,
            show: !item.show,
          };
        }
        return item;
      }),
    });
  };

  render() {
    const { tags } = this.state;
    return (
      <div className={styles.addMark}>
        {tags.length > 0 &&
          tags.map(item => {
            return (
              <div key={item.name} className={styles.mark}>
                <div onClick={() => this.clickTag(item.name)} className={styles.content}>
                  <span>{item.name}</span>
                  {item.show && <img src={require('@/assets/icon/mark.png')} alt="" />}
                </div>
                <Icon
                  onClick={() => this.reduceTag(item.name)}
                  className={styles.reduce}
                  type="minus-circle"
                />
              </div>
            );
          })}
        <Button onClick={this.addClick}>添加标记</Button>

        <Modal
          destroyOnClose
          title="添加标记"
          centered
          visible={this.state.visible}
          onOk={this.saveTag}
          onCancel={this.handleCancel}
        >
          <div>
            <Input
              placeholder="请输入标记名称"
              ref={input => {
                this.textInput = input;
              }}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

AddMark.propTypes = {};
function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(AddMark);
