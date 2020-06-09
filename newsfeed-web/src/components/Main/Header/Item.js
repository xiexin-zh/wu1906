import React from 'react';
// import { connect } from 'dva';
import classnames from 'classnames';
import styles from './Header.css';
// import { getCurrentUserId } from '../../../models/session/selectors';
// import { panels } from '../../../models/layout/constants';
import { Link } from 'dva/router';

const Item = (props) => {
  const { children, type, to, active } = props;
  const iconClassName = classnames({
    [styles.icon]: true,
    [styles[`${type}Active`]]: active,
    [styles[`${type}InActive`]]: !active,
  });
  const itemClassNames = classnames({
    [styles.sidePanelHeaderItem]: true,
    [styles.active]: active,
  });
  return (
    <li className={itemClassNames}>
      <Link to={to}>
        <i className={iconClassName} />
        {children}
      </Link>
    </li>
  );
};

export default Item;
