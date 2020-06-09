import invariant from 'invariant';

const Base = (Super) =>
  class extends Super {
    constructor(values) {
      !(values['id'] || values.get('id')) && console.log(values);
      invariant(Boolean(values['id'] || values.get('id')), 'ID is required');
      super(values);
    }
  };

export default Base;
