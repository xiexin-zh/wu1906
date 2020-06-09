import React, { Component } from 'react';
import { connect } from 'dva';
import { Select, Icon, Button, message } from 'antd';
import styles from './index.less';

const { Option } = Select;

class SelectBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selects: props.onlyOne !== 1 ? [1, 2, 3] : [1],
    };
  }

  onSelectItem = val => {
    const { compareData, errTip } = this.props;
    if (val === compareData && compareData) {
      message.error(errTip);
      return false;
    }
    this.props.getSelectData(val);
    return true;
  };

  onAddSelectItem = () =>
    this.setState(state => {
      const { selects } = state;
      return selects.length > 0
        ? {
            selects: [...selects, selects.length + 1],
          }
        : {
            selects,
          };
    });

  onReduceSelectItem = () =>
    this.setState(state => {
      const { selects } = state;
      if (selects.length > 1) {
        const newSelect = [...selects];
        newSelect.length = selects.length - 1;
        return {
          selects: newSelect,
        };
      }
      return {
        selects,
      };
    });

  render() {
    const { data, onlyOne, disabled, valData } = this.props;
    const { selects } = this.state;
    return (
      <div className={styles.selectBox}>
        {selects.map((item, index) => (
          <div key={item} className={styles.selects}>
            {index === 0 ? (
              <Select
                className={styles.selectItem}
                value={valData[0]}
                disabled={disabled}
                onChange={this.onSelectItem}
              >
                {data.map(innerItem => {
                  const { id, name } = innerItem;
                  return (
                    <Option key={id} value={innerItem.id}>
                      {name}
                    </Option>
                  );
                })}
              </Select>
            ) : (
              <Select
                className={styles.selectItem}
                disabled={disabled}
                onChange={this.onSelectItem}
              >
                {data.map(innerItem => {
                  const { id, name } = innerItem;
                  return (
                    <Option key={id} value={innerItem.id}>
                      {name}
                    </Option>
                  );
                })}
              </Select>
            )}
            {selects.length > 1 && onlyOne !== 1 && (
              <Icon
                type="minus-circle"
                style={{ color: 'red' }}
                onClick={this.onReduceSelectItem}
              />
            )}
          </div>
        ))}
        {onlyOne !== 1 && (
          <Button className={styles.addBtn} onClick={this.onAddSelectItem}>
            添加
          </Button>
        )}
      </div>
    );
  }
}

SelectBox.propTypes = {};
function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(SelectBox);
