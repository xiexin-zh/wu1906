import React from 'react';
import { Checkbox, message } from 'antd';
import { cancelList } from '@/utils/constance';
import PropTypes from 'prop-types';
import styles from './index.less';

const CheckBoxList = ({ setCheckedData, data, isCancel, checkedData = [], disabled }) => {
  let levelOneData = [];
  let levelTwoData = [];
  const onChange = checkValue => {
    // setCheckedData([]);
    levelOneData = checkValue.filter(item => item.includes('0/'));
    levelTwoData = checkValue.filter(item => !item.includes('0/'));

    // const finalLevelOneData = levelOneData[levelOneData.length-1];
    // const finalLevelTwoData = levelTwoData[levelTwoData.length-1];
    const str = cancelList[isCancel ? 0 : 1];
    if (levelOneData.length > 1 || levelTwoData.length > 1) {
      message.error(`${str}类别或者子类别最多选择一项`);
      return;
    }
    // console.log(checkValue)
    setCheckedData(checkValue);
    // console.log([finalLevelOneData, finalLevelTwoData])
    // setCheckedData([finalLevelOneData, finalLevelTwoData]);
  };
  // const itemChange = e => e.preventDefault();

  // console.log(checkedData);
  return (
    <div className={styles.outBox}>
      {disabled && <div className={styles.mask} />}
      <Checkbox.Group
        onChange={onChange}
        defaultValue={checkedData}
        // value={checkedData}
        className={styles.checkBoxGroup}
      >
        {data.map(item => {
          const { children } = item;
          return (
            <>
              <div className={styles.checkBoxItem} key={item.value}>
                <Checkbox
                  className={styles.checkItem}
                  value={`${item.pid}/${item.id}`}
                  // onChange={itemChange}
                >
                  {item.name}
                </Checkbox>
              </div>
              {children && (
                <div className={`${styles.checkBoxItem} ${styles.leftMargin}`} key={item.value}>
                  {children.map(innerItem => {
                    return (
                      <Checkbox
                        className={styles.checkItem}
                        value={`${innerItem.pid}/${innerItem.id}`}
                        // onChange={itemChange}
                      >
                        {innerItem.name}
                      </Checkbox>
                    );
                  })}
                </div>
              )}
            </>
          );
        })}
      </Checkbox.Group>
    </div>
  );
};

CheckBoxList.defaultProps = {
  isCancel: true,
  disabled: false,
};

CheckBoxList.prototype = {
  setCheckedData: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  isCancel: PropTypes.bool,
  checkedData: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
};

export default CheckBoxList;
