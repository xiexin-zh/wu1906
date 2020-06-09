import React from 'react';
import styles from './index.scss';
import { connect } from 'dva';
import UserList from '../UserList';

class IntrestMember extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getInterestUser = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'search/getInterestUser',
      payload: {
        page: 1,
        rows: 20,
      },
    });
  };

  componentDidMount() {
    this.getInterestUser();
  }

  render() {
    const { interestUsers } = this.props;
    return (
      <div className={styles.interestUser}>
        <div className={styles.title}>
          <span className={styles.tip}>你可能感興趣的人</span>
        </div>
        <UserList userList={interestUsers.slice(0, 20)} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    interestUsers: state.search.interestUsers,
  };
}
export default connect(mapStateToProps)(IntrestMember);
