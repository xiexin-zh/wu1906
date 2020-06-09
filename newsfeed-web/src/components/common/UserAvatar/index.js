import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { getUserDetail } from '../../../models/members/selectors';

// import styles from './UserAvatar.css';

class UserAvatar extends React.PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    disable: PropTypes.bool,
  };

  static defaultProps = {
    disable: false,
  };

  render() {
    const { userId, dispatch, disable, user = {}, ...options } = this.props;
    const { avatarUrl: src, indexSymbol = '#' } = user;
    const symbol = (indexSymbol || '').toUpperCase();
    if (disable) {
      return (
        <Avatar {...options} src={src}>
          {symbol}
        </Avatar>
      );
    }
    return (
      <Link to={`/user/${userId}`}>
        <Avatar {...options} src={src}>
          {symbol}
        </Avatar>
      </Link>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { userId } = ownProps;
  return {
    user: getUserDetail(state, userId),
  };
}

export default connect(mapStateToProps)(UserAvatar);
