import React, { Component } from 'react';
import { Input } from 'antd';
class Rename extends Component {
  constructor() {
    super();
    this.state = {
      setValue: '',
    };
  }
  componentDidMount() {
    const { groupDetails } = this.props;
    this.setState({
      setValue: groupDetails.name,
    });
  }
  onChange = (e) => {
    this.setState({
      setValue: e.target.value,
    });
  };
  render() {
    const { setValue } = this.state;
    return (
      <div>
        <Input
          value={setValue}
          onChange={this.onChange}
          style={{ border: 0, borderRadius: 0 }}
        ></Input>
      </div>
    );
  }
}

export default Rename;
