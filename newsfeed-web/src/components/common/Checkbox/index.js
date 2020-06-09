import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.css';
/**
 *
 * @param {value, name, checked, onChange} props
 * value: checkbox表單的value值
 * name: checkbox表單的name值
 * checked: 是否選中
 * onChange: onChange事件綁定的處理函數
 */
const Chackbox = (props) => {
  const { name, value, checked, onChange, refDom } = props;
  const checkboxId = `checkbox_${name}_${value}`;
  return (
    <div className={styles.wrapper}>
      <input
        type="checkbox"
        value={value}
        name={name}
        checked={checked}
        onChange={onChange}
        id={checkboxId}
        className={styles.checkboxInput}
        ref={refDom}
      />
      <label htmlFor={checkboxId} className={styles.checkboxLabel}></label>
    </div>
  );
};

Chackbox.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};

export default Chackbox;
