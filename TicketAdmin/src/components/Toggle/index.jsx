import React from 'react';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import styles from './index.less';

const Toggle = ({ Component, list, isUp, setIsUp, hoverItem, setHoverItem }) => {
  return (
    <>
      {list ? (
        <div className={styles.wrapper}>
          <div className={styles.box}>
            <Component />
            {isUp ? (
              <UpOutlined onClick={() => setIsUp(true)} />
            ) : (
              <DownOutlined onClick={() => setIsUp(false)} />
            )}
          </div>
          {!isUp && (
            <div className={styles.listBox}>
              {list.map(item => (
                <div
                  onClick={() => {
                    setHoverItem(item);
                    setIsUp(false);
                  }}
                  className={`${styles.listItem} ${item === hoverItem ? styles.hover : ''}`}
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Component />
      )}
    </>
  );
};

Toggle.prototype = {
  Component: PropTypes.element.isRequired,
  list: PropTypes.array.isRequired,
  isUp: PropTypes.bool.isRequired,
  setIsUp: PropTypes.func.isRequired,
  hoverItem: PropTypes.string.isRequired,
  setHoverItem: PropTypes.func.isRequired,
};

export default Toggle;
